#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Apr  9 15:49:07 2019

@author: amberraza
"""

from flask import Flask, send_from_directory, jsonify, request
import sentimentScore as sentimentScore

app = Flask(__name__, static_url_path='/interface/build')

@app.route("/generateMusic", methods=['POST'])
def generate_music():
    """
    Generates MIDI files based on the text given in the body.
    """
    # get the JSON body
    json = request.get_json(force=True)
    # get the sentences sent in the body
    sentences = json['sentences']
    # calculate scores for the sentences and chunkify them and write this to 'scores_calculated.txt'
    sentimentScore.find_sentiment(sentences)

    # gather the chunk data into a friendly format for the frontend
    chunks = []
    with open('./scores_calculated.txt') as score_file:
        lines = score_file.readlines()
        for line in lines:
            values = line.split("\t")
            valence = float(values[0])
            arousal = float(values[1])
            dominance = float(values[2])
            lastSentenceIdx = int(values[len(values) - 1])
            chunk = {
                'valence': valence,
                'arousal': arousal,
                'dominance': dominance,
                'lastSentenceIdx': lastSentenceIdx
            }
            chunks.append(chunk)

    # construct the response object and send it back to the client
    response = {
        'chunks': chunks
    }
    return jsonify(response)

@app.route('/<path:path>')
def get_static_files(path):
    """
    Returns static files.
    """
    if (path.endswith(".mid") or path.endswith(".midi")):
        return send_from_directory('midi', path)

    return send_from_directory('interface/build', path)

if __name__ == '__main__':
    # run it in debug mode
    app.run(debug=True)
