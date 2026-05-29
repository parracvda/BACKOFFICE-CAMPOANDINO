<?php
// logout.php (folder) - forward to root logout to keep behaviour consistent
if (session_status() === PHP_SESSION_NONE) session_start();

// Preferir delegar al logout central cuando sea posible
// Si la petición es AJAX, responder igual que el root logout
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
// Limpiar y destruir sesión localmente por seguridad
$_SESSION = array();
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'], $params['secure'], $params['httponly']
    );
}
session_destroy();

if ($isAjax) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true]);
    exit;
} else {
    // Detectar si estamos en /BACKOFFICE/ (local) o en raíz (hosting)
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $baseUrl = (strpos($scriptName, '/BACKOFFICE/') !== false) ? '/BACKOFFICE' : '';
    header('Location: ' . $baseUrl . '/public/index.html');
    exit;
}
