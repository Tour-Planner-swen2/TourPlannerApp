export function formatDuration(duration: string | number | undefined | null): string {
  if (!duration) return '0:00';

  let durationInMinutes: number;

  if (typeof duration === 'string') {
    const parts = duration.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      durationInMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0);
    } else if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      durationInMinutes = minutes + (seconds > 0 ? 1 : 0);
    } else {
      return '0:00';
    }
  } else {
    durationInMinutes = duration;
  }

  const hours: number = Math.floor(durationInMinutes / 60);
  const minutes: number = durationInMinutes % 60;

  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}h`;
  return `${minutes.toString()}m`;
}
export function formatDistance(meters: number | undefined | null): string {
  if (meters === undefined || meters === null) {
    return '0 m';
  }

  if (meters >= 1000) {
    const km = Math.trunc(meters / 100) / 10;
    return `${km} km`;
  }

  // Unter 1000 Metern normal als Meter anzeigen (auch hier Nachkommastellen abschneiden falls vorhanden)
  return `${Math.trunc(meters)} m`;
}
