# Laravel Inertia DataTable

[![Latest Package Version](https://img.shields.io/packagist/v/raprmdn/laravel-inertia-datatables.svg)](https://packagist.org/packages/raprmdn/laravel-inertia-datatables)

A Laravel and Inertia React learning application for
[`raprmdn/laravel-inertia-datatables`](https://github.com/raprmdn/laravel-inertia-datatables).
It demonstrates server-side search, filters, sorting, relationships, and
pagination through one Order Operations dataset.

## Examples

1. **Basic Orders**: searchable columns, filters, sorting, and pagination.
2. **Relationships**: customers, companies, countries, agents, and item counts.
3. **Custom Columns**: aliases, JSON fields, callbacks, and custom ordering.
4. **Query Builder**: the same request contract with joined query results.
5. **API Explorer**: paginated Laravel API resources with interactive parameters.

## Request Contract

The examples share a predictable URL contract:

```text
?search=ORD&filters[]=status:pending&col=placed_at&sort=desc&limit=25&page=1
```

- `search`: global search value
- `filters[]`: repeatable `column:value` filters
- `col`: public sort key
- `sort`: `asc` or `desc`
- `limit`: rows per page
- `page`: current page

Date filters use `dd-MM-yyyy` values.

## Installation

```bash
git clone https://github.com/raprmdn/laravel-inertia-datatable.git
cd laravel-inertia-datatable

composer install
npm install

cp .env.example .env
php artisan key:generate
```

Configure a MySQL database in `.env`, then build and seed the application:

```bash
php artisan migrate --seed
npm run build
```

The Order Operations seeder creates 2,500 orders and their related countries,
companies, customers, agents, and order items.

## Backend Example

Controllers define the public query keys and their trusted database columns:

```php
use App\Models\Order;
use Raprmdn\DataTables\Column;
use Raprmdn\DataTables\Facades\DataTable;

$orders = DataTable::query(Order::query())
    ->columnDefinitions([
        Column::group(['order' => 'order_number', 'reference'])
            ->searchable(),
        Column::make('order')->sortable('order_number'),
        Column::make('customer', 'customer.name')
            ->searchable()
            ->filterable('customer.id')
            ->sortable(),
        Column::make('placed_at')
            ->dateRange()
            ->sortable(),
    ])
    ->applyFilters($request->query('filters', []))
    ->applySort($request->query('col'))
    ->perPage($request->integer('limit', 10))
    ->make();
```

## Frontend

The React examples compose shared `TableToolbar`, `TablePagination`, sorting,
debounced search, API option, and date-range components. Query state stays in the
URL, so filtered and sorted views can be shared or revisited directly.

## Project Structure

```text
app/Http/Controllers/                 Lesson and API controllers
app/Http/Resources/                   Inertia and API response resources
config/inertia-datatables.php         Package configuration
database/seeders/                     Order Operations dataset
resources/js/components/data-table/   Shared datatable controls
resources/js/pages/examples/          The six learning examples
```

## Screenshots

![Laravel Inertia Datatable \{caption: Basic Orders DataTable}](https://ik.imagekit.io/peqmgufll/content/laravel-inertia-datatable-v2-basic-orders.png)
![Laravel Inertia Datatable \{caption: Orders & Customers DataTable}](https://ik.imagekit.io/peqmgufll/content/laravel-inertia-datatable-v2-orders-and-customers.png)
![Laravel Inertia Datatable \{caption: Custom Columns DataTable}](https://ik.imagekit.io/peqmgufll/content/laravel-inertia-datatable-v2-custom-columns.png)
![Laravel Inertia Datatable \{caption: Query Builders DataTable}](https://ik.imagekit.io/peqmgufll/content/laravel-inertia-datatable-v2-join-order.png)
![Laravel Inertia Datatable \{caption: API Explorer}](https://ik.imagekit.io/peqmgufll/content/laravel-inertia-datatable-v2-api-explorer.png)

## Package Documentation

Installation, complete builder API, filtering details, and upgrade guidance live
in the package repository:

<https://github.com/raprmdn/laravel-inertia-datatables>

## License

This example application is open-sourced software licensed under the MIT license.
