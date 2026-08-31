import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, FieldValue } from "@/firebaseAdmin";

export async function POST(req) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, flashcards } = await req.json();

    try {
        const docRef = db.collection("users").doc(userId).collection("flashcardSets").doc();
        await docRef.set({
            name,
            flashcards,
            timestamp: FieldValue.serverTimestamp(),
        });
        return NextResponse.json({ message: "Successfully saved", id: docRef.id }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
