---
title: "The Constant Product Formula: How x × y = k Shapes AMM Prices"
description: "Understand the constant product formula used by many AMMs, why price impact grows with trade size, and how the curve changes LP inventory."
category: "Foundations"
date: 2026-09-07
readTime: "8 min read"
keywords: "constant product formula, x y k AMM, Uniswap formula, AMM pricing curve"
featured: false
---

The constant product formula is one of the simplest and most influential ideas in decentralized exchange. It is usually written as **x × y = k**, where *x* and *y* are the reserves of two assets and *k* is a value the pool seeks to preserve, before accounting for fees and implementation details.

The formula is not a forecast. It is a constraint. It tells the AMM how reserves must change when a trader removes one asset and adds the other.

## Why the price moves

Suppose a pool holds equal-value amounts of Asset X and Asset Y. A trader adds X and removes Y. The new pool contains more X and less Y. To keep the product of the reserves near its prescribed value, each additional unit of Y becomes harder to withdraw. The marginal price of Y rises in terms of X.

That rising marginal cost is the pool’s **price impact**. It protects the reserve from being entirely drained at a stale price, but it also means large orders need deeper liquidity to receive efficient execution.

## A geometric way to see it

The possible reserve combinations lie on a curved line. Near the middle of the curve, where the pool has material amounts of both assets, small swaps may move the price modestly. Near either extreme, one asset is scarce. The curve becomes steep, and a trade has more dramatic price impact.

This has two implications:

- The pool can quote a price across a very wide range.
- Its capital is not equally efficient at every possible price.

## Fees change the path

Most AMMs charge a fee on the input asset. The fee is retained in, or allocated through, the pool’s accounting. In practice, this means the pool’s total value and the product relationship can grow over time as trades occur. The exact treatment differs by protocol, but the economic question remains the same: how much fee income was earned relative to the inventory transformation created by price movement?

## What the formula means for LPs

An LP in a constant-product pool does not retain fixed quantities of both assets. When one asset rises externally, arbitrage tends to remove it from the pool and add the other asset. The LP ends up with more of the relative underperformer and less of the relative outperformer than a simple hold strategy would have produced.

That rebalancing is not a flaw in the formula; it is the formula doing its job. It supplies liquidity at changing prices. The relevant question is whether the compensation for doing so fits the LP’s own risk tolerance and time horizon.

## The takeaway

The expression **x × y = k** is compact, but its consequences are broad: it generates a tradable curve, creates price impact, embeds a rebalancing policy, and explains why “providing liquidity” is an economic position rather than a passive cash equivalent.
