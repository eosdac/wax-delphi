#!/usr/bin/env node

const { Api, JsonRpc } = require('eosjs');
const { TextDecoder, TextEncoder } = require('text-encoding');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require("node-fetch");

const config = require('./config');
const extract_pairs = require('./extract_pairs');

const rpc = new JsonRpc(config.endpoint, { fetch });
const signatureProvider = new JsSignatureProvider([config.private_key]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const required_pairs = ['waxpbtc', 'waxpeth', 'waxpusd'];

const get_pairs_from_delphi_contract = async () => {
    try {
        const res = await rpc.get_table_rows({
            json: true,
            code: 'delphioracle',
            scope: 'delphioracle',
            table: 'pairs'
        });

        if (res.rows.length) {
            const pairs = {};
            res.rows.forEach((row) => {
                if (row.active) {
                    pairs[row.name] = row;
                }
            });
            return pairs
        }
    }
    catch (e) {
        throw new Error('Error fetching pairs from delphioracle: ' + e.message)
    }
};

const get_bittrex_quotes = async () => {
    const url = 'https://api.bittrex.com/v3/markets/summaries';

    const res = await fetch(url);
    const json = await res.json();


    const wax_markets = json.filter((q) => {
        return q.symbol.includes('WAXP');
    });

    return wax_markets;
};

const push_quotes_to_contract = async (push_quotes) => {
    try {
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

        const push_res = await api.transact({
            actions
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

        return push_res;
    } catch (e) {
        throw new Error('Error pushing pairs to delphioracle contract: ' + e.message)
    }
};

const send_quotes = async () => {
    try {
        const bittrex = await get_bittrex_quotes();
        const pairs = await get_pairs_from_delphi_contract();

        const quotes = extract_pairs(bittrex, pairs, required_pairs)

        const response = await push_quotes_to_contract(quotes);

        console.log(`Pushed transaction ${response.transaction_id}`);
    }
    catch (e) {
        console.log(e.message)
    }
};

const run = async () => {
    send_quotes();
    const interval = config.interval * 1000 || 60 * 2 * 1000;
    setInterval(send_quotes, interval);
};

run();
