const app = require("express");
const fire = require("./../config");
var FCM = require("fcm-node");

const route = app.Router();

var serverKey =
  "AAAAtGXIPyg:APA91bGGAIzPJG9cqkXgme4WG2Lhixfyz54H9_wWh8ZdZbdROG_OcbbTp7DG2nacF8cM_-2Ebwo3pEZucRiTXZOmyD8M4-nb7UxwgWB5Zf4nkWMBVzFqIlkz-_IWbzJqF5s2Dcu9ORnt"; //put your server key here
var fcm = new FCM(serverKey);

route.post("/", async (req, res) => {
  console.log("notif body = ", req.body);
  try {
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
        title: req.body.title,
        body: req.body.msg,
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
