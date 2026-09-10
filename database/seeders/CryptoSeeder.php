<?php

namespace Database\Seeders;

use App\Models\Cryptocurrency;
use App\Models\Price;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CryptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cryptos = [
            ['name' => 'Bitcoin', 'symbol' => 'BTC', 'api_id' => 'bitcoin', 'base_price' => 92500, 'image_url' => 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'],
            ['name' => 'Ethereum', 'symbol' => 'ETH', 'api_id' => 'ethereum', 'base_price' => 3400, 'image_url' => 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'],
            ['name' => 'Tether', 'symbol' => 'USDT', 'api_id' => 'tether', 'base_price' => 1.00, 'image_url' => 'https://assets.coingecko.com/coins/images/325/large/Tether.png'],
            ['name' => 'BNB', 'symbol' => 'BNB', 'api_id' => 'binancecoin', 'base_price' => 650, 'image_url' => 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'],
            ['name' => 'Solana', 'symbol' => 'SOL', 'api_id' => 'solana', 'base_price' => 195, 'image_url' => 'https://assets.coingecko.com/coins/images/4128/large/solana.png'],
            ['name' => 'XRP', 'symbol' => 'XRP', 'api_id' => 'ripple', 'base_price' => 2.30, 'image_url' => 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'],
            ['name' => 'USDC', 'symbol' => 'USDC', 'api_id' => 'usd-coin', 'base_price' => 1.00, 'image_url' => 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'],
            ['name' => 'Cardano', 'symbol' => 'ADA', 'api_id' => 'cardano', 'base_price' => 0.85, 'image_url' => 'https://assets.coingecko.com/coins/images/975/large/cardano.png'],
            ['name' => 'Dogecoin', 'symbol' => 'DOGE', 'api_id' => 'dogecoin', 'base_price' => 0.28, 'image_url' => 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png'],
            ['name' => 'Toncoin', 'symbol' => 'TON', 'api_id' => 'the-open-network', 'base_price' => 6.20, 'image_url' => 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png'],
            ['name' => 'TRON', 'symbol' => 'TRX', 'api_id' => 'tron', 'base_price' => 0.22, 'image_url' => 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png'],
            ['name' => 'Polkadot', 'symbol' => 'DOT', 'api_id' => 'polkadot', 'base_price' => 8.40, 'image_url' => 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png'],
            ['name' => 'Litecoin', 'symbol' => 'LTC', 'api_id' => 'litecoin', 'base_price' => 115, 'image_url' => 'https://assets.coingecko.com/coins/images/2/large/litecoin.png'],
            ['name' => 'Avalanche', 'symbol' => 'AVAX', 'api_id' => 'avalanche-2', 'base_price' => 38.5, 'image_url' => 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png'],
            ['name' => 'Chainlink', 'symbol' => 'LINK', 'api_id' => 'chainlink', 'base_price' => 19.8, 'image_url' => 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png'],
        ];

        foreach ($cryptos as $item) {
            $crypto = Cryptocurrency::updateOrCreate(
                ['symbol' => $item['symbol']],
                [
                    'name' => $item['name'],
                    'symbol' => $item['symbol'],
                    'api_id' => $item['api_id'],
                    'image_url' => $item['image_url'],
                ]
            );

            // Generate 90 days of realistic prices
            $base = $item['base_price'];
            for ($i = 90; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->startOfDay();
                $variance = 1 + (sin($i / 3.0) * 0.04) + ((rand(-20, 20) / 1000.0));
                $priceVal = round($base * $variance, 4);

                Price::updateOrCreate(
                    [
                        'cryptocurrency_id' => $crypto->id,
                        'recorded_at' => $date,
                    ],
                    [
                        'price' => $priceVal,
                    ]
                );
            }
        }
    }
}
