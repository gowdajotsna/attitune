from pymongo import MongoClient
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
import random

app=Flask(__name__)
CORS(app)

with open('playlist.json','r') as json_file:
    songs=json.load(json_file)

print(songs[0]['artist_names'])

@app.route('/api/playlists',methods=['GET'])
def get_playlistData():
    return jsonify(songs)

    
   