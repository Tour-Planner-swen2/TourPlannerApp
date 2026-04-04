export function formatDuration(durationInMinutes: number | undefined | null): string {
  if (!durationInMinutes)
    return '0:00';

  const hours: number = Math.floor(durationInMinutes / 60);
  const minutes: number = durationInMinutes % 60;

  if (hours > 0)
    return `${hours}:${minutes.toString().padStart(2, '0')}h`;
  return `${minutes.toString()}m`;
}
