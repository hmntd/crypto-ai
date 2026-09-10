<?php

namespace App\Http\Controllers;

use App\Models\AiAnalysisCache;
use App\Models\Cryptocurrency;
use App\Services\CryptoAnalysisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CryptoAnalysisController extends Controller
{
    protected int $cacheTtlMinutes = 30;

    public function __construct(
        protected CryptoAnalysisService $analysisService
    ) {}

    /**
     * Return a list of cryptocurrencies with their current and yesterday prices, plus favourite status.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $favouriteIds = $user ? $user->favouriteCryptos()->pluck('cryptocurrencies.id')->toArray() : [];

        $cryptos = Cryptocurrency::with(['prices' => function ($query) {
            $query->orderBy('recorded_at', 'desc');
        }])->get()->map(function ($crypto) use ($favouriteIds) {

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
                'is_favourite' => in_array($crypto->id, $favouriteIds),
                'prices' => $history->map(fn($p) => [
                    'price' => (float) $p->price,
                    'date' => $p->recorded_at->toDateTimeString(),
                ]),
            ];
        });

        return response()->json($cryptos);
    }

    /**
     * Return the AI analysis for a given cryptocurrency using DB caching.
     * 
     * @param Cryptocurrency $crypto
     * @return JsonResponse
     * @throws \Throwable
     */
    public function show(Cryptocurrency $crypto): JsonResponse
    {
        try {
            // Check Database Cache
            $cached = AiAnalysisCache::where('cryptocurrency_id', $crypto->id)
                ->where('expires_at', '>', now())
                ->first();

            if ($cached && !empty($cached->analysis)) {
                return response()->json([
                    'source' => 'db_cache',
                    'data' => $cached->analysis,
                ]);
            }

            // Generate fresh analysis from AI Service
            $result = $this->analysisService->analyze($crypto);

            // Store in Database Cache
            AiAnalysisCache::updateOrCreate(
                ['cryptocurrency_id' => $crypto->id],
                [
                    'analysis' => $result,
                    'expires_at' => now()->addMinutes($this->cacheTtlMinutes),
                ]
            );

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
}
