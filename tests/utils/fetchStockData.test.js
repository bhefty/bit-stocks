/* eslint-env mocha */
require('dotenv').config()
const expect = require('chai').expect
const nock = require('nock')
const fetchStockData = require('../../utils/fetchStockData')

const API_URI = process.env.QUANDL_API_URI
const API_KEY = process.env.QUANDL_API_KEY

describe('fetchStockData', () => {
  // Create high order function to handle async calls
  // http://staxmanade.com/2015/11/testing-asyncronous-code-with-mochajs-and-es7-async-await/
  let mochaAsync = (fn) => {
    return async () => {
      try {
        await fn()
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  beforeEach(done => {
    const fetchResponse = {
      dataset_data: {
        data: [
          ['2017-06-09', 52.60],
          ['2017-06-08', 51.40],
          ['2017-06-07', 53.00]
        ]
      }
    }

    const fetchError = { message: 'Please verify that a correct company symbol was entered..' }

    nock(API_URI)
      .get(`/GOOGL/data.json?api_key=${API_KEY}&start_date=2016-06-02&column_index=1`)
      .reply(200, fetchResponse)

    nock(API_URI)
      .get(`/MT/data.json?api_key=${API_KEY}&start_date=2016-06-02&column_index=1`)
      .reply(404, fetchError)

    done()
  })

  it('should return stock data for given company symbol', mochaAsync(async () => {
    // Expected data becomes reversed from the respose within fetchStockData
    const expectedData = [
      [Date.parse('2017-06-07'), 53.00],
      [Date.parse('2017-06-08'), 51.40],
      [Date.parse('2017-06-09'), 52.60]
    ]
    const data = await fetchStockData('GOOGL')
    expect(data).to.eql(expectedData)
  }))

  it('should return an error message if an incorrect symbol is given', mochaAsync(async () => {
    const expectedResponse = { error: 'Please verify that a correct company symbol was entered.' }
    const response = await fetchStockData('MT')
    expect(response.error).to.equal(expectedResponse.error)
  }))
})
