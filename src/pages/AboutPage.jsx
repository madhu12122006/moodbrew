import { motion } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Palette,
  SlidersHorizontal,
  Leaf,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_DRINKS, BRAND_MEDIA } from '../data/drinks';
import DrinkCard from '../components/DrinkCard';
import './AboutPage.css';

const PHILOSOPHY_POINTS = [
  {
    number: '01',
    bg: 'var(--color-soft-lavender)',
    quote: 'Every mood deserves its own sip.',
    detail:
      'Whether you are riding a mid-afternoon high or decompressing after a noisy commute, your drink should match your headspace.',
  },
  {
    number: '02',
    bg: 'var(--color-butter-cream)',
    quote: 'Little moments deserve big flavours.',
    detail:
      'A five-minute terrace pause between lectures or a late-night playlist session feels richer with real fruit and botanical craft.',
  },
  {
    number: '03',
    bg: 'var(--color-matcha-mint)',
    quote: 'Good drinks, good energy, good memories.',
    detail:
      'Light, expressive pours made to share around study tables, hostel corridors, and golden-hour catchups.',
  },
];

const PERSONALITY_TRAITS = [
  {
    trait: 'Playful',
    bg: 'var(--color-peach-sorbet)',
    note: 'Never stiff or overly clinical—bright flavour names and tactile pastel packaging.',
  },
  {
    trait: 'Expressive',
    bg: 'var(--color-cherry-blush)',
    note: 'Built around honest daily feelings instead of generic nutrition buzzwords.',
  },
  {
    trait: 'Youthful',
    bg: 'var(--color-butter-cream)',
    note: 'Shaped by Indian Gen-Z café culture, late-night builds, and weekend playlists.',
  },
  {
    trait: 'Inclusive',
    bg: 'var(--color-soft-lavender)',
    note: 'Every mood—sunny, quiet, romantic, or locked-in—has a place on the shelf.',
  },
  {
    trait: 'Creative',
    bg: 'var(--color-matcha-mint)',
    note: 'Unexpected pairings like blueberry-lavender sparkle and strawberry rose milk.',
  },
];

const BRAND_VALUES = [
  {
    icon: Palette,
    bg: 'var(--color-peach-sorbet)',
    title: 'Creativity',
    text: 'Pairing Indian botanicals and café classics into colourful, memorable flavour stories.',
  },
  {
    icon: SlidersHorizontal,
    bg: 'var(--color-soft-lavender)',
    title: 'Personalisation',
    text: 'Helping you pick by emotion first through MoodMatch rather than guesswork.',
  },
  {
    icon: Leaf,
    bg: 'var(--color-matcha-mint)',
    title: 'Freshness',
    text: 'Crisp citrus, fragrant florals, and smooth chilled brews crafted without heavy syrups.',
  },
  {
    icon: Camera,
    bg: 'var(--color-butter-cream)',
    title: 'Memorable Experiences',
    text: 'Turning an ordinary drink break into a small ritual worth sharing with friends.',
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* Hero + Our Story */}
      <section className="container section-pad about-hero-section">
        <div className="about-hero-grid">
          <motion.div
            className="about-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="about-eyebrow-row">
              <span className="section-eyebrow about-eyebrow">
                <Sparkles size={14} aria-hidden="true" />
                <span>About MoodBrew</span>
              </span>
              <span className="about-hand font-hand">sip your mood, every day</span>
            </div>

            <h1 className="about-main-title font-editorial">
              More than a drink. It&apos;s a whole mood.
            </h1>

            <div className="about-story-block">
              <h2 className="about-subheading">Our Story</h2>
              <p>
                MoodBrew started with a simple question: why do beverage menus sort drinks
                only by temperature or caffeine, when people actually choose drinks by how
                they feel? From sleepy morning train rides to sunset rooftop chats,
                MoodBrew connects everyday emotions with personalised beverage experiences
                tailored to Indian Gen-Z rhythms.
              </p>
              <p>
                Each pour pairs expressive regional flavours—like mango, citrus, rose,
                lavender, and roasted coffee—with a distinct emotional vibe so picking your
                next sip feels intuitive, playful, and personal.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="about-hero-visual"
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="about-photo-frame">
              <img
                src={BRAND_MEDIA.story}
                alt="MoodBrew pastel iced beverages surrounded by botanicals on white marble"
                className="about-photo"
              />
              <span className="about-photo-caption font-hand">
                crafted for real daily feelings
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="section-pad about-band-lavender" aria-labelledby="philosophy-title">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow">Our Philosophy</span>
            <h2 id="philosophy-title" className="section-title">
              Three truths in every glass.
            </h2>
          </motion.div>

          <div className="about-philosophy-grid">
            {PHILOSOPHY_POINTS.map((item, idx) => (
              <motion.article
                key={item.number}
                className="about-philosophy-card"
                style={{ backgroundColor: item.bg }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
              >
                <span className="philosophy-num">{item.number}</span>
                <h3 className="font-editorial philosophy-quote">{item.quote}</h3>
                <p className="philosophy-detail">{item.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Personality */}
      <section className="container section-pad" aria-labelledby="personality-title">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">Our Personality</span>
          <h2 id="personality-title" className="section-title">
            How MoodBrew shows up.
          </h2>
          <p className="section-subtitle">
            Equal parts specialty café craft and playful creative energy.
          </p>
        </motion.div>

        <div className="about-personality-grid">
          {PERSONALITY_TRAITS.map((item, idx) => (
            <motion.div
              key={item.trait}
              className="personality-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <span
                className="personality-pill"
                style={{ backgroundColor: item.bg }}
              >
                {item.trait}
              </span>
              <p>{item.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Mood Collection */}
      <section className="section-pad about-collection-band" aria-labelledby="collection-title">
        <div className="container">
          <div className="about-collection-header">
            <motion.div
              className="section-header"
              style={{ marginBottom: 0 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-eyebrow">Our Mood Collection</span>
              <h2 id="collection-title" className="section-title">
                Five signature pours, five distinct feelings.
              </h2>
            </motion.div>
            <Link to="/menu" className="btn btn-secondary">
              <span>View Full Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="about-collection-grid">
            {ALL_DRINKS.map((drink, index) => (
              <DrinkCard key={drink.id} drink={drink} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="container section-pad" aria-labelledby="values-title">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">Brand Values</span>
          <h2 id="values-title" className="section-title">
            What shapes every recipe we pour.
          </h2>
        </motion.div>

        <div className="about-values-grid">
          {BRAND_VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.article
                key={val.title}
                className="value-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ y: -5 }}
              >
                <span
                  className="value-icon"
                  style={{ backgroundColor: val.bg }}
                  aria-hidden="true"
                >
                  <Icon size={20} />
                </span>
                <h3 className="font-editorial">{val.title}</h3>
                <p>{val.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container section-pad about-cta-wrap">
        <motion.div
          className="about-closing-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <span className="about-cta-icon" aria-hidden="true">
            <Heart size={20} />
          </span>
          <h2 className="font-editorial about-closing-title">
            Find your mood. Find your sip.
          </h2>
          <p className="about-closing-desc">
            Try MoodMatch to uncover your flavour pairing, or explore our student-created
            MoodBrew × 7-Eleven retail campaign concept.
          </p>
          <div className="about-closing-actions">
            <Link to="/discover" className="btn btn-primary">
              <span>Launch MoodMatch</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/collaboration" className="btn btn-secondary">
              <span>View 7-Eleven Concept</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
