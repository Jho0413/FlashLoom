import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET() {
    const { userId } = auth();

    if (!userId) 
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    try {
        const docSnapshots = await getDocs(collection(db, "users", userId, "flashcardSets"));
        const flashcards = [];
        docSnapshots.forEach(document => {
            const data = document.data();
            flashcards.push({ id: document.id, name: data.name });
        });
        return NextResponse.json({ flashcards: flashcards }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}