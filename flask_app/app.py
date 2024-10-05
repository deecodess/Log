from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import os

app = Flask(__name__)
CORS(app)

generator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

@app.route('/generate', methods=['POST'])
def generate_text():
    input_data = request.json
    prompt = input_data.get('prompt', '')

    print("Promptt:")
    print(prompt)

    try:
        result = generator(
            prompt,
            max_new_tokens=50,
            num_return_sequences=1,
            truncation=True
        )
        return jsonify({"generated_text": result[0]['generated_text']})
    except Exception as e:
        print("Errorrr :")
        print(str(e)) 
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
