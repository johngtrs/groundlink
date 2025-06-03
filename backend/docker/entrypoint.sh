#!/bin/bash

# Set up Laravel shortcuts (aliases only useful if you exec into container later)
echo "
alias pa='php artisan'
alias pam='php artisan migrate'
alias pamr='php artisan migrate:rollback'
alias pamm='php artisan make:migration'
alias pat='php artisan test'
alias patf='php artisan test --filter'
" >> ~/.bashrc

composer install

# Laravel maintenance & DB setup
php artisan migrate --force

# Only seed if database is empty (example: no users)
if [ "$(php artisan tinker --execute='echo \App\Models\User::count();')" -eq "0" ]; then
  echo "Seeding database..."
  php artisan db:seed
else
  echo "Database already seeded, skipping."
fi

php artisan event:clear
php artisan view:clear
php artisan cache:clear
php artisan route:clear
php artisan config:clear

exec "$@"
