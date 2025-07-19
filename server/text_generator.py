import logging
from utils import generate_flashcards, system_prompt


def generate_from_text(message):
    """Generate flashcards from user message"""
    try:
        prompt = system_prompt(message, None)
        return generate_flashcards(prompt)
    except Exception as e:
        logging.exception(f"Error in generate_from_text: {e}")
        raise
