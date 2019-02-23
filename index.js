"use strict";
const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");
const request = require("request");
const { Readable } = require("stream");

//Initialising firebase
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "nametbc-7539a.appspot.com"
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));
var database = firebase.firestore().collection("video");

//Initialising google cloud storage
const { Storage } = require("@google-cloud/storage");
const projectId = "798213986507";
const storage = new Storage({
  projectId: projectId,
  keyFilename: "My First Project-047d8152a5fc.json"
});
// The name for the new bucket
const bucket = storage.bucket("nametbc");
var file = bucket.file("videos/audio.mp3");

//function to upload file from buffer to google cloud
function uploadFromMemory(buf) {
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