<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Artisan::call('app:setup-roles-and-permissions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop all roles and permissions (cleanup)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Remove all role-permission relations first (via truncates)
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('model_has_permissions')->truncate();

        // Then delete roles and permissions
        Role::query()->delete();
        Permission::query()->delete();
    }
};
