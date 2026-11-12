import { motion } from 'framer-motion';
import { Store, Clock, Info, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CollabSection.css';

const COLLAB_HIGHLIGHTS = [
  {
    icon: Clock,
    bg: 'var(--color-butter-cream)',
    title: '24/7 Chilled Access',
    text: 'Envisioned as an always-open MoodCooler aisle for late-night study runs and early commutes.',
  },
  {
    icon: Store,
    bg: 'var(--color-matcha-mint)',
    title: 'Hyper-Local Rollout',
    text: 'Conceptualised around urban Indian neighbourhood hubs in Mumbai, Bengaluru, and Delhi NCR.',
  },
  {
    icon: Sparkles,
    bg: 'var(--color-cherry-blush)',
    title: 'Grab-and-Sip Format',
    text: 'Ready-to-chill 330 ml cans paired with QR MoodMatch playlists printed right on the sleeve.',
  },
];

export default function CollabSection() {
  return (
    <section className="section-pad collab-section" aria-labelledby="collab-heading">
      <div className="container">
        <motion.div
          className="collab-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="collab-top-bar">
            <div className="collab-disclaimer" role="note">
              <Info size={16} aria-hidden="true" />
              <span>
                Student-Created Conceptual Collaboration — Not an Official Partnership
              </span>
            </div>
            <span className="collab-hand font-hand">late-night retail concept</span>
          </div>

          <div className="collab-grid">
            <div className="collab-lead">
              <div className="collab-lockup">
                <span className="lockup-brand font-editorial">MoodBrew</span>
                <span className="lockup-times" aria-hidden="true">×</span>
                <span className="lockup-partner">7-Eleven</span>
              </div>

              <h2 id="collab-heading" className="collab-heading font-editorial">
                The 2 AM MoodCooler Concept.
              </h2>

              <p className="collab-description">
                As a student-created portfolio concept, we imagined what happens when
                artisanal mood-based beverages leave boutique cafés and enter India’s
                favourite 24/7 convenience counters. This showcase explores retail
                accessibility and packaging—it is purely conceptual and is not affiliated
                with or endorsed by 7-Eleven.
              </p>

              <Link to="/collaboration" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                <span>View Concept Campaign</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="collab-highlights">
              {COLLAB_HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="collab-highlight-item">
                    <span
                      className="collab-icon"
                      style={{ backgroundColor: item.bg }}
                      aria-hidden="true"
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
