from celery import Celery
import os
import base64
from youtube_url_generator import generate_from_youtube_url
from pdf_generator import generate_from_pdf
from text_generator import generate_from_text
import tempfile
import logging

celery = Celery(
    'tasks',
    broker=os.environ.get('REDIS_URL'),   
    backend=os.environ.get('REDIS_URL')
)

@celery.task
def generate_flashcards(payload):
    try:
        method = payload.get('method')
        message = payload.get('message')
        user_id = payload.get('userId')

        if method == "Youtube":
            youtube_url = payload.get('youtube_url')
            return generate_from_youtube_url(youtube_url, user_id, message)
        
        elif method == "PDF":
            pdf_file = payload.get('file')
            file_name = payload.get('fileName')
            file_data = base64.b64decode(pdf_file)
            file_namespace = f'{user_id}+{file_name}'
            tmp_dir = tempfile.gettempdir()
            file_path = os.path.join(tmp_dir, file_namespace) 
            with open(file_path, 'wb') as f:
                f.write(file_data)
            try:
                return generate_from_pdf(file_path, file_namespace, message)
            finally:
                if os.path.exists(file_path): 
                    os.remove(file_path)
        
        else:
            return generate_from_text(message)
    except Exception as e:
        logging.exception(f"Error in generate_flashcards: {e}")
        raise
