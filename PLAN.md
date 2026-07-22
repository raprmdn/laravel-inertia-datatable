# Laravel Inertia Datatables Demo Redesign

## Status

- Architecture approved on 2026-07-22.
- Phase 1 is the active implementation phase.
- Authentication, Fortify, passkeys, two-factor authentication, and settings are retained.
- Datatable examples will become public, read-only learning pages.
- The package remains installed from the local `../laravel-inertia-datatables` path until v0.6.0 is publicly tagged and verified.

## Objective

Rebuild this repository as the official educational demo for `raprmdn/laravel-inertia-datatables`, using one realistic Order Operations domain and focused examples organized by package concepts.

The finished demo should optimize for teaching, discoverability, realistic usage, concise controllers, direct source links, stable screenshots, and maintainability.

## Non-Goals

- Teaching obscure parser invariants or package internals.
- Using authentication users as customers or agents.
- Demonstrating write operations, authorization workflows, or admin CRUD.
- Reproducing the complete package API documentation.
- Building a schema-driven frontend mega-table.
- Editing the adjacent package repository.
- Preserving production data from the existing Post and Category demo schema.

## Current Repository State

| Item | Current state |
| --- | --- |
| Branch | `master`, tracking `origin/master` |
| PHP | 8.5.8 |
| Laravel | 13.17.0 |
| Inertia Laravel | 3.1.0 |
| Inertia React | 3.5.0 |
| React | 19.2.7 |
| Development database | MySQL 8.4.6 |
| Test database | SQLite in memory |
| Package constraint | `@dev` |
| Installed package version | `dev-development` |
| Locked reference | `59951322a315d533ebd675ad2548499d93236575` |
| Package source | Path repository `../laravel-inertia-datatables` |
| Package installation | Symlink to the adjacent repository |
| Latest public tag | v0.5.0; v0.6.0 is not tagged |

The current default seeder creates 5,000 users and 200,000 posts. Phase 1 replaces that default invocation with one retained authentication account and the Order Operations dataset, while leaving the old schema, seeders, routes, and application code in place.

## Protected Existing Work

Existing uncommitted v0.6 migration work must not be reset, discarded, or overwritten. Protected work includes:

- `README.md`
- Existing web and API datatable controllers
- Existing entity pages
- `routes/web.php` and `routes/api.php`
- `composer.json` and `composer.lock`
- New legacy controllers
- `config/inertia-datatables.php`

`config/inertia-datatables.php` is staged as deleted while a replacement exists in the worktree as an untracked file. It must remain untouched until a later phase explicitly resolves it.

The adjacent package repository is read-only for this project. Generated and local-only files such as `.env`, `.idea/`, `.codegraph/`, `.codebase-memory/`, `vendor/`, `node_modules/`, `public/build/`, `public/hot`, `bootstrap/cache/`, `bootstrap/ssr/`, `database/database.sqlite`, storage logs, and generated frontend route files must remain untouched.

## Approved Architecture

| Learning area | Example | Planned path |
| --- | --- | --- |
| Start Here | Learning path and domain overview | `/dashboard` |
| Core | Basic Orders | `/examples/basic-orders` |
| Relationships | Orders & Customers | `/examples/relationships` |
| Advanced | Custom Columns | `/examples/custom-columns` |
| Advanced | Query Builder | `/examples/query-builder` |
| Integration | JSON API | `/examples/api` |
| Migration | Legacy to v0.6 | `/examples/migration` |

Architectural decisions:

- `/dashboard` becomes the public learning-path homepage.
- All datatable examples are public, read-only GET endpoints.
- Public APIs are bounded, validated, and throttled.
- `User` remains exclusively an authentication model.
- `Customer` and `Agent` are separate domain models.
- No Order Operations query depends on the authenticated user.
- Account and security links live in the secondary user menu.
- Spatie Permission is removed only after all replacement examples work.
- Existing authentication and settings behavior remains covered by its current tests.

## Domain Model

```text
Country
  └── hasMany Companies

Company
  ├── belongsTo Country
  └── hasMany Customers

Customer
  ├── belongsTo Company
  └── hasMany Orders

Agent
  └── hasMany assigned Orders

Order
  ├── belongsTo Customer
  ├── belongsTo Agent, nullable
  └── hasMany OrderItems

OrderItem
  └── belongsTo Order
```

