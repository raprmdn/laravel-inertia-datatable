<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMINISTRATOR = 'administrator';
    case AUTHOR = 'author';
    case MODERATOR = 'moderator';
}
