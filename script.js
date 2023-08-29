async function getMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzU1ZjdiYzc5N2NmM2IyMjFiYWY0MTZjNDQ1MTBmNCIsInN1YiI6IjU5MmQ1MTFkOTI1MTQxN2JmZjAwZTA5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3705hdDXsFbUFapyODPOKcy4oIjudUaAGXqXRdv3s8k",
    },
  }
  try {
    return fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    ).then((response) => response.json())
  } catch(error) {
    console.log(error)
  }
}

async function getMoreInfo(id) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzU1ZjdiYzc5N2NmM2IyMjFiYWY0MTZjNDQ1MTBmNCIsInN1YiI6IjU5MmQ1MTFkOTI1MTQxN2JmZjAwZTA5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3705hdDXsFbUFapyODPOKcy4oIjudUaAGXqXRdv3s8k",
    },
  }

  try {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/" + id,
      options
    ).then((response) => response.json())

    return data
  } catch (error) {
    console.log(error)
  }
}

async function watch(e) {
  const movie_id = e.currentTarget.dataset.id
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzU1ZjdiYzc5N2NmM2IyMjFiYWY0MTZjNDQ1MTBmNCIsInN1YiI6IjU5MmQ1MTFkOTI1MTQxN2JmZjAwZTA5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3705hdDXsFbUFapyODPOKcy4oIjudUaAGXqXRdv3s8k",
    },
  }
  try {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/videos`,
      options
    ).then((response) => response.json())

    const { results } = data

    const youtubeVideo = results.find((video) => video.type === "Trailer")

    window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, "blank")
  } catch (error) {
    console.log(error)
  }
}

function createMovieLayout({ id, title, score, image, duration, year }) {
  return `          
  <div class="movie">
            <div class="title">
              <span>${title}</span>
              <div class="score">
                <img src="./assets/Star.svg" />
                <p>${score}</p>
              </div>
            </div>
            <div class="poster">
              <img src="https://image.tmdb.org/t/p/w500${image}" />
            </div>
            <div class="info">
              <div class="duration">
                <img src="./assets/Clock.svg" />
                <span>${duration}</span>
              </div>
              <div class="year">
                <img src="./assets/CalendarBlank.svg" />
                <span>${year}</span>
              </div>
            </div>
            <button onclick="watch(event)" data-id=${id}>
              <img src="./assets/Play.svg" />
              <span>Assistir trailer</span>
            </button>
          </div>`
}

function select3Videos(results) {
  const random = () => Math.floor(Math.random() * results.length)

  let selectedVideos = new Set()
  while (selectedVideos.size < 3) {
    selectedVideos.add(results[random()].id)
  }

  return [...selectedVideos]
}

function minutesToHourMinutesAndSeconds(minutes) {
  const date = new Date(null)
  date.setMinutes(minutes)
  return date.toISOString().slice(11, 19)
}

async function start() {
  const { results } = await getMovies()

  const best3 = select3Videos(results).map(async (movie) => {
    const info = await getMoreInfo(movie)
    const props = {
      id: info.id,
      title: info.title,
      score: Number(info.vote_average).toFixed(1),
      image: info.poster_path,
      duration: minutesToHourMinutesAndSeconds(info.runtime),
      year: info.release_date.slice(0, 4),
    }
    return createMovieLayout(props)
  })

  const output = await Promise.all(best3)

  document.querySelector(".movies").innerHTML = output.join("")
}
start()
