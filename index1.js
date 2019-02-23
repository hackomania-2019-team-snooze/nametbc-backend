"use strict";
const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const util = require("util");

//Initialising firebase
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "nametbc-7539a.appspot.com"
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));
var database = firebase.firestore().collection("video");
var storageref = firebase.storage().ref;
console.log(storageref);
var childref = storageref.child("videos");
console.log(childref);
var vid0ref = childref.child("vid000.mp4");
console.log(vid0ref);

/*
var videoarr = [];

app.post("/daily", function(req, res) {
  database.get().then(snapshot => {
    snapshot.forEach(data => {
      videoarr.push({ name: data.id, url: data.data().videourl });
      // console.log(
      //   "current array :" + util.inspect(videoarr, false, null, true)
      // );
    });
    res.send(videoarr);
  });
  // var cityRef = database.doc("sampleobj");
  // var getDoc = cityRef
  //   .get()
  //   .then(doc => {
  //     if (!doc.exists) {
  //       console.log("No such document!");
  //     } else {
  //       console.log(doc.data());
  //     }
  //   })
  //   .catch(err => {
  //     console.log("Error getting document", err);
  //   });
});*/
