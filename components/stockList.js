import StockItem from './stockItem'

export default () => (
    <div>
        <h4>Stock List:</h4>
        <ul>
            <StockItem stock={ { symbol: 'ABC' } } id={1} />
            <StockItem stock={ { symbol: 'DEF' } } id={2} />
            <StockItem stock={ { symbol: 'GHI' } } id={3} />
        </ul>
    </div>
)