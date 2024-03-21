function parseIso8601Duration(durationString) {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const match = durationString.match(regex);

  if (!match) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  return hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;
}
