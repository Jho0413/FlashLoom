import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      generations: increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error incrementing generations:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}