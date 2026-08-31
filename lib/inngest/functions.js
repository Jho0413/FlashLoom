import { db, FieldValue } from "@/firebaseAdmin";
import { inngest, GENERATE_EVENT } from "./client";
import { systemPrompt } from "@/lib/generation/prompts";
import { callGemini, extractFlashcardArray, generateTopic } from "@/lib/generation/gemini";
import { splitText } from "@/lib/generation/splitter";
import { upsertRecords, searchWithRerank } from "@/lib/generation/pinecone";
import { toUserMessage } from "@/lib/generation/errors";

const runDoc = (runId) => db.collection("generationRuns").doc(runId);

const setStatus = (runId, fields) =>
  runDoc(runId).set({ ...fields, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

export const generateFlashcards = inngest.createFunction(
  { id: "generate-flashcards", retries: 1, triggers: [{ event: GENERATE_EVENT }] },
  async ({ event, step }) => {
    const { runId, message, content, namespace } = event.data;

    try {
      let flashcards;

      if (namespace) {
        const chunks = await step.run("chunk", () => splitText(content));

        await step.run("upsert", () =>
          upsertRecords(
            namespace,
            chunks.map((text, i) => ({ id: `chunk_${i}`, text }))
          )
        );

        const query = await step.run("resolve-query", async () => {
          const trimmed = (message || "").trim();
          return trimmed || (await generateTopic(content));
        });

        const context = await step.run("search", () => searchWithRerank(namespace, query));

        flashcards = await step.run("generate", async () =>
          extractFlashcardArray(await callGemini(systemPrompt(query, context.join("\n"))))
        );
      } else {
        flashcards = await step.run("generate-from-text", async () =>
          extractFlashcardArray(await callGemini(systemPrompt(content, null)))
        );
      }

      await step.run("save-success", () => setStatus(runId, { status: "SUCCESS", flashcards, error: null }));
      return { runId, status: "SUCCESS" };
    } catch (error) {
      console.error("generate-flashcards failed:", error);
      await step.run("save-failure", () =>
        setStatus(runId, { status: "FAILURE", error: toUserMessage(error) })
      );
      return { runId, status: "FAILURE" };
    }
  }
);
