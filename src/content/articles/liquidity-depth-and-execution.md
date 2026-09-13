---
title: "Liquidity Depth and Execution: The Only Number That Trades"
description: "Two pools of the same size can cost seven times as much to trade against. How to measure what actually fills your order, and why it vanishes under stress."
category: "Risk & Research"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "6 min read"
keywords: "liquidity depth crypto, liquidity pool depth, executable depth, market depth DeFi, pool depth vs volume, spot price vs execution price AMM"
featured: false
faq:
  - q: "What is liquidity depth in crypto?"
    a: "The amount of capital available to absorb a trade within a defined price band. In a pool it is the liquidity active near the current price, and it is the quantity that determines execution cost, unlike total value locked which counts deposits regardless of where they sit."
  - q: "How do you measure pool depth?"
    a: "Compute the value that can be traded before price moves by a set percentage, typically two percent in each direction. In concentrated pools this means summing liquidity across the ticks inside that band rather than reading a headline figure."
  - q: "Why does a large pool sometimes have bad execution?"
    a: "Because most of its capital can sit in price ranges the market is not trading in. A pool with large deposits parked far from the current price offers less executable depth than a smaller pool concentrated at the touch."
  - q: "What is the difference between spot price and execution price?"
    a: "Spot is the marginal price for an infinitesimally small trade. Execution price is the average you actually receive across the whole order, which is always worse because the trade moves along the curve as it fills."
  - q: "How much of a pool can I trade against?"
    a: "As much as your tolerance for price impact allows. A practical cap for most participants is the size that moves price by two to five percent, computed from active depth rather than from the pool's total value."
---

The headline figure counts deposits. Depth counts what can actually be traded right now. On range-based pools those two routinely differ by a factor of ten.

Only the second one has any bearing on what a trade costs or what a position earns.

Measuring it properly takes a few minutes. This guide shows you how, works two pools that look identical and are not, and covers the moment when depth vanishes.

<figure class="article-figure">
  <img src="/images/guides/liquidity-depth-and-execution.webp" alt="Price impact curves against order size for three pools with different active depth." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Three pools with the same headline deposits and very different executable depth. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"We size every position from the depth within 2% on both sides, never from the headline. It is the number that tells you what happens when you need to leave in a hurry, and it is usually a fraction of what the front page of an analytics site shows."*

## Defining it properly

Depth is meaningless without a price band attached. The question is always: how much can be traded before the price moves by some amount?

In an ordinary pool the answer comes straight from the balances:

$$
\text{impact} \approx \frac{\Delta x / x}{1 + \Delta x / x}
$$

Where:

- $\Delta x$ is your order size.
- $x$ is the pool's balance of what you are paying in.

In a range-based pool it takes more work. Liquidity is constant within each price step, so depth across a band is the sum across the steps it covers, converted to a value at the prices involved.

Bin designs are simplest. Each bin holds a known amount at a known price, so you add them up. See [Uniswap v3 Ticks and Position NFTs](/guides/uniswap-v3-ticks-and-lp-nfts/).

## Turning depth into a maximum order

The useful output is not a depth figure. It is the largest order you can send at a price impact — how far your own order pushes the rate — that you are willing to pay.

In an ordinary pool you can read it straight off the balance of the token you are paying in.

| Worst price you will accept, against the quote | Largest order, as a share of that balance |
| :--- | ---: |
| 0.5% worse | about 0.5% |
| 1% worse | about 1.0% |
| 2% worse | about 2.0% |
| 5% worse | about 5.3% |

So a pool holding \$4M of USDC takes roughly a \$40,000 buy before your average price is 1% worse than the screen, before fees. In a range-based pool, use only the balance sitting inside the band your order will cross, which is usually much smaller than the headline.

## Four reasons it differs from the headline

1. **Where the money sits.** Capital in ranges far from the price contributes nothing to what you can trade today.
2. **It is lopsided.** Depth above the price and below it are different numbers, often very different after a trend.
3. **It is split.** The same pair across several tiers, chains and venues has less usable depth at any one of them than the total implies.
4. **Some of it is fake.** Liquidity that appears only for the block containing a large trade and vanishes immediately flatters the measurement without helping anybody else.

See [TVL Explained](/guides/tvl-explained/).

## Two pools, same headline

Both showing \$40M on the same pair.

