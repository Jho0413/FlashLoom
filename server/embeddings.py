from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
import os

embeddings = HuggingFaceInferenceAPIEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2",
    api_key=os.environ["HUGGING_FACE_API_KEY"]
)
