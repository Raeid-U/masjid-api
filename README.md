# Masjid API

This is a simple Express.js-based API for calculating Salah (prayer) times based on location and date. The API uses TypeScript for utility functions and JavaScript for the main application file.

## Features
- Calculate prayer times based on longitude, latitude, and date.
- `/status` endpoint to check if the server is running.
- Written in TypeScript for utilities and JavaScript for the main app.

---

## Project Structure
```
masjid-api/
├── utils/               # Source TypeScript utility functions
│   ├── salahUtils.ts    # Calculates Salah times
│   └── timezoneUtils.ts # Handles timezone detection (not detailed here)
├── app.js               # Main application file
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project metadata and scripts
└── ...
```

---

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
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
  npm run masjid-api-start
  ```
  Combines `build` and `start` into a single command.

---

## API Endpoints

### Root Endpoint
- **GET /**
  - Response: `Welcome to the Masjid API`

### Status Endpoint
- **GET /status**
  - Response:
    ```json
    { "Status": "Running" }
    ```

### Salah Times Endpoint
- **GET /salah?longitude={longitude}&latitude={latitude}&date={date}**
  - Test Parameters:
    - `longitude`: Longitude of the location (e.g., `-79.74`).
    - `latitude`: Latitude of the location (e.g., `43.74`).
    - `date`: Date in `YYYY-MM-DD` format (e.g., `2025-01-24`).
  - Response (example):
    ```json
    {
      "Timezone": "America/Toronto",
      "Fajr": "05:30",
      "Shuruq": "07:00",
      "Dhuhr": "12:30",
      "Asr": "15:45",
      "Sunset": "18:15",
      "Maghrib": "18:18",
      "Isha": "19:45"
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
GET http://localhost:7860/salah?longitude=-79.74&latitude=43.74&date=2025-01-24
```

---

## Notes
- Ensure `tsc` is installed globally or use `npx tsc` to compile the TypeScript files.
- The compiled `.js` files are located in the `dist/` directory.
- Modify `PORT` in `app.js` if needed.

---

## Current Issues
- Timezone Offet is not 100% accurate
- Revision to `timezoneUtils.ts` is required
