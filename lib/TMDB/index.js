
function getFilterURL({apiKey, query}) {
  return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&`+(new URLSearchParams({query}))
}

function getGenresURL({apiKey}) {
  return `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
}

module.exports = {
  getFilterURL,
  getGenresURL
}
