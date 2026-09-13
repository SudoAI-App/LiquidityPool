---
title: "What Is a Liquidity Provider? The LP Role, Explained"
description: "You become a market maker who cannot cancel. What the job pays, what it costs, and the one question to answer honestly before you take it on."
category: "Foundations"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
keywords: "liquidity provider, what is an LP in crypto, how do liquidity providers make money, liquidity provision DeFi, LP role, how much can you earn providing liquidity"
featured: false
faq:
  - q: "What is a liquidity provider in crypto?"
    a: "Anyone who deposits assets into a pool so that others can trade against them. In exchange the provider receives a claim on the pool and a share of the fees paid by every swap that executes against their liquidity while it is active."
  - q: "What is an LP in crypto?"
    a: "LP is shorthand for liquidity provider, and by extension for the position itself. An LP token or LP position is the claim recording how much of a pool you own and, in range-based pools, at which prices that claim is active."
  - q: "How do liquidity providers make money?"
    a: "From the fee charged on each swap routed through their liquidity, and sometimes from incentive tokens issued by the protocol. Both are gross revenue: the net result also depends on how the pool rebalanced the deposited assets while the market moved."
  - q: "How much can you earn providing liquidity?"
    a: "There is no reliable single figure. Income is fee tier multiplied by the volume routed to your position multiplied by your share of the active liquidity, and the net result subtracts divergence against holding plus gas. The same pool can pay well one month and lose to holding the next."
  - q: "Is being a liquidity provider passive income?"
    a: "No. The revenue arrives without effort, but the position is an active short-volatility exposure that continuously sells whichever asset is appreciating. Treating it as passive income is the most common way LPs are surprised by their own results."
---

A liquidity provider is a market maker who cannot cancel. That one constraint explains almost everything about the job: where the money comes from, who is on the other side, and why the outcome depends more on what the market did than on anything you decided.

The mechanics fit in a sentence. Put two tokens into a pool, get a claim, collect a share of the fee on every trade that goes through your money.

The interesting part is what that bargain costs you. If pools themselves are new, start with [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/).

<figure class="article-figure">
  <img src="/images/guides/what-is-a-liquidity-provider.webp" alt="Two panels comparing what a liquidity provider is paid against what the same position underwrites." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The two halves of the liquidity provider bargain, only one of which is quoted as a yield. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"When somebody asks me what this role is, I say it is selling options with a fee schedule attached. You collect a small steady premium, and you lose an amount that grows with the square of how far the market travels. Say it that way and the position sizing question answers itself."*

## Three obligations a savings account does not have

**You have to supply both tokens.** In the ratio the pool holds them at the current price. Interfaces that accept one token just swap half of it first, which costs a fee and price impact rather than removing the requirement. See [Single-Sided Liquidity](/guides/single-sided-liquidity/).

**You quote continuously, at a price you do not choose.** The pool prices every trade from its own balances. When the market moves elsewhere, your quote is stale until somebody trades against it, and that somebody is not doing you a favour.

**You are paid per trade, not per day.** A pool with no volume pays nothing no matter how much money is sitting in it. That is the structural difference from lending or staking, which both accrue with time.

## What the job pays

$$
F = f \times V \times s
$$

Where:

- $f$ is the fee rate of the pool.
- $V$ is the volume that actually went through it.
- $s$ is your share of the liquidity that was live for those trades.

In a range-based pool, multiply again by the fraction of the time you were in range.

Work it on \$25,000 in a 0.05% pool doing \$20M a day, with \$8M of liquidity in your band.

| | Value |
| :--- | ---: |
| Your share of the liquidity | 0.312% |
| Fees per day | \$31.20 |
| Fees over 30 days | \$936 |
| Annualised | 45.5% |
| Divergence if the pair moves 30% apart, on a full-range position | about -0.9%, or -\$225 |
| Gas across five transactions | -\$90 |

That 45.5% is what a pool interface would show you. The two rows underneath are why it is not your return, and in a narrow band the divergence row is several times larger.

