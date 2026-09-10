# Editorial Patterns & De-AI Style Guide (The LearningSEO Standard)

This reference outlines explicit sentence-level patterns, banned rhetorical habits, and required structural conventions for guides on **LiquidityPools.app**, directly modeled after the practitioner-first pedagogy of [LearningSEO.io](https://learningseo.io/).

---

## 1. The Tone Matrix: LearningSEO vs. Generic AI

| Dimension | ❌ Generic AI / Promotional Blog | ✅ LearningSEO Practitioner Standard |
| :--- | :--- | :--- |
| **Voice** | Breathless, enthusiastic, sales-oriented ("Welcome to the revolutionary world of...") | Direct, quantitative, sober ("Concentrating capital into narrow price intervals accelerates adverse selection...") |
| **Opening Hook** | Metaphorical throat-clearing ("Liquidity pools are the beating heart of DeFi...") | First-principles tension ("Every continuous AMM sells an unhedged options straddle to latency arbitrageurs...") |
| **Claims** | Unsubstantiated hype ("Experience sky-high APYs with minimal effort...") | Empirically grounded ("Gross fee APY of 45% yields net -8.2% once LVR exceeds \$140/day...") |
| **Structure** | Scattered bullet points with shallow definitions | 5-phase progressive roadmap: Mechanics $\to$ Numbers $\to$ Tools $\to$ Pitfalls $\to$ Diagnostics |
| **Mistakes** | Ignored or treated as generic "impermanent loss exists" | Dedicated dissection of specific failure modes, capital traps, and execution blunders |

---

## 2. Opening Hooks: Bad vs. Good

Every article must open directly on the core financial or architectural tension. Never write "throat-clearing" introductory paragraphs.

| ❌ Banned (AI Cliché & Fluff) | ✅ Required (Practitioner-First & Quantitative) |
| :--- | :--- |
| "In the ever-evolving world of decentralized finance, liquidity pools have emerged as a game-changer for modern finance. Delve into our guide to unlock the secrets of AMMs." | "Automated market makers that concentrate liquidity into discrete price intervals force liquidity providers to trade off elevated fee capture against accelerated adverse selection and Loss-Versus-Rebalancing (LVR)." |
| "Decentralized exchanges are revolutionary systems where smart contracts allow anyone to trade tokens seamlessly without needing a central middleman." | "A constant product market maker ($x \cdot y = k$) acts as an automated counterparty with an infinite, deterministic order book that guarantees execution at the expense of predictable slippage." |
| "Uniswap v4 is a groundbreaking protocol that unlocks unprecedented flexibility for developers through its revolutionary hooks architecture." | "Uniswap v4 consolidates multi-pool state into a single contract (`PoolManager.sol`) and relies on transient storage (`EIP-1153`) to replace multi-token ERC-20 transfers with net settlement accounting." |

---

## 3. Banned Phrases & Modern Quantitative Replacements

The automated content audit script (`scripts/content-audit.mjs`) strictly halts on:
- `in the ever-evolving world`
- `revolutionary`
- `game-changer`
- `unlock the`
- `delve into`

In addition, eliminate the following literary bloat:

| Prohibited Phrase | Reason for Ban | Recommended Quantitative Replacement |
| :--- | :--- | :--- |
| `in the ever-evolving world` | Classic filler cliché | State the exact protocol regime or market condition directly |
| `revolutionary` / `game-changer` | Empty marketing hyperbole | Explain the specific architectural efficiency gain (e.g., "reduces gas overhead by 92%") |
| `delve into` / `dive deep into` | Overused LLM transition | "We evaluate the invariant...", "To calculate the price impact..." |
| `unlock the power of` | Marketing slogan | "enables dynamic fee adjustments", "allows programmatic rebalancing" |
| `tapestry` / `landscape` | Metaphorical bloat | "EVM execution environment", "onchain liquidity ecosystem" |
| `beacon of` / `testament to` | Melodramatic rhetoric | "demonstrates", "quantifies", "proves" |
| `vital cog` / `beating heart` | Organic metaphor for software | "core liquidity infrastructure", "primary routing mechanism" |
| `secret sauce` | Colloquial fluff | "mathematical invariant", "execution algorithm", "solvency model" |
| `paradigm shift` | Overused tech jargon | "structural transition to singleton architecture" |
| `skyrocket` | Speculative pump language | "compounds at an annualized rate of..." |

---

## 4. The "Desk Field Note" Pattern

Directly mirroring the expert quotes on LearningSEO.io, every guide should include an **Author Field Note** formatted as a GitHub Alert:

```markdown
> [!TIP]
> **Desk Field Note from Marcus Vance**:
> *"Retail LPs often celebrate days with record-breaking trading volume, assuming their fee accrual will spike proportionally. What they overlook is that during volatile market regimes, over 70% of that volume represents atomic sandwich bundles and MEV arbitrage taking stale quotes against CEX price movements. You aren't earning yield from organic users; you are selling underpriced tokens to searchers."*
```

---

## 5. Common Misconceptions vs. Onchain Reality Tables

Every guide must contain a structured comparison table debunking flawed retail assumptions.

**Template**:
```markdown
## Common Misconceptions vs. Onchain Reality

| Common Misconception | Onchain Reality | Quantitative Impact on LPs |
| :--- | :--- | :--- |
| **"Higher APY pools always yield higher net returns."** | Nominal APY reflects trailing fee volume but ignores inventory depreciation and adverse selection. | Unhedged LPs in volatile pairs often experience net negative yield once LVR exceeds accrued fees. |
| **"Impermanent loss vanishes when prices return to baseline."** | While divergence loss resets, LVR accrued from directional arbitrage is permanently lost. | LPs underperform a static buy-and-hold benchmark even after round-trip price excursions. |
| **"Concentrated liquidity positions require zero active management."** | Narrow tick ranges exit active trading bands rapidly during volatility spikes, terminating fee capture. | Idle capital earns 0% while remaining 100% exposed to the depreciating token. |
```

---

## 6. Diagnostic Troubleshooting Trees

Modeled after LearningSEO's "Why my page doesn't rank" checklist, provide a decision tree to help practitioners troubleshoot underperforming capital:

```markdown
## Diagnostic Troubleshooting Flowchart: Underperforming Positions

1. **Is Fee Yield Lower Than Projected?**
   - *Check*: Ratio of toxic to organic volume on [Dune Analytics](https://dune.com).
   - *Fix*: If toxic volume > 50%, migrate liquidity to a higher fee tier (e.g., from 5 bps to 30 bps) to penalize arbitrageurs.
2. **Has Capital Exited the Active Tick Range?**
   - *Check*: Spot price versus $[P_{\min}, P_{\max}]$ boundaries.
   - *Fix*: Do not immediately rebalance if gas cost exceeds 3 days of projected fee accrual. Verify whether price breakout represents permanent structural re-pricing or transient mean-reverting volatility.
3. **Is Net PnL Negative Despite High Gross Fees?**
   - *Check*: Net PnL on [Revert Finance](https://revert.finance).
   - *Fix*: Calculate LVR: if $\frac{\sigma^2}{8} S_u L_u > \text{Fees}$, the underlying volatility regime is too high for unhedged LPing. Hedge delta via perps or withdraw capital.
```

---

## 7. Pre-Flight LP Risk & Execution Checklist

End actionable sections with a crisp operational checklist:

```markdown
## Pre-Flight LP Risk & Execution Checklist

- [ ] **Fee Tier vs. Realized Volatility**: Confirm pool fee tier (e.g., 5 bps vs. 30 bps) exceeds the expected 1-hour realized volatility ($\sigma \sqrt{\Delta t}$).
- [ ] **Adverse Selection Buffer**: Verify that toxic flow from cross-DEX arbitrageurs accounts for less than 40% of gross pool volume.
- [ ] **Gas-to-Yield Threshold**: Calculate breakeven rebalancing costs: do not rebalance if gas costs exceed 3 days of projected fee accrual.
- [ ] **Inventory Delta Boundary**: Define hard stop-loss trigger levels where the position is closed rather than held as 100% toxic inventory.
- [ ] **Tooling Instrumentation**: Bookmark pool-specific monitoring queries on [Revert Finance](https://revert.finance) and [Dune](https://dune.com).
```
