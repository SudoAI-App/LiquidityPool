---
title: "Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk"
description: "Picking a price range multiplies your fees and your losses by the same number. How the maths works, how wide to go, and what happens when the price leaves."
category: "LP Mechanics"
date: 2026-09-01
lastReviewed: "2026-09-12"
author: "Dr. Elena Rostova"
readTime: "8 min read"
keywords: "concentrated liquidity, liquidity range, Uniswap v3, Uniswap v4, Liquidity Book, AMM capital efficiency, tick math, LVR, JIT liquidity, what is concentrated liquidity, concentrated liquidity risk, liquidity range Uniswap v3, out of range liquidity"
featured: true
faq:
  - q: "What is concentrated liquidity?"
    a: "Liquidity supplied only within a chosen price range rather than across all prices. Inside the range the position backs far more quoted depth per dollar; outside it, the position holds a single asset and earns nothing."
  - q: "Is concentrated liquidity riskier?"
    a: "It concentrates the same risks rather than adding new ones. Divergence is amplified inside the range, income stops outside it, and the strategy requires active monitoring that a full-range position does not."
  - q: "What is a good range width?"
    a: "One matched to the pair's realised volatility and your willingness to rebalance. A band narrower than typical daily movement will exit range constantly; a very wide band earns little more than a full-range position."
---

In an old-style pool, your money is spread across every price ETH could ever trade at. Ten dollars. Ten thousand. Almost all of it sits somewhere the market will never go, doing nothing.

Concentrated liquidity lets you say where you want your money to work. Put it between \$2,800 and \$3,200 and every dollar is in the fight. The same deposit can earn ten, fifty, sometimes a thousand times more in fees.

The catch is exact and worth stating up front. Whatever multiplier you get on the fees, you get the same multiplier on the losses. This guide covers how that multiplier works, how to pick a width, and what happens when the price walks out of your range.

<figure class="article-figure">
  <img src="/images/guides/concentrated-liquidity-explained.webp" alt="Dense liquidity bars sit between two range boundaries along a price curve." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Capital can be dense in one range and inactive outside it. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Elena Rostova:**
> *"Never take a 24-hour yield figure and multiply it by 365. On a pair like ETH against dollars, most of the volume in a wide range comes from bots taking a stale quote off you before your pool notices the market moved. If the fee does not cover what the pair moves in a day, you are paying them to trade. This is not passive income. It is a job."*

## How picking a range multiplies your money

Your money only earns while the price is inside your band. So the narrower the band, the more of your money is doing work at any moment, and the more fees each dollar collects.

The multiplier has a clean formula [1]:

$$
\mathcal{E} = \frac{1}{1 - \left(\frac{P_l}{P_u}\right)^{1/4}}
$$

Where:

- $P_l$ is the bottom of your band.
- $P_u$ is the top of it.
- $\mathcal{E}$ is how many times more work your money does than a full-range deposit.

The numbers are startling. A stablecoin pair held between 0.999 and 1.001 works about two thousand times harder. An ETH pair held within plus or minus 5% works about forty times harder [2] [5].

Now the part people skip. That same number multiplies what arbitrage takes from you. A fifty-times range earns fifty times the fees and bleeds fifty times as fast. Nothing about narrowing is free. The base mechanics are in [Constant Product Formula](/guides/constant-product-formula/).

## Three states your position can be in

| Where the price is | What you hold | What you earn | What to do |
| :--- | :--- | :--- | :--- |
| Below your lower bound | All of the risky token | Nothing | Decide whether to wait or re-range |
| Inside your band | A mix that shifts with every trade | Fees on every crossing trade | Nothing, this is the good case |
| Above your upper bound | All of the quote token | Nothing | You have effectively sold. Decide whether to re-enter |

The transition is not gradual. As the price approaches your lower bound, the pool has been buying the falling token from sellers the whole way. By the time it crosses, you hold nothing but that token [2] [5].

That mechanic can be used deliberately. A one-sided deposit just above the market behaves like a limit sell order. See [Range Orders on AMMs](/guides/range-orders-on-amms/).

## Two ways protocols slice up a price

Not every protocol concentrates liquidity the same way, and the difference changes how a trade feels.

**Uniswap-style ticks.** The price line is chopped into steps of one hundredth of a percent, and the edges of your band have to land on the pool's tick spacing, a fixed multiple of those steps [1] [3]. A trade eats through the curve continuously until it reaches the next step that has liquidity waiting, then picks up whatever is there and carries on.

**Bin-style books.** Liquidity Book, built by Trader Joe (now LFJ), throws the curve away and uses flat price shelves instead [6]. Only one shelf is live at a time, and a trade clears at exactly that price until the shelf empties. Then the price jumps to the next one.

| | Tick-based, Uniswap v3 and v4 | Bin-based, Liquidity Book |
| :--- | :--- | :--- |
| Price inside your zone | Moves continuously as you trade | Completely flat until the shelf empties |
| Fee | Fixed tiers, or set by custom code | Rises on its own when the market gets jumpy |
| Your position is | An NFT, recorded inside the pool contract on v4 | A share of each shelf you funded |
| Cost of crossing | Gas to load the next step | Gas to step to the next shelf |

## Why narrow ranges bleed faster

Most people measure a pool position against simply holding the tokens. That gap is impermanent loss — the shortfall between the pool and doing nothing — and it is only half the picture [5] [7].

The full cost is loss-versus-rebalancing, or LVR — what your pool pays out because its quote is always one block behind the real market [7]. Unlike the headline number, it does not depend on where the price ends up, so you can estimate it before you deposit.

$$
\frac{d(\text{LVR})}{dt} = \frac{\sigma^2}{4} \cdot L \cdot \sqrt{P}
$$

Where:

