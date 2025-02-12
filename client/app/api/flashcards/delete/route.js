import { db } from "@/firebase";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        const { flashcardId } = data;
        
        await deleteDoc(doc(db, "users", userId, "flashcardSets", flashcardId));
        return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}