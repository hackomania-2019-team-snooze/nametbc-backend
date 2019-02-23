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

var database = admin.firestore().collection("video");

var picpath = "C:\\Users\\user\\Desktop\\Useless pics\\mypic.jpg";

var file = bucket.file("/videos/uploadedfile");

fs.createReadStream(picpath)
  .pipe(file.createWriteStream())
  .on("error", function(err) {})
  .on("finish", function() {
    // The file upload is complete.
    console.log("file upload is complete");
  });

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
