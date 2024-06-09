<?php

namespace App\Traits\DataTable;

trait HasSortingTrait
{
    protected string $orderBy = 'created_at';
    protected string $direction = 'asc';
    protected array $allowedSorts = [];

    protected function sort()
    {
        $query = $this->query;

        $column = request()->query('col', $this->orderBy);
        $direction = request()->query('sort', $this->direction);

        if (!in_array($column, $this->allowedSorts)) {
            $column = $this->orderBy;
        }

        if ($direction !== 'asc' && $direction !== 'desc') {
            $direction = $this->direction;
        }

        return $query->orderBy($column, $direction);
    }
}
