---
title: "The Liquidity Pool Research Checklist: Questions to Ask Before You Act"
description: "A concise, reusable checklist for researching a liquidity pool across assets, curve design, fees, incentives, controls, and exit conditions."
category: "Advanced"
date: 2026-08-21
readTime: "7 min read"
keywords: "liquidity pool checklist, DeFi liquidity research checklist, LP due diligence checklist"
featured: false
---

A liquidity-pool research checklist is useful because it converts a complex position into a set of answerable questions. The point is not to generate a score from thin data. It is to avoid skipping the same important areas every time a new pool appears.

Use the checklist below as a pre-action research record. If a question cannot be answered confidently, that is a finding—not a box to tick.

## Asset layer

- What economic claim does each token represent?
- Are the assets volatile, correlated, pegged, wrapped, or bridged?
- What would cause their relationship to change sharply?
- What redemption, issuer, collateral, or bridge dependencies exist?

## Market-structure layer

- Which AMM curve, fee tier, and range rules apply?
- Where is active liquidity located relative to the market price?
- What price impact occurs at realistic trade sizes?
- What happens to a position when it moves out of range?

## Revenue and incentive layer

- How much of the visible return is from trading fees versus token emissions?
- What sort of volume created recent fees?
- How long are incentives scheduled to continue?
- What dilution, unlock, or price risk applies to rewards?

## Protocol and control layer

- Has the relevant code been audited, and what is the upgrade path?
- Who controls parameters, emergencies, and treasury decisions?
- What oracle, bridge, or external-service dependencies exist?
- What prior incidents or changes are relevant to the specific system?

## Operational and exit layer

- How are fees collected and positions withdrawn?
- What costs apply if the position needs to be changed?
- Can network conditions impair action during volatility?
- What is the practical exit route if a token or bridge comes under stress?

> The checklist is complete only when the researcher can describe the pool’s ordinary operation and its stressed operation with the same clarity.

## Keep an assumption log

For each answer, note whether it is a verified fact, an estimate, or an assumption. This small habit prevents a dashboard value, a marketing claim, and a risk judgment from blending into one vague conclusion.

A good checklist does not tell a reader what to do. It makes the decision surface visible. That is the foundation for any responsible approach to decentralized liquidity.
