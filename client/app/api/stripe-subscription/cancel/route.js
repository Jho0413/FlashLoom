import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const data = await req.json();
    const { userId } = data;

    try {
        const userRef = doc(db, "users", userId);
        const user = await getDoc(userRef);
        if (!user.exists())
            throw new Error("User not found in the database");

        // obtaining subscription id of user
        const { subscriptionId } = user.data();

        // updating subscription in stripe
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });
        return NextResponse.json({ message: "successful cancellation" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}