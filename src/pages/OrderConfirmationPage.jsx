import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  Clock,
  Receipt,
  Sparkles,
  ArrowRight,
  Home,
  Info,
} from 'lucide-react';
import { LAST_ORDER_KEY } from './CheckoutPage';
import './OrderConfirmationPage.css';

function loadSavedOrder() {
  try {
    const raw = window.localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.orderId === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export default function OrderConfirmationPage() {
  const location = useLocation();

  const order = useMemo(() => {
    if (location.state?.order?.orderId) {
      return location.state.order;
    }
    return loadSavedOrder();
  }, [location.state]);

  if (!order) {
    return (
      <main className="confirm-page">
        <section className="container section-pad">
          <div className="confirm-fallback-card">
            <span className="section-eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              <span>MoodBrew Checkout</span>
            </span>
            <h1 className="font-editorial">No recent demo order found</h1>
            <p>
              Start by picking drinks in MoodMatch or browsing our Menu to try the
              multi-step MoodBrew demo checkout.
            </p>
            <div className="confirm-cta-row">
              <Link to="/menu" className="btn btn-primary">
                <span>Continue Shopping</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="btn btn-secondary">
                <Home size={16} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="confirm-page">
      <section className="container section-pad">
        {/* Visible Required Demo Banner */}
        <div className="confirm-demo-banner" role="note">
          <Info size={16} aria-hidden="true" />
          <span>Demo checkout only. No real payment is processed.</span>
        </div>

        <motion.div
          className="confirm-hero-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="confirm-check-badge"
            initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            aria-hidden="true"
          >
            <CheckCircle2 size={38} />
          </motion.div>

          <span className="confirm-hand font-hand">almost in your hands!</span>

          <h1 className="confirm-title font-editorial">
            Yay! Your mood is on its way!
          </h1>

          <p className="confirm-subtitle">
            Thanks, <strong>{order.delivery.fullName}</strong>! Your simulated MoodBrew
            order has been recorded in this browser session.
          </p>

          <div className="confirm-meta-pills">
            <span className="confirm-meta-pill">
              <Receipt size={15} aria-hidden="true" />
              <span>
                Demo Order ID: <strong>{order.orderId}</strong>
              </span>
            </span>
            <span className="confirm-meta-pill confirm-meta-pill--mint">
              <Clock size={15} aria-hidden="true" />
              <span>{order.estimatedDelivery}</span>
            </span>
          </div>

          <div className="confirm-details-grid">
            {/* Purchased Products */}
            <div className="confirm-detail-box">
              <h2 className="font-editorial">Purchased Products</h2>
              <ul className="confirm-items-list">
                {order.items.map((item) => (
                  <li key={item.id} className="confirm-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="confirm-item-img"
                    />
                    <div className="confirm-item-copy">
                      <strong>{item.name}</strong>
                      <span>
                        {item.mood} Mood · Qty {item.quantity} × ₹{item.price}
                      </span>
                    </div>
                    <strong className="confirm-item-total">
                      ₹{item.price * item.quantity}
                    </strong>
                  </li>
                ))}
              </ul>

              <div className="confirm-totals-box">
                <div className="confirm-total-line">
                  <span>Subtotal</span>
                  <span>₹{order.totals.subtotal}</span>
                </div>
                <div className="confirm-total-line">
                  <span>Chilled Delivery</span>
                  <span>
                    {order.totals.deliveryFee === 0
                      ? 'FREE'
                      : `₹${order.totals.deliveryFee}`}
                  </span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="confirm-total-line confirm-total-line--discount">
                    <span>Discount ({order.totals.discountLabel})</span>
                    <span>−₹{order.totals.discount}</span>
                  </div>
                )}
                <div className="confirm-total-final">
                  <span>Order Total (Demo)</span>
                  <strong>₹{order.totals.total}</strong>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Details */}
            <div className="confirm-side-boxes">
              <div className="confirm-detail-box">
                <div className="confirm-box-title">
                  <MapPin size={17} aria-hidden="true" />
                  <h2 className="font-editorial">Delivery Address</h2>
                </div>
                <p className="confirm-address-text">
                  <strong>{order.delivery.fullName}</strong>
                  <br />
                  {order.delivery.house}, {order.delivery.street}
                  <br />
                  {order.delivery.city}, {order.delivery.state} – {order.delivery.pinCode}
                  <br />
                  Mobile: +91 {order.delivery.mobile} · {order.delivery.email}
                </p>
                {order.delivery.instructions && (
                  <p className="confirm-instructions">
                    Note: &ldquo;{order.delivery.instructions}&rdquo;
                  </p>
                )}
              </div>

              <div className="confirm-detail-box">
                <div className="confirm-box-title">
                  <CreditCard size={17} aria-hidden="true" />
                  <h2 className="font-editorial">Payment Method</h2>
                </div>
                <p className="confirm-payment-label">{order.paymentMethodLabel}</p>
                <p className="confirm-payment-status">
                  Status: <strong>{order.paymentStatus || 'Simulated Payment Success'}</strong>
                </p>
                <p className="confirm-payment-note">
                  Demo Reference: <code>{order.transactionRef}</code> · Demo checkout
                  only. No real payment is processed.
                </p>
              </div>
            </div>
          </div>

          <div className="confirm-cta-row">
            <Link to="/menu" className="btn btn-primary">
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn btn-secondary">
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
