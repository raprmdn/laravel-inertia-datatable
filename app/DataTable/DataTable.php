<?php

namespace App\DataTable;

use App\Traits\HasDataTableTrait;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class DataTable
{
    use HasDataTableTrait;

    /**
     * Which query to use for the data table.
     *
     * @param EloquentBuilder|QueryBuilder $query
     *
     * @return $this
     */
    public function query(EloquentBuilder|QueryBuilder $query): self
    {
        $this->query = $query;

        return $this;
    }

    /**
     * Set the relationship that should be eager loaded.
     * The format should be `relationship`.
     *
     * In the case of nested relationships, the format should be `relationship.nested`.
     *
     * Example: `posts`, `user.roles`.
     *
     * @param array $relationship
     *
     * @return $this
     */
    public function with(array $relationship): self
    {
        $this->relationship = $relationship;

        return $this;
    }

    /**
     * Set the columns that are searchable.
     * The format should be `column` name.
     *
     * In case of a relationship, the format should be `relationship.column`.
     *
     * Example: `name`, `email`, `categories.name`
     *
     * @param array $searchable
     *
     * @return $this
     */
    public function searchable(array $searchable): self
    {
        $this->searchable = $searchable;

        return $this;
    }

    /**
     * Set the filters that should be applied.
     *
     * This method can be used to apply filters to the query, and prevent column or relations leaked on parameters.
     *
     * The format should be `column:filter`.
     *
     * Example: `status:published`, `status:draft`, `role:Administrator`.
     * The filter can be `NULL` or `NOT NULL`.
     *
     * @param array $filters
     *
     * @return $this
     */
    public function applyFilters(array $filters): self
    {
        $this->filters = $filters;

        return $this;
    }

    /**
     * Set the columns that are filterable.
     *
     * The format should be `column:filter`.
     * The format for relationship should be `relationship.column:filter`.
     *
     * Example: `status:published`, `status:draft`, `roles.name:Administrator`.
     *
     * @param array $allowedFilters
     *
     * @return $this
     */
    public function allowedFilters(array $allowedFilters): self
    {
        $this->allowedFilters = $allowedFilters;

        return $this;
    }

    /**
     * Set the columns that are sortable.
     *
     * The format should be `column` name.
     * The format for relationship should be `relationship.column`.
     *
     * Example: `users.name`, `created_at`.
     *
     * @param string $sort
     *
     * @return $this
     */
    public function applySort(string $sort): self
    {
        $this->sort = $sort;

        return $this;
    }

    /**
     * Set the columns that are sortable.
     *
     * The format should be `column` name.
     *
     * Example: `title`, `created_at`, `author`.
     *
     * @param array $allowedSorts
     *
     * @return $this
     */
    public function allowedSorts(array $allowedSorts): self
    {
        $this->allowedSorts = $allowedSorts;

        return $this;
    }


    /**
     * Set the type of the data table.
     *
     * The type can be `pagination` or `collection`.
     *
     * The default type is `pagination`.
     *
     * @param string $type
     *
     * @return $this
     */
    public function type(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Set the default order by column and direction.
     *
     * The default column is `created_at` and the default direction is `asc`.
     *
     * Dot notation is not supported for sorting.
     * The column should be the column name.
     *
     * In case you want to sort by a relationship column, use a `join` query to join the table.
     *
     * Example: `created_at`, `asc`.
     *
     * @param string $column
     * @param string $direction
     *
     * @return $this
     */
    public function orderBy(string $column = 'created_at', string $direction = 'asc'): self
    {
        $this->orderBy = $column;
        $this->direction = $direction;

        return $this;
    }

    /**
     * Set the number of entries per page.
     * The default limit is 10.
     *
     * Example: `10`, `25`.
     *
     * Note: This method is only applicable when the type is `pagination`.
     *
     * @param int $limit
     *
     * @return $this
     */
    public function perPage(int $limit): self
    {
        $this->limit = $limit;

        return $this;
    }
}
