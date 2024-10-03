import { NextResponse } from "next/server";

function isValidYoutubeUrl(youtube_url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([A-Za-z0-9_-]{11})$/;
  return regex.test(youtube_url);
}

export async function POST(req) {

  try {
    const data = await req.json();
    const { method } = data;

    // basic method -> must have a message
    if (method === "Basic") {
      let message = data?.message;
      if (!message || !message.trim()) {
        return NextResponse.json(
          { error_message: "Message is required" },
          { status: 400 }
        );
      }
    }

    // youtube method -> must be a valid youtube url
    if (method === "Youtube") {
      console.log("reached youtube")
      let youtube_url = data?.youtube_url;
      if (!youtube_url) {
        return NextResponse.json(
          { error_message: "Missing youtube url" },
          { status: 400 }
        );
      }
      console.log(isValidYoutubeUrl(youtube_url))
      if (!isValidYoutubeUrl(youtube_url)) {
        console.log("reached")
        return NextResponse.json(
          { error_message: "Invalid youtube url" },
          { status: 400 }
        )
      }
    }

    // pdf method

    const response = await fetch("http://127.0.0.1:8000/api/generate", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("An internal error occurred");
    }

    const response_data = await response.json();
    const flashcards = JSON.parse(response_data);

    return NextResponse.json(flashcards, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error_message: error }, { status: 500 });
  }
}