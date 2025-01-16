import { NextResponse } from "next/server";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

export async function POST(req) {
    let event;
    try {
        event = await req.json();
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 404 });
    }
    const { data, type } = event;
    const { current_period_end, plan, customer: stripeCustomerId } = data.object;
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, where("stripeCustomerId", "==", stripeCustomerId));
    try {
        const querySnapshot = await getDocs(userQuery);
        if (querySnapshot.empty) {
            throw new Error("Customer not found in database");
        }
        if (querySnapshot.size > 1) {
            throw new Error("Stripe id matched with more than one user");
        }
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        const docRef = doc(db, "users", userId);
        switch (type) {
            case "customer.subscription.updated":
                await updateDoc(docRef, {
                    subscriptionEndTime: current_period_end,
                    subscriptionPlan: plan.id,
                });
            case "customer.subscription.deleted":
                await updateDoc(docRef, {
                    subscriptionPlan: "Free",
                });
        }
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch(error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}