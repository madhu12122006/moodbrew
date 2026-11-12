import { motion } from 'framer-motion';
import { Leaf, Droplets, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_MEDIA } from '../data/drinks';
import './BrandStorySection.css';

const STORY_PILLARS = [
  {
    icon: Leaf,
    bg: 'var(--color-matcha-mint)',
    label: 'Indian Botanicals',
    text: 'Ratnagiri Alphonso, Kashmiri rose petals, Gondhoraj lime, and Himalayan lavender.',
  },
  {
    icon: Droplets,
    bg: 'var(--color-soft-lavender)',
    label: 'Light & Clean',
    text: 'No heavy artificial syrups or harsh sugar crashes—just crisp sparkling balance.',
  },
  {
    icon: HeartHandshake,
    bg: 'var(--color-peach-sorbet)',
    label: 'Built for Gen-Z Rhythm',
    text: 'Crafted around real daily feelings from metro commutes to golden-hour catchups.',
  },
];

export default function BrandStorySection() {
  return (
    <section className="section-pad story-section" aria-labelledby="story-heading">
      <div className="container story-grid">
        <motion.div
          className="story-media-wrap"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <div className="story-photo-card">
            <img
              src={BRAND_MEDIA.story}
              alt="MoodBrew pastel iced beverages surrounded by fresh Indian botanicals on marble"
              className="story-photo"
            />
            <span className="story-photo-caption font-hand">
              real botanicals · zero artificial syrups
            </span>
          </div>
        </motion.div>

        <motion.div
          className="story-copy"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Our Story</span>
          <h2 id="story-heading" className="section-title">
            More than a cold drink. A small daily ritual.
          </h2>
          <p className="story-paragraph">
            MoodBrew began with a simple observation across Indian campuses and studio
            desks: every beverage aisle talked about caffeine or calories, never about how
            you actually want to feel. So we imagined a vibrant botanical ritual—bright
            enough for celebrations, soothing enough for slow evenings.
          </p>

          <div className="story-pillars">
            {STORY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.label} className="story-pillar">
                  <span
                    className="story-pillar-icon"
                    style={{ backgroundColor: pillar.bg }}
                    aria-hidden="true"
                  >
                    <Icon size={17} />
                  </span>
                  <div>
                    <h3>{pillar.label}</h3>
                    <p>{pillar.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link to="/about" className="btn btn-secondary">
            <span>Read the MoodBrew Story</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
