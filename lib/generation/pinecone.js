import { Pinecone } from "@pinecone-database/pinecone";

const RERANK_MODEL = "bge-reranker-v2-m3";

let index;
function getIndex() {
  if (!index) {
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!apiKey || !indexName) {
      throw new Error("PINECONE_API_KEY or PINECONE_INDEX_NAME is not set");
    }
    index = new Pinecone({ apiKey }).index(indexName);
  }
  return index;
}

export async function upsertRecords(namespace, records) {
  await getIndex().upsertRecords({ namespace, records });
}

export async function searchWithRerank(namespace, query, { topK = 10, topN = 10 } = {}) {
  const response = await getIndex().searchRecords({
    namespace,
    query: { topK, inputs: { text: query } },
    rerank: { model: RERANK_MODEL, rankFields: ["text"], topN },
    fields: ["text"],
  });
  return (response.result?.hits ?? []).map((hit) => hit.fields?.text).filter(Boolean);
}
