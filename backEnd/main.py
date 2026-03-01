from google import genai
from pydantic import BaseModel
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

class PopulationResponse(BaseModel):
    labels: list[str]
    values: list[int]
    extinction_level: str

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

def requestGemini(location, animal, timeframe, whatIf):
    try:
        whatIfPrompt = f"Consider the following what-if scenario: {whatIf}\n" if whatIf else ""

        prompt = (
            f"Predict the population of {animal} in {location} over {timeframe}. "
            f"Provide the historical/projected population data for the graph. "
            f"Also, determine the predicted extinction level for this animal in this specific region. "
            f"Extinction level must be one of: 'Not Evaluated', 'Safe', 'Near Threatened', "
            f"'Vulnerable', 'Endangered', 'Critically Endangered', 'Extinct'."
        )
        
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=whatIfPrompt + prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": PopulationResponse,
            }
        )

        responseDict = response.parsed.model_dump()
        print(f"**main.py** - INFO - AI Response: {responseDict}")
        return responseDict
    except Exception as e:
        print(f"**main.py** - ERROR - Failed to get response from Gemini API: {e}")
        raise
    
@app.route("/ai-response", methods=["POST"])
def getAIResponse():
    try:
        promptData = request.get_json()
        location, animal, timeframe, whatIf = promptData.get("location"), promptData.get("animal"), promptData.get("timeframe"), promptData.get("whatIf")
        print(f"**main.py** - INFO - Prompt Data: {promptData}")
    except Exception:
        print(f"**main.py** - ERROR - Failed to parse request JSON: {promptData}")
        raise

    result = requestGemini(location, animal, timeframe, whatIf)
    return jsonify({"response": result})

if __name__ == "__main__":
    app.run(port="2497")