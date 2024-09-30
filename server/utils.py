import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
model = genai.GenerativeModel("gemini-1.5-flash")


def system_prompt(user_message, additional_content):
    prompt = f"""
    You are a flashcard generation system for a SaaS platform. 
    Your task is to help users create a set of 10-15 high-quality flashcards.

    These are requested by the user: {user_message}.

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
    - There are no trailing ``` or json in the response

    Respond with only the JSON in plain text. 
    """

    if additional_content:
        prompt += "\n" + (f'This is some additional content from the user that you should prioritize: '
                          f'{additional_content}. If this is blank, refer to the user message.')

    return prompt


def generate_topic(content):
    prompt = f"""
    You are a summarizer for a large amount of content and I want you to summarize the content into 1 sentence that 
    describes the main topics covered in this content. The use case for this is to query the vector database based on 
    the topics of the content I have given you. I want you to create in the format of "I want to know more about 
    (topics that you will find)"
    
    Here is the content: {content}
    
    Ensure that: 
    - The main topics are covered in this 1 sentence
    """
    response = model.generate_content(prompt)
    return response.text


def generate_flashcards(prompt):
    response = model.generate_content(prompt)
    return response.text
