import os

from langchain_community.document_loaders import YoutubeLoader
from text_splitter import split_documents
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from utils import system_prompt, generate_flashcards, generate_topic


embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")


def generate_from_youtube_url(youtube_url, message):
    # loading YouTube transcript from url
    loader = YoutubeLoader.from_youtube_url(youtube_url, add_video_info=True)
    document = loader.load()
    all_content = document[0].page_content
    documents = split_documents(document)

    # upsert pinecone with embedded data
    namespace = youtube_url
    index_name = "flashloom"

    vectorstore_from_text = PineconeVectorStore.from_texts(
        texts=[f"Source: {text.metadata['source']}, Title: {text.metadata['title']} \n\nContent: {text.page_content}"
               for text in documents],
        embedding=embeddings,
        namespace=namespace,
        index_name=index_name
    )

    main_topics = generate_topic(all_content)

    if message:

        # need to check if user message is related to content of youtube video

        return perform_rag_youtube_url(message, namespace, index_name)
    else:
        return perform_rag_youtube_url(main_topics, namespace, index_name)


def perform_rag_youtube_url(message, namespace, index_name):
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
