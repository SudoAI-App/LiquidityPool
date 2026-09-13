---
title: "MEV and Liquidity Providers: Sandwiches, JIT Liquidity and Toxic Flow"
description: "Three ways transaction ordering takes money out of your pool position, how to tell how much is happening, and what actually defends against each one."
category: "Risk & Research"
date: 2026-08-27
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "7 min read"
keywords: "MEV liquidity providers, JIT liquidity, sandwich attacks, LVR, toxic order flow, Uniswap v4 hooks, MEV-Share, PBS, how does MEV affect liquidity providers, sandwich attacks liquidity pools, adverse selection AMM"
featured: false
faq:
  - q: "How does MEV affect liquidity providers?"
    a: "Most of it arrives as arbitrage that reprices a stale pool quote, transferring value from LPs to searchers and block builders. A smaller part, just-in-time liquidity, dilutes the fees passive LPs earn on the largest trades."
  - q: "What is a sandwich attack?"
    a: "A searcher buys immediately before a victim's trade and sells immediately after, profiting from the price movement the victim's own order creates. The profit is bounded by the slippage tolerance the victim set."
  - q: "Can liquidity providers avoid MEV?"
    a: "Not individually, but pool design changes the exposure: dynamic fees price volatility, auctions can return arbitrage profit to LPs, and batch settlement removes the ordering advantage that makes extraction possible."
---

Your transactions are public before they happen. Anyone can read them, and somebody decides what order they run in. That is the whole story behind why pool positions underperform what the dashboard promised.

The name for value taken this way is MEV — money captured purely by controlling the sequence transactions execute in. Some of it lands on traders. Most of it lands on you, quietly, every day.

This guide covers the three ways it reaches your position, how to measure how much is happening in a pool you are considering, and which defences actually work.

<figure class="article-figure">
  <img src="/images/guides/mev-and-liquidity-providers.webp" alt="Three transactions move through a public lane around an AMM curve in sandwich-style order." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Transaction ordering can change the execution around a visible swap. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"This is not a technical curiosity. It is money leaving your position. Fee sniping takes the payday without taking any risk, and cross-venue arbitrage buys your cheap token and sells you the expensive one all day. If you care about the outcome, choose pools that fight back: private routing, adaptive fees, or an auction that pays the proceeds back to depositors."*

## Who decides what order your trades run in

Blocks are not assembled by the network at random. There is a supply chain, and every step in it has an incentive [2] [3].

| Step | Who they are | What they do |
| :--- | :--- | :--- |
| Searchers | Bots on very fast connections | Read pending trades and construct profitable bundles |
| Builders | Firms that assemble blocks | Combine those bundles with ordinary traffic to maximise their take |
| Relays | Trusted intermediaries | Pass the winning block to whoever proposes it |
| Proposers | Validators | Sign whatever block pays them most |

The consequence for you is simple. Builders control ordering completely, so your pool gets traded against with precision, at the top of every block, before anyone else gets a look.

## The three ways it reaches your position

### One: somebody is always faster than your pool

This is the big one, and it never stops [4].

Real price discovery happens on exchanges that match trades in microseconds. Your pool updates when a transaction gets included, maybe every twelve seconds. That gap is a standing opportunity.

ETH rises 1% somewhere fast. At the top of the next block, a bot buys your now-cheap ETH until your pool's price catches up. ETH falls 1%, and the same bot sells you expensive ETH [4] [5].

So the pool sells the winner below market and buys the loser above it, constantly. The formal name for what that costs is loss-versus-rebalancing, or LVR — value handed over purely because your quote runs late. It builds with every move, whether or not the price later returns, which is why it is the number your fees have to beat. Impermanent loss — the simpler gap between a pool position and holding — only tells you where one path happened to end. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

### Two: sandwiching, which hurts your customers

When somebody submits a swap with a loose tolerance setting and no protection, a bot can wrap it.

1. Buy just before them, pushing the price up.
2. Their trade executes at the worst rate they allowed.
3. Sell just after, back into the pool at the raised price.

Your pool collects fees on all three, so this looks like a good day. It is not [1] [6] [7].

The trader got a bad fill and will use a venue that protects them next time, taking their fees with them. Meanwhile the artificial price swings push range positions toward their edges for no economic reason at all.

### Three: fee sniping, which targets you specifically

This one exists because of concentrated liquidity, and it is aimed squarely at passive depositors [8].

A bot sees a large trade coming. Instead of trading, it does three things in one block:

1. Deposits a huge amount of liquidity at exactly the price where the trade will land.
2. The trade executes. The bot now owns most of the liquidity there, so it takes most of the fee.
3. It withdraws everything immediately, principal plus fee.

Put numbers on it. A \$5M injection sits in front of a 500 ETH swap paying \$7,500 in fees at a 0.30% tier. The bot takes about \$7,350. Everyone who has held that position through weeks of volatility splits \$150 [8].

The asymmetry is the point. The bot carried risk for zero blocks. You carried it all month. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## Not all volume is worth the same

Split what goes through a pool into two piles [5].

