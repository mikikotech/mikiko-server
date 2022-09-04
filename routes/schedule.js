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
          data: req.body.cron,
        }),
      });

    res.send("success remove schedule");
  } catch (error) {
    res.status(400).send("error");
  }
});

module.exports = route;