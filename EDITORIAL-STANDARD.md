# Editorial standard — writing for the reader who is not a quant

**中文摘要**：这份文档是本站所有指南的写作标准。核心结论：我们的文章不是"太技术"，而是**没有把技术讲开**。参照 Keyrock 的同类长文，公式一样有，但他们先用大白话讲清楚"这个公式在干什么"，再把公式当作复述放出来，并逐个解释符号。我们则反过来——公式先行、术语不解释、还用 ASCII 字符画冒充图表。以下是量化的差距和强制执行的规则。

---

## 1. The measured gap

Audited on 2026-09-12 against `keyrock.com/knowledge-hub/guide-liquidity-pool-management/`, a competing long-form guide that ranks and also carries formulas.

| Signal | Our library (59 guides) | `what-is-a-liquidity-pool` | Keyrock guide | Target |
| :--- | ---: | ---: | ---: | ---: |
| Average sentence length (words) | 18.8 | 20.7 | 16.8 | ≤ 18 |
| Words of 12+ characters per 1,000 | 34.1 | 48.1 | 32.4 | ≤ 34 |
| "you / your" per 1,000 words | 6.9 | 6.4 | 8.9 | ≥ 8 |
| Average paragraph length (words) | 54.0 | 54.8 | 38.6 | ≤ 45 |
| ASCII-art blocks | 29 | 2 | 0 | 0 |
| Display formulas with a symbol glossary | 39% | 25% | 100% | 100% |

Raw counts behind the audit: 29 ASCII-art blocks across 14 guides, widest line 181 characters; 76 display formulas and 777 inline math spans across the library.

## 2. What actually went wrong

The competitor is not less technical than us. It is **better staged**. Six specific failures, in the order a reader hits them.

### 2.1 We open at maximum density

Our flagship opened with "a deterministic pricing engine executed by smart contracts" and reached "off-chain intent-based solver networks" in sentence two. A reader who searched *what is a liquidity pool* does not yet know what a pool is, so every one of those words is a wall.

Keyrock opens: *"Liquidity is the lifeblood of crypto… low liquidity means your trades are like moving a mountain with a teaspoon."* Concrete, second person, zero jargon. The technical material arrives in section four, after the reader has a mental model to hang it on.

### 2.2 The formula carries the meaning instead of restating it

This is the single biggest difference, and it is the reason a reader concludes "too much math."

Keyrock's pattern, every time:

1. Plain sentence saying what the rule does — *"the funds are priced by a formula that keeps the product of the two token quantities constant. This makes the price impact of a trade non-linear."*
2. The formula, on its own line — `x × y = k`
3. **"Where:"** and a bullet per symbol, in plain English.

A reader can delete step 2 and lose nothing. The formula is a *receipt*, not the explanation.

Our pattern was the inverse: the formula appeared first or alone, and the prose depended on it. 61% of our display formulas had no symbol glossary at all. The worst case was the StableSwap invariant — a nine-symbol expression with summation and product operators, dropped in with no gloss, explaining nothing to anyone who could not already derive it.

### 2.3 ASCII art instead of figures

Twenty-nine fenced blocks drew boxes with `+---+` and `|`. They fail four ways at once:

- **Mobile is broken.** Lines run to 181 characters, `shikiConfig.wrap` is `false`, and `.article-content pre` scrolls horizontally. On a phone the reader sees a fragment of a box.
- **It reads as terminal output**, so it signals "developer log" on a page selling editorial authority.
- **Screen readers get character soup**, and the content is invisible to image search.
- **We already have a figure pipeline.** `scripts/generate-guide-figures.py` renders real diagrams in the house palette. Using ASCII art is a regression against our own visual system.

Most of those blocks were never diagrams anyway. Six were misconception/reality lists, five were checklists, six were comparison data. All three are tables or lists wearing a costume.

### 2.4 Jargon is used before it is earned

"Adverse selection," "inventory decay," "transient storage," "flash accounting," "ERC-6909," "singleton," "the active tick" — each appears with no plain gloss on first use. Individually defensible; stacked, they read as gatekeeping.

### 2.5 Section titles describe the mechanism, not the reader's question

