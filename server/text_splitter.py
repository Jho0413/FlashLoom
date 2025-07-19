import logging
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=100,
    length_function=len,
    separators=["\n\n", "\n", " ", ""]
)

def split_documents(document):
    try:
        return text_splitter.split_documents(document)
    except Exception as e:
        logging.exception(f"Error in split_documents: {e}")
        raise

def split_text(text):
    try:
        return text_splitter.split_text(text)
    except Exception as e:
        logging.exception(f"Error in split_text: {e}")
        raise