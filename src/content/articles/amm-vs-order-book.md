---
title: "AMM vs. Order Book: Two Ways to Organize a Market"
description: "Compare automated market makers and order books through pricing, liquidity provision, execution, and market-making risk."
category: "Foundations"
date: 2026-09-06
readTime: "7 min read"
keywords: "AMM vs order book, automated market maker vs order book, DEX market structure"
featured: false
---

Automated market makers and order books solve the same basic problem: how to organize buyers, sellers, prices, and available inventory. They do it with different primitives.

An **order book** records instructions to buy or sell at particular prices. A trade occurs when an incoming order meets resting liquidity. An **AMM** holds pooled inventory and calculates a quote from a formula. A trade occurs when a user accepts that formula-generated quote.

## Where liquidity lives

In an order book, liquidity is explicit. You can see bids and asks at different price levels. Market makers choose where to rest their inventory, then may cancel or replace those orders as conditions change.

In an AMM, liquidity is committed to a curve. The provider usually chooses a pool, fee tier, and—in concentrated systems—a price range. The smart contract then determines the quote within those constraints. This makes the market available continuously, but it also makes the inventory response more mechanical.

## Comparing the structures

| Question | Order book | AMM |
| --- | --- | --- |
| How is price displayed? | Discrete bids and asks | A formula applied to reserves |
| Who supplies liquidity? | Resting orders | LPs depositing into a pool or range |
| Can liquidity be withdrawn instantly? | Orders may be cancelled, subject to venue rules | Position can be changed, subject to protocol and network conditions |
| What is visible? | Depth at quoted levels | Reserve state, curve, and often range distribution |
| Main LP concern | Adverse selection and queue position | Rebalancing, range management, and contract risk |

## The shared economic problem

Both designs need someone to hold inventory when other participants want to trade. In fast markets, that inventory can be selected against: traders often arrive when the prevailing quote is less favorable than the wider market. The terms differ, but the economic pressure is familiar.

AMMs package the market-making rule inside code. Order books expose more direct control over each quote. Neither structure removes risk; each allocates it differently.

## Why a protocol might choose an AMM

An AMM can be attractive when a network needs a transparent, composable, always-on liquidity primitive. It can work without a centralized matching engine and can expose a relatively simple interface to other contracts. That does not make it universally superior. For certain assets and trading patterns, an order book may offer more granular control or capital efficiency.

The useful comparison is not “which system wins?” It is **which system best fits the asset, users, latency environment, and liquidity-provider behavior?** Once that question is asked, the differences become much easier to evaluate.
