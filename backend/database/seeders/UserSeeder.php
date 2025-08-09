<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        $admins = [
            [
                'name' => 'Jhonatan Veloza',
                'email' => 'jhonatan@example.com',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Owen Moreno',
                'email' => 'owen@example.com',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Felipe Perez',
                'email' => 'felipe@example.com',
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($admins as $adminData) {
            $user = User::firstOrCreate(
                ['email' => $adminData['email']],
                [
                    'name' => $adminData['name'],
                    'password' => $adminData['password'],
                ]
            );

            $user->assignRole($adminRole);
        }
    }
}
