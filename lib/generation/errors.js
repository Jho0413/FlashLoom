const GENERIC = "We hit an issue completing that. Please try again in a moment.";

const FRIENDLY = [
  [
    /no transcript|transcript.?unavailable|transcripts (are|not)|captions|transcript (is )?disabled/i,
    "We couldn't find a transcript for this video. Try one that has captions.",
  ],
  [
    /too many request|rate.?limit(ed|ing)?|\b429\b|resource_exhausted|quota|limit.?exceeded/i,
    "The service is rate-limiting requests right now. Please try again in a few minutes.",
  ],
  [
    /could not extract|no text|scanned|not a valid pdf|invalid pdf/i,
    "We couldn't read any text from that PDF. It may be scanned images rather than selectable text.",
  ],
  [
    /\b503\b|high demand|overloaded|temporarily unavailable/i,
    "The AI service is busy right now. Please try again in a moment.",
  ],
  [
    /no flashcard list|didn't return|could not parse|unparseable/i,
    "The AI didn't return a usable set of cards. Please try again.",
  ],
  [/timed out|timeout/i, "That took too long to generate. Please try again."],
];

export function toUserMessage(error) {
  const text = String(error?.message || error || "");
  for (const [pattern, message] of FRIENDLY) {
    if (pattern.test(text)) return message;
  }
  return GENERIC;
}
