# sing-with-the-machine
A tool for generating music based on the mood of interactive narrative

### Assumptions
- You have Python 3 and Node 10 installed on your machine.

### To run everything:
1. Run `npm install` in the root directory.
2. Run `pip install -r requirements.txt` in the root directory.
3. Run the Python 3 interpreter.  In the interpreter type:
```
import nltk
nltk.download('punkt')
```
4. Exit the interpreter.
5. Change into the interface/ directory and run `npm run build` to generate all of the HTML and CSS files.
6. Change back into the root directory and run the program with the following command: `python flaskServer.py`.
7. Now you should be able to navigate to the web application at [http://localhost:5000/index.html](http://localhost:5000/index.html).
8. In the web application, upload a text file with a short story in it.
9. Click the 'Play' button.
10. Now you can click through the 'chunkified' text and enjoy the music that was generated.

### Libraries, Frameworks, Resources Used
#### Interface
- [React](https://reactjs.org/) - used for creating the interface
- [react-md](https://react-md.mlaursen.com/) - used for quickly styling the interface
- [MidiPlayerJS](https://github.com/grimmdude/MidiPlayerJS) - used to play MIDI files in the browser
- [Flask](http://flask.pocoo.org/) - used to communicate between the interface and backend

#### Sentiment Analysis
- [Natural Language Toolkit](http://www.nltk.org/) - used for word manipulation
- [Vader Sentiment Analysis](https://github.com/cjhutto/vaderSentiment) - used for getting missing valence values
- [ANEW Data](https://github.com/huginn/huginn/blob/master/data/anew.csv) - used for determining valence, arousal, and dominance values

#### Music Generation
- [jsmidigen](https://github.com/dingram/jsmidgen) - used for MIDI file music generation
