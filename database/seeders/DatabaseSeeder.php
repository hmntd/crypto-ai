<?php

namespace Database\Seeders;

use App\Models\Cryptocurrency;
use App\Models\Price;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Cryptocurrency::factory(3)
            ->has(Price::factory()->count(10))
            ->create();
    }
}
