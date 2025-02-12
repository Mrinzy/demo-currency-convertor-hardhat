const currencyService = require("../services/currencyService");
const { BadRequestError, InternalServerError } = require('../utils/errors');

async function convert(req, res) {
    try {
        const { from, to, amount } = req.query;

        if (!from || !to || !amount || isNaN(amount)) {
            throw new BadRequestError("Invalid parameters. Required: from, to, amount (numeric)");
        }

        const { exchangeRate, convertedAmount } = await currencyService.convertCurrency(from, to, parseFloat(amount));

        res.json({
            from,
            to,
            amount,
            exchangeRate,
            convertedAmount
        });

    } catch (error) {
        throw new InternalServerError(error.message);
    }
}

module.exports = { convert };
