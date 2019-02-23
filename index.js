"use strict"
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
database.get().then((snapshot) => {
    snapshot.forEach((data) => {
        console.log(data.data());
    });
});
