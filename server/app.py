import os
import logging

from flask import Flask, request, jsonify
from youtube_url_generator import generate_from_youtube_url
from pdf_generator import generate_from_pdf
from text_generator import generate_from_text
import base64

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)


@app.route("/api/generate", methods=['POST'])
def generate():
    try:
        logging.info("/api/generate called")
        data = request.json
        method = data.get('method')
        message = data.get('message')
        user_id = data.get('userId')
        if not method or not user_id:
            logging.error("Missing required fields: method or userId")
            return jsonify({'error': 'Missing required fields'}), 400
        
        if method == "Youtube":
            youtube_url = data.get('youtube_url')
            if not youtube_url:
                logging.error("Missing youtube_url for Youtube method")
                return jsonify({'error': 'Missing youtube_url'}), 400
            response = generate_from_youtube_url(youtube_url, user_id, message)
            
        elif method == "PDF":
            pdf_file = data.get('file')
            file_name = data.get('fileName')
            if not pdf_file or not file_name:
                logging.error("Missing file or fileName for PDF method")
                return jsonify({'error': 'Missing file or fileName'}), 400
            try:
                file_data = base64.b64decode(pdf_file)
            except Exception as e:
                logging.exception(f"Failed to decode base64 PDF file: {e}")
                return jsonify({'error': 'Invalid file encoding'}), 400
            
            current_directory = os.getcwd()
            file_namespace = f'{user_id}+{file_name}'
            file_path = os.path.join(current_directory, file_namespace)
            try:
                with open(file_path, 'wb') as f:
                    f.write(file_data)
                response = generate_from_pdf(file_path, file_namespace, message)
            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)
        else:
            response = generate_from_text(message)
            
        logging.info(f"Response: {response}")
        return jsonify({'flashcards': response})
    except Exception as e:
        logging.exception(f"Exce[topm] in /api/generate: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
