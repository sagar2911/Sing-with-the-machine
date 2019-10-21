import React, { Component } from 'react';
import './App.css';

import Welcome from './Welcome';
import GamePlay from './GamePlay';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoadedFile: false,
      playing: false,
      chunks: [],
      sentences: [],
    };

    // bind all the functions
    this.handleFileInput = this.handleFileInput.bind(this);
    this.play = this.play.bind(this);
  }

  handleFileInput(filename, text) {
    console.log(filename, text);
    let sentences = text.split(". ");
    sentences = sentences.filter((sentence) => sentence.length > 0);
    console.log(sentences);
    console.log("num sentences: " + sentences.length);
    this.setState({
      hasLoadedFile: true,
      loadedFilename: filename,
      sentences: sentences,
    });
  }

  play() {
    fetch('/generateMusic', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({sentences: this.state.sentences}),
    })
      .then((resp) => resp.json())
      .then((json) => {
        console.log("Music has been generated");
        console.log(json);
        this.setState({
          playing: true,
          chunks: json.chunks,
        });
      })
      .catch((error) => {
        console.log("There was an error");
        this.setState({
          playing: true,
          chunks: [
            {
              valence: Math.random() * 9,
              arousal: Math.random() * 9,
              dominance: Math.random() * 9,
              lastSentenceIdx: 4,
            },
            {
              valence: Math.random() * 9,
              arousal: Math.random() * 9,
              dominance: Math.random() * 9,
              lastSentenceIdx: 5,
            },
            {
              valence: Math.random() * 9,
              arousal: Math.random() * 9,
              dominance: Math.random() * 9,
              lastSentenceIdx: 7,
            },
            {
              valence: Math.random() * 9,
              arousal: Math.random() * 9,
              dominance: Math.random() * 9,
              lastSentenceIdx: 8,
            },
            {
              valence: Math.random() * 9,
              arousal: Math.random() * 9,
              dominance: Math.random() * 9,
              lastSentenceIdx: 10,
            },
            {
              valence: Math.random() * 9,
              arousal: Math.random() * 9,
              dominance: Math.random() * 9,
              lastSentenceIdx: 12,
            }
          ],
        });
      });
  }

  render() {
    return (
      <div className="App">
        {
          !this.state.playing ?
          <Welcome fileHandler={this.handleFileInput} play={this.play} loadedFilename={this.state.loadedFilename} hasLoadedFile={this.state.hasLoadedFile}/> :
          <GamePlay chunks={this.state.chunks} sentences={this.state.sentences} />
        }

      </div>
    );
  }
}

export default App;
