var fs = require('fs-extra');
var path=require('path');
var Midi = require('jsmidgen');
var Util = require('jsmidgen').Util;
var mm = require('./MusicMaker')
var LowerBound=3;
var UpperBound=6;
//var Random = require('random-js')

var beat = 128;
var DrumNotes = mm.DrumNotes;
var selectRandom = mm.SelectRandom;
var makeChord = mm.MakeChord;
var addRhythmPattern = mm.AddRhythmPattern;
var ChordType = mm.ChordType;


class DemoPatterns {
    AddPickingPattern_4_1(track, aChord) {
        var intRoot = aChord[0];
        var intMiddle = aChord[1];
        var intFifth = aChord[2];

        track.addNote(0, intRoot, beat)
        track.addNote(0, intFifth, beat)
        track.addNote(0, intMiddle, beat)
        track.addNote(0, intFifth, beat)
    }

    AddPickingPattern_4_2(track, aChord) {
        var intRoot = aChord[0];
        var intNine = aChord[0] + 2;
        var intMiddle = aChord[1];
        var intFifth = aChord[2];
        var intRoot2 = aChord[0] + 12;
        var intNine2 = aChord[0] + 2 + 12;
        var intMiddle2 = aChord[1] + 12;
        var intFifth2 = aChord[2] + 12;

        track.addNote(0, intRoot, beat / 2)
        track.addNote(0, intNine, beat / 2)
        track.addNote(0, intMiddle, beat / 2)
        track.addNote(0, intFifth, beat / 2)

        track.addNote(0, intRoot2, beat / 2)
        track.addNote(0, intNine2, beat / 2)
        track.addNote(0, intMiddle2, beat / 2)
        track.addNote(0, intFifth2, beat / 2)
    }

    AddPickingPattern_4_3(track, aChord) {
        var intRoot = aChord[0];
        var intMiddle = aChord[1];
        var intFifth = aChord[2];
        var intRoot2 = aChord[0] + 12;
        var intMiddle2 = aChord[1] + 12;
        var intFifth2 = aChord[2] + 12;

        var list = new Array();
        list.push(intRoot);
        list.push(intMiddle);
        list.push(intFifth);
        list.push(intRoot2);
        list.push(intMiddle2);
        list.push(intFifth2);

        var i;
        for (i = 0; i < 8; i++) {
            var aNote = selectRandom(list);
            track.addNote(0, aNote, beat / 2);
        }

    }

    AddPickingPattern_4_4(track, aChord) {
        var intRoot = aChord[0] - 24;
        track.addNote(0, intRoot, beat * 3)
        track.addNote(0, intRoot, beat * 1)
    }

    AddPickingPattern_4_5(track, aChord) {
        var intRoot = aChord[0];
        var nine1 = aChord[0] + 2;
        var intMiddle = aChord[1];
        var intFifth = aChord[2];
        var intRoot2 = aChord[0] + 12;
        var nine2 = nine1 + 12;
        var intMiddle2 = aChord[1] + 12;
        var intFifth2 = aChord[2] + 12;

        var list = new Array();
        list.push(intRoot);
        list.push(nine1);
        list.push(nine2);
        list.push(intMiddle);
        list.push(intFifth);
        list.push(intRoot2);
        list.push(intMiddle2);
        list.push(intFifth2);

        var i;
        for (i = 0; i < 16; i++) {
            var aNote = selectRandom(list);
            track.addNote(0, aNote, beat / 4);
        }

    }

}

function deleteAllFilesIn(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      // delete file
      fs.unlinkSync(curPath);
    });
  }
}


