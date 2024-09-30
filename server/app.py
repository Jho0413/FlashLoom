from flask import Flask, request, jsonify
import os 
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.document_loaders import YoutubeLoader
from text_splitter import split_documents
from langchain_huggingface.embeddings import HuggingFaceEmbeddings


load_dotenv()

app = Flask(__name__)
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
model = genai.GenerativeModel("gemini-1.5-flash")
embeddingModel = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")


def system_prompt(user_message):
    return f"""
    You are a flashcard generation system for a SaaS platform. 
    Your task is to help users create a set of 10 high-quality flashcards on the topic: "{user_message}".

    Each flashcard should have a clear and concise question on the front and an informative answer on the back. 
    The content should be accurate, useful, and written in simple, understandable language.
    
    If the topic is broad, try to cover a range of key concepts. If the topic is specific, focus on detailed aspects.
    
    Return the flashcards in the following JSON format:
    {{
        "flashcards": [
            {{
                "front": "Question for the first flashcard",
                "back": "Answer for the first flashcard"
            }},
            {{
                "front": "Question for the second flashcard",
                "back": "Answer for the second flashcard"
            }},
            ...
        ]
    }}
    
    Ensure that:
    - The questions encourage recall or critical thinking.
    - The answers provide a solid explanation or definition, concise and short.
    - There are 10-15 flashcards.
    
    Respond with only the JSON in plain text. 
    Make sure there are no trailing ```` please.
    """
    

@app.route("/api/generate", methods=['GET'])
def generate():
    data = request.json
    message = data['message']
    youtube_url = data['youtubeURL']
    loader = YoutubeLoader.from_youtube_url(youtube_url, add_video_info=True)
    document = loader.load()
    documents = split_documents(document)
    print(documents)
    prompt = system_prompt(message)
    query_result = embeddingModel.embed_query(prompt)
    # response = model.generate_content(prompt)
    return query_result


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
