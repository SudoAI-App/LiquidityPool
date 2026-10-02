---
title: "PancakeSwap Liquidity Pools: Structure, Fees and Incentives"
description: "How PancakeSwap liquidity pools work, how their fee tiers and CAKE emissions differ from a fee-funded pool, and what to check before supplying one."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "PancakeSwap liquidity pool"
keywords: "PancakeSwap liquidity pool, PancakeSwap v3, CAKE emissions, BNB Chain liquidity, farm liquidity pool, protocol comparison"
featured: false
faq:
  - q: "How do PancakeSwap liquidity pools work?"
    a: "They use the same curve families as other major automated market makers: constant-product pools, concentrated ranges, stablecoin pools, and — since Infinity launched in 2025 — bin-based pools. Providers deposit a pair, receive a claim, and earn a share of swap fees, with CAKE emissions on top in pools that have a farm."
  - q: "What is the difference between PancakeSwap and Uniswap pools?"
    a: "The pricing mathematics is largely the same. The differences are the chains they run on, the fee tiers and fee splits, and the incentive layer: PancakeSwap pays CAKE emissions to selected farm pools, so a meaningful part of quoted yield can be issuance rather than fees."
  - q: "Are PancakeSwap farms worth it?"
    a: "It depends on the split between fee income and emissions. Run the emissions-to-zero test: if fee-only yield does not justify the divergence the pair generates, the position is a CAKE exposure with a liquidity position attached."
  - q: "Is providing liquidity on BNB Chain cheaper?"
    a: "Transaction costs are typically much lower than on Ethereum mainnet, which makes narrow ranges and frequent rebalancing viable at smaller position sizes. Lower routed volume on many pairs partly offsets that advantage."
  - q: "What should I check before supplying a PancakeSwap pool?"
    a: "The same checks as any pool: contract verification and audits, routed volume for the specific pool, active depth in your band, the share of the swap fee that reaches LPs, and the current farm rewards if you are entering for the farm yield."
---

If you have supplied a pool anywhere else, the mechanics here will look familiar. The pricing rules are the ones you already know.

What differs is where the money comes from. Part of what a PancakeSwap pool quotes you may not be paid by traders at all. It can be CAKE the protocol issues and directs to that pool.

By the end you should be able to split a quoted yield into those two parts, and decide whether the trading part alone would justify the position.

<figure class="article-figure">
  <img src="/images/guides/pancakeswap-liquidity-pools.webp" alt="Comparison table of PancakeSwap and Uniswap across curves, chains, fee tiers, incentives, LP claim and what to check." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Similar mathematics, different chains, fee schedules and incentive design. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Pool mechanics may transfer between venues, but incentive design does not. A quoted return can depend heavily on an emission programme the protocol can resize or end, so a range strategy should separate fee income from temporary incentives before comparing venues.

## Which kind of pool are you joining?

Four designs run side by side, and they ask different things of you.

**Constant-product pools** spread your money across every possible price. You get a fungible LP token and there is nothing to manage [1]. What you give up is impermanent loss — the shortfall a pool position runs against simply holding the two tokens — and it follows the standard symmetric shape set out in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

**Concentrated range pools** let you pick upper and lower bounds, and each position is an NFT [1]. Your money works far harder inside that band. Outside it, the position converts to one token and stops earning [1]. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

**StableSwap pools** specialise in pegged pairs. The curve trades nearly flat while things behave, and the damage concentrates when they do not. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

**Bin-based pools** arrived with PancakeSwap Infinity in 2025. Liquidity sits in discrete price bins, and trades inside one bin happen at a single price [6]. See [Discretized Liquidity (DLMM) Explained](/guides/discretized-liquidity-dlmm-explained/).

PancakeSwap v3 uses the same concentrated-liquidity design as Uniswap v3, so everything in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/) applies here [1] [7]. The economics around it are what differ. The position arithmetic carries over too: the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/) models a PancakeSwap v3 range.

## How do the fee tiers affect what you earn?

PancakeSwap v3 pools on EVM chains come in four tiers, and LPs keep about two-thirds of each swap fee [1]. The rest is split between a CAKE burn and the treasury.

