import logging
from pinecone_helpers import upload_texts_and_generate
from youtube_transcript_api import YouTubeTranscriptApi


def generate_from_youtube_url(youtube_url, user_id, message):
    try:
        logging.info(f"Fetching YouTube transcript for URL: {youtube_url}")
        video_id = youtube_url.split("v=")[-1]
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id)
        all_content = " ".join(snippet.text for snippet in transcript.snippets)
        return upload_texts_and_generate(user_id + "+" + youtube_url, all_content, message)
    except Exception as e:
        logging.exception(f"Error in generate_from_youtube_url: {e}")
        raise