from pymongo import MongoClient
from dotenv import load_dotenv
import os
import requests

load_dotenv() 

# MongoDB connection
DB_PASSWORD = os.environ.get('DB_PASSWORD')
CONNECTION_STRING = f"mongodb+srv://user54:{DB_PASSWORD}@cluster54.w4idyqf.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(CONNECTION_STRING)
db = client.data

def fetch_songs(valence, danceability, energy, tempo, margin=0.05):

    songs_collection = db.songs
    output = []

    # Define min and max values for each attribute with formatted string precision
    attribute_ranges = {
        "audio_features.danceability": (max(danceability - margin, 0), min(danceability + margin, 1)),
        "audio_features.energy": (max(energy - margin, 0), min(energy + margin, 1)),
        "audio_features.valence": (max(valence - margin, 0), min(valence + margin, 1)),
        "audio_features.tempo": ((max(tempo - margin, 0) ** 0.6) * 212.137, (min(tempo + margin, 1) ** 0.6) * 212.137),
    }

    # Construct the query
    query = {
        attribute: {"$gte": min_val, "$lte": max_val}
        for attribute, (min_val, max_val) in attribute_ranges.items()
    }

    # Execute the query
    matching_songs = songs_collection.find(query)
    
    songs_collection = db.song_data
    for song in matching_songs:
        id = song['id']
        song_data = songs_collection.find_one({'_id': id})
        if song_data:
            output.append(song_data)
    
    if len(output) < 10:
        return fetch_songs(valence, danceability, energy, tempo, margin + 0.05)
    else:
        return output if output else None

"""
def fetch_token():
    # Load environment variables from .env
    load_dotenv()

    client_id = os.environ['SPOTIFY_CLIENT_ID']
    client_secret = os.environ['SPOTIFY_CLIENT_SECRET']

    # Obtain the access token
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        'grant_type': 'authorizaion_code',
        'client_id': client_id,
        'client_secret': client_secret
    }

    response = requests.post(url, headers=headers, data=data)

    if response.status_code == 200:
        token = response.json().get('access_token')
    else:
        print(f"Failed to retrieve token. Status code: {response.status_code}")
        print(response.text)
        exit()
"""

def copy_to_new_collection():
    db = client.data
    
    # Fetch all data from the song_data collection
    song_data_collection = db.songs
    all_data = list(song_data_collection.find({}))

    # Insert data into the new collection
    song_data_backup_collection = db.songs_backup
    try:
        song_data_backup_collection.insert_many(all_data, ordered=False)
    except:
        pass

    print("Data copied successfully!")


def remove_duplicates(collection):
    # Fetch all distinct 'id' values
    unique_ids = collection.distinct('id')

    for unique_id in unique_ids:
        # Find one occurrence and skip it
        keeper = collection.find_one({'id': unique_id})

        if keeper:
            # Delete other occurrences
            collection.delete_many({'_id': {'$ne': keeper['_id']}, 'id': unique_id})
