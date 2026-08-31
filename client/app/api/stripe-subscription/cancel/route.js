import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { db } from "@/firebaseAdmin";

export async function POST() {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists)
            throw new Error("User not found in the database");

        const { subscriptionId } = userDoc.data();

        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
        return NextResponse.json({ message: "successful cancellation" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
