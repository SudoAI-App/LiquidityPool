---
title: "Real Yield in Liquidity Pools: Who Actually Pays You"
description: "Real yield separates fee-funded income from emission-funded income. How to decompose any quoted rate, price dilution honestly, and test what survives when incentives end."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Siddharth Mehta"
readTime: "11 min read"
keywords: "real yield liquidity pools, real yield DeFi, fee yield vs emissions, emission funded yield, sustainable DeFi yield, is high APY liquidity pool safe"
featured: false
faq:
  - q: "What is real yield in DeFi?"
    a: "Income paid out of fees actually collected from users, rather than out of newly issued tokens. It matters because fee-funded income persists while the protocol has activity, whereas emission-funded income ends when the schedule ends and dilutes existing holders while it runs."
  - q: "How do I tell how much of a pool's yield is real?"
    a: "Split the quoted rate into base fee yield and reward yield, which most yield aggregators publish separately, then verify the base figure against the pool's own fee and liquidity data over at least thirty days."
  - q: "Is emission-funded yield always bad?"
    a: "No. Bootstrapping depth on a new pair is a legitimate use of issuance, and being paid to provide that depth can be a sound trade. The error is counting issuance as income without pricing what issuing it costs the token you are being paid in."
  - q: "Is a high APY liquidity pool safe?"
    a: "A persistently high rate is compensation for something specific: volatility, thin liquidity, a taper schedule, or an unreviewed contract. Identify which before deciding whether the rate is adequate for the exposure."
  - q: "What happens to a pool when emissions stop?"
    a: "Capital that arrived for the emissions usually leaves within days. Depth falls, routers send less volume, and fee income for the remaining providers declines. Pools that were viable on fees alone survive the transition; the others do not."
---

Two pools quote 24%. In the first, every point is paid by traders who wanted to swap. In the second, four points come from traders and twenty from a token the protocol is printing. Both figures are accurate and they describe completely different instruments.

Real yield is the discipline of separating those two lines before comparing anything.

<figure class="article-figure">
  <img src="/images/guides/real-yield-liquidity-pools.webp" alt="Two panels comparing fee-funded and emission-funded yield across source, persistence, dilution and denomination." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same headline percentage, paid from two very different balance sheets. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"I ask one question of any farm proposal: if issuance stopped this evening, what is the position earning tomorrow morning? If the answer is close to zero, then we are not underwriting a liquidity business, we are holding a token with extra steps, and it should be sized like a token position."*

## 1. The Two Revenue Lines

**Fee-funded income** is a claim on activity that has already happened. Traders paid to use the pool, and a share of that payment accrues to the liquidity that served them. It requires no new supply, dilutes nobody, and continues for as long as the pair keeps trading.

**Emission-funded income** is a claim on future supply. The protocol mints tokens on a schedule and distributes them to depositors. It can be far larger than fee income, it ends on a published date or at a governance vote, and every unit issued is a unit somebody must absorb.

The structural difference shows up everywhere: in persistence, in what the income is denominated in, and in whether the payment is affected by the recipient's own decision to sell it. Fee income is not. Emission income is, because everyone receiving it faces the same choice at the same time.

---

## 2. Decomposing a Quoted Rate

Most aggregators publish base and reward yield separately. Where they do not, the decomposition is computable:

$$
\text{fee APR} = \frac{\text{fees over window}}{\text{liquidity supplying them}} \times \frac{365}{\text{window in days}}
$$

Everything above that figure in the quoted rate is incentive income. Verify the base figure over at least thirty days rather than a single day, because volume clusters around events and a one-day window will not repeat.

A worked decomposition:

| Line | Value |
| :--- | ---: |
| Quoted rate | 41.0% |
| Pool fees over 30 days | \$96,000 |
| Average liquidity | \$14,000,000 |
| Computed fee APR | 8.3% |
| Implied emission component | 32.7% |
| Emission token 90-day price change | −38% |
| Haircut emission value at weekly sale | roughly 20% |
| Adjusted total | roughly 28% |

The adjustment is not a prediction. It is the observation that a token issued continuously and sold weekly has been realising materially less than its quoted value, and that pattern is measurable rather than assumed.

---

## 3. Pricing Dilution

If a programme emits a fraction $e$ of circulating supply per week and a fraction $\alpha$ of recipients sell within the week, weekly selling pressure is $\alpha e$ of supply. For the quoted yield to hold, organic demand must absorb that flow without a price decline.

