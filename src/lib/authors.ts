export interface Author {
  id: string;
  name: string;
  role: string;
  initials: string;
  credentials: string;
  bio: string;
}

export const authors: Record<string, Author> = {
  'Dr. Elena Rostova': {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    role: 'Head of Quantitative Research & AMM Invariants',
    initials: 'ER',
    credentials: 'PhD in Financial Mathematics (Columbia); Former Options Market Maker',
    bio: 'Specializes in stochastic inventory control, automated market maker invariants, and Loss-Versus-Rebalancing (LVR) modeling. Her research focuses on options replication within concentrated liquidity curves, discrete bin pricing math, and delta-hedging frameworks for institutional LP desks.'
  },
  'Marcus Vance': {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Senior Market Microstructure & MEV Analyst',
    initials: 'MV',
    credentials: 'DeFi Microstructure Researcher; Former High-Frequency Trading Quant',
    bio: 'Investigates transaction ordering dynamics, Proposer-Builder Separation (PBS), and order flow toxicity across decentralized exchanges. His work quantifies the impact of atomic cross-DEX arbitrage, Just-In-Time (JIT) liquidity attacks, and private order flow auctions (OFAs) on LP profitability.'
  },
  'Dr. Kieran Thorne': {
    id: 'kieran-thorne',
    name: 'Dr. Kieran Thorne',
    role: 'Lead Protocol Architect & Security Auditor',
    initials: 'KT',
    credentials: 'PhD in Computer Science; EVM Systems Engineer & Smart Contract Auditor',
    bio: 'Researches EVM execution mechanics, singleton smart contract architectures, and decentralized exchange security. Specializes in transient storage (EIP-1153), Uniswap v4 hook bitmask verification, and multi-token balance accounting standards (ERC-6909).'
  },
  'Siddharth Mehta': {
    id: 'siddharth-mehta',
    name: 'Siddharth Mehta',
    role: 'Principal Risk Officer & Institutional LP Strategist',
    initials: 'SM',
    credentials: 'CFA Charterholder; Institutional DeFi Treasury & Liquidity Desk Advisor',
    bio: 'Advises institutional capital allocators, DAO treasuries, and professional market makers on liquidity provision strategies, pre-flight operational risk audits, active tick range positioning, and incentive sustainability across volatility regimes.'
  },
  'Aria Chen': {
    id: 'aria-chen',
    name: 'Aria Chen',
    role: 'Cross-Chain Infrastructure & Correlated Assets Lead',
    initials: 'AC',
    credentials: 'Systems Engineer; Cross-Chain Interoperability & Synthetic Asset Researcher',
    bio: 'Focuses on cross-chain settlement networks, intent-based routing architectures (ERC-7683), synthetic dollar collateral solvency (Ethena USDe), and liquidity dynamics in liquid staking and restaking (LST/LRT) redemption queues.'
  }
};

export const defaultAuthor: Author = {
  id: 'editorial-desk',
  name: 'LiquidityPool Research Desk',
  role: 'Quantitative DeFi Research Team',
  initials: 'LP',
  credentials: 'Independent DeFi Market Microstructure & Risk Analytics',
  bio: 'LiquidityPools.app is an independent research publication dedicated to demystifying automated market makers, onchain liquidity dynamics, and quantitative LP risk management.'
};

export function getAuthor(name?: string): Author {
  if (!name) return defaultAuthor;
  return authors[name] || defaultAuthor;
}
