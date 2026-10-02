---
title: "Curve v2 Explained: Cryptoswap, Internal Oracles and TriCrypto Pools"
seoTitle: "Curve v2 Explained: Cryptoswap, Oracles and TriCrypto Pools"
description: "How Curve v2 moves its own liquidity to follow the market, why it only pays for that out of fees, and when a TriCrypto pool is and is not the right place to be."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "Curve v2"
keywords: "Curve v2, Cryptoswap invariant, dynamic pegging, internal EMA oracle, TriCrypto pool, AMM repegging, Curve liquidity pool, volatile pair liquidity pool"
featured: false
faq:
  - q: "What is Curve v2 used for?"
    a: "Volatile pairs that still benefit from concentrated depth. It keeps liquidity clustered around an internally tracked price and repegs that centre automatically as the market moves, without the LP choosing bounds."
  - q: "How is Curve v2 different from Uniswap v3?"
    a: "Uniswap v3 asks the liquidity provider to choose and maintain a range. Curve v2 concentrates liquidity automatically around an internal oracle price and shoulders the rebalancing decision at the protocol level, funded by trading fees."
  - q: "What are the risks of an internal oracle?"
    a: "The repegging mechanism relies on the pool's own exponentially weighted price. Sharp moves can leave the centre lagging, and repegging itself consumes pool profits, so LP returns depend on the interaction between volatility and the repeg schedule."
  - q: "Does Curve v2 use an external price oracle to re-centre?"
    a: "No. It re-centres around a smoothed average of its own trade prices, subject to a profit budget. That internal memory is why one block cannot rewrite the centre, and why a quiet pool can lag a fast market."
---

Choosing a price range is the part of liquidity provision most people get wrong. Pick it too wide and you earn almost nothing. Too narrow and the market walks out of it while you sleep.

Curve v2 takes that decision away from you. The pool concentrates its own money around the current price, and when the market moves, the pool moves itself to follow. You deposit and you leave it alone.

The interesting part is how it pays for moving. By the end you should be able to tell whether a given pool trades enough to keep its price current, and when this design is the wrong place for your money.

<figure class="article-figure">
  <img src="/images/guides/curve-v2-cryptoswap-explained.webp" alt="A liquidity curve centred on an internal price, shown before and after the pool moves its centre, with a profit budget that funds the move." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The pool concentrates depth around its own smoothed price, and only moves that centre when fees it has already earned can pay for the move. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The design rests on a budget. In a range-based pool you pay for every re-centring yourself. Here the pool pays, and only out of fees it has already banked. If the market moves faster than the pool earns, it declines to move. That protects your deposit from costly rebalancing. It also means a quiet pool in a fast market can keep its liquidity centred on an old price for a long time.

## The problem this design solves

Two older approaches, two weak outcomes.

A full-range pool spreads money across every price that could ever exist. It never needs attention, and most of the money sits at prices that never trade.

A range-based pool packs money where the trading happens, which works well until the price leaves. Then your position earns nothing [1]. Moving it costs gas [2], and it locks in whatever loss against holding the move has built up. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/) for what that costs.

Curve v2 keeps the density and automates the moving [4]. Curve's own documentation calls the design Cryptoswap and treats "Curve v2" as an unofficial name [5].

## How the curve changes shape as it goes

The older Curve design, StableSwap, assumes the tokens should trade at a fixed peg and concentrates liquidity there [3]. Cryptoswap drops that assumption. It keeps an internal idea of what each token is worth, called the price scale, and centres its liquidity there instead [4] [5].

The shape of the curve is then controlled by two dials [5].

| Dial | What it controls | Turning it up |
| :--- | :--- | :--- |
| Amplification (A) | How much liquidity sits right at the centre | Deeper liquidity at the current price |
| Gamma | How quickly liquidity falls away from the centre | Liquidity spread over a wider price range |

The behaviour is what matters. Near the centre, the curve is nearly flat, so trades clear at little cost. Push the pool far out of balance and it bends toward an ordinary constant-product curve [4]. Curve's whitepaper reports that, in simulations on historical prices, this gave 5 to 10 times the liquidity of a constant-product pool [4]. How that shape compares with the other curve families is the subject of [Bonding Curves and AMM Invariants](/guides/bonding-curves-and-amm-invariants/).

