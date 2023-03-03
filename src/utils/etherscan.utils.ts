export const isTimestampOlderThan = (timestamp: string, seconds: number) =>
  Math.floor(Date.now() / 1000) - parseInt(timestamp) > seconds;
