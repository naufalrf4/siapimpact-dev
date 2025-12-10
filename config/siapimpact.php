<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Maximum Submissions Per IP Per Day
    |--------------------------------------------------------------------------
    |
    | This value determines the maximum number of registration submissions
    | allowed from a single IP address within a 24-hour period. This helps
    | prevent abuse from shared networks while still allowing legitimate
    | submissions from campus or lab environments.
    |
    */
    'max_submissions_per_ip_per_day' => env('SIAPIMPACT_MAX_SUBMISSIONS_PER_IP', 5),

    /*
    |--------------------------------------------------------------------------
    | Registration Rate Limit
    |--------------------------------------------------------------------------
    |
    | The number of registration attempts allowed per minute per IP address.
    | This is enforced via Laravel's throttle middleware.
    |
    */
    'registration_rate_limit' => env('SIAPIMPACT_REGISTRATION_RATE_LIMIT', 10),
];
