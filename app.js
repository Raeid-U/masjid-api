const express = require("express");
const { calculatePrayerTimes } = require("./dist/utils/salahUtils");

const app = express();
const PORT = 7860;

// Root route
app.get("/", (_req, res) => {
  res.send("Welcome to the Masjid API");
});

// Status endpoint
app.get("/status", (_req, res) => {
  res.json({ Status: "Running" });
});

// Salah times endpoint
app.get("/salah", (req, res) => {
  const { longitude, latitude, date } = req.query;

  // temp: Validate query parameters
  if (!longitude || !latitude || !date) {
    return res
      .status(400)
      .json({ error: "Please provide longitude, latitude, and date" });
  }

  try {
    const salahTimes = calculatePrayerTimes(
      parseFloat(latitude),
      parseFloat(longitude),
      date,
    );
    res.json(salahTimes);
  } catch (error) {
    res.status(500).json({
      error: "Error calculating Salah times",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
