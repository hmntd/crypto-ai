<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\SlackService;
use App\Services\TelegramService;
use Illuminate\Console\Command;

class SendFavouriteCoinNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-favourite-coin-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily price notifications for users\' favourite cryptocurrencies';

    /**
     * Execute the console command.
     */
    public function handle(SlackService $slackService, TelegramService $telegramService)
    {
        $users = User::whereHas('notificationSettings', function ($query) {
            $query->where('notifications_enabled', true);
        })->with(['favouriteCryptos.prices' => function ($q) {
            $q->orderBy('recorded_at', 'desc')->take(2);
        }, 'notificationSettings'])->get();

        $count = 0;

        foreach ($users as $user) {
            $favourites = $user->favouriteCryptos;

            if ($favourites->isEmpty()) {
                continue;
            }

            $messageLines = ["⭐ *Favourite Coins Daily Price Update* ⭐\n"];

            foreach ($favourites as $crypto) {
                $prices = $crypto->prices;
                $latest = $prices->first();
                $previous = $prices->skip(1)->first();

                $currentPrice = $latest ? (float) $latest->price : 0;
                $prevPrice = $previous ? (float) $previous->price : $currentPrice;

                $changePercent = $prevPrice > 0 ? (($currentPrice - $prevPrice) / $prevPrice) * 100 : 0;
                $changeFormatted = ($changePercent >= 0 ? '+' : '') . number_format($changePercent, 2) . '%';
                $emoji = $changePercent >= 0 ? '🟢' : '🔴';

                $messageLines[] = "{$emoji} *{$crypto->name} ({$crypto->symbol})*: \${$currentPrice} ({$changeFormatted})";
            }

            $fullMessage = implode("\n", $messageLines);

            // Send via Telegram if configured
            $setting = $user->notificationSettings->first();
            if ($setting && $setting->telegram_user_id) {
                $telegramService->sendMessage($user, $fullMessage);
            }

            // Send via Slack if configured
            if ($setting && $setting->slack_user_id) {
                $slackService->sendMessage($user, $fullMessage);
            }

            $count++;
        }

        $this->info("Sent favourite coin notifications to {$count} users.");
    }
}
