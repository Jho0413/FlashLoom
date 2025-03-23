import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

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
        if (event.type === 'user.deleted') {
            const userId = event.data.id;
            const userDocRef = doc(db, "users", userId); 
            const userDocSnap = await getDoc(userDocRef);
            const { stripeCustomerId } = userDocSnap.data();

            // deletes from stripe
            await stripe.customers.del(stripeCustomerId);

            // updates database
            await updateDoc(userDocRef, {
                deleted: true
            });
            return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Wrong event type sent" }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}