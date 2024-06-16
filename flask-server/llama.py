from flask import Flask, request, jsonify
import ollama

app = Flask(__name__)

@app.route('/api', methods=['POST'])
def api():
    message = request.json.get('text')
    print(f"Received message: {message}")

    response = ollama.chat(model='llama3', messages=[
        {
            'role': 'user',
            'content': message,
        },
    ])
    response_message = response['message']['content']
    print(response_message)

    return jsonify({'tts_response': response_message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
