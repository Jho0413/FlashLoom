import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebaseAdmin";

export async function POST(req) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { flashcardId } = await req.json();
        await db.collection("users").doc(userId).collection("flashcardSets").doc(flashcardId).delete();
        return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
