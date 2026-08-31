import { extractText, getDocumentProxy } from "unpdf";

export async function extractPdfText(bytes) {
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { text } = await extractText(pdf, { mergePages: true });
  const trimmed = (text || "").trim();
  if (!trimmed) throw new Error("Could not extract any text from the PDF");
  return trimmed;
}
