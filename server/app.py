from flask import Flask, request, jsonify
from youtube_url_generator import generate_from_youtube_url
from pdf_generator import generate_from_pdf
from text_generator import generate_from_text
from langchain_huggingface.embeddings import HuggingFaceEmbeddings



app = Flask(__name__)


@app.route("/api/generate", methods=['GET'])
def generate():
    data = request.json
    message = data['message']
    youtube_url = data['youtubeURL']
    pdf_url = data['pdfURL']
    if youtube_url:
        response = generate_from_youtube_url(youtube_url, message)
    elif pdf_url:
        response = generate_from_pdf(pdf_url, message)
    else:
        # basic generation
        response = generate_from_text(message)
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
