import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  console.log(req);

  let event;

  try {
    // Assuming this is a Clerk webhook
    event = await req.json(); // Directly parse the incoming JSON
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 404 });
  }

  try {
    // Handle user.created event from Clerk
    if (event.type === 'user.created') {
      console.log(event.data.email_address);
      const userId = event.data.id; // Clerk user ID
      const emails = event.data.email_addresses; // User's email
      const { email_address } = emails[0];
  
      // Create a Stripe customer
      const customer = await stripe.customers.create({
        email: email_address,
        metadata: {
          clerkUserId: userId, // Store Clerk user ID for reference
        },
      });
  
      // Save customer.id to your Firestore database under the user's document
      const userDocRef = doc(db, "users",  userId); // Reference to the user document
      await setDoc(userDocRef, {
          stripeCustomerId: customer.id, // Save the Stripe customer ID
          subscriptionPlan: "Free",
          generations: 0,
          subscriptionEndTime: null,
          subscriptionId: null,
          cancelled: true,
          deleted: false,
      }, { merge: true });
  
      console.log(`Stripe customer created: ${customer.id}`);
      return NextResponse.json({ message: "Successfully created" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Wrong event type sent" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}