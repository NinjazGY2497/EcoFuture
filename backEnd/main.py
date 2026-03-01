from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API
try:
    apiKey = os.getenv("API_KEY")
    client = genai.Client(api_key=apiKey)
except Exception:
    print(f"**main.py** - ERROR - Failed to initialize Gemini API client.")
    raise

# CORS allowed origins
ALLOWED_ORIGINS = ["http://127.0.0.1:5500", "http://localhost:5500", "https://ecofuture.pages.dev/"] # Remove localhost urls (in production)

app = Flask(__name__)

# Whitelist sites specified
CORS(app, resources={r"/ai-response": {"origins": ALLOWED_ORIGINS}})

def requestGemini(location, animal, timeframe):
    try:
        prompt = f"Predict the population of {animal} in {location} over {timeframe}. Return ONLY a JSON object with this structure: {{'labels': ['year1', 'year2'], 'values': [100, 200]}}. No text or explanations."
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        print(f"**main.py** - INFO - AI Response: {response.text}")
        return response.text
    except Exception:
        print(f"**main.py** - ERROR - Failed to get response from Gemini API.")
        raise
    
@app.route("/ai-response", methods=["POST"])
def getAIResponse():
    try:
        promptData = request.get_json()
        location, animal, timeframe = promptData.get("location"), promptData.get("animal"), promptData.get("timeframe")
        print(f"**main.py** - INFO - Prompt Data: {promptData}")
    except Exception:
        print(f"**main.py** - ERROR - Failed to parse request JSON: {promptData}")
        raise

    return jsonify({"response": requestGemini(location, animal, timeframe)})

if __name__ == "__main__":
    app.run(port="2497")