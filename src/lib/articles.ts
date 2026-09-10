export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  lastReviewed?: string;
  author?: string;
  readTime: string;
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
export const featuredArticles = articles.filter((article) => article.featured).slice(0, 4);
export const articleBySlug = (slug: string) => articles.find((article) => article.slug === slug);
export const categoryArticles = (category: string) => articles.filter((article) => article.category === category);
