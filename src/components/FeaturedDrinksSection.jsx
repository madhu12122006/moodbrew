import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FEATURED_DRINKS } from '../data/drinks';
import DrinkCard from './DrinkCard';
import './FeaturedDrinksSection.css';

export default function FeaturedDrinksSection() {
  return (
    <section className="section-pad featured-section" id="featured-drinks">
      <div className="container">
        <div className="featured-top-row">
          <motion.div
            className="section-header featured-header"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <span className="section-eyebrow">Featured Pours</span>
            <h2 className="section-title">Signature MoodBrews</h2>
            <p className="section-subtitle">
              Small-batch pastel sparkling coolers and botanical blends designed for Indian
              palates—balanced, chilled, and ready to sip.
            </p>
          </motion.div>

          <Link to="/menu" className="btn btn-secondary featured-all-link">
            <span>Full Menu</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="drinks-grid">
          {FEATURED_DRINKS.map((drink, index) => (
            <DrinkCard key={drink.id} drink={drink} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
