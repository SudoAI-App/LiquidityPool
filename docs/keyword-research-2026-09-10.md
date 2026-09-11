# LiquidityPools.app Keyword Research Report

**Research date:** 2026-09-10  
**Market:** Worldwide English-language search  
**Site:** https://liquiditypools.app/  
**Current footprint:** 28 indexable URLs, including 24 guides  
**Site age:** launched 2026-09-09; ranking and Search Console data are not yet mature

## Executive conclusion

LiquidityPools.app already covers the main informational entities: liquidity pools, AMMs, impermanent loss, concentrated liquidity, LP tokens, fees, mining, and protocol mechanics. The largest opportunity is **not another round of broad definitions**. It is the layer between education and action:

1. **Calculators and simulators:** impermanent loss, LP fees, APR/APY, concentrated ranges, and LP-versus-HODL.
2. **Decision pages:** liquidity pools versus staking or yield farming; how to choose a pool; whether providing liquidity is profitable.
3. **Protocol task clusters:** Uniswap v3/v4, Meteora DLMM, Raydium CLMM, PancakeSwap v3, Curve, and Balancer.
4. **Risk-led practical queries:** out-of-range liquidity, fee income versus impermanent loss, depeg risk, pool lock checks, and pool evaluation.

The recommended 90-day sequence is:

> **Impermanent-loss calculator → liquidity-pool returns calculator → Uniswap v3 range/fee cluster → liquidity pool vs staking/yield farming → Meteora DLMM cluster → Raydium CLMM cluster.**

Broad head terms remain strategically important as pillars, but they are difficult SERPs dominated by Binance Academy, CoinGecko, Uniswap, Chainlink, Coinbase-style education sites, and security firms. They should be improved and internally linked, not duplicated.

## What was investigated

### Sources and tools

| Source | Evidence collected | Limitation |
|---|---|---|
| Live site crawl | 28 live URLs from two sitemap endpoints; all sampled pages returned 200 | Crawl is technical coverage, not ranking data |
| Repository content inventory | Titles, descriptions, slugs, and declared keyword themes for all 24 guides | Frontmatter keywords do not prove rankings |
| Google Autocomplete | 25 seed families expanded alphabetically; 838 raw seed-level suggestions, 657 relevant DeFi/AMM suggestions after obvious forex/ICT and non-English exclusions | Suggestions show real query formulation and sufficient demand to be suggested, not monthly volume |
| Live search-result research | Result types and competing domains for core, calculator, decision, and protocol queries | Result ordering can vary by location and personalization |
| Google Trends | Worldwide 12-month comparisons were attempted | Google returned HTTP 429; no Trends number or direction is claimed |
| SearchVolume.io | Public bulk-volume page and methodology inspected | The public page did not return term-level values through the available non-interactive interface |
| SE Ranking | Public volume checker, country support, and metric definitions inspected | No term-level lookup result was returned without browser interaction |
| SpyFu | Public keyword overview inspected | No usable term-level metrics were exposed in the fetched page |

No monthly-volume, CPC, or keyword-difficulty number in this report is invented. A paid-tool validation export is still needed before traffic forecasting. The companion CSV is formatted so it can be pasted into Google Keyword Planner, Ahrefs, Semrush, or SE Ranking.

### Search-demand evidence scale

- **Strong:** exact phrase and several close modifiers appeared in Google Autocomplete, and the SERP has dedicated task-specific pages or tools.
- **Medium:** exact or close phrase appeared in Autocomplete, with a clear SERP and user task.
- **Emerging:** protocol/entity modifiers appeared repeatedly, but demand is narrower or more volatile.
- **Editorial:** strategically useful for topical authority, but public demand evidence was weaker.

These labels are not substitutes for search volume.

## Current coverage and gaps

### What the site already covers well

