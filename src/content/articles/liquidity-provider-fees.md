---
title: "Liquidity Provider Fees: How LP Revenue Is Generated and Measured"
description: "Where the fee actually goes, why it differs by pool generation, and the one subtraction that turns a fee number into an actual return."
category: "LP Mechanics"
date: 2026-09-02
lastReviewed: "2026-09-12"
author: "Marcus Vance"
readTime: "7 min read"
keywords: "liquidity provider fees, LP fees, AMM fee tier, liquidity pool APR, dynamic fees, LVR, liquidity pool fees explained, who pays liquidity pool fees, pool fee tier"
featured: false
faq:
  - q: "Who pays liquidity pool fees?"
    a: "The trader pays the fee on each swap. It accrues to the liquidity that was active for that trade, in proportion to each position's share of that active liquidity."
  - q: "Are liquidity pool fees guaranteed?"
    a: "No. Fees depend on volume actually routing through your pool and, in concentrated pools, on your position being in range when it does. Both can fall to zero without anything failing."
  - q: "Do liquidity pool fees compound automatically?"
    a: "In constant-product pools fees are added to reserves and effectively compound. In tick-based pools they accrue as separate claimable balances and only compound if you collect and redeposit them, which costs gas."
  - q: "How much can you earn providing liquidity?"
    a: "Fee income equals the fee tier multiplied by the volume routed to your position multiplied by your share of the active liquidity, adjusted for time in range. On deep pairs that is often single-digit to low double-digit annualised before divergence and gas are subtracted."
---

A trader pays a fee. Somewhere between their wallet and yours, four different pool designs do four different things with it, and the differences decide whether your fees compound, whether they stop, and whether you ever see them.

This guide traces the money from the swap to your balance, shows why volume alone tells you nothing, and gives you the one subtraction that turns a fee number into an actual return.

<figure class="article-figure">
  <img src="/images/guides/liquidity-provider-fees.webp" alt="Swap flow moves through an active liquidity range while a smaller fee stream accumulates separately." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Fees accrue from eligible active flow, not from a fixed yield source. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Marcus Vance:**
> *"There is a difference between fee volume and fee capture. If a pool does \$50M a day and \$40M of that is bots correcting a stale quote, the pool is collecting fees while its inventory decays. Heavy volume only helps when enough of it comes from people who do not know where the price is going."*

## Where the fee actually goes

| Design | What happens to the fee | What it means for you |
| :--- | :--- | :--- |
| Uniswap v2 | Stays in the pool, growing the reserves [1] | It compounds by itself. You see it when you withdraw |
| Uniswap v3 | Goes to whoever was live at that price, held separately [2] | You must claim it, and it earns nothing until you do |
| Uniswap v4 | Credited to your position and collected when you change or withdraw it, and the rate can move per swap [3] | Cheaper to manage, and you have to read any code setting the fee |
| Curve | Typically half of each fee to the pool's depositors, half to long-term token lockers [4] | Depositors also chase emissions, a second stream funded very differently |

The one that catches people out is the second row. In a range-based pool, if the price sits outside your band you collect nothing, no matter what the pool's headline volume looks like that day [2].

## The full-range case, worked

An ordinary ETH and dollars pool, charging 0.30% on every swap.

You own 2% of it. The pool does \$10M of volume in a day. Your gross fee is 2% of 0.30% of \$10M, so \$600.

Now the part the fee number does not show. While that volume happened, ETH rose. Arbitrage traders bought ETH from the pool at yesterday's price until it caught up. The pool sold ETH and accumulated dollars.

So when you withdraw, you hold less ETH and more dollars than you put in. Two separate things are happening to you [5]:

- **The market itself.** Whatever the two tokens did. Nothing to do with pools.
- **Being picked off.** The continuous loss from quoting a price that is always a block behind.

If \$600 a day does not cover the second one, the position trails simply holding despite the fee counter going up nicely [5]. That shortfall is impermanent loss — the gap between a pool position and keeping the tokens. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## The range case: why fees stop dead

In a range-based pool, three things follow from the band you chose [2]:

- **Inside it, you earn a lot.** Because your money is concentrated, fee income per dollar can be ten to a hundred times a full-range position.
- **Outside it, you earn nothing.** Not less. Nothing. Fees already earned stay claimable, but new volume pays you zero.
- **At the edge, you have fully converted.** Above your top bound you hold only dollars, which means you sit in cash missing the rally while earning nothing.

So two numbers dominate your income: what share of the liquidity you hold, and what fraction of the time you are actually in range. A pool's advertised rate is irrelevant if your position spends half its life outside the band [2] [3].

## Why fixed fee tiers are being replaced

The old tiers were 0.01% for stable pairs, 0.05% for correlated ones, 0.30% for volatile ones, and 1.00% for the rest [3]. A fixed number has two failure modes, in opposite directions.

**In calm markets it is too high.** Traders route to a cheaper venue and you get no volume at all.

**In a crash it is far too low.** Prices move so fast that arbitrage takes enormous value from your stale quote, and 0.30% is nothing like enough compensation [5].

