# 🌊 LiquidityPools.app — Launch & Community Distribution Playbook

This document contains pre-approved, high-signal promotional copy and distribution drafts tailored for technical, crypto-native, and developer communities.

### Tracking links (required)

GA4 attributes 95%+ of launch-week sessions to Direct because the links below carried no campaign tags. Every link posted from this playbook must carry the campaign suffix for its channel, and must keep the trailing slash so it does not pass through a redirect:

| Channel | Suffix |
| :--- | :--- |
| Hacker News | `?utm_source=hn&utm_medium=social&utm_campaign=launch-2026-09` |
| Reddit | `?utm_source=reddit&utm_medium=social&utm_campaign=launch-2026-09` |
| X | `?utm_source=x&utm_medium=social&utm_campaign=launch-2026-09` |
| Farcaster | `?utm_source=farcaster&utm_medium=social&utm_campaign=launch-2026-09` |

Example: `https://liquiditypools.app/guides/impermanent-loss-explained/?utm_source=reddit&utm_medium=social&utm_campaign=launch-2026-09`

---

## 1. Hacker News "Show HN" (DR 90+)

### Post Details
- **Target Subreddit / Forum**: [news.ycombinator.com/submit](https://news.ycombinator.com/submit)
- **Title**: `Show HN: LiquidityPools.app – A calm, mechanism-first research library for DeFi liquidity`
- **URL**: `https://liquiditypools.app/tools/impermanent-loss-calculator/?utm_source=hn&utm_medium=social&utm_campaign=launch-2026-09` (land Show HN on the calculator, which people can try immediately, rather than on the homepage)
- **Optimal Posting Time**: Tuesday / Wednesday / Thursday 08:00–10:00 AM Eastern Time (20:00–22:00 Beijing Time)

### First Comment / Context Submission (By Founder)
```markdown
Hi HN,

Most DeFi content is either hype-driven price prediction, protocol shilling, or impenetrable smart contract bytecode. When researching how automated market makers actually work under the hood—from invariant curves to impermanent loss accounting—we found a lack of calm, mathematically honest educational material.

We built LiquidityPools.app (https://liquiditypools.app) as an independent, open-source research publication dedicated strictly to the mechanics and risks of decentralized liquidity.

What makes it different:
1. Zero tokens, zero price calls, zero ads: No affiliate links, no yield farming promotions, no token emissions.
2. Mechanism-first pedagogy: Every guide breaks down the core invariants (e.g. constant product x*y=k, concentrated liquidity tick math, and stable swap amplification coefficients).
3. Honest risk modeling: Detailed teardowns of impermanent loss vs. buy-and-hold benchmarks, MEV sandwich extraction on LPs, and cross-chain fragmentation.
4. Fast & Static: Built with Astro 7, static pages, privacy-configured analytics (IP anonymisation on, no Google Signals, no ads), and deployed on edge infrastructure.

The initial library launches with 20 long-form guides across four tracks: Foundations, LP Mechanics, Risk & Research, and Advanced.

Key reading points:
- What Is a Liquidity Pool? https://liquiditypools.app/guides/what-is-a-liquidity-pool
- The Constant Product Formula: https://liquiditypools.app/guides/constant-product-formula
- Impermanent Loss Explained Without Hand-Waving: https://liquiditypools.app/guides/impermanent-loss-explained
- Five-Part Due Diligence Framework for LPs: https://liquiditypools.app/guides/how-to-evaluate-a-liquidity-pool

Open-source on GitHub: https://github.com/SudoAI-App/LiquidityPool

We'd love feedback from traders, math nerds, and builders on whether our explanations and curve visualizations make these mechanisms legible.
```

---

## 2. Reddit r/defi & r/ethfinance (Targeted High-IQ Web3 Audiences)

### Target Communities
- **r/defi** (150k+ members, DeFi practitioners and yield farmers)
- **r/ethfinance** (Ethereum ecosystem research and economics)
- **r/UniSwap** (Active LPs dealing with v3/v4 ranges)

### Post Title
`Why 80% of Uniswap v3 LPs Underperform Holding: A Mathematical Teardown of Impermanent Loss & Fee Density`

### Post Body
```markdown
There’s an uncomfortable statistic that every liquidity provider eventually confronts: multiple academic studies (including the Bancor/Topaz research) found that roughly 50% to 80% of concentrated liquidity providers in Uniswap v3 ended up with negative returns compared to simply holding their assets in a cold wallet.

Why does this happen despite headline APRs often exceeding 50% or 100%?

Over the past few months, our team has been compiling a calm, mechanism-first research publication on AMMs (LiquidityPools.app). Here is the fundamental mismatch most LPs overlook:

### 1. The Asymmetric Rebalancing Trap
In an AMM governed by invariant curves (like $x \cdot y = k$ or concentrated virtual reserves):
- When an asset's price rallies, the pool continuously sells your appreciating asset for the depreciating one.
- When an asset crashes, the pool continuously buys the falling knife using your stable capital.
At the boundary of a concentrated liquidity range, your portfolio is 100% composed of the worse-performing asset.

### 2. The Fee Rate vs. Divergence Race
The core LP inequality is simple:
`Realized Fee Revenue > Impermanent Loss + Gas + Slippage + MEV Adverse Selection`

A 100% historical APR is a lagging indicator based on past 24h volume. If volatility expands the price 25% out of range, the impermanent loss is immediate, but fee accrual ceases the moment price exits your range.

### 3. Toxic Flow and LVR (Loss Versus Rebalancing)
LPs do not trade against benevolent retail users; a significant portion of AMM volume is arbitrage and MEV bots extracting latency surplus. LPs effectively sell free options to the fastest searchers.

---

We wrote a complete, un-hyped breakdown of the mathematics, rebalancing formulas, and due diligence steps:
- **Impermanent Loss Explained**: https://liquiditypools.app/guides/impermanent-loss-explained
- **Concentrated Liquidity & Range Management**: https://liquiditypools.app/guides/concentrated-liquidity-explained
- **A 5-Step Due Diligence Framework Before Depositing**: https://liquiditypools.app/guides/how-to-evaluate-a-liquidity-pool

The publication is completely free, non-commercial, and open-source (no tokens, no sponsors). Would love to hear how fellow LPs here model your range widths and hedge divergence loss.
```

---

## 3. Crypto Twitter / X Mega-Thread (Viral Educational Distribution)

### Tweet 1 (Hook)
> Most people enter DeFi liquidity pools expecting "passive income."
> 
> In reality, 80% of Uniswap v3 LPs underperform simple buy-and-hold.
> 
> Here are 7 counter-intuitive truths about AMMs, fees, and impermanent loss that every LP needs to understand: 🧵👇

### Tweet 2 (x*y=k reality)
> 1/ The Constant Product curve ($x \cdot y = k$) isn't just an elegant formula—it is an automated rebalancing engine that always sells your winners and buys your losers.
> 
> When Token A moons, the pool systematically drains your Token A for Token B.
> 
> Deep dive: https://liquiditypools.app/guides/constant-product-formula

### Tweet 3 (APR illusion)
> 2/ Displayed APR is a vanity metric.
> 
> Most DEX dashboards extrapolate past 24-hour volume into a 365-day return. If volume drops 80% tomorrow, or if price breaks your range by 1 tick, your effective APR drops to zero while your directional exposure remains 100%.

### Tweet 4 (Concentrated liquidity leverage)
> 3/ Concentrated liquidity is financial leverage in disguise.
> 
> By narrowing your price range from $(0, \infty)$ to $\pm 5\%$, you amplify capital efficiency by up to 40x. But you also amplify the speed of impermanent loss by the exact same multiple.

### Tweet 5 (MEV tax)
> 4/ LPs pay an invisible tax to MEV bots.
> 
> Arbitrageurs only trade against pools when the on-chain price lags Binance or Coinbase. That means LPs are always filled on the wrong side of momentum (adverse selection).
> 
> How MEV affects LPs: https://liquiditypools.app/guides/mev-and-liquidity-providers

### Tweet 6 (Due diligence checklist)
> 5/ Before depositing into ANY pool, ask 5 questions:
> • Is volume organic or wash/incentive-driven?
> • What is the fee-to-TVL ratio?
> • What happens if price drops 50%?
> • Are emissions diluting pool governance?
> • Can you withdraw without bridge risk?
> 
> Checklist: https://liquiditypools.app/guides/liquidity-pool-research-checklist

### Tweet 7 (Conclusion & Link)
> We compiled 20 long-form, math-backed guides covering everything from AMM invariants to cross-chain liquidity.
> 
> No tokens. No price calls. No sponsored shills. Just clear, durable DeFi research.
> 
> Explore the complete library: https://liquiditypools.app
> 
> Open-source: https://github.com/SudoAI-App/LiquidityPool

---

## 4. Farcaster / Warpcast Channels

### Cast to `/defi` and `/ethereum`
```
Where liquidity becomes legible. 💧

We just launched LiquidityPools.app—an open-source, mechanism-first research library breaking down the math and risks behind decentralized liquidity:

• Constant product & concentrated liquidity tick mechanics
• Mathematical teardowns of Impermanent Loss vs HODL
• MEV sandwich extraction and adverse selection on LPs
• 20 long-form guides, zero tokens, zero ads.

Read: https://liquiditypools.app
GitHub: https://github.com/SudoAI-App/LiquidityPool
```
