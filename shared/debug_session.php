<?php
// Endpoint temporal de depuración: muestra contenido de la sesión PHP en JSON
// Úsalo solo en entorno local. El archivo puede eliminarse luego.
error_log('debug_session.php: request recibida');
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json');
$out = array(
    'session_id' => session_id(),
    'session' => $_SESSION,
    'cookie' => isset($_COOKIE[session_name()]) ? $_COOKIE[session_name()] : null,
    'server' => array(
        'SERVER_NAME' => $_SERVER['SERVER_NAME'] ?? null,
        'REMOTE_ADDR' => $_SERVER['REMOTE_ADDR'] ?? null
    )
);
echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;
