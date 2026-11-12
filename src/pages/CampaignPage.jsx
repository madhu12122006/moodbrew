import { motion } from 'framer-motion';
import {
  Info,
  Sparkles,
  Store,
  Package,
  Share2,
  QrCode,
  Sticker,
  ArrowRight,
  Music,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_DRINKS, BRAND_MEDIA, MOODS } from '../data/drinks';
import './CampaignPage.css';

const RETAIL_CONCEPTS = [
  {
    icon: Store,
    bg: 'var(--color-soft-lavender)',
    tag: 'Retail Display Concept',
    title: 'Colour-Coded MoodCooler Zones',
    description:
      'An envisioned chiller section arranged by emotional vibe rather than beverage type—Peach for Happy, Lilac for Calm, Butter Cream for Energetic, Cherry Blush for Romantic, and Mint for Focus.',
  },
  {
    icon: QrCode,
    bg: 'var(--color-butter-cream)',
    tag: 'Interactive Shelf Tag',
    title: 'Scan-to-Match Shelf Prompts',
    description:
      'Conceptual shelf talkers featuring quick QR prompts that route late-night commuters and students directly to MoodMatch in under 15 seconds.',
  },
  {
    icon: Music,
    bg: 'var(--color-matcha-mint)',
    tag: 'Audio Pairing Concept',
    title: 'Takeaway Sleeve Playlists',
    description:
      'Speculative QR codes on cup sleeves linking each mood pour to a curated Indian indie, lo-fi, or rooftop playlist.',
  },
];

const PACKAGING_IDEAS = [
  {
    icon: Package,
    bg: 'var(--color-peach-sorbet)',
    title: 'Matte Pastel 330 ml Can Sleeves',
    text: 'Tactile matte finishes colour-blocked to the six core MoodBrew hues so every mood is recognizable from across the aisle.',
  },
  {
    icon: Sticker,
    bg: 'var(--color-cherry-blush)',
    title: 'Peel-Off Mood Affirmation Stickers',
    text: 'Conceptual perforated bottle labels that peel off cleanly for laptops, Metro cards, and study notebooks.',
  },
  {
    icon: Sparkles,
    bg: 'var(--color-soft-lavender)',
    title: 'Botanical Ingredient Story Bands',
    text: 'Bold Playfair Display flavour callouts paired with handwritten tasting notes right on the front panel.',
  },
];

const SOCIAL_CAMPAIGN_CARDS = [
  {
    handle: '#SipYourMoodCheckIn',
    format: 'Short-Form Video Concept',
    bg: 'var(--color-butter-cream)',
    prompt:
      '“Show your 2 PM study mood vs your 7 PM rooftop mood” — dual-frame transition clips pairing everyday college moments with chilled pours.',
  },
  {
    handle: '#2AMConvenienceRun',
    format: 'Story Series Concept',
    bg: 'var(--color-soft-lavender)',
    prompt:
      'Midnight aesthetic photo dumps highlighting Focus Mocha Boost and Calm Lavender Fizz during creative deadlines and late rehearsals.',
  },
  {
    handle: '#MoodStickerClub',
    format: 'Community UGC Prompt',
    bg: 'var(--color-matcha-mint)',
    prompt:
      'Encouraging friends to trade colour-coded mood stickers and tag which flavour best sums up their week.',
  },
];

