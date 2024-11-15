/**
 * routes.js
 */

const TICKER = 'https://api2.binance.com/api/v3/ticker/24hr'

const getCrypto = (req, res) => {
  const treatResponse = response => {
    if (response.ok) {
      return response.json()
    }

    throw new Error(response)
  }

  fetch(TICKER)
    .then(treatResponse)
    .then(json => json.slice(0, 1))
    .then(text => JSON.stringify(text, null, "  "))
    .then(slice => res.send(slice))
    .catch(error => console.log("error:", error))
}


const block = (req, res) => {
  res.status(403).send("Not authorized")
}

const routes = server => {
  server.get('/crypto', getCrypto)
  server.get('/private', block)
}


module.exports = routes