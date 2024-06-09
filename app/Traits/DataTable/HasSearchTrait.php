<?php

namespace App\Traits\DataTable;

trait HasSearchTrait
{
    protected array $searchable = [];

    protected function search(): void
    {
        $query = $this->query;
        $search = request()->query('search');

        if ($search) {
            $query->where(function ($query) use ($search) {
                $lower = 'LOWER';
                $like = 'LIKE';
                $searchTerm = '%' . strtolower($search) . '%';

                foreach ($this->searchable as $column) {
                    if (str()->contains($column, '.')) {
                        $parts = explode('.', $column);
                        $relationPath = implode('.', array_slice($parts, 0, -1));
                        $columnName = end($parts);

                        $query->orWhereHas($relationPath, function ($nestedQuery) use ($searchTerm, $lower, $like, $columnName) {
                            $nestedQuery->whereRaw("$lower($columnName) $like ?", [$searchTerm]);
                        });
                    } else {
                        $query->orWhereRaw("$lower($column) $like ?", [$searchTerm]);
                    }
                }
            });
        }
    }
}
