import { fetchTranscript as fetchYoutubeCaptions } from "youtube-transcript-plus";

export async function fetchTranscript(youtubeUrl) {
  let segments;
  try {
    segments = await fetchYoutubeCaptions(youtubeUrl, { lang: "en" });
  } catch {
    segments = await fetchYoutubeCaptions(youtubeUrl);
  }

  const text = segments
    .map((segment) => segment.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new Error("No transcript available for this video");
  return text;
}
