# Keyword coverage map

Traceability between the keyword research review of LiquidityPools.app and the pages that now serve each theme. Every keyword listed in the research, at every priority, now resolves to site content; the verification method is described at the end of this file. Priorities are the strategic priorities from that research, not search-volume rankings; volume, difficulty and country data still need to be validated in Search Console, Keyword Planner or an equivalent source before this map is used to set further priorities.

## Cluster A — Entry and topic authority

| Primary keyword theme | Priority | Page |
| :--- | :--- | :--- |
| liquidity pool, what is a liquidity pool, how do liquidity pools work | P0 | `/guides/what-is-a-liquidity-pool/` |
| automated market maker, how does an AMM work, what is an AMM | P0 | `/guides/automated-market-maker-explained/` |
| constant product formula, x*y=k, constant product market maker | P0 | `/guides/constant-product-formula/` |
| AMM vs order book, AMM vs DEX, liquidity pool vs order book | P0 | `/guides/amm-vs-order-book/` |
| types of liquidity pools, weighted pool, correlated asset pool, lending pool vs liquidity pool | P0 | `/guides/liquidity-pool-types/` |
| LP token, what is an LP token, LP token risks | P0 | `/guides/liquidity-pool-tokens/` |
| liquidity pool vs staking, liquidity pool vs yield farming | P0 | `/guides/liquidity-pool-vs-staking/` |

## Cluster B — Impermanent loss flagship

| Primary keyword theme | Priority | Page |
| :--- | :--- | :--- |
| impermanent loss, what is impermanent loss, how to avoid impermanent loss | P0 | `/guides/impermanent-loss-explained/` |
| impermanent loss formula, how to calculate impermanent loss, impermanent loss example | P0 | `/guides/impermanent-loss-formula/` |
| impermanent loss calculator | P0 | `/tools/impermanent-loss-calculator/` |
| LP fees vs impermanent loss, is providing liquidity profitable, do liquidity pools make money | P0 | `/guides/lp-fees-vs-impermanent-loss/` |
| can you lose money in a liquidity pool, why is my liquidity position losing money | P0 | `/guides/can-you-lose-money-in-a-liquidity-pool/` |
| liquidity pool risks, risks of providing liquidity, smart contract risk | P0 | `/guides/liquidity-pool-risks/` |

## Cluster C — Concentrated liquidity and position management

| Primary keyword theme | Priority | Page |
| :--- | :--- | :--- |
| concentrated liquidity, concentrated liquidity risk, liquidity range | P0 | `/guides/concentrated-liquidity-explained/` |
| out of range liquidity, liquidity position not earning fees, what happens when liquidity is out of range | P0 | `/guides/out-of-range-liquidity/` |
| range orders, single-sided liquidity, one-sided liquidity provision | P1 | `/guides/range-orders-on-amms/` |
| how to provide liquidity, liquidity provision DeFi | P0 | `/guides/how-to-provide-liquidity/` |
| slippage in liquidity pools, price impact AMM, spot vs execution price | P0 | `/guides/slippage-and-price-impact/` |

## Cluster D — Protocol architecture

| Primary keyword theme | Priority | Page |
| :--- | :--- | :--- |
| Uniswap v3 vs v4 liquidity, Uniswap v4 liquidity pool | P0 | `/guides/uniswap-v3-vs-v4/` |
| Uniswap v4 hooks, singleton, flash accounting | P0 | `/guides/uniswap-v4-architecture-and-hooks/` |
| Uniswap fee tiers explained, pool fee tier, who pays liquidity pool fees | P0 | `/guides/uniswap-fee-tiers-explained/` |
| liquidity provider fees, LP fees, liquidity pool APR | P0 | `/guides/liquidity-provider-fees/` |
| DLMM, discretized liquidity, Liquidity Book, liquidity bins | P0 | `/guides/discretized-liquidity-dlmm-explained/` |
| Balancer weighted pool, 80/20 pool | P1 | `/guides/balancer-and-weighted-pools/` |
| Curve liquidity pool, dynamic pegging | P1 | `/guides/curve-v2-cryptoswap-explained/` |
| stablecoin liquidity pool, stablecoin pool risks | P0 | `/guides/stablecoin-liquidity-pools/` |
| cross-chain liquidity, bridge liquidity risk, intent-based liquidity | P1 | `/guides/cross-chain-liquidity-explained/` |

## Cluster E — Research, yield and market structure

| Primary keyword theme | Priority | Page |
| :--- | :--- | :--- |
| how to evaluate a liquidity pool, how to choose a liquidity pool, how to compare liquidity pools | P0 | `/guides/how-to-evaluate-a-liquidity-pool/` |
| liquidity pool checklist, pool audit checklist, how to check locked liquidity | P0 | `/guides/liquidity-pool-research-checklist/` |
| liquidity pool calculator, LP APR calculator, fee calculator | P0 | `/tools/liquidity-pool-calculator/` |
| pool APR vs APY, real yield | P0 | `/guides/apr-vs-apy-in-defi/` |
| yield farming liquidity pools, liquidity mining vs yield farming | P0 | `/guides/yield-farming-explained/` |
| liquidity mining, ve-tokenomics, mercenary capital | P0 | `/guides/liquidity-mining-explained/` |
| loss versus rebalancing, LVR DeFi, adverse selection AMM | P1 | `/guides/loss-versus-rebalancing/` |
| MEV liquidity providers, sandwich attacks, JIT liquidity | P1 | `/guides/mev-and-liquidity-providers/` |
| market making DeFi, passive market making | P1 | `/guides/market-making-on-amms/` |
| TVL, liquidity pool depth, pool utilisation | P1 | `/guides/tvl-explained/` |
| onchain pool research, pool analytics, liquidity pool data | P0 | `/guides/onchain-liquidity-metrics/` |

