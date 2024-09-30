
// Using Gemini
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function systemPrompt(userMessage) { 
  return  `
      You are a flashcard generation system for a SaaS platform. 
      Your task is to help users create a set of 10 high-quality flashcards on the topic: "${userMessage}".

      Each flashcard should have a clear and concise question on the front and an informative answer on the back. 
      The content should be accurate, useful, and written in simple, understandable language.
      
      If the topic is broad, try to cover a range of key concepts. If the topic is specific, focus on detailed aspects.
      
      Return the flashcards in the following JSON format:
      {
          "flashcards": [
              {
                  "front": "Question for the first flashcard",
                  "back": "Answer for the first flashcard"
              },
              {
                  "front": "Question for the second flashcard",
                  "back": "Answer for the second flashcard"
              },
              ...
          ]
      }
      
      Ensure that:
      - The questions encourage recall or critical thinking.
      - The answers provide a solid explanation or definition, concise and short.
      - There are 10-15 flashcards.
      
      Respond with only the JSON in plain text. 
      Make sure there are no trailing ```` please.
  `
};

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("API key is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function POST(req) {
  fetch("http://127.0.0.1:8000/api/generate")
    .then(response => response.json())
    .then(response => {
      console.log(response);
      return NextResponse.json(response);
    })
    .catch(error => {
      console.log(error);
      return NextResponse.json(error);
    });
  // try {
  //   const data = await req.json();
  //   const { message: userMessage } = data;

  //   if (!userMessage) {
  //     return NextResponse.json(
  //       { error: "Message is required" },
  //       { status: 400 }
  //     );
  //   }
  //   console.log(userMessage);
  //   const prompt = systemPrompt(userMessage);

  //   // Log prompt for debugging
  //   console.log("Generated prompt:", prompt);

  //   const result = await model.generateContent(prompt);

  //   // Log raw result for debugging
  //   console.log("Raw model result: ", JSON.stringify(result));

  //   // Ensure result is properly parsed
  //   const responseText = await result.response.text();

  //   // Log the response text
  //   console.log("Response text:", responseText);

  //   // Attempt to parse JSON if the API returns a JSON string
  //   let flashcards;
  //   try {
  //     flashcards = JSON.parse(responseText);
  //   } catch (parseError) {
  //     console.error("Error parsing response text:", parseError);
  //     return NextResponse.json(
  //       { error: "Failed to parse flashcard response" },
  //       { status: 500 }
  //     );
  //   }

  //   return NextResponse.json(flashcards);
  // } catch (error) {
  //   console.error("Error generating response:", error);
  //   return NextResponse.json(
  //     { error: "Error generating response" },
  //     { status: 500 }
  //   );
  // }
}


// using Openai

// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const systemPrompt = `
// You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
// Both front and back should be one sentence long.
// You should return in the following JSON format:
// {
//   "flashcards":[
//     {
//       "front": "Front of the card",
//       "back": "Back of the card"
//     }
//   ]
// }
// `;


// export async function POST(req) {
//   const openai = new OpenAI();
//   const data = await req.text();

 
//   const completion = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: data },
//     ],
//     model: "gpt-4o",
//     response_format: { type: "json_object" },
//   });


//     const flashcards = JSON.parse(completion.choices[0].message.content);

//     // Return the flashcards as a JSON response
//     return NextResponse.json(flashcards.flashcards);

// }


