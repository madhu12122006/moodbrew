import { forwardRef, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './DrinkCard.css';

const DrinkCard = forwardRef(function DrinkCard(
  { drink, index = 0, showCategory = false },
  ref
) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = () => {
    addItem(drink);
    setAdded(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAdded(false), 1150);
  };

  return (
    <motion.article
      ref={ref}
      layout
      className="drink-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.38, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
    >
      <div className="drink-media">
        <img src={drink.image} alt={drink.name} className="drink-img" />
        <span className="drink-badge">
          {showCategory ? drink.categoryLabel : drink.badge}
        </span>
        <span
          className="drink-mood-tag"
          style={{ backgroundColor: drink.accentBg || 'var(--color-soft-lavender)' }}
        >
          {drink.mood}
        </span>
      </div>

      <div className="drink-body">
        <div className="drink-title-row">
          <h3 className="drink-name font-editorial">{drink.name}</h3>
          <span className="drink-price">₹{drink.price}</span>
        </div>

        <p className="drink-desc">{drink.description}</p>

        {drink.ingredients && (
          <div className="drink-ingredients-wrap">
            <span className="drink-ingredients-label">Ingredients</span>
            <div className="drink-notes">
              {drink.ingredients.map((item) => (
                <span key={item} className="drink-note-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="drink-footer">
          <span className="drink-volume">{drink.volume} · Chilled</span>
          <button
            type="button"
            className={`drink-add-btn ${added ? 'drink-add-btn--added' : ''}`}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <Check size={15} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
});

export default DrinkCard;
