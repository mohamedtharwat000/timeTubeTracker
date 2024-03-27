const playlistArray = [];
let playlistsData = {};

function addPlaylistDataCard(playlistDataOBject, id) {
  const playlistDataCard = document.createElement('div');
  playlistDataCard.classList.add('card', 'm-2');
  playlistDataCard.style.width = '18rem';
  playlistDataCard.id = id;
  playlistDataCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Total playlist videos: ${playlistDataOBject.totalPlaylistVideos}</h5>
                <h6 class="card-title">Total wanted videos: ${playlistDataOBject.totalVideos}</h6>
                <h6 class="card-title">Average Duration: ${playlistDataOBject.averageDuration}</h6>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"> <strong> 1.00x: </strong> ${playlistDataOBject.durations['1x']} </li>
                <li class="list-group-item"> <strong> 1.25x: </strong> ${playlistDataOBject.durations['1.25x']} </li>
                <li class="list-group-item"> <strong> 1.50x: </strong> ${playlistDataOBject.durations['1.5x']} </li>
                <li class="list-group-item"> <strong> 1.75x: </strong> ${playlistDataOBject.durations['1.75x']} </li>
                <li class="list-group-item"> <strong> 2.00x: </strong> ${playlistDataOBject.durations['2x']} </li>
            </ul>
            <div class="card-body">
                <!-- <form class="form-outline"> -->
                    <div class="row">
                        <input type="number" id="typeNumberStart" class="form-control m-1" placeholder="Start"
                            style="width: 45%" min="1" max="${playlistDataOBject.totalPlaylistVideos}"
                            value="${playlistDataOBject.indexes.mainStart || playlistDataOBject.indexes.start}"/>
                        <input type="number" id="typeNumberEnd" class="form-control m-1" placeholder="End"
                            style="width: 45%" min="1" max="${playlistDataOBject.totalPlaylistVideos}" 
                            value="${playlistDataOBject.indexes.end || playlistDataOBject.indexes.mainEnd}"/>
                        <div class="invalid-feedback">
                        </div>
                    </div>
                    <div class="row">
                        <button type="submit" class="btn btn-primary m-1 p-1" style="width: 45%;">Calculate</button>
                        <button name="removeMe" class="btn btn-danger m-1 p-1" style="width: 45%;">Remove</button>
                    </div>
                    <div class="row">
                        <button type="submit" class="btn btn-success m-1 p-1" style="width: 93%;">Add to
                            Favorite</button>
                    </div>
                    <!-- </form> -->
            </div>
    `;
  document.getElementById('resultsSection').appendChild(playlistDataCard);
}

function updateSumCard(playlistSumOBject) {
  const speeds = ['1x', '125x', '150x', '175x', '2x'];

  document.querySelector(
    '#totalPlaylistsCard #totalPlaylistsCardVids',
  ).innerHTML = playlistSumOBject.totalVideos;

  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const i in speeds) {
    document.querySelector(
      `#totalPlaylistsCard #totalPlaylistsCard${speeds[i]}`,
    ).innerHTML = Object.values(playlistSumOBject.durations)[i] || '00:00:00';
  }
}

const fetchAndUpdateData = async () => {
  if (playlistArray.length === 0) {
    return null;
  }
  return fetch('/api/playlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playlists: playlistArray,
    }),
  }).then(async (res) => {
    const data = await res.json();
    return data;
  });
};

document
  .getElementById('playlistForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    const playlistURL = document.getElementById('playlistInput');
    playlistURL.classList.remove('is-invalid');

    const len = playlistArray.push({ playlistURL: playlistURL.value });

    playlistsData = await fetchAndUpdateData();

    if (playlistsData.error) {
      playlistArray.pop();
      playlistURL.classList.add('is-invalid');
      document.getElementById('playlistInputValidation').innerHTML =
        playlistsData.error;
    } else {
      playlistArray[len - 1] = {
        ...playlistArray[len - 1],
        start: playlistsData.playlists.at(-1).indexes.start,
        end: playlistsData.playlists.at(-1).indexes.end,
        mainStart: playlistsData.playlists.at(-1).indexes.start,
        mainEnd: playlistsData.playlists.at(-1).indexes.end,
      };
      addPlaylistDataCard(playlistsData.playlists.at(-1), playlistArray.length);
      updateSumCard(playlistsData.sum);
      playlistURL.value = '';
    }
  });

async function updatePlaylistDataCard() {
  playlistsData = await fetchAndUpdateData();

  if (!playlistsData) {
    updateSumCard({ totalVideos: 0, durations: {} });
    return null;
  }

  if (playlistsData.error) {
    return playlistsData.error;
  }
  const resultSection = document.getElementById('resultsSection');
  const elementsToRemove = Array.from(resultSection.children).slice(1);

  elementsToRemove.forEach((element) => {
    resultSection.removeChild(element);
  });

  playlistsData.playlists.forEach((playlistData, i) => {
    addPlaylistDataCard(playlistData, i + 1);
  });
  updateSumCard(playlistsData.sum);
  return null;
}

document
  .getElementById('resultsSection')
  .addEventListener('click', async (event) => {
    if (
      event.target.tagName === 'BUTTON' &&
      event.target.innerHTML === 'Remove'
    ) {
      playlistArray.splice(
        event.target.parentNode.parentNode.parentNode.id - 1,
        1,
      );
      event.target.parentNode.parentNode.parentNode.remove();
      playlistsData = await fetchAndUpdateData();

      await updatePlaylistDataCard();
    } else if (
      event.target.tagName === 'BUTTON' &&
      event.target.innerHTML === 'Calculate'
    ) {
      const start =
        event.target.parentNode.parentNode.querySelector('#typeNumberStart');
      const end =
        event.target.parentNode.parentNode.querySelector('#typeNumberEnd');

      start.classList.remove('is-invalid');
      end.classList.remove('is-invalid');

      const playlistIndex =
        event.target.parentNode.parentNode.parentNode.id - 1;

      const url = playlistArray[playlistIndex].playlistURL;
      playlistArray[playlistIndex] = {
        playlistURL: url,
        start: parseInt(start.value, 10),
        end: parseInt(end.value, 10),
        mainStart: playlistArray[playlistIndex].mainStart,
        mainEnd: playlistArray[playlistIndex].mainEnd,
      };

      const error = await updatePlaylistDataCard();
      if (error) {
        if (error.includes('Start and End')) {
          start.classList.add('is-invalid');
          end.classList.add('is-invalid');
        } else if (error.includes('Start')) {
          start.classList.add('is-invalid');
        } else {
          end.classList.add('is-invalid');
        }

        const { parentNode } = event.target.parentNode;
        const playlistInputValidation =
          parentNode.querySelector('.invalid-feedback');
        playlistInputValidation.innerHTML = error;
      }
    }
  });
