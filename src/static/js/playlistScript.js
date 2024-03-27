const playlistArray = [];

function addPlaylistDataCard(playlistDataOBject) {
  const playlistDataCard = document.createElement('div');
  playlistDataCard.classList.add('card', 'm-2');
  playlistDataCard.style.width = '18rem';

  playlistDataCard.innerHTML = `
            <div class="card-body ">
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
                <form class="form-outline">
                    <div class="row">
                        <input type="number" id="typeNumberStart" class="form-control m-1" placeholder="Start"
                            style="width: 45%" min="1" max="${playlistDataOBject.indexes.end}"
                            value="${playlistDataOBject.indexes.start}"/>
                        <input type="number" id="typeNumberEnd" class="form-control m-1" placeholder="End"
                            style="width: 45%" min="1" max="${playlistDataOBject.indexes.end}" 
                            value="${playlistDataOBject.indexes.end}"/>
                        <div id="" class="invalid-feedback">
                            Error: Invalid Start Input
                        </div>
                    </div>
                    <div class="row">
                        <button type="submit" class="btn btn-primary m-1 p-1" style="width: 45%;">Calculate</button>
                        <button type="submit" class="btn btn-danger m-1 p-1" style="width: 45%;">Remove</button>
                    </div>
                    <div class="row">
                        <button type="submit" class="btn btn-success m-1 p-1" style="width: 93%;">Add to
                            Favorite</button>
                    </div>
                </form>
            </div>
    `;
  document.getElementById('resultsSection').appendChild(playlistDataCard);
}

function updatePlaylistDataCard(playlistSumOBject) {
  // const totalPlaylistsCard = document.getElementById('totalPlaylistsCard');
  const speeds = ['1x', '125x', '150x', '175x', '2x'];

  document.querySelector(
    '#totalPlaylistsCard #totalPlaylistsCardVids',
  ).innerHTML = playlistSumOBject.totalVideos;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < speeds.length; i += 1) {
    document.querySelector(
      `#totalPlaylistsCard #totalPlaylistsCard${speeds[i]}`,
    ).innerHTML = Object.values(playlistSumOBject.durations)[i];
  }
}

document
  .getElementById('playlistForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    const playlistURL = document.getElementById('playlistInput');
    playlistURL.classList.remove('is-invalid');

    playlistArray.push({ playlistURL: playlistURL.value });

    fetch('/api/playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlists: playlistArray,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        playlistURL.classList.add('is-invalid');
        document.getElementById('playlistInputValidation').innerHTML =
          data.error;
        playlistArray.pop();
        return;
      }
      addPlaylistDataCard(data.playlists.at(-1));
      updatePlaylistDataCard(data.sum);
      // addPlaylistDataCard(playlistArray.at(-1));
      console.log(data);
    });
  });
