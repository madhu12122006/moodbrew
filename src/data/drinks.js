import heroImg from '../assets/hero-moodbrew.jpg';
import tropicalImg from '../assets/drink-tropical-sunshine.jpg';
import lavenderImg from '../assets/drink-lavender-fizz.jpg';
import citrusMintImg from '../assets/drink-citrus-mint.jpg';
import strawberryRoseImg from '../assets/drink-strawberry-rose.jpg';
import mochaBoostImg from '../assets/drink-mocha-boost.jpg';
import brandStoryImg from '../assets/brand-story.jpg';

export const BRAND_MEDIA = {
  hero: heroImg,
  story: brandStoryImg,
};

export const MENU_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'fruity', label: 'Fruity' },
  { id: 'refreshing', label: 'Refreshing' },
  { id: 'creamy', label: 'Creamy' },
  { id: 'energy', label: 'Energy' },
];

export const MOODS = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '☀️',
    icon: 'Sun',
    tagline: 'Golden-hour playlists & rooftop laughter',
    botanicalNote: 'Mango, orange + pineapple sparkle',
    cardBg: 'var(--color-peach-sorbet)',
    badgeBg: 'var(--color-cherry-blush)',
    textColor: 'var(--color-plum-cocoa)',
    mutedColor: 'rgba(73, 48, 82, 0.82)',
    borderColor: 'rgba(73, 48, 82, 0.16)',
    recommendedDrinkId: 'tropical-sunshine',
  },
  {
    id: 'calm',
    name: 'Calm',
    emoji: '🪻',
    icon: 'CloudMoon',
    tagline: 'Post-metro exhale & quiet balcony breeze',
    botanicalNote: 'Blueberry-inspired lavender + sparkling water',
    cardBg: 'var(--color-dreamy-lilac)',
    badgeBg: 'var(--color-soft-lavender)',
    textColor: 'var(--color-plum-cocoa)',
    mutedColor: 'rgba(73, 48, 82, 0.86)',
    borderColor: 'rgba(73, 48, 82, 0.18)',
    recommendedDrinkId: 'lavender-fizz',
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '🍋',
    icon: 'Zap',
    tagline: 'Studio sprints, skate runs & late plans',
    botanicalNote: 'Crisp lemon, mint + zesty lime',
    cardBg: 'var(--color-butter-cream)',
    badgeBg: 'var(--color-matcha-mint)',
    textColor: 'var(--color-plum-cocoa)',
    mutedColor: 'rgba(73, 48, 82, 0.84)',
    borderColor: 'rgba(73, 48, 82, 0.16)',
    recommendedDrinkId: 'citrus-mint-cooler',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '🍓',
    icon: 'Heart',
    tagline: 'Monsoon walks, film cameras & sweet notes',
    botanicalNote: 'Strawberry, rose-inspired flavour + milk',
    cardBg: 'var(--color-cherry-blush)',
    badgeBg: 'var(--color-milky-bg)',
    textColor: 'var(--color-plum-cocoa)',
    mutedColor: 'rgba(73, 48, 82, 0.88)',
    borderColor: 'rgba(73, 48, 82, 0.2)',
    recommendedDrinkId: 'strawberry-rose',
  },
  {
    id: 'focus',
    name: 'Focus',
    emoji: '☕',
    icon: 'Coffee',
    tagline: 'Deep work tabs, lo-fi beats & deadline clarity',
    botanicalNote: 'Roasted coffee, dark cocoa + milk',
    cardBg: 'var(--color-matcha-mint)',
    badgeBg: 'var(--color-plum-cocoa)',
    badgeText: 'var(--color-milky-bg)',
    textColor: 'var(--color-plum-cocoa)',
    mutedColor: 'rgba(73, 48, 82, 0.86)',
    borderColor: 'rgba(73, 48, 82, 0.18)',
    recommendedDrinkId: 'mocha-boost',
  },
];

