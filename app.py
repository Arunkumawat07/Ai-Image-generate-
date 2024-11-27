from flask import Flask, request, jsonify, render_template
import requests
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()
    if not response.content:
        raise ValueError("No content returned from Hugging Face API")
    return response.content

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get("prompt")
        n = data.get("n", 1)

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Call Hugging Face API
        image_bytes = query({"inputs": prompt})

        # Convert the byte content into a PIL Image
        image = Image.open(io.BytesIO(image_bytes))

        # Save the image to the static folder
        image_path = "static/generated_image.png"
        image.save(image_path)

        return jsonify({"image_url": f"/static/generated_image.png"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
