<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Global Permissions List
    |--------------------------------------------------------------------------
    |
    | This array defines all available permissions in the application.
    | Each permission follows a dot-notation convention for clarity
    | and logical grouping.
    |
    */

    'permissions' => [

        // User account management
        'user.profile.view',
        'user.profile.update',
        'user.account.delete',

        // Band resource permissions
        'band.view',
        'band.list',
        'band.manage',
        'band.concert.list',
        'band.concert.create',
        'band.concert.delete',

        // Venue resource permissions
        'venue.view',
        'venue.list',
        'venue.manage',
        'venue.schedule.view',
        'venue.schedule.manage',

        // Concert/event permissions
        'concert.create',
        'concert.update',
        'concert.cancel',
        'concert.list',
        'concert.view',

        // Booking system permissions (band ↔ venue interaction)
        'booking.request',
        'booking.approve',
        'booking.reject',
        'booking.view',
        'booking.list',
    ],

    /*
    |--------------------------------------------------------------------------
    | Role-Based Permission Mapping
    |--------------------------------------------------------------------------
    |
    | This section maps each application role to the set of permissions
    | that define what the user can do in the system.
    |
    */

    'roles' => [

        // Band role: musicians managing their profiles and concerts
        'band' => [
            'user.profile.view',
            'user.profile.update',
            'user.account.delete',

            'band.view',
            'band.list',
            'band.manage',
            'band.concert.list',
            'band.concert.create',
            'band.concert.delete',

            'venue.view',
            'venue.list',

            'concert.create',

            'booking.request',
            'booking.view',
            'booking.list',
        ],

        // Venue role: concert organizers managing space and bookings
        'venue' => [
            'user.profile.view',
            'user.profile.update',
            'user.account.delete',

            'venue.view',
            'venue.list',
            'venue.manage',
            'venue.schedule.view',
            'venue.schedule.manage',

            'band.view',
            'band.list',

            'concert.view',
            'concert.update',
            'concert.cancel',
            'concert.list',

            'booking.view',
            'booking.list',
            'booking.approve',
            'booking.reject',
        ],
    ],
];
