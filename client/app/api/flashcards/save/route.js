import { db } from "@/firebase";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();
    const { userId, name, flashcards } = data;
    try {
        const userDocRef = doc(collection(db, "users", userId, "flashcardSets"));
        await setDoc(userDocRef, {
            name: name,
            flashcards: flashcards,
            timestamp: serverTimestamp(), 
        });
        return NextResponse.json({ message: "Successfully saved", id: userDocRef.id }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}