| Pool | Swap fee | LP share | What reaches LPs |
| :--- | ---: | ---: | ---: |
| v2, any pair | 0.25% | 68% | 0.17% |
| v3, 0.01% tier | 0.01% | 67% | 0.0067% |
| v3, 0.05% tier | 0.05% | 66% | 0.033% |
| v3, 0.25% tier | 0.25% | 68% | 0.17% |
| v3, 1% tier | 1.00% | 68% | 0.68% |

Infinity pools are more flexible: a pool is created with either a fixed fee or a dynamic fee set by its hook, and that choice cannot be changed later [6].

The routing works the same as anywhere. Aggregators send orders down the cheapest path that can fill them, so a higher tier collects more per trade and usually sees less volume. The right tier is the one that maximises the product of those two for your pair, which you measure rather than guess. See [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/).

One thing is chain-specific. On a network with cheap transactions, aggregators can split orders more aggressively, because an extra hop costs little. That spreads flow across more venues and dilutes any single pool's share of it, including yours.

## Where does the rest of the yield come from?

This is where PancakeSwap differs most from a purely fee-funded venue. The protocol issues CAKE to selected farms. Until April 2025, veCAKE holders voted on which pools received it. That gauge voting was retired on 23 April 2025 as part of Tokenomics 3.0 [2]. PancakeSwap now manages emissions itself, directing them to the pools and products it judges most productive [3].

The same upgrade cut daily CAKE emissions in two phases, from about 29,000 to 14,500 CAKE a day [4]. CAKE's maximum supply was lowered to 400 million in January 2026, and 15–23% of v3 trading fees go to buying and burning CAKE [3] [1]. None of that changes what a farm pays you: your rewards are still newly issued tokens.

Three things follow for you.

**The quoted yield is a sum, not a rate.** Part of it is fees paid by traders. Part is newly issued CAKE. Only the first survives the end of a programme. See [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

**The allocation can change.** Emissions are managed by the protocol rather than fixed in advance [3]. A farm's reward can be cut or ended, so if your case for holding rests on the emission part, watch the farm as closely as the market.

**You have to sell the token to realise it.** Many recipients sell on similar schedules, which is the dilution mechanism examined in [Liquidity Mining Explained](/guides/liquidity-mining-explained/).

### How Infinity farms pay

Infinity farms work differently from older farms. You do not stake your position anywhere; you keep it in your wallet [5]. Only in-range positions earn rewards, and each eight-hour epoch the rewards are split in proportion to the fees each position earned [5]. Rewards are published as a Merkle root, open to dispute for one hour, and then claimable in one transaction [5].

That design pays for liquidity that is actually trading. It also means a narrow range that drifts out of range earns neither fees nor CAKE.

## The test that takes ten seconds

Set the emissions to zero and ask whether you would still supply the pool at what remains.

| Pool profile | Quoted | Fees only | Hurdle it must clear | What you are actually holding |
| :--- | ---: | ---: | :--- | :--- |
| Deep stable pair | 7.0% | 6.2% | Very low | A liquidity business |
| Major against a stablecoin | 22.0% | 13.0% | Moderate | A liquidity business, incentive-assisted |
| Mid-cap farm | 60.0% | 4.0% | High | A token position |
| New launch farm | 220.0% | 1.0% | Very high | A token position with pool risk attached |

Rows three and four are not automatic rejections. They are reclassifications, and they change how you size the position and what you watch.

## What changes on a cheap chain?

Supplying on a low-cost network changes which strategies are available to you, not just one line of the cost sheet.

- **Narrow ranges become viable at smaller size**, because each rebalance costs little. The arithmetic is in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).
- **Routed volume is usually lower** per pair than on the deepest venues, so your fee income per dollar can still be smaller.
- **Bridged assets carry their own risk.** A wrapped token is a claim on a bridge, and a compromised bridge can leave the wrapped token worth far less than the original [10]. See [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/).
- **Token quality varies a lot** in the long tail, which makes the checks in [Rug Pulls and Locked Liquidity](/guides/liquidity-pool-rug-pulls/) more important rather than less.

### An incentivised pair, worked

Take \$15,000 into a mid-cap pair quoting 48%, of which measured fee income is about 7 points and CAKE rewards the other 41.

| Line | Per month |
| :--- | ---: |
| Fee income, the part traders pay | \$88 |
| Emissions at their quoted price | \$513 |
| Emissions if CAKE falls 6% over the month and you sell weekly | about \$494 |

The emission line is why the pool looks attractive at all. Now the costs against it.

