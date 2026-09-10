<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CoingeckoService
{
    protected string $baseUrl = 'https://api.coingecko.com/api/v3';

    /**
     * Fetches the current prices for the given list of CoinGecko IDs
     *
     * @param array $coingeckoIds The list of CoinGecko IDs to fetch prices for
     *
     * @return array The current prices for the given list of CoinGecko IDs
     */
    public function getTodayPrices(array $coingeckoIds): array
    {
        return Http::withHeaders([
            'x-cg-api-key' => config('services.coingecko.api_key'),
        ])->get($this->baseUrl . '/simple/price', [
            'ids' => implode(',', $coingeckoIds),
            'vs_currencies' => 'usd',
        ])
            ->throw()
            ->json();
    }

    /**
     * Fetches the historical prices for the given CoinGecko ID
     *
     * @param string $coingeckoId The CoinGecko ID to fetch historical prices for
     *
     * @return array The historical prices for the given CoinGecko ID
     *
     * @throws \Illuminate\Http\ClientException If the request to CoinGecko fails
     */
    public function getHistoricalPrices(string $coingeckoId): array
    {
        $url = rtrim($this->baseUrl, '/') . "/coins/" . trim($coingeckoId) . "/market_chart";

        $response = Http::withHeaders([
            'x-cg-api-key' => config('services.coingecko.api_key')
        ])->get(
            $url,
            [
                'vs_currency' => 'usd',
                'days' => '90',
                'interval' => 'daily',
            ]
        );

        if ($response->failed()) {
            Log::error('CoinGecko Error: ' . $response->body() . ' URL: ' . $response->effectiveUri());
        }

        return $response->throw()->json()['prices'] ?? [];
    }
}
