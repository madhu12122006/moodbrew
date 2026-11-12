import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ALL_DRINKS } from '../data/drinks';

const STORAGE_KEY = 'moodbrew_moodbag_v1';
const CartContext = createContext(null);

function loadPersistedCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Reconcile stored entries with canonical product catalog & prices
    return parsed
      .map((entry) => {
        if (!entry || typeof entry.id !== 'string') return null;
        const product = ALL_DRINKS.find((d) => d.id === entry.id);
        if (!product) return null;
        const qty = Number.isFinite(entry.quantity)
          ? Math.max(1, Math.floor(entry.quantity))
          : 1;
        return { ...product, quantity: qty };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadPersistedCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [items]);

  const addItem = (drink) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === drink.id);
      if (existing) {
        return prev.map((item) =>
          item.id === drink.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...drink, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const summary = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { count, subtotal };
  }, [items]);

  const value = {
    items,
    isOpen,
    setIsOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    count: summary.count,
    subtotal: summary.subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
