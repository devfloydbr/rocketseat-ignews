import { loadStripe } from '@stripe/stripe-js'
export async function getStripeJs() {
  return await loadStripe(String(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY));
}

