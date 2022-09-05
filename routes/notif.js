const app = require("express");
const fire = require("./../config");
var FCM = require("fcm-node");

const route = app.Router();

var serverKey =
  "AAAAtGXIPyg:APA91bGGAIzPJG9cqkXgme4WG2Lhixfyz54H9_wWh8ZdZbdROG_OcbbTp7DG2nacF8cM_-2Ebwo3pEZucRiTXZOmyD8M4-nb7UxwgWB5Zf4nkWMBVzFqIlkz-_IWbzJqF5s2Dcu9ORnt"; //put your server key here
var fcm = new FCM(serverKey);

route.post("/:id", async (req, res) => {
  console.log("notif body = ", req.body);
  try {
    var data = await fire
      .firestore()
      .collection("users")
      .doc(req.body.email)
      .get();

    var deviceData = await fire
      .firestore()
      .collection("devices")
      .doc(req.params.id)
      .get();

    const responeData =
      deviceData._delegate._document.data.value.mapValue.fields;

    const fcm_token =
      data._delegate._document.data.value.mapValue.fields.fcm_token.stringValue;

    var message = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: fcm_token,

      notification: {
        title: req.body.type == 1 ? "Schedule Notif" : "Sensor Notif",
        body:
          req.body.type == 1
            ? `${responeData.gardenName.stringValue} ${
                responeData.switchName.arrayValue.values[req.body.index]
                  .stringValue
              } ${req.body.state == 1 ? "ON" : "OFF"}`
            : `${
                req.body.index == 0 && req.body.state == 1 // index 0 sensor hujan
                  ? "Turun Hujan"
                  : req.body.index == 1 // index 1 sensor PH
                  ? `PH Tanah ${req.body.state}`
                  : req.body.index == 2 // index 2 sensor Soil Moisture
                  ? `Soil Moisture ${req.body.state}`
                  : req.body.index == 3 // index 3 sensor Temp
                  ? `Temperature Udara ${req.body.state}`
                  : `Kelembaban Udara ${req.body.state}` // index 4 sensor Humidity
              }`,
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
  } catch (error) {
    res.status(400).send("error");
  }
});

module.exports = route;
