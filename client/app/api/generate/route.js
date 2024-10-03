import { NextResponse } from "next/server";

export async function POST(req) {

  try {
    const data = await req.json();
    console.log(data);
    // const { method } = data;

    // if (method === "Basic") {
    //   let message = data?.message;
    //   if (!message.trim()) {
    //     return NextResponse.json(
    //       { error: "Message is required" },
    //       { status: 400 }
    //     )
    //   }
    // }

    const response = await fetch("http://127.0.0.1:8000/api/generate", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed")
    }

    const response_data = await response.json();
    const flashcards = JSON.parse(response_data);

    return NextResponse.json(flashcards);

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}