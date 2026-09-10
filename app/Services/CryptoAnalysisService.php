<?php

namespace App\Services;

use App\Models\Cryptocurrency;
use App\Models\Price;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class CryptoAnalysisService
{
    protected LocalLLMService $llm;

    public function __construct(LocalLLMService $llm)
    {
        $this->llm = $llm;
    }

    /**
     * Main entry point
     */
    public function analyze(Cryptocurrency $crypto): array
    {
        $history = $this->loadHistory($crypto);

        if ($history->count() < 10) {
            return [
                'recommendation' => 'HOLD',
                'confidence' => 0,
                'reason' => 'Not enough historical data for analysis.',
            ];
        }

        $indicators = $this->computeIndicators($history);

        $compressedHistory = $this->compressHistory($history);

        $promptData = [
            'symbol' => $crypto->symbol,
            'name' => $crypto->name,
            'current_price' => round($history->last()['price'], 4),
            'indicators' => $indicators,
            'history' => $compressedHistory,
        ];

        $prompt = $this->buildPrompt($promptData);

        $rawResponse = $this->llm->generate($prompt);

        $parsed = $this->parseLLMResponse($rawResponse);

        return $parsed;
    }

    /**
     * Load last 90 days of price history (daily)
     */
    protected function loadHistory(Cryptocurrency $crypto): Collection
    {
        return Price::query()
            ->where('cryptocurrency_id', $crypto->id)
            ->where('recorded_at', '>=', Carbon::now()->subDays(90))
            ->orderBy('recorded_at')
            ->get(['recorded_at', 'price'])
            ->map(fn($row) => [
                'date' => $row->recorded_at->toDateString(),
                'price' => (float) $row->price,
            ]);
    }

    /**
     * Compute technical indicators
     */
    protected function computeIndicators(Collection $history): array
    {
        $prices = $history->pluck('price');

        $last = $prices->last();
        $first7 = $prices->slice(-7)->first();
        $first30 = $prices->slice(-30)->first();

        $change7 = $first7
            ? (($last - $first7) / $first7) * 100
            : 0;

        $change30 = $first30
            ? (($last - $first30) / $first30) * 100
            : 0;

        $sma7 = $prices->slice(-7)->avg();
        $sma30 = $prices->slice(-30)->avg();

        $volatility = $this->calculateStdDev(
            $prices->slice(-30)->toArray()
        );

        return [
            'change_7d_pct' => round($change7, 2),
            'change_30d_pct' => round($change30, 2),
            'sma_7' => round($sma7, 4),
            'sma_30' => round($sma30, 4),
            'volatility_30d' => round($volatility, 4),
            'trend_7d' => $this->trendLabel($change7),
            'trend_30d' => $this->trendLabel($change30),
        ];
    }

    /**
     * Downsample history to max ~60 points
     */
    protected function compressHistory(Collection $history): array
    {
        $maxPoints = 60;

        if ($history->count() <= $maxPoints) {
            return $history->values()->all();
        }

        $step = (int) floor($history->count() / $maxPoints);

        return $history
            ->filter(fn($_, $i) => $i % $step === 0)
            ->take($maxPoints)
            ->values()
            ->all();
    }

    /**
     * Build professional LLM prompt
     */
    protected function buildPrompt(array $data): string
    {
        return <<<PROMPT
            You are a conservative professional crypto market analyst.

            You analyze historical price data and technical indicators.
            You do NOT predict the future.
            You only analyze trends, momentum, and relative strength.

            IMPORTANT:
            - Be conservative
            - This is NOT financial advice
            - Do NOT make guarantees

            Crypto:
            Symbol: {$data['symbol']}
            Name: {$data['name']}
            Current Price: {$data['current_price']}

            Indicators:
            7d_change_pct: {$data['indicators']['change_7d_pct']}
            30d_change_pct: {$data['indicators']['change_30d_pct']}
            sma_7: {$data['indicators']['sma_7']}
            sma_30: {$data['indicators']['sma_30']}
            volatility_30d: {$data['indicators']['volatility_30d']}
            trend_7d: {$data['indicators']['trend_7d']}
            trend_30d: {$data['indicators']['trend_30d']}

            Recent Price History (JSON):
            {$this->jsonEncodePretty($data['history'])}

            Your task:
            1. Decide: BUY, SELL, or HOLD
            2. Confidence (0-100)
            3. Short professional reasoning (2-3 sentences)

            Return STRICT JSON ONLY:

            {
            "recommendation": "BUY|SELL|HOLD",
            "confidence": number,
            "reason": "string"
            }
            PROMPT;
    }

    /**
     * Parse and validate LLM JSON
     */
    protected function parseLLMResponse(string $raw): array
    {
        try {
            $raw = trim($raw);

            $data = json_decode($raw, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                return $this->normalizeLLMData($data);
            }

            $json = $this->extractJsonObject($raw);
            $data = json_decode($json, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
                throw new \Exception('Invalid JSON after extraction');
            }

            return $this->normalizeLLMData($data);
        } catch (\Throwable $e) {
            Log::error('LLM parse failed', [
                'error' => $e->getMessage(),
                'raw' => $raw,
            ]);

            return [
                'recommendation' => 'HOLD',
                'confidence' => 0,
                'reason' => 'AI analysis failed to parse response.',
            ];
        }
    }

    protected function normalizeLLMData(array $data): array
    {
        return [
            'recommendation' => strtoupper($data['recommendation'] ?? 'HOLD'),
            'confidence' => max(0, min(100, (int) ($data['confidence'] ?? 0))),
            'reason' => (string) ($data['reason'] ?? 'No reason provided.'),
        ];
    }

    protected function extractJsonObject(string $text): string
    {
        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return $matches[0];
        }

        throw new \Exception('No JSON object found in LLM response');
    }

    /**
     * Helpers
     */
    protected function calculateStdDev(array $values): float
    {
        $count = count($values);
        if ($count === 0) return 0;

        $mean = array_sum($values) / $count;
        $variance = 0;

        foreach ($values as $v) {
            $variance += pow($v - $mean, 2);
        }

        return sqrt($variance / $count);
    }

    protected function trendLabel(float $change): string
    {
        if ($change > 2) return 'UP';
        if ($change < -2) return 'DOWN';
        return 'SIDEWAYS';
    }

    protected function extractJson(string $text): string
    {
        if (preg_match('/\{.*\}/s', $text, $matches)) {
            return $matches[0];
        }

        throw new \Exception('No JSON object found in LLM response');
    }

    protected function jsonEncodePretty($data): string
    {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
