<?php

namespace App\Providers;

use App\DataTable\DataTable;
use Illuminate\Support\ServiceProvider;

class DataTableServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DataTable::class, function () {
            return new DataTable();
        });
    }

    public function boot(): void
    {

    }
}
