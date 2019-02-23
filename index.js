"use strict";
const express = require("express");
const app = express();
const port = 8080;
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");
const request = require("request");
const { Readable } = require("stream");
const ffmpeg = require('fluent-ffmpeg');
const bodyParser = require("body-parser");

//Initialising firebase
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: "nametbc-7539a.appspot.com"
});

//Initialising express
app.listen(port, () => console.log(`Listening on port ${port}`));
var database = firebase.firestore();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
//assumed video.mp4 and audio.wav are set already
function mergeVideoAndAudio() {
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
function uploadFromMemory(buf, file, callback) {
    var stream = new Readable();
    stream.push(buf);
    stream.push(null);
    stream.pipe(file.createWriteStream())
        .on('error', (err) => {
            console.log(err);
        })
        .on('finish', () => {
            console.log('Uploaded!');
            return callback();
        });
}

function transcribeAudio(data, callback) {
    let url = "http://52.163.240.180/client/dynamic/recognize";
    request.put(url, {body: data}, (err, response, body) => {
        callback(body);
    });
}

app.post("/new_video", (req, res) => {
let audio = req.body.audiofile;
    fs.writeFileSync(audio, "audio.wav");
    let userId = req.body.userId;
    let videoId = req.body.videoId;
    let videoFile = bucket.file("videos/" + videoId + ".mp4");
    let curTime = new Date();
    let transcriptionUrl = "https://storage.googleapis.com/submissions/subtitles/";
    let videoUrl = "https://storage.googleapis.com/submissions/dubbedVideo/";

    //upload audio to 3rd party API
    transcribeAudio(audio, (body) => {
        let transcript = JSON.parse(body).hypotheses[0].utterance;
        let transcriptFileName = "machineText" + userId + curTime.toString() + ".txt";
        let transcriptFile = bucket.file("submissions/subtitles/" + transcriptFileName);
        transcriptionUrl += transcriptFileName;
        uploadFromMemory(transcript, transcriptFile, () => {
            //download the file, then save the audio on top of it and upload
            videoFile.download({
                destination: "video.mp4"
            }, (err) => {
                console.log("Error downloading video file: " + videoId);
                console.log(err);
            }).then(() => {
                let output = mergeVideoAndAudio();
                let recordingFileName = "recording" + userId + curTime.toString() + ".mp4";
                let recordingFile = bucket.file("submissions/dubbedVideo/" + recordingFileName)
                videoUrl += recordingFileName;
                let docRef = database.collection("videoaudio").doc(recordingFileName);
                docRef.set({
                    audiourl: "",
                    downvoteArr: [],
                    upvoteArr: [],
                    user: userId,
                    machineTextUrl: transcriptionUrl,
                    videoId: videoId,
                    videoUrl: videoUrl,
                    videoTextUrl: ""
                }).then( () => {
                    uploadFromMemory(output, recordingFile, () => {});
                });
            });
        });
    });
});

app.post("/dailyvideos", function(req, res) {
    let videoarr = [];
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
    let videoarr = [];
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
    let videoarr = [];
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