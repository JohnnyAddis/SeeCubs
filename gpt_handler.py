import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # switched from gpt-4
        messages=[
            {"role": "system", "content": "You are a helpful Cubs baseball data assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


