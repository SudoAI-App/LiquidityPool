---
title: "Liquidity Pool Risks: A Complete Framework for LP Due Diligence"
seoTitle: "Liquidity Pool Risks: A Framework for LP Due Diligence"
description: "Five layers of risk in a liquidity pool: the code, the traders, the collateral behind the tokens, the price feeds, and the people who can change the rules."
category: "Risk & Research"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "9 min read"
primaryQuery: "liquidity pool risks"
keywords: "liquidity pool risks, DeFi risk management, Uniswap v4 hook security, restaking contagion, oracle manipulation, LVR, smart contract vulnerabilities, risks of providing liquidity, liquidity provider risks, can you lose money in a liquidity pool, smart contract risk liquidity pool, liquidity risk DeFi, liquidity pool withdrawal risk"
featured: false
faq:
  - q: "What are the main risks of a liquidity pool?"
    a: "Directional exposure to both assets, divergence against holding, contract and hook failure, depeg or collapse of one asset, out-of-range idleness in concentrated positions, and friction costs. Only two of those are specific to automated market making."
  - q: "How to check if a liquidity pool is safe?"
    a: "Verify the contracts and their audits, check for upgradeable proxies and admin keys, read hook permissions on newer pools, confirm liquidity is locked or burned for new tokens, and test the withdrawal path with a small amount before committing size."
  - q: "What is a rug pull in a liquidity pool?"
    a: "A deployer removing pooled liquidity or exploiting privileged token functions, leaving holders unable to sell at a meaningful price. Verifiable locked or burned liquidity, and the absence of privileged mint and blacklist functions, are the standard checks."
  - q: "Can liquidity pools lose money?"
    a: "Yes, through six distinct routes: both assets falling, divergence against holding, time out of range, contract or hook failure, a depeg that fills the pool with the failing asset, and friction costs. Only two of those are specific to automated market making."
  - q: "What happens if one token goes to zero in a pool?"
    a: "The pool keeps buying it as it falls, so it ends up holding almost entirely the worthless asset. The position approaches a total loss even though no contract failed, which is why the credibility of both assets matters more than the fee tier."
  - q: "What is liquidity risk in DeFi?"
    a: "Liquidity risk in DeFi is the risk that a position cannot be exited at a reasonable price when you need to. It shows up as thin active depth, as fragmentation across venues, as utilisation gating withdrawals in lending markets, and as depth that disappears during the volatility that makes you want to leave."
---

Every extra point of yield a pool advertises is payment for a risk somebody decided to take. Usually you. The useful question is never whether the yield is high. It is what you are being paid to underwrite.

Most people check one thing: how much the two tokens might move. That is real, and it is only part of one of five separate problems.

The five, in the order they tend to break, are the code, the traders on the other side, the collateral behind the tokens, the price feeds, and the people who can change the rules after you deposit. By the end you should have one question to ask about each before you put money in.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-risks.webp" alt="A central liquidity pool is exposed to separate asset, contract, depth, and incentive risk paths." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Five separate ways a pool can hurt you: the code, the traders, the collateral, the price feeds and the rules. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> People fixate on price moves and ignore the rest, which is backwards. Price you can model. A reentrancy bug, a manipulated price feed, or a token that quietly changes your balance when it transfers can empty a pool in one block, whichever way the market was going.

## The five layers, at a glance

| Layer | What can go wrong | How fast it happens |
| :--- | :--- | :--- |
| The code | A bug, a hook, or an admin key drains or freezes the pool | One block |
| The traders | Faster traders take more than the fees pay you | Continuously, quietly |
| The collateral | A token turns out to be backed by something that broke | Hours to days |
| The price feeds | A manipulated price lets someone borrow against nothing | One block |
| The rules | Governance or a compliance control changes your terms | Days, sometimes with no notice |

## Layer one: the code that holds your money

Much of the risk sits not in a protocol's core pool contracts but in what gets attached to them, and in how contracts interact. A study of 181 DeFi incidents found that price-oracle manipulation and unexpected interactions between permissionless contracts were the two most frequent incident types [1].

Uniswap v4 lets a pool attach custom code, called a hook, that can run at ten points in a pool's life, such as before and after every swap, and before and after liquidity is added or removed [2] [3]. That code is not written by Uniswap. It is written by whoever launched the pool.

Four things to check before you deposit behind one:

