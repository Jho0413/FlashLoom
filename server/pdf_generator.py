from langchain_community.document_loaders import PyPDFLoader
from pinecone_helpers import upload_documents_and_generate


def generate_from_pdf(pdf_path, pdf_namespace, message):
    loader = PyPDFLoader(pdf_path)
    document = loader.load()
    return upload_documents_and_generate(pdf_namespace, document, message)