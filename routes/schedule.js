const app = require("express");
const fire = require("./../config");
var firebase = require("firebase");

const route = app.Router();

route.get("/getall/:id", async (req, res) => {
  try {
    const respone = await fire
      .firestore()
      .collection("devices")
      .doc(req.params.id)
      .get();

    const responeData =
      respone._delegate._document.data.value.mapValue.fields.schedule.arrayValue
        .values;

    var schedule = [];

    responeData.map((res) => {
      schedule.push({
        id: res.mapValue.fields.id.stringValue,
        data: res.mapValue.fields.cron.stringValue,
      });
    });

    console.log(schedule);

    res.send(schedule);
  } catch (error) {
    res.status(400).send("error");
  }
});

route.get("/getlast/:id", async (req, res) => {
  try {
    const respone = await fire
      .firestore()
      .collection("devices")
      .doc(req.params.id)
      .get();

    const ResponeData =
      respone._delegate._document.data.value.mapValue.fields.schedule.arrayValue
        .values;

    var schedule = [
      {
        id: ResponeData[ResponeData.length - 1].mapValue.fields.id.stringValue,
        data: ResponeData[ResponeData.length - 1].mapValue.fields.data
          .stringValue,
      },
    ];

    res.send(schedule);
  } catch (error) {
    res.status(400).send("error");
  }
});

// route.get("/test", (req, res) => {
//   firebase.default
//     .firestore()
//     .collection("devices")
//     .doc("12")
//     .update({ test: "test" })
//     .then(() => {
//       res.send("success");
//     });
// });

route.get("/getedit/:id", async (req, res) => {
  try {
    const respone = await fire
      .firestore()
      .collection("devices")
      .doc(req.params.id)
      .get();

    const responeData =
      respone._delegate._document.data.value.mapValue.fields.schedule.arrayValue
        .values;

    var schedule = responeData.filter((res) => {
      // console.log(res.mapValue.fields.id.stringValue);
      return res.mapValue.fields.id.stringValue == req.body.id;
    });

    schedule = [
      {
        id: schedule[0].mapValue.fields.id.stringValue,
        data: schedule[0].mapValue.fields.data.stringValue,
      },
    ];

    res.send(schedule);
  } catch (error) {
    res.status(400).send("error");
  }
});

route.post("/remove/:id", async (req, res) => {
  console.log(req.body);

  try {
    fire
      .firestore()
      .collection("devices")
      .doc(req.params.id)
      .update({
        schedule: firebase.firestore.FieldValue.arrayRemove({
          id: req.body.id,
          data: req.body.data,
        }),
      });

    res.send("success remove schedule");
  } catch (error) {
    res.status(400).send("error");
  }
});

module.exports = route;
