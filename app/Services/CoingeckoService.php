<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CoingeckoService
{
    protected string $baseUrl = 'https://api.coingecko.com/api/v3';

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
