import React, { Component } from 'react';
import './Welcome.css';
import { loadFile } from './loadFile';

import { Button, FileInput, Card, CardText, CardTitle } from 'react-md';

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoadedFile: false,
      loadedFileName: ""
    };

    // bind all the functions
    this.handleFileInput = this.handleFileInput.bind(this);
  }

  handleFileInput(file) {
    console.log("Welcome handleFileInput");
    loadFile(file)
      .then((text) => {
        this.props.fileHandler(file.name, text);
      });
  }

  render() {
    return (
      <div id="welcome">
        <h1>Sing With The Machine</h1>

        <Card style={{maxWidth: 500}}>
          <CardTitle title="Welcome!" />
          <CardText>
            <p>
              This tool generates music for narratives. Simply load a text
              file and it will be parsed into mood chunks which will
              then have music generated for them. After that, press "Play"
              and start enjoying a musical piece set to match the exact text
              you're reading!
            </p>
            <h3>Load a text file</h3>
            <FileInput id="game-file" onChange={this.handleFileInput} name="images" secondary/>
            <br/>
            <label style={{marginTop: "40px",}}>{this.props.loadedFilename}</label>
            <br/>
            <br/>
            {
              this.props.hasLoadedFile ? <Button raised onClick={this.props.play} primary>Play</Button> : ""
            }
          </CardText>
        </Card>

      </div>
    );
  }
}

export default Welcome;
