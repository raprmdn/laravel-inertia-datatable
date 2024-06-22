## Laravel Inertia DataTable

Server-side pagination, filter, live search, sort, and limit data to be displayed on each page.

Source Code : [GitHub](https://github.com/raprmdn/laravel-inertia-datatable)

### Features

- Server-side pagination
- Live search
- Sort
- Limit
- Filter

### Tech Stack

- [Laravel](https://laravel.com/)
- [ReactJS](https://reactjs.org/)
- [InertiaJS](https://inertiajs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn](https://shadcn.com/)

### Prerequisites

- [Composer](https://getcomposer.org/)
- [NodeJS](https://nodejs.org/en/)

## Installation and Usage

Clone the repository

```bash
git clone https://github.com/raprmdn/laravel-inertia-datatable.git
```

cd into the project directory

```bash
cd laravel-inertia-datatable
```

Install dependencies

```bash
# Laravel
composer install

# InertiaJS and ReactJS
npm install
```

copy `.env.example` to `.env` and set your database configuration

```bash
cp .env.example .env
```

Generate an application key

```bash
php artisan key:generate
```

Run the database migrations

```bash
php artisan migrate
```

Seed the database

```bash
php artisan db:seed
```

Start the local development server

```bash
# Laravel
php artisan serve

# InertiaJS and ReactJS
npm run dev
```

## Screenshots

![Laravel Inertia Datatable {caption: Posts DataTable} ](https://ik.imagekit.io/peqmgufll/content/laravel-inertia-datatable-posts.png?updatedAt=1719045961181)

![Laravel Inertia Datatable {caption: Users DataTable} ](https://ik.imagekit.io/peqmgufll/content/laravel-inertia-datatable-users.png?updatedAt=1719045961144)
