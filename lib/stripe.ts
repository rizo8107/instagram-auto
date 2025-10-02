import Stripe from "stripe";

export const stripe = process.env.STRIPE_CLIENT_SECRET
  ? new Stripe(process.env.STRIPE_CLIENT_SECRET as string)
  : null;
