---
title: "What Is a Liquidity Pool? How DeFi Liquidity Pools Work"
description: "A plain-English guide to liquidity pools: how a pool sets its price, why deep beats big, what you really earn, and what you take on when you deposit."
category: "Foundations"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "10 min read"
primaryQuery: "what is a liquidity pool"
keywords: "what is a liquidity pool, DeFi liquidity pool, automated market maker, AMM, singleton architecture, hooks, how do liquidity pools work, crypto liquidity pools, liquidity pool explained, liquidity pool meaning"
featured: true
faq:
  - q: "How do liquidity pools work?"
    a: "A pool holds reserves of two or more tokens in a smart contract and prices trades from a formula applied to those reserves. Traders swap against the contract instead of matching with another person, and the reserve ratio moves with every trade, which is what changes the quoted price."
  - q: "How do liquidity providers make money?"
    a: "Each swap pays a fee that accrues to the liquidity active for that trade. Some pools add token emissions on top. Whether the total exceeds the divergence the position takes on is a separate question answered by the fee and impermanent loss arithmetic."
  - q: "Do liquidity pools affect the token price?"
    a: "Within the pool, yes: the price is a function of the reserve ratio, so every trade moves it. Across the market, a pool with deep liquidity anchors price by making arbitrage cheap, while a thin pool can be moved sharply by a single order."
  - q: "Do I need both tokens to provide liquidity?"
    a: "For a standard two-sided pool, yes, in the ratio the pool requires at the current price. Interfaces often offer a single-asset deposit that swaps half your input first, which costs a swap fee and price impact rather than removing the requirement."
  - q: "What is liquidity pool crypto?"
    a: "It is the common phrasing for a pool of tokens held in a smart contract that prices trades from its own reserves. The pool replaces an order book: traders swap against the contract, and depositors earn a share of the fee on every swap."
---

You open a swap page, send one ETH, and about \$3,000 of USDC comes back. No person took the other side. You traded against a pot of tokens held by a smart contract, plus a rule for how much of one token the pot will give up for the other.

That pot is a liquidity pool. Anyone can put tokens in. Anyone can trade against it. If you put money in, you earn a cut of the fee on every trade that runs through your money.

You also take on a risk that most yield pages never show you. By the end you should be able to tell how a pool sets its price, whether a pool is deep enough for your trade, and whether a deposit fits what you are willing to hold.

<figure class="article-figure">
  <img src="/images/guides/what-is-a-liquidity-pool.webp" alt="Two token reserves connected by a curved automated pricing path." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>How an automated market maker converts reserve balances into continuous execution quotes. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> A pool is a shared contract holding two token balances and one rule. Nobody sits on the other side arguing over price. The contract is the other side. When you deposit, you hand over your specific tokens and get back a claim on a share of whatever the pool holds later. Those are not the same thing, and the gap between them is where most of the surprises live.

## How a pool decides a price

A pool does not look up a price anywhere. It works out a price from what it is holding. That is the main difference from an exchange order book, where buyers and sellers post their own prices; [AMM vs Order Book](/guides/amm-vs-order-book/) compares the two.

The oldest and still most common rule is the constant product rule, popularised by Uniswap and copied by many forks. It keeps the two token balances multiplied together at the same number [1]. Take some of one token out and you have to put enough of the other in to keep that number level.

$$
x \cdot y = k
$$

Where:

- $x$ is how much of the first token the pool holds.
- $y$ is how much of the second token it holds.
- $k$ is the number the pool refuses to let fall.

That one line does all the work. Buy a little of a token and the pool has less of it left, so the next buyer has to leave more behind. Buy a lot and the rate gets worse fast. This is price impact — the way your own order moves the rate you get. The quoted rate is simply one balance divided by the other [1].

Here it is with numbers. Say a pool holds 100 ETH and \$300,000 of USDC, so the quoted rate is \$3,000 per ETH. Buy 1 ETH and you pay about \$3,030 before the fee, which is 1% over the quote. Buy 10 ETH from that same pool and your average cost is roughly \$3,333, or 11% over. Nothing changed in the wider market. The pool simply ran out of cheap ETH.

Price impact is not the same thing as slippage — the gap between the price you were quoted and the price you actually got, usually because someone else traded in between. You control price impact by sizing your order. You limit slippage with your tolerance setting and with where you send the order.

## What changed when liquidity got concentrated

