import Head from 'next/head'

import Graph from '../components/graph'
import StockList from '../components/stockList'
import AddStock from '../components/addStock'

export default () => (
    <div>
        <Head>
            <title>Bit Stocks</title>
            <meta name='viewport' content='initial-scale=1, width=device-width' />
            <link rel='stylesheet' href='/static/styles/pure-min.css' />
        </Head>
        Welcome to next.js!
        <Graph />
        <StockList />
        <AddStock />
    </div>
)