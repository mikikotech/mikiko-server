const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");

const scheduleRoute = require("./routes/schedule");
const notifRoute = require("./routes/notif");
const sensorRoute = require("./routes/sensor");
// app.use(express.json({ strict: false }));
// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/schedule", scheduleRoute);
app.use("/notif", notifRoute);
app.use("/sensor", sensorRoute);

app.get("/", (req, res) => res.send("welcome to mikiko"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("port ", port));
