---
title: "Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk"
seoTitle: "Concentrated Liquidity Explained: Range, Efficiency & Risk"
description: "Picking a price range multiplies your fees and your losses by the same number. How the maths works, how wide to go, and what happens when the price leaves."
category: "LP Mechanics"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "9 min read"
primaryQuery: "concentrated liquidity"
keywords: "concentrated liquidity, liquidity range, Uniswap v3, Uniswap v4, Liquidity Book, AMM capital efficiency, tick math, LVR, JIT liquidity, what is concentrated liquidity, concentrated liquidity risk, liquidity range Uniswap v3, out of range liquidity"
featured: true
faq:
  - q: "What is concentrated liquidity?"
    a: "Liquidity supplied only within a chosen price range rather than across all prices. Inside the range the position backs far more quoted depth per dollar; outside it, the position holds a single asset and earns nothing."
  - q: "Is concentrated liquidity riskier?"
    a: "It concentrates the same risks rather than adding new ones. Losses to arbitrage and divergence from holding are amplified while the price is inside the range, income stops outside it, and the strategy needs monitoring that a full-range position does not."
  - q: "What is a good range width?"
    a: "One matched to the pair's realised volatility and to how often you will rebalance. For a pair with no trend, the expected time before the price touches an edge is roughly the half-width divided by the typical daily move, squared, in days. A band narrower than a typical day's move will exit constantly; a very wide band earns little more than a full-range position."
  - q: "How often do I need to manage a concentrated position?"
    a: "As often as price leaves your band, if you want it earning. Outside the band you hold one asset and earn no fees, so the management cadence is a real input: each rebalance costs gas and locks in the current token mix. Wider bands reduce how often that happens."
---

In an old-style pool, your money is spread across every price ETH could ever trade at. Ten dollars. Ten thousand. Almost all of it sits at prices the market will never reach, doing nothing. The [Uniswap v2 vs v3](/guides/uniswap-v2-vs-v3/) comparison works through what that switch costs and when the old design still wins.

Concentrated liquidity lets you choose where your money works. Put it between \$2,800 and \$3,200 and every dollar backs trades near today's price. While the price stays inside, that band earns about thirty times the fees of the same deposit spread across all prices.

The catch is exact. Whatever multiple you get on the fees, you get the same multiple on what arbitrage takes from you while you are in range. This guide shows how that multiple works, how to pick a width, and what happens when the price walks out of your range.

<figure class="article-figure">
  <img src="/images/guides/concentrated-liquidity-explained.webp" alt="Dense liquidity bars sit between two range boundaries along a price curve." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Capital can be dense in one range and inactive outside it. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Do not multiply a 24-hour yield figure by 365. A busy day's fees often come from a burst of price movement, and that is also when arbitrage takes the most from the pool. If the fee does not cover what the pair costs you in a day of normal movement, the position is losing money while the fee counter rises. Treat it as an activity you run, not as passive income.

## How picking a range multiplies your money

Your money only earns while the price is inside your band [2]. So the narrower the band, the more of your money is backing trades at any moment, and the more fees each dollar collects.

The multiple depends only on how far apart your two bounds are.

$$
\mathcal{E} = \frac{1}{1 - \left(\frac{P_l}{P_u}\right)^{1/4}}
$$

Where:

- $P_l$ is the bottom of your band.
- $P_u$ is the top of it.
- $\mathcal{E}$ is how many times more depth your money backs than a full-range deposit, assuming the current price sits near the middle of the band.

The numbers get large quickly. A stablecoin pair held between 0.999 and 1.001 backs about two thousand times the depth. An ETH pair held within plus or minus 5% backs about forty times.

That same number multiplies what arbitrage takes from you while you are in range. A forty-times band earns forty times the fees and loses value forty times as fast. Research on Uniswap v3 makes the same point: narrowing the range raises both the fees and the impermanent loss (the shortfall against simply holding the tokens) [7]. The base mechanics are in [Constant Product Formula](/guides/constant-product-formula/).

## Three states your position can be in

| Where the price is | What you hold | What you earn | What to do |
| :--- | :--- | :--- | :--- |
| Below your lower bound | All of the risky token | Nothing | Decide whether to wait or re-range |
| Inside your band | A mix that shifts with every trade | Fees on every trade that crosses it | Nothing, this is the working case |
| Above your upper bound | All of the quote token | Nothing | You have effectively sold. Decide whether to re-enter |

