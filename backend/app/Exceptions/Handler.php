<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson()) {

            if ($exception instanceof AuthenticationException) {
                return response()->json([
                    'error' => 'No autenticado. Por favor, inicia sesión.'
                ], 401);
            }

            if ($exception instanceof NotFoundHttpException) {
                return response()->json([
                    'error' => 'Ruta no encontrada.'
                ], 404);
            }

            if ($exception instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'error' => 'Método HTTP no permitido para esta ruta.'
                ], 405);
            }

            if ($exception instanceof ValidationException) {
                return response()->json([
                    'error' => 'Datos inválidos.',
                    'details' => $exception->errors()
                ], 422);
            }

            return response()->json([
                'error' => 'Error inesperado.',
                'message' => $exception->getMessage()
            ], 500);
        }

        return parent::render($request, $exception);
    }
}
