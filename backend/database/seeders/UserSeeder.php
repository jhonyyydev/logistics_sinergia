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

        $adminData = [
            'name'     => 'Jhonatan Veloza',
            'email'    => 'jhonatan@example.com',
            'password' => Hash::make('password123'),
            'address'  => '123 Main Street, Bogotá',
            'phone'    => '+57 300 123 4567',
            'type'     => 'national'
        ];

        $user = User::updateOrCreate(
            ['email' => $adminData['email']],
            $adminData
        );

        $user->assignRole($adminRole);
    }
}
