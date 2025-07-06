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

# ✅ Setup OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

    # ✅ Cubs-aware system message
    system_message = f"""
    You are a Chicago Cubs data analyst specializing in the 2025 season.
    You are analyzing **standard batting statistics** for the 2025 Cubs.

    - The available columns in df are: {list(df.columns)}.
    - ONLY use these columns exactly as named in df. 
    - If the user asks for a column not in this list, return an error message like:
      "The dataset does not include column: X".
    - Based on the user's prompt, choose the most appropriate type of plot:
        * Scatter plot for relationships
        * Bar chart for categories
        * Line chart for trends over time
    - Add clear axis labels and a descriptive title mentioning "2025 Chicago Cubs".
    - Save the chart as 'static/plot.png'.

    IMPORTANT:
    - Do NOT include import statements or plt.show().
    - Only provide Python code that starts with plt.figure() and ends with plt.savefig().
    """

    try:

        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )

        code = response.choices[0].message.content

        
        if code.startswith("```"):
            code = "\n".join(
                line for line in code.splitlines() if not line.strip().startswith("```")
            )

        print("GPT Generated Code:\n", code)

        
        plt.close("all")
        local_env = {"df": df, "pd": pd, "plt": plt}
        exec(code, {}, local_env)

        return jsonify({
            "image_url": "/static/plot.png",
            "code_used": code
        })

    except KeyError as ke:
        # Handle missing column error
        print("Column error:", str(ke))
        return jsonify({
            "error": f"The dataset does not include column: {str(ke)}"
        }), 400

    except Exception as e:
        
        print("Error during plot generation:", str(e))
        return jsonify({
            "error": f"An error occurred: {str(e)}. "
                     f"Make sure you're using column names from the dataset."
        }), 500
@app.route("/refine", methods=["POST", "OPTIONS"])
def refine_plot():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight success"}), 200

    last_code = request.json.get("last_code")
    refinement_prompt = request.json.get("refinement")
    print("Received refinement prompt:", refinement_prompt)

    refine_system_message = """
    You are a Python data visualization assistant.

    Your task is to refine existing matplotlib chart code based on user feedback.

    - ONLY make changes related to the user’s new instructions.
    - DO NOT rewrite the entire script unless explicitly asked.
    - Assume df is preloaded.
    - Keep plt.figure() and plt.savefig() intact.
    - Return only Python code, no explanations.
    """

    user_message = f"""
    Here is the existing code:
    ```python
    {last_code}
    User refinement instruction:
    "{refinement_prompt}"
    """
    try:
        response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": refine_system_message},
            {"role": "user", "content": user_message},
        ],
        temperature=0.3,
    )

        refined_code = response.choices[0].message.content

        if refined_code.startswith("```"):
            refined_code = "\n".join(
                line for line in refined_code.splitlines() if not line.strip().startswith("```")
            )

        print("Refined GPT Code:\n", refined_code)

        plt.close("all")
        local_env = {"df": df, "pd": pd, "plt": plt}
        exec(refined_code, {}, local_env)

        return jsonify({
            "image_url": "/static/plot.png",
            "code_used": refined_code
        })

    except Exception as e:
        print("Error during refinement:", str(e))
        return jsonify({
            "error": f"An error occurred while refining the plot: {str(e)}"
        }), 500
if __name__ == "__main__":
    app.run(debug=True)
