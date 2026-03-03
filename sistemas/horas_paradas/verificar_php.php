<?php
// ====================================
// VERIFICAR RUTA DE PHP EN HOSTING
// Subir este archivo al hosting y abrir en navegador
// ====================================

echo "<h2>Información de PHP en el Hosting</h2>";

echo "<h3>Ruta del ejecutable PHP:</h3>";
echo "<pre>" . PHP_BINARY . "</pre>";

echo "<h3>Versión de PHP:</h3>";
echo "<pre>" . PHP_VERSION . "</pre>";

echo "<h3>Comando PHP para CRON:</h3>";
echo "<pre>" . PHP_BINARY . " /home/campoand/public_html/sync_horno_origen.php</pre>";

echo "<h3>Sistema Operativo:</h3>";
echo "<pre>" . PHP_OS . "</pre>";

echo "<h3>Directorio actual:</h3>";
echo "<pre>" . __DIR__ . "</pre>";

echo "<h3>Usuario del servidor web:</h3>";
echo "<pre>";
if (function_exists('posix_getpwuid')) {
    $processUser = posix_getpwuid(posix_geteuid());
    echo $processUser['name'];
} else {
    echo "No disponible (función posix deshabilitada)";
}
echo "</pre>";

echo "<h3>Información completa de PHP:</h3>";
phpinfo();
