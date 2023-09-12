

function extract_gateio_pair(json) {
    if (!json) {
        return null;
    }
    const multiplier = Math.pow(10, 8);
    let price = parseFloat(json.result.price);
    if (isNaN(price)) {
        // handle the exception, e.g. return a default value or throw an error
        return { pair: 'waxpeth', value: 0 };
    }

    return { pair: 'waxpeth', value: Math.round(price * multiplier) };
}

module.exports = extract_gateio_pair