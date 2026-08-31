import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebaseAdmin";
import { plans } from "@/utils/plans";

export async function POST(req) {
    let event;
    try {
        event = await req.json();
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 404 });
    }
    const { data, type } = event;
    const { id, current_period_end, plan, customer: stripeCustomerId, status, cancel_at_period_end } = data.object;

    try {
        const querySnapshot = await db.collection("users").where("stripeCustomerId", "==", stripeCustomerId).get();
        if (querySnapshot.empty) {
            throw new Error("Customer not found in database");
        }
        if (querySnapshot.size > 1) {
            throw new Error("Stripe id matched with more than one user");
        }
        const docRef = querySnapshot.docs[0].ref;

        switch (type) {
            case "customer.subscription.updated":
                // user cancelling their subscription
                if (cancel_at_period_end) {
                    await docRef.update({ cancelled: true });
                    break;
                }
                // subscription becomes active again
                if (status === "active")
                    await docRef.update({
                        subscriptionEndTime: current_period_end,
                        subscriptionPlan: plan.id,
                        subscriptionId: id,
                        cancelled: false,
                    });
                // subscription failed payment
                else if (status === "past_due" || status === "unpaid")
                    await docRef.update({
                        subscriptionEndTime: null,
                        subscriptionPlan: "Free",
                        cancelled: true,
                    });
                break;
            // subscription ended
            case "customer.subscription.deleted":
                await docRef.update({
                    subscriptionPlan: "Free",
                    subscriptionEndTime: null,
                    cancelled: true,
                });
                break;
        }
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    const { userId } = auth();

    if (!userId)
        return NextResponse.json({ message: "Missing user id" }, { status: 400 });

    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists)
            throw new Error("User not found in the database");

        const { subscriptionPlan, subscriptionEndTime, generations, cancelled } = userDoc.data();
        let access;
        let plan;
        switch (subscriptionPlan) {
            case "Free":
                access = generations < 3;
                plan = "Free";
                break;
            case plans["Basic"]:
                if (Math.floor(Date.now() / 1000) <= subscriptionEndTime) {
                    access = true;
                    plan = "Basic";
                } else {
                    await userRef.update({
                        subscriptionPlan: "Free",
                        subscriptionEndTime: null,
                    });
                    access = generations < 3;
                    plan = "Free";
                }
                break;
        }
        return NextResponse.json({ access, plan, generations, cancelled, subscriptionEndTime }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
