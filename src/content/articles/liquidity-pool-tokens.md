---
title: "Liquidity Pool Tokens Explained: What an LP Position Represents"
description: "Understand LP tokens and liquidity position NFTs as accounting claims on pool inventory, fee growth, and a protocol’s position rules."
category: "Foundations"
date: 2026-09-05
readTime: "6 min read"
keywords: "liquidity pool tokens, LP tokens explained, liquidity position NFT, DeFi LP token"
featured: false
---

When someone contributes assets to a liquidity pool, the protocol needs a way to record their share. In early AMM designs, that record was often a fungible **LP token**. In more customized designs, especially concentrated-liquidity systems, the record can be a non-fungible position token.

The format is secondary. The key idea is that the token is an **accounting claim** on a position governed by the pool’s rules.

## The proportional-share model

In a conventional pooled position, an LP token may represent a percentage of the pool. If the pool has accumulated fees and its reserves have changed, the claim changes with it. Redeeming the token generally returns the position’s proportional share of the assets currently held by the pool, not necessarily the same asset quantities originally deposited.

That last distinction matters. LP tokens do not freeze the original deposit. They track participation in a dynamic reserve.

## Why some positions are NFTs

Concentrated-liquidity AMMs let providers choose a specific price interval. Two providers in the same pool may have different ranges, fee tiers, liquidity sizes, and fee accrual. Those positions are not interchangeable, so a fungible receipt is not always sufficient.

A position NFT, or similar unique accounting object, can encode those parameters. It represents a particular rule set rather than a generic slice of every reserve in the pool.

## Do not confuse receipt with safety

A tokenized receipt can be useful as collateral, a portfolio record, or a transferable claim. It does not turn a liquidity position into a fixed-income asset. The underlying position can still be exposed to market movement, range exit, smart-contract design, and changes in incentives.

Before interpreting an LP token’s value, check:

1. **What underlying assets does the position currently own?**
2. **Does the position share all trading activity or only a selected range?**
3. **Are uncollected fees included in the visible balance?**
4. **Can the protocol alter fees, ranges, or accounting rules?**

## A better way to describe it

Instead of saying “an LP token is a deposit receipt,” say: **an LP token is a representation of an evolving market-making position.** It may be easy to transfer, but it still inherits the economics of the pool beneath it.

That framing helps when comparing positions across protocols. The important unit is not the token symbol. It is the combination of assets, curve, range, fee logic, and withdrawal rights that the token represents.
