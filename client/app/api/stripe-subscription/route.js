import { NextResponse } from "next/server";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { plans } from "@/utils/plans";

export async function POST(req) {
    let event;
    try {
        event = await req.json();
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 404 });
    }
    const { data, type } = event;
    const { current_period_end, plan, customer: stripeCustomerId, status } = data.object;
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
                if (status === "active") 
                    await updateDoc(docRef, {
                        subscriptionEndTime: current_period_end,
                        subscriptionPlan: plan.id,
                    });
                else if (status === "past_due" || status === "unpaid" || status === "cancelled") 
                    await updateDoc(docRef, {
                        subscriptionEndTime: null,
                        subscriptionPlan: "Free",
                    });
                break; 
            case "customer.subscription.deleted":
                await updateDoc(docRef, {
                    subscriptionPlan: "Free",
                });
                break;
        }
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch(error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) 
        return NextResponse.json({ message: "Missing user id" }, { status: 400 });

    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) 
            throw new Error("User not found in the database");

        const data = userDoc.data();
        const { subscriptionPlan, subscriptionEndTime, generations } = data;
        let message;
        switch (subscriptionPlan) {
            case "Free":
                if (generations == 3) 
                    message = "No permission";
                else
                    message = "Success";
                break;
            case plans["Basic"]:
                const currentUnixTime = Math.floor(Date.now() / 1000);
                if (currentUnixTime <= subscriptionEndTime)
                    message = "Success";
                else {
                    await updateDoc(userRef, {
                        subscriptionPlan: "Free",
                        subscriptionEndTime: null
                    });
                    message = generations == 3 ? "No permission" : "Success";
                }
                break;
        }
        return NextResponse.json({ message: message }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}