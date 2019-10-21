#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr  1 18:18:16 2019

@author: amberraza
"""
import math
import json
import os
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import PorterStemmer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


def find_sentiment(sentences1):
    sentences2 = ["I got fired today and my dog dead and my mother is angry with me",
                  "Maybe I should just go back to bed",
                  "I am excited, happy and happy",
                  "sad angry"
                  ]
    ps = PorterStemmer()
    # open the ANEW json file having the words and values
    with open('data.json') as json_file:
        data = json.load(json_file)
        # overall list for maintaining the valence mean and SD for every sentence
        valence_tracker = []
        # overall list for maintaining the arousal mean and SD for every sentence
        arousal_tracker = []
        # overall list for maintaining the dominance mean and SD for every sentence
        dominance_tracker = []
        for sentence in sentences1:
            # break down the sentence into words to look them in the words dictionary
            words = word_tokenize(sentence)
            # list of avg and SD corresponding to different words in the sentence.
            list_avgSD_valence = []
            list_avgSD_arousal = []
            list_avgSD_dominance = []
            # look up the words in our dictionary
            for word in words:
                try:
                    avgSD_valence = []
                    avgSD_valence.append(data[word]['valenceMean'])
                    avgSD_valence.append(data[word]['valenceSD'])
                    avgSD_valence_prev = avgSD_valence
                    avgSD_arousal = []
                    avgSD_arousal.append(data[word]['arousalMean'])
                    avgSD_arousal.append(data[word]['arousalSD'])
                    avgSD_dominance = []
                    avgSD_dominance.append(data[word]['dominanceMean'])
                    avgSD_dominance.append(data[word]['dominanceSD'])
                    list_avgSD_valence.append(avgSD_valence)
                    list_avgSD_arousal.append(avgSD_arousal)
                    list_avgSD_dominance.append(avgSD_dominance)
                except:
                    #add the logic to look up stemmed words in case the actual word is not found in the dictionary
                    try:
                        stem_word = ps.stem(word)
                        avgSD_valence = []
                        avgSD_valence.append(data[stem_word]['valenceMean'])
                        avgSD_valence.append(data[stem_word]['valenceSD'])
                        avgSD_valence_prev = avgSD_valence
                        avgSD_arousal = []
                        avgSD_arousal.append(data[stem_word]['arousalMean'])
                        avgSD_arousal.append(data[stem_word]['arousalSD'])
                        avgSD_dominance = []
                        avgSD_dominance.append(data[stem_word]['dominanceMean'])
                        avgSD_dominance.append(data[stem_word]['dominanceSD'])
                        list_avgSD_valence.append(avgSD_valence)
                        list_avgSD_arousal.append(avgSD_arousal)
                        list_avgSD_dominance.append(avgSD_dominance)
                        print('stemmed word----->',word, stem_word)
                    except:
                        pass
                pass
            #in case the none of the word in a sentence is found in our ANEW dictionary, we use the vader sentiment library to generate a valence score
            if(len(list_avgSD_dominance)<1):
                vader_val = []
                vader_val.append(calculate_from_vader(sentence))
                #we keep the SD for that valence as 1
                vader_val.append(1)
                #append it to our list for further calculations
                list_avgSD_valence.append(vader_val)

            wtd_valence = weighted_average(list_avgSD_valence)
            wtd_arousal = weighted_average(list_avgSD_arousal)
            wtd_dominance = weighted_average(list_avgSD_dominance)

            valence_tracker.append(wtd_valence)
            arousal_tracker.append(wtd_arousal)
            dominance_tracker.append(wtd_dominance)
        calculate_moving_average(valence_tracker, arousal_tracker, dominance_tracker)

#calculating moving average for each sentence and getting the weighted average for the three dimensions
def calculate_moving_average(valence_tracker, arousal_tracker, dominance_tracker):
    scoreFile = open('scores_calculated.txt', 'w')
    #get the weighted average for the first sentence on 3 dimensions
    moving_vector = weighted_average([valence_tracker[0], arousal_tracker[0], dominance_tracker[0]])
    #get the individual dimensions to write to output file.
    valence_current = valence_tracker[0]
    arousal_current = arousal_tracker[0]
    dominance_current = dominance_tracker[0]
    counter = 1
    for i in range(1, len(valence_tracker)):
        #get the weighted average of the current sentence
        second_vector = weighted_average([valence_tracker[i], arousal_tracker[i], dominance_tracker[i]])
        print('vectors---->',moving_vector, second_vector)
        #write to the file if it exceeds the threshold value.
        if (abs(moving_vector[0] - second_vector[0]) > 1 or counter >= 10):
            counter = 0
            scoreFile.write(str(round(valence_current[0], 2)) + '\t' + str(round(arousal_current[0], 2)) + '\t' + str(
                round(dominance_current[0], 2)) + '\t' + str(i) + '\n')
            valence_current = valence_tracker[i]
            arousal_current = arousal_tracker[i]
            dominance_current = dominance_tracker[i]
            moving_vector = second_vector
        else:
            valence_current = weighted_average([valence_current, valence_tracker[i]])
            arousal_current = weighted_average([arousal_current, arousal_tracker[i]])
            dominance_current = weighted_average([dominance_current, dominance_tracker[i]])
            moving_vector = weighted_average([moving_vector, second_vector])
        counter += 1
    scoreFile.write(str(round(valence_current[0], 2)) + '\t' + str(round(arousal_current[0], 2)) +
        '\t' + str(round(dominance_current[0], 2)) + '\t' + str(len(valence_tracker)) + '\n')
    o = os.popen('node app.js', 'r', 1)
    print(o)


def weighted_average(arr):
    pi_2 = math.sqrt(2.0 * math.pi)
    avg = 0.0
    var = 0.0
    prob_sum = 0.0
    prob = []
    a = []

    for i in range(0, len(arr)):
        if (arr[i][0] > 0 and arr[i][1] > 0):
            # estimate the probability that the word falls exactly at the mean
            p = 1.0 / (arr[i][1] * pi_2)
            prob_sum += p
            prob.append(p)
            a.append(arr[i])

    # compute a weighted average with probabilities as weights
    for i in range(0, len(prob)):
        avg += ((prob[i] / prob_sum) * a[i][0])
        var += (math.pow((prob[i] / prob_sum) * a[i][1], 2))

    return [avg, math.sqrt(var)]

def calculate_from_vader(sentence):
    analyzer = SentimentIntensityAnalyzer()
    vs = analyzer.polarity_scores(sentence)
    #since the vaderSentiment returns a compound valence between -1 and 1; we normalize it to the scale of 1 to 9(plus 1, multiply by 4 and then add 1).
    normalized = ((vs['compound']+1)*(4)+1)
    return normalized

def dummy():
    sentences = "A Shepherd Boy tended his master's Sheep near a dark forest not far from the village. Soon he found life in the pasture very dull. All he could do to amuse himself was to talk to his dog or play on his shepherd's pipe. One day as he sat watching the Sheep and the quiet forest, and thinking what he would do should he see a Wolf, he thought of a plan to amuse himself. His Master had told him to call for help should a Wolf attack the flock, and the Villagers would drive it away. So now, though he had not seen anything that even looked like a Wolf, he ran toward the village shouting at the top of his voice, \"Wolf! Wolf!\" As he expected, the Villagers who heard the cry dropped their work and ran in great excitement to the pasture. But when they got there they found the Boy doubled up with laughter at the trick he had played on them. A few days later the Shepherd Boy again shouted, \"Wolf! Wolf!\" Again the Villagers ran to help him, only to be laughed at again. Then one evening as the sun was setting behind the forest and the shadows were creeping out over the pasture, a Wolf really did spring from the underbrush and fall upon the Sheep. In terror the Boy ran toward the village shouting \"Wolf! Wolf!\" But though the Villagers heard the cry, they did not run to help him as they had before. \"He cannot fool us again,\" they said.  The Wolf killed a great many of the Boy's sheep and then slipped away into the forest. I feel unhappy, sad and want to cry. This is good, better and happy."
    sentences1 = "Hello Parimit Mama, Over the weekend, I have used the Dusty Roads app for some time. Here're some honest observations and feedback as a neutral user: - The social log in to app is seamless and works well. - The app introduction screens that come on after login however, don't scale right and look blurry/stretched. I am running on phone (S9+) with 18.5:9 aspect ratio for reference. - After the intro splash screens, the same instructions are repeated again. I feel this is redundant intro. - The home UI after login looks rich and informative. - Bottom navigation bar is too small for operation. (At least on my screen.) - Maybe it's just me - but the UI to add new trip looks a bit confusing and cluttered. There are many elements on screen to get distracted. I understand and agree that to accommodate all the features, UI can't be made more simpler. - It took me a while to figure out that I need to hit compile in order to publish the Travelogue. - The Google Maps overlay besides trip header photo appears to be rendering in low resolution, and stretched again. - Just got notification about Your Memory video feature. It's very cool!- I moved to browse travelogue section next. The search feature worked well for Mumbai to Goa trip. After clicking on a trip, the image resolution and stretching issue still become apparent. The header image was very low resolution and stretched weirdly. The travelogue I found was immaculately informative. On the other hand, I was intimidated by too much information all over screen. There were many many UI elements which made grasping the information a hassle. I believe the UI requires some simplification. "
    sentences2 = sentences.split(". ")
    find_sentiment(sentences2)


if __name__ == "__main__":
    dummy()