function demo1() {
    deleteAllFilesIn('./midi');
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('scores_calculated.txt')
      });
      var count=0;
    lineReader.on('line', function (contents) {
        
        var chordList = new Array();
    
       count++;
    
       var file = new Midi.File();
    
    var tab=contents.split("\t");


    console.log(tab[0]);

    var track = new Midi.Track();
    var emotion,extent;
    if(parseFloat(tab[0])>=UpperBound){
        emotion="happy";
    }

    else if(parseFloat(tab[0])<=LowerBound){
        emotion="sad";
    }

   else{
        emotion="neutral";
    }
    if(parseFloat(tab[1])>=UpperBound){
        extent="high";
    }
    else if(parseFloat(tab[1])<=LowerBound){
        extent="low";
    }

   else{
        extent="medium";
    }

    //happy
    if(emotion=="happy")
    {    
        if(extent=="high")
            track.setTempo(100);
        else if(extent=="medium")
            track.setTempo(85);
        else if(extent=="low")
            track.setTempo(70);
    chordList.push(makeChord("d4", ChordType.Major));
    chordList.push(makeChord("a4", ChordType.Major));
    chordList.push(makeChord("g4", ChordType.Major));
    chordList.push(makeChord("b4", ChordType.Minor));
    chordList.push(makeChord("e4", ChordType.Minor));
    chordList.push(makeChord("d4", ChordType.Major));
    chordList.push(makeChord("b4", ChordType.Minor));
    chordList.push(makeChord("f#4", ChordType.Minor));
    }


    //sad
    else if(emotion=="sad")
    {

    console.log("sad");
    if(extent=="high")
    {
        track.setTempo(70);
    }
    else if(extent=="medium")
        track.setTempo(85);
    else if(extent=="low")
        track.setTempo(60);
    chordList.push(makeChord("d4", ChordType.Minor));
    chordList.push(makeChord("a4", ChordType.Major));
    chordList.push(makeChord("d4", ChordType.Minor));
    chordList.push(makeChord("c4", ChordType.Major));
    chordList.push(makeChord("f4", ChordType.Major));
    chordList.push(makeChord("c4", ChordType.Major));
    chordList.push(makeChord("d4", ChordType.Minor));
    chordList.push(makeChord("a4", ChordType.Major));  
    }


    //neutral
    else if(emotion=="neutral"){
        if(extent=="high")
            track.setTempo(100);
        else if(extent=="medium")
            track.setTempo(85);
        else if(extent=="low")
            track.setTempo(30);        
        chordList.push(makeChord("d4", ChordType.Major));
        chordList.push(makeChord("a4", ChordType.Major));
        chordList.push(makeChord("g4", ChordType.Major));
        chordList.push(makeChord("b4", ChordType.Minor));
        chordList.push(makeChord("e4", ChordType.Minor));
        chordList.push(makeChord("d4", ChordType.Major));
        chordList.push(makeChord("b4", ChordType.Minor));
        chordList.push(makeChord("f#4", ChordType.Minor));


        }
    

  
   
    // track ================================================================================
    let patterns = new DemoPatterns();
    
    file.addTrack(track);
    track.setInstrument(8);
    if(emotion!="neutral"){
    
    var j = 0;
    if(!(emotion=="sad" && extent=="high")){
        
        for (j = 0; j < chordList.length; j++) {
            console.log(emotion+extent);
        patterns.AddPickingPattern_4_3(track, chordList[Math.floor(Math.random()*chordList.length)]);
      }
    }

      // track ================================================================================

      track = new Midi.Track();
      file.addTrack(track);
      track.setInstrument(2);

      for (j = 0; j < chordList.length; j++) {
        // patterns.AddPickingPattern_4_2(track, chordList[j]);
      }

    // track ================================================================================
    if(emotion=="happy" && extent!="low")
    {
    track = new Midi.Track();
    file.addTrack(track);
    track.setInstrument(2);
    for (j = 0; j < chordList.length; j++) {

        patterns.AddPickingPattern_4_5(track, chordList[Math.floor(Math.random()*chordList.length)]);
    }
    }
    else if(emotion=="sad" && extent=="high")
    {
        
        for (j = 0; j < chordList.length ; j++) {
            patterns.AddPickingPattern_4_4(track, chordList[Math.floor(Math.random()*chordList.length)]);
    }
    var i=6
    while(i>0){
    track = new Midi.Track();
    file.addTrack(track);
    track.setInstrument(2);
        for (j = 0; j < chordList.length ; j++) {
            patterns.AddPickingPattern_4_4(track, chordList[Math.floor(Math.random()*chordList.length)]);
    }
    i--;
}

    track = new Midi.Track();
    file.addTrack(track);
    track.setInstrument(2);
        for (j = 0; j < chordList.length ; j++) {
            patterns.AddPickingPattern_4_3(track, chordList[Math.floor(Math.random()*chordList.length)]);
    }

    }
  
    // track ================================================================================
    }
    

    //happy drums
    if(emotion=="happy" && extent!="low")
    {  
    var track = new Midi.Track();
    file.addTrack(track);
    let i = 0;
       
    for (i = 0; i < chordList.length; i++) {
        track.addNote(9, DrumNotes.BassDrum1, beat);
        track.addNote(9, DrumNotes.SnareDrum, beat);
        track.addNote(9, DrumNotes.BassDrum1, beat);
        track.addNote(9, DrumNotes.SnareDrum, beat);
    }
   
    if(emotion=="happy" && extent!="low")
    {  

    track = new Midi.Track();
    file.addTrack(track);

        
    for (i = 0; i < chordList.length; i++) {
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
        track.addNote(9, DrumNotes.ClosedHighHat, beat / 2);
    }
    } 
    }


    //neutral music
    if(emotion=="neutral" && extent=="low"){

        var track = new Midi.Track();
        file.addTrack(track);
        let i = 0;
           
        for (i = 0; i < chordList.length; i++) {
            track.addNote(9, DrumNotes.BassDrum1, beat);
            track.addNote(9, DrumNotes.SnareDrum, beat);
            track.addNote(9, DrumNotes.BassDrum1, beat);
            track.addNote(9, DrumNotes.SnareDrum, beat);
        }
       
    }

        if(emotion=="neutral" && extent=="high"){

            var track = new Midi.Track();
            file.addTrack(track);
            var chordList = new Array();

            // setup chord progression
            chordList.push(new mm.ChordChange(mm.MakeChord("e4", mm.ChordType.Minor),4));
            chordList.push(new mm.ChordChange(mm.MakeChord("c4", mm.ChordType.Major),4));
            chordList.push(new mm.ChordChange(mm.MakeChord("d4", mm.ChordType.Major),4));
            chordList.push(new mm.ChordChange(mm.MakeChord("c4", mm.ChordType.Major),4));
            
            chordPlayer = new mm.BassPLayer1
            console.log("here");
            chordPlayer.PlayFromChordChanges(track, chordList, 0);
            chordPlayer.PlayFromChordChanges(track, chordList, 0);
        var track = new Midi.Track();
        file.addTrack(track);
        let i = 0;
           
        for (i = 0; i < chordList.length; i++) {
            track.addNote(9, DrumNotes.BassDrum1, beat);
            track.addNote(9, DrumNotes.SnareDrum, beat);
            track.addNote(9, DrumNotes.BassDrum1, beat);
            track.addNote(9, DrumNotes.SnareDrum, beat);
        }
        }


        if(emotion=="neutral" && extent=="medium"){

            var track = new Midi.Track();
            file.addTrack(track);
            var chordList = new Array();

            // setup chord progression
            chordList.push(new mm.ChordChange(mm.MakeChord("e4", mm.ChordType.Minor),4));
            chordList.push(new mm.ChordChange(mm.MakeChord("c4", mm.ChordType.Major),4));
            chordList.push(new mm.ChordChange(mm.MakeChord("d4", mm.ChordType.Major),4));
            chordList.push(new mm.ChordChange(mm.MakeChord("c4", mm.ChordType.Major),4));
            
            chordPlayer = new mm.BassPLayer1
            console.log("here");
            chordPlayer.PlayFromChordChanges(track, chordList, 0);
            chordPlayer.PlayFromChordChanges(track, chordList, 0);

            var track = new Midi.Track();
            file.addTrack(track);
            chordPlayer = new mm.OffBeatPlayer
            chordPlayer.PlayFromChordChanges(track, chordList, 0);
            chordPlayer.PlayFromChordChanges(track, chordList, 0);

            var track = new Midi.Track();
            file.addTrack(track);
            chordPlayer = new mm.RandomPlayer
            chordPlayer.PlayFromChordChanges(track, chordList, 0);
            chordPlayer.PlayFromChordChanges(track, chordList, 0);


      
        }

        if(emotion=="neutral" && extent!="medium"){

            var DrumNotes1 = mm.DrumNotes;
            var addRhythmPattern = mm.AddRhythmPattern;
        for (j = 0; j < chordList.length; j++) { 
    
            mm.AddRhythmPattern(track, "x-x-x-x-x-x-x-x-", mm.DrumNotes.ClosedHighHat);
           // addRhythmPattern(track, "x-x-|x-x-|xxx-|x-xx");
        }
    }

      var dir="midi";
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      fs.writeFileSync("./midi/test" + count + ".midi", file.toBytes(), 'binary');
      
    });
}

demo1();
