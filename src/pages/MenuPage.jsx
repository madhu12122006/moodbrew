import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { ALL_DRINKS, MENU_CATEGORIES } from '../data/drinks';
import { useCart } from '../context/CartContext';
import DrinkCard from '../components/DrinkCard';
import './MenuPage.css';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { count, subtotal, setIsOpen } = useCart();

  const visibleDrinks = useMemo(() => {
    if (activeCategory === 'all') return ALL_DRINKS;
    return ALL_DRINKS.filter((drink) =>
      drink.categories.includes(activeCategory)
    );
  }, [activeCategory]);

  return (
    <main className="menu-page">
      <section className="container section-pad">
        <div className="menu-top-bar">
          <motion.div
            className="menu-header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="menu-eyebrow-row">
              <span className="section-eyebrow menu-eyebrow">
                <Sparkles size={14} aria-hidden="true" />
                <span>MoodBrew Catalogue</span>
              </span>
              <span className="menu-hand font-hand">chilled 330 ml craft pours</span>
            </div>

            <h1 className="menu-title font-editorial">
              A little sip of happiness.
            </h1>
            <p className="menu-subtitle">
              Handpicked drinks for every kind of day.
            </p>
          </motion.div>

          {count > 0 && (
            <motion.button
              type="button"
              className="menu-bag-summary"
              onClick={() => setIsOpen(true)}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -2 }}
            >
              <ShoppingBag size={17} aria-hidden="true" />
              <span>
                {count} {count === 1 ? 'sip' : 'sips'} · ₹{subtotal}
              </span>
            </motion.button>
          )}
        </div>

        <div
          className="menu-filter-bar"
          role="tablist"
          aria-label="Filter beverages by category"
        >
          {MENU_CATEGORIES.map((category) => {
            const isSelected = activeCategory === category.id;
            const categoryCount =
              category.id === 'all'
                ? ALL_DRINKS.length
                : ALL_DRINKS.filter((d) => d.categories.includes(category.id)).length;

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`menu-tab-${category.id}`}
                aria-selected={isSelected}
                aria-controls="menu-drinks-panel"
                onClick={() => setActiveCategory(category.id)}
                className={`menu-filter-pill ${
                  isSelected ? 'menu-filter-pill--active' : ''
                }`}
              >
                <span>{category.label}</span>
                <span className="menu-filter-count">{categoryCount}</span>
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          id="menu-drinks-panel"
          role="tabpanel"
          aria-labelledby={`menu-tab-${activeCategory}`}
          className="menu-drinks-grid"
        >
          <AnimatePresence mode="popLayout">
            {visibleDrinks.map((drink, index) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                index={index}
                showCategory
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
