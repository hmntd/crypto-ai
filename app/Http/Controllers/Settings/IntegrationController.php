<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\SlackService;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationController extends Controller
{
    /**
     * Show the user's integrations settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/integrations', [
            'settings' => $request->user()->notificationSettings ?? [
                'telegram_user_id' => '',
                'slack_user_id' => '',
                'notifications_enabled' => true,
                'scheduled_time' => '09:00',
            ]
        ]);
    }

    /**
     * Update the user's integrations settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'telegram_user_id' => 'nullable|string',
            'slack_user_id' => 'nullable|string',
            'notifications_enabled' => 'required|boolean',
            'scheduled_time' => 'required|date_format:H:i',
        ]);

        $request->user()->notificationSettings()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return back()->with('message', 'Settings updated successfully!');
    }

    /**
     * Test the connection for a specific provider.
     */
    public function testConnection(Request $request, string $provider)
    {
        $user = $request->user();
        $service = $this->getService($provider);

        $key = $request->input('key') ?? ($provider === 'slack'
            ? config('services.slack.notifications.bot_token')
            : $user->notificationSettings->telegram_user_id);

        $isValid = $service->validateKey($user, $key);

        return response()->json([
            'success' => $isValid,
            'message' => $isValid
                ? "Successfully connected to " . ucfirst($provider)
                : "Failed to connect to " . ucfirst($provider),
        ]);
    }

    /**
     * Send a message.
     */
    public function sendMessage(Request $request, string $provider)
    {
        $request->validate([
            'message' => 'required',
        ]);

        $user = $request->user();
        $service = $this->getService($provider);

        $sent = $service->sendMessage($user, $request->input('message'));

        return response()->json([
            'success' => $sent,
            'message' => $sent
                ? "Successfully message sent to " . ucfirst($provider)
                : "Failed to send message to " . ucfirst($provider),
        ]);
    }

    /**
     * Internal helper to resolve the service.
     */
    protected function getService(string $provider)
    {
        return match ($provider) {
            'slack' => app(SlackService::class),
            'telegram' => app(TelegramService::class),
            default => abort(HttpResponse::HTTP_NOT_FOUND, "Provider not supported"),
        };
    }
}
