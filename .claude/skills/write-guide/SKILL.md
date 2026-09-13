---
name: write-guide
description: Write or rewrite a LiquidityPools.app guide in src/content/articles. Use whenever creating a new guide, rewriting an existing one, fixing readability, replacing ASCII-art blocks with tables or figures, or making a formula-heavy section readable. Triggers on 写指南, 改文章, 优化文章, rewrite guide, new guide, 公式太多, ASCII, readability.
---

# Writing a LiquidityPools.app guide

Read `EDITORIAL-STANDARD.md` in the repo root before writing. It holds the rules,
the measured competitor benchmark, and the diagnosis behind each rule. This file is
the working procedure.

## The one thing that matters

The audience searched a beginner question. They are not quants. The site still
carries real math, because the math is what makes the site trustworthy — but the
math **restates** an explanation the reader already understood from plain English.
It never carries the explanation.

If a paragraph stops making sense when you delete the formula, the paragraph is
written backwards.

## Procedure

### 1. Fix the frame first

Write down the one question this guide answers. Every section either answers part of
it or gets cut. Then write the H2 list as the sub-questions a reader would ask, in
the order they would ask them. No numbered headings, no "X vs Y" mechanism titles.
See the rename table in `EDITORIAL-STANDARD.md` §3.6.

### 2. Write the on-ramp

First 150 words: a concrete situation or a plain definition, at least one "you",
no formula, no symbol, no unexpanded acronym, sentences under 20 words, and a line
saying what the reader will be able to decide by the end.

### 3. Handle every formula in three beats

```
Beat 1  A plain sentence the reader can act on without the formula.
Beat 2  The formula.
Beat 3  "Where:" + one bullet per symbol in plain English.
        Then one sentence on what the shape means directionally.
```

Cut any formula that cannot carry all three. Maximum 4 display formulas per guide,
1 per H2 section; 6 for guides whose subject *is* the formula.

Markdown shape to copy:

```markdown
A constant-product pool prices trades by keeping the two token balances multiplied
together at the same number. Buy more of one token and you must leave more of the
other behind, so each extra token costs a little more than the last.

$$
x \cdot y = k
$$

Where:

- $x$ is how much of the first token the pool holds.
- $y$ is how much of the second token it holds.
- $k$ is the number the pool keeps constant as it trades.

Nothing in that rule reserves a price. The pool simply refuses to let the product
fall, and the price you get falls out of how far your trade pushes the balances.
```

### 4. Never write ASCII art

Fenced blocks are for real code with a declared language. Convert:

- misconception box → two-column table, "What people assume" / "What actually happens"
- checklist box → H3 plus a bullet list
- comparison box → markdown table
- flow, architecture, lifecycle, payoff curve → a generated figure

To add a figure: write a `fig_<name>(d)` function in `scripts/generate-guide-figures.py`
using the existing `layout_rows`, `layout_cards`, `layout_bars`, `layout_steps`,
`layout_ledger`, `layout_curve` helpers, register it in the `FIGURES` dict, then run
`python3 scripts/generate-guide-figures.py <slug>`. Embed with the standard
`<figure class="article-figure">` markup including the illustration credit.

### 5. Gloss hard terms on first use

Same sentence, em-dash clause or parenthetical. The gloss list is in
`EDITORIAL-STANDARD.md` §3.4. Example: "arbitrageurs — traders who profit from the
gap between the pool's price and the wider market — keep buying until the gap closes."

### 6. One worked example per mechanism

Starting position, the event, the outcome, in real numbers the reader can follow.

### 7. Prose targets

Average sentence ≤ 18 words. No paragraph over 90 words, aim 45. Long words
(12+ characters) ≤ 34 per 1,000. "you/your" ≥ 8 per 1,000. Choose the short word.

### 8. Keep the existing floors

1,300+ body words, `lastReviewed`, 6+ sources with at least one research and one
standards-body citation, 2+ internal guide links, 5+ H2 sections, an attributed
figure, 3+ FAQ entries in frontmatter, a comparison table, worked numbers, no
guaranteed-yield language.

### 9. Get the facts right

Readable and wrong is the worst outcome. Before you finish, follow `EDITORIAL-STANDARD.md` §4.1:

- Recompute every table and worked example from its stated inputs with a script. Never type a number you did not calculate.
- Name the benchmark for every loss: holding, a rebalancing strategy, or cash.
- σ²/8 is a yearly share of a full-range position. A band multiplies it.
- A static pool is level with holding after a price round trip, plus fees. Do not claim otherwise.
- A range that has converted keeps falling behind holding as price moves further.
- Uniswap v4 positions are NFTs from the position manager. ERC-6909 is for token balances.
- Check every citation title against arXiv or Crossref metadata. Never write one from memory.
- Any figure with words or numbers is drawn by `scripts/generate-guide-figures.py`, never an AI image.

## Before you finish

```bash
pnpm content:audit     # hard gate, must pass
pnpm links:check       # cited sources must resolve
```

`content:audit` reports per-guide readability. Fix anything it flags rather than
arguing with it — the thresholds come from a measured competitor benchmark.

## Deployment

Never run `wrangler deploy` or any direct upload. Production ships only by pushing
to GitHub `main`; Cloudflare CI builds and releases. After deploy, `pnpm indexnow`.
