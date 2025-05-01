<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SetupRolesAndPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:setup-roles-and-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create default roles and permissions for the application';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Creating roles and permissions...');

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // All permissions grouped by context
        $permissions = config('roles.permissions');
        $roles       = config('roles.roles');

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and sync permissions
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }

        $this->info('Roles and permissions successfully created.');

        return Command::SUCCESS;
    }
}
