/**
 * MoodBrew Demo Checkout & Future Payment Gateway Adapter
 * ---------------------------------------------------------
 * Centralizes INR pricing rules, demo promo coupons, Indian state lists,
 * and a clean adapter interface ready for future server-backed payment
 * providers (e.g., Razorpay, Stripe) without keeping any secrets or live keys
 * in frontend code.
 */

export const DELIVERY_FEE = 49;
export const FREE_DELIVERY_THRESHOLD = 499;

export const DEMO_COUPONS = {
  MOOD10: {
    code: 'MOOD10',
    type: 'percent',
    value: 10,
    minSubtotal: 0,
    description: '10% off your beverage subtotal (Demo)',
  },
  SIP50: {
    code: 'SIP50',
    type: 'flat',
    value: 50,
    minSubtotal: 249,
    description: '₹50 off orders ₹249+ (Demo)',
  },
  FREEDROP: {
    code: 'FREEDROP',
    type: 'free_delivery',
    value: DELIVERY_FEE,
    minSubtotal: 0,
    description: 'Waives the ₹49 chilled delivery fee (Demo)',
  },
};

export const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', tag: 'Popular' },
  { id: 'phonepe', name: 'PhonePe', tag: 'Fast' },
  { id: 'paytm', name: 'Paytm', tag: 'UPI' },
  { id: 'other-upi', name: 'Other UPI', tag: 'Any App' },
];

export const PAYMENT_OPTIONS = [
  {
    id: 'upi',
    title: 'UPI (Demo)',
    subtitle: 'Google Pay, PhonePe, Paytm or other UPI apps',
    badge: 'Simulated',
    supported: true,
  },
  {
    id: 'card',
    title: 'Credit / Debit Card (Demo)',
    subtitle: 'Interactive preview — non-functional in demo mode',
    badge: 'Demo Only',
    supported: true,
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    subtitle: 'Pay on arrival — instant demo order confirmation',
    badge: 'Available',
    supported: true,
  },
  {
    id: 'future',
    title: 'Other Payment Methods',
    subtitle: 'NetBanking, Wallets & live gateway slot (Future Integration)',
    badge: 'Coming Soon',
    supported: false,
  },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

/**
 * Computes canonical INR order totals from cart items and an optional coupon.
 */
export function calculateOrderTotals(items, couponCode = '') {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (subtotal <= 0) {
    return {
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      discountLabel: '',
      total: 0,
      qualifiesFreeDelivery: false,
    };
  }

  const qualifiesFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  let deliveryFee = qualifiesFreeDelivery ? 0 : DELIVERY_FEE;
  let discount = 0;
  let discountLabel = '';

  const coupon = couponCode ? DEMO_COUPONS[couponCode.toUpperCase()] : null;
  if (coupon && subtotal >= coupon.minSubtotal) {
    if (coupon.type === 'percent') {
      discount = Math.round((subtotal * coupon.value) / 100);
      discountLabel = `${coupon.code} (${coupon.value}% off)`;
    } else if (coupon.type === 'flat') {
      discount = Math.min(coupon.value, subtotal);
      discountLabel = `${coupon.code} (₹${coupon.value} off)`;
    } else if (coupon.type === 'free_delivery') {
      if (deliveryFee > 0) {
        discount = deliveryFee;
        discountLabel = `${coupon.code} (Free Delivery)`;
      } else {
        discountLabel = `${coupon.code} (Free delivery already unlocked!)`;
      }
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  return {
    subtotal,
    deliveryFee,
    discount,
    discountLabel,
    total,
    qualifiesFreeDelivery,
  };
}

/**
 * Validates a user-entered demo promo code against current subtotal.
 */
export function validateCouponCode(rawCode, subtotal) {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return {
      valid: false,
      message: 'Please enter a demo promo code (try MOOD10, SIP50, or FREEDROP).',
    };
  }

  const coupon = DEMO_COUPONS[normalized];
  if (!coupon) {
    return {
      valid: false,
      message: `"${normalized}" is not recognised. Try MOOD10, SIP50, or FREEDROP.`,
    };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      message: `${coupon.code} requires a minimum subtotal of ₹${coupon.minSubtotal}.`,
    };
  }

  return {
    valid: true,
    coupon,
    message: `Applied ${coupon.code}: ${coupon.description}`,
  };
}

/**
 * Generates a unique client-side demo order reference.
 */
export function generateDemoOrderId() {
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  const timePart = Date.now().toString(36).slice(-4).toUpperCase();
  return `MB-DEMO-${timePart}${randomPart}`;
}

/**
 * Generates a unique client-side demo payment reference ID (non-transactional).
 */
export function generateDemoPaymentRef() {
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  const timePart = Date.now().toString(36).slice(-4).toUpperCase();
  return `DEMO-PAY-${timePart}${randomPart}`;
}

/**
 * Formats a clean human-readable payment method summary without sensitive data.
 */
export function formatPaymentSummary(method, { upiAppId, demoLast4 }) {
  if (method === 'upi') {
    const app = UPI_APPS.find((item) => item.id === upiAppId) || UPI_APPS[0];
    return `UPI · ${app.name} (Simulated Demo)`;
  }
  if (method === 'card') {
    const suffix = demoLast4 ? ` •••• ${demoLast4}` : ' •••• 4242';
    return `Demo Card${suffix} (Non-functional Demo)`;
  }
  if (method === 'cod') {
    return 'Cash on Delivery (Demo Simulation)';
  }
  return 'Demo Payment';
}

/**
 * Simulated checkout processor structured like an async payment gateway call.
 * Supports explicit 'success', 'failed', and 'cancelled' demo outcomes.
 * Future gateway integration: replace this mock with an API call to a
 * backend order endpoint, returning signed gateway session details.
 */
export function processDemoPayment({
  method,
  subMethod = '',
  amount,
  outcome = 'success',
  paymentRef = generateDemoPaymentRef(),
}) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (outcome === 'failed') {
        resolve({
          ok: false,
          status: 'failed_demo',
          provider: 'moodbrew-demo-simulator',
          transactionRef: paymentRef,
          errorMessage:
            'Simulated payment failed: No real transaction occurred and your MoodBag items have been preserved.',
        });
        return;
      }

      if (outcome === 'cancelled') {
        resolve({
          ok: false,
          status: 'cancelled_demo',
          provider: 'moodbrew-demo-simulator',
          transactionRef: paymentRef,
          errorMessage:
            'Simulated payment cancelled: Your MoodBag items are still saved so you can retry or pick another method.',
        });
        return;
      }

      resolve({
        ok: true,
        status: method === 'cod' ? 'Simulated COD Confirmed' : 'Simulated Payment Success',
        provider: 'moodbrew-demo-simulator',
        method,
        subMethod,
        amount,
        transactionRef: paymentRef,
      });
    }, 650);
  });
}
