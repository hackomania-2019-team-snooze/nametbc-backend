const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

//Initialising firebase
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://nametbc-7539a.firebaseio.com"
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));

var database = firebase.database();
console.log(database.ref());