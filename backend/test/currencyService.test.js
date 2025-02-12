const currencyService = require("../services/currencyService");
const { BadRequestError, ServerUnavailableError } = require('../utils/errors');
const axios = require("axios");

jest.mock("axios");  // Mock axios for the test

describe("Currency Service", () => {
    it("should successfully fetch exchange rate from API", async () => {
        const mockRates = {
            EUR: 0.85,
            GBP: 0.75
        };

        // Mock axios response
        axios.get.mockResolvedValue({
            data: {
                result: "success",
                conversion_rates: mockRates
            }
        });

        const rates = await currencyService.convertCurrency("USD", "EUR", 100);
        expect(rates).toHaveProperty("convertedAmount");
        expect(rates).toHaveProperty("exchangeRate");
    });

    it("should throw BadRequestError for invalid currency code", async () => {
        // Mock a successful API response, but we will pass invalid target currency
        axios.get.mockResolvedValue({
            data: {
                result: "success",
                conversion_rates: { EUR: 0.85 }
            }
        });

        try {
            await currencyService.convertCurrency("USD", "XYZ", 100);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toBe("Invalid target currency code");
        }
    });

    it("should return converted amount correctly", async () => {
        const mockRates = {
            EUR: 0.85
        };

        // Mock axios response
        axios.get.mockResolvedValue({
            data: {
                result: "success",
                conversion_rates: mockRates
            }
        });

        const result = await currencyService.convertCurrency("USD", "EUR", 100);
        expect(result.convertedAmount).toBe("85.00");
        expect(result.exchangeRate).toBe(0.85);
    });

    it("should throw ServerUnavailableError when the external API fails", async () => {
        // Mock axios to simulate an API failure
        axios.get.mockRejectedValue(new Error("API error"));

        try {
            await currencyService.convertCurrency("USD", "EUR", 100);
        } catch (error) {
            expect(error).toBeInstanceOf(ServerUnavailableError);
            expect(error.message).toBe("Failed to fetch exchange rates");
        }
    });
});