The change is gradual inside the band, not a jump at the edge. As the price falls toward your lower bound, the pool keeps buying the falling token from sellers. By the time it crosses, you hold nothing but that token [2].

That mechanic can be used on purpose. A one-sided deposit just above the market behaves like a limit sell order. See [Range Orders on AMMs](/guides/range-orders-on-amms/).

## Two ways protocols slice up a price

Not every protocol concentrates liquidity the same way, and the difference changes how a trade fills.

**Uniswap-style ticks.** The price line is divided into ticks, steps of one hundredth of a percent. Your band's edges must land on the pool's tick spacing, a fixed multiple of those steps [1] [2]. A trade moves the price continuously until it reaches the next tick where liquidity starts or stops, then carries on with whatever liquidity is active there.

**Bin-style books.** Liquidity Book, built by Trader Joe (now LFJ), replaces the curve with flat price shelves called bins [6]. Only one bin is active at a time, and a trade fills at that bin's exact price until the bin runs out. Then the price moves to the next bin. How bin pricing works end to end, including the fee that rises with volatility, is in [Discretized Liquidity (DLMM) Explained](/guides/discretized-liquidity-dlmm-explained/).

| | Tick-based, Uniswap v3 and v4 | Bin-based, Liquidity Book |
| :--- | :--- | :--- |
| Price inside your zone | Moves continuously as trades fill | Fixed until the bin runs out [6] |
| Fee | Fixed tiers on v3; any fixed fee or a hook-set fee on v4 [3] | Rises automatically when markets turn volatile [6] |
| Your position is | An ERC-721 NFT, from the position manager on both v3 and v4 [9] [10] | A share of each bin you funded |
| Cost of crossing | Extra gas each time a trade crosses an active tick [2] | Extra gas for each bin a trade steps through |

## Why narrow ranges lose value faster

Most people measure a pool position against simply holding the tokens. That gap, impermanent loss, depends on where the price ends up.

A second measure is loss-versus-rebalancing, or LVR — the value arbitrage traders take because your pool's price only catches up when someone trades against it [4]. Its expected rate depends on how volatile the pair is, not on where the price ends, so you can estimate it before you deposit.

$$
\frac{d(\text{LVR})}{dt} = \frac{\sigma^2}{4} \cdot L \cdot \sqrt{P}
$$

Where:

- $\sigma$ is how much the pair moves, as annual volatility.
- $L$ is your liquidity working at the current price.
- $P$ is the current price.

