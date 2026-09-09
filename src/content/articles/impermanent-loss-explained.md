---
title: "Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes"
description: "A clear explanation of impermanent loss: why AMM rebalancing creates it, when the term is misleading, and how fees relate to the comparison."
category: "Risk & Research"
date: 2026-08-29
readTime: "9 min read"
keywords: "impermanent loss explained, AMM impermanent loss, liquidity provider risk, LP rebalancing"
featured: true
---

**Impermanent loss** describes the difference between the value of an AMM liquidity position and the value of simply holding the assets outside that pool, after their relative price changes. The term can be confusing because the effect is not a separate fee or a missing balance. It comes from the pool’s automatic rebalancing.

When the relative price of one asset rises, traders and arbitrageurs tend to remove that asset from the pool and add the other asset. The LP ends up with less of the winner and more of the relative laggard than a hold-only position would have held.

## The comparison is the point

Impermanent loss is not usually measured against the initial deposit in a vacuum. It is measured against a specified alternative: holding the initial assets in the same proportions. If the assets have both appreciated, the LP position may still be worth more in nominal terms while underperforming that alternative.

The question is therefore comparative: **did the fee income and other compensation offset the value difference created by rebalancing?**

## A simple intuition

Consider a pool with two assets that begin at the same relative value. If one doubles against the other, the pool does not keep its initial quantities. Its curve has gradually sold part of the appreciating asset as the price rose. That is what allows traders to buy from the pool, but it is also why the LP may lag a static holder of the same initial basket.

If prices later return to their starting relationship, the rebalancing effect can shrink. That is why the term “impermanent” is used. However, once an LP withdraws, or if fees and paths are included, the realized economic outcome is more nuanced than the label suggests.

## Fees are a separate component

Fees can offset the rebalancing difference. They do not repeal it. A pool with active, non-toxic trading can generate enough fees to improve the outcome. A pool exposed to a one-way market move may not. The two effects should be evaluated independently, then combined.

| Component | What it reflects |
| --- | --- |
| Relative price movement | How the external assets changed against each other |
| AMM rebalancing | How the pool altered the LP’s inventory |
| Trading fees | Compensation from eligible volume |
| Incentives | Additional rewards with their own value and dilution risk |

## Why the wording matters

“Loss” can make the concept sound like an isolated penalty. “Impermanent” can make it sound reversible by default. Neither shortcut is ideal. A better phrase is **divergence from a hold benchmark caused by automated rebalancing**.

That description is longer, but it directs attention to the real decision: what benchmark is relevant, how volatile is the pair, how does the pool rebalance, and what compensation is available for accepting that behavior?
