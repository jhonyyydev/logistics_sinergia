<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'validate.client.id' => \App\Http\Middleware\ValidateClientId::class,
            'validate.destination.id' => \App\Http\Middleware\ValidateDestinationId::class,
            'validate.product.id' => \App\Http\Middleware\ValidateProductId::class,
            'validate.transport.id' => \App\Http\Middleware\ValidateTransportUnitId::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

        $exceptions->render(function (UnauthorizedException $e, $request) {
            $message = $e->getMessage();
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $message ?: 'You do not have permission to perform this action.'
                ], 403);
            }
        });

        $exceptions->render(function (AuthenticationException $e, $request) {
            $message = $e->getMessage();
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $message ?: 'Unauthenticated. Please log in.'
                ], 401);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, $request) {
            $message = $e->getMessage();
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $message ?: 'Resource not found.'
                ], 404);
            }
        });

        $exceptions->render(function (\InvalidArgumentException $e, $request) {
            $message = $e->getMessage();
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $message
                ], 400);
            }
        });

        $exceptions->render(function (ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $e->errors()
                ], 422);
            }
        });

    })
    ->withProviders([
        App\Providers\DomainBindingsServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
    ])
    ->create();
