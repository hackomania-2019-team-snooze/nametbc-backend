"use strict"
const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");
const request = require("request");

//Initialising firebase
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: "nametbc-7539a.appspot.com"
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));

//event emitter, look out for 'data' to retrieve response
function parseAudioData(data) {
    let url = "http://52.163.240.180/client/dynamic/recognize";
    return request.put(url, { body: data });
}