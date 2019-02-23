const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

//Initialising firebase
firebase.initializeApp({
<<<<<<< HEAD
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://nametbc-7539a.firebaseio.com"
=======
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://nametbc-7539a.firebaseio.com"
>>>>>>> 7eab7642d201ee582f32ef091e3b3bcb72f53804
});
//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));
var database = firebase.database();

<<<<<<< HEAD
var obj = {
  a: 6,
  b: 5
};

app.get("/random.text", function(req, res) {
  res.send("random.text");
});
=======
var database = firebase.database();
console.log(database.ref());
>>>>>>> 7eab7642d201ee582f32ef091e3b3bcb72f53804
