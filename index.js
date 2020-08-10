#!/usr/bin/env node

const { Api, JsonRpc, Serialize } = require('eosjs');
const { TextDecoder, TextEncoder } = require('text-encoding');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require("node-fetch");

const config = require('./config');

const rpc = new JsonRpc(config.endpoint, {fetch});
const signatureProvider = new JsSignatureProvider([config.private_key]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const required_pairs = ['waxpbtc', 'waxpeth', 'waxpusd', 'waxpeos'];


const get_pairs = async () => {
    const res = await rpc.get_table_rows({
        json: true,
        code: 'delphioracle',
        scope: 'delphioracle',
        table: 'pairs'
    });

    const pairs = {};
    res.rows.forEach((row) => {
        if (row.active){
            pairs[row.name] = row;
        }
    });

    return pairs;
};

const get_bittrex_quotes = async () => {
    const url = 'https://api.bittrex.com/api/v1.1/public/getmarketsummaries';

    const res = await fetch(url);
    const json = await res.json();

    const wax_markets = json.result.filter((q) => {
        return q.MarketName.substr(-4) == 'WAXP';
    });

    return wax_markets;
};

const get_newdex_quotes = async () => {
    const params = {
        api_key: config.newdex_api_key
    };

    const res = await fetch('https://api.newdex.io/v1/tickers');
    const json = await res.json();

    const wax = json.data.filter(q => q.symbol === 'eosio.token-wax-eos');

    return wax;
};


const push_action = async (push_quotes) => {

    console.log(`Pushing quotes`, push_quotes);

    const actions = [{
        account: 'delphioracle',
        name: 'write',
        authorization: [{
            actor: config.account,
            permission: config.permission
        }],
        data: {
            owner: config.account,
            quotes: push_quotes
        }
    }];

    // console.log(actions);

    const push_res = await api.transact({
        actions
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });

    return push_res;
};

const send_quotes = async () => {
    const bittrex = await get_bittrex_quotes();

    const push_quotes = [];

    const pairs = await get_pairs();
    // console.log(pairs);

    bittrex.forEach((q) => {
        const bittrex_pair = q.MarketName.toLowerCase().split('-');
        const our_pair = `${bittrex_pair[1]}${bittrex_pair[0]}`;

        const pair = pairs[our_pair];
        // console.log(pair, our_pair);

        if (required_pairs.includes(our_pair) && pair){
            // console.log(`Including ${our_pair}`, q);
            let quote_precision = pair.quoted_precision;
            if (our_pair == 'waxpeth'){
                // on chain precision is 8 but we get as 10
                quote_precision += 2;
            }
            const multiplier = Math.pow(10, quote_precision)

            push_quotes.push({
                pair: our_pair,
                value: Math.round(parseFloat(q.Last) * multiplier)
            });
        }
    });



    // Get waxp/eos from newdex
    const newdex = await get_newdex_quotes();
    const nd_pair = pairs['waxpeos'];
    // console.log(newdex[0].last, nd_pair.quoted_precision);

    if (required_pairs.includes('waxpeos') && nd_pair) {
        const multiplier = Math.pow(10, nd_pair.quoted_precision);

        push_quotes.push({
            pair: 'waxpeos',
            value: Math.round(parseFloat(newdex[0].last) * multiplier)
        });
    }


    try {
        const res = await push_action(push_quotes);

        console.log(`Pushed transaction ${res.transaction_id}`);
    }
    catch (e){
        console.error(`Failed to push quotes - ${e.message}`);
    }

};

const run = async () => {
    send_quotes();
    setInterval(send_quotes, 60 * 2 * 1000);
};

run();
