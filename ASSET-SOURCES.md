# Editorial illustration record

Every guide image in `public/images/guides/` is an original, AI-assisted editorial illustration commissioned for LiquidityPools.app on 2026-09-09. These images are designed to explain the specific market mechanism discussed in the associated guide, rather than serving as generic decorative stock imagery. No third-party stock assets, logos, screenshots, or text overlays are used in this collection.

The visual system uses charcoal ground, ivory structures, mint for active liquidity and transaction flow, and amber for price movement, fees, or caution. Alt text and a mechanism-specific figure caption are embedded in each article.

| Guide | Visual argument | Asset |
| --- | --- | --- |
| `amm-vs-order-book` | Continuous pool pricing and discrete order levels solve different problems. | `public/images/guides/amm-vs-order-book.webp` |
| `automated-market-maker-explained` | An AMM is an inventory rule with a price curve. | `public/images/guides/automated-market-maker-explained.webp` |
| `concentrated-liquidity-explained` | Capital can be dense in one range and inactive outside it. | `public/images/guides/concentrated-liquidity-explained.webp` |
| `constant-product-formula` | The curve makes larger trades progressively change execution. | `public/images/guides/constant-product-formula.webp` |
| `cross-chain-liquidity-explained` | Bridges connect liquidity while introducing fragmentation and dependencies. | `public/images/guides/cross-chain-liquidity-explained.webp` |
| `how-to-evaluate-a-liquidity-pool` | A pool deserves a mechanism-by-mechanism review before capital is committed. | `public/images/guides/how-to-evaluate-a-liquidity-pool.webp` |
| `how-to-provide-liquidity` | Providing liquidity means choosing a pool, assets, and active range. | `public/images/guides/how-to-provide-liquidity.webp` |
| `impermanent-loss-explained` | Pool rebalancing changes inventory relative to simply holding. | `public/images/guides/impermanent-loss-explained.webp` |
| `liquidity-mining-explained` | Incentive-funded liquidity and organic market flow are different inputs. | `public/images/guides/liquidity-mining-explained.webp` |
| `liquidity-pool-research-checklist` | A durable review starts with the pool mechanism and its exit conditions. | `public/images/guides/liquidity-pool-research-checklist.webp` |
| `liquidity-pool-risks` | Pool risk is layered: assets, code, liquidity conditions, and incentives. | `public/images/guides/liquidity-pool-risks.webp` |
| `liquidity-pool-tokens` | A pool token is a changing claim on pooled reserves. | `public/images/guides/liquidity-pool-tokens.webp` |
| `liquidity-provider-fees` | Fees accrue from eligible active flow, not from a fixed yield source. | `public/images/guides/liquidity-provider-fees.webp` |
| `market-making-on-amms` | AMM liquidity provision is inventory management with fee compensation. | `public/images/guides/market-making-on-amms.webp` |
| `mev-and-liquidity-providers` | Transaction ordering can change the execution around a visible swap. | `public/images/guides/mev-and-liquidity-providers.webp` |
| `onchain-liquidity-metrics` | Depth, flow, and imbalance reveal more than a single TVL figure. | `public/images/guides/onchain-liquidity-metrics.webp` |
| `range-orders-on-amms` | A bounded position can express a conditional exchange range. | `public/images/guides/range-orders-on-amms.webp` |
| `stablecoin-liquidity-pools` | Stable-asset curves are efficient near balance and defensive under stress. | `public/images/guides/stablecoin-liquidity-pools.webp` |
| `tvl-explained` | Headline value and executable depth are not the same measurement. | `public/images/guides/tvl-explained.webp` |
| `what-is-a-liquidity-pool` | How a pool turns two reserves into a continuous quote. | `public/images/guides/what-is-a-liquidity-pool.webp` |

## Programmatically generated figures (keyword-expansion release, 2026-09-10)

The figures below are rendered directly from `scripts/generate-guide-figures.py` rather than commissioned. Each is a labelled diagram or plot drawn from the numbers used in its guide, exported at 1600x1067 WebP on the dark technical ground described in [`VISUAL-SYSTEM.md`](./VISUAL-SYSTEM.md). They contain no third-party marks and can be regenerated deterministically with `python3 scripts/generate-guide-figures.py <slug>`.

