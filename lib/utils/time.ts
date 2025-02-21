type TimeFormatOptions = {
  locale?: string;
  hour12?: boolean;
  showMinutes?: boolean;
};

/**
 * Formats a time string from 24-hour format to a localized time string
 * @param time Time string in "HH:mm" format
 * @param options Formatting options
 * @returns Formatted time string
 */
export function formatTime(
  time: string,
  options: TimeFormatOptions = {}
): string {
  const { locale = "es-ES", hour12 = true, showMinutes = true } = options;

  const date = new Date();
  const [hours, minutes] = time.split(":");
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: showMinutes ? "2-digit" : undefined,
    hour12,
  });
}

/**
 * Formats an array of time strings from 24-hour format
 * @param times Array of time strings in "HH:mm" format
 * @param options Formatting options
 * @returns Formatted time strings joined with commas
 */
export function formatTimeArray(
  times: string[] | null | undefined,
  options: TimeFormatOptions = {}
): string {
  if (!times?.length) return "No especificado";
  return times.map((time) => formatTime(time, options)).join(", ");
}
