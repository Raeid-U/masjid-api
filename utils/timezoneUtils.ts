import { find } from "geo-tz";

export function detectTimezone(latitude: number, longitude: number): string {
  const timezone = find(latitude, longitude);
  return timezone.length > 0 ? timezone[0] : "UTC"; // Default to UTC if no timezone found
}

export function detectTimezoneOffset(
  latitude: number,
  longitude: number,
): number {
  // Calculate the UTC offset based on the longitude
  const offset = Math.round(longitude / 15);

  return offset;
}