| Model | Planned fields and constraints |
| --- | --- |
| Country | Unique two-character `code`, unique `name`, timestamps |
| Company | Restricted `country_id`, unique `slug`, `name`, timestamps, compound country/name index |
| Customer | Restricted `company_id`, unique `customer_number`, `name`, unique `email`, nullable `phone`, indexed `active`, timestamps |
| Agent | `name`, unique `email`, nullable `team`, indexed `active`, timestamps |
| Order | Restricted `customer_id`, nullable `agent_id` with `nullOnDelete`, unique `order_number`, nullable indexed `reference`, indexed enum statuses, decimal amount, indexed placed/shipped datetimes, nullable JSON metadata, timestamps |
| OrderItem | Cascading `order_id`, SKU, product name, unsigned quantity, unit price, line total, timestamps, unique order/SKU pair |

No domain model uses soft deletes.

`OrderStatus` values are `pending`, `processing`, `shipped`, `delivered`, and `cancelled`.

`PaymentStatus` values are `pending`, `authorized`, `paid`, `refunded`, and `failed`.

Order status and payment status use backed enum casts. Monetary values use `decimal:2`, dates use datetime casts, metadata uses an array cast, and customer/agent activity uses boolean casts.

Only boundary resources will be added in later phases: an Inertia Order resource, an API Order resource, and a customer option resource. Query Builder rows remain plain aliased objects.

## Dataset Strategy

| Record | Showcase | Bulk | Total |
| --- | ---: | ---: | ---: |
| Authentication users | 1 | 0 | 1 |
| Countries | 8 | 0 | 8 |
| Companies | 8 | 12 | 20 |
| Customers | 16 | 104 | 120 |
| Agents | 6 | 18 | 24 |
| Orders | 24 | 2,476 | 2,500 |
| Order items | 60 | 6,190 | 6,250 |

The 24 showcase orders use fixed 2026 dates and sort ahead of bulk records. Bulk orders use a fixed Faker seed and dates from 2024 through 2025. Bulk item counts repeat `1, 2, 3, 4`, producing exactly 6,190 bulk items and 6,250 items overall.

The data covers every order and payment status, assigned and unassigned agents, active and inactive customers and agents, shipped and unshipped orders, null and populated references, low/medium/high totals, `web`/`mobile`/`partner` sources, empty flags, each named flag, combined flags, varied item counts, and customers across every country.

The retained local authentication account is `demo@example.com` with password `password`. It has no Order Operations relationships.

## Route Matrix

| Method | Path | Name | Handler | Response | Middleware |
| --- | --- | --- | --- | --- | --- |
| GET | `/` | `home` | Redirect to dashboard | Redirect | `web` |
| GET | `/dashboard` | `dashboard` | Inertia dashboard | Inertia | `web` |
| GET | `/examples/basic-orders` | `examples.basic-orders` | `BasicOrderController@index` | Inertia | `web` |
| GET | `/examples/relationships` | `examples.relationships` | `RelationshipOrderController@index` | Inertia | `web` |
| GET | `/examples/custom-columns` | `examples.custom-columns` | `AdvancedOrderController@index` | Inertia | `web` |
| GET | `/examples/query-builder` | `examples.query-builder` | `OrderLedgerController@index` | Inertia | `web` |
| GET | `/examples/api` | `examples.api-explorer` | Inertia API Explorer | Inertia | `web` |
| GET | `/examples/migration` | `examples.migration.current` | `MigrationOrderController@index` | Inertia | `web` |
| GET | `/examples/migration/legacy` | `examples.migration.legacy` | `LegacyOrderController@index` | Inertia | `web` |
| GET | `/api/orders` | `api.orders.index` | `Api\OrderController@index` | JSON resource | `api`, throttled |
| GET | `/api/customers/options` | `api.customers.options` | `Api\CustomerOptionController@index` | JSON collection | `api`, throttled |

Phase 1 adds no routes. Existing settings, Fortify, passkey, and two-factor routes remain unchanged.

