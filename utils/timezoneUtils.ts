export function convertPrayerTimes(
  prayerTimes: Record<string, number>,
  timeZone: string,
): Record<string, string> {
  const convertedTimes: Record<string, string> = {};

  Object.entries(prayerTimes).forEach(([prayer, time]) => {
    // Convert decimal hours to a Date object in UTC
    const utcDate = new Date(
      Date.UTC(1970, 0, 1, Math.floor(time), (time % 1) * 60),
    );

    // Convert to the target timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Extract hours and minutes from the formatted time
    const formattedTime = formatter.format(utcDate);

    convertedTimes[prayer] = formattedTime;
  });

  return convertedTimes;
}