| Existing pillar | Main query family | Action |
|---|---|---|
| `/guides/what-is-a-liquidity-pool/` | what is a liquidity pool, liquidity pool crypto, liquidity pools explained, how liquidity pools work | Keep one pillar; add plain-language sections and stronger links to tools and decisions |
| `/guides/automated-market-maker-explained/` | automated market maker, AMM crypto, AMM explained, AMM formula | Keep one pillar; avoid a second “AMM meaning” page |
| `/guides/impermanent-loss-explained/` | impermanent loss, meaning, formula, example, graph, liquidity pool loss | Expand around simple examples and link to a dedicated calculator |
| `/guides/concentrated-liquidity-explained/` | concentrated liquidity, concentrated liquidity AMM, Uniswap v3 liquidity | Use as concept pillar; create separate task pages only for calculator/strategy intent |
| `/guides/how-to-provide-liquidity/` | how to provide liquidity, liquidity provider guide | Keep protocol-neutral; protocol-specific workflows should be separate pages |
| `/guides/liquidity-provider-fees/` | LP fees, liquidity pool APR, fee tiers | Expand “fees versus IL” and link to returns calculator |
| `/guides/liquidity-mining-explained/` | liquidity mining, meaning, rewards, risks | Add “liquidity mining vs yield farming vs staking” comparison or a dedicated comparison page |
| `/guides/discretized-liquidity-dlmm-explained/` | DLMM, Meteora DLMM, bin step | Strong emerging base; add task-specific Meteora strategy and calculator pages |

### High-value gaps

| Gap | Demand evidence | Why it matters |
|---|---|---|
| Impermanent loss calculator | Strong; calculator, v3, concentrated, range, APY, Uniswap, Orca, and CLMM modifiers recur | Tool intent is clearer and less interchangeable than another explainer |
| Liquidity pool calculator | Strong; profit, fees, APY, APR, earnings, price range, Solana, Uniswap modifiers recur | Captures users evaluating a position before depositing |
| Uniswap v3 fee/range calculator | Strong | Searchers need a range and return decision, not a protocol history lesson |
| Liquidity pool vs staking | Strong | Clear comparison intent; current site does not own it |
| Liquidity mining vs yield farming | Strong | Fits existing mining page and can capture comparison snippets |
| Best liquidity pools / pairs | Strong but high-risk | Valuable, but requires fresh on-chain data, methodology, dates, and no unsupported “best” claims |
| Meteora DLMM strategy/calculator | Emerging-strong; 60 seed-level suggestions in the collected set | Official docs dominate technical terms, but independent risk/strategy analysis is thin |
| Raydium CLMM guide/calculator | Emerging; 18 seed-level suggestions | Solana LP task demand is explicit and separate from Ethereum/Uniswap intent |
| LP position tracker / pool screener | Medium | Useful recurring tool intent, but requires real on-chain data and maintenance |
| Pool lock checker / rug-pull checks | Medium | Strong safety intent, but must be technically precise and avoid implying that locked liquidity proves safety |

## Priority keyword clusters

### Priority 0: build first

#### 1. Impermanent loss calculator

**Primary:** `impermanent loss calculator`  
**Secondary:** `impermanent loss calculator crypto`, `impermanent loss calculator uniswap`, `impermanent loss calculator v3`, `impermanent loss calculator concentrated liquidity`, `impermanent loss calculator with range`, `impermanent loss calculator with apy`, `LP vs HODL calculator`

**Recommended URL:** `/tools/impermanent-loss-calculator/`

**SERP requirement:** interactive result plus a concise formula, worked example, reciprocal-price behavior, assumptions, and model selector. A basic 50/50 calculator can launch first, but it must clearly say that full-range constant product results do not model concentrated positions. Later add weighted pools and bounded ranges.

**Why first:** Google Autocomplete shows a dense calculator modifier family. Current results include DailyDeFi, CoinGecko, STON.fi, Calculator Academy, and product-led tools. Searchers expect an answer they can compute, not only prose.

#### 2. Liquidity pool returns calculator

**Primary:** `liquidity pool calculator`  
**Secondary:** `liquidity pool profit calculator`, `liquidity pool fee calculator`, `liquidity pool APY calculator`, `liquidity pool APR calculator`, `liquidity pool earnings calculator`, `liquidity pool returns`, `liquidity pool daily yield`, `liquidity pool price range calculator`

**Recommended URL:** `/tools/liquidity-pool-calculator/`

**Required output:** fee income, incentive income, gas/rebalance costs, estimated IL, net LP value, HODL benchmark, APR and APY, assumptions, and scenario ranges. Do not present a single projected return as certain.

#### 3. Uniswap v3 range and fee calculator

