import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebaseAdmin";
import { plans } from "@/utils/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const { plan } = await req.json();
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            throw new Error("User not found in the database");
        }
        const { stripeCustomerId } = userDoc.data();

        const params = {
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: plans[plan],
                    quantity: 1,
                },
            ],
            customer: stripeCustomerId,
            success_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
        };
        const checkoutSession = await stripe.checkout.sessions.create(params);
        return NextResponse.json(checkoutSession, { status: 200 });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    const sessionId = req.nextUrl.searchParams.get("session_id");

    try {
        if (!sessionId)
            throw new Error("Session ID is required");

        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error("Error retrieving checkout session:", error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}
