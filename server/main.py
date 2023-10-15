from flask import Flask, request, jsonify
from flask_cors import CORS
from apiParser import apiParser  
from spotify import fetch_songs
from dotenv import load_dotenv
import os

app=Flask(__name__)

CORS(app)

load_dotenv()

client_id = os.environ['SPOTIFY_CLIENT_ID']
client_secret = os.environ['SPOTIFY_CLIENT_SECRET']

@app.route('/api/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    search_query = request.form.get('search_query', '')
    open_ai_scores = apiParser.testApi(search_query)
    results = fetch_songs(*open_ai_scores.values())
   
    return jsonify(results)


@app.route('/api/auth/token', methods=['GET'])
def get_token():
    token = fetch_token()
    return token


if __name__=='__main__':
    app.run()
