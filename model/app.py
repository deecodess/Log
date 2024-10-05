from transformers import pipeline
from flask import Flask, request, jsonify

app = Flask(__name__)

generator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

@app.route('/generate', methods=['POST'])
def generate_text():
    input_data = request.json
    prompt = input_data['prompt']
    
    result = generator(prompt, max_length=50, num_return_sequences=1)
    return jsonify(result[0])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
