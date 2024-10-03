from flask import Flask, request, jsonify
from youtube_url_generator import generate_from_youtube_url
from pdf_generator import generate_from_pdf
from text_generator import generate_from_text


app = Flask(__name__)


@app.route("/api/generate", methods=['POST'])
def generate():
    data = request.json
    print(data)
    method = data['method']
    message = data['message']
    if method == "Youtube":
        youtube_url = data['youtube_url']
        response = generate_from_youtube_url(youtube_url, message)
    elif method == "PDF":
        pdf_file = data['pdf_file']
        response = generate_from_pdf(pdf_file, message)
    else:
        # basic generation
        response = generate_from_text(message)
    return jsonify(response)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
