/* eslint-env mocha */
const expect = require('chai').expect
const server = require('../../server')
const io = require('socket.io-client')

describe('Server', () => {
  describe('socket.io', () => {
    let sender
    let receiver
    beforeEach(done => {
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
           
      done()
    })

    describe('Event: test connection', () => {
      it('Clients should receive a message when the `test connection` event is emitted', done => {
        const testMsg = 'Hello World'
        sender.emit('test connection', testMsg)
        receiver.on('test connection', msg => {
          expect(msg).to.equal(testMsg)
          done()
        })
      })
    })
  })
})
