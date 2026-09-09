---
title: "Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes"
description: "A concrete guide to impermanent loss as AMM rebalancing against relative price: compare fees, range, and inventory shifts to your hold or rebalancing benchmark."
category: "Risk & Research"
date: 2026-08-29
lastReviewed: "2026-09-09"
author: "LiquidityPool Research"
readTime: "9 min read"
keywords: "impermanent loss explained, AMM impermanent loss, liquidity provider risk, LP rebalancing"
featured: true
---

You add a 50/50 ETH–USDC position and ETH rallies while trades keep your position active. When you withdraw, you hold more USDC and less ETH than you started with. Nothing “broke” in the pool. Swaps simply walked your inventory along the automated market maker (AMM) curve as relative prices moved. The right comparison is not a mysterious “IL percentage,” but the value of your withdrawn position against a benchmark you could have held—such as simply holding the same starting amounts of ETH and USDC, or a systematic 50/50 rebalancing strategy.

This article frames impermanent loss (IL) as a mechanism-and-benchmark problem. It explains how AMM rebalancing changes inventory, how concentrated ranges introduce inactivity risk, and why your decision turns on whether fee income and range choices compensate for exposure and operational costs relative to your actual alternative. Throughout, we use concrete, observable scenarios and cite the limited evidence available.

<figure class="article-figure">
  <img src="/images/guides/impermanent-loss-explained.webp" alt="A balanced pool evolves into an uneven inventory while a hold-only basket preserves its original mix." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Pool rebalancing changes inventory relative to simply holding. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

## What impermanent loss measures—and what it doesn’t

Uniswap’s documentation defines impermanent loss as the change in the value of a liquidity provider’s pool tokens when prices move away from the level at which liquidity was added. In a constant‑product AMM, the pool maintains x*y=k during swaps, and the difference may disappear if the price returns to the original level before you withdraw [1]. That definition already implies two things:

- IL is benchmark‑relative. It is not “my token went down so I lost money in dollars.” It reflects the value change caused by the AMM’s inventory rebalancing, measured against a reference portfolio such as holding the deposited assets [1].
- “Impermanent” is conditional. The difference only disappears if the relevant relative price path reverses before you exit; withdraw while the price differs and the change becomes realized in your inventory value [1].

Treat IL as a lens for attribution, not as a standalone number to minimize regardless of context. Your outcome depends on price paths, fees, whether you remain active, and your chosen comparison portfolio.

## Mechanism: rebalancing along the AMM curve

The constant‑product rule x*y=k ensures the pool quotes a price at all times and rebalances inventory through trades: as one token’s price rises relative to the other, the pool sells some of that appreciated token and buys the other, keeping x*y near k through continuous swaps [1]. That rebalancing is the mechanism behind IL.

- Scenario: A 50/50 ETH–USDC position stays in range as ETH rallies. Arbitrage‑motivated trades and ordinary swaps push the pool to exchange some ETH for USDC along the curve. When you withdraw, you own fewer ETH and more USDC than a simple hold would have left you with. The value difference versus the “just hold the starting assets” benchmark is the divergence‑loss component often labeled IL; your fee income may or may not compensate for it [1] [3].

Concentrated‑liquidity AMMs, such as Uniswap v3/v4, let you choose a finite price interval rather than supporting the full 0‑to‑infinity range. Inside the interval, your liquidity is denser and rebalances more actively; outside it, the position is inactive and earns no fees until price re‑enters [2]. The inventory mix continues to evolve along the curve while you are in range. Once out of range, it is fixed until you rebalance the position or the market comes back into your interval [2].

## Benchmarks that make LP outcomes legible

You cannot evaluate an AMM position by staring at fees or IL in isolation. A clear benchmark makes the trade‑offs visible. One useful frame comes from research that decomposes liquidity‑provider returns into two parts: a beta‑like component from market exposure, and an alpha‑like component equal to accrued fees minus losses to arbitrageurs [3]. In their Uniswap v2 ETH–USDC application, the authors report that more than 99.991% of LP return variance was driven by the beta‑like exposure [3]. That does not predict your future outcome, but it warns that market movement, not fee tweaks, typically dominates variance in this setting.

A compact way to keep the comparisons straight:

| Reference or strategy | Inventory changes with price? | Earns trading fees? | Can become inactive out of range? | What you compare against |
|---|---|---|---|---|
| Hold starting assets (e.g., 50/50 ETH–USDC) | No | No | No | Baseline for “do nothing” |
| Periodic 50/50 rebalancing | Yes, by your schedule | No | No | A systematic rebalancing benchmark |
| AMM liquidity, full range | Yes, via swaps along x*y=k | Yes | No | LP vs. hold or vs. rebalancing |
| AMM liquidity, concentrated range | Yes, within the chosen interval | Yes | Yes: inactive when out of range [2] | LP vs. hold or vs. rebalancing |

Use the table to pick a reference that matches your intention. If your goal is to monetize two‑sided flow while maintaining a roughly balanced inventory, a rebalancing benchmark is informative because the pool is, in effect, a continuous rebalancer dictated by order flow. If your goal is directional exposure with some fee income, compare to simply holding the assets.

## Concentrated‑liquidity range decisions: fee density vs. inactivity

Concentrated liquidity raises capital efficiency by placing liquidity in a finite interval and withdrawing it from elsewhere. But the design choice carries operational and exposure trade‑offs [2].

- Scenario: You choose a tight ETH–USDC range around the current price. ETH breaks above your upper bound. Your position becomes inactive, stops earning fees, and is now concentrated in the lower‑value asset for that direction of move. The decision you face is whether the expected fee density inside the range justified the increased probability of going inactive, plus the costs of re‑ranging the position if you want to reactivate it [2].

