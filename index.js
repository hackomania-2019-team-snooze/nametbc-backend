"use strict";
const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

//Initialising firebase
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "nametbc-7539a.appspot.com"
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));
var database = firebase.firestore().collection("video");

var database = firebase.firestore().collection("video");
database.get().then(snapshot => {
  snapshot.forEach(data => {
    console.log(data.data());
  });
  var cityRef = database.doc("sampleobj");
  var getDoc = cityRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        console.log(doc.data());
      }
    })
    .catch(err => {
      console.log("Error getting document", err);
    });
});
