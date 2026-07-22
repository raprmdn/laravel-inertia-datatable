<?php

namespace App\Models;

use Database\Factories\CountryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'name'])]
class Country extends Model
{
    /** @use HasFactory<CountryFactory> */
    use HasFactory;

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }
}