A narrow band can be appropriate for a view that prices will hover in a small interval with frequent mean‑reverting trades. But it is also a bet on not being wrong for long. If you place a band and walk away, inactivity can dominate results in trending markets. See our primer on range mechanics and practical management in [Concentrated Liquidity Explained](/guides/concentrated-liquidity-explained) [2].

## Round trips, reversals, and what “impermanent” really means

- Scenario: A volatile pair wanders and later returns to the starting relative price. The divergence‑loss component—the difference that arose solely because the pool rebalanced your inventory while price diverged—can disappear when you exit at the original relative price [1]. That is the sense in which the loss is “impermanent.”

Two caveats matter:

- Path and timing still count. You may have paid operational costs to manage a range or reposition, or you may have been inactive for stretches in a concentrated setup and missed fees during the move back [2].
- Fees and arbitrage interactions are path‑dependent. You accrue fees when active, and arbitrage trades influence your inventory path; the net of those two effects is the alpha‑like component in the research decomposition, separate from the beta‑like market exposure [3].

A round‑trip that undoes divergence does not retroactively make the position “free.” It only neutralizes the specific benchmark‑relative divergence at exit.

## Fees are not a verdict: test them against losses and exposure

It is common to see a large, highly traded pool and infer that “fees must be lucrative.” That inference can be wrong. An empirical study reports that, across many of the largest Uniswap pools in its sample, losses to arbitrageurs exceeded fees earned by liquidity providers; it also found Uniswap v2 pools more profitable for passive providers than their Uniswap v3 counterparts in that historical sample. These are sample‑specific findings, not a universal forecast [4]. They still motivate the habit: treat volume and gross fees as inputs, not as a verdict.

This aligns with the loss‑versus‑rebalancing frame: the alpha‑like component is accrued fees minus what arbitrageurs extract, and the beta‑like component—the exposure you would have had even if you charged no fees—often explains most variance [3]. If you want to get paid for providing immediacy, benchmark your realized and expected fees against plausible losses to informed order flow and arbitrage, and against the exposure you could have held outside the pool [3] [4]. See our walkthrough of fee mechanics and distributions in [Liquidity Provider Fees](/guides/liquidity-provider-fees).

- Scenario: A large pool looks attractive because it throws off substantial fees. Before you conclude it is “good,” ask whether those fees, net of arbitrage losses and any time spent inactive (if concentrated), compensate for the exposure you take and the operational burden you bear. The cited evidence does not tell you what will happen next time, but it cautions you to test the net, not the gross [3] [4].

## Putting the pieces together with two lived situations

Let’s revisit the two practical cases through this lens.

1) ETH rallies while you remain in range (50/50 ETH–USDC, full or wide range)
- Mechanism: The pool sells your ETH into USDC via order flow, following x*y=k [1].
- Benchmark: Compare your withdrawn portfolio to (a) holding your starting ETH and USDC, or (b) a periodic 50/50 rebalancing rule that you could have implemented.
- Attribution: The difference vs your benchmark splits into (i) a divergence‑loss piece because your inventory ended up more USDC/less ETH than hold would, and (ii) the net of fees you earned minus what informed flow/arbitrage extracted while moving you there [3].
- Decision: Would you have preferred the exposure path and fee accrual of the AMM to your benchmark? If the answer depends on fine‑tuned bands or rapid repositioning, are you willing to run that process?

2) Tight concentrated range that goes inactive
- Mechanism: Once price exits, your position is out of range and no longer earns fees until price returns or you move your range [2]. Your inventory is concentrated in one asset at the boundary.
- Benchmark: Again, compare to holding or rebalancing at your own cadence.
- Attribution: If you later re‑range, your net outcome reflects time active (earning fees), time inactive (earning none), inventory at each step, and any operational costs. Your beta‑like exposure still dominates variance historically, while the alpha‑like component depends on whether fees exceeded losses to arbitrage over your path [3] [4].
- Decision: Did the expected fee density inside your band justify the odds and costs of going out‑of‑range? If the answer is “only if I manage it closely,” do you have the process (and costs) to do so?

## What to check before you act

- If price moves up or down by X% from here, can I describe how my inventory mix will change and where my position becomes inactive (if concentrated) [2]?
- Which benchmark matches my intent—holding, or a rebalancing rule—and how will I measure net performance against it, not just gross fees [3]?
- If my position goes inactive, what is my plan and cost to re‑range, and what happens if I do nothing for a while [2]?
- Do recent pool conditions plausibly support fee income that compensates for adverse selection and arbitrage, given the evidence that these can exceed fees in some samples [4]?
- Am I comfortable with the fact that most return variance may come from market exposure, not fee tweaks, per the documented decomposition [3]?

## The model is a tool—know when to stop

The constant‑product model (x*y=k) explains how inventory changes and why IL is benchmark‑relative [1]. Concentrated liquidity explains why fee density and inactivity trade off [2]. The loss‑versus‑rebalancing lens explains why you must compare to a realistic alternative and why net fees versus arbitrage matter [3]. These tools make AMM outcomes legible without promising precision about the future. Use them to frame decisions you can live with, not to chase a percentage in isolation.

## References

1. [What is Impermanent Loss?](https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss)
2. [Concentrated Liquidity](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
3. [Automated Market Making and Loss-Versus-Rebalancing](https://arxiv.org/abs/2208.06046)
4. [Measuring Arbitrage Losses and Profitability of AMM Liquidity](https://arxiv.org/html/2404.05803v2)


[1]: https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss "What is Impermanent Loss?"
[2]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity"
[3]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[4]: https://arxiv.org/html/2404.05803v2 "Measuring Arbitrage Losses and Profitability of AMM Liquidity"