"Adverse Selection and Inventory Decay" is what the section contains. "Why your pool keeps selling the winner" is why the reader should read it. Keyrock uses "Understanding impermanent loss" — dull, but it matches the question in the reader's head, which is also the query in the search box.

### 2.6 Paragraphs are 55 words and never breathe

Keyrock runs 39. Short paragraphs are not dumbing down; they are pacing. They give the eye somewhere to rest between hard ideas, which is exactly what dense material needs most.

## 3. The rules

These are enforced by `pnpm content:audit` where a machine can check them.

### 3.1 The on-ramp — first 150 words

- Open with a concrete situation, a consequence, or a plain definition. Never with a category claim ("X is not a Y; it is a Z").
- No formula, no symbol, no code, no acronym that the guide has not spelled out.
- Address the reader as "you" at least once.
- One idea per sentence. Under 20 words each.
- Say what the reader will be able to decide by the end.

### 3.2 Every formula follows the three-beat pattern

**Beat 1 — plain English.** A sentence that a reader can act on without the formula. If you cannot write it, the formula does not belong in the guide.

**Beat 2 — the formula.** Display math for anything with a fraction, exponent, or more than three symbols. Inline for `x · y = k` scale.

**Beat 3 — "Where:" glossary.** One bullet per symbol, plain English, no nested notation. Then, when the formula has a shape worth feeling, one more sentence on what it means directionally: *"Because the denominator grows with your trade size, every extra token you buy costs more than the last one."*

Anything you cannot carry through all three beats gets cut or moved to the references. A formula nobody can read is decoration.

**Ceiling:** at most 4 display formulas per guide, and at most 1 per H2 section. Guides that are explicitly about a formula (`impermanent-loss-formula`, `constant-product-formula`, `bonding-curves-and-amm-invariants`) may go to 6.

### 3.3 No ASCII art, ever

Fenced blocks are for real code only, and must declare a language (`solidity`, `js`, `json`). Everything else becomes:

| Was | Becomes |
| :--- | :--- |
| Misconception / reality box | A two-column table: "What people assume" / "What actually happens" |
| Numbered checklist box | An H3 with a bullet or numbered list |
| Comparison box | A markdown table |
| Flow, architecture, lifecycle | A generated figure via `scripts/generate-guide-figures.py` |
| Payoff or price-impact curve | A generated figure |

### 3.4 Gloss hard terms at first use

On first appearance, a technical term gets a plain-language gloss in the same sentence — an em-dash clause, a parenthetical, or "which means." Second use onward is free.

Terms on the gloss list: adverse selection, arbitrageur, bonding curve, CFMM, concentrated liquidity, divergence loss, impermanent loss, invariant, LVR, loss-versus-rebalancing, MEV, sandwich attack, singleton, slippage, price impact, tick, TVL, transient storage, flash accounting, hooks, oracle, peg, depeg, basis point, ERC-6909, ERC-721, LP token, mempool, solver, intent.

### 3.5 Prose targets

- Average sentence length ≤ 18 words.
- No paragraph over 90 words; aim for 45.
- Words of 12+ characters: ≤ 34 per 1,000.
- "you / your": ≥ 8 per 1,000 words.
- Prefer the short word. *Use* over *utilise*, *sell* over *liquidate*, *pays* over *is remunerated*, *most trades* over *the preponderance of order flow*.

### 3.6 Headings answer questions

Write the H2 as the question the reader typed, or as the consequence they care about. Drop the numbering — the page has a table of contents.

| Weak | Strong |
| :--- | :--- |
| Automated Pricing Rules vs. Static Balance Vaults | How a pool decides a price |
| Adverse Selection and Inventory Decay | Why the pool keeps selling the winner |
| Executable Market Depth vs. Headline TVL | A big pool is not the same as a deep pool |
| Correlated Asset Pools and StableSwap Tail Risk | Why stablecoin pools feel safe until they aren't |

### 3.7 One worked example per hard idea

Every section that introduces a mechanism carries one example with real numbers a reader can follow end to end: the starting position, the event, the outcome. "A \$500,000 order can exhaust the active tick" is a claim. "You deposit \$10,000 into an ETH/USDC pool at \$3,000 and ETH moves to \$4,000; here is what you hold and what it is worth" is an explanation.

### 3.8 Everything from the previous standard still applies

