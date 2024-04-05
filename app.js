const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const WeatherStation = require("./WeatherStation");




const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb://127.0.0.1:27017/weather");

//Middlewears
app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/weather/:district", async (req, res) => {
  try {
    const { district } = req.params;
    const data = await WeatherStation.findOne({district: { $regex: new RegExp(`^${district}$`, "i") }, //Case-insensitive search
    }).sort({ timestamp: -1 });
    if (data) {
      res.json(data);
    } else {
      res.status(404).send("Weather data not found on this district");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/weather", async (req, res) => {
  try {
    const data = await WeatherStation.find({}).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/weather", async (req, res) => {
  try {
    const newWeatherData = new WeatherStation(req.body);
    const savedData = await newWeatherData.save();
    res.status(200).json(savedData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.listen(port, () => {
  console.log(`Weather API listening at Port:${port}`);
});