- $\sigma$ is how much the pair moves, as annual volatility.
- $L$ is your liquidity working at the current price.
- $P$ is the current price.

Your $L$ is the multiplier from earlier. Narrow the band, raise $L$, and this number rises in exact proportion [5] [7]. That is the whole trade in one line. The full derivation is in [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## The fee thief nobody warns you about

There is a specific attack on concentrated pools worth understanding before you deposit [8].

Someone watching pending transactions sees a large swap about to land. They do three things in one block:

1. **Just before the swap**, they dump an enormous amount of liquidity into exactly the price step where it will execute.
2. **The swap runs.** Because their deposit is now almost all the liquidity at that price, they collect almost all of the fee.
3. **Just after**, they pull it all back out, principal plus fee, having held the position for no time at all.

This is called just-in-time liquidity, and the cost lands on you. You carried the price risk all week. They took the fee on the one trade that mattered, with no risk at all [8]. This is one form of MEV — value captured purely by controlling the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) for the wider pattern.

## What Uniswap v4 changed

Two shifts matter for anyone running ranges [3].

**Everything lives in one contract.** Uniswap v3 deployed a separate contract per pool. v4 puts them all in a singleton — one contract holding every pool — and keeps a running tally during a transaction rather than moving tokens at each step. The industry calls that flash accounting — keeping the tally in scratch memory and settling once at the end. The effect is that managing ranges got dramatically cheaper, which makes active management viable where it previously was not.

**Pools can run custom code.** A hook fires before or after pool actions, which opens three things worth having:

- Fees that widen when the market gets volatile, so arbitrage pays more of what it costs you.
- Minimum holding times, which kill the just-in-time trick outright.
- Automatic hedging when a position drifts toward its edge.

A hook is somebody's code, though. Check whether it can be changed after you deposit.

## If you would rather not manage it

Vaults exist to run ranges for you. Arrakis, Gamma and DefiEdge take your deposit, pick the band, and move it, giving you a plain token in return [5].

They generally run one of three playbooks:

- **A tight earning band plus a wide buffer band.** When the price drifts past a trigger, a keeper moves both.
- **A deliberately lopsided band**, tilted toward accumulating whichever token looks cheap.
- **A hedged band**, where the vault shorts the underlying to cancel the price exposure and keep only the fees.

The catch is the same one as doing it yourself, plus two more: contract risk, and a management fee. A vault that re-centres mechanically during a trend locks in the worst price every time [5]. See [Liquidity Pool Tokens](/guides/liquidity-pool-tokens/).

## What people get wrong about ranges

| What people assume | What actually happens |
| :--- | :--- |
| Tighter is always better | Tighter multiplies fees and bleed by the same number, and knocks you out of range more often. Size against how much the pair actually moves |
| Rebalancing protects me | Re-ranging an out-of-range position sells the loser and buys the winner at exactly the wrong moment. Do it on a rule, not a reflex |
| The advertised yield is what I get | It assumes the price stays put and volume continues, and it counts none of the bleed. Subtract that first |
| Fee tiers are all the same risk | The cheapest tier attracts the most arbitrage. A higher tier sees less volume but keeps more of what it sees |

## What to check before you deposit

1. **Size the band against real volatility.** Look at how far the pair actually moves in a week, not at a round number that looks tidy. Aim for at least 1.5 times that.
2. **Check the fee tier against the bleed.** Annual volatility squared, divided by eight, is roughly the yearly bleed on a full-range position. Multiply it by your band's multiplier for a concentrated one, and make sure the fees clear that.
3. **Budget the gas.** Adding, collecting, re-ranging and exiting all cost. If they eat a month of fees, the range is too tight for your size.
4. **Decide the out-of-range rule now.** Write down what you will do if the price crosses either edge, before it does.
5. **On v4, read the hook.** Does it protect against just-in-time liquidity, and can anyone change it later?

## Where to watch the numbers

- **Your position against simply holding:** [Revert Finance](https://revert.finance).
- **Where the liquidity actually sits in a pool:** [Dune Analytics](https://dune.com).
- **How often your pool gets targeted:** [EigenPhi](https://eigenphi.io).

## When something goes wrong

- **The price crossed your boundary.** You hold one token and earn nothing. Decide whether this is a real repricing or a passing swing. If it is passing, moving now just locks in the loss.
- **Fees are coming in but your value keeps falling.** The pair moves more than the fee tier covers. Widen the band, move to a higher tier, or hedge the exposure.
- **Fees dried up while volume stayed high.** Somebody is front-running the big trades with just-in-time liquidity. Move to a pool with a minimum holding rule.

## Where to go next

The boundary case gets its own guide in [Out-of-Range Liquidity](/guides/out-of-range-liquidity/). For picking the tier, see [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/), and for the version differences, [Uniswap v3 vs v4](/guides/uniswap-v3-vs-v4/). For choosing the width itself, see [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/) and [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/). To test a specific band, use the [Uniswap v3 liquidity calculator](/tools/uniswap-v3-liquidity-calculator/).

## References

1. [Uniswap v3 Core](https://uniswap.org/whitepaper-v3.pdf)
2. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
4. [Price Oracles and Time-Weighted Averages](https://developers.uniswap.org/docs/protocols/v3/concepts/price-oracles)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
7. [An Analysis of Uniswap v3: Loss-Versus-Rebalancing and Market Microstructure](https://arxiv.org/abs/2208.06046)
8. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
9. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
10. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://developers.uniswap.org/docs/protocols/v3/concepts/price-oracles "Price Oracles and Time-Weighted Averages"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer (LFJ, formerly Trader Joe, Documentation)"
[7]: https://arxiv.org/abs/2208.06046 "An Analysis of Uniswap v3: Loss-Versus-Rebalancing and Market Microstructure"
[8]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[9]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[10]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
