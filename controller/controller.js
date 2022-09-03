"use strict";

var firebase = require("firebase");
const fire = require("./../config");

const getSchedule = async (req, res, next) => {
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
    res.status(400).send(error.message);
  }
};

const removeSchedule = async (req, res, next) => {
  try {
    fire
    .firestore()
    .collection("devices")
    .doc(req.params.id)
    .update({
      schedule: firebase.firestore.FieldValue.arrayRemove({
        id: req.body.id,
        cron: req.body.cron,
      }),
    });

  res.send("success remove schedule");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