**Primary:** `Uniswap v3 liquidity calculator`  
**Secondary:** `Uniswap v3 fee calculator`, `Uniswap liquidity pool calculator`, `Uniswap v3 impermanent loss calculator`, `concentrated liquidity calculator`, `concentrated liquidity impermanent loss calculator`, `Uniswap v3 price range calculator`

**Recommended URL:** `/tools/uniswap-v3-liquidity-calculator/`

**SERP requirement:** inputs for token prices, lower/upper bounds, deposit value, fee tier, and time window; outputs for token composition, active/inactive state, estimated fees, IL, and HODL comparison. Metrix/Poolfish-style tools establish the expected task depth.

### Priority 1: publish or refocus next

| Cluster | Primary keyword | Recommended page | Intent | Demand |
|---|---|---|---|---|
| LP profitability | is providing liquidity profitable | `/guides/is-providing-liquidity-profitable/` | Decision | Medium-strong |
| Returns model | liquidity pool returns | Same profitability page or calculator guide | Decision | Medium |
| Comparison | liquidity pool vs staking | `/guides/liquidity-pool-vs-staking/` | Comparison | Strong |
| Comparison | liquidity mining vs yield farming | `/guides/liquidity-mining-vs-yield-farming/` | Comparison | Strong |
| Comparison | yield farming vs liquidity pool | Same comparison page, not a duplicate | Comparison | Strong |
| Pool selection | how to choose a liquidity pool | Expand `/guides/how-to-evaluate-a-liquidity-pool/` | Decision | Medium |
| Uniswap task | how to provide liquidity on Uniswap | `/guides/how-to-provide-liquidity-on-uniswap/` | How-to | Strong |
| Uniswap strategy | Uniswap v3 liquidity strategy | `/guides/uniswap-v3-liquidity-strategy/` | Strategy | Strong |
| Range state | Uniswap v3 liquidity out of range | Same Uniswap strategy page | Troubleshooting | Medium-strong |
| Fee decision | Uniswap v3 fee tiers | Same Uniswap strategy page or focused guide if depth warrants | Decision | Medium |
| IL mitigation | how to reduce impermanent loss | Expand IL pillar; only split if Search Console later shows distinct demand | How-to | Medium-strong |
| Stable pools | best stablecoin liquidity pools | Data-led `/research/stablecoin-liquidity-pools/` only when regularly updated | Investigation | Strong, difficult |

### Priority 2: protocol authority

#### Meteora / Solana

Create a mini-cluster around the existing DLMM explainer:

- `Meteora DLMM strategy`
- `Meteora DLMM calculator`
- `Meteora DLMM fees`
- `Meteora DLMM bin step`
- `Meteora DLMM impermanent loss`
- `how to provide liquidity on Meteora`
- `Meteora DLMM vs DAMM`
- `Meteora DLMM rebalance`

Recommended pages:

1. `/guides/meteora-dlmm-strategy/`
2. `/tools/meteora-dlmm-calculator/`
3. Add fees, bins, IL, and rebalance sections to those two pages before creating more URLs.

#### Raydium / Solana

- `Raydium liquidity pool`
- `how to provide liquidity on Raydium`
- `Raydium CLMM explained`
- `Raydium liquidity pool calculator`
- `Raydium liquidity pool fees`
- `Raydium liquidity pool rewards`

Recommended pages:

1. `/guides/raydium-clmm-liquidity-guide/`
2. Model Raydium in a shared concentrated-liquidity calculator rather than launching a shallow duplicate calculator.

#### PancakeSwap, Curve, and Balancer

| Protocol | Query set | Recommendation |
|---|---|---|
| PancakeSwap | PancakeSwap liquidity pool, v3 liquidity, calculator, how to provide liquidity | One v3 LP guide; calculator can reuse concentrated-liquidity engine |
| Curve | Curve liquidity pool, Curve Finance liquidity pool, StableSwap, depeg risk, TriCrypto | Add a broader Curve pool architecture page; keep existing Curve v2 article technical |
| Balancer | Balancer pool, weighted pool calculator, 80/20 pool, weighted impermanent loss | Add weighted-pool calculator mode and link from existing article |

### Priority 3: research and authority, not immediate traffic

These topics fit the publication but should follow the task-led pages:

