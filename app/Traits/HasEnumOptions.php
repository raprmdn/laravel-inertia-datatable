<?php

namespace App\Traits;

trait HasEnumOptions
{
    public static function values(): array
    {
        return array_map(
            static fn ($case) => $case->value,
            self::cases(),
        );
    }

    public static function options(array $values = []): array
    {
        $cases = array_filter(
            self::cases(),
            static fn ($case): bool => $values === [] || in_array($case->value, $values, true),
        );

        return array_values(array_map(static function ($case): array {
            $label = method_exists($case, 'label')
                ? $case->label()
                : ucfirst(str_replace(['_', '-'], ' ', strtolower((string) $case->value)));

            return [
                'value' => $case->value,
                'label' => __($label),
            ];
        }, $cases));
    }
}
