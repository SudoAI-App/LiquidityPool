---
title: "Market Making on AMMs: A Practical Framework for Understanding LP Behavior"
description: "Connect AMM liquidity provision with market-making economics: inventory, adverse selection, spread, range placement, and risk compensation."
category: "Advanced"
date: 2026-08-22
readTime: "9 min read"
keywords: "market making AMM, AMM liquidity provider, DeFi market making, LP strategy mechanics"
featured: false
---

Supplying assets to an AMM is a form of market making. The format is automated, but the core economics are familiar: provide inventory to traders, earn compensation for doing so, and manage the fact that trade flow is often informative about price.

This perspective helps explain why liquidity provision cannot be reduced to a passive yield label.

## The inventory problem

A market maker begins with inventory and agrees to exchange it under a pricing rule. If buyers consistently want one asset, the maker may sell it and accumulate the other. That changes the maker’s exposure. AMMs encode this process in their curves.

For LPs, the result is a position that evolves as markets trade. In a volatile pair, the LP may continuously rebalance from the asset that is rising into the asset that is falling. That is the inventory cost of providing immediacy to others.

## Compensation has several forms

Traditional market makers may earn bid-ask spread, rebates, or other venue-specific compensation. AMM LPs commonly earn swap fees and, sometimes, incentive tokens. These are intended to compensate for inventory risk, adverse selection, capital commitment, and operational effort.

The key word is **intended**. Actual compensation depends on the quality of flow, market movement, competition, and the protocol’s design.

## Concentration changes the job

Concentrated-liquidity systems let LPs choose where they provide depth. This can make capital more efficient, but it also creates an inventory-management decision similar to choosing where to quote in an order book. A narrow range can earn actively while the market remains nearby and become inactive when it moves away.

The LP is choosing not only exposure to assets but exposure to a price zone.

## A practical framework

When analyzing an AMM market-making position, organize the view around four questions:

1. **Inventory:** What assets will the position own if price rises, falls, or leaves its range?
2. **Flow:** Who is likely to trade here, and why? Organic users and arbitrage have different implications.
3. **Compensation:** Which fees and rewards are available, under what conditions?
4. **Control:** How quickly can the position be adjusted, and what does adjustment cost?

## The right level of ambition

Not every LP needs to operate like a professional market maker. But every LP benefits from understanding that the pool is performing that function. The stronger the market view, the clearer the operational process, and the more explicit the risk budget, the more coherent the position becomes.

An AMM democratizes access to market-making rules. It does not make the economic trade-off disappear.