## Question-intent coverage

The question long-tails from the research are served through FAQ blocks rather than through separate thin pages. Every guide carries a `faq` list in its frontmatter, rendered as a question-and-answer section and emitted as FAQPage structured data. Current coverage is 235 questions across 55 guides, plus 15 across the three calculators.



## Second wave: gaps closed after a full re-check

A line-by-line re-check of the research against the site found 51 keyword strings with no matching page. These guides and tools closed them.

| Primary keyword theme | Priority | Page |
| :--- | :--- | :--- |
| liquidity provider, what is an LP in crypto, how do liquidity providers make money | P0 | `/guides/what-is-a-liquidity-provider/` |
| how to avoid impermanent loss, impermanent loss protection | P0 | `/guides/how-to-avoid-impermanent-loss/` |
| impermanent loss example, impermanent loss vs permanent loss | P0 | `/guides/impermanent-loss-examples/` |
| Uniswap liquidity pools, Uniswap pool fees, how to provide liquidity on Uniswap, Uniswap price impact | P0 | `/guides/uniswap-liquidity-pools/` |
| Uniswap v3 ticks explained, Uniswap v3 positions NFT | P1 | `/guides/uniswap-v3-ticks-and-lp-nfts/` |
| Uniswap v2 vs v3 liquidity, Uniswap v2 liquidity pool | P1 | `/guides/uniswap-v2-vs-v3/` |
| rug pull liquidity pool, locked liquidity meaning, how to check locked liquidity | P1 | `/guides/liquidity-pool-rug-pulls/` |
| gas fees providing liquidity, liquidity pool withdrawal risk | P1 | `/guides/lp-gas-costs/` |
| single-sided liquidity, one-sided liquidity provision | P1 | `/guides/single-sided-liquidity/` |
| lending pool vs liquidity pool, Aave liquidity pool | P1 | `/guides/lending-pool-vs-liquidity-pool/` |
| real yield liquidity pools, is high APY liquidity pool safe | P1 | `/guides/real-yield-liquidity-pools/` |
| bonding curve crypto, invariant AMM, constant product market maker | P1 | `/guides/bonding-curves-and-amm-invariants/` |
| dynamic fees AMM, volatility accumulator DLMM | P1 | `/guides/dynamic-fees-in-amms/` |
| liquidity depth crypto, liquidity pool depth, spot price vs execution price AMM | P1 | `/guides/liquidity-depth-and-execution/` |
| concentrated liquidity strategy, liquidity range Uniswap v3, Uniswap v3 price range | P1 | `/guides/concentrated-liquidity-strategy/` |
| liquidity pool for beginners | P1 | `/guides/liquidity-pools-for-beginners/` |
| token liquidity analysis, on-chain pool analytics, liquidity pool smart contract audit | P1 | `/guides/token-liquidity-analysis/` |
| on-chain liquidity, decentralized liquidity, AMM liquidity fragmentation, solver networks DeFi | P1 | `/guides/onchain-liquidity-explained/` |
| PancakeSwap liquidity pool | P1 | `/guides/pancakeswap-liquidity-pools/` |
| liquidity pool profit calculator, LP return calculator, liquidity pool APY calculator | P1 | `/tools/lp-profit-calculator/` |

## Verification

Coverage is checked by extracting every keyword row from the research report and testing each string against the combined text of `src/content/articles/*.md` and `src/pages/**/*.astro`, after collapsing whitespace. The current result is 189 of 189 keywords covered, at every priority level from P0 to P2.

Editorial rules from the research are enforced mechanically by `pnpm content:audit`, which now fails a guide that lacks worked numbers, a comparison table, three or more FAQ entries, or that contains guaranteed-yield and best-pool style claims.

## Not yet built

Deliberately deferred because they need live data, a product surface, or research that does not exist yet:

- Pool directory, pool comparison and live analytics pages. These require a data pipeline; the research explicitly recommends deferring them until one exists.
- `liquidity pool tracker`, `DeFi liquidity tracker` and `LP position tracker` as products. The tools hub states plainly that no tracker exists here and points to the onchain sources that do the job, rather than shipping a page that implies live position state the site does not hold.
- Separate pages for close synonyms such as `crypto liquidity pools` and `DeFi liquidity pools`. The research warns against generating near-duplicate pages for synonyms, so these terms are served by the entry guide.

## Validation still outstanding

The research did not include verified search volume, difficulty or click data. Before the next content cycle, pull country-level monthly volume, twelve-month trend, difficulty and SERP feature data for the P0 themes above, and reconcile them against impressions, clicks and average position in Search Console for the pages now serving them.