- loss-versus-rebalancing (LVR) calculator and datasets
- JIT liquidity and LP fee dilution
- liquidity pool rebalancing strategies
- delta-neutral liquidity provision
- automated liquidity management vaults
- active depth versus TVL
- AMM arbitrage and toxic order flow
- Uniswap v4 hook risk and dynamic-fee hooks
- cross-chain liquidity fragmentation metrics

They can earn citations and links, but their audience is narrower than calculator and comparison queries.

## Keywords to avoid or qualify

### Ambiguous “liquidity pool” traffic

Autocomplete strongly mixes DeFi intent with forex/ICT terms such as `liquidity pools in trading`, `liquidity pool forex`, `liquidity sweep`, `liquidity heatmap`, and `ICT liquidity pools`. These users are usually asking about price zones and stop liquidity, not AMM reserves. Do not target these phrases on DeFi pages. If clarification is needed, publish one contrast page only after Search Console shows meaningful impressions.

### “Best” and “highest APY” pages

Queries such as `best liquidity pools`, `best liquidity pools to invest in`, and `liquidity pools with highest APY` have demand, but a static list becomes misleading quickly. Publish only if the page has:

- explicit selection methodology;
- timestamped on-chain data and sources;
- separate fee APR and token-incentive APR;
- TVL, volume, depth, utilization, IL/depeg/smart-contract risk;
- frequent refreshes and visible update history;
- no promise that past or displayed APY will continue.

Until that system exists, target `how to evaluate` and `how to compare` rather than unsupported “best” claims.

### Token-launch queries

`how to create a liquidity pool`, `create Raydium liquidity pool`, `create liquidity pool on Pump.fun`, and similar terms are sizable but represent token-launcher intent and elevated scam/rug-pull risk. They are outside the current LP-research positioning. Defer unless the product strategy intentionally expands to issuer education with strong safety controls.

## Keyword-to-page map and cannibalization rules

1. **One concept, one canonical pillar.** “meaning,” “definition,” “explained,” “example,” and “how it works” belong on the same concept page.
2. **Split by task, not wording.** A calculator, comparison, protocol workflow, or live data page can justify its own URL because it solves a different task.
3. **Do not make one calculator page pretend to model every AMM.** Use a shared tool shell with clearly separated 50/50, weighted, and concentrated models, or distinct pages when inputs and formulas differ materially.
4. **Keep protocol-neutral and protocol-specific pages separate.** The current “how to provide liquidity” page should explain the universal workflow; Uniswap/Meteora/Raydium pages should own exact interfaces, fee models, and range behavior.
5. **Use Search Console to decide future splits.** If a section gains impressions for a distinct task and the current page cannot satisfy that task well, then split it. Do not split solely to create more URLs.

## 90-day publishing plan

### Days 1–30: utility wedge

1. Ship `/tools/impermanent-loss-calculator/`.
2. Add calculator links and worked examples to the IL, risk, fees, concentrated-liquidity, and evaluation pillars.
3. Ship `/tools/liquidity-pool-calculator/` with fee/IL/HODL scenario outputs.
4. Refresh the title and opening answer of the four existing pillars around natural head-term wording, without stuffing exact-match variants.

### Days 31–60: comparisons and Uniswap

5. Publish `liquidity pool vs staking`.
6. Publish `liquidity mining vs yield farming`, also answering “yield farming vs liquidity pool.”
7. Publish `Uniswap v3 liquidity strategy`.
8. Ship the Uniswap v3 calculator or extend the concentrated model into the general calculator.
9. Publish a source-led “how to provide liquidity on Uniswap” workflow if it can be maintained against the current app UI.

### Days 61–90: Solana protocol wedge

10. Publish `Meteora DLMM strategy` and calculator.
11. Publish `Raydium CLMM liquidity guide`.
12. Expand Curve and Balancer internal clusters.
13. Decide whether a live pool comparison/screener is feasible; do not publish a static “best pools” list as a shortcut.

## On-page briefs for the first six deliverables

