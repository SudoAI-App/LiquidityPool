---
title: "Yield Farming Explained: Fee Income, Emissions, and Dilution"
description: "One question tells you whether a farm is worth anything: if the rewards stopped tomorrow, what would this position earn? Everything follows from that."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
keywords: "yield farming liquidity pools, yield farming explained, liquidity mining vs yield farming, farming emissions, real yield, mercenary capital"
featured: false
faq:
  - q: "What is yield farming in DeFi?"
    a: "Supplying assets to a protocol and collecting a return made up of trading fees, lending interest, or newly issued protocol tokens. In liquidity pools it usually means depositing a pair, receiving an LP claim, and staking that claim into a gauge or farm contract that pays additional token emissions."
  - q: "What is the difference between yield farming and liquidity mining?"
    a: "Liquidity mining is the narrower term for the incentive programme itself: a protocol issuing its own token to attract deposits. Yield farming is the user-side activity of moving capital between opportunities to collect whatever combination of fees and incentives is available."
  - q: "Is yield farming still profitable?"
    a: "It depends entirely on whether the yield is funded by fees or by issuance, and on what you pay in divergence and gas to collect it. Fee-funded returns persist while trading activity persists. Emission-funded returns end with the programme, and the token used to pay them is usually being sold by everyone receiving it."
  - q: "What are the main risks of yield farming?"
    a: "Divergence loss on the underlying pair, smart contract risk across every contract in the stack including the farm and any vault wrapper, emission token price decay, and the depth collapse that follows when incentives taper and mercenary capital leaves."
---

There is one question that tells you almost everything about a farm. If the rewards stopped tomorrow, what would this position earn?

A farm pays from two places that behave nothing alike. Fees collected from real users, and tokens created out of nothing. Adding them into one number is the most expensive habit in this whole activity.

This guide separates them, shows how to price what the printing actually costs, and walks through exactly what happens when a programme ends.

<figure class="article-figure">
  <img src="/images/guides/yield-farming-explained.webp" alt="Flow diagram from swap flow to pool fee to LP position to emissions to realised profit and loss." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The two revenue paths into a farmed position, and the deductions that separate quoted yield from realised result. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"Ask the one question. If the answer is close to zero, you are not being paid to supply liquidity. You are being paid to hold a token that is being printed. That can still be a reasonable trade, but size it like a token position, not like a yield."*

## Four layers, four things that can break

A farm is not one position. It is four stacked, and every layer adds a way to lose money.

| Layer | What it is | What it adds |
| :--- | :--- | :--- |
| The pair | Two tokens you deposited | Divergence as their prices move apart |
| The pool | The contract that prices trades | Contract risk, plus any attached code [2] |
| The farm | Holds your pool claim and works out rewards | Another contract, and a schedule somebody controls |
| A vault, sometimes | Harvests and reinvests for you | A performance fee and one more contract |

All four have to work for you to get your money back. That is why reviewing a farm means reviewing a chain, not a contract. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## The two revenue lines

Fee income is a claim on activity that already happened. Reward income is a claim on future supply. They differ on every property that matters.

| | Fee income | Reward income |
| :--- | :--- | :--- |
| Who funds it | Traders paying the pool | The protocol, printing |
| What it depends on | Volume and your share of the liquidity | The schedule, and how much is staked |
| When it stops | When trading stops | When the programme ends, or a vote moves it |
| Who it dilutes | Nobody | Everybody already holding the token |
| What you actually get | The pool's own assets, at quote | Whatever the market absorbs when you sell |

The test is the one from the field note. Model the position with rewards set to zero. Whatever is left is the durable part. See [Liquidity Mining Explained](/guides/liquidity-mining-explained/).

## What the printing actually costs

Say a farm issues 2% of the token's supply every week to depositors. Everybody receiving it faces the same decision, and in aggregate a lot of it gets sold quickly.

For the advertised rate to be real, the market has to absorb that supply without the price falling.

$$
\text{weekly selling pressure} = \alpha \times e
$$

Where:

- $e$ is the weekly issuance as a fraction of circulating supply.
- $\alpha$ is the fraction of recipients who sell within the week.

Put numbers on it. Issuance of 2% of supply a week, with 70% of recipients selling inside the week, sends 1.4% of the supply to market every week. On a token worth \$100M that trades \$3M a day, that is \$1.4M of extra selling against about \$21M of weekly volume. Roughly 7% of all trading, every week, all on one side.

