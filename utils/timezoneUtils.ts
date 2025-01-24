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
  const offset = Math.floor(longitude / 15);

  // Adjust for time zones that are ahead or behind UTC by fractional offsets
  if (longitude < 0 && longitude % 15 !== 0) {
    return offset + 1; // Fix the off-by-one for longitudes in the negative hemisphere
  } else if (longitude > 0 && longitude % 15 !== 0) {
    return offset - 1; // Adjust for the positive hemisphere
  }

  return offset;
}
