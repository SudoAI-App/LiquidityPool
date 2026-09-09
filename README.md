# 💧 LiquidityPools.app

[![Live Website](https://img.shields.io/badge/Live_Site-liquiditypools.app-16a34a?style=for-the-badge&logo=google-chrome&logoColor=white)](https://liquiditypools.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-7.2-ff5d01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![DeFi Research](https://img.shields.io/badge/Research-Mechanism--First-emerald?style=for-the-badge)](https://liquiditypools.app/guides)

> **Where liquidity becomes legible.**  
> An independent, open-source DeFi research publication focused on the mechanisms, mathematics, risks, and research methods behind decentralized liquidity. The site is designed as a durable educational reference library rather than a price-prediction or trading interface.

🌐 **Explore the live research library**: [https://liquiditypools.app](https://liquiditypools.app)

---

## 📚 The 20 Core Mechanism Guides

### Track 1: Foundations (Core Vocabulary & AMM Pricing)
- [What Is a Liquidity Pool? A Clear Guide to DeFi Market Depth](https://liquiditypools.app/guides/what-is-a-liquidity-pool)
- [Automated Market Makers Explained: The Engine Behind AMM Pools](https://liquiditypools.app/guides/automated-market-maker-explained)
- [The Constant Product Formula: How x × y = k Shapes AMM Prices](https://liquiditypools.app/guides/constant-product-formula)
- [AMM vs. Order Book: Two Ways to Organize a Market](https://liquiditypools.app/guides/amm-vs-order-book)
- [Liquidity Pool Tokens Explained: What an LP Position Represents](https://liquiditypools.app/guides/liquidity-pool-tokens)
- [TVL Explained: What Total Value Locked Can—and Cannot—Tell You](https://liquiditypools.app/guides/tvl-explained)

### Track 2: LP Mechanics (Fees, Ranges & Capital Efficiency)
- [How to Provide Liquidity: A Mechanism-First Walkthrough](https://liquiditypools.app/guides/how-to-provide-liquidity)
- [Liquidity Provider Fees: How LP Revenue Is Generated and Measured](https://liquiditypools.app/guides/liquidity-provider-fees)
- [Concentrated Liquidity Explained: Range, Capital Efficiency, and Risk](https://liquiditypools.app/guides/concentrated-liquidity-explained)
- [Range Orders on AMMs: How Liquidity Can Express a Price View](https://liquiditypools.app/guides/range-orders-on-amms)
- [Stablecoin Liquidity Pools: Efficient Curves, Depeg Risk, and Due Diligence](https://liquiditypools.app/guides/stablecoin-liquidity-pools)

### Track 3: Risk & Research (Impermanent Loss, MEV & Due Diligence)
- [Impermanent Loss Explained: Rebalancing, Relative Price, and LP Outcomes](https://liquiditypools.app/guides/impermanent-loss-explained)
- [Liquidity Pool Risks: A Complete Framework for LP Due Diligence](https://liquiditypools.app/guides/liquidity-pool-risks)
- [MEV and Liquidity Providers: How Execution Conditions Affect LPs](https://liquiditypools.app/guides/mev-and-liquidity-providers)
- [Cross-Chain Liquidity Explained: What Moves, What Fragments, and What Can Break](https://liquiditypools.app/guides/cross-chain-liquidity-explained)
- [How to Evaluate a Liquidity Pool: A Five-Part Research Framework](https://liquiditypools.app/guides/how-to-evaluate-a-liquidity-pool)
- [Onchain Liquidity Metrics: What to Measure Beyond TVL and Volume](https://liquiditypools.app/guides/onchain-liquidity-metrics)

### Track 4: Advanced (Incentives & Market Making)
- [Liquidity Mining Explained: Incentives, Emissions, and Durable Market Depth](https://liquiditypools.app/guides/liquidity-mining-explained)
- [Market Making on AMMs: A Practical Framework for Understanding LP Behavior](https://liquiditypools.app/guides/market-making-on-amms)
- [The Liquidity Pool Research Checklist: Questions to Ask Before You Act](https://liquiditypools.app/guides/liquidity-pool-research-checklist)

---

## 🛠️ Local Development & Contributing

```bash
pnpm install
pnpm dev
```

The site uses Astro and runs on `http://localhost:4321` by default. The Vite configuration allows managed preview hosts, which is useful in cloud development environments.

## Production build

```bash
pnpm build
pnpm check
pnpm content:audit
```

The static production output is written to `dist/public`. The project has been verified with Astro build and type checks.

## Content architecture

Guide content lives in `src/content/articles/`. Each Markdown article contains title, description, category, publication date, review date, author, reading time, keyword theme, and featured status in frontmatter. The guide pages and XML sitemap are generated statically during the build.

Article visuals are stored under `public/images/guides/`; the original source pages and licenses are tracked in [`ASSET-SOURCES.md`](./ASSET-SOURCES.md). Run `pnpm content:audit` before publishing to enforce the launch-library quality floor: a source list, internal links, a visual, review metadata, five substantive sections, and at least 1,300 words per guide.

The launch SEO strategy and the full 20-article plan are documented in [`SEO-LAUNCH-PLAN.md`](./SEO-LAUNCH-PLAN.md).

## Deployment

The output is compatible with Cloudflare Workers static assets. Before deploying, create or confirm a Cloudflare Worker and bind the `liquiditypools.app` custom domain to the Worker route. Do not store Cloudflare credentials in this repository.
