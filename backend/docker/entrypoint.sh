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

# Laravel maintenance & DB setup
php artisan migrate --force
php artisan db:seed

php artisan event:clear
php artisan view:clear
php artisan cache:clear
php artisan route:clear
php artisan config:clear

exec "$@"
