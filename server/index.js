const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const storage = require('node-persist')
const fetchStockData = require('../utils/fetchStockData')
const fetchStockSuggestion = require('../utils/fetchStockSuggestion')
const getRandomColor = require('../utils/getRandomColor')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 5000

app.use(express.static(path.resolve(__dirname, '../react-ui/build')))
app.use(bodyParser.urlencoded({ extended: false }))

// Initialize node-persist
if (process.env.NODE_ENV !== 'test') {
  storage.init()
} else {
  storage.init({ dir: 'tests/.node-persist-test/' })
}

io.on('connection', socket => {
  if (process.env.NODE_ENV !== 'test') console.log('user connected')

  socket.on('test connection', msg => {
    io.emit('test connection', msg)
  })

  socket.on('clear data', () => {
    storage.clear().then(() => {
      io.emit('clear data', { message: 'Data has been cleared' })
    })
  })

  socket.on('remove company', company => {
    storage.removeItem(company.name).then(() => {
      io.emit('remove company', {
        message: `${company.name} has been cleared`,
        company
      })
    })
  })

  socket.on('get initial data', () => {
    // Check if data has been persisted
    if (storage.length() > 0) {
      const storageValues = storage.values()
      storageValues.map(company => {
        // Get updated stock data for company
        fetchStockData(company.name).then(data => {
          if (!data.error) {
            const companyData = {
              name: company.name,
              data,
              tooltip: { valueDecimals: 2 },
              color: getRandomColor()
            }

            // Send initial stock data to front-end
            io.emit('company stock', companyData)
          } else {
            io.emit('add company error', data.error)
          }
        })
      })
    } else {
      io.emit('get initial data', { message: 'There was was no existing data' })
    }
  })

  // Listen for which company to fetch stock data
  socket.on('add company', companySymbol => {
    fetchStockData(companySymbol).then((data) => {
      if (!data.error) {
        // Create object with company information
        const companyData = {
          name: companySymbol,
          data,
          tooltip: { valueDecimals: 2 },
          color: getRandomColor()
        }

        // Send company stock data back to front-end
        io.emit('company stock', companyData)

        // Persist new company data to list
        storage.setItem(companyData.name, companyData)
      } else {
        io.emit('add company error', { error: data.error, symbol: companySymbol })
      }
    })
  })

  // Get suggestion for company if invalid symbol is provided
  socket.on('get suggestion', companySymbol => {
    fetchStockSuggestion(companySymbol).then((symbol) => {
      if (!symbol.error) {
        io.emit('get suggestion', symbol)
      } else {
        io.emit('get suggestion', 'No suggestion')
      }
    })
  })
})

// All remaining requests return the React app so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server