If the pair's annualised volatility is around 100–125%, a full-range position can expect to trail holding by roughly 3–5% over a quarter. A concentrated position trails by more. On average, that shortfall is value handed to arbitrageurs, and it grows with volatility [8]. Weekly harvest-and-sell cycles cost gas and move the price on a thin book. And the emission stream funding those rewards can be resized or ended by protocol decision [3].

The position can be perfectly sound. What it cannot be is a 48% yield, because about 85% of that figure depends on the CAKE price and on emission decisions you do not control. Size it as a token exposure with a fee kicker and you will make different decisions than if you size it as a high-yield pool.

## What carries over from other protocols?

Everything mechanical carries over. That includes the invariant, which is the rule a pool keeps true no matter what trades arrive, how ticks behave, the shortfall against holding, and the relationship between fee tier and routed volume.

It also includes adverse selection — trading against people who already know the price moved, and losing a little each time [8]. If you understand a concentrated position on one protocol, you understand it here.

What does not carry over: emission policy, governance processes, the specific set of audited contracts, and the depth profile of any given pair. Check those per venue. Emission policy in particular is set by each protocol's governance, which usually keeps a central decision-maker, and it can change between visits [9].

One habit closes the gap. Write down the fee-only yield at entry next to the quoted figure, then review the position against that number rather than the headline. It takes one spreadsheet line, and it turns a cut in rewards into a visible change in your case for holding rather than a surprise in your balance.

## What to check before you deposit

- [ ] Which pool design you are entering, and whether it needs a range.
- [ ] The pool and router contracts, their audits, and who can upgrade them.
- [ ] Routed volume for that specific pool and tier over thirty days.
- [ ] Active depth inside your intended band, not the pool's headline total.
- [ ] The share of the swap fee that reaches LPs in that tier.
- [ ] The quoted yield split into its fee and emission parts.
- [ ] Whether the farm still runs, and how its rewards are calculated.
- [ ] For bridged assets, the bridge itself and the peg history of the wrapped token.
- [ ] Your position size, set against whatever the zero test classified this as.

A protocol with a large incentive programme is not worse than one without. It is a different instrument, and this list keeps that difference visible after you have deposited.

## References

1. [Liquidity Pools (PancakeSwap Documentation)](https://docs.pancakeswap.finance/earn/pancakeswap-pools)
2. [veCAKE Sunset (PancakeSwap Documentation, 2025)](https://docs.pancakeswap.finance/welcome-to-pancakeswap/vecake-sunset)
3. [CAKE Tokenomics (PancakeSwap Documentation)](https://docs.pancakeswap.finance/protocol/cake-tokenomics)
4. [Implementation of CAKE Tokenomics 3.0: What You Need to Know (PancakeSwap Blog, 2025)](https://blog.pancakeswap.finance/articles/implementation-of-cake-tokenomics-3-0-what-you-need-to-know)
5. [Farms (PancakeSwap Infinity Documentation)](https://docs.pancakeswap.finance/trade/pancakeswap-infinity/farms)
6. [Infinity CLAMM & LBAMM (PancakeSwap Documentation)](https://docs.pancakeswap.finance/trade/pancakeswap-infinity/pool-types/infinity-clamm-and-lbamm)
7. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
8. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
9. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
10. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://docs.pancakeswap.finance/earn/pancakeswap-pools "Liquidity Pools (PancakeSwap Documentation)"
[2]: https://docs.pancakeswap.finance/welcome-to-pancakeswap/vecake-sunset "veCAKE Sunset (PancakeSwap Documentation, 2025)"
[3]: https://docs.pancakeswap.finance/protocol/cake-tokenomics "CAKE Tokenomics (PancakeSwap Documentation)"
[4]: https://blog.pancakeswap.finance/articles/implementation-of-cake-tokenomics-3-0-what-you-need-to-know "Implementation of CAKE Tokenomics 3.0: What You Need to Know (PancakeSwap Blog, 2025)"
[5]: https://docs.pancakeswap.finance/trade/pancakeswap-infinity/farms "Farms (PancakeSwap Infinity Documentation)"
[6]: https://docs.pancakeswap.finance/trade/pancakeswap-infinity/pool-types/infinity-clamm-and-lbamm "Infinity CLAMM & LBAMM (PancakeSwap Documentation)"
[7]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[8]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[9]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[10]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
