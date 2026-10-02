---
title: "DLMM Explained: Bin-Based Liquidity, Dynamic Fees and Meteora"
seoTitle: "DLMM Explained: Bin Liquidity, Dynamic Fees and Meteora"
description: "How bin-based pools give trades a flat price, how the fee raises itself when the market moves fast, and how to shape your deposit across the bins."
category: "LP Mechanics"
date: 2026-09-10
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "9 min read"
primaryQuery: "DLMM"
keywords: "DLMM, discretized liquidity, Trader Joe Liquidity Book, Meteora DLMM, zero slippage bins, volatility accumulator, bin step, DLMM explained, DLMM vs concentrated liquidity, liquidity bins crypto, Liquidity Book, volatility accumulator DLMM"
featured: false
faq:
  - q: "What is DLMM?"
    a: "DLMM stands for Dynamic Liquidity Market Maker, Meteora's name for pools that divide the price axis into fixed bins, a design that follows LFJ's Liquidity Book. Each bin quotes a single price, so a trade that stays inside one bin has no price impact, and price moves in steps as bins are used up."
  - q: "How is DLMM different from concentrated liquidity?"
    a: "Range-based concentrated liquidity, as on Uniswap v3, prices trades on a continuous curve inside your chosen range. DLMM splits the range into discrete fixed-price bins that you can fill in different shapes, and adds a fee that rises when price crosses many bins in a short time."
  - q: "What are zero slippage liquidity bins?"
    a: "In a bin-based design, each bin quotes one fixed price, so a trade that stays inside one bin executes with no price movement. Price changes only when a trade empties a bin and moves on to the next one, so larger trades still pay more as they cross bins."
  - q: "What is a volatility accumulator in DLMM?"
    a: "A running measure of how far price has moved across bins in recent trades. It decays after a quiet spell and resets after a longer one. Its value feeds a squared term in the fee, so rapid movement raises the fee while a calm market lets it fall back to the base rate."
---

In most pools, the price you get worsens while your own trade executes. Even a small swap nudges it, because the price sits on a curve that bends with every unit you buy.

Bin-based pools work differently. They cut the price range into small steps called bins, and every trade inside one bin happens at exactly one price. Nothing moves against you until that bin runs out.

Two designs work this way: Liquidity Book, built by Trader Joe (now LFJ), and Meteora's DLMM on Solana. By the end you will know how bins quote prices, how these pools raise their own fee when the market moves fast, and how to decide where your deposit should sit.

<figure class="article-figure">
  <img src="/images/guides/discretized-liquidity-dlmm-explained.webp" alt="Price bins with the active bin holding both tokens, bins above holding one token and bins below holding the other, beside a fee that rises with recent bin crossings." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Each bin quotes one price, only the active bin holds both tokens, and the fee rises while price is crossing bins quickly. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> The flat price inside a bin is the headline, but the fee is the more useful idea. On a fixed-fee pool, a fast move pays the same rate as a quiet one. A bin pool measures the move from its own trades and raises the fee while the move lasts, with no outside price feed. That reduces what fast traders take from you. It does not remove it.

## How a bin quotes one fixed price

Picture the price axis cut into steps. Each step is a bin, and each bin holds its own inventory at one fixed price [3].

Only one bin is active at a time. In an AVAX/USDC pool, every bin above the active one holds only AVAX, waiting to be sold as the price rises. Every bin below holds only USDC, waiting to buy as the price falls. The active bin holds some of both, and that is where trading happens [3] [13].

Inside a bin the pool keeps one simple rule: the value of its two balances, counted at the bin's own price, stays the same as trades pass through [3] [5].

$$
P_i \cdot x + y = L_i
$$

Where:

- $P_i$ is the one price this bin quotes, in USDC per AVAX.
- $x$ is how much AVAX the bin holds.
- $y$ is how much USDC it holds.
- $L_i$ is the bin's liquidity, its total value counted in USDC.

Because the price in that rule is a fixed number rather than a ratio that shifts with the balances, a trade inside one bin has no price impact — the price does not move against you as the trade fills. Say the active bin quotes \$100 and holds 40 AVAX and \$3,000. A buyer takes 25 AVAX for \$2,500 plus the fee. The bin now holds 15 AVAX and \$5,500, and its value at \$100 is still \$7,000.

A second buyer who wants 20 AVAX gets the last 15 at \$100 and the other 5 at the next bin's price. The price steps rather than slides.

## How far apart the bins sit

The gap between bins is a setting called the bin step, quoted in basis points — hundredths of a percent [6]. Each bin's price is the one below it multiplied by one plus the step.

$$
P_i = \left(1 + \frac{\text{binStep}}{10{,}000}\right)^i
$$

Where:

- $\text{binStep}$ is the gap in basis points, so 10 means each bin is 0.1% above the last.
- $i$ is the bin's number, counted from the bin priced at exactly 1.

