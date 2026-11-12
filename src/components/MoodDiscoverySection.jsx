import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudMoon, Zap, Heart, Sparkles, Coffee, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOODS, ALL_DRINKS } from '../data/drinks';
import './MoodDiscoverySection.css';

const MOOD_ICONS = {
  Sun,
  CloudMoon,
  Zap,
  Heart,
  Sparkles,
  Coffee,
};

export default function MoodDiscoverySection() {
  const [selectedMoodId, setSelectedMoodId] = useState('calm');

  const activeMood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[0];
  const matchedDrink = ALL_DRINKS.find(
    (d) => d.id === activeMood.recommendedDrinkId
  );

  return (
    <section className="section-pad mood-section" id="mood-discovery">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <span className="section-eyebrow">Mood Discovery</span>
          <h2 className="section-title">How’s your headspace right now?</h2>
          <p className="section-subtitle">
            Tap a mood card to preview its botanical pairing—whether you’re unwinding on a
            terrace or gearing up for a creative sprint.
          </p>
        </motion.div>

        <div className="mood-grid">
          {MOODS.map((mood, index) => {
            const IconComponent = MOOD_ICONS[mood.icon] || Sparkles;
            const isSelected = mood.id === selectedMoodId;
            return (
              <motion.button
                key={mood.id}
                type="button"
                onClick={() => setSelectedMoodId(mood.id)}
                className={`mood-card ${isSelected ? 'mood-card--active' : ''}`}
                style={{
                  backgroundColor: mood.cardBg,
                  color: mood.textColor,
                  borderColor: isSelected ? 'var(--color-plum-cocoa)' : mood.borderColor,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{
                  y: -7,
                  rotate: index % 2 === 0 ? -0.9 : 0.9,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className="mood-icon-wrap"
                  style={{
                    backgroundColor: mood.badgeBg,
                    color: mood.badgeText || 'var(--color-plum-cocoa)',
                  }}
                  aria-hidden="true"
                >
                  <IconComponent size={20} />
                </span>
                <h3 className="mood-name font-editorial">{mood.name}</h3>
                <p className="mood-tagline" style={{ color: mood.mutedColor }}>
                  {mood.tagline}
                </p>
                <span className="mood-note">{mood.botanicalNote}</span>
              </motion.button>
            );
          })}
        </div>

        {matchedDrink && (
          <motion.div
            key={activeMood.id}
            className="mood-preview-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mood-preview-left">
              <img
                src={matchedDrink.image}
                alt={matchedDrink.name}
                className="mood-preview-thumb"
              />
              <div>
                <span className="mood-preview-label">
                  Best match for <strong>{activeMood.name}</strong>
                </span>
                <h3 className="mood-preview-title font-editorial">
                  {matchedDrink.name} · ₹{matchedDrink.price}
                </h3>
                <p className="mood-preview-desc">{matchedDrink.description}</p>
              </div>
            </div>
            <Link
              to={`/discover?mood=${activeMood.id}`}
              className="btn btn-primary mood-preview-cta"
            >
              <span>Open {activeMood.name} Edit</span>
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
