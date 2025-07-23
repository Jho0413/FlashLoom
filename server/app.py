import os
import logging

from flask import Flask, request, jsonify
from tasks import generate_flashcards
from flask_cors import CORS
from tasks import celery as celery_app

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

CORS(app, origins=[os.getenv("FRONTEND_URL"), "http://localhost:3000"])


@app.route("/generate", methods=['POST'])
def generate():
    try:
        logging.info("/api/generate called")
        data = request.json
        method = data.get('method')
        user_id = data.get('userId')
        if not method or not user_id:
            logging.error("Missing required fields: method or userId")
            return jsonify({'error': 'Missing required fields'}), 400
        
        if method == "Youtube":
            if not data.get('youtube_url'):
                logging.error("Missing youtube_url for Youtube method")
                return jsonify({'error': 'Missing youtube_url'}), 400
            
        elif method == "PDF":
            if not data.get('file') or not data.get('fileName'):
                logging.error("Missing file or fileName for PDF method")
                return jsonify({'error': 'Missing file or fileName'}), 400
        
        task = generate_flashcards.apply_async(args=[data])
        logging.info(f"Task {task.id} started with method {method}")
        return jsonify({'task_id': task.id}), 202
    except Exception as e:
        logging.exception(f"Exception in /api/generate: {e}")
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/task-status/<task_id>', methods=['GET'])
def task_status(task_id):
    result = celery_app.AsyncResult(task_id)
    if result.state == 'PENDING':
        return jsonify({'status': 'PENDING'}), 200
    elif result.state == 'SUCCESS':
        return jsonify({'status': 'SUCCESS', 'flashcards': result.result}), 200
    elif result.state == 'FAILURE':
        return jsonify({'status': 'FAILURE', 'error': str(result.result)}), 500
    else:
        return jsonify({'status': result.state}), 202


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
