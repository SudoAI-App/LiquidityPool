export const MAX_TITLE_CHARS = 60;
const BRAND_SUFFIX = ' — LiquidityPools.app';

// Search results truncate around 60 characters, so the brand is appended only when the
// full document title still fits; longer page titles stand on their own.
export function documentTitle(title) {
  if (title.includes('LiquidityPools.app')) return title;
  const branded = title + BRAND_SUFFIX;
  return branded.length <= MAX_TITLE_CHARS ? branded : title;
}
