import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Layers,
  Plus,
  Minus,
  Trash2,
  Tag,
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
  Loader2,
  ShieldAlert,
  QrCode,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  DEMO_COUPONS,
  FREE_DELIVERY_THRESHOLD,
  INDIAN_STATES,
  PAYMENT_OPTIONS,
  UPI_APPS,
  calculateOrderTotals,
  formatPaymentSummary,
  generateDemoOrderId,
  generateDemoPaymentRef,
  processDemoPayment,
  validateCouponCode,
} from '../services/paymentGateway';
import './CheckoutPage.css';

const CHECKOUT_DRAFT_KEY = 'moodbrew_checkout_draft_v1';
export const LAST_ORDER_KEY = 'moodbrew_last_demo_order_v1';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PIN_PATTERN = /^[1-9]\d{5}$/;

const STEPS = [
  { id: 1, label: 'Order Summary', note: 'Almost there, bestie!' },
  { id: 2, label: 'Delivery Details', note: 'One last step before your happy sip.' },
  { id: 3, label: 'Payment Method', note: 'Your order is brewing!' },
];

const INITIAL_DELIVERY = {
  fullName: '',
  mobile: '',
  email: '',
  house: '',
  street: '',
  city: '',
  state: 'Maharashtra',
  pinCode: '',
  instructions: '',
};

function normalizeIndianMobile(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

function validateDeliveryFields(fields) {
  const nextErrors = {};
  if (fields.fullName.trim().length < 2) {
    nextErrors.fullName = 'Please enter your full name (at least 2 characters).';
  }
  const cleanMobile = normalizeIndianMobile(fields.mobile);
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    nextErrors.mobile = 'Enter a valid 10-digit Indian mobile number (starts with 6–9).';
  }
  if (!EMAIL_PATTERN.test(fields.email.trim())) {
    nextErrors.email = 'Please enter a valid email address (e.g., sipper@example.com).';
  }
  if (!fields.house.trim()) {
    nextErrors.house = 'Please enter your house, flat, or hostel number.';
  }
  if (!fields.street.trim()) {
    nextErrors.street = 'Please enter your street, building, or neighbourhood.';
  }
  if (!fields.city.trim()) {
    nextErrors.city = 'Please enter your city.';
  }
  if (!fields.state.trim()) {
    nextErrors.state = 'Please select your state or UT.';
  }
  if (!PIN_PATTERN.test(fields.pinCode.trim())) {
    nextErrors.pinCode = 'Enter a valid 6-digit Indian PIN code (e.g., 400001).';
  }
  return nextErrors;
}

function loadSafeDraft() {
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      delivery: { ...INITIAL_DELIVERY, ...(parsed.delivery || {}) },
      appliedCoupon:
        typeof parsed.appliedCoupon === 'string' ? parsed.appliedCoupon : '',
    };
  } catch {
    return null;
  }
}

function maskDemoDigits(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  const tail = digits.slice(-4);
  const maskedGroups = '•••• '.repeat(Math.ceil((digits.length - 4) / 4)).trim();
  return `${maskedGroups} ${tail}`.trim();
}

