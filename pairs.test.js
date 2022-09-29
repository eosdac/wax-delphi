const extract_pairs = require("./extract_pairs");

const required_pairs = ['waxpbtc', 'waxpeth', 'waxpusd'];

const bittrex = [
    {
        symbol: 'WAXP-BTC',
        high: '0.000004400000',
        low: '0.000004320000',
        volume: '23937.59634439',
        quoteVolume: '0.10429560',
        percentChange: '0.92',
        updatedAt: '2022-09-29T14:29:00.41Z'
    },
    {
        symbol: 'WAXP-ETH',
        high: '0.000063950000',
        low: '0.000063140000',
        volume: '1188.11330784',
        quoteVolume: '0.07539428',
        percentChange: '-0.96',
        updatedAt: '2022-09-29T14:31:40.407Z'
    },
    {
        symbol: 'WAXP-USD',
        high: '0.089000000000',
        low: '0.083031500000',
        volume: '41745.65723008',
        quoteVolume: '3552.27106637',
        percentChange: '-0.66',
        updatedAt: '2022-09-29T14:31:35.407Z'
    },
    {
        symbol: 'WAXP-USDT',
        high: '0.085434890000',
        low: '0.083289740000',
        volume: '67058.57870756',
        quoteVolume: '5677.65411070',
        percentChange: '-0.95',
        updatedAt: '2022-09-29T14:31:00.437Z'
    }
]

const pairs = {
    waxpbtc: {
        active: 1,
        bounty_awarded: 1,
        bounty_edited_by_custodians: 0,
        proposer: 'nate',
        name: 'waxpbtc',
        bounty_amount: '0.00000000 WAX',
        approving_custodians: ['alohaeosprod'],
        approving_oracles: [],
        base_symbol: '8,WAXP',
        base_type: 4,
        base_contract: '',
        quote_symbol: '8,BTC',
        quote_type: 2,
        quote_contract: '',
        quoted_precision: 8
    },
    waxpeos: {
        active: 1,
        bounty_awarded: 1,
        bounty_edited_by_custodians: 0,
        proposer: 'eosdacserver',
        name: 'waxpeos',
        bounty_amount: '0.00000000 WAX',
        approving_custodians: ['alohaeosprod', 'pink.gg'],
        approving_oracles: ['alohaeosprod', 'eosdacserver', 'pink.gg'],
        base_symbol: '8,WAXP',
        base_type: 4,
        base_contract: '',
        quote_symbol: '4,EOS',
        quote_type: 2,
        quote_contract: '',
        quoted_precision: 6
    },
    waxpeth: {
        active: 1,
        bounty_awarded: 1,
        bounty_edited_by_custodians: 0,
        proposer: 'eosdacserver',
        name: 'waxpeth',
        bounty_amount: '0.00000000 WAX',
        approving_custodians: ['alohaeosprod', 'pink.gg'],
        approving_oracles: ['alohaeosprod', 'eosdacserver', 'pink.gg'],
        base_symbol: '8,WAXP',
        base_type: 4,
        base_contract: '',
        quote_symbol: '18,ETH',
        quote_type: 2,
        quote_contract: '',
        quoted_precision: 8
    },
    waxpusd: {
        active: 1,
        bounty_awarded: 1,
        bounty_edited_by_custodians: 0,
        proposer: 'nate',
        name: 'waxpusd',
        bounty_amount: '0.00000000 WAX',
        approving_custodians: ['alohaeosprod'],
        approving_oracles: [],
        base_symbol: '8,WAXP',
        base_type: 4,
        base_contract: '',
        quote_symbol: '2,USD',
        quote_type: 1,
        quote_contract: '',
        quoted_precision: 4
    }
}

test('extract pairs', () => {
    expect(extract_pairs(bittrex, pairs, required_pairs))
        .toStrictEqual(
            [
                { "pair": "waxpbtc", "value": 436 },
                { "pair": "waxpeth", "value": 6355 },
                { "pair": "waxpusd", "value": 860 }
            ]
        );
});