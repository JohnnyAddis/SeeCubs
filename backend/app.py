from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend for Matplotlib

import matplotlib.pyplot as plt
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

openai.api_key = os.getenv("OPENAI_API_KEY")

# Load static data once
df = pd.read_csv("data/standard_batting.csv")

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_plot():
    if request.method == "OPTIONS":
        # CORS preflight request
        return jsonify({"message": "CORS preflight success"}), 200

    # Get prompt from frontend
    user_prompt = request.json.get("prompt")
    print("Received prompt:", user_prompt)

    system_message = f"""
You are a Chicago Cubs data analyst specializing in the 2025 season.
You are analyzing **standard batting statistics** for the 2025 Cubs.

- The available columns in df are: {list(df.columns)}.
- Only use these columns. Do NOT reference any column not in this list.
- Based on the user's prompt, choose the most appropriate type of plot:
    * Scatter plot for relationships
    * Bar chart for categories
    * Line chart for trends over time
- Add clear axis labels and a descriptive title mentioning "2025 Chicago Cubs".
- Save the chart as 'static/plot.png'.

IMPORTANT: Do NOT include import statements or plt.show().
Only provide Python code that starts with plt.figure() and ends with plt.savefig().
"""


    try:
        # GPT generates Python code
        response = openai.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )

        code = response.choices[0].message.content

        # Remove any ```python markdown fences
        if code.startswith("```"):
            code = "\n".join(line for line in code.splitlines() if not line.strip().startswith("```"))

        print("GPT Generated Code:\n", code)

        # Execute GPT code
        local_env = {"df": df, "pd": pd, "plt": plt}
        exec(code, {}, local_env)

        return jsonify({
            "image_url": "/static/plot.png",
            "code_used": code
        })

    except Exception as e:
        print("Error during plot generation:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