That bend is a safety feature. A curve that stayed flat everywhere would let a falling asset drain the pool before its price moved enough to stop it [3]. Compare with the pegged-pair case in [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## The price the pool believes

A smart contract cannot look up a price on an exchange by itself [9]. The pool has to work out a price from its own trades, without letting one trader rewrite it in a single block.

Cryptoswap keeps a moving average of its own trade prices. The longer since the last update, the more weight the newest price gets [4].

$$
P_{\text{oracle}} = (1 - \alpha) \cdot P_{\text{last}} + \alpha \cdot P_{\text{previous}}
$$

Where:

- $P_{\text{last}}$ is the pool's price after the most recent trade.
- $P_{\text{previous}}$ is the average as it stood at the last update.
- $\alpha$ is the weight kept on the old average. It shrinks as time passes, and after one half-life it is one half [4].

The half-life is set per pool. In the Tricrypto-NG pool used as the example in Curve's documentation, the averaging setting is 600 seconds, which works out to a half-life of about seven minutes [6]. The average updates at most once per block, and the price fed into it is capped at twice the pool's current centre [6].

The averaging is the defence. A trader who pushes the price in one block barely moves a number built from many minutes of history, and the pool moves its centre toward that average rather than toward the last trade [5]. The cost is lag. This pool is never the fastest quote in the market, by design.

## The rule that stops it rebalancing badly

Re-centring is not free. Moving liquidity to a new price means selling what has risen and buying back at the new level. That turns a paper shortfall against holding into a realised one [5].

Cryptoswap only re-centres when two things are true. The average price has moved more than a minimum step, and the pool can afford the move [5].

Affordability is measured with virtual price — the value of the pool's holdings at its own internal price, per LP share [4]. Every trade pays a fee, which pushes virtual price up. The fee rises as the pool gets more lopsided. In the Tricrypto-NG example pool it runs from about 0.015% when balanced to a ceiling of 1.4% [7]. The pool also keeps a running record of all the profit it has ever made. That record sets the rebalancing budget.

Before it moves its centre, the pool works out the result and checks one condition [4].

$$
VP_{\text{after}} \ge 1 + \frac{X - 1}{2}
$$

Where:

- $VP_{\text{after}}$ is what the virtual price would be if the move went ahead.
- $X$ is the pool's running profit record, which starts at 1 when the pool opens and grows as fees come in.

In plain terms, a move may spend profit, but it must leave at least half of everything the pool has earned in place. If the move would cost more, the pool keeps its current centre and waits for more fee income [4] [5]. Rebalancing is paid from fees rather than from your principal.

Two consequences follow. First, a rising virtual price is not the same as making money in dollars. It measures value per share at the pool's own prices, so if ETH and BTC both fall, your position still loses value. Second, a pool can get stuck. Curve's documentation describes the loop: as the market moves away from the pool's centre, the pool offers less depth at the market price, earns fewer fees, and so cannot afford to catch up [5].

## What a TriCrypto pool holds

The best-known use of this design is the TriCrypto family. Its current version, Tricrypto-NG, holds three assets that are not pegged to each other in one pool [7].

| Slot | Example | Role |
| :--- | :--- | :--- |
| Quote | USDT, USDC or crvUSD | The dollar reference |
| First volatile asset | Wrapped BTC | Trades against both other legs |
| Second volatile asset | Wrapped ETH | Trades against both other legs |

Other three-asset pools follow the same pattern. Curve's documentation uses one that pairs crvUSD with wrapped ETH and CRV [6].

The practical gain is routing. Any of the three tokens can be swapped for either of the others in one trade, against one shared pool, and the pool re-centres all three prices together [4]. Multi-asset pools come in another form entirely — value-weighted baskets rather than a shared curve — covered in [Balancer Weighted Pools](/guides/balancer-and-weighted-pools/).

## Where StableSwap and Cryptoswap differ

| | StableSwap (Curve v1) | Cryptoswap (Curve v2) |
| :--- | :--- | :--- |
| Built for | Assets meant to track each other [3] | Assets that move freely [5] |
| Centre of liquidity | Fixed at the peg [3] | Moves toward a smoothed internal price [4] |
| Price source | None needed | Its own moving average [6] |
| Fee | Set per pool; Stableswap-NG pools raise it when off-peg [8] | Rises with imbalance, between a balanced and a maximum fee [4] [7] |
| Rebalancing | None | Automatic, paid from fee profit [5] |

## What to check before you deposit

1. **How much does it actually trade?** Daily volume against pool size tells you whether there will be enough fee income to fund rebalancing.
2. **Is the pool already stuck?** On the pool's page, compare the price scale (where liquidity was last centred) with the price oracle (the moving average). Curve's documentation shows where to find both [5]. A wide gap means the liquidity is stranded.
3. **Does the fee cover the bleed?** The faster a pair moves, the more value the pool hands to arbitrageurs (traders who close the gap between the pool and the market) [10]. Compare the fee range against how much the pair usually moves.
4. **What are the wrapped assets backed by?** In a TriCrypto pool, confirm the Bitcoin and Ethereum legs are the versions you intend to hold.
5. **How will you exit?** Taking out a single asset is priced like a trade against the pool, so in a lopsided pool it costs you price impact — the worse rate a trade gets because it shifts the pool's balances. A proportional withdrawal avoids that.
6. **How much of the yield is emissions?** Separate fee income from token rewards. Only fee income funds rebalancing.

The first check is measurable: the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) turns a pool's volume and your share of it into the fee income that has to fund those rebalances.