Word floor of 1,300, `lastReviewed` date, 6+ sources with at least one research and one standards-body citation, 2+ internal links, an attributed figure, 3+ FAQ entries, a comparison table, no guaranteed-yield language. See `CONTENT-QUALITY.md` for the release history and `scripts/content-audit.mjs` for the machine-checked list.

## 4. Accuracy — what the September 2026 review found

A readable guide that is wrong is worse than a dense one that is right. A full review of all 59 guides on 2026-09-13 found errors that no readability gate could catch. Every one below was in production.

| What was wrong | Where | The rule it broke |
| :--- | :--- | :--- |
| Weighted-pool loss table wrong in 15 of 20 cells, and "an 80/20 pool sells a fifth as much" | Balancer, how to avoid IL | Numbers were written, not computed |
| LVR per unit of liquidity given as σ²/8 · L·√P. The correct form is σ²/4 · L·√P (σ²/8 of pool value) | Three guides | A formula was copied without derivation |
| "Loss-versus-rebalancing never reverses, unlike impermanent loss", and "after a round trip the pool is still behind holding" | Nine guides | A static pool's value depends only on price. Against holding, a round trip is level plus fees. LVR is a loss against a rebalancing benchmark, and equals expected IL for a trendless price |
| "Once a range converts, the loss stops growing" | Four guides | The shortfall against holding keeps growing as price moves past the edge |
| Worked examples that did not add up: a ±20% band on a 35% rally shown losing 1.6% (it loses ~10%), a 4% order showing a 1.96% cost, fee tables off by 10x, taper tables whose quoted rate fell when it arithmetically rose | Eight guides | Every example must be recomputed from its own stated inputs |
| Uniswap v4 positions described as ERC-6909 claims. They are NFTs from the position manager; ERC-6909 is for token balances | Four guides and two figures | Protocol facts were not checked against the source |
| Meteora shapes described backwards; bins below price said to hold the risky token | DLMM explained | Same |
| Two arXiv citations pointed to unrelated papers (a neural-network paper and a COVID study), and a BIS bulletin was cited under an invented title in 50 pages | Library-wide | Citation titles were written from memory |
| AI-generated figures with garbled labels and a wrong formula | Four guides | Figures with text must be generated from code |

### 4.1 Rules that follow

1. **Compute every number.** Any table, worked example or percentage is produced by running its inputs through the formula, in a script, before it is written. State the inputs in the prose so a reader can check it.
2. **Name the benchmark.** Every loss or gain says what it is measured against: holding, a rebalancing strategy, or cash. Never mix them in one sentence.
3. **Full range or band.** The σ²/8 shortcut is a yearly share of a *full-range* position. Any band multiplies it. Say which.
4. **Verify citations against the source's own metadata.** For arXiv, read the abstract page's `citation_title`. For DOIs, query Crossref. Never write a title from memory.
5. **Protocol facts come from the protocol.** Representation of positions, fee splits, tick spacing, callback counts and token sides of a range are checked against official docs or code.
6. **No text in AI images.** A figure that contains words, numbers or formulas is drawn by `scripts/generate-guide-figures.py`, where its content can be reviewed as code. Decorative images may stay text-free.
7. **Metadata tells the truth.** `readTime` is computed from the words before the reference list, at 220 words a minute. Titles stay within 70 characters and descriptions within 160.
8. **The word floor counts reading, not references.** 1,300 words before `## References`.

`scripts/content-audit.mjs` now enforces rules 7 and 8, internal link targets, citation numbering, duplicate references, and a regression list of the false claims above.

## 5. Rewriting an existing guide

1. Read the guide end to end and write down, in one sentence, the question it answers.
2. Rewrite the opening 150 words to the §3.1 rules.
3. Rename every H2 to §3.6.
4. For each formula: apply the three beats, or cut it. Count against the §3.2 ceiling.
5. Replace every ASCII block per §3.3. Where a figure is the right answer, add the render function to `scripts/generate-guide-figures.py` and regenerate.
6. Gloss the hard terms at first use.
7. Split every paragraph over 90 words.
8. Add the worked example if a section is missing one.
9. Recompute every number and verify every citation per §4.1.
10. Run `pnpm content:audit`, then `pnpm links:check`.
