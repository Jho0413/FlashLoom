import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) 
        return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const docSnapshots = await getDocs(collection(db, "users", userId, "flashcardSets"));
    const flashcards = [];
    docSnapshots.forEach(document => {
        const data = document.data();
        flashcards.push({ id: document.id, name: data.name });
    });
    console.log(flashcards);
    return NextResponse.json({ flashcards: flashcards }, { status: 200 });
}