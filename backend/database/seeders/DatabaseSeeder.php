<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        if (!User::where('email', 'admin@meraki.com')->exists()) {
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@meraki.com',
                'password' => 'password',
                'role' => 'admin',
            ]);
        }

        if (!User::where('email', 'customer@meraki.com')->exists()) {
            User::create([
                'name' => 'Customer User',
                'email' => 'customer@meraki.com',
                'password' => 'password',
                'role' => 'customer',
            ]);
        }

        $this->call(CategoryAndProductSeeder::class);
    }
}
