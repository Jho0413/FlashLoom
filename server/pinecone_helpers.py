import os
from pinecone import Pinecone, SearchQuery, SearchRerank, RerankModel
from utils import system_prompt, generate_flashcards, generate_topic
from text_splitter import split_documents

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index = pc.Index(os.environ["PINECONE_INDEX_NAME"])

def upload_data_and_generate(namespace, document, message):
    all_content = document[0].page_content
    documents = split_documents(document)

    vectors = []
    for i, document in enumerate(documents):
        vectors.append((
            {"id": f"doc_{i}", "text": document.page_content}
        ))
    index.upsert_records(namespace, vectors)
    main_topics = generate_topic(all_content)

    if message:
        return perform_rag(message, namespace)
    else:
        return perform_rag(main_topics, namespace)


def perform_rag(message, namespace):
    # querying the database
    top_matches = index.search_records(
        namespace=namespace,
        query=SearchQuery(
            inputs={
                "text": message,
            },
            top_k=10
        ),
        rerank=SearchRerank(
            model=RerankModel.Bge_Reranker_V2_M3,
            rank_fields=["text"],
            top_n=10,
        ),
    )

    # extracting the context from the matches returned
    context_list = [item['fields']['text'] for item in top_matches['result']['hits']]
    additional_context = "\n".join(context_list)

    # generating prompt
    prompt = system_prompt(message, additional_context)

    return generate_flashcards(prompt)
