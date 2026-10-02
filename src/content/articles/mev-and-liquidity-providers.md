---
title: "MEV and Liquidity Providers: Sandwiches, JIT Liquidity and Toxic Flow"
seoTitle: "MEV and LPs: Sandwiches, JIT Liquidity and Toxic Flow"
description: "Three ways transaction ordering takes money out of your pool position, how to tell how much is happening, and what actually defends against each one."
category: "Risk & Research"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "MEV liquidity providers"
keywords: "MEV liquidity providers, JIT liquidity, sandwich attacks, LVR, toxic order flow, Uniswap v4 hooks, MEV-Share, PBS, how does MEV affect liquidity providers, sandwich attacks liquidity pools, adverse selection AMM"
featured: false
faq:
  - q: "How does MEV affect liquidity providers?"
    a: "Most of it arrives as arbitrage that reprices a stale pool quote, transferring value from LPs to searchers and block builders. A smaller part, just-in-time liquidity, takes a share of the fees on some of the largest trades that passive LPs would otherwise earn."
  - q: "What is a sandwich attack?"
    a: "A searcher buys immediately before a victim's trade and sells immediately after, profiting from the price movement the victim's own order creates. The profit is bounded by the slippage tolerance the victim set."
  - q: "Can liquidity providers avoid MEV?"
    a: "Not individually, but pool design changes the exposure: dynamic fees price volatility, auctions can return arbitrage profit to LPs, and batch settlement removes the ordering advantage that makes extraction possible."
  - q: "Can an LP avoid MEV entirely while keeping a pool position?"
    a: "Not while the pool is public and anyone can trade against it. You can reduce exposure with wider ranges, fee tiers high enough to deter small arbitrage trades, and designs that raise fees when volatility spikes. Elimination would mean not quoting at all."
---

Your transactions are public before they run. Anyone can read them, and somebody decides what order they run in. That ordering power is a large part of why pool positions often underperform what the dashboard promised.

The name for value taken this way is MEV, short for maximal extractable value — the profit available to whoever controls the sequence in which transactions execute [1]. Some of it lands on traders. For liquidity providers, the largest part usually arrives as arbitrage against a price that has gone stale.

By the end you will know the three ways it reaches your position, how to measure it in a pool you are considering, and which defences work against each one.

<figure class="article-figure">
  <img src="/images/guides/mev-and-liquidity-providers.webp" alt="Three transactions move through a public lane around an AMM curve in sandwich-style order." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Transaction ordering can change the execution around a visible swap. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Transaction ordering moves money out of a pool position in measurable ways. Arbitrage buys from the pool below the market price and sells to it above, every time the outside price moves. Just-in-time liquidity takes fees on large trades without carrying risk between them. If the outcome matters to you, prefer pools and order flow that push back: private routing, fees that rise with volatility, or an auction that pays the proceeds to depositors.

## Who decides what order your trades run in

On Ethereum, blocks are not assembled at random. There is a supply chain, and every step in it has an incentive [1] [2].

| Step | Who they are | What they do |
| :--- | :--- | :--- |
| Searchers | Bots running trading algorithms | Read pending trades and construct profitable bundles |
| Builders | Firms that assemble blocks | Combine those bundles with ordinary traffic into the most profitable block |
| Relays | Intermediaries between builders and validators | Collect blocks from many builders and pass the most profitable one on |
| Proposers | Validators | Propose the block that pays them most |

The consequence for you is simple. Whoever builds the block controls ordering. Your pool gets traded against with precision, at the top of the block, before anyone else gets a look. The Bank for International Settlements describes this ordering power as a form of market manipulation that would be illegal in traditional markets [11].

## The three ways it reaches your position

### One: somebody is always faster than your pool

This is the largest of the three, and it never stops [3]. In one measurement across the major decentralised exchanges, arbitrage earned \$277M over 32 months, more than sandwich attacks or liquidations [10].

Prices on centralised exchanges update continuously. Your pool updates only when a transaction lands in a block, which on Ethereum happens every 12 seconds [5]. That gap is a standing opportunity.

ETH rises 1% elsewhere. At the top of the next block, a bot buys ETH from your pool until its price catches up. ETH falls 1%, and the same bot sells ETH to your pool at the old, higher price [3] [5].

