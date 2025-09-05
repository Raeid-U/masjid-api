const express = require("express");
const rateLimit = require("express-rate-limit");
const { calculatePrayerTimes } = require("./dist/utils/salahUtils");
const { convertPrayerTimes } = require("./dist/utils/timezoneUtils");
const {
  getAyah,
  getAyahRange,
  supportedLangs,
} = require("./dist/utils/quranUtils");

const app = express();
const PORT = 7860;

// rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  headers: true,
});

app.use(limiter);

// Root route
app.get("/", (_req, res) => {
  res.json({
    Assalamualaikum: "Ahlan wa sahlan wa marhaban, Welcome to the Solaris API!",
    Help: "Navigate to /help to get a list of options"
  });
});

app.get("/help", (_req, res) => {
    res.json({
            "/": "Landing",
            "/help": "You are here",
            "/status": "Check the status of the SOLARIS & QURAN portions of the app",
            "/salah": "Takes in (lattitude, longitude, date, timezone) and returns the salah times for that region",
            "/quran": "Takes in a format specifier & metadata to perform a search on our Quran database"
    });
});

// Status endpoint
app.get("/status", (_req, res) => {
  res.json({ Status: "Running" });
});

// Salah times endpoint
app.get("/salah", (req, res) => {
  const { latitude, longitude, date, timezone } = req.query;

  // temp: Validate query parameters
  if (!latitude || !longitude || !date || !timezone) {
    return res.status(400).json({
      error: "Please provide latitude, longitude, date, and timezone",
    });
  }

  try {
    const salahTimes = calculatePrayerTimes(
      parseFloat(latitude),
      parseFloat(longitude),
      date,
    );
    const formattedTimes = convertPrayerTimes(salahTimes, timezone);
    res.json(formattedTimes);
  } catch (error) {
    res.status(500).json({
      error: "Error calculating Salah times",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Quran endpoint
app.get("/quran", (req, res) => {
  let {
    format,
    chapter,
    ayah,
    start,
    end,
    arabic,
    translation,
    transliteration,
    lang,
  } = req.query;

  format = parseInt(format, 10);
  chapter = parseInt(chapter, 10);
  ayah = ayah ? parseInt(ayah, 10) : null;
  start = start ? parseInt(start, 10) : null;
  end = end ? parseInt(end, 10) : null;
  arabic = arabic === "0" ? false : true;
  translation = translation === "0" ? false : true;
  transliteration = transliteration === "0" ? false : true;
  lang = lang || "en";

  // temp: Validate language
  if (!supportedLangs.includes(lang)) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  if (format === 0) {
    // Single Ayah lookup
    if (!chapter || !ayah) {
      return res
        .status(400)
        .json({ error: "Please provide chapter and ayah for single lookup" });
    }

    const ayahData = getAyah(
      chapter,
      ayah,
      lang,
      arabic,
      translation,
      transliteration,
    );
    if (!ayahData) {
      return res.status(404).json({ error: "Ayah not found" });
    }

    return res.json({
      ayah: `${chapter}:${ayah}`,
      lang,
      ...ayahData,
    });
  } else if (format === 1) {
    // Range lookup
    if (!chapter || !start || !end) {
      return res.status(400).json({
        error: "Please provide chapter, start, and end for range lookup",
      });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ error: "Start ayah cannot be greater than end ayah" });
    }

    const rangeData = getAyahRange(
      chapter,
      start,
      end,
      lang,
      arabic,
      translation,
      transliteration,
    );
    if (!rangeData) {
      return res.status(404).json({ error: "Range not found" });
    }

    return res.json({
      range: `${chapter}:${start}-${end}`,
      lang,
      ...rangeData,
    });
  } else {
    return res.status(400).json({
      error:
        "Invalid format. Use format=0 for single ayah, format=1 for range.",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