## Navigation

The primary sidebar will be organized as Start Here, Core, Relationships, Advanced, Integration, and Migration. Account profile, security, appearance, and logout will move to the authenticated user menu. Guests will see compact login and registration actions outside the learning groups.

Phase 1 does not alter navigation.

## Example Pages

| Page | Lesson and behavior |
| --- | --- |
| Start Here | Domain diagram, ordered learning cards, package and repository links |
| Basic Orders | Implicit columns, groups, search, filter, sort, date range, page size, pagination, empty state, URL state |
| Relationships | Capability-specific sources, stable ID filters, nested relation search/filter/sort, eager loading, item count sorting |
| Custom Columns | Null aliases, JSON scalar equality, JSON contains, custom amount filters, business status sorting, filter composition |
| Query Builder | Readable joins, selected aliases, qualified physical columns, portable filtering and pagination |
| API Explorer | Presets, generated curl, formatted standard Laravel paginated resource response |
| Legacy Migration | One shared table with current/legacy implementation toggle and behavior parity |

Every example page will include a lesson header, source links, request inspector, mobile-safe controls, a contextual empty state, and Inertia URL state. No page will be driven by a generic backend schema.

## Controller Specifications

`BasicOrderController` will use an Eloquent Order query, implicit sources, grouped order/reference and status/payment columns, a placed date range, default `placed_at desc`, package-bounded pagination, and an Inertia Order resource.

`RelationshipOrderController` will eager load `customer.company.country` and `agent`, call `withCount('items')`, and use the confirmed capability-specific signature:

```php
Column::make('customer', 'customer.name')
    ->searchable()
    ->filterable('customer.id')
    ->sortable();
```

Company and country will demonstrate nested relationship paths. Has-many sorting will use `items_count`; automatic relation sorting will only target belongs-to paths supported by the package.

`AdvancedOrderController` will use `filterAliases()` for shipping and assignment state, exact `metadata->source` filtering, `jsonContains()` for `metadata->flags`, `filterUsing()` for amount bands, and `sortUsing()` for business status order. Filter callbacks receive the original builder and ordered value array; sort callbacks receive the original builder and normalized direction.

`OrderLedgerController` will use Query Builder joins to customers, companies, and nullable agents. WHERE and ORDER BY sources will use qualified physical columns rather than selected aliases so MySQL and SQLite remain portable.

`Api\CustomerOptionController` will own a `limit + 1` query bound, use `type('collection')`, require a meaningful search term, and return at most 20 options plus `has_more`.

`Api\OrderController` will reuse the web query convention: `search`, `filters[]`, `col`, `sort`, `limit`, and `page`. Laravel's standard paginated resource `data`, `links`, and `meta` shape will be retained.

`MigrationOrderController` and `LegacyOrderController` will use shared seeded data and render the same page. One uses ColumnDefinitions; the other uses the parser-based API.

## Feature Coverage Matrix

| Package feature | Primary example |
| --- | --- |
| `DataTable::query()` | All examples |
| `Column::make()`, implicit sources, `Column::group()` | Basic Orders |
| Search, filtering, sorting, date ranges | Basic Orders |
| Raw request keys, default order, page size, pagination | Basic Orders |
| URL state and empty state | Basic Orders |
| Mapped and capability-specific sources | Relationships |
| Relation and nested relation behavior | Relationships |
| `with()`, `withCount()`, count alias sort | Relationships |
| `filterAliases()`, `NULL`, `NOT NULL` | Custom Columns |
| JSON scalar equality and `jsonContains()` | Custom Columns |
| `filterUsing()` and `sortUsing()` | Custom Columns |
| Same-key OR and cross-key AND filters | Custom Columns |
| Query Builder | Order Ledger |
| Collection output | Customer options |
| API resources and pagination metadata | JSON API |
| Parser-to-definition migration | Legacy Migration |

## Package-Test-Only Cases

The application will not add interactive examples for repeated definition merge precedence, registration call-order independence, malformed filters, unknown filters, unknown sorts, invalid directions, unknown alias pass-through, every typed alias variation, artificial `_from`/`_to` collisions, callback exceptions, builder-state isolation, unsupported relation-sort failures, or implementation-specific SQL qualification edge cases.

