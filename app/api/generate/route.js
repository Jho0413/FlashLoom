import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, FieldValue } from "@/firebaseAdmin";
import { inngest, GENERATE_EVENT } from "@/lib/inngest/client";

export async function POST(req) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const method = formData.get("method");
    const message = formData.get("message") || "";

    const data = { runId: randomUUID(), userId, method, message };

    if (method === "Youtube") {
      data.youtubeUrl = formData.get("youtube_url");
      if (!data.youtubeUrl) {
        return NextResponse.json({ error: "Missing youtube_url" }, { status: 400 });
      }
    } else if (method === "PDF") {
      const file = formData.get("file");
      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "Missing file" }, { status: 400 });
      }
      data.fileBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
      data.fileName = file.name;
    }

    await db.collection("generationRuns").doc(data.runId).set({
      status: "PENDING",
      userId,
      method,
      createdAt: FieldValue.serverTimestamp(),
    });

    await inngest.send({ name: GENERATE_EVENT, data });

    return NextResponse.json({ task_id: data.runId }, { status: 202 });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
