export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  lastReviewed?: string;
  author: string;
  readTime: string;
  primaryQuery: string;
  keywords: string;
  faq?: { q: string; a: string }[];
  featured?: boolean;
  Content: any;
};

const modules = import.meta.glob('../content/articles/*.md', { eager: true });

export const articles: Article[] = Object.entries(modules).map(([path, module]) => {
  const item = module as any;
  return { ...item.frontmatter, slug: path.split('/').pop()!.replace('.md', ''), Content: item.default } as Article;
}).sort((a, b) => b.date.localeCompare(a.date));

export const categories = ['Foundations', 'LP Mechanics', 'Risk & Research', 'Advanced'];

export const TRACK_READING_ORDER: Record<string, string[]> = {
  'Foundations': [
    'what-is-a-liquidity-pool',
    'liquidity-pools-for-beginners',
    'what-is-a-liquidity-provider',
    'automated-market-maker-explained',
    'amm-vs-order-book',
    'constant-product-formula',
    'slippage-and-price-impact',
    'liquidity-pool-tokens',
    'liquidity-pool-types',
    'lending-pool-vs-liquidity-pool',
    'liquidity-pool-vs-staking',
    'tvl-explained',
    'apr-vs-apy-in-defi',
    'onchain-liquidity-explained'
  ],
  'LP Mechanics': [
    'how-to-provide-liquidity',
    'liquidity-provider-fees',
    'uniswap-fee-tiers-explained',
    'uniswap-v2-vs-v3',
    'concentrated-liquidity-explained',
    'uniswap-v3-ticks-and-lp-nfts',
    'concentrated-liquidity-strategy',
    'out-of-range-liquidity',
    'range-orders-on-amms',
    'single-sided-liquidity',
    'stablecoin-liquidity-pools',
    'balancer-and-weighted-pools',
    'curve-v2-cryptoswap-explained',
    'discretized-liquidity-dlmm-explained',
    'meteora-dlmm-strategy',
    'raydium-clmm-liquidity-guide',
    'uniswap-v4-architecture-and-hooks'
  ],
  'Risk & Research': [
    'can-you-lose-money-in-a-liquidity-pool',
    'liquidity-pool-risks',
    'impermanent-loss-explained',
    'impermanent-loss-formula',
    'impermanent-loss-examples',
    'how-to-avoid-impermanent-loss',
    'lp-fees-vs-impermanent-loss',
    'is-providing-liquidity-profitable',
    'lp-gas-costs',
    'how-to-evaluate-a-liquidity-pool',
    'liquidity-pool-rug-pulls',
    'liquidity-depth-and-execution',
    'token-liquidity-analysis',
    'onchain-liquidity-metrics',
    'mev-and-liquidity-providers',
    'cross-chain-liquidity-explained'
  ],
  'Advanced': [
    'loss-versus-rebalancing',
    'bonding-curves-and-amm-invariants',
    'dynamic-fees-in-amms',
    'market-making-on-amms',
    'liquidity-pool-research-checklist',
    'real-yield-liquidity-pools',
    'liquidity-mining-explained',
    'liquidity-mining-vs-yield-farming',
    'yield-farming-explained',
    'uniswap-liquidity-pools',
    'pancakeswap-liquidity-pools',
    'uniswap-v3-vs-v4'
  ]
};

export const featuredArticles = articles.filter((article) => article.featured).slice(0, 4);
export const articleBySlug = (slug: string) => articles.find((article) => article.slug === slug);
export const categoryArticles = (category: string) => {
  const order = TRACK_READING_ORDER[category] || [];
  const list = articles.filter((article) => article.category === category);
  return list.sort((a, b) => {
    const idxA = order.indexOf(a.slug);
    const idxB = order.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return b.date.localeCompare(a.date);
  });
};

export const trackInfoForArticle = (slug: string) => {
  const article = articleBySlug(slug);
  if (!article) return null;
  const track = categoryArticles(article.category);
  const index = track.findIndex((item) => item.slug === slug);
  return {
    category: article.category,
    index: index + 1,
    total: track.length,
    prev: index > 0 ? track[index - 1] : null,
    next: index < track.length - 1 ? track[index + 1] : null,
    track
  };
};