For the same deposit, a band's $L$ is the efficiency multiple from earlier times a full-range position's $L$. Narrow the band, raise $L$, and this rate rises in proportion, but only while the price is inside the band [4]. For a full-range position the rate works out to about σ²/8 of its value per year. How this connects to impermanent loss is covered in [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Just-in-time liquidity: who takes the fee on a big trade

One pattern on concentrated pools is worth knowing about before you deposit [8].

Someone watching pending transactions sees a large swap about to land. They do three things in one block:

1. **Just before the swap**, they add a large amount of liquidity in exactly the tick where it will execute.
2. **The swap runs.** Because their deposit is now most of the liquidity at that price, they collect most of the fee.
3. **Just after**, they remove it, principal plus fee, having held the position for a few seconds.

This is called just-in-time liquidity. On that one trade, it dilutes your share of the fee. It is a form of MEV — maximal extractable value, profit from choosing the order transactions run in [11]. Uniswap Labs' own analysis found it rare: in most months it studied, under 0.5% of volume traded against it, almost all on very large swaps, where it also gave the trader a better price [8]. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/) for the wider pattern.

## What Uniswap v4 changed

Two changes matter for anyone running ranges.

**Every pool lives in one contract.** Uniswap v3 deployed a separate contract per pool. v4 holds every pool in a singleton — one contract containing all of them [5]. It also uses flash accounting — it tracks what each party owes during a transaction and settles once at the end, using transient storage (scratch memory that is wiped after each transaction) [5] [12]. The effect is cheaper pool creation and fewer token transfers when one transaction does several things, such as removing a position and adding a new one.

**Pools can run custom code.** A hook is a contract that the pool calls before or after actions such as swaps and deposits [3]. Three uses matter to providers:

- Fees that rise when the market gets volatile, so arbitrage pays more of what it costs you [3].
- Withdrawal fees or minimum holding times, which make the just-in-time pattern unprofitable [3].
- Limit orders that fill at tick prices [3].

A hook is somebody else's code. Check what it is allowed to do, and whether it can be changed after you deposit.

## If you would rather not manage it

Vaults, also called automated range managers, run ranges for you. They take your deposit, choose the band, move it when needed, and give you a fungible token in return.

They generally run one of three playbooks:

- **A tight earning band plus a wide buffer band.** When the price drifts past a trigger, a keeper moves both.
- **A deliberately lopsided band**, tilted toward accumulating one of the two tokens.
- **A hedged band**, where the vault shorts the underlying to offset the price exposure and keep mostly the fees.

The tradeoffs are the same as doing it yourself, plus two more: contract risk and a management fee. A vault that re-centres mechanically during a trend sells after each move, locking in the divergence each time. Studies of real v3 positions find that results vary widely and the larger returns come with more risk [7]. See [Liquidity Pool Tokens](/guides/liquidity-pool-tokens/).

## What to check before you deposit

1. **Size the band against real volatility.** For a pair with no trend, the expected time before the price touches an edge is roughly the half-width divided by the typical daily move, squared, in days. A plus or minus 5% band on a pair that moves 2.5% a day lasts about four days on average.
2. **Check the fee tier against the loss to arbitrage.** Annual volatility squared, divided by eight, is roughly the yearly loss on a full-range position [4]. Multiply it by your band's efficiency multiple for the time you are in range, and make sure the fees clear that.
3. **Budget the gas.** Adding, collecting, re-ranging and exiting all cost gas. Narrower bands need more re-ranging, which is the core tradeoff in choosing a range [13].
4. **Decide the out-of-range rule now.** Write down what you will do if the price crosses either edge, before it does.
5. **On v4, read the hook.** What can it change, and can anyone change it later?

For the practical sequence of picking a pair and minting a position, see [How to Provide Liquidity](/guides/how-to-provide-liquidity/).

## Where to watch the numbers

- **Your position against simply holding:** [Revert Finance](https://revert.finance).
- **Where the liquidity actually sits in a pool:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **The price crossed your boundary.** You hold one token and earn nothing. Decide whether this is a lasting repricing or a temporary swing. Re-ranging locks in your current token mix, so it only pays if the new band will earn back the cost.
- **Fees are coming in but your value keeps falling.** The pair moves more than the fee tier covers. Widen the band, move to a higher tier, or hedge the exposure.
- **Fees dropped while volume stayed high.** First check whether you are out of range, or whether new liquidity in your band has diluted your share. Just-in-time liquidity is a rarer cause, and shows up as an add, a swap and a removal in the same block.

## Choose your width next

The boundary case has its own guide, [Out-of-Range Liquidity](/guides/out-of-range-liquidity/). For choosing the width itself, see [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/), and for how a band is stored, [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/). Tier choice is covered in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/), and version differences in [Uniswap v3 vs v4](/guides/uniswap-v3-vs-v4/). To test a specific band, use the [concentrated liquidity calculator](/tools/uniswap-v3-liquidity-calculator/#price=3000&lower=2700&upper=3300&capital=10000&tier=0.0005).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Concentrated Liquidity | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Understanding Uniswap v4 Hooks | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/hooks)
6. [Liquidity Book DLMM: Primer (LFJ Documentation)](https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873)
7. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
8. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
9. [ERC-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)
10. [Position Manager | Uniswap Developers](https://developers.uniswap.org/docs/protocols/v4/guides/position-manager)
11. [Maximal extractable value (MEV) | ethereum.org](https://ethereum.org/en/developers/docs/mev/)
12. [EIP-1153: Transient storage opcodes (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-1153)
13. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity | Uniswap Developers"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://developers.uniswap.org/docs/get-started/concepts/hooks "Understanding Uniswap v4 Hooks | Uniswap Developers"
[6]: https://docs.lfj.gg/lfj-dex/liquidity/liquidity_book-_primer_6893873 "Liquidity Book DLMM: Primer | LFJ"
[7]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[8]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[9]: https://eips.ethereum.org/EIPS/eip-721 "ERC-721: Non-Fungible Token Standard"
[10]: https://developers.uniswap.org/docs/protocols/v4/guides/position-manager "Position Manager | Uniswap Developers"
[11]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV) | ethereum.org"
[12]: https://eips.ethereum.org/EIPS/eip-1153 "EIP-1153: Transient storage opcodes"
[13]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
