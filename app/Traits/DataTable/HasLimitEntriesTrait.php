<?php

namespace App\Traits\DataTable;

trait HasLimitEntriesTrait
{
    protected string $type = 'pagination';
    protected int $limit = 10;

    protected function limit()
    {
        $query = $this->query;
        $limit = (int) request()->query('limit', $this->limit);

        if ($this->type === 'pagination') {
            return $query->paginate($limit);
        }

        return $query->get();
    }
}
