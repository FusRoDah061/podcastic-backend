export default function formatDuration(msLength: number): string {
  const date = new Date(msLength);

  const hours =
    date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();

  const minutes =
    date.getUTCMinutes() < 10
      ? `0${date.getUTCMinutes()}`
      : date.getUTCMinutes();

  const seconds =
    date.getUTCSeconds() < 10
      ? `0${date.getUTCSeconds()}`
      : date.getUTCSeconds();

  return `${hours}:${minutes}:${seconds}`;
}
