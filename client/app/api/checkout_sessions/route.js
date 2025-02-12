import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { plans } from "@/utils/plans";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const { plan } = await req.json();
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        const { stripeCustomerId } = docSnap.data();
    
        const price_id = plans[plan];

        const params = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
            {
                price: price_id,
                quantity: 1,
            },
            ],
            customer: stripeCustomerId,
            success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
        };
        const checkoutSession = await stripe.checkout.sessions.create(params);
        return NextResponse.json(checkoutSession, { status: 200 });
    } catch (error) {
        console.error('Error creating checkout session:', error)
        return new NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const session_id = searchParams.get('session_id');

    try {
        if (!session_id) 
            throw new Error('Session ID is required');

        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}