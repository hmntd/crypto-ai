<?php

namespace App\Console\Commands;

use App\Models\Cryptocurrency;
use App\Models\Price;
use App\Services\CoingeckoService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class FetchDailyCryptoPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-daily-crypto-prices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch today prices for all tracked cryptos';

    /**
     * Execute the console command.
     */
    public function handle(CoingeckoService $coingecko)
    {
        $cryptos = Cryptocurrency::all();

        $prices = $coingecko->getTodayPrices(
            $cryptos->pluck('api_id')->toArray()
        );

        foreach ($cryptos as $crypto) {
            $price = $prices[$crypto->api_id]['usd'] ?? null;

            if (!$price) {
                continue;
            }

            Price::updateOrCreate(
                [
                    'cryptocurrency_id' => $crypto->id,
                    'recoreded_at' => Carbon::today(),
                ],
                [
                    'price' => $price,
                ]
            );
        }

        $this->info('Daily crypto prices fetched successfully.');
    }
}
