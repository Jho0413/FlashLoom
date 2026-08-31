import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebaseAdmin";

export async function POST(req) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { flashcardId, name } = await req.json();
        const trimmed = (name ?? "").trim();
        if (!flashcardId || !trimmed) {
            return NextResponse.json({ error: "Missing flashcard id or name" }, { status: 400 });
        }

        await db
            .collection("users")
            .doc(userId)
            .collection("flashcardSets")
            .doc(flashcardId)
            .update({ name: trimmed });

        return NextResponse.json({ message: "Successfully renamed", name: trimmed }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
