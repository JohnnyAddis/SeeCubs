from flask import Flask, request, jsonify
from openai import OpenAI
import pandas as pd
import matplotlib.pyplot as plt
import os

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load static data
df = pd.read_csv("./data/standard_batting.csv")



if __name__ == "__main__":
    # Test GPT call directly when running app.py
    user_prompt = "Plot AVG vs OPS and save as static/plot.png"
    system_message = f"""
You are a Python data analyst. The user will ask you to visualize data about the 2025 Chicago Cubs.
You have access to a Pandas DataFrame called df with these columns: {list(df.columns)}.
Write Python code using df, pandas, and matplotlib to create a plot and save it as 'static/plot.png'.
DO NOT include import statements or anything outside the function. Just the raw plotting code.
    """

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3,
    )


    code = response.choices[0].message.content

    if code.startswith("```"):
       code = "\n".join(line for line in code.splitlines() if not line.strip().startswith("```"))

    print("GPT Generated Code:\n", code)

    local_env = {"df": df, "pd": pd, "plt": plt}
    exec(code, {}, local_env)

    app.run(debug=True)
