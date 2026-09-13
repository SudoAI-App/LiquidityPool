import type { Article } from './articles';

export type Tool = {
  href: string;
  title: string;
  /** What the reader gets from running this calculator against the guide they are reading. */
  prompt: string;
};

export const toolCatalog = {
  impermanentLoss: {
    href: '/tools/impermanent-loss-calculator/',
    title: 'Impermanent Loss Calculator',
    prompt: 'Compare 50/50, weighted, and concentrated ranges against holding, then share the exact scenario by URL.'
  },
  poolFees: {
    href: '/tools/liquidity-pool-calculator/',
    title: 'Liquidity Pool Fees, Rewards & APR Calculator',
    prompt: 'Keep trading-fee APR and incentive APR separate before combining them net of gas.'
  },
  lpProfit: {
    href: '/tools/lp-profit-calculator/',
    title: 'LP Profit & Return Calculator',
    prompt: 'Put fees, divergence and gas on one ledger and compare the result against holding the tokens.'
  },
  uniswapV3: {
    href: '/tools/uniswap-v3-liquidity-calculator/',
    title: 'Uniswap v3 & Concentrated Liquidity Calculator',
    prompt: 'Set a bounded range to see capital efficiency, token mix at each bound and fees against holding.'
  },
  meteoraDlmm: {
    href: '/tools/meteora-dlmm-calculator/',
    title: 'Meteora DLMM Calculator',
    prompt: 'Model discrete bin prices, allocation shapes, base and variable fees, and divergence against holding.'
  }
} satisfies Record<string, Tool>;

type ToolKey = keyof typeof toolCatalog;

// Guides whose subject maps directly onto one calculator. Everything else falls back by track.
const guideTool: Record<string, ToolKey> = {
  'impermanent-loss-explained': 'impermanentLoss',
  'impermanent-loss-formula': 'impermanentLoss',
  'impermanent-loss-examples': 'impermanentLoss',
  'how-to-avoid-impermanent-loss': 'impermanentLoss',
  'can-you-lose-money-in-a-liquidity-pool': 'impermanentLoss',
  'constant-product-formula': 'impermanentLoss',
  'loss-versus-rebalancing': 'impermanentLoss',
  'liquidity-provider-fees': 'poolFees',
  'apr-vs-apy-in-defi': 'poolFees',
  'dynamic-fees-in-amms': 'poolFees',
  'liquidity-mining-explained': 'poolFees',
  'liquidity-mining-vs-yield-farming': 'poolFees',
  'yield-farming-explained': 'poolFees',
  'real-yield-liquidity-pools': 'poolFees',
  'stablecoin-liquidity-pools': 'poolFees',
  'tvl-explained': 'poolFees',
  'lp-fees-vs-impermanent-loss': 'lpProfit',
  'is-providing-liquidity-profitable': 'lpProfit',
  'lp-gas-costs': 'lpProfit',
  'what-is-a-liquidity-provider': 'lpProfit',
  'how-to-provide-liquidity': 'lpProfit',
  'concentrated-liquidity-explained': 'uniswapV3',
  'concentrated-liquidity-strategy': 'uniswapV3',
  'uniswap-fee-tiers-explained': 'uniswapV3',
  'uniswap-v3-ticks-and-lp-nfts': 'uniswapV3',
  'uniswap-v2-vs-v3': 'uniswapV3',
  'uniswap-v3-vs-v4': 'uniswapV3',
  'uniswap-liquidity-pools': 'uniswapV3',
  'uniswap-v4-architecture-and-hooks': 'uniswapV3',
  'out-of-range-liquidity': 'uniswapV3',
  'range-orders-on-amms': 'uniswapV3',
  'raydium-clmm-liquidity-guide': 'uniswapV3',
  'pancakeswap-liquidity-pools': 'uniswapV3',
  'meteora-dlmm-strategy': 'meteoraDlmm',
  'discretized-liquidity-dlmm-explained': 'meteoraDlmm'
};

const trackTool: Record<string, ToolKey> = {
  'Foundations': 'impermanentLoss',
  'LP Mechanics': 'poolFees',
  'Risk & Research': 'impermanentLoss',
  'Advanced': 'lpProfit'
};

export const toolForGuide = (article: Pick<Article, 'slug' | 'category'>): Tool =>
  toolCatalog[guideTool[article.slug] ?? trackTool[article.category] ?? 'impermanentLoss'];