| Deliverable | Title direction | Must answer above the fold |
|---|---|---|
| IL calculator | Impermanent Loss Calculator: LP vs HODL | What is the estimated IL in percent and dollars, under which AMM assumptions? |
| LP returns calculator | Liquidity Pool Calculator: Fees, IL, and Net Returns | After fees, rewards, costs, and IL, does the LP scenario beat holding? |
| Uniswap v3 calculator | Uniswap v3 Liquidity Calculator: Range, Fees, and IL | Is the position in range, what assets will it hold, and what is net performance? |
| LP vs staking | Liquidity Pool vs Staking: Returns, Risks, and Effort | Which has IL, lock-up, smart-contract exposure, and active-management needs? |
| Mining vs farming | Liquidity Mining vs Yield Farming vs Staking | What activity earns each reward and where do fees, emissions, and risks come from? |
| Meteora strategy | Meteora DLMM Strategy: Bins, Fees, Range, and Risk | What do bin step and distribution shape change, and when does the position stop earning? |

Every page should include model assumptions, a worked asymmetric example, source links, a visible review date, and educational risk language. Calculator pages need shareable query parameters or scenario URLs if practical; that creates linkable utility rather than a disposable widget.

## Measurement plan

Because the site is one day old, the next decisions should be based on early query data rather than premature ranking judgments.

### Search Console setup

Track weekly:

- non-brand impressions and clicks by query cluster;
- pages with impressions but CTR below the site median;
- queries ranking positions 8–30 that map to an existing relevant page;
- unexpected forex/ICT impressions caused by the ambiguous domain term;
- calculator modifiers before and after tools launch;
- protocol demand split by Uniswap, Meteora, Raydium, PancakeSwap, Curve, and Balancer.

### Rank-tracking seed set

Track at least these 20 globally in English, then add US/UK/SG views if those markets matter:

1. what is a liquidity pool
2. liquidity pool crypto
3. automated market maker
4. impermanent loss
5. impermanent loss calculator
6. impermanent loss formula
7. concentrated liquidity
8. concentrated liquidity calculator
9. liquidity pool calculator
10. liquidity pool vs staking
11. liquidity mining vs yield farming
12. how to provide liquidity
13. how to evaluate a liquidity pool
14. liquidity pool risks
15. Uniswap v3 liquidity calculator
16. Uniswap v3 liquidity strategy
17. Uniswap v4 hooks
18. Meteora DLMM strategy
19. Raydium CLMM
20. stablecoin liquidity pool

### Paid-tool validation

Import `docs/keyword-masterlist-2026-09-10.csv` into Keyword Planner and one independent database such as Ahrefs, Semrush, or SE Ranking. Add:

- global and target-country monthly volume;
- 12-month trend;
- keyword difficulty;
- CPC;
- current SERP features;
- current ranking URL and position;
- parent topic.

Use the two-source median for planning where tools disagree. Volume should influence order, not override product fit, SERP intent, freshness burden, or the site's ability to produce a distinctly better answer.

## Competitor and SERP observations

- **Core definitions:** Binance Academy, CoinGecko Learn, Uniswap support/blog, Chainlink, and security/education publications have high authority and broad coverage.
- **Impermanent loss:** winning pages combine a simple definition, numerical table/graph, worked example, formula, mitigation, and a calculator link.
- **Calculators:** DailyDeFi and CoinGecko own simple IL intent; Calculator Academy and Spark add dollars, HODL comparison, fees/costs, and formula detail; Metrix/Poolfish targets concentrated positions and backtesting.
- **Protocol mechanics:** official documentation dominates exact technical queries. An independent site can win by translating mechanics into LP outcomes, risks, assumptions, and comparisons rather than paraphrasing docs.
- **“Best pool” searches:** listicles and data products satisfy different intents. A credible entrant needs live data and methodology, not an editorial list with promotional APYs.

## Sources

