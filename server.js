/**
 * server.js
 */

require('dotenv').config()
const { join } = require('path')

const express = require('express')

const PORT = process.env.PORT || 3000
const STATIC = process.env.STATIC || "public"
const static = join(__dirname, STATIC)

const server = express()
server.use(express.static(static));
server.use(express.json()) // for POST data converted to JSON
server.use(express.urlencoded({ extended: true })) // form data

// require('./routes')(server)

server.listen(PORT, logHostsToConsole)



function logHostsToConsole() {
  // Check what IP addresses are used on this computer
  const nets = require("os").networkInterfaces()
  const ips = Object.values(nets)
  .flat()
  .filter(({ family }) => (
    family === "IPv4")
  )
  .map(({ address }) => address)

  // ips will include `127.0.0.1` which is the "loopback" address
  // for your computer. This address is not accessible from other
  // computers on your network. The host name  "localhost" can be
  // used as an alias for `127.0.0.1`, so you can add that, too.
  ips.unshift("localhost")

  // Log in the Terminal which URLs can connect to your server
  const hosts = ips.map( ip => (
    `http://${ip}:${PORT}`)
  )

  console.log(`Express server listening at:
  ${hosts.join("\n  ")}
`);
}
