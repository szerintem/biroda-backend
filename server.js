require('dotenv').config()

const express = require('express')
const cors = require('cors')
const axios = require('axios')

const TMDB = require('./lib/TMDB')

const app = express()
app.use(cors())
const port = process.env.PORT || 3001

app.get('/tmdb/search', async (req, res) => {
  const filterURL = TMDB.getFilterURL({
    apiKey: process.env.TMDB_API_KEY,
    query: req.query?.query || "lion king"
  })
  const result = await axios.get(filterURL)
  res.send(result.data.results)
})

app.get('/tmdb/genres', async (req, res) => {
  const filterURL = TMDB.getGenresURL({
    apiKey: process.env.TMDB_API_KEY,
  })
  const result = await axios.get(filterURL)
  res.send(result.data.genres)
})

app.get('/wiki/movie', async (req, res) => {

  const title = req.query.title

  const result = {
    imdbLink: null,
    wikiLink: null,
    description: null,
  }

  const pageIdQuery = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&`+(new URLSearchParams({srsearch: title })))
  if(pageIdQuery.data.query.search.length === 0) {
    return res.send(result)
  }

  const pageId = pageIdQuery.data.query.search[0].pageid

  result.wikiLink = `http://en.wikipedia.org/?curid=${pageId}`

  const descriptionQuery = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${pageId}`)
  result.description = descriptionQuery.data.query.pages[pageId].extract

  const linksQuery = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extlinks&ellimit=max&pageids=${pageId}`)
  const links = linksQuery.data.query.pages[pageId].extlinks

  for(const link of links) {
    const url = link['*']
    if(url.includes('imdb.com/title/tt')) {
      result.imdbLink = url
      break
    }
  }

  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
