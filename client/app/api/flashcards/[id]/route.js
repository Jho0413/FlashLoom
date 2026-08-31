import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebaseAdmin";

export async function GET(req, { params }) {
    const { id } = params;
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const snapshot = await db
            .collection("users")
            .doc(userId)
            .collection("flashcardSets")
            .doc(id)
            .get();

        if (!snapshot.exists) {
            return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 });
        }

        return NextResponse.json({ ...snapshot.data() }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
