import os
from pinecone import Pinecone
from embeddings import embeddings
from utils import system_prompt, generate_flashcards, generate_topic
from langchain_pinecone import PineconeVectorStore
from text_splitter import split_documents


def upload_data_and_generate(namespace, document, message):
    all_content = document[0].page_content
    documents = split_documents(document)

    index_name = "flashloom"
    PineconeVectorStore.from_texts(
        texts=[f"Source: {text.metadata['source']} \n\nContent: {text.page_content}"
               for text in documents],
        embedding=embeddings,
        namespace=namespace,
        index_name=index_name
    )
    main_topics = generate_topic(all_content)

    if message:
        return perform_rag(message, namespace, index_name)
    else:
        return perform_rag(main_topics, namespace, index_name)


def perform_rag(message, namespace, index_name):
    # initialising pinecone
    pc = Pinecone(api_key=os.environ['PINECONE_API_KEY'])
    pinecone_index = pc.Index(name=index_name)

    # querying the database
    query_embedding = embeddings.embed_query(message)
    top_matches = pinecone_index.query(vector=query_embedding, top_k=10, include_metadata=True, namespace=namespace)

    # extracting the context from the matches returned
    context_list = [item['metadata']['text'] for item in top_matches['matches']]
    additional_context = "\n".join(context_list)

    # generating prompt
    prompt = system_prompt(message, additional_context)

    return generate_flashcards(prompt)