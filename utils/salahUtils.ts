import { detectTimezone, detectTimezoneOffset } from "./timezoneUtils";

// Utility functions
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Julian date calculation
function getJulianDate(date: Date): number {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

// Solar parameters calculation
function calculateSolarParameters(julianDate: number): {
  declination: number;
  equationOfTime: number;
} {
  const D = julianDate - 2451545.0;
  const g = toRadians((357.529 + 0.98560028 * D) % 360);
  const q = (280.459 + 0.98564736 * D) % 360;
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360;
  const epsilon = toRadians(23.439 - 0.00000036 * D);

  const RA =
    toDegrees(
      Math.atan2(
        Math.cos(epsilon) * Math.sin(toRadians(L)),
        Math.cos(toRadians(L)),
      ),
    ) / 15;
  const declination = Math.asin(Math.sin(epsilon) * Math.sin(toRadians(L)));

  const equationOfTime = (q / 15 - RA + 24) % 24;
  return { declination, equationOfTime };
}

// Hour angle calculation
function calculateHourAngle(
  latitude: number,
  declination: number,
  angle: number,
): number {
  const latitudeRad = toRadians(latitude);
  return Math.acos(
    (Math.sin(toRadians(angle)) -
      Math.sin(latitudeRad) * Math.sin(declination)) /
      (Math.cos(latitudeRad) * Math.cos(declination)),
  );
}

// Main prayer times calculation function
// requires:
//  * latitude: float
//  * longitude: float
//  * date = "YYYY-MM-DD"
export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: string,
): { [key: string]: string } {
  const parsedDate = new Date(date);
  const julianDate = getJulianDate(parsedDate);
  const { declination, equationOfTime } = calculateSolarParameters(julianDate);
  const timezone = detectTimezone(latitude, longitude);
  const offset = detectTimezoneOffset(latitude, longitude);

  const noon = (12 - equationOfTime - longitude / 15 + 24) % 24;

  const fajrAngle = 15;
  const ishaAngle = 15;
  const shuruqAngle = -0.833;

  const fajrHA = calculateHourAngle(latitude, declination, -fajrAngle);
  const ishaHA = calculateHourAngle(latitude, declination, -ishaAngle);
  const shuruqHA = calculateHourAngle(latitude, declination, shuruqAngle);

  const fajr = (noon - toDegrees(fajrHA) / 15 + 24) % 24;
  const sunrise = (noon - toDegrees(shuruqHA) / 15 + 24) % 24;
  const sunset = (noon + toDegrees(shuruqHA) / 15 + 24) % 24;
  const isha = (noon + toDegrees(ishaHA) / 15 + 24) % 24;

  // temp: Maghrib as a offset of sunset time
  const maghribOffset = 3 / 60; // Currently set to 3 minutes after Sunset
  const maghrib = (sunset + maghribOffset + 24) % 24;

  // temp: Hanafi Asr Time
  const shadowRatio = 1;
  const asrHA = Math.acos(
    (Math.sin(Math.atan(1 / shadowRatio)) +
      Math.sin(toRadians(latitude)) * Math.sin(declination)) /
      (Math.cos(toRadians(latitude)) * Math.cos(declination)),
  );
  const asr = (noon + toDegrees(asrHA) / 15 + 24) % 24;

  const timezoneOffset = detectTimezoneOffset(latitude, longitude);
  const localFajr = (fajr + timezoneOffset + 24) % 24;
  const localShuruq = (sunrise + timezoneOffset + 24) % 24;
  const localDhuhr = (noon + timezoneOffset + 24) % 24;
  const localAsr = (asr + timezoneOffset + 24) % 24;
  const localSunset = (sunset + timezoneOffset + 24) % 24;
  const localMaghrib = (maghrib + timezoneOffset + 24) % 24;
  const localIsha = (isha + timezoneOffset + 24) % 24;

  return {
    Timezone: timezone,
    "Offset from UTC": String(offset),
    Fajr: formatTime(localFajr),
    Shuruq: formatTime(localShuruq),
    Dhuhr: formatTime(localDhuhr),
    Asr: formatTime(localAsr),
    Sunset: formatTime(localSunset),
    Maghrib: formatTime(localMaghrib),
    Isha: formatTime(localIsha),
  };
}
