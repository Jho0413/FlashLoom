from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=100,
    length_function=len,
    separators=["\n\n", "\n", " ", ""]
)


def split_documents(document):
    documents = text_splitter.split_documents(document)
    return documents


def split_text(text):
    return text_splitter.split_text(text)
