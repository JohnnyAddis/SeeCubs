import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env", override=True)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-4-turbo", 
        messages=[
            {"role": "system", "content": "You are a helpful Cubs baseball data assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


