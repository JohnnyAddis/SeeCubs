import os
from dotenv import load_dotenv
#load_dotenv(override=True)
load_dotenv(dotenv_path=".env", override=True)

key = os.getenv("OPENAI_API_KEY")
print("Loaded Key:", key)