- **Can it be changed after launch?** Hooks can be upgradeable [2]. Whoever holds the upgrade key can change what the hook does to fees and withdrawals, without asking you.
- **Can it touch your exit?** A hook can be given permission to run when liquidity is removed, and through custom accounting it can charge withdrawal fees. The v4 whitepaper itself calls hooks that affect adding liquidity, but not removing it, the safer kind for providers [2].
- **Does it depend on another contract?** A hook that calls an outside contract, such as a price feed, inherits that contract's failures. If the call fails during your withdrawal, your withdrawal fails with it.
- **Has anyone audited it?** The core protocol's audits do not cover somebody else's hook.

There is a second, quieter design change. v4 keeps balances as running totals during a transaction and moves tokens once at the end, a technique called flash accounting — bookkeeping first, transfers afterwards. The pool manager requires every balance to net to zero before the transaction finishes [2], so the core enforces its own books. The exposure is in hooks that use custom accounting to move value between you and the hook, which is one more reason to read the hook itself.

## Layer two: who is on the other side of your trades

You are not quoting to a friendly crowd. You are quoting to everyone, including bots whose whole business is beating your pool to a price change [4].

Your pool only updates when a trade lands. Large exchanges update continuously. So there is always a window where your price is wrong and somebody can profit from it.

The sequence never varies:

1. A price moves on a fast exchange.
2. A bot sees your pool still quoting the old number.
3. It trades against you, taking the good side, until the gap closes.

The name for this cost is loss-versus-rebalancing, or LVR — what your pool hands over because its quote is always a step behind the market [4]. It grows with the square of how much the pair moves, and it accrues whether or not the price ends up back where it started. That makes it a better planning number than impermanent loss, the simpler gap between a pool position and just holding, which depends on where the price happens to finish.

For a full-range position, a pair moving 80% a year costs roughly 8% of the position's value a year before fees: volatility squared, divided by eight [4]. A narrower band multiplies that figure. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

Range-based pools have a sharper version. When a large trade is about to land, a bot can add liquidity at exactly the active price, collect most of that trade's fee, and withdraw in the same block. This just-in-time liquidity is rare: a little over 8,000 such transactions on Uniswap v3 between May 2021 and July 2022, a fraction of a percent of its liquidity [5].

When it happens, it takes fee income that would otherwise have gone to the providers who carried the risk all along. It is one form of MEV — profit taken by deciding which transactions run in what order. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Layer three: what the tokens are actually backed by

A token that says ETH on the label may be several steps away from ETH.

Deposit ETH with a staking service and you get a receipt token. Restake that receipt somewhere else and you get another receipt. Put the second receipt in a pool, and you are underwriting every link in the chain.

Three ways that chain breaks:

- **A penalty upstream.** If validators behind the token are penalised, the token is backed by less ETH than it was.
- **The exit queue is slow.** Minting is usually instant. Redeeming means waiting in Ethereum's withdrawal queue, whose length depends on demand [6]. In a rush, many holders sell into pools instead. In May 2022, stETH fell in value relative to ETH, and a lender that had offered daily redemption against it halted withdrawals [7].
- **The pool runs dry.** Selling pressure drains the healthy side first. A stable-style curve holds its price near par while the balances skew, then shifts toward ordinary constant-product pricing once they are badly imbalanced [8]. By then you hold mostly the broken token.

See [TVL Explained](/guides/tvl-explained/) for how those layers make headline numbers look bigger than they are.

## Layer four: the price feeds nobody looks at

Contracts cannot see prices on their own, so they read them from an outside source, called an oracle [9]. That creates loops worth understanding.

If a lending market values collateral at a pool's current price, an attacker can borrow a large sum for the length of one transaction (a flash loan), push the pool's price, borrow against the inflated collateral, and leave the lender short. Researchers who analysed two such attacks from February 2020 measured returns on capital above 500,000% [10]. How lending markets work as instruments separate from swap pools is set out in [Lending Pool vs Liquidity Pool](/guides/lending-pool-vs-liquidity-pool/).

Averaging over time helps, and it is not a cure. Uniswap v2 records the price at the start of each block so readers can average it over a window. A longer window makes manipulation more expensive, at the cost of a staler price [11]. A thin pool's average is still cheaper to move than a deep one's.

Pegged pools have their own version. Pairs like a staked-ETH token against ETH often rely on a small contract that reports how much staking yield has accrued. If it returns a stale or wrong number, the pool misprices the pair, and arbitrage trades against the error at once.

## Layer five: who can change the rules

