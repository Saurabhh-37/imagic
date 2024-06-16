from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

LLAMA_API_URL = "http://localhost:5002/api"  # URL of the llama.py API

@app.route('/')
def serve():
    return render_template("index.html")

@app.route('/api', methods=['POST'])
def api():
    user_text = request.json.get('text')

    # Make a POST request to the llama.py API
    response = requests.post(LLAMA_API_URL, json={'text': user_text})
    tts_response = response.json().get('tts_response')

    print(f"Received TTS response: {tts_response}")  # Print the received response

    return jsonify({'message': tts_response, 'tts_response': tts_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
