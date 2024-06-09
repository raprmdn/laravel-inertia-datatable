<?php

namespace App\Traits\DataTable;

trait HasRelationsTrait
{
    protected array $relationship = [];

    protected function relations()
    {
        $query = $this->query;

        if (!empty($this->relationship)) {
            $query->with($this->relationship);
        }

        return $query;
    }
}
