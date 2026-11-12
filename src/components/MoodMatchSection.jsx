import { motion } from 'framer-motion';
import { Wand2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MoodMatchSection.css';

const MATCH_STEPS = [
  {
    step: '01',
    badgeBg: 'var(--color-butter-cream)',
    title: 'Pick your energy',
    detail: 'Tell MoodMatch if you need a calm exhale, sunny lift, or deep-work clarity.',
  },
  {
    step: '02',
    badgeBg: 'var(--color-matcha-mint)',
    title: 'Set your flavour lane',
    detail: 'Choose between bright citrus sparkle, floral botanicals, or velvety fruit clouds.',
  },
  {
    step: '03',
    badgeBg: 'var(--color-peach-sorbet)',
    title: 'Get your pour',
    detail: 'Instant drink pairing calibrated to your playlist, weather, and moment.',
  },
];

export default function MoodMatchSection() {
  return (
    <section className="section-pad moodmatch-section">
      <div className="container">
        <motion.div
          className="moodmatch-banner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="moodmatch-orb moodmatch-orb--mint"
            aria-hidden="true"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="moodmatch-orb moodmatch-orb--butter"
            aria-hidden="true"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />

          <div className="moodmatch-copy">
            <div className="moodmatch-eyebrow-row">
              <span className="section-eyebrow moodmatch-badge">
                <Wand2 size={14} aria-hidden="true" />
                <span>MoodMatch Engine</span>
              </span>
              <span className="moodmatch-hand font-hand">15-sec vibe check</span>
            </div>

            <h2 className="moodmatch-title font-editorial">
              Can’t decode your craving? Let MoodMatch pour it for you.
            </h2>

            <p className="moodmatch-desc">
              Answer three quick vibe prompts—time of day, palate note, and current
              headspace—and we’ll pair your exact chilled MoodBrew in seconds.
            </p>

            <div className="moodmatch-cta-group">
              <Link to="/discover" className="btn btn-primary">
                <span>Find My Drink</span>
                <ArrowRight size={17} />
              </Link>
              <span className="moodmatch-note">
                <Sparkles size={15} aria-hidden="true" />
                Tailored in INR · Instant Pairing
              </span>
            </div>
          </div>

          <div className="moodmatch-steps">
            {MATCH_STEPS.map((item) => (
              <motion.div
                key={item.step}
                className="moodmatch-step-card"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
              >
                <span
                  className="step-num"
                  style={{ backgroundColor: item.badgeBg }}
                >
                  {item.step}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
