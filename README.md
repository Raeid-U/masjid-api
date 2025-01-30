# Masjid API

The passion project of a Western Muslim in CS.

This Express.js-based API offers mathematical Salah (prayer) time calculation and retrieving Quranic verses. The API uses TypeScript for utility functions and JavaScript for the main application file.

## Features
- Calculate prayer times based on longitude, latitude, date, and timezone.
- Retrieve Quranic verses with options for Arabic, translation, and transliteration.
- `/status` endpoint to check if the server is running.
- Written in TypeScript for utilities and JavaScript for the main app.

---

## Project Structure
```
masjid-api/
├── data/                 # Quranic data, translations, and transliterations
│   ├── quran.json        # Arabic text of the Quran
│   ├── translations/     # Translation files (e.g., translation-en.json)
│   ├── transliterations/ # Transliteration files (e.g., transliteration-en.json)
├── utils/                # Source TypeScript utility functions
│   ├── salahUtils.ts     # Calculates Salah times
│   ├── timezoneUtils.ts  # Handles timezone conversion
│   ├── quranUtils.ts     # Handles Quranic verse retrieval
│   ├── utility.ts        # Holds universal utility functions
├── app.js                # Main application file
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project metadata and scripts
└── ...
```

---

## Installation
1. Clone the repository:
   ```bash
   gh repo clone Raeid-U/masjid-api
   cd masjid-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Scripts
The following scripts are available in `package.json`:

- **Build the project:**
  ```bash
  npm run build
  ```
  Compiles the TypeScript files in `utils/` into JavaScript in the `dist/` directory.

- **Start the server:**
  ```bash
  npm start
  ```
  Starts the API server using the compiled `app.js` file.

- **Build and start together:**
  ```bash
  npm run api-start
  ```
  Combines `build` and `start` into a single command.

---

## API Endpoints

### Root Endpoint
- **GET /**
  - Response:
    ```json
    { "Assalamualaikum": "Ahlan wa sahlan wa marhaban, Welcome to the Masjid API!" }
    ```

### Status Endpoint
- **GET /status**
  - Response:
    ```json
    { "Status": "Running" }
    ```

### Salah Times Endpoint
- **GET /salah?longitude={longitude}&latitude={latitude}&date={date}&timezone={timezone}**
  - Test Parameters:
    - `longitude`: Longitude of the location (e.g., `-79.74`).
    - `latitude`: Latitude of the location (e.g., `43.74`).
    - `date`: Date in `YYYY-MM-DD` format (e.g., `2025-01-24`).
    - `timezone`: Timezone for output times (e.g., `America/New_York`).
  - Response (example):
    ```json
    {
      "Fajr": "05:30",
      "Shuruq": "07:00",
      "Dhuhr": "12:30",
      "Asr": "15:45",
      "Sunset": "18:15",
      "Maghrib": "18:18",
      "Isha": "19:45"
    }
    ```

### Quran Endpoint
- **GET /quran?format={0|1}&chapter={chapter}&ayah={ayah}&start={start}&end={end}&arabic={0|1}&translation={0|1}&transliteration={0|1}&lang={lang}**
  - Parameters:
    - `format`: `0` for a single ayah, `1` for a range.
    - `chapter`: Quranic chapter number.
    - `ayah`: Verse number (for single ayah lookup).
    - `start`: Start verse number (for range lookup).
    - `end`: End verse number (for range lookup).
    - `arabic`: `1` to include Arabic text, `0` to exclude.
    - `translation`: `1` to include translation, `0` to exclude.
    - `transliteration`: `1` to include transliteration, `0` to exclude.
    - `lang`: Translation language (e.g., `en`, `fr`, `es`, `ur`).
  - Response (example for a single ayah):
    ```json
    {
      "ayah": "2:255",
      "lang": "en",
      "arabic": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ...",
      "translation": "Allah! There is no deity except Him...",
      "transliteration": "Allahu la ilaha illa huwa..."
    }
    ```
  - Response (example for an ayah range):
    ```json
    {
      "range": "2:255-257",
      "lang": "en",
      "arabic": "... ۝255 ... ۝256 ... ۝257",
      "translation": "255. Allah! There is no deity except Him... 256. There is no compulsion in religion..."
    }
    ```

---

## Running the Project

1. Build and start the server using the custom alias:
   ```bash
   npm run masjid-api-start
   ```

2. Open your browser or use a tool like Postman to test the endpoints.

Example:
```bash
GET http://localhost:7860/salah?longitude=-79.74&latitude=43.74&date=2025-01-24&timezone=America/New_York
```

---

## Notes
- Ensure `tsc` is installed globally or use `npx tsc` to compile the TypeScript files.
- The compiled `.js` files are located in the `dist/` directory.
- Modify `PORT` in `app.js` if needed.