Three checks make this concrete:

1. **Read the emission schedule from the contract**, not from an interface. Note the rate, the decay, and any governance ability to change it.
2. **Compute weekly issuance as a share of circulating supply.** Anything above one or two percent per week is a heavy load on a thin market.
3. **Compare issuance against realised trading volume in the token.** A token issuing more per week than it trades in a day cannot absorb the flow.

The design side of incentive programmes is covered in [Liquidity Mining Explained](/guides/liquidity-mining-explained/), and the user side in [Yield Farming Explained](/guides/yield-farming-explained/).

---

## 4. The Emissions-to-Zero Test

The single most useful test is also the simplest. Set the reward component to zero and ask whether you would still supply the pool at the remaining rate, given the divergence the pair generates.

| Pool | Quoted | Fee-only | Divergence hurdle | Verdict |
| :--- | ---: | ---: | ---: | :--- |
| Stable pair, mature | 6.5% | 6.1% | very low | Supply on fees alone |
| ETH major, deep tier | 19.0% | 14.5% | moderate | Supply on fees alone |
| Mid-cap, incentivised | 44.0% | 3.2% | high | Token position, not an LP business |
| New launch, heavy farm | 180.0% | 0.9% | very high | Emissions are the entire thesis |

Rows three and four are not automatically rejections. They are reclassifications: the position should be sized, monitored and exited as a token exposure, because that is what it is.

---

## 5. What Makes Fee Income Durable

Not all fee yield is equally persistent either. Three properties separate durable fee income from a temporary spike:

- **Flow quality.** Volume dominated by arbitrage reprices the pool at LP expense while paying a fee, so the same headline volume can be worth less than it appears. See [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/).
- **Competitive position.** A pool holding routed volume because it is the deepest venue keeps it; one holding volume because of a temporary incentive does not.
- **Fee tier fit.** A tier chosen for the pair's volatility earns through cycles, whereas a mismatched tier loses volume in calm markets or loses money in volatile ones.

---

## 6. Building a Portfolio on the Distinction

A workable policy for most allocations:

- **Core positions** in pools that clear their divergence hurdle on fee income alone, sized for the long horizon.
- **Satellite positions** in incentivised pools, sized as token exposure, with a fixed sale schedule for emissions and a defined exit when the taper begins.
- **No positions** justified solely by a rate whose composition you have not decomposed.

That policy is dull, which is the point. It removes the failure mode where a portfolio drifts into holding a basket of farm tokens without anyone deciding to hold them.

### What a taper looks like from inside a position

A pool paying 38% total, of which 30 points are emissions, announces a halving of its gauge weight in two weeks.

Week zero: liquidity is \$60m and the quoted rate holds. Week one: forward-looking providers begin withdrawing, and liquidity falls to \$48m. The fee-only yield rises mechanically because the same volume is now shared among less liquidity. Week two: the halving lands, the quoted rate drops to roughly 23%, and liquidity falls to \$28m over the following days.

Now the second-order effect. With less depth, price impact for large orders worsens, routers send a smaller share of flow to the pool, and realised volume falls by perhaps a third. Fee-only yield ends up above where it started but far below the naive calculation that assumed volume was unaffected by depth.

Providers who modelled fee-only yield at entry knew roughly where this would settle and either stayed deliberately or left early. Providers who annualised the launch week discovered the taper as a surprise and exited into a book that was thinner than the one they entered through, paying the difference in price impact. Neither the emission nor the taper was hidden; both were published in the contract before the first deposit.

---

## 7. Checklist

- [ ] Split every quoted rate into fee and emission components before comparing.
- [ ] Verify the fee component against thirty days of pool data.
- [ ] Read the emission schedule and decay from the contract.
- [ ] Compute weekly issuance as a share of circulating supply and against token volume.
- [ ] Haircut emission value to what a realistic sale schedule realises.
- [ ] Run the emissions-to-zero test and classify the position accordingly.
- [ ] Set an alert for governance proposals that change gauge weights or emission rates.

Real yield is not a marketing category. It is a question about who is paying, and the answer changes how the position should be sized.

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [DeFiLlama Yields methodology](https://defillama.com/yields)
5. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://defillama.com/yields "DeFiLlama Yields"
[5]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
