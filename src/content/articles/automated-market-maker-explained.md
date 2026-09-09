---
title: "Automated Market Makers Explained: The Engine Behind AMM Pools"
description: "A mechanism-first explanation of automated market makers, how they quote prices, and where their limits differ from traditional trading venues."
category: "Foundations"
date: 2026-09-08
readTime: "8 min read"
keywords: "automated market maker, AMM explained, AMM pool, DeFi exchange"
featured: true
---

An **automated market maker**, or AMM, is a smart contract that quotes trades from a defined formula and a set of token reserves. It does not need a human market maker to update every quote. Its pricing logic responds automatically when the pool’s asset balances change.

AMMs are often described as “trading without order books.” That is directionally useful, but incomplete. An AMM still has a market structure. The structure is simply embedded in a curve rather than displayed as a list of bids and asks.

## From reserves to a quote

At any given moment, an AMM has balances of the assets it holds. A trader proposes to add one asset and withdraw another. The contract calculates the resulting reserve balances and determines how much output can be released while preserving its pricing rule.

In a simple constant-product pool, the product of the two reserve balances is designed to remain approximately constant, before fees. If one reserve becomes scarcer because traders keep removing it, its marginal price rises. Large orders therefore receive progressively worse execution than small orders.

## Why the formula matters

The formula is more than an implementation detail. It determines where liquidity is deepest, how aggressively a pool moves its price, and what inventory an LP tends to hold after a market move. A stable-asset curve, a constant-product curve, and a concentrated-liquidity curve all make different trade-offs.

| Market design | Primary strength | Main trade-off |
| --- | --- | --- |
| Constant product | Simple and broad price coverage | Capital can be thin near the current price |
| Stable-swap style | Efficient for assets expected to stay close | Less suitable when the relationship breaks |
| Concentrated liquidity | Capital can be placed near an expected range | Positions may need active maintenance |

## AMM price versus market price

An AMM does not discover price in isolation. External venues, arbitrageurs, and traders connect the pool to the broader market. If a pool’s internal quote diverges from elsewhere, traders have an incentive to trade against the difference. That activity brings the pool back toward the wider market, while transferring inventory and price exposure to LPs.

This is why LP fees exist: the pool is providing a service to traders and arbitrageurs. But it is also why fee revenue should never be evaluated without the cost of rebalancing and price movement.

## The practical mental model

Think of an AMM as a **rule-based dealer**. It is always willing to quote, provided the trade fits the contract’s conditions. It is not a neutral container. The curve chooses how the dealer changes its inventory and price after every trade.

Before using a pool, identify the curve, fee tier, asset pair, and range behavior. Those four inputs reveal more about a position than any headline number alone.
