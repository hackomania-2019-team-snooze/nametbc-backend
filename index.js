"use strict";
const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");
const request = require("request");
const { Readable } = require("stream");
var ffmpeg = require('fluent-ffmpeg');

//Initialising firebase
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "nametbc-7539a.appspot.com"
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));
var database = firebase.firestore();

//Initialising google cloud storage
const { Storage } = require("@google-cloud/storage");
const projectId = "798213986507";
const storage = new Storage({
  projectId: projectId,
  keyFilename: "My First Project-047d8152a5fc.json"
});
// The name for the new bucket
const bucket = storage.bucket("nametbc");
var file = bucket.file("submissions/audio/audio.mp3");

//function to replace media file with given audio track
function mergeVideoAndAudio(video, audio) {
  fs.writeFileSync(video, "video.mp4");
  fs.writeFileSync(audio, "audio.wav");
  command.input("video.mp4")
  .input("audio.wav")
  .outputOptions([
      "-map 0:v",
      "-map 1:a",
      "-c:v copy",
      "-c:a aac",
      "-y"
  ])
  .output("output.mp4")
  .run();
  return fs.readFileSync("output.mp4");
}

//function to upload file from buffer to google cloud
function uploadFromMemory(buf, file) {
  var stream = new Readable();
  stream.push(buf);
  stream.push(null);
  stream.pipe(file.createWriteStream())
    .on('error', (err) => {
      console.log(err);
    })
    .on('finish', () => {
      console.log('Uploaded!');
    });
}

//uploads audio data to API audio transcriber.
//event emitter, look out for 'data' to retrieve response
function parseAudioData(data) {
  let url = "http://52.163.240.180/client/dynamic/recognize";
  return request.put(url, { body: data });
}
var videoarr = [];

app.get("/dailyvideos", function(req, res) {
  videoarr = [];
  var collection = database.collection("video");
  collection.get().then(snapshot => {
    snapshot.forEach(data => {
      videoarr.push({ name: data.id, url: data.data().videourl });
      // console.log(
      //   "current array :" + util.inspect(videoarr, false, null, true)
      // );
    });
    res.send(videoarr);
  });
  
});


app.get("/videofeed", function(req, res) {
  videoarr = [];
  var collection = database.collection("videoaudio");
  collection.get().then(snapshot => {
    snapshot.forEach(data => {
      videoarr.push({ name: data.data().user, likes: data.data().upvotearr, 
        dislikes:data.data().downvotearr, texturl:data.data().usertexturl , url: data.data().videourl });
      // console.log(
      //   "current array :" + util.inspect(videoarr, false, null, true)
      // );
    });
    res.send(videoarr);
  });
});
 

app.get("/history/:id", function(req, res) {
  videoarr = [];
  var requestedUser = req.params.id;
  var collection = database.collection("videoaudio");
  collection.get().then(snapshot => {
    snapshot.forEach(data => { if(requestedUser === data.data().user) {
      videoarr.push({ name: data.data().user, likes: data.data().upvotearr, 
        dislikes:data.data().downvotearr, texturl:data.data().usertexturl , url: data.data().videourl });
      }
      // console.log(
      //   "current array :" + util.inspect(videoarr, false, null, true)
      // );
    });
    res.send(videoarr);
  });
});