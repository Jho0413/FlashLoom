import os
import logging
from pinecone import Pinecone, SearchQuery, SearchRerank, RerankModel
from utils import system_prompt, generate_flashcards, generate_topic
from text_splitter import split_documents, split_text

try:
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
    index = pc.Index(os.environ["PINECONE_INDEX_NAME"])
except Exception as e:
    logging.exception(f"Failed to initialize Pinecone client or index: {e}")
    raise

def upload_documents_and_generate(namespace, document, message):
    try:
        all_content = document[0].page_content
        documents = split_documents(document)
        vectors = []
        for i, doc in enumerate(documents):
            vectors.append({"id": f"doc_{i}", "text": doc.page_content})
        index.upsert_records(namespace, vectors)
        return perform_rag_helper(all_content, namespace, message)
    except Exception as e:
        logging.exception(f"Error in upload_documents_and_generate: {e}")
        raise

def upload_texts_and_generate(namespace, all_content, message):
    try:
        texts = split_text(all_content)
        vectors = []
        for i, text in enumerate(texts):
            vectors.append({"id": f"text_{i}", "text": text})
        index.upsert_records(namespace, vectors)
        return perform_rag_helper(all_content, namespace, message)
    except Exception as e:
        logging.exception(f"Error in upload_texts_and_generate: {e}")
        raise
    
    
def perform_rag_helper(all_content, namespace, message):
    try:
        main_topics = generate_topic(all_content)
        if message:
            return perform_rag(message, namespace)
        else:
            return perform_rag(main_topics, namespace)
    except Exception as e:
        logging.exception(f"Error in perform_rag_helper: {e}")
        raise
    

def perform_rag(message, namespace):
    try:
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
        context_list = [item['fields']['text'] for item in top_matches['result']['hits']]
        additional_context = "\n".join(context_list)
        prompt = system_prompt(message, additional_context)
        return generate_flashcards(prompt)
    except Exception as e:
        logging.exception(f"Error in perform_rag: {e}")
        raise
