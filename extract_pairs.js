const extract_bittrex_pairs = (bittrex, pairs, required_pairs) => {
    return bittrex
        .map(q => {
            // Change the symbol format to match our format 'WAX-BTC' -> 'waxbtc'
            const our_pair = q.symbol.toLowerCase().replace('-', '');
            return { ...q, symbol: our_pair }
        })
        .filter(q => {
            // filter to only include our required pairs
            return required_pairs.includes(q.symbol)
        })
        .map(q => {
            // calculate the average value and scale to the required precision
            const pair = pairs[q.symbol];
            let quote_precision = pair.quoted_precision;
            const multiplier = Math.pow(10, quote_precision)

            let avg = (+q.high + +q.low) / 2
            return {
                pair: q.symbol,
                value: Math.round(parseFloat(avg) * multiplier)
            }
        })
}

module.exports = extract_bittrex_pairs