In the old design, your money was spread across every price from zero to infinity. Most of it sat at prices that will never trade, and earned almost nothing.

Uniswap v3 let you pick a price range instead [2]. Deposit into a band from \$2,800 to \$3,200 and all of your money works inside that band. The same capital can absorb far more trading, so while the price stays in the band, the same deposit earns far more fees.

The trade-off is direct. If the price leaves your band, your money stops trading and earns nothing until the price comes back [2]. Meanwhile you hold only one token: whichever one lost ground against the other. Later designs split this further. Some pools slice the range into fixed steps, called bins, and every trade inside a bin happens at one flat price [5].

| Pool design | How it prices trades | Where your money sits | Where it fails |
| :--- | :--- | :--- | :--- |
| Constant product, such as Uniswap v2 | Two balances multiplied together stay level [1] | Spread evenly across all prices | Large orders move the rate a lot |
| Range-based, such as Uniswap v3 and v4 | Same rule, but only inside a band you choose [2] | Packed into your chosen band, nothing outside | Price leaves the band and you stop earning |
| Stable-pair, such as Curve | Near-flat around the peg, curved further out [4] | Piled up close to a one-to-one rate | Falls away quickly once the pair skews |
| Stepped bins, such as LFJ's Liquidity Book | Flat price within each bin [5] | Sorted into fixed price steps | A fast move can skip empty bins |

Picking a pool design is mostly about matching it to how much the pair actually moves. A pair that barely moves suits the flat rule. A pair that moves hard needs room. [Types of Liquidity Pools](/guides/liquidity-pool-types/) goes through each family in turn.

## A big pool is not the same as a deep pool

Total value locked, or TVL, counts every dollar sitting in the contract. In a range-based pool, it says nothing about how much of that money sits where trading is happening, because only liquidity inside the live range fills trades [2].

This trips people up constantly. A pool showing \$50M can give you a worse fill than one showing \$5M, if most of that \$50M sits in bands nowhere near today's price. What matters is the money parked within 1% or 2% of the current rate.

Before you trade size, look at the depth chart rather than the headline number. Most pool pages show liquidity by price. If it drops off sharply just above and below the current rate, split your order or route it somewhere else.

## Why the pool keeps selling the winner

Depositing is not lending. You are not owed a fixed amount back. You hold a share of whatever the pool contains when you leave, and in the meantime that share quotes a price to the whole internet, all day, with no ability to cancel [6].

When the price moves on Binance or Coinbase, the pool has not heard yet. It is still quoting the old rate. Arbitrageurs — traders who make money on the gap between one venue's price and another's — take the stale side until the gap closes. That profit does not come from nowhere. Research on these trades finds it is paid by the pool's depositors, and it is the main cost that fees have to cover [7].

Follow the mechanics. ETH rallies. Your pool is still selling ETH at the old price, so traders buy ETH from it and sell elsewhere. The pool ends up holding less ETH and more dollars. It sold the asset that went up, and it did so on the way up, over and over.

This is called adverse selection — the people who trade with you are exactly the ones who know something you don't. Its visible result is impermanent loss, also called divergence loss — how far your deposit falls behind the same tokens simply held in a wallet [6].

Work the numbers once and it stops feeling abstract. You deposit \$10,000 into an ETH/USDC pool with ETH at \$3,000. ETH doubles to \$6,000. Held, your tokens would be worth \$15,000. In a full-range pool they come out near \$14,140, so about \$860, or 5.7%, behind holding. That is before fees.

Fees may cover that or may not, and which one it is depends on how much volume ran through while you were in. They do not always win. One study of 17 large Uniswap v3 pools found depositors earned \$199.3M in fees but lost \$260.1M to impermanent loss over the same period [8]. Whether your own pool clears the bar is worked through in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

Two more things follow from the arithmetic. The loss only reverses if the price comes back to where you entered. If it doesn't, the shortfall becomes permanent the moment you withdraw. And the yield figure on a pool page is recent fee income projected forward. It does not subtract this loss at all.

A narrow range makes both sides bigger. More fees when the price sits still, and a faster, larger shift into the weaker token when it doesn't. The full arithmetic is in [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Why stablecoin pools feel safe until they aren't

When two tokens are meant to trade one-for-one, the ordinary rule wastes almost all the money. Nearly every trade happens within a hair of 1.00, so liquidity spread across every price is liquidity sitting idle.

