import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();
    const { userId, flashcardId } = data;

    try {
        await deleteDoc(doc(db, "users", userId, "flashcardSets", flashcardId));
        return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}