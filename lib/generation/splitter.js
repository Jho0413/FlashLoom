import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 100,
  separators: ["\n\n", "\n", " ", ""],
});

export function splitText(text) {
  return splitter.splitText(text);
}