| | Pool A | Pool B |
| :--- | ---: | ---: |
| Headline size | \$40M | \$40M |
| Working within 2% of the price | \$26M | \$3.5M |
| What moves the price 1% | about \$3.2M | about \$440,000 |
| Cost of a \$500,000 buy, before fees | about 0.08% | about 0.6% |
| Cost of a \$2M buy, before fees | about 0.3% | over 5%, because it runs past the band |

Pool B is not broken. It may hold most of its liquidity in ranges placed for a different price, or be a wide-range pool on a volatile pair.

But routers send size to Pool A, which means Pool A's providers earn the fees. And anyone who assumed the two were interchangeable pays the difference in price impact — the way an order pushes the rate against itself — plus slippage, the gap between the quote and the fill. See [Slippage and Price Impact](/guides/slippage-and-price-impact/).

## Depth from the other side of the trade

If you are supplying, depth is the denominator of your fee share. Put money into a band that is already full and you capture a small fraction of what happens there.

That gives a counterintuitive result. A pool with thin depth can be a better place to supply than a deep one, as long as the volume still routes to it.

The number to compare is fee revenue per unit of liquidity in the band, not the pool's size. That is exactly what the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) works out.

The competition matters too. Depth in a band is not fixed. A reward programme or one large deposit can double it overnight, halving everybody's share with no change in volume at all.

## When depth disappears

Everything above is a snapshot, and the moments that matter most are exactly the ones where a snapshot is least useful.

During a sharp move, three things happen at once:

- **Range positions get pushed out and stop quoting.** The depth was there yesterday and is not there now.
- **Active providers withdraw** rather than hold inventory through it.
- **The trades arriving are larger**, because everybody reacts at the same time.

So depth measured on a quiet afternoon overstates what will be there during the window you actually need it. A pool showing \$26M within 2% on a Tuesday may show a small fraction of that during a liquidation cascade, and no average will show you that.

Two defences:

- **Size against a stressed assumption**, discounting the calm measurement substantially.
- **Look at historical depth during past volatile episodes.** That history is available and is a far better guide to your exit than today's reading.

## What people get wrong about depth

| What people assume | What actually happens |
| :--- | :--- |
| A big pool means a cheap trade | Only money near the price fills your order. The rest is decoration |
| Depth is symmetric | After a trend, the side you need is usually the thin one |
| Today's depth is tomorrow's | It thins fastest in exactly the conditions where you want it |
| Deep is always better to supply | A thin pool that still gets volume pays you far more per dollar |

## Depth and volatility together

Depth on its own is incomplete. A deep pool on a wildly volatile pair still produces bad outcomes for providers, because that same depth gets arbitraged over and over.

| | High turnover | Low turnover |
| :--- | :--- | :--- |
| **Deep** | The healthy case for everybody | Good fills, thin fees, idle capital |
| **Thin** | Great fee density, bad fills, fragile under stress | Avoid entirely |

Add volatility as the third axis. Thin and volatile is the one combination where you should neither supply nor route trades.

## The checklist

1. **Measure within 2% on both sides**, before trading or supplying.
2. **Convert that into a maximum order size** at the impact you will tolerate.
3. **Compare across tiers and venues** for the same pair, never in aggregate.
4. **If supplying, compute revenue per unit of liquidity** in your intended band.
5. **Re-measure after any reward programme starts.** Depth moves before volume does.
6. **Check the asymmetry after a trend.** The side you need may be the thin one.
7. **Never use the headline figure** as a proxy for any of this.

## Where to read it

- **Pool interfaces** publish a liquidity distribution chart. Read the steps around the current price, not the overall shape.
- **[Dune Analytics](https://dune.com)** exposes step-level liquidity for major pools, which lets you do the band calculation properly.
- **Aggregator quotes** are a practical shortcut. Request quotes at several sizes and see where the cost curve turns up.
- **Reading the contract** gives the authoritative answer: current price, liquidity, and the initialised steps around it.

Whichever you use, measure at the moment you intend to act. Depth changes every block.

Depth is the only liquidity number that participates in a trade. Everything else is an accounting summary of capital that may or may not be standing where the market is.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)
5. [On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)](https://arxiv.org/abs/2112.07386)
6. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
7. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest?"
[5]: https://arxiv.org/abs/2112.07386 "On the Quality of Cryptocurrency Markets: Centralized versus Decentralized Exchanges (Barbon & Ranaldo, 2021)"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[7]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
