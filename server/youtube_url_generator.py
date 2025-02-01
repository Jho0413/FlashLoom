from langchain_community.document_loaders import YoutubeLoader
from pinecone_helpers import upload_data_and_generate


def generate_from_youtube_url(youtube_url, user_id, message):
    # loading YouTube transcript from url
    loader = YoutubeLoader.from_youtube_url(youtube_url, add_video_info=False)
    document = loader.load()
    return upload_data_and_generate(user_id + "+" + youtube_url, document, message)