So the pool sells the winner below market and buys the loser above it, again and again. The formal name for that cost is loss-versus-rebalancing, or LVR — what the pool gives up compared with a portfolio that holds the same tokens and rebalances at market prices [3]. It builds with every move, whether or not the price later returns, which is why it is the number your fees have to beat.

Impermanent loss — the shortfall against simply holding the two tokens — only tells you where one price path happened to end. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

### Two: sandwiching, which hurts your customers

When somebody submits a swap with a loose slippage setting — a generous allowance for a worse price than quoted — and no protection, a bot can wrap it [1].

1. Buy just before them, pushing the price up.
2. Their trade executes at the worst rate they allowed.
3. Sell just after, back into the pool at the raised price.

Your pool collects fees on all three, so the day looks busy. But the trader paid for the bot's profit through a worse fill. Traders who keep getting sandwiched tend to move to routes that protect them, and their fees go with them. Sandwich attacks earned \$174M over the same 32 months in the study above [10].

### Three: just-in-time liquidity, which targets passive depositors

This one exists because of concentrated liquidity, and it takes fees from passive depositors on the largest trades [6].

A bot sees a large trade coming. Instead of trading, it does three things in one block:

1. Deposits a very large amount of liquidity at exactly the price where the trade will land.
2. The trade executes. The bot now owns most of the liquidity at that price, so it takes most of the fee.
3. It withdraws everything immediately, principal plus fee.

Put numbers on it. A \$2.5M swap at a 0.30% tier pays \$7,500 in fees. Suppose the bot adds fifty times as much liquidity at that price as the passive positions already there. The bot then takes 50/51 of the fee, about \$7,350. Everyone who has held a position there through weeks of volatility splits about \$150.

Uniswap Labs found this rare across Uniswap v3 as a whole, at about 0.3% of liquidity demand between May 2021 and July 2022 [6]. It is concentrated on very large swaps, where it also gives that trader a better price. The asymmetry for you remains. The bot carried risk for one block. You carried it all month. See [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained/).

## Not all volume is worth the same

Split what goes through a pool into two groups [5].

**Ordinary traders** are buying a token, rebalancing a portfolio, or routing through an aggregator. They have no special knowledge of where the price goes next. Their fees are genuine income.

**Fast traders** are correcting a stale quote. A large empirical study found that losses to these arbitrageurs exceeded the fees earned across many of the largest Uniswap pools [5].

| | Ordinary traders | Fast traders |
| :--- | :--- | :--- |
| Who they are | Retail, apps, solvers, aggregators | Arbitrage bots, sandwich bots, JIT liquidity bots |
| What they know | Nothing special about the next few minutes | That your quote is behind the market |
| What they cost you | They pay a fee for a service | Often more in lost value than the fee they pay |
| What you want | As much as possible | As little as possible |

A pool whose volume is mostly the second kind earns its fees at a loss. The [LP profit calculator](/tools/lp-profit-calculator/) nets fee capture against divergence and gas for a specific position, which tells you which kind of pool you are in.

## What actually defends against each one

### Route orders privately

Rather than broadcasting a trade to the public queue of pending transactions, send it through a private order-flow auction. MEV-Share, for example, shares limited details of your trade with searchers, who bid for the right to trade after it rather than in front of it. You choose how much of their bid comes back to you [7]. That removes the public pending trade a sandwich needs.

### Settle in batches or auctions

Intent systems take a different route. You state what you want and professional fillers compete to deliver it. CoW Protocol settles orders in batch auctions where the same pair clears at one consistent price, so the order of trades inside the batch stops mattering [8]. UniswapX runs an auction among fillers for each signed order, with MEV protection as a stated aim [9]. See [AMM vs Order Book](/guides/amm-vs-order-book/).

### Pick pools with defensive code

Uniswap v4 pools can attach custom code, called hooks, that runs before or after swaps and liquidity changes and can set the pool's fee [12]:

| Defence | What it targets | How |
| :--- | :--- | :--- |
| Fees that track volatility | Stale-quote arbitrage | Arbitrage pays a wider fee exactly when it is taking most; the v4 whitepaper lists this as a hook use case [12] |
| Liquidity rules at deposit and withdrawal | Just-in-time liquidity | A hook runs on every add and remove, so it can penalise liquidity that stays for one block [12] |
| Auctioning the right to trade first | Stale-quote arbitrage | A proposed design auctions pool management, with the benefit flowing to depositors [13] |

