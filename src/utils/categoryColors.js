// Each category gets its own colour class, e.g. "Arts & Theatre" -> "cat-arts-theatre".
// The colours themselves are defined in App.css.
const KNOWN_CATEGORIES = ['music', 'sports', 'arts-theatre', 'film', 'miscellaneous']

export function getCategoryClass(category = '') {
  const slug = category
    .toLowerCase()
    .replace(/&/g, '')
    .trim()
    .replace(/\s+/g, '-')

  return KNOWN_CATEGORIES.includes(slug) ? `cat-${slug}` : 'cat-other'
}
