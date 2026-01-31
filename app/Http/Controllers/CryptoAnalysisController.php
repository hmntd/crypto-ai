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

    public function index(): JsonResponse
    {
        $cryptos = Cryptocurrency::with(['prices' => function ($query) {
            $query->latest('recorded_at')->limit(2);
        }])->get()->map(function ($crypto) {
            $latest = $crypto->prices->first();
            $previous = $crypto->prices->last();

            return [
                'id' => $crypto->id,
                'symbol' => $crypto->symbol,
                'name' => $crypto->name,
                'image' => $crypto->image_url,
                'priceToday' => $latest?->price ?? 0,
                'priceYesterday' => $previous?->price ?? 0,
            ];
        });

        return response()->json($cryptos);
    }

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

    protected function cacheKey(int $cryptoId): string
    {
        return "crypto_ai_analysis:{$cryptoId}";
    }
}
