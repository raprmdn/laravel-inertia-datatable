<?php

namespace App\Enums;

use App\Traits\HasEnumOptions;

enum OrderStatus: string
{
    use HasEnumOptions;

    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
}
