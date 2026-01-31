<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LocalLLMService
{
    protected string $baseUrl;
    protected string $model;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.llm.base_url', 'http://ollama:11434');
        $this->model = config('services.llm.model', 'llama3');
        $this->timeout = (int) config('services.llm.timeout', 120);
    }

    /**
     * Generate raw text from local LLM
     */
    public function generate(string $prompt): string
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/api/generate", [
                    'model' => $this->model,
                    'prompt' => $prompt,
                    'stream' => false,
                ]);

            if (!$response->successful()) {
                Log::error('LLM HTTP error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \Exception('LLM HTTP request failed');
            }

            $text = $response->json('response');

            if (!$text) {
                Log::error('LLM empty response', [
                    'json' => $response->json(),
                ]);

                throw new \Exception('LLM returned empty response');
            }

            return (string) $text;
        } catch (\Throwable $e) {
            Log::error('LLM generate exception', [
                'error' => $e->getMessage(),
            ]);

            return '';
        }
    }
}
