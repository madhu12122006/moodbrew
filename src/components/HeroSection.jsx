import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_MEDIA } from '../data/drinks';
import './HeroSection.css';

const FLOATING_BUBBLES = [
  { id: 1, size: 16, top: '12%', left: '46%', delay: 0, bg: 'var(--color-butter-cream)' },
  { id: 2, size: 11, top: '26%', left: '54%', delay: 0.8, bg: 'var(--color-matcha-mint)' },
  { id: 3, size: 20, bottom: '18%', left: '48%', delay: 1.4, bg: 'var(--color-cherry-blush)' },
  { id: 4, size: 12, top: '14%', right: '8%', delay: 0.4, bg: 'var(--color-dreamy-lilac)' },
];

export default function HeroSection() {
  const handleExploreClick = () => {
    const target = document.getElementById('featured-drinks');
    if (target) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <motion.div
        className="hero-shape hero-shape--lilac"
        aria-hidden="true"
        animate={{ y: [0, -14, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-shape hero-shape--peach"
        aria-hidden="true"
        animate={{ y: [0, 12, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {FLOATING_BUBBLES.map((bubble) => (
        <motion.span
          key={bubble.id}
          className="hero-bubble"
          aria-hidden="true"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            bottom: bubble.bottom,
            left: bubble.left,
            right: bubble.right,
            backgroundColor: bubble.bg,
          }}
          animate={{ y: [0, -14, 0], opacity: [0.55, 0.95, 0.55] }}
          transition={{
            duration: 4.5 + bubble.id * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bubble.delay,
          }}
        />
      ))}

      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-badge-row">
            <div className="hero-pill">
              <Sparkles size={14} aria-hidden="true" />
              <span>Sip Your Mood.</span>
            </div>
            <span className="hero-hand-note font-hand">
              freshly poured for India’s creative crowd
            </span>
          </div>

          <h1 className="hero-heading">
            Your Mood. <br />
            Your Drink. <br />
            <span className="hero-heading-accent">Your Moment.</span>
          </h1>

          <p className="hero-description">
            Crafted for slow balcony mornings, late-night studio sprints, and golden-hour
            plans. Botanical sparkling infusions blended with real Alphonso, Himalayan
            lavender, and Kashmiri rose—curated around how you actually feel.
          </p>

          <div className="hero-cta-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExploreClick}
            >
              <span>Explore Drinks</span>
              <ArrowRight size={17} />
            </button>
            <Link to="/discover" className="btn btn-secondary">
              Try MoodMatch
            </Link>
          </div>

          <div className="hero-meta-strip">
            <div className="hero-meta-item">
              <span className="meta-dot meta-dot--lilac" aria-hidden="true" />
              <div>
                <strong>5 Mood Profiles</strong>
                <span>Botanical pairings</span>
              </div>
            </div>
            <div className="hero-meta-item">
              <span className="meta-dot meta-dot--mint" aria-hidden="true" />
              <div>
                <strong>Indian Botanicals</strong>
                <span>Zero artificial syrups</span>
              </div>
            </div>
            <div className="hero-meta-item">
              <span className="meta-dot meta-dot--butter" aria-hidden="true" />
              <div>
                <strong>₹129 onwards</strong>
                <span>Chilled 330 ml pours</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-photo-frame">
            <img
              src={BRAND_MEDIA.hero}
              alt="Two chilled pastel MoodBrew botanical sparkling drinks in fluted crystal glasses"
              className="hero-photo"
            />
          </div>

          <motion.div
            className="hero-float-card hero-float-card--top"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="float-badge float-badge--lilac" aria-hidden="true">
              <Sparkles size={13} />
            </span>
            <div>
              <p className="float-label">Today’s Vibe</p>
              <p className="float-value">Calm × Lavender Fizz</p>
            </div>
          </motion.div>

          <motion.div
            className="hero-float-card hero-float-card--bottom"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <span className="float-badge float-badge--mint" aria-hidden="true">
              <MapPin size={13} />
            </span>
            <div>
              <p className="float-label">Conceptual Drop</p>
              <p className="float-value">Mumbai • Bengaluru • Delhi</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
