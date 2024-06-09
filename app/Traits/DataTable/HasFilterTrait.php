<?php

namespace App\Traits\DataTable;

trait HasFilterTrait
{
    protected array $filters = [];
    protected array $allowedFilters = [];

    protected function filter()
    {
        $query = $this->query;
        $filters = $this->filters;

        $query->where(function ($query) use ($filters) {
            if (count(array_diff($filters, $this->allowedFilters)) > 0) {
                return;
            }

            $conditions = [];

            foreach ($filters as $filter) {
                [$column, $value] = explode(':', $filter);

                if (!isset($conditions[$column])) {
                    $conditions[$column] = [];
                }

                $conditions[$column][] = $value;
            }

            foreach ($conditions as $column => $values) {
                if (str_contains($column, '.')) {
                    [$relation, $relatedColumn] = explode('.', $column);

                    $query->whereHas($relation, function ($query) use ($relatedColumn, $values) {
                        $this->applyConditions($query, $relatedColumn, $values);
                    });

                } else {
                    $this->applyConditions($query, $column, $values);
                }
            }
        });

        return $query;
    }

    private function applyConditions($query, $column, $values): void
    {
        $query->where(function ($query) use ($column, $values) {
            foreach ($values as $value) {
                if ($value === 'NULL') {
                    $query->orWhereNull($column);
                } elseif ($value === 'NOT NULL') {
                    $query->orWhereNotNull($column);
                } else {
                    $query->orWhere($column, $value);
                }
            }
        });
    }
}
