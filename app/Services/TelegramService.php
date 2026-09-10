<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected const API_TIMEOUT = 30;
    protected const API_BASE = 'https://api.telegram.org/bot';

    public function validateKey(User $user, string $key): bool
    {
        if (!$key) {
            return false;
        }

        try {
            $response = $this->makeRequest('POST', '/sendMessage', [
                'chat_id' => $key,
                'text' => 'Bot connection test',
                'disable_notification' => true,
            ]);

            return $response->successful()
                && $response->json('ok') === true;
        } catch (\Exception $e) {
            Log::warning('Telegram chat id validation failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function makeRequest(string $method, string $endpoint, array $data = []): Response
    {
        $url = self::API_BASE . config('services.telegram.bot_token') . $endpoint;

        $httpClient = Http::timeout(self::API_TIMEOUT)
            ->acceptJson();

        return match (strtoupper($method)) {
            'GET' => $httpClient->get($url, $data),
            'POST' => $httpClient->post($url, $data),
            default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}"),
        };
    }

    public function sendMessage(User $user, string $message): bool
    {
        if (!$user->notificationSettings?->telegram_user_id) {
            return false;
        }

        try {
            $response = $this->makeRequest('POST', '/sendMessage', [
                'chat_id' => $user->notificationSettings?->telegram_user_id,
                'text' => $message,
                'disable_notification' => true,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('Telegram message sending failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