## Where to watch the numbers

- **Pool state, price scale and price oracle:** the pool's page on [Curve Finance](https://curve.fi).
- **Yield split between fees and emissions:** [DeFiLlama](https://defillama.com).
- **How much aggregator flow the pool actually gets:** [Dune Analytics](https://dune.com/curve).

## When something goes wrong

- **The pool's price is far from the market.** The average has not caught up, or the pool cannot afford to re-centre. Curve's documented fixes are slow: a governance vote to change A and gamma, a new pool, or deliberately generated volume [5]. As a depositor, decide whether you are willing to wait.
- **The pool has stopped re-centring during a big move.** Fees are not covering the cost, so the rule is blocking the move. Watch whether volume returns before adding more.
- **You are behind a simple hold.** Each re-centring locks in some loss against holding, paid from fees. If fees are thin relative to how much the pair moves, the pool can trail holding even while virtual price rises.

## Where to go next

If you want to compare this with managing the same decision by hand, read [Out-of-Range Liquidity](/guides/out-of-range-liquidity/). To see where Cryptoswap sits among the alternatives, read [Types of Liquidity Pools](/guides/liquidity-pool-types/).

## References

1. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
3. [Curve StableSwap Exchange: Overview (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
4. [Automatic market-making with dynamic peg (Egorov, Curve Cryptoswap whitepaper, 2021)](https://docs.curve.finance/pdf/whitepapers/whitepaper_cryptoswap.pdf)
5. [Cryptoswap: In Depth (Curve Documentation)](https://docs.curve.finance/developer/amm/cryptoswap-in-depth)
6. [Tricrypto-NG Oracles (Curve Documentation)](https://docs.curve.finance/developer/amm/tricrypto-ng/pools/oracles)
7. [CurveTricryptoOptimized (Curve Documentation)](https://docs.curve.finance/developer/amm/tricrypto-ng/pools/tricrypto)
8. [Stableswap-NG: Overview (Curve Documentation)](https://docs.curve.finance/developer/amm/stableswap-ng/overview)
9. [Oracles (ethereum.org)](https://ethereum.org/en/developers/docs/oracles/)
10. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[2]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[3]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview (Curve Documentation)"
[4]: https://docs.curve.finance/pdf/whitepapers/whitepaper_cryptoswap.pdf "Automatic market-making with dynamic peg (Egorov, Curve Cryptoswap whitepaper, 2021)"
[5]: https://docs.curve.finance/developer/amm/cryptoswap-in-depth "Cryptoswap: In Depth (Curve Documentation)"
[6]: https://docs.curve.finance/developer/amm/tricrypto-ng/pools/oracles "Tricrypto-NG Oracles (Curve Documentation)"
[7]: https://docs.curve.finance/developer/amm/tricrypto-ng/pools/tricrypto "CurveTricryptoOptimized (Curve Documentation)"
[8]: https://docs.curve.finance/developer/amm/stableswap-ng/overview "Stableswap-NG: Overview (Curve Documentation)"
[9]: https://ethereum.org/en/developers/docs/oracles/ "Oracles (ethereum.org)"
[10]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
