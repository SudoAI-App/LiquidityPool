import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const articlesDir = join(root, 'src/content/articles');
const imagesDir = join(root, 'public/images/guides');
const requiredFields = ['title', 'description', 'category', 'date', 'lastReviewed', 'author', 'readTime', 'keywords'];
const prohibitedPhrases = ['in the ever-evolving world', 'revolutionary', 'game-changer', 'unlock the', 'delve into'];
// Financial-claim language the keyword research flagged as damaging to an educational position.
// Sources that read as authoritative: research venues, standards bodies, public-sector analysis.
const academicDomains = /(arxiv\.org|doi\.org|academic\.oup\.com|web\.stanford\.edu|\.edu\/|nber\.org|ssrn\.com)/i;
const institutionalDomains = /(bis\.org|imf\.org|fsb\.org|oecd\.org|federalreserve\.gov|ecb\.europa\.eu|eips\.ethereum\.org|ethereum\.org)/i;
const prohibitedClaims = ['guaranteed apy', 'guaranteed yield', 'guaranteed return', 'guaranteed income', 'guaranteed profit', 'safe income', 'safe yield', 'best pool', 'best liquidity pool', 'highest apy', 'passive income machine'];

// --- Readability gates. Rationale, measured competitor benchmark and targets: EDITORIAL-STANDARD.md
const MAX_AVG_SENTENCE_WORDS = 19;
const MAX_PARAGRAPH_WORDS = 90;
const MAX_LONG_WORDS_PER_1K = 36; // words of 12+ characters
const MIN_SECOND_PERSON_PER_1K = 7; // "you / your / yours"
const ONRAMP_WORDS = 150;
const FORMULA_GLOSSARY_WINDOW = 420; // characters after a display formula that may carry the "Where:" list
// Guides whose subject is a formula may carry more display math than the rest of the library.
const FORMULA_HEAVY = new Set(['impermanent-loss-formula', 'constant-product-formula', 'bonding-curves-and-amm-invariants']);
const MAX_DISPLAY_FORMULAS = 4;
const MAX_DISPLAY_FORMULAS_HEAVY = 6;
// Fenced blocks may only hold real code, and must say which language.
const ALLOWED_CODE_LANGUAGES = new Set(['solidity', 'js', 'javascript', 'ts', 'typescript', 'json', 'bash', 'python', 'rust']);
// Terms that mean nothing to a reader who arrived from a beginner query. First use must carry a gloss.
const GLOSS_REQUIRED = [
  'adverse selection', 'loss-versus-rebalancing', 'LVR', 'singleton', 'transient storage',
  'flash accounting', 'ERC-6909', 'mempool', 'basis point', 'invariant', 'bonding curve',
  'CFMM', 'impermanent loss', 'divergence loss', 'slippage', 'price impact', 'MEV', 'arbitrageur',
];
// Metadata that search results truncate beyond these lengths.
const MAX_TITLE_CHARS = 70;
const MAX_DESCRIPTION_CHARS = 160;
const WORDS_PER_MINUTE = 220;
// Claims a review found to be mathematically false. Kept as a regression guard so they cannot return.
const KNOWN_FALSE_CLAIMS = [
  [/does not reverse when prices? comes? back/i, 'LVR framed as the reason a round trip leaves a pool behind holding'],
  [/never reverses/i, 'LVR described as "never reversing" against holding'],
  [/fifth as (much|eagerly)/i, 'an 80/20 pool does not rotate a fifth as much as a 50/50 pool'],
  [/stops growing (entirely|once|because you have fully converted)/i, 'a converted range position keeps falling behind holding'],
  [/two halves genuinely cost less/i, 'sequential halves into one untouched pool cost the same as one order'],
];
const guideSlugs = new Set(readdirSync(articlesDir).filter((file) => file.endsWith('.md')).map((file) => file.replace(/\.md$/, '')));
const toolSlugs = new Set(readdirSync(join(root, 'src/pages/tools')).filter((file) => file.endsWith('.astro') && file !== 'index.astro').map((file) => file.replace(/\.astro$/, '')));
const GLOSS_MARKERS = /(—|–| \(|, which |, that is|, meaning|i\.e\.|in other words|known as|refers to|the gap between|short for)/i;

const reportOnly = process.argv.includes('--report');
const errors = [];
const rows = [];

/** Strip a guide body down to the prose a reader actually reads. */
function prose(body) {
  let text = body.slice(0, body.indexOf('## References') === -1 ? undefined : body.indexOf('## References'));
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/<figure[\s\S]*?<\/figure>/g, '');
  text = text.replace(/\$\$[\s\S]*?\$\$/g, '');
  text = text.replace(/(?<!\\)\$(?!\d)[^$\n]*?(?<!\\)\$/g, '');
  text = text.replace(/^\|.*$/gm, '');
  text = text.replace(/^\[\d+\]:.*$/gm, '');
  text = text.replace(/^#{1,6} .*$/gm, '');
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  text = text.replace(/https?:\/\/\S+/g, '');
  return text;
}

function words(text) {
  return text.match(/\b[\w’'-]+\b/g) ?? [];
}

for (const file of readdirSync(articlesDir).filter((name) => name.endsWith('.md')).sort()) {
  const slug = file.replace(/\.md$/, '');
  const source = readFileSync(join(articlesDir, file), 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    errors.push(`${slug}: missing frontmatter`);
    continue;
  }

  for (const field of requiredFields) {
    if (!new RegExp(`^${field}:`, 'm').test(frontmatter[1])) errors.push(`${slug}: missing ${field}`);
  }

  const body = source.slice(frontmatter[0].length);
  const bodyWords = words(body).length;
  const references = (body.match(/^\[\d+\]:\s+https?:\/\//gm) ?? []).length;
  const referenceSection = body.slice(body.indexOf('## References'));
  const visibleReferences = (referenceSection.match(/^\d+\.\s+\[/gm) ?? []).length;
  const referenceUrls = [...referenceSection.matchAll(/^\[\d+\]:\s+(\S+)/gm)].map((match) => match[1]);
  const academicSources = referenceUrls.filter((url) => academicDomains.test(url)).length;
  const institutionalSources = referenceUrls.filter((url) => institutionalDomains.test(url)).length;
  const internalLinks = (body.match(/\]\(\/guides\//g) ?? []).length;
  const headings = (body.match(/^## /gm) ?? []).length;
  const hasFigure = body.includes('<figure class="article-figure">');
  const faqCount = (frontmatter[1].match(/^ {2}- q:/gm) ?? []).length;
  const hasNumbers = /\$[\d,]{3,}|\d+(\.\d+)?%/.test(body);
  const hasTable = /^\|.*\|$/m.test(body);
  const image = join(imagesDir, `${slug}.webp`);

  // The floor counts what a reader reads, not the reference list underneath it.
  const readingBody = body.indexOf('## References') === -1 ? body : body.slice(0, body.indexOf('## References'));
  const readingWords = words(readingBody.replace(/<[^>]+>/g, ' ')).length;
  if (readingWords < 1300) errors.push(`${slug}: only ${readingWords} words before the reference list (min 1,300)`);
  const stated = Number.parseInt(String(frontmatter[1].match(/^readTime:\s*"?(\d+)/m)?.[1] ?? '0'), 10);
  const expected = Math.max(1, Math.round(readingWords / WORDS_PER_MINUTE));
  if (Math.abs(stated - expected) > 1) errors.push(`${slug}: readTime says ${stated} min but the guide reads in about ${expected} (§3.8)`);
  const titleText = frontmatter[1].match(/^title:\s*"(.*)"$/m)?.[1] ?? '';
  const descriptionText = frontmatter[1].match(/^description:\s*"(.*)"$/m)?.[1] ?? '';
  if (titleText.length > MAX_TITLE_CHARS) errors.push(`${slug}: title is ${titleText.length} characters (max ${MAX_TITLE_CHARS})`);
  if (descriptionText.length > MAX_DESCRIPTION_CHARS) errors.push(`${slug}: description is ${descriptionText.length} characters (max ${MAX_DESCRIPTION_CHARS})`);
  for (const link of body.matchAll(/\]\((\/(guides|tools)\/([^/)]+)\/)\)/g)) {
    const [, href, kind, target] = link;
    const known = kind === 'guides' ? guideSlugs.has(target) : toolSlugs.has(target);
    if (!known) errors.push(`${slug}: internal link ${href} points to a page that does not exist`);
  }
  const definedRefs = new Set([...body.matchAll(/^\[(\d+)\]:/gm)].map((match) => match[1]));
  for (const cite of readingBody.matchAll(/\[(\d+)\](?![(:])/g)) {
    if (!definedRefs.has(cite[1])) errors.push(`${slug}: citation [${cite[1]}] has no matching reference`);
  }
  const refUrls = [...body.matchAll(/^\[\d+\]:\s+(\S+)/gm)].map((match) => match[1]);
  for (const url of new Set(refUrls)) {
    if (refUrls.filter((u) => u === url).length > 1) errors.push(`${slug}: reference ${url} is listed more than once`);
  }
  for (const [pattern, why] of KNOWN_FALSE_CLAIMS) {
    if (pattern.test(readingBody) || pattern.test(frontmatter[1])) errors.push(`${slug}: repeats a claim the review found false — ${why}`);
  }
  if (!body.includes('## References')) errors.push(`${slug}: missing a References section`);
  if (references < 5) errors.push(`${slug}: only ${references} cited sources (need 5+)`);
  if (visibleReferences !== references) errors.push(`${slug}: ${references} source definitions but ${visibleReferences} rendered in the reference list`);
  if (!academicSources) errors.push(`${slug}: no peer-reviewed or preprint research source`);
  if (!institutionalSources) errors.push(`${slug}: no standards body or public-sector source`);
  if (internalLinks < 2) errors.push(`${slug}: only ${internalLinks} internal guide links`);
  if (headings < 5) errors.push(`${slug}: only ${headings} H2 sections`);
  if (!hasFigure) errors.push(`${slug}: missing attributed internal figure`);
  if (!body.includes('Original editorial illustration by LiquidityPools.app.')) errors.push(`${slug}: missing original illustration credit`);
  if (!existsSync(image)) errors.push(`${slug}: missing ${image}`);
  if (/^# /m.test(body)) errors.push(`${slug}: duplicate Markdown H1`);
  if (/pexels\.com|unsplash\.com/i.test(body)) errors.push(`${slug}: contains retired generic-stock visual attribution`);

  if (faqCount < 3) errors.push(`${slug}: only ${faqCount} FAQ entries in frontmatter (need 3+ for question-intent coverage)`);
  if (!hasNumbers) errors.push(`${slug}: no worked numbers (currency or percentage figures) in the body`);
  if (!hasTable) errors.push(`${slug}: missing a comparison or data table`);

  for (const phrase of prohibitedPhrases) {
    if (body.toLowerCase().includes(phrase)) errors.push(`${slug}: contains generic phrase “${phrase}”`);
  }

  for (const claim of prohibitedClaims) {
    if (body.toLowerCase().includes(claim)) errors.push(`${slug}: contains unsupported financial claim “${claim}”`);
  }

  // --- EDITORIAL-STANDARD.md §3.3 — fenced blocks hold real code, never drawn boxes.
  for (const block of body.matchAll(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g)) {
    const [, language, content] = block;
    const drawn = content.includes('+---') || content.includes('--->') || (content.split('|').length > 8 && content.includes('---'));
    if (drawn) {
      errors.push(`${slug}: ASCII-art block in a code fence — convert to a table, a list, or a generated figure (§3.3)`);
    } else if (!ALLOWED_CODE_LANGUAGES.has(language)) {
      errors.push(`${slug}: code fence with no declared language — fenced blocks are for real code only (§3.3)`);
    }
    const widest = Math.max(...content.split('\n').map((line) => line.length));
    if (widest > 78) errors.push(`${slug}: code fence line of ${widest} characters overflows on mobile (max 78)`);
  }

  // --- §3.2 — every display formula is restated in plain English and its symbols are glossed.
  const displayFormulas = [...body.matchAll(/^\$\$\n([\s\S]*?)\n\$\$/gm)];
  const formulaCap = FORMULA_HEAVY.has(slug) ? MAX_DISPLAY_FORMULAS_HEAVY : MAX_DISPLAY_FORMULAS;
  if (displayFormulas.length > formulaCap) {
    errors.push(`${slug}: ${displayFormulas.length} display formulas (max ${formulaCap}) — cut the ones you cannot restate in plain English (§3.2)`);
  }
  for (const formula of displayFormulas) {
    const after = body.slice(formula.index + formula[0].length, formula.index + formula[0].length + FORMULA_GLOSSARY_WINDOW);
    if (!/^\s*(Where|Reading it|In that expression)\b/im.test(after.trimStart()) && !/\bWhere:/.test(after)) {
      const preview = formula[1].replace(/\s+/g, ' ').slice(0, 46);
      errors.push(`${slug}: formula “${preview}…” has no “Where:” symbol glossary after it (§3.2)`);
    }
  }

  // --- §3.1 — the on-ramp is plain language.
  const text = prose(body);
  const onramp = words(text).slice(0, ONRAMP_WORDS).join(' ');
  const rawOnramp = body.slice(0, body.indexOf('<figure') === -1 ? 1200 : body.indexOf('<figure'));
  if (/(?<!\\)\$(?!\d)/.test(rawOnramp)) errors.push(`${slug}: math notation inside the first ${ONRAMP_WORDS} words (§3.1)`);
  if (!/\byou(r|rs)?\b/i.test(onramp)) errors.push(`${slug}: the opening never addresses the reader as “you” (§3.1)`);

  // --- §3.4 — hard terms carry a gloss on first use.
  for (const term of GLOSS_REQUIRED) {
    const first = text.search(new RegExp(`\\b${term.replace(/[-]/g, '\\-')}\\b`, 'i'));
    if (first === -1) continue;
    const sentenceStart = Math.max(0, text.lastIndexOf('.', first) + 1);
    const sentenceEnd = text.indexOf('.', first + term.length);
    const sentence = text.slice(sentenceStart, sentenceEnd === -1 ? text.length : sentenceEnd + 1);
    if (!GLOSS_MARKERS.test(sentence)) {
      errors.push(`${slug}: “${term}” is used with no plain-language gloss on first use (§3.4)`);
    }
  }

  // --- §3.5 — prose targets.
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.split(/\s+/).length > 2);
  const avgSentence = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / (sentences.length || 1);
  // Each list item is its own block for pacing purposes, not part of one giant paragraph.
  const blocks = text.replace(/\n(?=(?:[-*]|\d+\.)\s)/g, '\n\n');
  const paragraphs = blocks.split(/\n\n+/).map((p) => p.trim()).filter((p) => words(p).length > 15);
  const longestParagraph = Math.max(0, ...paragraphs.map((p) => words(p).length));
  const proseWords = words(text);
  const longWords = proseWords.filter((w) => w.length >= 12).length;
  const longPer1k = (1000 * longWords) / (proseWords.length || 1);
  const secondPerson = (text.match(/\b(you|your|yours)\b/gi) ?? []).length;
  const youPer1k = (1000 * secondPerson) / (proseWords.length || 1);

  if (avgSentence > MAX_AVG_SENTENCE_WORDS) errors.push(`${slug}: average sentence is ${avgSentence.toFixed(1)} words (max ${MAX_AVG_SENTENCE_WORDS}) (§3.5)`);
  if (longestParagraph > MAX_PARAGRAPH_WORDS) errors.push(`${slug}: longest paragraph is ${longestParagraph} words (max ${MAX_PARAGRAPH_WORDS}) (§3.5)`);
  if (longPer1k > MAX_LONG_WORDS_PER_1K) errors.push(`${slug}: ${longPer1k.toFixed(1)} long words per 1,000 (max ${MAX_LONG_WORDS_PER_1K}) (§3.5)`);
  if (youPer1k < MIN_SECOND_PERSON_PER_1K) errors.push(`${slug}: only ${youPer1k.toFixed(1)} “you” per 1,000 words (min ${MIN_SECOND_PERSON_PER_1K}) (§3.5)`);

  // --- §3.6 — headings are questions, not numbered mechanism labels.
  for (const heading of body.match(/^## .*$/gm) ?? []) {
    if (/^## \d+\.\s/.test(heading)) errors.push(`${slug}: numbered heading “${heading.slice(3, 48)}” — write the reader's question instead (§3.6)`);
  }

  rows.push({
    slug, words: bodyWords, references, internalLinks, headings, faqCount, academicSources, institutionalSources,
    avgSentence, longestParagraph, longPer1k, youPer1k, formulas: displayFormulas.length,
  });
}

if (rows.length < 20) errors.push(`expected at least 20 article files, found ${rows.length}`);

if (reportOnly) {
  const pad = (value, width) => String(value).padStart(width);
  console.log('slug'.padEnd(42) + pad('words', 6) + pad('sent', 6) + pad('para', 6) + pad('long/1k', 9) + pad('you/1k', 8) + pad('math', 6));
  for (const row of [...rows].sort((a, b) => b.longPer1k - a.longPer1k)) {
    console.log(
      row.slug.padEnd(42) + pad(row.words, 6) + pad(row.avgSentence.toFixed(1), 6) + pad(row.longestParagraph, 6)
      + pad(row.longPer1k.toFixed(1), 9) + pad(row.youPer1k.toFixed(1), 8) + pad(row.formulas, 6),
    );
  }
  console.log(`\n${errors.length} finding(s). Run without --report to fail the build on them.`);
  process.exit(0);
}

if (errors.length) {
  console.error('CONTENT AUDIT FAILED');
  for (const error of errors) console.error(`- ${error}`);
  console.error(`\n${errors.length} finding(s). Rules and rationale: EDITORIAL-STANDARD.md`);
  process.exit(1);
}

const totals = rows.reduce((sum, row) => ({
  words: sum.words + row.words,
  references: sum.references + row.references,
  internalLinks: sum.internalLinks + row.internalLinks,
  faq: sum.faq + row.faqCount,
  academic: sum.academic + row.academicSources,
  institutional: sum.institutional + row.institutionalSources,
}), { words: 0, references: 0, internalLinks: 0, faq: 0, academic: 0, institutional: 0 });

const mean = (key) => rows.reduce((sum, row) => sum + row[key], 0) / rows.length;

console.log(`CONTENT AUDIT PASSED — ${rows.length} guides, ${totals.words.toLocaleString()} words, ${totals.references} cited sources (${totals.academic} research, ${totals.institutional} standards or public-sector), ${totals.internalLinks} internal guide links, ${totals.faq} FAQ entries.`);
console.log(`READABILITY — ${mean('avgSentence').toFixed(1)} words per sentence, ${mean('longPer1k').toFixed(1)} long words per 1,000, ${mean('youPer1k').toFixed(1)} “you” per 1,000, ${mean('formulas').toFixed(1)} display formulas per guide.`);
