import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  const stripeJs = await loadStripe(
    String(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY)
  );

  return stripeJs;
}
