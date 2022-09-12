const app = require("express");
const fire = require("./../config");
var firebase = require("firebase");

const route = app.Router();

route.post("/set/:id", async (req, res) => {
  console.log(req.body);

  try {
    await fire
      .database()
      .ref(`${req.params.id}/data`)
      .set({
        ph: req.body.ph,
        temp: req.body.temp,
        humi: req.body.humi,
        soil: req.body.soil,
      })
      .then(() => {
        res.send("data set");
      });
  } catch (error) {
    res.status(400).send("error");
  }
});

route.post("/add/:id", async (req, res) => {
  // console.log(req.body);
  try {
    await fire
      .database()
      .ref(`${req.params.id}/Sensor`)
      .push()
      .set({
        ph: req.body.ph,
        temp: req.body.temp,
        humi: req.body.humi,
        soil: req.body.soil,
        time: req.body.time,
      })
      .then(() => {
        res.send("data update");
      });
  } catch (error) {
    res.status(400).send("error");
  }
});

module.exports = route;