export default function CampaignPage() {
  return (
    <main className="campaign-page">
      {/* Top Independent Concept Notice */}
      <div className="campaign-notice-strip">
        <div className="container campaign-notice-inner" role="note">
          <Info size={17} aria-hidden="true" />
          <span>
            <strong>Independent student concept project.</strong> Not affiliated with or
            endorsed by 7-Eleven.
          </span>
        </div>
      </div>

      {/* Campaign Hero & Introduction */}
      <section className="container section-pad campaign-hero">
        <div className="campaign-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="campaign-lockup-pill">
              <span className="font-editorial lockup-name">MoodBrew</span>
              <span className="lockup-x" aria-hidden="true">×</span>
              <span className="lockup-partner">7-Eleven</span>
              <span className="lockup-tag">Concept Study</span>
            </div>

            <h1 className="campaign-title font-editorial">
              Your everyday stop, now serving every mood.
            </h1>

            <p className="campaign-intro">
              This conceptual campaign explores how MoodBrew’s personalised beverage
              identity could translate into an approachable, 24-hour convenience retail
              experience. Designed purely as an independent student portfolio project, it
              imagines turning quick everyday snack stops into expressive mood rituals—without
              representing a real launch, store inventory, or commercial partnership.
            </p>

            <div className="campaign-hero-actions">
              <Link to="/menu" className="btn btn-primary">
                <span>Explore the Mood Collection</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/discover" className="btn btn-secondary">
                Try MoodMatch
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="campaign-hero-media"
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="campaign-photo-card">
              <img
                src={BRAND_MEDIA.hero}
                alt="MoodBrew conceptual chilled sparkling beverages in pastel lighting"
                className="campaign-photo"
              />
              <div className="campaign-photo-note">
                <span className="font-hand">speculative co-branded drop</span>
                <strong>5 Moods · Chilled 330 ml Format</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conceptual Co-Branded Beverage Collection */}
      <section
        className="section-pad campaign-collection-band"
        aria-labelledby="cobranded-heading"
      >
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow">Conceptual Co-Branded Lineup</span>
            <h2 id="cobranded-heading" className="section-title">
              Five chilled concept pours for quick stops.
            </h2>
            <p className="section-subtitle">
              A speculative grab-and-go shelf lineup pairing MoodBrew’s five signature
              drinks with playful convenience-store mood cues.
            </p>
          </motion.div>

          <div className="campaign-drinks-grid">
            {ALL_DRINKS.map((drink, index) => (
              <motion.article
                key={drink.id}
                className="campaign-drink-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <div className="campaign-drink-img-wrap">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="campaign-drink-img"
                  />
                  <span
                    className="campaign-drink-mood"
                    style={{ backgroundColor: drink.accentBg }}
                  >
                    {drink.mood}
                  </span>
                </div>
                <div className="campaign-drink-body">
                  <div className="campaign-drink-head">
                    <h3 className="font-editorial">{drink.name}</h3>
                    <span className="campaign-drink-price">₹{drink.price}</span>
                  </div>
                  <p className="campaign-drink-desc">{drink.description}</p>
                  <span className="campaign-drink-edition">
                    MoodBrew × 7-Eleven Concept Edition
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Five Mood-Based Drink Recommendations */}
      <section className="container section-pad" aria-labelledby="rec-heading">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">Five Mood Pairings</span>
          <h2 id="rec-heading" className="section-title">
            Everyday stop scenarios, matched by mood.
          </h2>
        </motion.div>

        <div className="campaign-moods-list">
          {MOODS.map((mood, index) => {
            const pairedDrink = ALL_DRINKS.find(
              (d) => d.id === mood.recommendedDrinkId
            );
            return (
              <motion.div
                key={mood.id}
                className="campaign-mood-row"
                style={{ backgroundColor: mood.cardBg }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="campaign-mood-left">
                  <span className="campaign-mood-emoji" aria-hidden="true">
                    {mood.emoji}
                  </span>
                  <div>
                    <h3 className="font-editorial">
                      {mood.name} → {pairedDrink?.name}
                    </h3>
                    <p>{mood.tagline}</p>
                  </div>
                </div>
                <Link
                  to={`/discover?mood=${mood.id}`}
                  className="btn btn-secondary campaign-mood-link"
                >
                  <span>Match {mood.name}</span>
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Creative Retail Experience & Mood-Based Packaging */}
      <section className="section-pad campaign-retail-band" aria-labelledby="retail-heading">
        <div className="container">
          <div className="campaign-split-blocks">
            <div>
              <span className="section-eyebrow">Retail Experience Concept</span>
              <h2 id="retail-heading" className="section-title">
                Reimagining the neighbourhood cooler aisle.
              </h2>
              <div className="campaign-stack-cards">
                {RETAIL_CONCEPTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="campaign-info-card">
                      <span
                        className="campaign-card-icon"
                        style={{ backgroundColor: item.bg }}
                        aria-hidden="true"
                      >
                        <Icon size={19} />
                      </span>
                      <div>
                        <span className="campaign-card-tag">{item.tag}</span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="section-eyebrow">Mood-Based Packaging</span>
              <h2 className="section-title">
                Pastel cans built to carry your vibe.
              </h2>
              <div className="campaign-stack-cards">
                {PACKAGING_IDEAS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="campaign-info-card">
                      <span
                        className="campaign-card-icon"
                        style={{ backgroundColor: item.bg }}
                        aria-hidden="true"
                      >
                        <Icon size={19} />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Campaign Section */}
      <section className="container section-pad" aria-labelledby="social-heading">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">
            <Share2 size={14} aria-hidden="true" />
            <span>Social Campaign Concept</span>
          </span>
          <h2 id="social-heading" className="section-title">
            Made for feeds, mirror selfies & late-night stories.
          </h2>
        </motion.div>

        <div className="campaign-social-grid">
          {SOCIAL_CAMPAIGN_CARDS.map((card, idx) => (
            <motion.article
              key={card.handle}
              className="campaign-social-card"
              style={{ backgroundColor: card.bg }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              whileHover={{ y: -5 }}
            >
              <span className="social-format">{card.format}</span>
              <h3 className="font-editorial social-handle">{card.handle}</h3>
              <p>{card.prompt}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Closing CTA + Explicit Disclaimer */}
      <section className="container section-pad campaign-cta-section">
        <motion.div
          className="campaign-closing-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <span className="campaign-closing-badge">
            <Info size={15} aria-hidden="true" />
            <span>
              Independent student concept project. Not affiliated with or endorsed by
              7-Eleven.
            </span>
          </span>

          <h2 className="font-editorial campaign-closing-title">
            Ready to taste the collection?
          </h2>

          <p className="campaign-closing-desc">
            Browse all five MoodBrew beverages in our menu or find your exact match in
            seconds.
          </p>

          <div className="campaign-closing-actions">
            <Link to="/menu" className="btn btn-primary">
              <span>Explore the Mood Collection</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/discover" className="btn btn-secondary">
              Try MoodMatch
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
