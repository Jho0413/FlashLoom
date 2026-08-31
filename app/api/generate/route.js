import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, FieldValue } from "@/firebaseAdmin";
import { inngest, GENERATE_EVENT } from "@/lib/inngest/client";
import { fetchTranscript } from "@/lib/generation/youtube";
import { extractPdfText } from "@/lib/generation/pdf";
import { toUserMessage } from "@/lib/generation/errors";

export const maxDuration = 60;

const MAX_CONTENT = 200_000;
const MAX_MESSAGE = 8_000;

const youtubeVideoId = (url) =>
  (url.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/)([A-Za-z0-9_-]{11})/) || [])[1];

const namespaceFor = (userId, key) =>
  `${userId}_${key}`.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 200);

export async function POST(req) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const method = formData.get("method");
    const message = (formData.get("message") || "").slice(0, MAX_MESSAGE);

    let content = message;
    let namespace = null;

    if (method === "Youtube") {
      const youtubeUrl = formData.get("youtube_url");
      if (!youtubeUrl) {
        return NextResponse.json({ error: "Missing youtube_url" }, { status: 400 });
      }
      content = await fetchTranscript(youtubeUrl);
      namespace = namespaceFor(userId, youtubeVideoId(youtubeUrl) || youtubeUrl);
    } else if (method === "PDF") {
      const file = formData.get("file");
      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "Missing file" }, { status: 400 });
      }
      content = await extractPdfText(Buffer.from(await file.arrayBuffer()));
      namespace = namespaceFor(userId, file.name);
    }

    content = content.slice(0, MAX_CONTENT);

    const runId = randomUUID();
    await db.collection("generationRuns").doc(runId).set({
      status: "PENDING",
      userId,
      method,
      createdAt: FieldValue.serverTimestamp(),
    });

    await inngest.send({
      name: GENERATE_EVENT,
      data: { runId, userId, method, message, content, namespace },
    });

    return NextResponse.json({ task_id: runId }, { status: 202 });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json({ error: toUserMessage(error) }, { status: 500 });
  }
}
