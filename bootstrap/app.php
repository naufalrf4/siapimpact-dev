<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Register admin routes with auth middleware
            // Requirements: 5.1, 5.2, 13.1, 13.2
            Route::middleware('web')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            $status = $e->getStatusCode();

            if ($status === 404) {
                return Inertia::render('errors/NotFound', [
                    'status' => $status,
                    'message' => 'Halaman yang Anda cari tidak ditemukan.',
                ])->toResponse($request)->setStatusCode($status);
            }

            if ($status >= 500) {
                return Inertia::render('errors/ServerError', [
                    'status' => $status,
                    'message' => 'Terjadi kesalahan pada server.',
                ])->toResponse($request)->setStatusCode($status);
            }

            // Let Laravel handle other HTTP exceptions
            return null;
        });
    })->create();
