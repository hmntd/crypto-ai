<?php

namespace App\Console\Commands;

use App\Models\Cryptocurrency;
use App\Models\Price;
use App\Services\CoingeckoService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class FetchHistoricalCryptoPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-historical-crypto-prices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch full historical prices from Coingecko';

    /**
     * Execute the console command.
     */
    public function handle(CoingeckoService $coingecko)
    {
        $cryptos = Cryptocurrency::where('id', '=', 13)->get();

        foreach ($cryptos as $crypto) {
            $this->info("Fetching history for {$crypto->symbol}");

            $prices = $coingecko->getHistoricalPrices($crypto->api_id);

            foreach ($prices as [$timestamp, $price]) {
                $date = Carbon::createFromTimestampMs($timestamp)->toDateString();

                Price::updateOrCreate(
                    [
                        'cryptocurrency_id' => $crypto->id,
                        'recorded_at' => $date,
                    ],
                    [
                        'price' => $price,
                    ]
                );
            }
        }

        $this->info('Historical backfill completed for all cryptocurrencies.');
    }
}