Curve's design solves this by staying almost flat near the peg and only curving away as the balance skews [4]. Large trades can move through with little price impact. That is why stable pools quote such tight rates, and why they feel like the safe option.

The failure mode is the same feature running in reverse. If one of the two tokens loses its peg, traders sell it into the pool. Because the curve holds the price near 1.00 until the balance is badly lopsided, the pool keeps buying the falling token at close to full price. You end up holding mostly the broken one. See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/) for how peg breaks have actually played out.

## What newer pool designs changed under the hood

Early protocols deployed a separate contract for every pair. A three-hop trade meant three contracts and a token transfer at every hop, and you paid gas for all of it.

Uniswap v4 puts every pool inside one contract [3]. Three things follow from that:

- **One contract for everything.** Routing a trade through several pools no longer means jumping between contracts, which cuts the gas cost of multi-hop trades [3].
- **Settle once at the end.** The contract tracks what each side owes during the trade and moves tokens only once, at the finish. This is called flash accounting — the running tally lives in temporary memory that is wiped after the transaction, and only the final balances move [3].
- **Pools can run custom code.** Hooks are separate contracts a pool calls before or after a swap or a deposit. They are how features such as fees that rise with volatility, or limit orders inside the pool, get built [3].

Hooks are worth a second look before you deposit. A hook is code someone wrote. Depending on how it is built, it can change fees, charge for withdrawals, or block actions. The v4 designers note that a hook which can touch deposits but not withdrawals is safer for providers, because you can always get out [3]. Read what it does. [Automated Market Makers Explained](/guides/automated-market-maker-explained/) covers the plumbing in more depth.

## What to check before you deposit

1. **Know which design you are in.** A fixed pair contract, a range-based pool, or a pool with custom code attached? Each one fails differently.
2. **Read the hooks.** If the pool has custom code, find out whether it can change fees, block withdrawals, or pause trading.
3. **Measure depth, not size.** Look at how much money sits within 2% of the current price. That is the number that decides your fill.
4. **Match how you send an order to its size.** A public swap can be seen and wrapped by bots before it lands — the sandwich attack described in Ethereum's own documentation [9]. The more your order moves the pool, the more they can take, so larger orders belong in a private relay or a batch solver.
5. **Decide now what you will hold later.** If the price falls to the bottom of your range you will hold that token and nothing else. If you would not want it at that price, the range is wrong.

For a longer version of this list, see [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/).

## Where to watch the numbers

- **Pool size, volume and fees across chains:** [DeFiLlama](https://defillama.com).
- **Live trades, reserves and price charts:** [DexScreener](https://dexscreener.com) and [GeckoTerminal](https://geckoterminal.com).
- **The contract itself, balances and fee settings:** [Etherscan](https://etherscan.io).

## When something looks wrong

- **The pool reports volume but the balance is near zero.** Liquidity was pulled or drained. Check who created the contract and whether the deposit was ever locked. [Liquidity Pool Rug Pulls](/guides/liquidity-pool-rug-pulls/) covers the pattern.
- **Your swap fails with "insufficient output amount."** The price moved past your tolerance before the trade landed, often because the order is large for the money near that price. Split it, or let an aggregator spread it across pools.
- **You withdrew but the approval is still live.** The contract can still move that token. Cancel it at [Revoke.cash](https://revoke.cash).

## Where to go next

If you are new to all of this, take the five starting decisions in [Liquidity Pools for Beginners](/guides/liquidity-pools-for-beginners/), then read [What Is a Liquidity Provider?](/guides/what-is-a-liquidity-provider/) for what the depositor's job involves. To put a number on the pricing rule's cost, work through [The Impermanent Loss Formula](/guides/impermanent-loss-formula/) and test a scenario in the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=2000&a1=3000&b0=1&b1=1&capital=10000&fees=260&days=45&weight=0.5).

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
4. [StableSwap - efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
5. [Concentrated Liquidity (LFJ Developer Docs)](https://developers.lfj.gg/concepts/concentrated-liquidity)
6. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
7. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
8. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
9. [Maximal extractable value (MEV) (ethereum.org)](https://ethereum.org/en/developers/docs/mev/)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[4]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - efficient mechanism for Stablecoin liquidity"
[5]: https://developers.lfj.gg/concepts/concentrated-liquidity "Concentrated Liquidity (LFJ Developer Docs)"
[6]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[7]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[8]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3"
[9]: https://ethereum.org/en/developers/docs/mev/ "Maximal extractable value (MEV)"
