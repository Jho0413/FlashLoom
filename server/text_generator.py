from utils import generate_flashcards, system_prompt


def generate_from_text(message):
    """Generate flashcards from user message"""
    prompt = system_prompt(message, None)
    return generate_flashcards(prompt)
