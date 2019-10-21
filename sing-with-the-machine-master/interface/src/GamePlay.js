import React, { Component } from 'react';
import './GamePlay.css';

import { loadMidiFileFromServer } from './loadFile';

import { Button, Card, CardText } from 'react-md';

import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

class GamePlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentChunkIdx: 0,
      transitioning: false,
      chunksToDisplay: [this.props.chunks[0]],
    };

    this.startPlayer = this.startPlayer.bind(this);

    this.pianoInstrument = null;
    this.bassInstrument = null;
    this.percussionInstrument = null;
    this.ac = new AudioContext();
    const loadPianoPromise = Soundfont.instrument(this.ac, '/acoustic_grand_piano.js').then((instrument) => {
      this.pianoInstrument = instrument;
    });
    const loadBassPromise = Soundfont.instrument(this.ac, '/acoustic_bass.js').then((instrument) => {
      this.bassInstrument = instrument;
    });
    const loadPercussionPromise = Soundfont.instrument(this.ac, '/woodblock.js').then((instrument) => {
      this.percussionInstrument = instrument;
    });

    loadPianoPromise
      .then(() => loadBassPromise)
      .then(() => loadPercussionPromise)
      .then(() => {
        loadMidiFileFromServer('test1.midi')
          .then((data) => {
            this.midiData = data;
            this.startPlayer(data);
          })
          .catch((error) => {
            console.log(error);
            console.log("Error getting MIDI file from server");
          });
      });

    this.advanceToNextChunk = this.advanceToNextChunk.bind(this);
  }

  startPlayer(data) {
    if (this.player && this.player.isPlaying()) {
      this.player.stop();
    }

    this.player = new MidiPlayer.Player((event) => {
      if (event.name === 'Note on') {
        // console.log(event);
        // if (event.track === 1 || event.track === 2) {
        //   this.pianoInstrument.play(event.noteName, this.ac.currentTime, {gain:event.velocity/100});
        // } else if (event.track === 3 || event.track === 4) {
        //   this.bassInstrument.play(event.noteName, this.ac.currentTime, {gain:event.velocity/100});
        // } else {
        //   this.percussionInstrument.play(event.noteName, this.ac.currentTime, {gain:event.velocity/100});
        // }
        this.pianoInstrument.play(event.noteName, this.ac.currentTime, {gain:event.velocity/100});
      }
    });

    this.player.on('endOfFile', () => {
      console.log('end of file reached');
      this.startPlayer(this.midiData);
    });

    this.player.loadArrayBuffer(data);
    this.player.play();
  }

  advanceToNextChunk() {
    console.log(this.state.chunksToDisplay);
    // TODO show loading symbol on interface
    this.setState({
      transitioning: true,
    });

    // load the next MIDI file
    loadMidiFileFromServer('test' + (this.state.currentChunkIdx + 2) + '.midi')
      .then((data) => {
        this.midiData = data;
        // logic for ending the current Midi loop and starting the next piece of music
        // when the end of the current MIDI file is reached
        // this.player.on('endOfFile', () => {
          // load the new data and start it
          this.startPlayer(data);

          const newArr = this.state.chunksToDisplay.slice();
          newArr.push(this.props.chunks[this.state.currentChunkIdx + 1]);

          // update the text in the UI
          this.setState({
            currentChunkIdx: this.state.currentChunkIdx + 1,
            transitioning: false,
            chunksToDisplay: newArr,
          });
        // });
      })
      .catch((error) => {
        console.log("Error getting MIDI file from server");

        const newArr = this.state.chunksToDisplay.slice();
        newArr.push(this.props.chunks[this.state.currentChunkIdx]);

        this.setState({
          currentChunkIdx: this.state.currentChunkIdx + 1,
          transitioning: false,
          chunksToDisplay: newArr,
        });
      });

  }

  render() {
    return (
      <div id="game-play" className="GamePlay">
        {
          this.state.chunksToDisplay.map((chunk, idx) => {
            return <div className="chunk" key={chunk.lastSentenceIdx}>
              <Card style={{width: 500}}>
                <CardText>
                  {
                    (() => {
                      console.log("current chunk idx: " + this.state.currentChunkIdx);
                      let firstSentenceIdx = 0;
                      if (idx > 0) { // if not the first chunk
                        const previousChunk = this.state.chunksToDisplay[idx - 1].lastSentenceIdx;
                        firstSentenceIdx = previousChunk + 1;
                      }

                      let lastSentenceIdx = chunk.lastSentenceIdx;
                      if (idx === this.props.chunks.length - 1) { // if the last chunk
                        lastSentenceIdx--;
                      }

                      console.log("sentence indices: " + firstSentenceIdx + " " + lastSentenceIdx);

                      let sentencesToDisplay = "";
                      for (let i = firstSentenceIdx; i <= lastSentenceIdx; i++) {
                        sentencesToDisplay += this.props.sentences[i] + ". ";
                      }

                      return sentencesToDisplay;
                    })()
                  }
                </CardText>
                {
                  // only display the "Next" button if there is a next chunk and this is the current chunk
                  this.state.currentChunkIdx + 1 < this.props.chunks.length && this.state.currentChunkIdx === idx ?
                  <Button secondary raised onClick={this.advanceToNextChunk}>{this.state.transitioning ? "Transitioning..." : "Next"}</Button> :
                  ""
                }
              </Card>
              <Card style={{width: 500}}>
                {/* This was not implemented yet. */}
                <CardText>
                  Valence: {chunk.valence}
                  <br/>
                  Arousal: {chunk.arousal}
                  <br/>
                  Dominance: {chunk.dominance}
                </CardText>
              </Card>
            </div>;
          })
        }


      </div>
    );
  }
}

export default GamePlay;
