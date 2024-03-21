import dotenv from 'dotenv';

dotenv.config();
// type VideosIdsObj = { result: [string] }

async function fetchAPI(playlistURL: string, nextPageToken?: string | null): Promise<object | string> {
  const { apiKey } = process.env!;

  if (!playlistURL) {
    return Promise.reject("Playlist URL is requierd");
  }

  const apiEndPoint = 'https://www.googleapis.com/youtube/v3/playlistItems?';
  const apiUrlOptions = `playlistId=${playlistURL}&maxResults=50&part=contentDetails&key=${apiKey}`;
  const nextPageTokenOption = nextPageToken ? `&pageToken=${nextPageToken}` : '';

  const fullApiEndpoint = apiEndPoint + apiUrlOptions + nextPageTokenOption;

  return fetch(fullApiEndpoint)
    .then(async (response) => {
      if (response.status !== 200) {
        return Promise.reject(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json();
      let videosIdsObj = [];

      data.items.forEach((element) => {
        videosIdsObj.push(element.contentDetails.videoId);
      });

      if (data.nextPageToken) {
        videosIdsObj.push(await fetchAPI(playlistURL, data.nextPageToken));
      }

      return videosIdsObj.flat();
    })
    .catch((err) => err);
}

export default fetchAPI;