| Guide or tool | Visual argument | Asset |
| --- | --- | --- |
| `out-of-range-liquidity` | Fee accrual is a step function of price: full inside the interval, zero outside. | `public/images/guides/out-of-range-liquidity.webp` |
| `impermanent-loss-formula` | Divergence plotted against the price ratio, with a worked dollar example. | `public/images/guides/impermanent-loss-formula.webp` |
| `lp-fees-vs-impermanent-loss` | Fee capture grows with volatility; adverse selection grows with its square. | `public/images/guides/lp-fees-vs-impermanent-loss.webp` |
| `loss-versus-rebalancing` | The widening gap between pool value and a continuously rebalancing benchmark. | `public/images/guides/loss-versus-rebalancing.webp` |
| `uniswap-v3-vs-v4` | Row-by-row comparison of what changed between versions, and what did not. | `public/images/guides/uniswap-v3-vs-v4.webp` |
| `slippage-and-price-impact` | Execution price against order size for two pool depths. | `public/images/guides/slippage-and-price-impact.webp` |
| `uniswap-fee-tiers-explained` | Each tier's typical pairs and its share of routed volume. | `public/images/guides/uniswap-fee-tiers-explained.webp` |
| `apr-vs-apy-in-defi` | One rate under five compounding conventions, and the costs no rate includes. | `public/images/guides/apr-vs-apy-in-defi.webp` |
| `yield-farming-explained` | The two revenue paths into a farmed position and the deductions against them. | `public/images/guides/yield-farming-explained.webp` |
| `liquidity-pool-types` | Three invariants plotted together with the exposure each hands the LP. | `public/images/guides/liquidity-pool-types.webp` |
| `liquidity-pool-vs-staking` | Two payoffs compared across revenue, exposure, path dependency and exit. | `public/images/guides/liquidity-pool-vs-staking.webp` |
| `can-you-lose-money-in-a-liquidity-pool` | Six distinct loss paths, only two specific to automated market making. | `public/images/guides/can-you-lose-money-in-a-liquidity-pool.webp` |
| `/tools/impermanent-loss-calculator/` | Inputs, formula and benchmark for the divergence calculation. | `public/images/guides/impermanent-loss-calculator.webp` |
| `/tools/liquidity-pool-calculator/` | Fee income as the product of tier, routed volume and liquidity share. | `public/images/guides/liquidity-pool-calculator.webp` |

### Second wave figures (full keyword coverage release, 2026-09-11)

| Guide or tool | Visual argument | Asset |
| --- | --- | --- |
| `what-is-a-liquidity-provider` | What an LP is paid against what the same position underwrites. | `public/images/guides/what-is-a-liquidity-provider.webp` |
| `how-to-avoid-impermanent-loss` | Six mitigations and the cost each one carries. | `public/images/guides/how-to-avoid-impermanent-loss.webp` |
| `impermanent-loss-examples` | Five price scenarios scaled against the four-times case. | `public/images/guides/impermanent-loss-examples.webp` |
| `uniswap-liquidity-pools` | Three generations of Uniswap pools compared for an LP. | `public/images/guides/uniswap-liquidity-pools.webp` |
| `uniswap-v3-ticks-and-lp-nfts` | The six contract internals behind a range position. | `public/images/guides/uniswap-v3-ticks-and-lp-nfts.webp` |
| `uniswap-v2-vs-v3` | A passive claim and a managed position, side by side. | `public/images/guides/uniswap-v2-vs-v3.webp` |
| `liquidity-pool-rug-pulls` | Six pre-deposit checks answerable from chain data. | `public/images/guides/liquidity-pool-rug-pulls.webp` |
| `lp-gas-costs` | Round-trip gas as a share of annual fee income by position size. | `public/images/guides/lp-gas-costs.webp` |
| `single-sided-liquidity` | A one-sided deposit converting as price crosses the band. | `public/images/guides/single-sided-liquidity.webp` |
| `lending-pool-vs-liquidity-pool` | Two instruments that share a word and little else. | `public/images/guides/lending-pool-vs-liquidity-pool.webp` |
| `real-yield-liquidity-pools` | Fee-funded and emission-funded income compared. | `public/images/guides/real-yield-liquidity-pools.webp` |
| `bonding-curves-and-amm-invariants` | Three curve families from flat to convex. | `public/images/guides/bonding-curves-and-amm-invariants.webp` |
| `dynamic-fees-in-amms` | Fixed tiers against a volatility-linked fee. | `public/images/guides/dynamic-fees-in-amms.webp` |
| `liquidity-depth-and-execution` | Price impact against order size for three depths. | `public/images/guides/liquidity-depth-and-execution.webp` |
| `concentrated-liquidity-strategy` | Fee density, time in range, and the net peak between them. | `public/images/guides/concentrated-liquidity-strategy.webp` |
| `liquidity-pools-for-beginners` | The five decisions in the order they arrive. | `public/images/guides/liquidity-pools-for-beginners.webp` |
| `token-liquidity-analysis` | Six measurements describing a token's real liquidity. | `public/images/guides/token-liquidity-analysis.webp` |
| `onchain-liquidity-explained` | Five layers from deposit to executed quote. | `public/images/guides/onchain-liquidity-explained.webp` |
| `pancakeswap-liquidity-pools` | Protocol comparison across curves, fees and incentives. | `public/images/guides/pancakeswap-liquidity-pools.webp` |
| `/tools/lp-profit-calculator/` | Inputs and outputs of the net LP result calculation. | `public/images/guides/lp-profit-calculator.webp` |
