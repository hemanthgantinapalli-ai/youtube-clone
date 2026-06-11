/**
 * Format a view count number into a human-readable string.
 * Examples: 1500 → "1.5K views", 1200000 → "1.2M views"
 * @param {number} views
 * @returns {string}
 */
export const formatViews = (views) => {
  if (!views && views !== 0) return '0 views';
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};
