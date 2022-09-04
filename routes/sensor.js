const app = require("express");
const fire = require("./../config");
var firebase = require("firebase");

const route = app.Router();

route.post("/set/:id", async (req, res) => {
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

route.post("/add/:id", async (req, res) => {
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

module.exports = route;
