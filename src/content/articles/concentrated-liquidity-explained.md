---
title: "Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk"
description: "Understand concentrated liquidity, why ranges change capital efficiency, and how active management can turn a simple LP position into a dynamic one."
category: "LP Mechanics"
date: 2026-09-01
readTime: "9 min read"
keywords: "concentrated liquidity, liquidity range, Uniswap v3 liquidity, AMM capital efficiency"
featured: true
---

**Concentrated liquidity** allows a provider to allocate capital within a chosen price interval instead of across every possible price. The idea is simple: if most trading occurs near the current market price, liquidity placed nearby can be used more efficiently than liquidity spread over an unlimited range.

This improvement in capital efficiency also adds a new decision. The LP now chooses where their liquidity is active.

## What a range does

A range has a lower and upper price boundary. While the market price remains inside those boundaries, the position can facilitate trades and, under the protocol’s rules, accrue fees. As price moves through the range, the position’s asset composition changes.

If price leaves the range, the position becomes inactive for that pool until the market re-enters or the provider changes the range. At one edge, the position can become entirely one asset; at the other, entirely the other asset. This is a logical outcome of the curve, not an exceptional failure.

## Capital efficiency versus coverage

A narrow range concentrates more liquidity near the current price. It may capture a larger share of local trading flow per unit of capital when the price stays nearby. But it also has a higher chance of becoming inactive after a directional move.

A wide range offers broader coverage and may need less frequent adjustment. The trade-off is that the same capital is dispersed across more possible prices, reducing depth close to the current market.

| Range choice | Potential benefit | Main operational cost |
| --- | --- | --- |
| Narrow | Higher local activity per unit of capital | More likely to require repositioning |
| Wide | Broader price coverage | Lower concentration near the current price |
| Full range | Simplest coverage model | Often less capital-efficient near market price |

## Range selection is a market view

Choosing a range expresses a view about price variability, expected holding period, and willingness to maintain the position. It is not merely a settings choice.

An LP should also consider the fee tier and liquidity already occupying the range. A perfectly placed range can still earn little if activity is low or competing liquidity is deep.

## The management question

Concentrated liquidity can resemble a passive position only when it is not maintained. Once a provider regularly adjusts ranges, claims fees, reacts to price movement, or uses external automation, the position becomes a more active strategy with transaction, tooling, and timing considerations.

The right takeaway is not that concentrated liquidity is always superior. It is that **efficiency comes from specificity**, and specificity requires a clearer process for handling what happens when the market no longer fits the original range.
