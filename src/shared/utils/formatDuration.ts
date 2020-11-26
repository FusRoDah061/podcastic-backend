export default function formatDuration(msLength: number): string {
  // https://stackoverflow.com/a/21294619/9214463

  const date = new Date(msLength);

  const hours = date.getUTCHours();

  const minutes =
    date.getUTCMinutes() < 10
      ? `0${date.getUTCMinutes()}`
      : date.getUTCMinutes();

  const seconds =
    date.getUTCSeconds() < 10
      ? `0${date.getUTCSeconds()}`
      : date.getUTCSeconds();

  return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}
