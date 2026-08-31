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
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        if (event.type === "user.deleted") {
            const userId = event.data.id;
            const userDocRef = db.collection("users").doc(userId);
            const userDoc = await userDocRef.get();
            const { stripeCustomerId } = userDoc.data();

            await stripe.customers.del(stripeCustomerId);
            await userDocRef.update({ deleted: true });

            return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });
        }
        return NextResponse.json({ error: "Wrong event type sent" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
