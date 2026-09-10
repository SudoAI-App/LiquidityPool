import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const articlesDir = join(root, 'src/content/articles');
const imagesDir = join(root, 'public/images/guides');
const requiredFields = ['title', 'description', 'category', 'date', 'lastReviewed', 'author', 'readTime', 'keywords'];
const prohibitedPhrases = ['in the ever-evolving world', 'revolutionary', 'game-changer', 'unlock the', 'delve into'];

const errors = [];
const rows = [];

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
  const words = (body.match(/\b[\w’'-]+\b/g) ?? []).length;
  const references = (body.match(/^\[\d+\]:\s+https?:\/\//gm) ?? []).length;
  const internalLinks = (body.match(/\]\(\/guides\//g) ?? []).length;
  const headings = (body.match(/^## /gm) ?? []).length;
  const hasFigure = body.includes('<figure class="article-figure">');
  const image = join(imagesDir, `${slug}.webp`);

  if (words < 1300) errors.push(`${slug}: only ${words} body words`);
  if (references < 3) errors.push(`${slug}: only ${references} cited sources`);
  if (internalLinks < 2) errors.push(`${slug}: only ${internalLinks} internal guide links`);
  if (headings < 5) errors.push(`${slug}: only ${headings} H2 sections`);
  if (!hasFigure) errors.push(`${slug}: missing attributed internal figure`);
  if (!body.includes('Original editorial illustration by LiquidityPools.app.')) errors.push(`${slug}: missing original illustration credit`);
  if (!existsSync(image)) errors.push(`${slug}: missing ${image}`);
  if (/^# /m.test(body)) errors.push(`${slug}: duplicate Markdown H1`);
  if (/pexels\.com|unsplash\.com/i.test(body)) errors.push(`${slug}: contains retired generic-stock visual attribution`);

  for (const phrase of prohibitedPhrases) {
    if (body.toLowerCase().includes(phrase)) errors.push(`${slug}: contains generic phrase “${phrase}”`);
  }

  rows.push({ slug, words, references, internalLinks, headings });
}

if (rows.length < 20) errors.push(`expected at least 20 article files, found ${rows.length}`);
if (errors.length) {
  console.error('CONTENT AUDIT FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const totals = rows.reduce((sum, row) => ({
  words: sum.words + row.words,
  references: sum.references + row.references,
  internalLinks: sum.internalLinks + row.internalLinks,
}), { words: 0, references: 0, internalLinks: 0 });

console.log(`CONTENT AUDIT PASSED — ${rows.length} guides, ${totals.words.toLocaleString()} words, ${totals.references} source definitions, ${totals.internalLinks} internal guide links.`);
