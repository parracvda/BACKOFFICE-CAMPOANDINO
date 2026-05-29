<?php
// ════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE CORREO – Campo Andino TI
// Microsoft 365 SMTP — no modificar host/port/encryption
// ════════════════════════════════════════════════════════════════

// URL base: auto-detecta entorno (igual que conexion.php)
$_mailIsLocal = in_array(
    $_SERVER['SERVER_NAME'] ?? 'localhost',
    ['localhost', '127.0.0.1']
);
$_mailBaseUrl = $_mailIsLocal
    ? 'http://localhost'                    // desarrollo local
    : 'http://campoandino-apps.com';        // hosting producción

return [
    // ── Credenciales SMTP (cPanel – campoandino-apps.com) ────────────────
    // En hosting, usar 127.0.0.1 es más confiable que el hostname externo
    'host'       => $_mailIsLocal ? 'mail.campoandino-apps.com' : '127.0.0.1',
    'port'       => 465,                           // SSL
    'encryption' => 'ssl',                         // SSL directo (no STARTTLS)
    'username'   => 'ti@campoandino-apps.com',
    'password'   => 'parracvda-x',

    // ── Identidad del remitente ───────────────────────────────────────────
    'from_email' => 'ti@campoandino-apps.com',
    'from_name'  => 'Campo Andino – TI',

    // ── Copia oculta (BCC) al área TI en cada envío ──────────
    'bcc'        => '',                       // ej: 'jefe.ti@campoandino.com.pe' o vacío

    // ── Tiempo límite conexión (segundos) ─────────────────────
    'timeout'    => 30,                       // M365 puede tardar más

    // ── URL base pública del sistema ──────────────────────────
    // Auto-detectada arriba. Para ngrok temporal, sobreescribir aquí:
    // 'base_url' => 'https://xxxx.ngrok-free.app',
    'base_url'   => $_mailBaseUrl,
];
