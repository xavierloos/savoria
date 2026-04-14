import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing. Please set the environment variable.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-03-25.dahlia', // Use the latest API version or the one you prefer
  appInfo: {
    name: 'Restaurant App',
    version: '0.1.0',
  },
});
