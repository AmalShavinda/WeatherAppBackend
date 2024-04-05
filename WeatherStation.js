const mongoose = require("mongoose");

const WeatherStationSchema = new mongoose.Schema(
  {
    district: String,
    temperature: String,
    humidity: String,
    airPressure: String,
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }, 
    timestamp: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("WeatherStation", WeatherStationSchema);
