<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use App\Services\CryptoAnalysisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CryptoAnalysisController extends Controller
{
    protected int $cacheTtl = 900;

    public function __construct(
        protected CryptoAnalysisService $analysisService
    ) {}

    /**
     * Return a list of cryptocurrencies with their current and yesterday prices.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $cryptos = Cryptocurrency::with(['prices' => function ($query) {
            $query->orderBy('recorded_at', 'desc');
        }])->get()->map(function ($crypto) {

            $history = $crypto->prices;
            $latest = $history->first();
            $previous = $history->skip(1)->first();

            return [
                'id' => $crypto->id,
                'name' => $crypto->name,
                'symbol' => $crypto->symbol,
                'image' => $crypto->image_url,
                'priceToday' => $latest ? (float) $latest->price : 0,
                'priceYesterday' => $previous ? (float) $previous->price : 0,
                'prices' => $history->map(fn($p) => [
                    'price' => (float) $p->price,
                    'date' => $p->recorded_at->toDateTimeString(),
                ]),
            ];
        });

        return response()->json($cryptos);
    }

    /**
     * Return the AI analysis for a given cryptocurrency.
     * 
     * @param Cryptocurrency $crypto
     * @return JsonResponse
     * @throws \Throwable
     */
    public function show(Cryptocurrency $crypto): JsonResponse
    {
        $cacheKey = $this->cacheKey($crypto->id);

        try {
            if (Cache::has($cacheKey)) {
                return response()->json([
                    'source' => 'cache',
                    'data' => Cache::get($cacheKey),
                ]);
            }

            $result = $this->analysisService->analyze($crypto);

            Cache::put($cacheKey, $result, $this->cacheTtl);

            return response()->json([
                'source' => 'llm',
                'data' => $result,
            ]);
        } catch (\Throwable $e) {
            Log::error('Crypto AI analysis failed', [
                'crypto_id' => $crypto->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'source' => 'error',
                'data' => [
                    'recommendation' => 'HOLD',
                    'confidence' => 0,
                    'reason' => 'AI analysis temporarily unavailable.',
                ],
            ], 500);
        }
    }

    /**
     * Returns a cache key for the given cryptocurrency ID.
     *
     * @param int $cryptoId
     * @return string
     */
    protected function cacheKey(int $cryptoId): string
    {
        return "crypto_ai_analysis:{$cryptoId}";
    }
}