With a step of 10 basis points and a bin at \$1,000, the bin above sits at \$1,001 and the bin below at about \$999.00.

The step is fixed when a pool is created, and one pair can have several pools that differ only in their step [6]. Meteora allows steps of up to 400 basis points [13]. So choosing a step really means choosing which pool to join.

A tight step gives smooth prices but more bin crossings, and each crossing adds work to the trade. A wide step means fewer crossings and bigger jumps, which can send routed trades to a tighter pool.

Meteora's guidance pairs small steps with stable or very liquid pairs and larger steps with volatile tokens [13]. In practice, pegged pairs tend to use the smallest steps, liquid majors steps of up to about 25 basis points, and new or thin tokens 50 to 200. See [Constant Product Formula](/guides/constant-product-formula/) for what the curve-based alternative does instead.

## The fee that raises itself

Fixed fees have one weakness. During a fast move, when the pool's quote is most likely to be stale, the fee is the same as on a quiet day. That is when arbitrageurs — traders who profit by closing the gap between the pool's price and the wider market — take the most from liquidity providers [8].

A higher fee scales those arbitrage losses down [9]. A permanently high fee, though, also charges ordinary traders and leaves the pool's price less accurate [10]. Bin pools try to get the first effect without the second. The pool tracks how far price has moved across bins in recent trades, and lets that measure decay when trading goes quiet [4] [5].

$$
f_{\text{total}} = f_{\text{base}} + A \cdot (v_a \cdot s)^2
$$

Where:

- $f_{\text{base}}$ is the floor fee: a base factor set for the pool, multiplied by the bin step.
- $v_a$ is the volatility accumulator, the running count of recent bin crossings.
- $s$ is the bin step.
- $A$ is the variable fee control, a multiplier set for the pool.

The count is squared, so the fee climbs slowly at first and then steeply. The table uses one real set of settings: LFJ's WAVAX/USDC pool on Avalanche, which uses a step of 20 basis points, as read from the pool contract on 2 October 2026. Its base factor gives a 0.20% floor, its variable fee control is 20,000, and the count is capped at 35 bins.

| Bins crossed in quick succession | Variable part | Fee charged in that bin |
| :--- | ---: | ---: |
| None, a quiet market | 0.00% | 0.20% |
| 5 | 0.02% | 0.22% |
| 10 | 0.08% | 0.28% |
| 25 | 0.50% | 0.70% |
| 35 or more, the cap | 0.98% | 1.18% |

Fees are worked out bin by bin, so in one large sweep the first bins pay close to the floor and the later bins pay more [4]. Meteora uses the same structure, with a hard ceiling of 10% on the total fee [5].

So fast arbitrage pays a wider spread exactly when it takes the most, and ordinary traders see the floor fee the rest of the time. Impermanent loss — the amount a pool position falls behind simply holding the two tokens — still happens. The higher fee pays part of it back. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/) for how that loss builds.

## Three ways to spread your deposit

Because each bin is separate, you choose how much goes into each one. That is more control than a single range gives you [7] [13].

| Shape | What it looks like | Suits | The catch |
| :--- | :--- | :--- | :--- |
| Spot | The same amount in every bin you pick | Most pairs, when you have no strong view | Earns less than curve while price sits still, but keeps working as price moves across your range |
| Curve | Heavy in the middle, thinning toward the edges | Pegged pairs and range-bound markets | Highest fees while price stays near the centre, and goes out of range fastest when it leaves |
| Bid-ask | Light in the middle, heavy at the edges | Buying dips and selling rallies | Earns little until price reaches the edges, and behaves more like a ladder of limit orders than market making |

Any of the three can also sit on one side of the price only [7]. A one-sided deposit above the market sells as the price rises through it, at the bin prices you chose. Your fills carry no slippage — the gap between the price you expected and the one you got — because each bin's price is fixed.

## What your position is, technically

Uniswap v3 records each range as a separate position and issues it as an NFT, a unique token under the ERC-721 standard. No two ranges are interchangeable, so no two positions are either [1] [2].

Liquidity Book gives you a share of each bin you funded instead. The receipt is an LBToken, which works almost like the ERC-1155 multi-token standard, with one token ID per bin [3] [11]. Two people in the same bin hold the same token, so shares are fungible, and vaults or farms can be built on top without unpicking a custom range [3]. Since version 2.1, swap fees are added to each bin's reserves, so they grow your share and are paid out when you withdraw [4].

Meteora records each deposit in its own position account on Solana, not as a token. A position covers a continuous run of bins, 70 by default and up to 1,400, and tracks your share of each bin plus your fees and rewards [12]. Fees there do not compound. They wait until you claim them [12]. See [Liquidity Pool Tokens](/guides/liquidity-pool-tokens/) for how other receipts compare.

## How this compares with range-based pools

