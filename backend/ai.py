import os
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def explain_word_with_ai(word: str) -> dict:
    prompt = f"""
You are helping a student learn cloud computing English vocabulary.

Explain this word: {word}

Return a clear study note with:
1. Simple English definition
2. Chinese meaning
3. Cloud computing example sentence
4. Memory tip
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    return {
        "word": word,
        "explanation": response.content[0].text
    }


def generate_quiz_with_ai(word_data: dict) -> dict:
    prompt = f"""
Create one short quiz question for this vocabulary word.

Word: {word_data.get("word")}
Definition: {word_data.get("definition")}
Chinese meaning: {word_data.get("chinese_meaning")}
Example: {word_data.get("example_sentence")}

Return:
1. Question
2. Correct answer
3. Short explanation
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    return {
        "word": word_data.get("word"),
        "quiz": response.content[0].text
    }


def recommend_review_with_ai(words: list[dict], reviews: list[dict], message: str) -> dict:
    prompt = f"""
You are an AI vocabulary learning coach.

The user is learning cloud computing English vocabulary.

User message:
{message}

Vocabulary words:
{words}

Review history:
{reviews}

Recommend what the user should review next. Use the user's saved vocabulary data.
Give a practical and short study plan.
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=700,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    return {
        "recommendation": response.content[0].text
    }