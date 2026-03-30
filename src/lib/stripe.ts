import Stripe from 'stripe';

function getStripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
  });
}

export const stripe = {
  get customers() { return getStripeClient().customers; },
  get checkout() { return getStripeClient().checkout; },
  get webhooks() { return getStripeClient().webhooks; },
};

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Limited AI suggestions (5/day)',
      'Basic task management',
      'Habit tracking (3 habits)',
      'Basic dashboard',
    ],
  },
  premium: {
    name: 'Premium',
    price: 15,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Unlimited AI assistant',
      'Financial insights & tracking',
      'Advanced analytics',
      'AI weekly planning',
      'Automatic scheduling',
      'Unlimited habits',
      'Priority support',
      'All future features',
    ],
  },
};