**Real traders** are buying a token, rebalancing a portfolio, or routing through an aggregator. They have no idea where the price goes next. Their fees are genuine income.

**Fast traders** are correcting a stale quote. Every one of their trades takes more out of your position than the fee puts back [4] [5].

| | Real traders | Fast traders |
| :--- | :--- | :--- |
| Who they are | Retail, apps, solvers, aggregators | Arbitrage bots, sandwichers, fee snipers |
| What they know | Nothing about the next ten minutes | Exactly where the price is going |
| What they cost you | Nothing, they pay you | More than the fee they pay |
| What you want | As much as possible | As little as possible |

A pool whose volume is mostly the second kind is not a business you are participating in. It is a mechanism for moving your money elsewhere.

## What people get wrong about this

| What people assume | What actually happens |
| :--- | :--- |
| More volume means more profit | Arbitrage volume takes more in value than it pays in fees. Check where the volume comes from |
| Sandwiching is good for me, double fees | It gives your customers bad fills, drives them away, and churns your ranges for no reason |
| Fee sniping is just competition | The sniper carries risk for zero blocks and free-rides on depth you provided all month |
| Moving to a cheaper chain fixes it | It changes who decides the ordering. The stale-quote problem is identical |

## What actually defends against each one

### Route orders privately

Rather than broadcasting to a public queue, send trades through a private auction [3]. Bots bid for the right to trade behind you rather than in front, and a share of what they pay comes back to you or the pool. Sandwiching stops being possible.

### Settle in batches

Intent systems take a different route entirely [6]. You state what you want and professional fillers compete to deliver it. CoW Swap settles orders in batches at a single clearing price, and UniswapX runs a short auction among fillers for each order. Either way, there is no public pending trade to get in front of. See [AMM vs Order Book](/guides/amm-vs-order-book/).

### Pick pools with defensive code

Uniswap v4 pools can attach custom code that addresses each vector directly [7]:

| Defence | What it stops | How |
| :--- | :--- | :--- |
| Private routing | Sandwiching | A wallet or router setting rather than pool code. Your trade stays hidden until it executes |
| Minimum holding time | Fee sniping | Liquidity must stay for more than one block |
| Fees that track volatility | Stale-quote arbitrage | Arbitrage pays a wide spread exactly when it is taking most |
| Auctioning the first trade | Stale-quote arbitrage | The right to correct the price is sold, and the proceeds go to depositors |

That last one is the most interesting. It turns the biggest leak into a revenue line.

## What to check before you deposit

1. **Which chain, and how is ordering decided?** A mature auction market behaves differently from a single sequencer, but neither removes the stale-quote problem.
2. **What share of swaps come from bot contracts?** Onchain analytics will tell you. Above 60% and the fee income is not what it looks like.
3. **How often does fee sniping happen here?** Look at recent large trades and check whether liquidity appeared and vanished around them.
4. **Is the fee tier high enough?** A 0.05% tier on a volatile pair is an invitation. A 0.30% or 1.00% tier makes marginal arbitrage unprofitable [4].
5. **Does the pool have defensive code, and has it been audited [7]?**

## Where to watch the numbers

- **Sandwiches, bundles and searcher profit:** [EigenPhi](https://eigenphi.io).
- **Who is building blocks and what they are paying:** [MevBoost.pics](https://mevboost.pics).
- **What share of a pool's trades are bots:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **Liquidity appeared and vanished in one block around a big trade.** You were fee-sniped. Move to a pool with a minimum holding rule or an adaptive fee.
- **Large trades through your pool keep getting sandwiched.** Traders are submitting unprotected transactions with loose tolerances. Tell them to use a private relay or a batch auction.
- **Fees are not keeping up during volatile stretches.** Bots are taking stale quotes faster than the fee compensates. Avoid tight ranges in fixed-fee pools around scheduled announcements.

## Where to go next

The formal measure of what all this costs is developed in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/). The trader's side of the same problem is slippage — the gap between the quote you saw and the fill you got — set against price impact, which is the cost your own order size creates. Both are covered in [Slippage and Price Impact](/guides/slippage-and-price-impact/).

## References

1. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Flashbots Documentation: MEV and Proposer-Builder Separation](https://docs.flashbots.net/)
3. [Ethereum Foundation: Maximal Extractable Value (MEV)](https://ethereum.org/en/developers/docs/mev/)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)
6. [CoW Protocol Documentation](https://docs.cow.fi/)
7. [Uniswap v4 Core Whitepaper](https://uniswap.org/whitepaper-v4.pdf)
8. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
9. [Quantifying Blockchain Extractable Value: How Dark is the Forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[2]: https://docs.flashbots.net/ "Flashbots Documentation: MEV and Proposer-Builder Separation"
[3]: https://ethereum.org/en/developers/docs/mev/ "Ethereum Foundation: Maximal Extractable Value (MEV)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
[6]: https://docs.cow.fi/ "CoW Protocol Documentation"
[7]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[8]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[9]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How Dark is the Forest? (Qin et al., 2021)"
