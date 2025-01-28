import os

from flask import Flask, request, jsonify
from youtube_url_generator import generate_from_youtube_url
from pdf_generator import generate_from_pdf
from text_generator import generate_from_text
import base64

app = Flask(__name__)


@app.route("/api/generate", methods=['POST'])
def generate():
    data = request.json
    method = data['method']
    message = data['message']
    user_id = data['userId']
    if method == "Youtube":
        youtube_url = data['youtube_url']
        response = generate_from_youtube_url(youtube_url, user_id, message)
    elif method == "PDF":
        pdf_file, file_name = data['file'], data['fileName']
        file_data = base64.b64decode(pdf_file)
        current_directory = os.getcwd()
        file_namespace = f'{user_id}+{file_name}'
        file_path = os.path.join(current_directory, file_namespace)
        with open(file_path, 'wb') as f:
            f.write(file_data)

        response = generate_from_pdf(file_path, file_namespace, message)
        os.remove(file_path)
    else:
        # basic generation
        response = generate_from_text(message)
    return jsonify({'flashcards': response})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