- **Tokens that can be frozen.** Some stablecoin issuers can block transfers to and from an address on chain; Circle reserves that right for USDC [12]. If the pool's own address were blocked, the tokens inside it could not move.
- **Governance votes.** Where token holders vote on pool settings, they can change curve parameters, redirect fees or end reward programmes. Voting power in DeFi is often concentrated, and decisions can be slow when you need them fast [7].
- **Compliance controls.** Some newer pools only let allowlisted addresses trade or provide liquidity. In Uniswap's permissioned-pool design, the issuer can also halt swapping and unwind liquidity positions [13].

## What to check before you deposit

1. **Read the hook, not just the protocol.** Can it change fees, take a cut, or stop withdrawals? Is there an upgrade key, and who holds it [2]?
2. **Trace each token to what backs it.** Real reserves, a hedged position, or a stack of receipts? Is there an orderly way to redeem, and how long is the queue [6]?
3. **Compare the yield to the bleed, not to zero.** For a full-range position, annual volatility squared divided by eight is roughly the yearly share of value lost to arbitrage, and a band multiplies it [4]. A pair moving 100% a year costs about 12.5% a year at full range, so a 10% fee yield there loses money before gas. No reward programme fixes that for long.
4. **Find out where the prices come from.** A well-known multi-source feed, or a single pool's price read by something written for this pool alone?
5. **Test the exit before you need it.** Put a small amount in and take it out. Confirm the path works and note what it costs.

See [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) and the [Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/) for the long-form versions. For any pool that passes, the net outcome — fees against divergence and gas, measured against holding — is what the [LP profit and return calculator](/tools/lp-profit-calculator/) settles.

## Where to watch the numbers

- **Exploit alerts as they happen:** [CertiK Alert](https://alert.certik.com) and [Blocksec Phalcon](https://phalcon.blocksec.com).
- **Pulling apart a strange transaction:** [Tenderly](https://tenderly.co).
- **Checking a pool's real balances against its books:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **A huge borrowed position moved through the pool in one block.** Somebody used a flash loan to push the price, usually to exploit a contract that reads it. The pool itself usually survives. Check what else was reading that price.
- **The balances moved without a matching trade.** One of the tokens rebases or takes a cut on transfer, so the pool's books drifted from reality. On a v2-style pool, anyone can call its sync function to reset the books to the actual balances [11].
- **Governance has paused the protocol.** Something was found or exploited nearby. Follow the official channel, and have your withdrawal ready the moment it reopens.

## Where to go next

For a plain list of the ways money is actually lost, see [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/). The trader-driven cost is isolated in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/), and the income side in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). Security checks are in [Rug Pulls and Locked Liquidity](/guides/liquidity-pool-rug-pulls/), the costs that quietly eat small positions in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/), and the extra layers that bridged and thinly traded tokens add in [Cross-Chain Liquidity Explained](/guides/cross-chain-liquidity-explained/) and [Token Liquidity Analysis](/guides/token-liquidity-analysis/).

## References

1. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Uniswap v4 Hooks (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
6. [Staking withdrawals (ethereum.org)](https://ethereum.org/en/staking/withdrawals/)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
8. [Curve StableSwap Exchange: Overview (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
9. [Oracles (ethereum.org)](https://ethereum.org/en/developers/docs/oracles/)
10. [Attacking the DeFi Ecosystem with Flash Loans for Fun and Profit (Qin et al., 2020)](https://arxiv.org/abs/2003.03810)
11. [Uniswap v2 Core Whitepaper (Adams et al., 2020)](https://uniswap.org/whitepaper.pdf)
12. [USDC Terms (Circle)](https://www.circle.com/legal/usdc-terms)
13. [Permissioned Pools Overview (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/permissioned-pools/overview)

[1]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap Developer Documentation)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[5]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[6]: https://ethereum.org/en/staking/withdrawals/ "Staking withdrawals (ethereum.org)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[8]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "Curve StableSwap Exchange: Overview (Curve Documentation)"
[9]: https://ethereum.org/en/developers/docs/oracles/ "Oracles (ethereum.org)"
[10]: https://arxiv.org/abs/2003.03810 "Attacking the DeFi Ecosystem with Flash Loans for Fun and Profit (Qin et al., 2020)"
[11]: https://uniswap.org/whitepaper.pdf "Uniswap v2 Core Whitepaper"
[12]: https://www.circle.com/legal/usdc-terms "USDC Terms (Circle)"
[13]: https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/permissioned-pools/overview "Permissioned Pools Overview (Uniswap Developer Documentation)"