If genuine demand does not grow at least that fast, the price falls and the advertised rate falls with it, on a schedule you could have read off the emission curve before you started.

That is the whole mechanism behind the familiar pattern: a farm launches at a spectacular number and settles at a fraction of it within weeks. Nothing went wrong. It was arithmetic.

The workable approach is to value rewards at a conservative haircut, sell on a fixed schedule rather than accumulating, and treat anything you keep as a deliberate bet on that token rather than as yield.

## What happens when the rewards taper

The sequence is consistent enough to plan around.

1. Rewards taper, or a vote moves them somewhere else.
2. The advertised rate falls below what justified the exposure.
3. Money leaves, often within days, because it was never underwriting the pair.
4. Depth thins, execution worsens, and routers send less volume.
5. Fee income falls for whoever stayed, which gives them a reason to leave too.

Work an example. A pool holds \$40M, attracted by 30 points of rewards on top of 6 points of real fees. The programme halves.

| | Before | After |
| :--- | ---: | ---: |
| Reward budget | \$12M a year | \$6M a year |
| Liquidity | \$40M | about \$20M within two weeks |
| Reward rate | 30% | still 30%, on half the money |
| Fee yield for those who stayed | 6% | 12% on paper, if volume held |
| Advertised rate | 36% | about 42% on paper |

The advertised rate went up after the cut, because money left faster than the rewards shrank. That is the first trap.

The second is the fee row. On paper, the same volume shared among half the liquidity doubles your fee yield. In practice volume falls too, because thinner depth means worse execution and routers notice. If volume drops by a third, the fee yield lands nearer 8%.

Whoever modelled fee-only yield before entering knew where the floor was. Whoever annualised the launch week is now deciding whether to exit through a thinner market than the one they entered.

## What people get wrong about farming

| What people assume | What actually happens |
| :--- | :--- |
| The advertised rate is income | Most of it is issuance, sold by everyone receiving it |
| I will hold the reward token | Everyone says that. Most sell, which is why the price falls |
| A big farm is a safe farm | Size measures how many people wanted the rewards, nothing else |
| Reviewing the protocol is enough | Four contracts, all of which have to work |

## Before you deposit into a farm

1. **Compute fee-only yield with rewards at zero.** Would you supply at that rate? If not, you are buying a token.
2. **Read the emission schedule and its decay.** Work out weekly issuance as a share of supply.
3. **Decide your selling rule before the first harvest**, not after you have watched the price for a week.
4. **Confirm the hurdle** for the pair. That is impermanent loss — the gap between a pool position and simply holding — plus gas. See [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).
5. **List every contract** and check audits, upgrade keys and delays for each one.
6. **Check the exit.** Is there a lockup, a cooldown, or a penalty for leaving early?
7. **Model the gas** for the harvest cadence the quoted rate assumed, at your size.
8. **Set an alert on governance proposals** that could move the rewards away from your pool.

Farming is not a mistake, and reward programmes do a real job bootstrapping depth on pairs that would otherwise have none. The discipline is refusing to count printing as income without pricing what the printing costs.

## Where to watch the numbers

- **Splitting fee yield from reward yield:** [DeFiLlama](https://defillama.com/yields) does this for most major pools, which is the fastest version of the zero test.
- **Your actual result against holding:** [Revert Finance](https://revert.finance).
- **The real emission schedule:** read the farm contract, not the interface's current figure.
- **Who is trading in the pool:** [EigenPhi](https://eigenphi.io). A farm whose volume is mostly arbitrage is paying you to warehouse inventory.
- **Testing the full cycle:** simulate deposit, harvest and withdrawal on [Tenderly](https://tenderly.co) before committing size.

## Where to go next

Separate the durable part of any farm with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and read the protocol's side in [Liquidity Mining Explained](/guides/liquidity-mining-explained/). A worked example of the same structure is in [PancakeSwap Liquidity Pools](/guides/pancakeswap-liquidity-pools/). For who funds each activity, see [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/), and for the underlying position, [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [DeFiLlama Yields methodology](https://defillama.com/yields)
5. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[4]: https://defillama.com/yields "DeFiLlama Yields"
[5]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
