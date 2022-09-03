const express = require("express");
const cors = require("cors");
const app = express();
const fire = require("./config");
const https = require("https");
const fs = require("fs");
var bodyParser = require("body-parser");
var firebase = require("firebase");
var FCM = require("fcm-node");
var serverKey =
  "AAAAtGXIPyg:APA91bGGAIzPJG9cqkXgme4WG2Lhixfyz54H9_wWh8ZdZbdROG_OcbbTp7DG2nacF8cM_-2Ebwo3pEZucRiTXZOmyD8M4-nb7UxwgWB5Zf4nkWMBVzFqIlkz-_IWbzJqF5s2Dcu9ORnt"; //put your server key here
var fcm = new FCM(serverKey);

// app.use(express.json({ strict: false }));
// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get("/getAllSchedule/:id", async (req, res) => {
  const respone = await fire
    .firestore()
    .collection("devices")
    .doc(req.params.id)
    .get();

  const data =
    respone._delegate._document.data.value.mapValue.fields.schedule.arrayValue
      .values;

  var schedule = [];

  data.map((res) => {
    schedule.push({
      id: res.mapValue.fields.id.stringValue,
      cron: res.mapValue.fields.cron.stringValue,
    });
  });

  res.send(schedule);
});

app.get("/getLastSchedule/:id", async (req, res) => {
  const respone = await fire
    .firestore()
    .collection("devices")
    .doc(req.params.id)
    .get();

  const data =
    respone._delegate._document.data.value.mapValue.fields.schedule.arrayValue
      .values;

  var schedule = [
    {
      id: data[data.length - 1].mapValue.fields.id.stringValue,
      cron: data[data.length - 1].mapValue.fields.data.stringValue,
    },
  ];

  res.send(schedule);
});

app.get("/getEditSchedule/:id", async (req, res) => {
  const respone = await fire
    .firestore()
    .collection("devices")
    .doc(req.params.id)
    .get();

  const data =
    respone._delegate._document.data.value.mapValue.fields.schedule.arrayValue
      .values;

  var schedule = data.filter((res) => {
    // console.log(res.mapValue.fields.id.stringValue);
    return res.mapValue.fields.id.stringValue == req.body.id;
  });

  schedule = [
    {
      id: schedule[0].mapValue.fields.id.stringValue,
      cron: schedule[0].mapValue.fields.data.stringValue,
    },
  ];

  res.send(schedule);
});

app.post("/removeSchedule/:id", async (req, res) => {
  console.log(req.body);

  try {
    fire
      .firestore()
      .collection("devices")
      .doc(req.params.id)
      .update({
        schedule: firebase.firestore.FieldValue.arrayRemove({
          id: req.body.id,
          data: req.body.cron,
        }),
      });

    res.send("success remove schedule");
  } catch (error) {
    res.status(400).send("error");
  }
});

app.post("/message", async (req, res) => {
  console.log("notif body = ", req.body);
  var data = await fire
    .firestore()
    .collection("users")
    .doc(req.body.email)
    .get();

  const fcm_token =
    data._delegate._document.data.value.mapValue.fields.fcm_token.stringValue;

  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: fcm_token,
    // collapse_key: 'your_collapse_key',

    notification: {
      title: "schedule notification",
      body: `Switch ${req.body.switch} ${req.body.state}`,
    },
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
      res.send("message success to send");
    }
  });
});

app.post("/ota", (req, res) => {
  // "https://firebasestorage.googleapis.com/v0/b/mikiko-c5ca4.appspot.com/o/SONMIKIKO%2Ffirmware.bin?alt=media&token=2d626de5-6afa-435e-81aa-7d7cbc9b7f9d"
  const file = fs.createWriteStream(
    req.body.type == "MTH"
      ? "MTH/firmware.bin"
      : req.body.type == "SONMIKIKO"
      ? "SONMIKIKO/firmware.bin"
      : "TH10/firmware.bin"
  );
  const request = https.get(req.body.otaUrl, function (response) {
    response.pipe(file);

    // after download completed close filestream
    file.on("finish", () => {
      file.close();
      console.log("Download Completed");

      res.download(
        req.body.type == "MTH"
          ? "MTH/firmware.bin"
          : req.body.type == "SONMIKIKO"
          ? "SONMIKIKO/firmware.bin"
          : "TH10/firmware.bin"
      );
    });
  });
});

app.post("/sensordata/:id", async (req, res) => {
  // console.log(req.body);
  await fire
    .database()
    .ref(`${req.params.id}/Sensor`)
    .push()
    .set({
      ph: req.body.ph,
      temp: req.body.temp,
      humi: req.body.humi,
      soil: req.body.soil,
    })
    .then(() => {
      res.send("data update");
    });
});

// app.put()

// app.delete()

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("port ", port));
