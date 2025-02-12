import { db } from "@/firebase";
import { auth } from "@clerk/nextjs/server";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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