Model both sides: the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/) for the income, and the [impermanent loss calculator](/tools/impermanent-loss-calculator/) for impermanent loss — the gap between the pool position and simply holding.

Some pools add their own token on top. That is funded by issuance rather than by trading, so it decays differently. See [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## What the job costs

Four things sit against the fee line, and only the first is specific to pools.

1. **The pool sells your winner.** It rotates into whichever token is falling, so withdrawing after a move returns less than holding would have. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).
2. **Faster traders get there first.** Because your quote cannot be cancelled, the people who trade against it are disproportionately the ones who already know the price moved. The measure of that is loss-versus-rebalancing — what a pool pays out for quoting a block late — covered in [loss-versus-rebalancing](/guides/loss-versus-rebalancing/).
3. **Friction.** Gas on entry, claiming, rebalancing and exit, plus any swap to reach the right ratio. On small positions this dominates everything. See [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).
4. **Code.** The pool, any hook, and any farm or vault all have to keep working for you to get your money back.

## Two versions of the same job

| | Doing it passively | Doing it actively |
| :--- | :--- | :--- |
| What you hold | Full range, nothing to set | A narrow band you maintain |
| Time it takes | Check occasionally | Watch it, move it |
| Income per dollar | Low | High while you are in range |
| What hurts | Divergence over a long horizon | Time out of range, plus the cost of moving |
| Size that suits | Any, as long as gas is small | Big enough to absorb the management |
| How you measure it | Against holding, quarterly | Time in range and net result, weekly |

Neither is more sophisticated. The mistake is choosing the active structure and then managing it passively, which gives you the worst of both: the amplified losses without the fees that were supposed to pay for them.

## The question to answer before any of this

Would you hold this basket at all?

A pool position is a leveraged expression of a view you may not have formed. Supplying ETH against dollars means you are content to hold more ETH if it falls and less if it rises. Supplying two volatile tokens against each other means you are content to hold whichever one does worse.

People who answer that honestly are rarely upset by divergence, because divergence is just the pool doing exactly what it said it would. People who answer it by looking at a yield figure end up holding a token they never wanted, at a price they would not have chosen, and calling the mechanism unfair.

## Where you sit in the market

Between two groups, and they want different things from you.

On one side, traders and aggregators who need depth and pay a fee for it. On the other, arbitrage bots who keep your pool's price honest and get paid out of your inventory for doing it.

Three consequences worth internalising:

- **Your counterparty is anonymous and often better informed.** Not all volume is worth the same. An aggregator routing someone's purchase is very different from a bot correcting your stale quote for MEV — value taken by controlling the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).
- **Your competition is other providers.** Adding money to a crowded band dilutes everybody, including you, before a single trade happens.
- **Your leverage is selection, not effort.** Which pair, which curve, which tier, which range, what size. After that, the market decides and you watch.

## What people get wrong about the role

| What people assume | What actually happens |
| :--- | :--- |
| It is passive income | The revenue arrives passively. The exposure is an active bet on volatility staying low |
| More capital means more yield | Your share of a band falls as others join. The rate falls with it |
| The pool protects me from picking wrong | It concentrates the consequence. You end up with more of whichever token did worse |
| A busy pool is a profitable pool | Depends entirely on who is doing the trading |

## Before you take it on

1. **Confirm you would hold both tokens**, in any ratio, for the whole horizon.
2. **Estimate income from measured volume and real liquidity**, with your own capital added to the denominator.
3. **Estimate the divergence for a plausible move**, and check the fees plausibly clear it.
4. **Total the gas** for the cadence you actually intend, at your size.
5. **Read the pool, the hook and any wrapper**, and confirm the exit has no conditions.
6. **Decide the exit rule now.** A price, a date, or a measured shortfall against holding.
7. **Write down what you deposited and at what prices**, so you can reconstruct the benchmark later.

The job is legitimate, useful and often profitable. It is not a savings account with a better rate, and the people who do well are the ones who priced the second half of the bargain before signing the first.

## References

1. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
6. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
7. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)

[1]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[6]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[7]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
