import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateFlashcards } from "@/lib/inngest/functions";

// Each Inngest step is a separate invocation of this route; the longest single
// step is one Gemini call. 60s covers Hobby; raise to 300 on Pro if needed.
export const maxDuration = 60;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateFlashcards],
});
