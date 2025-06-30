from flask import Flask, request, jsonify
from gpt_handler import ask_gpt

app = Flask(__name__)

@app.route("/prompt", methods=["POST"])
def handle_prompt():
    data = request.get_json()
    user_prompt = data.get("prompt", "")
    gpt_response = ask_gpt(user_prompt)
    return jsonify({"response": gpt_response})

if __name__ == "__main__":
    app.run(debug=True)