## Frontend Architecture

Reuse the existing dashboard shell, sidebar, breadcrumbs, user menu, app logo, shadcn table/input/select/popover/sheet/empty/skeleton/tooltip/tabs/combobox/date controls, table pagination, sort header, and existing URL-state hooks where practical.

Focused components planned for Phase 2 and later are `ExampleHeader`, `SourceLinks`, `RequestInspector`, `DataTableToolbar`, `SearchInput`, `FilterPanel`, `ActiveFilters`, `PerPageSelect`, `Pagination`, and `SortHeader`.

The current monolithic toolbar remains in place while old pages depend on it. New examples will use focused components; the old toolbar is removed only after old pages are removed.

Phase 1 contains no frontend work.

## API Explorer

The explorer will use Inertia React v3 `useHttp`, the same query convention as web pages, preset requests, a generated curl command, formatted JSON, and standard Laravel pagination metadata. It will not introduce Axios, OpenAPI generation, or a second filtering convention.

## Legacy Migration

| Legacy API | v0.6 replacement |
| --- | --- |
| `searchable([...])` | `Column::make()` or `Column::group()->searchable()` |
| `parseFilters()` map | `filterable()` source |
| `parseSort()` map | `sortable()` source |
| `allowedFilters()` | Definition capability |
| `allowedSorts()` | Definition capability |
| Parser aliases | `filterAliases()` |
| Legacy JSON config | `jsonContains()` |
| Global custom filter | `Column::filterUsing()` |

Only one current/legacy table will be shown at a time. Four duplicate legacy entity pages will not be retained.

## Starter-Kit Removal

Retain `User`, Fortify, registration, login, password reset, passkeys, two-factor authentication, profile, security, appearance, auth/settings pages, auth/settings tests, and `UserFactory`.

Eventually remove Post and Category models, their factories/seeders/migrations/controllers/resources/pages, auth-User datatable controllers/resources/pages, Role examples, Spatie Permission configuration and middleware, role/permission seeders, and the generic starter welcome page.

There is no application Role model; current role examples use Spatie's model. Spatie Permission will be removed only after its references are audited again in its cleanup phase. No npm dependency removal is implied.

## Testing Strategy

The demo repository will not add automated tests unless explicitly requested in a future phase. The adjacent package owns package correctness and edge-case coverage. Each demo phase will use the narrowest applicable migration, seeding, route, browser, log, formatter, lint, build, and diff checks.

Phase 1 validation consists of a fresh migration and seed, explicit read-only count and representative data checks, route boot verification, Pint, `git diff --check`, protected-file review, and package symlink verification.

## Documentation Strategy

The final README will contain the purpose and hero screenshot, learning path, quick start, domain diagram, controller/page links, screenshot gallery, seed/reset instructions, frontend component locations, package documentation link, license, and repository relationship. It will not duplicate complete package API documentation.

## Screenshot Strategy

The final version-controlled screenshot set will include Basic Orders with filters, Relationships, Custom Columns with JSON filters, API Explorer, and one mobile dark-mode view. Showcase records and fixed URLs will make captures reproducible. Phase 1 does not modify screenshots.

## Composer Strategy

Keep the current `@dev` constraint, local path repository, lock reference, and symlink throughout implementation while v0.6.0 remains unpublished.

After v0.6.0 is publicly tagged and verified, remove the path repository, change the constraint to `^0.6.0`, and run only:

```bash
composer update raprmdn/laravel-inertia-datatables --with-dependencies --no-interaction
```

The tagged package must pass the complete demo validation before the symlink is retired.

## Transition Strategy

Use a parallel build before removal. Add the Order Operations schema and each new route beside the current application. Remove old examples only after all new lessons and legacy parity are present.

Phase 1 changes the default seed invocation to avoid the existing 200,000-post workload, but preserves old seeders, schema, routes, and application code. Every completed phase must leave the application runnable.

## Implementation Phases

### Phase 1 — Foundation and Domain

