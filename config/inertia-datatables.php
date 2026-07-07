<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Query Parameter Names
    |--------------------------------------------------------------------------
    |
    | These keys define how the datatable reads values from the request query.
    |
    */
    'query_params' => [
        'search' => 'search',
        'filters' => 'filters',
        'column' => 'col',
        'direction' => 'sort',
        'limit' => 'limit',
    ],

    /*
    |--------------------------------------------------------------------------
    | Date Format
    |--------------------------------------------------------------------------
    |
    | Incoming date range filters use this format.
    | Example: 01-06-2026
    |
    */
    'date_format' => 'd-m-Y',

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */
    'pagination' => [
        'default_per_page' => 10,
        'max_per_page' => 100,
        'on_each_side' => 1,
    ],

    /*
    |--------------------------------------------------------------------------
    | JSON Columns
    |--------------------------------------------------------------------------
    |
    | Columns or JSON paths listed here use whereJsonContains when filtered.
    | Use this for JSON arrays or JSON columns where the selected value should
    | be checked inside the JSON value.
    |
    | Examples:
    | - 'channels'
    | - 'filters->reward'
    |
    | JSON scalar paths such as 'filters->status' usually do not need to be
    | listed here because Laravel can filter them with a normal where condition.
    |
    */
    'json_columns' => [
        // 'channels',
        // 'filters->reward',
    ],
];