| | Range-based: Uniswap v3 and v4, Raydium CLMM | Bin-based: Liquidity Book and Meteora DLMM |
| :--- | :--- | :--- |
| Price inside your zone | Moves continuously with every trade | Flat until the bin empties |
| Defence against fast markets | A fixed fee tier, or custom code on v4 | Built in: the pool raises its own fee |
| Your position | An NFT for each range | Fungible bin shares on Liquidity Book, a position account on Meteora |
| What a big trade crosses | Ticks, where liquidity can change | Bins, each at its own fixed price |
| Where you find it | Ethereum and most EVM chains; Solana via Raydium | Avalanche, Arbitrum and Monad via LFJ; Solana via Meteora |

## What people get wrong about bin pools

| What people assume | What actually happens |
| :--- | :--- |
| A wide bin step protects me | It only makes the price jump in bigger steps. Routed trades may go to a tighter pool, and your fees fall |
| Piling everything into the active bin is best | It shows the highest yield while price sits still, and stops earning on the first real move |
| The yield I see will continue | Part of it can be the variable fee, which falls back to the floor when the market calms |

## What to check before you deposit

1. **Match the bin step to the pair.** Look at how far the price usually travels in an hour, and pick a pool whose step does not force constant crossings.
2. **Pick the shape on purpose.** Spot, curve or bid-ask, chosen from what you expect the market to do, not from which shows the biggest number.
3. **Read the fee settings.** The base factor, the variable fee control, the decay period and the cap on the count decide how much protection you get.
4. **Check the protocol's cut.** Meteora keeps 10% of the trading fee on standard pools and 20% on launch pools, and older pools can differ [5]. LFJ sets a share per pool, up to 25% [4].
5. **Write down your out-of-range rule** before the price gets there. A position that price has left earns nothing until price returns or you move it.
6. **Count transaction costs.** On Solana they are small. On EVM chains, adding, claiming and moving across many bins can cost more than a small position earns.

## Where to go next

Before you commit, model the shape and step in the [Meteora DLMM calculator](/tools/meteora-dlmm-calculator/#anchor=20&step=25&below=10&above=10&shape=curve). [Types of Liquidity Pools](/guides/liquidity-pool-types/) places bin designs among the alternatives, and [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) covers the boundary problem every range design shares. For the running decisions on Meteora itself, read [Meteora DLMM Strategy](/guides/meteora-dlmm-strategy/).

## References

1. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [ERC-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-721)
3. [Bin Liquidity (LFJ Developer Docs)](https://developers.lfj.gg/concepts/bin-liquidity)
4. [Fees (LFJ Developer Docs)](https://developers.lfj.gg/concepts/fees)
5. [DLMM Formulas (Meteora Documentation)](https://docs.meteora.ag/core-products/dlmm/formulas)
6. [Concentrated Liquidity (LFJ Developer Docs)](https://developers.lfj.gg/concepts/concentrated-liquidity)
7. [An Introduction to Liquidity Shapes (LFJ Documentation)](https://docs.lfj.gg/liquidity-book-resources/liquidity-book-dlmm-shapes-and-strategies/an_introduction_to_liquidity_shapes_6707938)
8. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
9. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
10. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
11. [ERC-1155: Multi Token Standard (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-1155)
12. [DLMM Dynamic Positions (Meteora Documentation)](https://docs.meteora.ag/core-products/dlmm/dynamic-positions)
13. [What is DLMM? (Meteora Documentation)](https://docs.meteora.ag/core-products/dlmm/what-is-dlmm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[2]: https://eips.ethereum.org/EIPS/eip-721 "ERC-721: Non-Fungible Token Standard (Ethereum Improvement Proposals)"
[3]: https://developers.lfj.gg/concepts/bin-liquidity "Bin Liquidity (LFJ Developer Docs)"
[4]: https://developers.lfj.gg/concepts/fees "Fees (LFJ Developer Docs)"
[5]: https://docs.meteora.ag/core-products/dlmm/formulas "DLMM Formulas (Meteora Documentation)"
[6]: https://developers.lfj.gg/concepts/concentrated-liquidity "Concentrated Liquidity (LFJ Developer Docs)"
[7]: https://docs.lfj.gg/liquidity-book-resources/liquidity-book-dlmm-shapes-and-strategies/an_introduction_to_liquidity_shapes_6707938 "An Introduction to Liquidity Shapes (LFJ Documentation)"
[8]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[9]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[10]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[11]: https://eips.ethereum.org/EIPS/eip-1155 "ERC-1155: Multi Token Standard (Ethereum Improvement Proposals)"
[12]: https://docs.meteora.ag/core-products/dlmm/dynamic-positions "DLMM Dynamic Positions (Meteora Documentation)"
[13]: https://docs.meteora.ag/core-products/dlmm/what-is-dlmm "What is DLMM? (Meteora Documentation)"
