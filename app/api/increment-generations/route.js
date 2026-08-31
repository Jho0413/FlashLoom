import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, FieldValue } from "@/firebaseAdmin";

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.collection("users").doc(userId).update({
      generations: FieldValue.increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing generations:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
