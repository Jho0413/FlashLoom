import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebaseAdmin";

export async function GET() {
    const { userId } = auth();

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const snapshot = await db.collection("users").doc(userId).collection("flashcardSets").get();
        const flashcards = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                cardCount: Array.isArray(data.flashcards) ? data.flashcards.length : 0,
                timestamp: data.timestamp?.toMillis?.() ?? null,
            };
        });
        return NextResponse.json({ flashcards }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
