/* eslint-env mocha */
const expect = require('chai').expect
const storage = require('node-persist')
const server = require('../../server')
const io = require('socket.io-client')

describe('Server', () => {
  describe('socket.io', () => {
    let sender
    let receiver
    beforeEach(done => {
      // setup test storage
      storage.init({ dir: 'tests/node-persist-test/' })

      // start the io server
      server.listen(5000)

      // conntect two io clients
      sender = io('http://localhost:5000/')
      receiver = io('http://localhost:5000/')

      done()
    })

    afterEach(done => {
      // disconnect io clients after each test
      sender.disconnect()
      receiver.disconnect()

      // clear test storage
      storage.clear()

      done()
    })

    describe('Event: test connection', () => {
      it('Clients should receive a message when the `test connection` event is emitted', (done) => {
        const testMsg = 'Hello World'
        sender.emit('test connection', testMsg)
        receiver.on('test connection', msg => {
          expect(msg).to.equal(testMsg)
          done()
        })
      })
    })

    describe('Event: get initial data', () => {
      it('should emit stored data to the client if it exists', (done) => {
        const testData = {
          name: 'AAPL',
          data: [[1496793600000, 155.02], [1496880000000, 155.25], [1496966400000, 155.19]],
          tooltip: { valueDecimals: 2 },
          color: '#93758F'
        }
        storage.setItem('AAPL', testData)
        sender.emit('get initial data')
        receiver.on('company stock', initialData => {
          expect(initialData.name).to.eql(testData.name)
          done()
        })
      })

      it('should emit error message if no data exists', (done) => {
        const testMsg = 'There was was no existing data'
        sender.emit('get initial data')
        receiver.on('get initial data', msg => {
          expect(msg.message).to.equal(testMsg)
          done()
        })
      })
    })
  })
})
