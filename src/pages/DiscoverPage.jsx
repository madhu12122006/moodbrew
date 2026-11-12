import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles,
  Check,
  ShoppingBag,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { MOODS, ALL_DRINKS, matchDrinkForMood } from '../data/drinks';
import { useCart } from '../context/CartContext';
import './DiscoverPage.css';

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParam = searchParams.get('mood');
  const initialMood = MOODS.some((m) => m.id === initialParam) ? initialParam : null;

  const [selectedMoodId, setSelectedMoodId] = useState(initialMood);
  const [justAdded, setJustAdded] = useState(false);

  const cardsSectionRef = useRef(null);
  const recommendationRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const addedTimerRef = useRef(null);
  const { addItem, setIsOpen } = useCart();

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current);
    };
  }, []);

  const getScrollBehavior = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

  // Keep state synced if user navigates with a ?mood= query param
  useEffect(() => {
    if (initialParam && MOODS.some((m) => m.id === initialParam)) {
      setSelectedMoodId(initialParam);
    }
  }, [initialParam]);

  const matchResult = useMemo(
    () => (selectedMoodId ? matchDrinkForMood(selectedMoodId) : null),
    [selectedMoodId]
  );

  const handleSelectMood = (moodId) => {
    setSelectedMoodId(moodId);
    setJustAdded(false);
    setSearchParams({ mood: moodId });

    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(() => {
      recommendationRef.current?.scrollIntoView({
        behavior: getScrollBehavior(),
        block: 'nearest',
      });
    }, 90);
  };

  const handleTryAnother = () => {
    setSelectedMoodId(null);
    setJustAdded(false);
    setSearchParams({});
    cardsSectionRef.current?.scrollIntoView({
      behavior: getScrollBehavior(),
      block: 'start',
    });
  };

  const handleAddToCart = (drink) => {
    addItem(drink);
    setJustAdded(true);
    if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current);
    addedTimerRef.current = window.setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  return (
    <main className="discover-page">
      <section className="container section-pad" ref={cardsSectionRef}>
        <motion.div
          className="discover-hero-header"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="discover-eyebrow-row">
            <span className="section-eyebrow discover-eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              <span>MoodMatch</span>
            </span>
            <span className="discover-hand font-hand">
              pick a vibe, meet your sip
            </span>
          </div>

          <h1 className="discover-title font-editorial">What&apos;s your mood today?</h1>
          <p className="discover-subtitle">
            We&apos;ve got a sip for every version of you.
          </p>
        </motion.div>

        <div
          className="moodmatch-cards-grid"
          role="group"
          aria-label="Choose your current mood"
        >
          {MOODS.map((mood, index) => {
            const pairedDrink = ALL_DRINKS.find(
              (d) => d.id === mood.recommendedDrinkId
            );
            const isSelected = selectedMoodId === mood.id;

            return (
              <motion.button
                key={mood.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectMood(mood.id)}
                className={`moodmatch-card ${
                  isSelected ? 'moodmatch-card--selected' : ''
                }`}
                style={{
                  backgroundColor: mood.cardBg,
                  color: mood.textColor,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isSelected ? 1.015 : 1,
                }}
                transition={{
                  duration: 0.42,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                  rotate: index % 2 === 0 ? -0.6 : 0.6,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="moodmatch-card-top">
                  <span
                    className="moodmatch-emoji-pill"
                    style={{
                      backgroundColor: mood.badgeBg,
                      color: mood.badgeText || 'var(--color-plum-cocoa)',
                    }}
                  >
                    <span aria-hidden="true">{mood.emoji}</span>
                    <span>{mood.name} Mood</span>
                  </span>

                  {isSelected && (
                    <motion.span
                      className="moodmatch-selected-pill"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check size={12} aria-hidden="true" />
                      <span>Selected</span>
                    </motion.span>
                  )}
                </div>

                <div className="moodmatch-card-body">
                  {pairedDrink && (
                    <div className="moodmatch-card-photo-wrap">
                      <img
                        src={pairedDrink.image}
                        alt={pairedDrink.name}
                        className="moodmatch-card-photo"
                      />
                    </div>
                  )}
                  <div className="moodmatch-card-copy">
                    <h2 className="moodmatch-card-title font-editorial">
                      {mood.name} <span aria-hidden="true">{mood.emoji}</span>
                    </h2>
                    <p className="moodmatch-card-desc">{mood.tagline}</p>
                  </div>
                </div>

                <div className="moodmatch-card-footer">
                  <span className="moodmatch-card-drink-name">
                    <span>Pairs with {pairedDrink?.name}</span>
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div ref={recommendationRef} className="recommendation-shell">
          <AnimatePresence mode="wait">
            {!matchResult ? (
              <motion.div
                key="empty-cue"
                className="discover-prompt-cue"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <Sparkles size={18} aria-hidden="true" />
                <span>
                  Tap any mood card above to reveal your curated MoodBrew pairing.
                </span>
              </motion.div>
            ) : (
              <motion.article
                key={matchResult.drink.id}
                className="recommendation-card"
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="recommendation-media"
                  style={{ backgroundColor: matchResult.mood.cardBg }}
                >
                  <img
                    src={matchResult.drink.image}
                    alt={matchResult.drink.name}
                    className="recommendation-img"
                  />
                  <span className="recommendation-mood-pill">
                    {matchResult.mood.emoji} Matched for {matchResult.mood.name}
                  </span>
                  <span className="recommendation-price-pill">
                    ₹{matchResult.drink.price}
                  </span>
                </div>

                <div className="recommendation-content">
                  <span className="recommendation-microcopy font-hand">
                    {matchResult.drink.microcopy}
                  </span>

                  <div className="recommendation-title-row">
                    <h2 className="recommendation-title font-editorial">
                      {matchResult.drink.name}
                    </h2>
                    <span className="recommendation-meta">
                      {matchResult.drink.volume} · ₹{matchResult.drink.price}
                    </span>
                  </div>

                  <p className="recommendation-desc">
                    {matchResult.drink.description}
                  </p>

                  <div className="recommendation-ingredients-block">
                    <span className="recommendation-ingredients-label">
                      Key Ingredients
                    </span>
                    <ul className="recommendation-ingredients-list">
                      {matchResult.drink.ingredients.map((ingredient) => (
                        <li
                          key={ingredient}
                          className="recommendation-ingredient-chip"
                        >
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="recommendation-actions">
                    <button
                      type="button"
                      className={`btn btn-primary ${
                        justAdded ? 'recommendation-cart-btn--added' : ''
                      }`}
                      onClick={() => handleAddToCart(matchResult.drink)}
                    >
                      {justAdded ? (
                        <>
                          <Check size={17} />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={17} />
                          <span>Add to Cart · ₹{matchResult.drink.price}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleTryAnother}
                    >
                      <RotateCcw size={16} />
                      <span>Try Another Mood</span>
                    </button>

                    {justAdded && (
                      <button
                        type="button"
                        className="btn btn-plum"
                        onClick={() => setIsOpen(true)}
                      >
                        View MoodBag
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
