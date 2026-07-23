<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Agent;
use App\Models\Company;
use App\Models\Country;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderOperationsSeeder extends Seeder
{
    public function run(): void
    {
        fake()->seed(600);

        DB::transaction(function (): void {
            $countries = $this->seedCountries();
            $companies = $this->seedCompanies($countries);
            $customers = $this->seedCustomers($companies);
            $agents = $this->seedAgents();

            $this->seedShowcaseOrders($customers, $agents);
            $this->seedBulkOrders($customers, $agents);
        });
    }

    /** @return list<Country> */
    private function seedCountries(): array
    {
        $countries = [
            ['code' => 'US', 'name' => 'United States'],
            ['code' => 'CA', 'name' => 'Canada'],
            ['code' => 'GB', 'name' => 'United Kingdom'],
            ['code' => 'DE', 'name' => 'Germany'],
            ['code' => 'FR', 'name' => 'France'],
            ['code' => 'AU', 'name' => 'Australia'],
            ['code' => 'JP', 'name' => 'Japan'],
            ['code' => 'SG', 'name' => 'Singapore'],
        ];

        return array_map(
            fn (array $country): Country => Country::factory()->create($country),
            $countries,
        );
    }

    /**
     * @param  list<Country>  $countries
     * @return list<Company>
     */
    private function seedCompanies(array $countries): array
    {
        $showcaseCompanies = [
            ['name' => 'Northstar Retail', 'slug' => 'northstar-retail'],
            ['name' => 'Maple and Company', 'slug' => 'maple-and-company'],
            ['name' => 'Borough Market', 'slug' => 'borough-market'],
            ['name' => 'Rhein Commerce', 'slug' => 'rhein-commerce'],
            ['name' => 'Atelier Supply', 'slug' => 'atelier-supply'],
            ['name' => 'Southern Cross Goods', 'slug' => 'southern-cross-goods'],
            ['name' => 'Sakura Trading', 'slug' => 'sakura-trading'],
            ['name' => 'Lion City Direct', 'slug' => 'lion-city-direct'],
        ];
        $companies = [];

        foreach ($showcaseCompanies as $index => $attributes) {
            $companies[] = Company::factory()->create([
                ...$attributes,
                'country_id' => $countries[$index]->id,
            ]);
        }

        for ($index = 0; $index < 12; $index++) {
            $companies[] = Company::factory()->create([
                'country_id' => $countries[$index % count($countries)]->id,
            ]);
        }

        return $companies;
    }

    /**
     * @param  list<Company>  $companies
     * @return list<Customer>
     */
    private function seedCustomers(array $companies): array
    {
        $showcaseNames = [
            'Avery Morgan',
            'Jordan Lee',
            'Taylor Smith',
            'Morgan Brown',
            'Riley Wilson',
            'Casey Davis',
            'Cameron Miller',
            'Parker Anderson',
            'Quinn Thomas',
            'Reese Jackson',
            'Rowan White',
            'Skyler Harris',
            'Emerson Martin',
            'Finley Thompson',
            'Harper Garcia',
            'Logan Martinez',
        ];
        $customers = [];

        foreach ($showcaseNames as $index => $name) {
            $number = $index + 1;
            $customers[] = Customer::factory()->create([
                'company_id' => $companies[$index % 8]->id,
                'customer_number' => sprintf('CUS-SHOW-%04d', $number),
                'name' => $name,
                'email' => sprintf('customer%02d@example.test', $number),
                'phone' => $index % 3 === 0 ? null : '+62'.fake()->numerify('8##########'),
                'active' => $index % 5 !== 0,
            ]);
        }

        for ($index = 0; $index < 104; $index++) {
            $number = $index + 1;
            $customers[] = Customer::factory()->create([
                'company_id' => $companies[($index + 8) % count($companies)]->id,
                'customer_number' => sprintf('CUS-BULK-%04d', $number),
                'email' => sprintf('bulk.customer%03d@example.test', $number),
                'active' => $index % 9 !== 0,
            ]);
        }

        return $customers;
    }

    /** @return list<Agent> */
    private function seedAgents(): array
    {
        $showcaseAgents = [
            ['name' => 'Alex Rivera', 'team' => 'North', 'active' => true],
            ['name' => 'Blake Chen', 'team' => 'North', 'active' => true],
            ['name' => 'Drew Patel', 'team' => 'Central', 'active' => true],
            ['name' => 'Jamie Kim', 'team' => 'Central', 'active' => true],
            ['name' => 'Robin Clark', 'team' => 'South', 'active' => false],
            ['name' => 'Sam Taylor', 'team' => null, 'active' => false],
        ];
        $agents = [];

        foreach ($showcaseAgents as $index => $attributes) {
            $agents[] = Agent::factory()->create([
                ...$attributes,
                'email' => sprintf('agent%02d@example.test', $index + 1),
            ]);
        }

        for ($index = 0; $index < 18; $index++) {
            $number = $index + 1;
            $agents[] = Agent::factory()->create([
                'email' => sprintf('bulk.agent%02d@example.test', $number),
                'active' => $index % 10 !== 0,
            ]);
        }

        return $agents;
    }

    /**
     * @param  list<Customer>  $customers
     * @param  list<Agent>  $agents
     */
    private function seedShowcaseOrders(array $customers, array $agents): void
    {
        $orderStatuses = OrderStatus::cases();
        $paymentStatuses = PaymentStatus::cases();
        $sources = ['web', 'mobile', 'partner'];
        $flagSets = [
            [],
            ['gift'],
            ['expedited'],
            ['review'],
            ['gift', 'expedited'],
            ['gift', 'review'],
            ['expedited', 'review'],
            ['gift', 'expedited', 'review'],
        ];
        $amounts = [49.99, 275.00, 1899.50];
        $itemCounts = [1, 2, 3, 4];

        for ($index = 0; $index < 24; $index++) {
            $number = $index + 1;
            $status = $orderStatuses[$index % count($orderStatuses)];
            $placedAt = CarbonImmutable::create(2026, 6, 30, 12)->subDays($index);
            $total = $amounts[$index % count($amounts)];
            $order = Order::factory()->create([
                'customer_id' => $customers[$index % 16]->id,
                'agent_id' => $index % 4 === 0 ? null : $agents[$index % 6]->id,
                'order_number' => sprintf('ORD-2026-%04d', $number),
                'reference' => $index % 4 === 0 ? null : sprintf('SHOWCASE-%04d', $number),
                'status' => $status,
                'payment_status' => $paymentStatuses[$index % count($paymentStatuses)],
                'total_amount' => number_format($total, 2, '.', ''),
                'placed_at' => $placedAt,
                'shipped_at' => in_array($status, [OrderStatus::SHIPPED, OrderStatus::DELIVERED], true)
                    ? $placedAt->addDays(2)
                    : null,
                'metadata' => [
                    'source' => $sources[$index % count($sources)],
                    'flags' => $flagSets[$index % count($flagSets)],
                ],
                'created_at' => $placedAt,
                'updated_at' => $placedAt,
            ]);

            $this->seedItems(
                $order,
                $itemCounts[$index % count($itemCounts)],
                sprintf('SHOW-%04d', $number),
                $total,
            );
        }
    }

    /**
     * @param  list<Customer>  $customers
     * @param  list<Agent>  $agents
     */
    private function seedBulkOrders(array $customers, array $agents): void
    {
        $orderStatuses = OrderStatus::cases();
        $paymentStatuses = PaymentStatus::cases();
        $sources = ['web', 'mobile', 'partner'];
        $availableFlags = ['gift', 'expedited', 'review'];
        $itemCounts = [1, 2, 3, 4];

        for ($index = 0; $index < 2476; $index++) {
            $number = $index + 1;
            $status = fake()->randomElement($orderStatuses);
            $placedAt = CarbonImmutable::instance(
                fake()->dateTimeBetween('2025-01-01', '2026-12-31 23:59:59'),
            );
            $order = Order::factory()->create([
                'customer_id' => $customers[$index % count($customers)]->id,
                'agent_id' => fake()->boolean(75)
                    ? fake()->randomElement($agents)->id
                    : null,
                'order_number' => sprintf('ORD-BULK-%06d', $number),
                'reference' => fake()->boolean(70) ? sprintf('BULK-%06d', $number) : null,
                'status' => $status,
                'payment_status' => fake()->randomElement($paymentStatuses),
                'total_amount' => '0.00',
                'placed_at' => $placedAt,
                'shipped_at' => in_array($status, [OrderStatus::SHIPPED, OrderStatus::DELIVERED], true)
                    ? $placedAt->addDays(fake()->numberBetween(1, 7))
                    : null,
                'metadata' => [
                    'source' => fake()->randomElement($sources),
                    'flags' => fake()->randomElements(
                        $availableFlags,
                        fake()->numberBetween(0, count($availableFlags)),
                    ),
                ],
                'created_at' => $placedAt,
                'updated_at' => $placedAt,
            ]);
            $total = $this->seedItems(
                $order,
                $itemCounts[$index % count($itemCounts)],
                sprintf('BULK-%06d', $number),
            );

            $order->update([
                'total_amount' => number_format($total, 2, '.', ''),
            ]);
        }
    }

    private function seedItems(
        Order $order,
        int $count,
        string $skuPrefix,
        ?float $targetTotal = null,
    ): float {
        $total = 0.0;
        $targetCents = $targetTotal === null ? null : (int) round($targetTotal * 100);
        $baseCents = $targetCents === null ? null : intdiv($targetCents, $count);

        for ($index = 0; $index < $count; $index++) {
            $attributes = [
                'order_id' => $order->id,
                'sku' => sprintf('%s-%02d', $skuPrefix, $index + 1),
            ];

            if ($targetCents !== null && $baseCents !== null) {
                $lineCents = $index === $count - 1
                    ? $targetCents - ($baseCents * ($count - 1))
                    : $baseCents;
                $lineTotal = $lineCents / 100;
                $attributes = [
                    ...$attributes,
                    'product_name' => sprintf('Showcase Product %02d', $index + 1),
                    'quantity' => 1,
                    'unit_price' => $lineTotal,
                    'line_total' => $lineTotal,
                ];
            }

            $item = OrderItem::factory()->create($attributes);
            $total += (float) $item->line_total;
        }

        return round($total, 2);
    }
}
