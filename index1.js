"use strict";
const express = require("express");
const app = express();
const port = 8080;
const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");
const util = require("util");
const { Storage } = require("@google-cloud/storage");

// Your Google Cloud Platform project ID
const projectId = "798213986507";

// Creates a client
const storage = new Storage({
  projectId: projectId,
  keyFilename: "My First Project-047d8152a5fc.json"
});

// The name for the new bucket
const bucketName = "nametbc";
const bucket = storage.bucket(bucketName);

//Initialising firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://nametbc-7539a.appspot.com"
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));

var database = admin.firestore();


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
