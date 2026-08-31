import { Supadata, SupadataError } from "@supadata/js";

function normalise(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function toText(content) {
  return normalise(
    Array.isArray(content) ? content.map((chunk) => chunk.text).join(" ") : content
  );
}

export async function fetchTranscript(youtubeUrl) {
  if (!process.env.SUPADATA_API_KEY) {
    throw new Error("SUPADATA_API_KEY is not set");
  }

  const supadata = new Supadata({ apiKey: process.env.SUPADATA_API_KEY });

  try {
    let transcript = await supadata.transcript({
      url: youtubeUrl,
      text: true,
      lang: "en",
      mode: "native",
    });

    if ("jobId" in transcript) {
      const { jobId } = transcript;
      transcript = null;
      for (let attempt = 0; attempt < 20 && !transcript; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const job = await supadata.transcript.getJobStatus(jobId);
        if (job.status === "completed") transcript = job.result;
        else if (job.status === "failed") {
          throw new Error(job.error?.message || "transcript-unavailable");
        }
      }
      if (!transcript) throw new Error("Transcript request timed out");
    }

    const text = toText(transcript.content);
    if (!text) throw new Error("No transcript available for this video");
    return text;
  } catch (error) {
    if (error instanceof SupadataError) {
      throw new Error(`${error.error}: ${error.message || error.details || ""}`.trim());
    }
    throw error;
  }
}
