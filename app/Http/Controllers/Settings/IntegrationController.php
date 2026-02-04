<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
}
