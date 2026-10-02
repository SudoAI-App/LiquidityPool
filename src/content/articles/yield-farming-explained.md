---
title: "Yield Farming Explained: Fee Income, Emissions, and Dilution"
description: "One question tells you whether a farm is worth anything: if the rewards stopped tomorrow, what would this position earn? Everything follows from that."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "yield farming liquidity pools"
keywords: "yield farming liquidity pools, yield farming explained, farming emissions, real yield, mercenary capital"
featured: false
faq:
  - q: "What is yield farming in DeFi?"
    a: "Supplying assets to a protocol and collecting a return made up of trading fees, lending interest, or newly issued protocol tokens. In liquidity pools it usually means depositing a pair, receiving an LP claim, and staking that claim into a gauge or farm contract that pays additional token emissions."
  - q: "What is the difference between yield farming and liquidity mining?"
    a: "Liquidity mining is the narrower term for the incentive programme itself: a protocol issuing its own token to attract deposits. Yield farming is the user-side activity of moving capital between opportunities to collect whatever combination of fees and incentives is available."
  - q: "Is yield farming still profitable?"
    a: "It depends on whether the yield is funded by fees or by issuance, and on what you pay in divergence and gas to collect it. Fee-funded returns persist while trading activity persists. Emission-funded returns end with the programme, and the token used to pay them is usually being sold by many of the people receiving it."
  - q: "What are the main risks of yield farming?"
    a: "Divergence loss on the underlying pair, smart contract risk across every contract in the stack including the farm and any vault wrapper, a falling price for the reward token, and the loss of depth that follows when incentives taper and incentive-driven capital leaves."
---

There is one question that tells you most of what you need to know about a farm. If the rewards stopped tomorrow, what would this position earn?

A farm pays from two places that behave very differently: fees collected from real traders, and newly issued tokens. Adding them into one number hides the part that is about to shrink.

By the end you should be able to separate the two, estimate what the token issuance costs, and decide whether the part that remains is worth your capital.

<figure class="article-figure">
  <img src="/images/guides/yield-farming-explained.webp" alt="Flow diagram from swap flow to pool fee to LP position to emissions to realised profit and loss." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The two revenue paths into a farmed position, and the deductions that separate quoted yield from realised result. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Ask the one question. If the answer is close to zero, you are not being paid to supply liquidity. You are being paid to hold a token that is being issued. That can still be a reasonable trade, but size it like a token position, not like a yield.

## Four layers, four things that can break

Yield farming took off in the summer of 2020, when protocols began paying newly minted governance tokens on top of the fees and interest users already earned [1]. A farmed position today is usually four layers stacked, and every layer adds a way to lose money.

| Layer | What it is | What it adds |
| :--- | :--- | :--- |
| The pair | Two tokens you deposited | Divergence as their prices move apart |
| The pool | The contract that prices trades | Contract risk, plus any attached hook code [2] |
| The farm | Holds your pool claim and works out rewards | Another contract, and a schedule somebody controls [8] |
| A vault, sometimes | Harvests and reinvests for you | A performance fee, often 10–20% of the yield, and one more contract [1] |

All four have to work for you to get your money back. Reward contracts fail in their own ways: in 2021 a faulty update to Compound's reward contract distributed about \$90 million of tokens in error, with no admin control able to stop it [3]. Regulators make the wider point too, that stacked DeFi protocols create dependencies that are hard to trace [4].

So reviewing a farm means reviewing a chain, not a contract. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/).

## The two revenue lines

Fee income is a claim on activity that already happened. Reward income is a claim on future supply. They differ on every property that matters.

| | Fee income | Reward income |
| :--- | :--- | :--- |
| Who funds it | Traders paying the pool | The protocol, by issuing tokens |
| What it depends on | Volume and your share of the liquidity | The emission schedule, and how much is staked [1] |
| When it stops | When trading stops | When the programme ends, or a vote moves it |
| Who it dilutes | Nobody | Everybody already holding the token |
| What you actually get | The pool's own assets, at quote | Whatever the market pays when you sell |

The test is the one question from the top. Model the position with rewards set to zero, and whatever is left is the durable part. See [Liquidity Mining Explained](/guides/liquidity-mining-explained/), and for one large programme in practice, [PancakeSwap Liquidity Pools](/guides/pancakeswap-liquidity-pools/).

## What the issuance actually costs

Say a farm issues 2% of the token's circulating supply every week to depositors. Everybody receiving it faces the same decision, and in aggregate a lot of it gets sold quickly.

For the advertised rate to hold, the market has to absorb that supply without the price falling. A simple estimate of the extra selling multiplies how much is issued by how much of it gets sold.

$$
\text{weekly selling pressure} = \alpha \times e
$$

Where:

- $e$ is the weekly issuance as a fraction of circulating supply.
- $\alpha$ is the fraction of recipients who sell within the week.

