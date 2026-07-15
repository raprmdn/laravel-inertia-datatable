<?php

namespace App\Enums;

use App\Traits\HasEnumOptions;

enum PostStatus: string
{
    use HasEnumOptions;

    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';
}