export default function CheckoutPage() {
  const { items, count, updateQuantity, removeItem, clearCart, setIsOpen } =
    useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const savedDraft = useMemo(loadSafeDraft, []);
  const [delivery, setDelivery] = useState(
    () => savedDraft?.delivery || INITIAL_DELIVERY
  );
  const [appliedCoupon, setAppliedCoupon] = useState(
    () => savedDraft?.appliedCoupon || ''
  );
  const [couponInput, setCouponInput] = useState(
    () => savedDraft?.appliedCoupon || ''
  );
  const [couponFeedback, setCouponFeedback] = useState({ type: 'idle', message: '' });

  const requestedStep = Number(searchParams.get('step'));
  const [step, setStep] = useState(() =>
    requestedStep >= 1 && requestedStep <= 3 ? requestedStep : 1
  );

  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [deliveryErrorBanner, setDeliveryErrorBanner] = useState('');

  // Ephemeral demo payment UI state (never stored in localStorage/sessionStorage)
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiAppId, setUpiAppId] = useState('gpay');
  const [demoUpiId, setDemoUpiId] = useState('sipper@okdemo');
  const [upiError, setUpiError] = useState('');

  const [demoCardHolder, setDemoCardHolder] = useState('');
  const [demoCardRawDigits, setDemoCardRawDigits] = useState('');
  const [cardDemoError, setCardDemoError] = useState('');

  // Simulated processing stage: 'select' | 'processing' | 'controls' | 'failed' | 'cancelled'
  const [paymentStage, setPaymentStage] = useState('select');
  const [activePaymentRef, setActivePaymentRef] = useState('');
  const [outcomeMessage, setOutcomeMessage] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);

  const pageTopRef = useRef(null);
  const delayTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  const submissionLockRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (delayTimerRef.current) {
        window.clearTimeout(delayTimerRef.current);
      }
    };
  }, []);

  // Persist non-sensitive delivery & promo draft cleanly in sessionStorage
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        CHECKOUT_DRAFT_KEY,
        JSON.stringify({ delivery, appliedCoupon })
      );
    } catch {
      // Ignore storage failures
    }
  }, [delivery, appliedCoupon]);

  const totals = useMemo(
    () => calculateOrderTotals(items, appliedCoupon),
    [items, appliedCoupon]
  );

  // Guard invalid direct URL jumps (?step=2 or ?step=3) on refresh/navigation
  useEffect(() => {
    if (items.length === 0) return;

    const urlStep = Number(searchParams.get('step'));
    if (!urlStep) return;

    if (urlStep === 3) {
      const errs = validateDeliveryFields(delivery);
      if (Object.keys(errs).length > 0) {
        setStep(2);
        setSearchParams({ step: '2' }, { replace: true });
        return;
      }
    }

    if (urlStep >= 1 && urlStep <= 3 && urlStep !== step) {
      setStep(urlStep);
    }
  }, [searchParams, items.length, delivery, step, setSearchParams]);

  // Clear applied coupon automatically if cart drop makes it ineligible (e.g., SIP50 < ₹249)
  useEffect(() => {
    if (!appliedCoupon) return;
    const rule = DEMO_COUPONS[appliedCoupon];
    if (rule && totals.subtotal < rule.minSubtotal) {
      setAppliedCoupon('');
      setCouponFeedback({
        type: 'error',
        message: `${rule.code} removed because your subtotal dropped below ₹${rule.minSubtotal}.`,
      });
    }
  }, [appliedCoupon, totals.subtotal]);

  const goToStep = (nextStep) => {
    setStep(nextStep);
    if (nextStep !== 3) {
      setPaymentStage('select');
      setOutcomeMessage('');
    }
    setSearchParams({ step: String(nextStep) });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pageTopRef.current?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleApplyCoupon = (codeOverride) => {
    const targetCode =
      typeof codeOverride === 'string' ? codeOverride : couponInput;
    const result = validateCouponCode(targetCode, totals.subtotal);
    if (!result.valid) {
      setCouponFeedback({ type: 'error', message: result.message });
      return;
    }
    setAppliedCoupon(result.coupon.code);
    setCouponInput(result.coupon.code);
    setCouponFeedback({ type: 'success', message: result.message });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponInput('');
    setCouponFeedback({ type: 'idle', message: '' });
  };

  const handleDeliveryChange = (field) => (event) => {
    const value = event.target.value;
    setDelivery((prev) => ({ ...prev, [field]: value }));
    if (deliveryErrors[field]) {
      setDeliveryErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (deliveryErrorBanner) setDeliveryErrorBanner('');
  };

  const handleDeliveryContinue = (event) => {
    event.preventDefault();
    const errs = validateDeliveryFields(delivery);
    if (Object.keys(errs).length > 0) {
      setDeliveryErrors(errs);
      setDeliveryErrorBanner(
        'Please fix the highlighted delivery details before continuing to payment.'
      );
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`checkout-${firstKey}`)?.focus();
      return;
    }
    setDeliveryErrors({});
    setDeliveryErrorBanner('');
    goToStep(3);
  };

  const handleFillSampleCard = () => {
    setDemoCardHolder(delivery.fullName.trim() || 'Mood Sipper');
    setDemoCardRawDigits('4242424242424242');
    setCardDemoError('');
  };

  const handleStartSimulatedPayment = () => {
    setUpiError('');
    setCardDemoError('');
    setOutcomeMessage('');

    const deliveryCheck = validateDeliveryFields(delivery);
    if (Object.keys(deliveryCheck).length > 0) {
      setDeliveryErrors(deliveryCheck);
      setDeliveryErrorBanner('Please complete your delivery address first.');
      goToStep(2);
      return;
    }

    if (paymentMethod === 'future') {
      setOutcomeMessage(
        'Other Payment Methods are reserved for future integration. Choose UPI, Demo Card, or Cash on Delivery.'
      );
      return;
    }

    if (paymentMethod === 'upi') {
      const cleanedUpi = demoUpiId.trim();
      if (!cleanedUpi || !cleanedUpi.includes('@')) {
        setUpiError(
          'Enter a valid demo UPI ID format (e.g., sipper@okdemo). Never enter a UPI PIN.'
        );
        return;
      }
    }

    if (paymentMethod === 'card') {
      if (!demoCardHolder.trim() || demoCardRawDigits.length < 12) {
        setCardDemoError(
          'Enter a cardholder name and sample demo digits (or click "Fill Sample Demo Card"). Do not enter real card credentials.'
        );
        return;
      }
    }

    const refId = generateDemoPaymentRef();
    setActivePaymentRef(refId);
    setPaymentStage('processing');

    if (delayTimerRef.current) window.clearTimeout(delayTimerRef.current);
    delayTimerRef.current = window.setTimeout(() => {
      if (!isMountedRef.current) return;
      setPaymentStage('controls');
    }, 750);
  };

  const handleTriggerOutcome = async (outcome) => {
    if (submissionLockRef.current || isFinalizing) return;

    submissionLockRef.current = true;
    setIsFinalizing(true);

    const paymentResult = await processDemoPayment({
      method: paymentMethod,
      subMethod: paymentMethod === 'upi' ? upiAppId : '',
      amount: totals.total,
      outcome,
      paymentRef: activePaymentRef || generateDemoPaymentRef(),
    });

    if (!isMountedRef.current) return;

    if (!paymentResult.ok) {
      submissionLockRef.current = false;
      setIsFinalizing(false);
      setOutcomeMessage(paymentResult.errorMessage);
      setPaymentStage(outcome === 'cancelled' ? 'cancelled' : 'failed');
      return;
    }

    const demoLast4 =
      paymentMethod === 'card' && demoCardRawDigits.length >= 4
        ? demoCardRawDigits.slice(-4)
        : '';

    // Persist strictly non-sensitive demo order snapshot in localStorage
    const orderSnapshot = {
      orderId: generateDemoOrderId(),
      transactionRef: paymentResult.transactionRef,
      paymentStatus: paymentResult.status,
      createdAt: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        mood: item.mood,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totals: { ...totals },
      delivery: {
        fullName: delivery.fullName.trim(),
        mobile: normalizeIndianMobile(delivery.mobile),
        email: delivery.email.trim(),
        house: delivery.house.trim(),
        street: delivery.street.trim(),
        city: delivery.city.trim(),
        state: delivery.state.trim(),
        pinCode: delivery.pinCode.trim(),
        instructions: delivery.instructions.trim(),
      },
      paymentMethodLabel: formatPaymentSummary(paymentMethod, {
        upiAppId,
        demoLast4,
      }),
      estimatedDelivery: '25–35 mins (Illustrative demo estimate)',
    };

    try {
      window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(orderSnapshot));
      window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    } catch {
      // Ignore storage limits
    }

    // Reset ephemeral demo inputs and clear cart ONLY after successful simulated order
    setDemoCardHolder('');
    setDemoCardRawDigits('');
    setDemoUpiId('sipper@okdemo');
    clearCart();
    navigate('/order-confirmation', { state: { order: orderSnapshot } });
  };

  const handleReturnToCart = () => {
    setIsOpen(true);
  };

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <section className="container section-pad">
          <div className="checkout-empty-card">
            <span className="checkout-empty-icon" aria-hidden="true">
              <ShoppingBag size={28} />
            </span>
            <span className="font-hand checkout-empty-hand">
              nothing chilling in your bag yet
            </span>
            <h1 className="font-editorial">Your MoodBag is empty</h1>
            <p>
              Add a signature MoodBrew drink from our Menu or try MoodMatch before
              heading to checkout.
            </p>
            <div className="checkout-empty-actions">
              <Link to="/menu" className="btn btn-primary">
                <span>Browse Menu</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/discover" className="btn btn-secondary">
                Try MoodMatch
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const currentStepMeta = STEPS.find((s) => s.id === step) || STEPS[0];
  const amountRemainingForFree = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - totals.subtotal
  );
  const maskedCardDisplay = maskDemoDigits(demoCardRawDigits);

  return (
    <main className="checkout-page" ref={pageTopRef}>
      <section className="container section-pad">
        {/* Visible Required Demo Notice */}
        <div className="checkout-demo-banner" role="note">
          <Lock size={15} aria-hidden="true" />
          <span>Demo checkout only. No real payment is processed.</span>
        </div>

        {/* Header + Multi-Step Progress Indicator */}
        <div className="checkout-header">
          <div>
            <div className="checkout-eyebrow-row">
              <span className="section-eyebrow checkout-eyebrow">
                <Sparkles size={14} aria-hidden="true" />
                <span>MoodBag Checkout</span>
              </span>
              <span className="checkout-hand font-hand">{currentStepMeta.note}</span>
            </div>
            <h1 className="checkout-title font-editorial">Complete your sip order</h1>
          </div>

          <ol className="checkout-stepper" aria-label="Checkout steps">
            {STEPS.map((item) => {
              const isActive = step === item.id;
              const isCompleted = step > item.id;
              const canJumpBack = item.id < step && paymentStage !== 'processing' && !isFinalizing;

              return (
                <li
                  key={item.id}
                  className={`stepper-item ${
                    isActive ? 'stepper-item--active' : ''
                  } ${isCompleted ? 'stepper-item--done' : ''}`}
                >
                  <button
                    type="button"
                    disabled={!canJumpBack}
                    onClick={() => canJumpBack && goToStep(item.id)}
                    className="stepper-btn"
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="stepper-num">
                      {isCompleted ? <Check size={14} /> : item.id}
                    </span>
                    <span className="stepper-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="checkout-layout">
          {/* Primary Step Column */}
          <div className="checkout-main-col">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.section
                  key="step-1"
                  className="checkout-card"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  aria-labelledby="step1-heading"
                >
                  <div className="checkout-card-head">
                    <div>
                      <span className="step-kicker">Step 1 of 3</span>
                      <h2 id="step1-heading" className="font-editorial">
                        Review your MoodBag
                      </h2>
                    </div>
                    <span className="checkout-count-pill">
                      {count} {count === 1 ? 'drink' : 'drinks'}
                    </span>
                  </div>

                  {amountRemainingForFree > 0 ? (
                    <div className="free-delivery-nudge">
                      Add <strong>₹{amountRemainingForFree}</strong> more for free
                      chilled delivery (orders ₹{FREE_DELIVERY_THRESHOLD}+) or try demo
                      code <strong>FREEDROP</strong>.
                    </div>
                  ) : (
                    <div className="free-delivery-nudge free-delivery-nudge--unlocked">
                      <Check size={15} aria-hidden="true" />
                      <span>
                        Free chilled delivery unlocked! Orders ₹{FREE_DELIVERY_THRESHOLD}+
                        ship at ₹0.
                      </span>
                    </div>
                  )}

                  <ul className="checkout-items-list">
                    {items.map((item) => (
                      <li key={item.id} className="checkout-item-row">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="checkout-item-img"
                        />
                        <div className="checkout-item-info">
                          <span className="checkout-item-mood">{item.mood} Mood</span>
                          <h3>{item.name}</h3>
                          <p className="checkout-item-unit">
                            {item.volume} · ₹{item.price} each
                          </p>
                        </div>

                        <div className="checkout-item-controls">
                          <div className="cart-qty-stepper">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="cart-qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <strong className="checkout-line-price">
                            ₹{item.price * item.quantity}
                          </strong>

                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Demo Promo Code */}
                  <div className="promo-box">
                    <div className="promo-label-row">
                      <label htmlFor="demo-promo-input" className="promo-label">
                        <Tag size={14} aria-hidden="true" />
                        <span>Promo Code (Demo Coupons)</span>
                      </label>
                      <div className="promo-sample-chips">
                        {Object.keys(DEMO_COUPONS).map((code) => (
                          <button
                            key={code}
                            type="button"
                            className={`promo-chip ${
                              appliedCoupon === code ? 'promo-chip--active' : ''
                            }`}
                            onClick={() => handleApplyCoupon(code)}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="promo-input-row">
                      <input
                        id="demo-promo-input"
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponFeedback.type === 'error') {
                            setCouponFeedback({ type: 'idle', message: '' });
                          }
                        }}
                        placeholder="Enter MOOD10, SIP50, or FREEDROP"
                        className="promo-input"
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          className="btn btn-secondary promo-action-btn"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-plum promo-action-btn"
                          onClick={() => handleApplyCoupon()}
                        >
                          Apply
                        </button>
                      )}
                    </div>

                    {couponFeedback.type !== 'idle' && (
                      <p
                        role="status"
                        className={`promo-feedback promo-feedback--${couponFeedback.type}`}
                      >
                        {couponFeedback.message}
                      </p>
                    )}
                  </div>

                  <div className="checkout-step-actions">
                    <Link to="/menu" className="btn btn-secondary">
                      <ArrowLeft size={16} />
                      <span>Add More Drinks</span>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => goToStep(2)}
                    >
                      <span>Continue to Delivery</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.section>
              )}

              {step === 2 && (
                <motion.section
                  key="step-2"
                  className="checkout-card"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  aria-labelledby="step2-heading"
                >
                  <div className="checkout-card-head">
                    <div>
                      <span className="step-kicker">Step 2 of 3</span>
                      <h2 id="step2-heading" className="font-editorial">
                        Indian Delivery Details
                      </h2>
                    </div>
                    <span className="checkout-icon-badge" aria-hidden="true">
                      <MapPin size={18} />
                    </span>
                  </div>

                  {deliveryErrorBanner && (
                    <div className="checkout-error-banner" role="alert">
                      <AlertCircle size={17} aria-hidden="true" />
                      <span>{deliveryErrorBanner}</span>
                    </div>
                  )}

                  <form
                    className="checkout-form"
                    onSubmit={handleDeliveryContinue}
                    noValidate
                  >
                    <div className="checkout-form-row checkout-form-row--2">
                      <div className="form-field">
                        <label htmlFor="checkout-fullName">
                          Full Name <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="checkout-fullName"
                          type="text"
                          value={delivery.fullName}
                          onChange={handleDeliveryChange('fullName')}
                          placeholder="e.g., Aarav Sharma"
                          aria-invalid={Boolean(deliveryErrors.fullName)}
                          className={deliveryErrors.fullName ? 'input-invalid' : ''}
                        />
                        {deliveryErrors.fullName && (
                          <span className="field-error">{deliveryErrors.fullName}</span>
                        )}
                      </div>

                      <div className="form-field">
                        <label htmlFor="checkout-mobile">
                          Phone Number (India) <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="checkout-mobile"
                          type="tel"
                          inputMode="numeric"
                          value={delivery.mobile}
                          onChange={handleDeliveryChange('mobile')}
                          placeholder="10-digit number (e.g., 98XXXXXXXX)"
                          aria-invalid={Boolean(deliveryErrors.mobile)}
                          className={deliveryErrors.mobile ? 'input-invalid' : ''}
                        />
                        {deliveryErrors.mobile && (
                          <span className="field-error">{deliveryErrors.mobile}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="checkout-email">
                        Email Address <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        value={delivery.email}
                        onChange={handleDeliveryChange('email')}
                        placeholder="you@example.com"
                        aria-invalid={Boolean(deliveryErrors.email)}
                        className={deliveryErrors.email ? 'input-invalid' : ''}
                      />
                      {deliveryErrors.email && (
                        <span className="field-error">{deliveryErrors.email}</span>
                      )}
                    </div>

                    <div className="checkout-form-row checkout-form-row--2">
                      <div className="form-field">
                        <label htmlFor="checkout-house">
                          House / Flat / Hostel No. <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="checkout-house"
                          type="text"
                          value={delivery.house}
                          onChange={handleDeliveryChange('house')}
                          placeholder="e.g., Flat 402, Breeze Heights"
                          aria-invalid={Boolean(deliveryErrors.house)}
                          className={deliveryErrors.house ? 'input-invalid' : ''}
                        />
                        {deliveryErrors.house && (
                          <span className="field-error">{deliveryErrors.house}</span>
                        )}
                      </div>

                      <div className="form-field">
                        <label htmlFor="checkout-street">
                          Street & Area <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="checkout-street"
                          type="text"
                          value={delivery.street}
                          onChange={handleDeliveryChange('street')}
                          placeholder="e.g., Carter Road, Bandra West"
                          aria-invalid={Boolean(deliveryErrors.street)}
                          className={deliveryErrors.street ? 'input-invalid' : ''}
                        />
                        {deliveryErrors.street && (
                          <span className="field-error">{deliveryErrors.street}</span>
                        )}
                      </div>
                    </div>

                    <div className="checkout-form-row checkout-form-row--3">
                      <div className="form-field">
                        <label htmlFor="checkout-city">
                          City <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="checkout-city"
                          type="text"
                          value={delivery.city}
                          onChange={handleDeliveryChange('city')}
                          placeholder="e.g., Mumbai"
                          aria-invalid={Boolean(deliveryErrors.city)}
                          className={deliveryErrors.city ? 'input-invalid' : ''}
                        />
                        {deliveryErrors.city && (
                          <span className="field-error">{deliveryErrors.city}</span>
                        )}
                      </div>

                      <div className="form-field">
                        <label htmlFor="checkout-state">
                          State / UT <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="checkout-state"
                          value={delivery.state}
                          onChange={handleDeliveryChange('state')}
                          aria-invalid={Boolean(deliveryErrors.state)}
                          className={deliveryErrors.state ? 'input-invalid' : ''}
                        >
                          <option value="">Select state</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {deliveryErrors.state && (
                          <span className="field-error">{deliveryErrors.state}</span>
                        )}
                      </div>

                      <div className="form-field">
                        <label htmlFor="checkout-pinCode">
                          PIN Code <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="checkout-pinCode"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={delivery.pinCode}
                          onChange={handleDeliveryChange('pinCode')}
                          placeholder="e.g., 400050"
                          aria-invalid={Boolean(deliveryErrors.pinCode)}
                          className={deliveryErrors.pinCode ? 'input-invalid' : ''}
                        />
                        {deliveryErrors.pinCode && (
                          <span className="field-error">{deliveryErrors.pinCode}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="checkout-instructions">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        id="checkout-instructions"
                        rows={2}
                        value={delivery.instructions}
                        onChange={handleDeliveryChange('instructions')}
                        placeholder="e.g., Leave chilled bag with hostel guard / ring bell once"
                      />
                    </div>

                    <div className="checkout-step-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => goToStep(1)}
                      >
                        <ArrowLeft size={16} />
                        <span>Back to Summary</span>
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <span>Continue to Payment</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </form>
                </motion.section>
              )}

              {step === 3 && (
                <motion.section
                  key="step-3"
                  className="checkout-card"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  aria-labelledby="step3-heading"
                >
                  <div className="checkout-card-head">
                    <div>
                      <span className="step-kicker">Step 3 of 3</span>
                      <h2 id="step3-heading" className="font-editorial">
                        Simulated Payment & Checkout
                      </h2>
                    </div>
                    <span className="checkout-icon-badge" aria-hidden="true">
                      <CreditCard size={18} />
                    </span>
                  </div>

                  {paymentStage === 'select' && (
                    <>
                      {/* Method Selector Cards */}
                      <div
                        className="payment-methods-grid"
                        role="radiogroup"
                        aria-label="Payment method options"
                      >
                        {PAYMENT_OPTIONS.map((option) => {
                          const isSelected = paymentMethod === option.id;
                          const Icon =
                            option.id === 'upi'
                              ? Smartphone
                              : option.id === 'card'
                                ? CreditCard
                                : option.id === 'cod'
                                  ? Banknote
                                  : Layers;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => {
                                setPaymentMethod(option.id);
                                setOutcomeMessage('');
                                setUpiError('');
                                setCardDemoError('');
                              }}
                              className={`payment-option-card ${
                                isSelected ? 'payment-option-card--active' : ''
                              } ${
                                !option.supported ? 'payment-option-card--placeholder' : ''
                              }`}
                            >
                              <div className="payment-option-top">
                                <span className="payment-option-icon" aria-hidden="true">
                                  <Icon size={18} />
                                </span>
                                <span className="payment-option-badge">
                                  {option.badge}
                                </span>
                              </div>
                              <strong>{option.title}</strong>
                              <p>{option.subtitle}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Method Details Panel */}
                      <div className="payment-detail-panel">
                        {paymentMethod === 'upi' && (
                          <div className="upi-panel">
                            <div className="upi-header">
                              <h3>Simulated UPI Payment (Demo Only)</h3>
                              <span className="demo-pill">Never asks for UPI PIN</span>
                            </div>

                            <div className="upi-apps-row">
                              {UPI_APPS.map((app) => (
                                <button
                                  key={app.id}
                                  type="button"
                                  onClick={() => setUpiAppId(app.id)}
                                  className={`upi-app-pill ${
                                    upiAppId === app.id ? 'upi-app-pill--active' : ''
                                  }`}
                                >
                                  <span>{app.name}</span>
                                  <small>{app.tag}</small>
                                </button>
                              ))}
                            </div>

                            <div className="upi-grid">
                              <div className="upi-qr-card">
                                <div className="upi-qr-box" aria-hidden="true">
                                  <QrCode size={58} strokeWidth={1.6} />
                                </div>
                                <span className="upi-qr-caption">
                                  Simulated QR Placeholder
                                </span>
                                <small>Illustrative preview · ₹{totals.total}</small>
                              </div>

                              <div className="upi-id-panel">
                                <div className="form-field">
                                  <label htmlFor="demo-upi-id">
                                    Demo UPI ID (Simulation Only)
                                  </label>
                                  <input
                                    id="demo-upi-id"
                                    type="text"
                                    autoComplete="off"
                                    value={demoUpiId}
                                    onChange={(e) => {
                                      setDemoUpiId(e.target.value);
                                      if (upiError) setUpiError('');
                                    }}
                                    placeholder="e.g., sipper@okdemo"
                                    className={upiError ? 'input-invalid' : ''}
                                  />
                                  {upiError && (
                                    <span className="field-error">{upiError}</span>
                                  )}
                                </div>
                                <p className="upi-sim-note">
                                  Demo simulation for{' '}
                                  <strong>
                                    {UPI_APPS.find((a) => a.id === upiAppId)?.name}
                                  </strong>
                                  . We never request your UPI PIN or initiate any live
                                  collect request.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'card' && (
                          <div className="card-panel">
                            <div className="card-demo-warning" role="note">
                              <ShieldAlert size={16} aria-hidden="true" />
                              <span>
                                <strong>Demo-only card preview:</strong> Never enter real
                                card numbers, CVVs, or bank credentials. Inputs are masked
                                and kept strictly in memory.
                              </span>
                            </div>

                            <div className="card-split-layout">
                              {/* Visual Card Preview */}
                              <div className="card-visual-preview" aria-hidden="true">
                                <div className="card-visual-top">
                                  <span className="font-editorial card-visual-brand">
                                    MoodBrew Demo
                                  </span>
                                  <span className="card-visual-chip">DEMO CARD</span>
                                </div>
                                <div className="card-visual-number">
                                  {maskedCardDisplay || '•••• •••• •••• 4242'}
                                </div>
                                <div className="card-visual-bottom">
                                  <div>
                                    <small>CARDHOLDER (DEMO)</small>
                                    <span>
                                      {(demoCardHolder || 'MOOD SIPPER').toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <small>MODE</small>
                                    <span>SIMULATED</span>
                                  </div>
                                </div>
                              </div>

                              {/* Masked Demo Card Inputs (No CVV / real credentials) */}
                              <div className="card-demo-fields">
                                <div className="card-fields-header">
                                  <h3>Demo-Only Card Inputs</h3>
                                  <button
                                    type="button"
                                    className="sample-fill-btn"
                                    onClick={handleFillSampleCard}
                                  >
                                    Fill Sample Demo Card
                                  </button>
                                </div>

                                <div className="form-field">
                                  <label htmlFor="demo-card-holder">
                                    Cardholder Name (Demo)
                                  </label>
                                  <input
                                    id="demo-card-holder"
                                    type="text"
                                    autoComplete="off"
                                    value={demoCardHolder}
                                    onChange={(e) => {
                                      setDemoCardHolder(e.target.value);
                                      if (cardDemoError) setCardDemoError('');
                                    }}
                                    placeholder="e.g., Mood Sipper"
                                  />
                                </div>

                                <div className="form-field">
                                  <label htmlFor="demo-card-number">
                                    Masked Demo Card Number (Non-functional)
                                  </label>
                                  <input
                                    id="demo-card-number"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={maskedCardDisplay}
                                    onChange={(e) => {
                                      const digits = e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 16);
                                      setDemoCardRawDigits(digits);
                                      if (cardDemoError) setCardDemoError('');
                                    }}
                                    placeholder="Type digits (masked) or click Fill Sample"
                                  />
                                </div>

                                {cardDemoError && (
                                  <span className="field-error">{cardDemoError}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'cod' && (
                          <div className="cod-panel">
                            <h3>Cash on Delivery (Demo Confirmation Simulation)</h3>
                            <p>
                              Selected COD for <strong>₹{totals.total}</strong>. Continue
                              to the simulated confirmation step where you can confirm or
                              test cancellation without creating a real shipment.
                            </p>
                          </div>
                        )}

                        {paymentMethod === 'future' && (
                          <div className="future-panel">
                            <h3>Future Payment Gateway Placeholder</h3>
                            <p>
                              Structured in <code>src/services/paymentGateway.js</code>{' '}
                              for future integration. No real payment provider is
                              connected in this demo.
                            </p>
                          </div>
                        )}
                      </div>

                      {outcomeMessage && (
                        <div className="checkout-error-banner" role="alert">
                          <AlertCircle size={17} aria-hidden="true" />
                          <span>{outcomeMessage}</span>
                        </div>
                      )}

                      <div className="checkout-step-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => goToStep(2)}
                        >
                          <ArrowLeft size={16} />
                          <span>Edit Delivery</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleStartSimulatedPayment}
                          disabled={paymentMethod === 'future'}
                        >
                          <span>
                            {paymentMethod === 'cod'
                              ? `Place Order · ₹${totals.total} (Demo)`
                              : `Continue to Payment · ₹${totals.total}`}
                          </span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </>
                  )}

                  {paymentStage === 'processing' && (
                    <motion.div
                      className="sim-stage-panel"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="sim-spinner-badge" aria-hidden="true">
                        <Loader2 size={34} className="spin-icon" />
                      </div>
                      <span className="font-hand sim-hand">
                        your order is brewing!
                      </span>
                      <h3 className="font-editorial">
                        Simulating payment request...
                      </h3>
                      <p>
                        Preparing controlled demo verification for{' '}
                        <strong>₹{totals.total}</strong>. Reference ID:{' '}
                        <code>{activePaymentRef}</code>
                      </p>
                    </motion.div>
                  )}

                  {paymentStage === 'controls' && (
                    <motion.div
                      className="sim-controls-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="sim-controls-badge" role="note">
                        <Sparkles size={15} aria-hidden="true" />
                        <span>
                          Demo / Testing Controls — Choose an outcome (Not a real
                          transaction)
                        </span>
                      </div>

                      <div className="sim-ref-row">
                        <div>
                          <span className="sim-ref-label">Demo Payment Reference</span>
                          <strong className="sim-ref-id">{activePaymentRef}</strong>
                        </div>
                        <div className="sim-ref-amount">
                          <span className="sim-ref-label">Amount</span>
                          <strong>₹{totals.total}</strong>
                        </div>
                      </div>

                      <p className="sim-controls-desc">
                        Demo checkout only. No real payment is processed. Select any
                        testing outcome below to preview how MoodBrew handles success,
                        failure, or cancellation:
                      </p>

                      <div className="sim-action-stack">
                        <button
                          type="button"
                          className="btn sim-btn sim-btn--success"
                          disabled={isFinalizing}
                          onClick={() => handleTriggerOutcome('success')}
                        >
                          {isFinalizing ? (
                            <Loader2 size={17} className="spin-icon" aria-hidden="true" />
                          ) : (
                            <Check size={17} aria-hidden="true" />
                          )}
                          <span>Simulate Successful Payment</span>
                        </button>

                        <button
                          type="button"
                          className="btn sim-btn sim-btn--fail"
                          disabled={isFinalizing}
                          onClick={() => handleTriggerOutcome('failed')}
                        >
                          <AlertCircle size={17} aria-hidden="true" />
                          <span>Simulate Failed Payment</span>
                        </button>

                        <button
                          type="button"
                          className="btn sim-btn sim-btn--cancel"
                          disabled={isFinalizing}
                          onClick={() => handleTriggerOutcome('cancelled')}
                        >
                          <XCircle size={17} aria-hidden="true" />
                          <span>Cancel Payment</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {(paymentStage === 'failed' || paymentStage === 'cancelled') && (
                    <motion.div
                      className="sim-result-panel"
                      role="alert"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span
                        className={`sim-result-icon ${
                          paymentStage === 'failed'
                            ? 'sim-result-icon--fail'
                            : 'sim-result-icon--cancel'
                        }`}
                        aria-hidden="true"
                      >
                        {paymentStage === 'failed' ? (
                          <AlertCircle size={30} />
                        ) : (
                          <XCircle size={30} />
                        )}
                      </span>

                      <h3 className="font-editorial">
                        {paymentStage === 'failed'
                          ? 'Simulated Payment Failed'
                          : 'Simulated Payment Cancelled'}
                      </h3>

                      <p className="sim-result-copy">{outcomeMessage}</p>

                      <p className="sim-result-ref">
                        Demo Reference: <code>{activePaymentRef}</code> · Your{' '}
                        <strong>
                          {count} {count === 1 ? 'drink' : 'drinks'}
                        </strong>{' '}
                        remain safely saved in MoodBag.
                      </p>

                      <div className="sim-result-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleStartSimulatedPayment}
                        >
                          <RotateCcw size={16} />
                          <span>Retry Payment</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setPaymentStage('select');
                            setOutcomeMessage('');
                          }}
                        >
                          Change Method
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleReturnToCart}
                        >
                          Return to Cart
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Order Totals Sidebar */}
          <aside className="checkout-summary-aside" aria-label="Price summary">
            <div className="summary-glass-card">
              <h2 className="font-editorial summary-title">Order Summary</h2>
              <p className="summary-subtitle">
                {count} {count === 1 ? 'chilled drink' : 'chilled drinks'} in your bag
              </p>

              <div className="summary-mini-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-mini-row">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal}</span>
                </div>
                <div className="summary-line">
                  <span>Chilled Delivery</span>
                  <span>
                    {totals.deliveryFee === 0 ? (
                      <strong className="free-tag">FREE</strong>
                    ) : (
                      `₹${totals.deliveryFee}`
                    )}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="summary-line summary-line--discount">
                    <span>Discount ({totals.discountLabel})</span>
                    <span>−₹{totals.discount}</span>
                  </div>
                )}
                <div className="summary-total-row">
                  <span>Final Total</span>
                  <strong>₹{totals.total}</strong>
                </div>
              </div>

              {delivery.city && step === 3 && (
                <div className="summary-address-preview">
                  <span className="summary-address-label">Delivering to (Demo)</span>
                  <p>
                    <strong>{delivery.fullName}</strong> · {delivery.house},{' '}
                    {delivery.street}, {delivery.city}, {delivery.state} –{' '}
                    {delivery.pinCode}
                  </p>
                </div>
              )}

              <p className="summary-disclaimer">
                Demo checkout only. No real payment is processed.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
