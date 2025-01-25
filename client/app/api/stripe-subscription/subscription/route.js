import { NextResponse } from "next/server";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { plans } from "@/utils/plans";

export async function POST(req) {
    let event;
    try {
        event = await req.json();
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 404 });
    }
    const { data, type } = event;
    const { id, current_period_end, plan, customer: stripeCustomerId, status, cancel_at_period_end } = data.object;
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
                // user cancelling their subscription
                if (cancel_at_period_end) {
                    await updateDoc(docRef, {
                      cancelled: true,
                    });
                    break;
                }
                // subscription becomes active again
                if (status === "active") 
                    await updateDoc(docRef, {
                        subscriptionEndTime: current_period_end,
                        subscriptionPlan: plan.id,
                        subscriptionId: id,
                        cancelled: false,
                    });
                // subscription failed payment
                else if (status === "past_due" || status === "unpaid") 
                    await updateDoc(docRef, {
                        subscriptionEndTime: null,
                        subscriptionPlan: "Free",
                        cancelled: true,
                    });
                break; 
            // subscription ended
            case "customer.subscription.deleted":
                await updateDoc(docRef, {
                    subscriptionPlan: "Free",
                    subscriptionEndTime: null,
                    cancelled: true,
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
        const { subscriptionPlan, subscriptionEndTime, generations, cancelled } = data;
        let access;
        let plan;
        switch (subscriptionPlan) {
            case "Free":
                access = generations < 3;
                plan = "Free"
                break;
            case plans["Basic"]:
                const currentUnixTime = Math.floor(Date.now() / 1000);
                if (currentUnixTime <= subscriptionEndTime) {
                    access = true;
                    plan = "Basic";
                } else {
                    await updateDoc(userRef, {
                        subscriptionPlan: "Free",
                        subscriptionEndTime: null
                    });
                    access = generations < 3;
                    plan = "Free";
                }
                break;
        }
        return NextResponse.json({ access: access, plan: plan, generations: generations, cancelled: cancelled, subscriptionEndTime: subscriptionEndTime }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}