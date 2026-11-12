import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

function EmptyBagIllustration() {
  return (
    <div className="cart-illustration" aria-hidden="true">
      <div className="cart-illustration-ring">
        <div className="cart-illustration-cup">
          <span className="cup-straw" />
          <span className="cup-lid" />
          <span className="cup-body">
            <Sparkles size={20} />
          </span>
        </div>
      </div>
      <span className="cart-illustration-bubble cart-illustration-bubble--one" />
      <span className="cart-illustration-bubble cart-illustration-bubble--two" />
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    count,
    subtotal,
  } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const [orderSummary, setOrderSummary] = useState({ count: 0, total: 0 });
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setCheckedOut(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, setIsOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setCheckedOut(false);
  };

  const handleContinueShopping = () => {
    setIsOpen(false);
    setCheckedOut(false);
    navigate('/menu');
  };

  const handleCheckout = () => {
    setOrderSummary({ count, total: subtotal });
    setCheckedOut(true);
    clearCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="cart-portal"
          role="dialog"
          aria-modal="true"
          aria-label="MoodBag shopping cart"
        >
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.aside
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cart-header">
              <div className="cart-title-row">
                <span className="cart-header-icon" aria-hidden="true">
                  <ShoppingBag size={18} />
                </span>
                <div>
                  <h2 className="font-editorial">MoodBag</h2>
                  <p className="cart-header-meta">
                    {count} {count === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                className="cart-close"
                onClick={handleClose}
                aria-label="Close MoodBag"
              >
                <X size={18} />
              </button>
            </div>

            <div className="cart-body">
              {checkedOut ? (
                <motion.div
                  className="cart-state-panel"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="cart-success-badge" aria-hidden="true">
                    <CheckCircle2 size={32} />
                  </span>
                  <span className="cart-state-hand font-hand">
                    simulated order placed!
                  </span>
                  <h3 className="font-editorial">Your MoodBag is chilling</h3>
                  <p>
                    Simulated demo checkout complete for {orderSummary.count}{' '}
                    {orderSummary.count === 1 ? 'drink' : 'drinks'} (₹
                    {orderSummary.total}). No payment was charged or collected.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleContinueShopping}
                  >
                    <span>Continue Shopping</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : items.length === 0 ? (
                <div className="cart-state-panel">
                  <EmptyBagIllustration />
                  <span className="cart-state-hand font-hand">
                    waiting for your first sip
                  </span>
                  <h3 className="font-editorial">Your MoodBag is empty</h3>
                  <p>
                    Explore our chilled beverages or try MoodMatch to add your
                    favourite pours to your bag.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleContinueShopping}
                  >
                    <span>Continue Shopping</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <ul className="cart-list">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        className="cart-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.24 }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-img"
                        />
                        <div className="cart-item-info">
                          <span className="cart-item-mood">{item.mood}</span>
                          <h4>{item.name}</h4>
                          <div className="cart-item-prices">
                            <span className="cart-item-unit">₹{item.price} each</span>
                            {item.quantity > 1 && (
                              <span className="cart-item-line-total">
                                · ₹{item.price * item.quantity}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="cart-item-actions">
                          <div className="cart-qty-stepper">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus size={13} />
                            </button>
                            <span
                              className="cart-qty-value"
                              aria-label={`Quantity of ${item.name}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && !checkedOut && (
              <div className="cart-footer">
                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span>Total items</span>
                    <strong>
                      {count} {count === 1 ? 'drink' : 'drinks'}
                    </strong>
                  </div>
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <strong>₹{subtotal}</strong>
                  </div>
                </div>

                <div className="cart-footer-actions">
                  <button
                    type="button"
                    className="btn btn-primary cart-checkout-btn"
                    onClick={handleCheckout}
                  >
                    <span>Checkout (Demo)</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary cart-continue-btn"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
