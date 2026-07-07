<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Administrator = 'administrator';
    case Author = 'author';
    case Moderator = 'moderator';
}
