import { db } from "@/firebase";
import { auth } from "@clerk/nextjs/server";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = params;
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const docRef = doc(db, "users", userId, "flashcardSets", id);
        const docSnapShot = await getDoc(docRef);
        const data = docSnapShot.data();
        return NextResponse.json({ ...data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}