/**
 * logging.js
 * 
 * Logs every http request to the Console and also saves it to a
 * log file. Logging level is set in .env by WINSTON_LEVEL.
 */


const winston = require('winston')
const morgan = require('morgan')
const LEVEL = process.env.WINSTON_LEVEL || "http"


const startLogging = server => {
  const {
    combine,
    timestamp,
    printf,
    colorize,
    align
  } = winston.format;

  // The `info` argument that is sent to printf should be a JSON
  // string. This will be parsed to extract the data in it.
  const logger = winston.createLogger({
    level: LEVEL,
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS"
      }),
      align(),
      printf(info => {
        const { method, message } = info
        if (method) {
          // Sent by morgan
          return`
Treated:  ${info.timestamp}
from:     ${info.from}
method:   ${info.method}
url:      ${info.url}
status:   ${info.status}
length:   ${info.content_length}
ms delay: ${info.response_time}`
        } else {
          // Sent directly on startup
          return message
        }
      })
    ),
    // Show both in the Console and in a log file
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'http.log',
      })
    ]
  })

  // Create message() function and stream object for morgan
  const message = (tokens, req, res) => {
    const from   = req.socket.remoteAddress
    const method = tokens.method(req, res)
    const url    = tokens.url(req, res)
    let status   = tokens.status(req, res)
    status       = Number.parseFloat(status)
    const content_length = tokens.res(req, res, 'content-length')
    let response_time    = tokens['response-time'](req, res)
    response_time        = Number.parseFloat(response_time)

    return JSON.stringify({
      from,
      method,
      url,
      status,
      content_length,
      response_time,
    })
  }

  const stream = {
    stream: {
      // Configure Morgan to use the custom logger with the http
      // severity
      write: (message) => {
          const data = JSON.parse(message);
          logger.http(`incoming-request`, data);
      }
    }
  }

  const morganMiddleware = morgan(message, stream)
    
  server.use(morganMiddleware)

  // Trigger the logger manually with just a message but no data
  logger.info("LOGGING STARTED")

  logger.debug(`
    This message is lower
    than http priority
    and will be ignored
  `)
}


module.exports = startLogging