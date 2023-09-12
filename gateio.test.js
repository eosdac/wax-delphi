const extract_gateio_pair = require("./extract_gateio_pair");

describe('extract_gateio_pair', () => {

    it('should return the expected output when valid JSON input is provided for a small amount', () => {
        const json = {
            result: {
                price: '0.12345678'
            }
        };
        const expectedOutput = {
            pair: 'waxpeth',
            value: 12345678
        };

        const result = extract_gateio_pair(json);

        expect(result).toEqual(expectedOutput);
    });

    // Tests that valid JSON input with a non-zero price returns the expected output
    it('should return the expected output when valid JSON input with a >0 price is provided', () => {
        const json = {
            result: {
                price: '1.23456789'
            }
        };
        const expectedOutput = {
            pair: 'waxpeth',
            value: 123456789
        };

        const result = extract_gateio_pair(json);

        expect(result).toEqual(expectedOutput);
    });

    // Tests that valid JSON input with a zero price returns the expected output
    it('should return the expected output when valid JSON input with a zero price is provided', () => {
        const json = {
            result: {
                price: '0'
            }
        };
        const expectedOutput = {
            pair: 'waxpeth',
            value: 0
        };

        const result = extract_gateio_pair(json);

        expect(result).toEqual(expectedOutput);
    });

    // Tests that valid JSON input with a large price returns the expected output
    it('should return the expected output when valid JSON input with a large price is provided', () => {
        const json = {
            result: {
                price: '123456789.12345678'
            }
        };
        const expectedOutput = {
            pair: 'waxpeth',
            value: 12345678912345678
        };

        const result = extract_gateio_pair(json);

        expect(result).toEqual(expectedOutput);
    });

    // Tests that valid JSON input with a small price returns the expected output
    it('should return the expected output when valid JSON input with a smallest price is provided', () => {
        const json = {
            result: {
                price: '0.00000001'
            }
        };
        const expectedOutput = {
            pair: 'waxpeth',
            value: 1
        };

        const result = extract_gateio_pair(json);

        expect(result).toEqual(expectedOutput);
    });

    // Tests that invalid JSON input returns null
    it('should return null when invalid JSON input is provided', () => {
        const json = null;

        const result = extract_gateio_pair(json);

        expect(result).toBeNull();
    });
});
