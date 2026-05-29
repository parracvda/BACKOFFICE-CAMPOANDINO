<?php
/**
 * diagnostico.php - Script de diagnóstico del sistema BACKOFFICE
 *
 * Ubicación: /shared/diagnostico.php
 * Accede vía: http://tudominio.com/shared/diagnostico.php
 * O desde local: http://localhost/BACKOFFICE/shared/diagnostico.php
 *
 * Evalúa conexión MySQL, extensiones PHP, tablas, sesiones y más.
 */
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Diagnóstico del Sistema</title>
<style>
body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5}
h1{color:#333}
.card{background:#fff;border-radius:8px;padding:16px;margin-bottom:16px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}
.pass{color:#2e7d32;font-weight:bold}
.fail{color:#c62828;font-weight:bold}
.warn{color:#f57f17;font-weight:bold}
pre{background:#f0f0f0;padding:10px;border-radius:4px;overflow-x:auto;font-size:13px}
</style>
</head>
<body>
<h1>🔍 Diagnóstico del Sistema</h1>

<?php
$allOk = true;

// 1. Versión de PHP
echo '<div class="card">';
echo '<h2>1. Versión de PHP</h2>';
$phpVersion = phpversion();
if (version_compare($phpVersion, '5.6.0', '>=')) {
    echo "<p class='pass'>✅ PHP $phpVersion (mínimo requerido: 5.6)</p>";
} else {
    echo "<p class='fail'>❌ PHP $phpVersion (se requiere 5.6+)</p>";
    $allOk = false;
}
echo '</div>';

// 2. Extensiones cargadas
echo '<div class="card">';
echo '<h2>2. Extensiones de PHP</h2>';
$required = ['mysqli', 'session', 'json'];
$optional = ['mbstring', 'gd', 'zip'];
foreach ($required as $ext) {
    if (extension_loaded($ext)) {
        echo "<p class='pass'>✅ $ext - Habilitada</p>";
    } else {
        echo "<p class='fail'>❌ $ext - NO habilitada (CRÍTICO)</p>";
        $allOk = false;
    }
}
foreach ($optional as $ext) {
    if (extension_loaded($ext)) {
        echo "<p class='pass'>✅ $ext - Habilitada</p>";
    } else {
        echo "<p class='warn'>⚠️ $ext - No habilitada (opcional)</p>";
    }
}
echo '</div>';

// 3. Prueba de conexión MySQL
echo '<div class="card">';
echo '<h2>3. Prueba de conexión MySQL</h2>';
try {
    // Usar la misma lógica que conexion.php
    $esLocal = in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']);
    $useRemoteFile = file_exists(__DIR__ . '/use_remote_db');

    if ($esLocal && (getenv('USE_REMOTE_DB') === '1' || $useRemoteFile)) {
        $servername = "201.148.104.83";
        $username = "campoand_sistemas2";
        $password = "parracodex.";
        $dbname = "campoand_campoandino";
        echo "<p class='warn'>⚠️ Forzando conexión REMOTA (use_remote_db presente en local)</p>";
    } else if ($esLocal) {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "campoand_campoandino";
        echo "<p>🌐 Entorno LOCAL detectado (sin use_remote_db)</p>";
    } else {
        $servername = "localhost";
        $username = "campoand_sistemas2";
        $password = "parracodex.";
        $dbname = "campoand_campoandino";
        echo "<p>🌐 Entorno HOSTING detectado (use_remote_db ignorado aunque exista)</p>";
    }

    echo "<p>Servidor: <strong>$servername</strong></p>";
    echo "<p>Usuario: <strong>$username</strong></p>";
    echo "<p>Base de datos: <strong>$dbname</strong></p>";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        echo "<p class='fail'>❌ Error de conexión: " . $conn->connect_error . "</p>";
        echo "<p class='fail'>Código de error: " . $conn->connect_errno . "</p>";
        $allOk = false;
    } else {
        echo "<p class='pass'>✅ Conexión exitosa a MySQL</p>";
        
        // 3.1 Verificar si la BD tiene tablas
        $tables = $conn->query("SHOW TABLES");
        if ($tables) {
            $count = $tables->num_rows;
            echo "<p>Total de tablas en la BD: <strong>$count</strong></p>";
        }
        
        // 3.2 Verificar charset
        $charset = $conn->character_set_name();
        echo "<p>Charset actual: $charset</p>";
        
        // 3.2 Verificar base de datos
        $dbSelected = $conn->query("SELECT DATABASE() AS db")->fetch_assoc()['db'];
        echo "<p>Base de datos seleccionada: <strong>$dbSelected</strong></p>";
        
        // 4. Verificar tablas
        echo '<h3>4. Verificación de tablas</h3>';
        $tablesToCheck = ['usuarios', 'user_features'];
        foreach ($tablesToCheck as $table) {
            $res = $conn->query("SHOW TABLES LIKE '$table'");
            if ($res && $res->num_rows > 0) {
                echo "<p class='pass'>✅ Tabla '$table' existe</p>";
                
                // Mostrar estructura
                $cols = $conn->query("DESCRIBE $table");
                if ($cols) {
                    echo "<pre>";
                    while ($c = $cols->fetch_assoc()) {
                        echo htmlspecialchars($c['Field']) . " - " . htmlspecialchars($c['Type']) . " - " . htmlspecialchars($c['Null']) . " - " . htmlspecialchars($c['Key']) . "\n";
                    }
                    echo "</pre>";
                }
            } else {
                echo "<p class='fail'>❌ Tabla '$table' NO existe</p>";
                $allOk = false;
            }
        }
        
        // 5. Probar query de login
        echo '<h3>5. Prueba de query de login</h3>';
        $testUsu = 'jparra';
        $stmt = $conn->prepare("SELECT IdUsuario, Nombres, TipoUsuario, Usuario FROM usuarios WHERE Usuario = ? LIMIT 1");
        if ($stmt) {
            $stmt->bind_param("s", $testUsu);
            if ($stmt->execute()) {
                echo "<p class='pass'>✅ Prepare/execute funciona correctamente</p>";
                if (method_exists($stmt, 'get_result')) {
                    echo "<p class='pass'>✅ get_result() disponible (mysqlnd instalado)</p>";
                    $res = $stmt->get_result();
                    if ($res->num_rows > 0) {
                        $row = $res->fetch_assoc();
                        echo "<p class='pass'>✅ Usuario 'jparra' encontrado: " . htmlspecialchars($row['Nombres']) . "</p>";
                    } else {
                        echo "<p class='warn'>⚠️ Usuario 'jparra' no encontrado (puede ser normal)</p>";
                    }
                } else {
                    echo "<p class='warn'>⚠️ get_result() NO disponible (mysqlnd no instalado) - usa bind_result</p>";
                    $stmt->store_result();
                    if ($stmt->num_rows > 0) {
                        echo "<p class='pass'>✅ store_result/bind_result funciona</p>";
                    }
                }
            } else {
                echo "<p class='fail'>❌ Error en execute: " . $stmt->error . "</p>";
                $allOk = false;
            }
            $stmt->close();
        } else {
            echo "<p class='fail'>❌ Error en prepare: " . $conn->error . "</p>";
            $allOk = false;
        }
        
        // 6. Probar tabla user_features
        echo '<h3>6. Prueba de tabla user_features</h3>';
        $q = $conn->prepare("SELECT feature_key FROM user_features WHERE idusuario = ? LIMIT 5");
        if ($q) {
            $testId = 1;
            $q->bind_param("i", $testId);
            if ($q->execute()) {
                echo "<p class='pass'>✅ user_features funciona correctamente</p>";
            } else {
                echo "<p class='fail'>❌ Error en user_features: " . $q->error . "</p>";
                $allOk = false;
            }
            $q->close();
        } else {
            echo "<p class='fail'>❌ Error prepare user_features: " . $conn->error . "</p>";
            $allOk = false;
        }
        
        $conn->close();
    }
} catch (Exception $e) {
    echo "<p class='fail'>❌ Excepción: " . $e->getMessage() . "</p>";
    $allOk = false;
}
echo '</div>';

// 7. Sesiones
echo '<div class="card">';
echo '<h2>7. Prueba de sesiones</h2>';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (session_status() === PHP_SESSION_ACTIVE) {
    echo "<p class='pass'>✅ Sesiones funcionando (ID: " . session_id() . ")</p>";
    $_SESSION['test'] = 'ok';
    echo "<p>Escritura/lectura de sesión: OK</p>";
    session_destroy();
} else {
    echo "<p class='fail'>❌ Sesiones NO funcionan</p>";
    $allOk = false;
}
echo '</div>';

// 8. Permisos de archivos
echo '<div class="card">';
echo '<h2>8. Permisos de archivos clave</h2>';
$filesToCheck = [
    __DIR__ . '/acceso.php',
    __DIR__ . '/conexion.php',
    __DIR__ . '/../logout.php',
];
foreach ($filesToCheck as $file) {
    if (file_exists($file)) {
        $perms = substr(sprintf('%o', fileperms($file)), -4);
        $readable = is_readable($file) ? 'legible' : 'no legible';
        echo "<p class='pass'>✅ " . basename($file) . " - Permisos: $perms - $readable</p>";
    } else {
        echo "<p class='fail'>❌ " . basename($file) . " - NO existe</p>";
        $allOk = false;
    }
}
echo '</div>';

// Resumen final
echo '<div class="card">';
if ($allOk) {
    echo "<h2 class='pass'>✅ TODO OK - No se detectaron problemas</h2>";
    echo "<p>Si el error 500 persiste, el problema está en el servidor web (Apache/Nginx) o en la configuración de PHP del hosting. Contacta al soporte del hosting y muéstrales este diagnóstico.</p>";
} else {
    echo "<h2 class='fail'>❌ Se detectaron problemas</h2>";
    echo "<p>Revisa las secciones marcadas en rojo arriba para identificar la causa.</p>";
}
echo '</div>';

echo '<hr>';
echo '<p><strong>Información adicional del servidor:</strong></p>';
echo '<pre>';
echo 'SERVER_NAME: ' . ($_SERVER['SERVER_NAME'] ?? 'no definido') . "\n";
echo 'SERVER_SOFTWARE: ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'no definido') . "\n";
echo 'DOCUMENT_ROOT: ' . ($_SERVER['DOCUMENT_ROOT'] ?? 'no definido') . "\n";
echo 'SCRIPT_FILENAME: ' . ($_SERVER['SCRIPT_FILENAME'] ?? 'no definido') . "\n";
echo 'REMOTE_ADDR: ' . ($_SERVER['REMOTE_ADDR'] ?? 'no definido') . "\n";
echo 'use_remote_db exists: ' . (file_exists(__DIR__ . '/use_remote_db') ? 'SI' : 'NO') . "\n";
echo 'esLocal (localhost/127.0.0.1): ' . (in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']) ? 'SI' : 'NO') . "\n";
echo '</pre>';
?>
</body>
</html>