- Add six domain migrations, models, factories, enums, and `OrderOperationsSeeder`.
- Seed exact documented totals with deterministic showcase and bulk records.
- Retain one independent authentication account.
- Stop invoking the excessive default old-domain bulk seed without deleting old seeders or schema.
- Add no routes, controllers, resources, pages, navigation, or automated tests.
- Validate migration, seed, counts, representative records, route boot, formatting, and protected state.

### Phase 2 — Public Shell and Basic Orders

- Make the dashboard the public learning homepage.
- Add the Basic Orders controller, resource, page, focused shared components, navigation, and browser validation.
- Leave advanced and relationship features out of scope.

### Phase 3 — Relationships

- Add nested eager loading, capability-specific relation sources, stable ID filters, `withCount()`, and count alias sorting.
- Add the Relationships page and manually validate all mapped behavior.

### Phase 4 — Advanced Columns

- Add null aliases, JSON exact and contains filters, amount callback filtering, business status callback sorting, and composed filter UI.
- Validate on SQLite-compatible code paths and MySQL.

### Phase 5 — Query Builder and Collection

- Add the joined Order Ledger Query Builder example.
- Add bounded customer option collection output and connect it to the Relationships page.
- Avoid aggregate-report complexity.

### Phase 6 — API Explorer

- Add the paginated Order API resource endpoint and interactive API Explorer.
- Use the existing query convention and standard pagination shape.

### Phase 7 — Legacy Migration

- Add one equivalent ColumnDefinition and parser implementation over shared data.
- Add concise migration mapping and behavior comparison.

### Phase 8 — Existing Demo Cleanup

- Remove Post, Category, and auth-User datatable examples, their old schema and frontend files, after replacement examples work.
- Keep authentication `User`, Fortify, and account settings.
- Use `migrate:fresh --seed` as the demo-only schema reset boundary.

### Phase 9 — Permission and Role Cleanup

- Remove role pages, Spatie Permission references, middleware aliases, config, migration, seeders, and Composer dependency.
- Revalidate all retained authentication and settings behavior.

### Phase 10 — Documentation and Publication

- Finalize README, version-controlled screenshots, responsive/browser checks, and source links.
- Switch from the path repository to tagged `^0.6.0` only after publication.
- Run complete backend/frontend validation.

## Risks And Safeguards

| Risk | Safeguard |
| --- | --- |
| Dirty demo and package worktrees | Never reset or clean; review status before and after every phase |
| Untagged v0.6 API | Keep the path repository and symlink until publication |
| Public database load | Read-only routes, bounded pagination/options, API throttling |
| Unsupported relation sorting | Sort only belongs-to paths; use count aliases for has-many |
| MySQL and SQLite differences | Qualified columns and portable Laravel query methods |
| JSON differences | Laravel JSON query APIs; no custom database-specific JSON SQL |
| Screenshot drift | Fixed showcase data and default ordering |
| Authentication regression | Keep auth domain-independent and preserve existing auth checks |
| Destructive old-schema removal | Defer to the explicit demo-only fresh-migration cleanup phase |
| Existing lint/format baseline | Use scoped checks during phases and resolve the baseline before publication |

## Final Completion Criteria

- All learning pages and APIs are publicly reachable and read-only.
- Dashboard presents the complete learning path.
- Authentication, Fortify, passkeys, two-factor authentication, and settings remain functional.
- Auth `User` has no Order Operations relationship.
- Post, Category, User-datatable, Role, and Permission examples are removed in their planned cleanup phases.
- The domain seeds the exact documented totals and stable showcase rows.
- Every approved package feature maps to one natural example.
- API and collection endpoints use the same public query convention.
- Current and legacy implementations provide equivalent behavior.
- Query Builder works against the supported development and test databases.
- README and the minimum screenshot set are version-controlled.
- Composer eventually resolves tagged `^0.6.0`, not the local path repository.
- Final backend, frontend, browser, formatting, and diff validation passes.

## Open Decisions

| Context | Options | Recommendation | Impact | Latest safe decision point |
| --- | --- | --- | --- | --- |
| v0.6.0 publication timing | Keep local `@dev`, or switch to tagged `^0.6.0` | Keep the path repository through implementation and switch only after the public tag is available and verified | Determines whether publication can retire the local symlink | Before Phase 10 completion |
