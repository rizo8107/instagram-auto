import Stripe from "stripe";

// Initialize Stripe with a default empty key if not provided
// This ensures the stripe object is always defined for TypeScript
const stripeKey = process.env.STRIPE_CLIENT_SECRET || 'dummy_key_for_build';
export const stripe = new Stripe(stripeKey, {
  apiVersion: '2024-12-18.acacia', // Using the latest Stripe API version
});

// Helper function to check if Stripe is properly configured
export const isStripeConfigured = (): boolean => {
  return !!process.env.STRIPE_CLIENT_SECRET;
};