Two designs fix this:

- **Fees that count price movement.** Liquidity Book, built by Trader Joe (now LFJ), measures how many price steps trades have crossed recently. When things get fast, the fee rises on its own [3].
- **Fees set by code.** A Uniswap v4 hook can read recent activity and move the fee within whatever limits its own code sets [3].

Both do the same thing: charge arbitrage more precisely when arbitrage is taking the most [3] [5].

## Curve pays you twice, from two different places

Worth separating because it confuses people:

- **Base swap fees** come from trades in the specific pool you supplied.
- **Protocol fees and emissions** go to people who locked the governance token for up to four years, who also vote on where future issuance goes [4].

When you look at a Curve pool's advertised rate, split it. The fee part is paid by traders and continues. The emission part is paid by issuance and stops the moment a governance vote moves the weights [4].

## The one subtraction that matters

$$
\text{Net} = \text{fees} - \text{LVR} - \text{gas}
$$

Where:

- **Fees** is everything you collected while your liquidity was live.
- **LVR** is loss-versus-rebalancing — what arbitrage took because your quote runs a block behind [5].
- **Gas** is every transaction from entry to exit.

If the fees beat the bleed, you were genuinely paid for making a market. If they did not, you subsidised somebody else's arbitrage desk while watching a fee counter go up [5]. See [Market Making on AMMs](/guides/market-making-on-amms/).

## What people get wrong about fees

| What people assume | What actually happens |
| :--- | :--- |
| The pool's rate is my rate | That averages every position in the pool. Yours depends on your band and your time in range |
| A higher tier earns more | It usually receives less volume, because routers go where execution is best |
| Uncollected fees compound | In range-based pools they sit idle until you claim and redeposit them |
| A positive fee rate means I am paid enough | On a pair moving 80% a year, a full-range position bleeds about 8% and a band several times that. A 15% fee rate on a band can still lose |

## Which number is which

| The figure | What it actually measures | Where it goes wrong |
| :--- | :--- | :--- |
| The fee rate, 0.30% | What the trader pays on each swap [1] [3] | A higher rate can mean no volume at all |
| The advertised rate | Yesterday's volume, projected forward | Counts no future range exits and no divergence |
| Fees collected | Real cash you can claim [2] | Can be completely swamped by what happened to your inventory [5] |
| Net against the bleed | Fees minus what arbitrage took | The only one that tells you whether it worked [5] |

## What to check before you deposit

1. **How does this pool handle fees?** Compounding into reserves, sitting as a claim, or settled internally [1] [2] [3]?
2. **Is the fee fixed or does it move?** If it moves, read the code that sets it and the bounds it can reach [3].
3. **How much of the last 30 days would your band have been live for [2]?**
4. **Does historical fee income comfortably beat the bleed** for this pair [5]?
5. **How much of the advertised rate is real fees** rather than token issuance [4]?

Treat this as payment for quoting continuously with real money, not as a yield. If the fees do not outpace what arbitrage takes, no headline number makes the position work.

## When something goes wrong

- **The fees are not covering the losses.** The pair moves more than this tier compensates. Move to a higher tier, or to a pair that moves less.
- **Routers stopped sending you volume.** A competing pool offers better execution. Change tier, or tighten your band to compete on depth.
- **Claiming costs more than it earns.** Your position is too small for that cadence. Batch the claims, and only reinvest when the amount is at least ten times the gas.

## Where to go next

Tier choice moves this number more than anything else, covered in [Uniswap Fee Tiers Explained](/guides/uniswap-fee-tiers-explained/). Model expected income with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). To read a quoted rate correctly, see [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/). For the net result after divergence and gas, use the [LP profit and return calculator](/tools/lp-profit-calculator/) and [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/).

## References

1. [Pools | Uniswap Developers](https://developers.uniswap.org/docs/protocols/v2/concepts/pools)
2. [Fees | Uniswap Developers](https://developers.uniswap.org/docs/get-started/concepts/fees)
3. [Uniswap v4 Core Whitepaper & Architecture](https://uniswap.org/whitepaper-v4.pdf)
4. [What is veCRV? | Curve Knowledge Hub](https://docs.curve.finance/user/vecrv/what-is-vecrv)
5. [Automated Market Making and Loss-Versus-Rebalancing](https://arxiv.org/abs/2208.06046)
6. [Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)](https://arxiv.org/abs/2104.00446)
7. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)](https://arxiv.org/abs/2305.14604)
8. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)

[1]: https://developers.uniswap.org/docs/protocols/v2/concepts/pools "Pools | Uniswap Developers"
[2]: https://developers.uniswap.org/docs/get-started/concepts/fees "Fees | Uniswap Developers"
[3]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper & Architecture"
[4]: https://docs.curve.finance/user/vecrv/what-is-vecrv "What is veCRV? | Curve Knowledge Hub"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[6]: https://arxiv.org/abs/2104.00446 "Optimal Fees for Geometric Mean Market Makers (Evans et al., 2021)"
[7]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis et al., 2023)"
[8]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
