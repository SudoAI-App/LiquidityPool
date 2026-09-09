---
title: "What Is a Liquidity Pool? A Clear Guide to DeFi Market Depth"
description: "Learn what a liquidity pool is, how it replaces the traditional order book, and why supplied assets make decentralized trading possible."
category: "Foundations"
date: 2026-09-09
readTime: "7 min read"
keywords: "what is a liquidity pool, DeFi liquidity pool, automated market maker, AMM"
featured: true
---

A **liquidity pool** is a smart-contract-controlled reserve of two or more digital assets that makes trades possible on a decentralized exchange. Instead of matching a buyer with a seller at every moment, the protocol lets a trader interact with a shared pool of assets.

The people or entities that place assets in that reserve are called **liquidity providers**, or LPs. In exchange for supplying inventory, LPs may receive a share of trading fees and, in some designs, additional incentives. The important point is that an LP is not simply depositing assets. They are helping create the market that other participants trade against.

## The two-sided reserve

Imagine a pool containing Asset A and Asset B. A trader who wants to acquire Asset B adds Asset A to the pool and removes Asset B. The pool’s balances change. A pricing rule then responds to those new balances, which is why the next trade can receive a different price.

This structure allows a market to remain available even when there is no specific counterparty waiting on the other side of a trade. It is one of the practical building blocks behind decentralized exchange.

> A liquidity pool is inventory plus a rule for quoting against that inventory.

## What liquidity providers receive

In many pool designs, an LP receives a token or accounting claim that represents their proportional share of the pool. That claim normally changes in value as the pool’s reserves, accrued fees, and market prices change. If an LP owns 2% of a pool, they generally have an economic claim on roughly 2% of the relevant pool position, subject to the protocol’s rules.

The fee stream is only one side of the picture. The other side is **inventory rebalancing**. As outside prices move, an AMM pool tends to sell the asset rising in relative price and accumulate the asset falling in relative price. That is central to the LP experience and is the reason concepts such as impermanent loss matter.

## Why pools matter

Liquidity pools make market making programmable. They can support swaps, onchain borrowing, derivatives collateral, stablecoin conversions, and other applications that need assets to be available under transparent rules. They also make it easier for a protocol to bootstrap a market without operating a traditional central-limit order book.

The trade-off is that the rules are visible and mechanical. A pool cannot selectively refuse price movement, smart-contract risk, or a poorly designed incentive program. Those conditions need to be understood by every participant.

## A useful starting checklist

When you encounter a pool, ask four basic questions:

1. **Which assets are in the reserve?** Their relationship drives much of the risk.
2. **What pricing curve does the pool use?** Different curves behave differently near different prices.
3. **Who earns fees, and from what activity?** Fee rate is not the same as realized income.
4. **What can change the pool’s rules?** Governance, upgrades, and incentives can alter the economics.

A liquidity pool is simple enough to describe in a sentence. Understanding a real position requires following the mechanism from trade, to reserve change, to price response, to the LP’s final inventory.