- Google Autocomplete endpoint, collected 2026-09-10 from 25 seed families.
- [Google Trends Explore](https://trends.google.com/trends/explore) — attempted; rate-limited, so no trend result is cited.
- [SearchVolume.io free keyword volume tool](https://searchvolume.io/)
- [SE Ranking keyword volume checker](https://seranking.com/keyword-search-volume-checker.html)
- [Semrush overview of volume tools and metric limitations](https://www.semrush.com/blog/keyword-search-volume/)
- [Uniswap: What is a liquidity pool?](https://support.uniswap.org/hc/en-us/articles/8829880740109-What-is-a-liquidity-pool)
- [Uniswap: Concentrated liquidity](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
- [Binance Academy: Impermanent Loss Explained](https://www.binance.com/en/academy/articles/impermanent-loss-explained)
- [Binance Academy: What Are Liquidity Pools in DeFi?](https://www.binance.com/en/academy/articles/what-are-liquidity-pools-in-defi)
- [CoinGecko: Automated Market Makers](https://www.coingecko.com/learn/what-is-an-automated-market-maker-amm)
- [CoinGecko: Liquidity Pools](https://www.coingecko.com/learn/liquidity-pools-crypto-defi)
- [CoinGecko impermanent loss and APY calculator](https://www.coingecko.com/en/impermanent-loss-calculator)
- [DailyDeFi impermanent loss calculator](https://dailydefi.org/)
- [Calculator Academy impermanent loss calculator](https://calculator.academy/impermanent-loss-calculator/)
- [Metrix/Poolfish Uniswap calculator](https://poolfish.xyz/calculators/uniswap)
- [Meteora DLMM documentation](https://docs.meteora.ag/developer-guides/dlmm)
- [Raydium CLMM repository](https://github.com/raydium-io/raydium-clmm)

## Final recommendation

Position LiquidityPools.app as the **mechanism-first decision and calculation layer for LPs**, not another crypto glossary. Preserve the existing pillars, then use calculators and source-led protocol workflows to earn long-tail rankings, links, repeat visits, and eventually defensible data pages.

---

## Execution status (updated 2026-09-11)

This section tracks the report against what is live. It is the authoritative delta; the sections above are the original 2026-09-10 baseline and are left unedited.

### Shipped

| Priority | Recommendation | Live URL |
|---|---|---|
| P0 | Impermanent loss calculator | `/tools/impermanent-loss-calculator/` |
| P0 | Liquidity pool returns calculator | `/tools/liquidity-pool-calculator/`, `/tools/lp-profit-calculator/` |
| P0 | Uniswap v3 range and fee calculator | `/tools/uniswap-v3-liquidity-calculator/` |
| P1 | Liquidity pool vs staking | `/guides/liquidity-pool-vs-staking/` |
| P1 | Liquidity mining vs yield farming | `/guides/liquidity-mining-vs-yield-farming/` |
| P1 | Is providing liquidity profitable | `/guides/is-providing-liquidity-profitable/` |
| P1 | How to provide liquidity on Uniswap | `/guides/uniswap-liquidity-pools/` |
| P1 | Uniswap v3 liquidity strategy | `/guides/concentrated-liquidity-strategy/` |
| P1 | Uniswap v3 out of range | `/guides/out-of-range-liquidity/` |
| P1 | Uniswap v3 fee tiers | `/guides/uniswap-fee-tiers-explained/` |
| P1 | How to reduce impermanent loss | `/guides/how-to-avoid-impermanent-loss/` |
| P2 | Meteora DLMM strategy | `/guides/meteora-dlmm-strategy/` |
| P2 | Raydium CLMM guide | `/guides/raydium-clmm-liquidity-guide/` |
| P2 | PancakeSwap v3 liquidity guide | `/guides/pancakeswap-liquidity-pools/` |
| P3 | LVR, JIT/MEV, delta and rebalancing research | `/guides/loss-versus-rebalancing/`, `/guides/mev-and-liquidity-providers/`, `/guides/concentrated-liquidity-strategy/` |

### Deliberately not built

- **Separate Meteora and Raydium calculators.** The concentrated model in `/tools/uniswap-v3-liquidity-calculator/` is the same tick mathematics those venues use. A second shell would be a duplicate URL solving an identical task, which the cannibalization rules in this report forbid.
- **Liquidity pool tracker, screener and pool checker.** These need live onchain data under our control. The `/tools/` page states this explicitly and points to Revert, Dune and DeFiLlama instead.
- **`best liquidity pools` and `highest APY` listicles.** Blocked until the data pipeline and update cadence described in this report exist. `content:audit` rejects the phrasing outright.
- **Token-launch and pool-creation queries.** Issuer intent, elevated scam adjacency, outside the LP-research position.
- **Forex/ICT contrast page.** Deferred until Search Console shows real impressions on the ambiguous terms, as this report recommends.

### Still open

- Curve pool-architecture page broader than the existing Curve v2 technical article.
- Balancer weighted-pool mode inside the concentrated calculator.
- Liquidity pool tax-treatment guide, which needs an explicit non-advice framing and a qualified reviewer.
- Search Console connection, which is the precondition for every remaining split decision in this report.
