import { stripe, isStripeConfigured } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Check if user is authenticated
  const user = await currentUser();
  if (!user) return NextResponse.json({ status: 404, message: "User not found" });
  
  // Check if Stripe is properly configured
  if (!isStripeConfigured()) {
    console.error("Stripe is not configured. Missing STRIPE_CLIENT_SECRET.");
    return NextResponse.json({ 
      status: 500, 
      message: "Payment system is not configured properly."
    });
  }

  // Check if price ID is defined
  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
  if (!priceId) {
    console.error("Missing STRIPE_SUBSCRIPTION_PRICE_ID environment variable");
    return NextResponse.json({ 
      status: 500, 
      message: "Payment configuration incomplete."
    });
  }

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?cancel=true`,
    });

    if (session) {
      return NextResponse.json({
        status: 200,
        session_url: session.url,
      });
    }
    
    return NextResponse.json({ status: 400, message: "Failed to create checkout session" });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json({ 
      status: 500, 
      message: "An error occurred while setting up payment."
    });
  }
}
