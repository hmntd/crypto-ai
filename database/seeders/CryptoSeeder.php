<?php

namespace Database\Seeders;

use App\Models\Cryptocurrency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CryptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cryptos = [
            [
                'name' => 'Bitcoin',
                'symbol' => 'BTC',
                'api_id' => 'bitcoin',
                'image_url' => 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            ],
            [
                'name' => 'Ethereum',
                'symbol' => 'ETH',
                'api_id' => 'ethereum',
                'image_url' => 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            ],
            [
                'name' => 'Tether',
                'symbol' => 'USDT',
                'api_id' => 'tether',
                'image_url' => 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
            ],
            [
                'name' => 'BNB',
                'symbol' => 'BNB',
                'api_id' => 'binancecoin',
                'image_url' => 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
            ],
            [
                'name' => 'Solana',
                'symbol' => 'SOL',
                'api_id' => 'solana',
                'image_url' => 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
            ],
            [
                'name' => 'XRP',
                'symbol' => 'XRP',
                'api_id' => 'ripple',
                'image_url' => 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
            ],
            [
                'name' => 'USDC',
                'symbol' => 'USDC',
                'api_id' => 'usd-coin',
                'image_url' => 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
            ],
            [
                'name' => 'Cardano',
                'symbol' => 'ADA',
                'api_id' => 'cardano',
                'image_url' => 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
            ],
            [
                'name' => 'Dogecoin',
                'symbol' => 'DOGE',
                'api_id' => 'dogecoin',
                'image_url' => 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
            ],
            [
                'name' => 'Toncoin',
                'symbol' => 'TON',
                'api_id' => 'the-open-network',
                'image_url' => 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png',
            ],
            [
                'name' => 'TRON',
                'symbol' => 'TRX',
                'api_id' => 'tron',
                'image_url' => 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
            ],
            [
                'name' => 'Polkadot',
                'symbol' => 'DOT',
                'api_id' => 'polkadot',
                'image_url' => 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
            ],
            [
                'name' => 'Litecoin',
                'symbol' => 'LTC',
                'api_id' => 'litecoin',
                'image_url' => 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
            ],
            [
                'name' => 'Avalanche',
                'symbol' => 'AVAX',
                'api_id' => 'avalanche-2',
                'image_url' => 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png',
            ],
        ];

        foreach ($cryptos as $crypto) {
            Cryptocurrency::updateOrCreate(
                ['symbol' => $crypto['symbol']],
                $crypto
            );
        }
    }
}
