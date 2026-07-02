<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'toast' => [
                    'type' => $request->session()->get('toast_type'),
                    'message' => $request->session()->get('toast_message'),
                ],
                'dialog' => [
                    'type' => $request->session()->get('dialog_type'),
                    'title' => $request->session()->get('dialog_title'),
                    'message' => $request->session()->get('dialog_message'),
                    'context' => $request->session()->get('dialog_context'),
                ],
            ],
            'filters' => [
                'search' => $request->query('search'),
                'limit' => $request->query('limit'),
                'col' => $request->query('col'),
                'sort' => $request->query('sort'),
                'filters' => $request->query('filters'),
                'ref' => $request->query('ref'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'localization' => [
                'current' => app()->getLocale(),
                'translations' => [
                    'entries' => 'entries',
                ],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