export const ALL_DRINKS = [
  {
    id: 'tropical-sunshine',
    name: 'Tropical Sunshine',
    price: 149,
    mood: 'Happy',
    moodId: 'happy',
    categoryLabel: 'Fruity',
    categories: ['fruity', 'refreshing'],
    volume: '330 ml',
    badge: 'Golden Pour',
    accentBg: 'var(--color-peach-sorbet)',
    microcopy: 'Pure golden-hour joy in a frosted glass.',
    description:
      'Sun-kissed mango, bright orange zest, and juicy pineapple blended into an uplifting sparkling cooler.',
    ingredients: ['Mango', 'Orange', 'Pineapple', 'Sparkling Water'],
    image: tropicalImg,
    featured: true,
  },
  {
    id: 'lavender-fizz',
    name: 'Lavender Fizz',
    price: 169,
    mood: 'Calm',
    moodId: 'calm',
    categoryLabel: 'Refreshing',
    categories: ['refreshing', 'fruity'],
    volume: '330 ml',
    badge: 'Bestseller',
    accentBg: 'var(--color-soft-lavender)',
    microcopy: 'Consider this your deep exhale after a long day.',
    description:
      'Blueberry-inspired lavender flavour lifted with crisp sparkling water and soft botanical sparkle.',
    ingredients: [
      'Blueberry-Inspired Lavender',
      'Sparkling Water',
      'Citrus Zest',
    ],
    image: lavenderImg,
    featured: true,
  },
  {
    id: 'citrus-mint-cooler',
    name: 'Citrus Mint Cooler',
    price: 129,
    mood: 'Energetic',
    moodId: 'energetic',
    categoryLabel: 'Refreshing',
    categories: ['refreshing', 'energy'],
    volume: '330 ml',
    badge: 'Zero Crash',
    accentBg: 'var(--color-butter-cream)',
    microcopy: 'Instant main-character pep without the jitters.',
    description:
      'Crisp lemon, crushed garden mint, and zesty lime over ice—bright, cooling hydration for busy days.',
    ingredients: ['Lemon', 'Fresh Mint', 'Lime', 'Sparkling Water'],
    image: citrusMintImg,
    featured: true,
  },
  {
    id: 'strawberry-rose',
    name: 'Strawberry Rose',
    price: 179,
    mood: 'Romantic',
    moodId: 'romantic',
    categoryLabel: 'Creamy',
    categories: ['creamy', 'fruity'],
    volume: '330 ml',
    badge: 'Velvet Cloud',
    accentBg: 'var(--color-cherry-blush)',
    microcopy: 'Soft petals, sweet berries, and film-camera nostalgia.',
    description:
      'Lush strawberry layered with delicate rose-inspired flavour and silky chilled milk.',
    ingredients: ['Strawberry', 'Rose-Inspired Flavour', 'Chilled Milk'],
    image: strawberryRoseImg,
    featured: true,
  },
  {
    id: 'mocha-boost',
    name: 'Mocha Boost',
    price: 159,
    mood: 'Focus',
    moodId: 'focus',
    categoryLabel: 'Energy',
    categories: ['energy', 'creamy'],
    volume: '330 ml',
    badge: 'Deep Work',
    accentBg: 'var(--color-matcha-mint)',
    microcopy: 'Locked-in energy for late-night builds & studio sprints.',
    description:
      'Smooth roasted coffee blended with rich cocoa and chilled milk for steady, focused momentum.',
    ingredients: ['Coffee', 'Cocoa', 'Chilled Milk'],
    image: mochaBoostImg,
    featured: false,
  },
];

export const FEATURED_DRINKS = ALL_DRINKS.filter((drink) => drink.featured);

/**
 * Deterministically maps a mood ID to its curated mood entry and matched beverage.
 */
export function matchDrinkForMood(moodId) {
  const mood = MOODS.find((item) => item.id === moodId);
  if (!mood) return null;

  const drink =
    ALL_DRINKS.find((item) => item.id === mood.recommendedDrinkId) ||
    ALL_DRINKS.find((item) => item.moodId === mood.id) ||
    null;

  return drink ? { mood, drink } : null;
}
