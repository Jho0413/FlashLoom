import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  let event;

  try {
    event = await req.json();
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 404 });
  }

  try {
    if (event.type === "user.created") {
      const userId = event.data.id;
      const { email_address } = event.data.email_addresses[0];

      const customer = await stripe.customers.create({
        email: email_address,
        metadata: {
          clerkUserId: userId,
        },
      });

      await db.collection("users").doc(userId).set(
        {
          stripeCustomerId: customer.id,
          subscriptionPlan: "Free",
          generations: 0,
          subscriptionEndTime: null,
          subscriptionId: null,
          cancelled: true,
          deleted: false,
        },
        { merge: true }
      );

      return NextResponse.json({ message: "Successfully created" }, { status: 200 });
    }
    return NextResponse.json({ error: "Wrong event type sent" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