Put numbers on it. Issuance of 2% of supply a week, with 70% of recipients selling inside the week, sends 1.4% of the supply to market every week. On a token worth \$100M that trades \$3M a day, that is \$1.4M of extra selling against about \$21M of weekly volume. That is roughly 7% of all trading, every week, all on one side.

If genuine demand does not grow at least that fast, the price falls and the advertised rate falls with it. You could read that path off the emission curve before you started.

That explains a familiar pattern: a farm launches at a spectacular number and settles at a fraction of it within weeks. Nothing malfunctioned; the arithmetic played out.

The workable approach is to value rewards at a conservative haircut and sell on a fixed schedule rather than accumulating. Treat anything you keep as a deliberate bet on that token rather than as yield.

## What happens when the rewards taper

The sequence is consistent enough to plan around.

1. Rewards taper, or a vote moves them somewhere else.
2. The advertised rate falls below what justified the exposure.
3. Capital leaves, often within days, because it was never underwriting the pair.
4. Depth thins, execution worsens, and routers send less volume.
5. Fee income falls for whoever stayed, which gives them a reason to leave too.

Capital that arrives for rewards can move very fast. In September 2020 SushiSwap pulled about \$830 million of liquidity away from Uniswap by paying SUSHI to anyone who deposited Uniswap LP tokens [5]. A big farm is therefore not a safe farm: its size measures how many people wanted the rewards.

Work an example. A pool holds \$40M, attracted by 30 points of rewards on top of 6 points of real fees. The reward budget is then cut in half. Assume half the liquidity leaves within two weeks.

| | Before | After |
| :--- | ---: | ---: |
| Reward budget | \$12M a year | \$6M a year |
| Liquidity | \$40M | \$20M |
| Reward rate | 30% | still 30%, on half the money |
| Fee yield for those who stayed | 6% | 12% on paper, if volume held |
| Advertised rate | 36% | 42% on paper |

The advertised rate went up after the cut, because money left as fast as the rewards shrank. That is the first trap.

The second is the fee row. On paper, the same volume shared among half the liquidity doubles your fee yield. In practice volume tends to fall too, because thinner depth means worse execution and routers notice. If volume drops by a third, the fee yield lands nearer 8%.

Whoever modelled fee-only yield before entering knew where the floor was. Whoever annualised the launch week is now deciding whether to exit through a thinner market than the one they entered.

## Before you deposit into a farm

1. **Compute fee-only yield with rewards at zero.** Would you supply at that rate? If not, you are buying a token.
2. **Read the emission schedule and its decay.** Work out weekly issuance as a share of supply.
3. **Decide your selling rule before the first harvest**, not after you have watched the price for a week.
4. **Confirm the hurdle** for the pair: impermanent loss, meaning the shortfall of the pool position against holding both tokens, plus gas. In one study of 17 large Uniswap v3 pools, impermanent loss exceeded fees in aggregate [7]. See [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).
5. **List every contract** and check audits, upgrade keys and delays for each one.
6. **Check the exit.** Is there a lock-up, a cooldown, or a penalty for leaving early?
7. **Model the gas** for the harvest cadence the quoted rate assumed, at your size.
8. **Set an alert on governance proposals** that could move the rewards away from your pool. Token-weighted votes decide them, and those tokens are often held by a small group close to the developers [3].

Farming is not a mistake. Reward programmes do a real job bootstrapping depth on pairs that would otherwise have none [5]. The discipline is refusing to count issuance as income without pricing what the issuance costs.

## Where to watch the numbers

- **Splitting fee yield from reward yield:** [DeFiLlama](https://defillama.com/yields) shows the two separately for most major pools, which is the fastest version of the zero test.
- **Your actual result against holding:** [Revert Finance](https://revert.finance).
- **The real emission schedule:** read the farm contract, not the interface's current figure.
- **Who is trading in the pool:** [EigenPhi](https://eigenphi.io). If most volume is arbitrage, much of your fee income is compensation for trading against better-informed flow, and the loss to that flow grows with volatility [6].
- **Testing the full cycle:** simulate deposit, harvest and withdrawal on [Tenderly](https://tenderly.co) before committing size.

## Where to go next

Separate the durable part of any farm with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), then compare it with the alternatives in [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/). If you are weighing a single-token option, [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/) covers it. Whether the pool beneath the farm pays its way is the subject of [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/).

## References

1. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
2. [Uniswap v4 Hooks (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)
3. [DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
4. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
5. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
6. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
7. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
8. [Gauges & Incentives Overview (Curve Knowledge Hub)](https://docs.curve.finance/protocol/gauge/overview)

[1]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[2]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap Developer Documentation)"
[3]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[4]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[5]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[6]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[7]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[8]: https://docs.curve.finance/protocol/gauge/overview "Gauges & Incentives Overview (Curve Knowledge Hub)"
