import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/firebaseAdmin";

export async function GET(req, { params }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await db.collection("generationRuns").doc(params.id).get();
    if (!snapshot.exists) {
      return NextResponse.json({ status: "PENDING" }, { status: 200 });
    }

    const data = snapshot.data();
    if (data.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (data.status === "SUCCESS") {
      return NextResponse.json({ status: "SUCCESS", flashcards: data.flashcards }, { status: 200 });
    }
    if (data.status === "FAILURE") {
      return NextResponse.json({ status: "FAILURE", error: data.error }, { status: 200 });
    }
    return NextResponse.json({ status: "PENDING" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
