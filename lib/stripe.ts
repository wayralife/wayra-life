import Stripe from "stripe";

// Server-only Stripe client. Never import this file from a "use client" component.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});