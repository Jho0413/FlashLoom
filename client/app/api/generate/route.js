import { db } from "@/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const method = formData.get("method");
    const message = formData.get("message");
    const userId = formData.get("userId");
    const plan = formData.get("plan");
    let body = { method: method, message: message, userId: userId };
    switch (method) {
      case "Youtube":
        body["youtube_url"] = formData.get("youtube_url");
        break;
      case "PDF":
        const file = formData.get("file");
        const arrayBuffer = await file.arrayBuffer();
        const base64File = bufferToBase64(arrayBuffer)
        body["file"] = base64File;
        body["fileName"] = file.name;
        break;
      default:
        break;
    }

    const response = await fetch("http://127.0.0.1:5000/api/generate", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("An internal error occurred");
    }

    const data = await response.json();
    const { flashcards } = data;
    if (plan === "Free") {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        generations: increment(1)
      });
    }
    return NextResponse.json({ flashcards: flashcards }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error_message: error }, { status: 500 });
  }
}

function bufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}