That last idea turns the biggest leak into a revenue line, but it is newer and less tested than the others. Private routing, the first defence, is a wallet or router setting rather than pool code.

## What to check before you deposit

1. **Which chain, and how is ordering decided?** A competitive builder market behaves differently from a single rollup sequencer. Neither removes the stale-quote problem, so moving to a cheaper chain changes who orders trades, not whether your quote lags.
2. **What share of swaps come from bot contracts?** Onchain analytics will tell you. The larger the share, the more of the fee income comes paired with arbitrage losses.
3. **How often does just-in-time liquidity appear?** Look at recent large trades and check whether liquidity appeared and vanished around them.
4. **Is the fee tier high enough for the pair's volatility?** Fees cut arbitrage losses roughly in proportion to how often the price gap is too small to be worth trading [4]. A 0.05% tier on a volatile pair leaves far more blocks open to arbitrage than a 0.30% tier.
5. **Does the pool have defensive hook code, and has it been audited [12]?**

## Where to watch the numbers

- **Sandwiches, bundles and searcher profit:** [EigenPhi](https://eigenphi.io).
- **Who is building blocks and what they are paying:** [MevBoost.pics](https://mevboost.pics).
- **What share of a pool's trades are bots:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **Liquidity appeared and vanished in one block around a big trade.** Just-in-time liquidity took most of that fee. If it recurs, consider a pool with a deposit rule or an adaptive fee.
- **Large trades through your pool keep getting sandwiched.** Traders are submitting unprotected transactions with loose tolerances. Private relays and batch auctions protect them, and keep their volume coming.
- **Fees are not keeping up during volatile stretches.** Arbitrage is taking stale quotes faster than the fee compensates. Avoid tight ranges in fixed-fee pools around scheduled announcements.

## The next step

The formal measure of what all this costs is developed in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/), which is the place to go next if you supply liquidity. If you trade, read [Slippage and Price Impact](/guides/slippage-and-price-impact/), which separates slippage (the gap between the quote you saw and the fill you got) from price impact (the cost your own order size creates).

## References

1. [Maximal extractable value (MEV) (ethereum.org)](https://ethereum.org/en/developers/docs/mev/)
2. [MEV-Boost Overview (Flashbots Documentation)](https://docs.flashbots.net/flashbots-mev-boost/introduction)
3. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
4. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
5. [Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)](https://arxiv.org/abs/2404.05803)
6. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
7. [MEV-Share Introduction (Flashbots Documentation)](https://docs.flashbots.net/flashbots-mev-share/introduction)
8. [Fair Combinatorial Batch Auction (CoW Protocol Documentation)](https://docs.cow.fi/cow-protocol/concepts/introduction/batch-auctions)
9. [UniswapX Overview (Uniswap Developers documentation)](https://docs.uniswap.org/contracts/uniswapx/overview)
10. [Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)](https://arxiv.org/abs/2101.05511)
11. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
12. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
13. [am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)](https://arxiv.org/abs/2403.03367)

[1]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV) (ethereum.org)"
[2]: https://docs.flashbots.net/flashbots-mev-boost/introduction "MEV-Boost Overview (Flashbots Documentation)"
[3]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[4]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[5]: https://arxiv.org/abs/2404.05803 "Measuring Arbitrage Losses and Profitability of AMM Liquidity (Fritsch & Canidio, 2024)"
[6]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[7]: https://docs.flashbots.net/flashbots-mev-share/introduction "MEV-Share Introduction (Flashbots Documentation)"
[8]: https://docs.cow.fi/cow-protocol/concepts/introduction/batch-auctions "Fair Combinatorial Batch Auction (CoW Protocol Documentation)"
[9]: https://docs.uniswap.org/contracts/uniswapx/overview "UniswapX Overview (Uniswap Developers documentation)"
[10]: https://arxiv.org/abs/2101.05511 "Quantifying Blockchain Extractable Value: How dark is the forest? (Qin et al., 2021)"
[11]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[12]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[13]: https://arxiv.org/abs/2403.03367 "am-AMM: An Auction-Managed Automated Market Maker (Adams et al., 2024)"
