<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $roles = ['client', 'admin'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Create permissions
        $permissions = [
            'manage-clients',
            'manage-products',
            'manage-destinations',
            'manage-transport-units',
            'manage-deliveries'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign permissions to roles
        $admin = Role::findByName('admin');
        $admin->givePermissionTo([
            'manage-clients',
            'manage-products',
            'manage-destinations',
            'manage-transport-units',
            'manage-deliveries'
        ]);

        $client = Role::findByName('client');
        $client->givePermissionTo([
            'manage-deliveries'
        ]);
    }
}
