<?php

namespace App\Enums;

use App\Traits\HasEnumOptions;

enum PaymentStatus: string
{
    use HasEnumOptions;

    case PENDING = 'pending';
    case AUTHORIZED = 'authorized';
    case PAID = 'paid';
    case REFUNDED = 'refunded';
    case FAILED = 'failed';
}
