<?php
// logout.php - destruye la sesión y responde JSON si es petición AJAX
if (session_status() === PHP_SESSION_NONE) session_start();

// Limpiar variables de sesión
$_SESSION = array();

// Borrar cookie de sesión si existe
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'], $params['secure'], $params['httponly']
    );
}

// Destruir sesión
session_destroy();

// Responder según tipo de petición
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
if ($isAjax) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true]);
    exit;
} else {
    // Redirigir al index (login)
    header('Location: index.html');
    exit;
}
