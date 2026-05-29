<?php
/**
 * Explorador de tablas de productos en ERP Nisira (SQL Server)
 * Ejecutar desde CLI: php explorar_erp_productos.php
 * O desde navegador (sin sesión requerida en modo exploración local)
 *
 * ⚠️  La VPN debe estar activa antes de ejecutar.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$esCLI = (php_sapi_name() === 'cli');
if (!$esCLI) {
    header('Content-Type: text/plain; charset=utf-8');
}

$config = [
    'host'     => '172.51.0.10\ORACLENIS',
    'port'     => '50562',
    'database' => 'campoandino',
    'username' => 'jparra',
    'password' => 'HQQl5|L7Wd4>',
];

function linea($txt = '') { echo $txt . "\n"; }

linea("================================================");
linea("  EXPLORADOR ERP NISIRA - MAESTRO DE PRODUCTOS");
linea("  " . date('Y-m-d H:i:s'));
linea("================================================");
linea();

// ── Verificar extensiones ─────────────────────────────────────
linea("1. Extensiones PHP disponibles:");
$tieneP   = extension_loaded('pdo_sqlsrv');
$tieneN   = extension_loaded('sqlsrv');
linea("   pdo_sqlsrv : " . ($tieneP ? "✓ OK" : "✗ NO INSTALADA"));
linea("   sqlsrv     : " . ($tieneN ? "✓ OK" : "✗ NO INSTALADA"));

if (!$tieneP && !$tieneN) {
    linea();
    linea("❌  No hay extensiones SQL Server instaladas.");
    linea("    Instala pdo_sqlsrv o sqlsrv para PHP en WAMP.");
    exit(1);
}
linea();

// ── Conectar ──────────────────────────────────────────────────
linea("2. Conectando a SQL Server...");
$pdo = null;
try {
    if ($tieneP) {
        $dsn = "sqlsrv:Server={$config['host']},{$config['port']};Database={$config['database']}";
        $pdo = new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        linea("   ✓ Conexión exitosa (pdo_sqlsrv)");
    } else {
        $srv  = $config['host'] . ',' . $config['port'];
        $info = ['Database' => $config['database'], 'UID' => $config['username'],
                 'PWD' => $config['password'], 'CharacterSet' => 'UTF-8'];
        $raw = sqlsrv_connect($srv, $info);
        if ($raw === false) {
            throw new Exception(print_r(sqlsrv_errors(), true));
        }
        linea("   ✓ Conexión exitosa (sqlsrv nativo)");
        // Wrap en objeto simple para unificar código
        $pdo = new class($raw) {
            private $c;
            public function __construct($c) { $this->c = $c; }
            public function query($sql) {
                $s = sqlsrv_query($this->c, $sql);
                if ($s === false) throw new Exception(print_r(sqlsrv_errors(), true));
                $rows = [];
                while ($r = sqlsrv_fetch_array($s, SQLSRV_FETCH_ASSOC)) $rows[] = $r;
                return $rows;
            }
        };
    }
} catch (Exception $e) {
    linea("   ❌  Error: " . $e->getMessage());
    exit(1);
}
linea();

// Helper: ejecutar consulta
function consultar($pdo, $sql) {
    if ($pdo instanceof PDO) {
        return $pdo->query($sql)->fetchAll();
    }
    return $pdo->query($sql); // wrapper sqlsrv
}

// ── Listar TODAS las tablas de la BD ─────────────────────────
linea("3. Todas las tablas en la BD campoandino:");
linea("   (buscando palabras clave: product, articul, maest, item, material)");
linea();

$tablas = consultar($pdo, "
    SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE
    FROM   INFORMATION_SCHEMA.TABLES
    WHERE  TABLE_TYPE = 'BASE TABLE'
    AND   (TABLE_NAME LIKE '%product%'
        OR TABLE_NAME LIKE '%articul%'
        OR TABLE_NAME LIKE '%maest%'
        OR TABLE_NAME LIKE '%item%'
        OR TABLE_NAME LIKE '%material%'
        OR TABLE_NAME LIKE '%insumo%'
        OR TABLE_NAME LIKE '%PROD%')
    ORDER  BY TABLE_NAME
");

if (empty($tablas)) {
    linea("   ⚠  No se encontraron tablas con esas palabras clave.");
    linea("   Mostrando TODAS las tablas (máx 60):");
    $tablas = consultar($pdo, "
        SELECT TOP 60 TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE
        FROM   INFORMATION_SCHEMA.TABLES
        WHERE  TABLE_TYPE = 'BASE TABLE'
        ORDER  BY TABLE_NAME
    ");
}

foreach ($tablas as $t) {
    linea("   → [{$t['TABLE_SCHEMA']}].[{$t['TABLE_NAME']}]");
}
linea();

// ── Para cada tabla encontrada, mostrar columnas + 3 filas ───
if (!empty($tablas)) {
    foreach ($tablas as $t) {
        $schema = $t['TABLE_SCHEMA'];
        $tabla  = $t['TABLE_NAME'];
        linea("─────────────────────────────────────────────────");
        linea("  TABLA: [{$schema}].[{$tabla}]");
        linea("─────────────────────────────────────────────────");

        // Columnas
        $cols = consultar($pdo, "
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM   INFORMATION_SCHEMA.COLUMNS
            WHERE  TABLE_SCHEMA = '{$schema}' AND TABLE_NAME = '{$tabla}'
            ORDER  BY ORDINAL_POSITION
        ");
        linea("  Columnas:");
        foreach ($cols as $c) {
            $len = $c['CHARACTER_MAXIMUM_LENGTH'] ? "({$c['CHARACTER_MAXIMUM_LENGTH']})" : '';
            linea("    {$c['COLUMN_NAME']}  {$c['DATA_TYPE']}{$len}  nullable={$c['IS_NULLABLE']}");
        }
        linea();

        // Muestra de datos (TOP 5)
        try {
            $rows = consultar($pdo, "SELECT TOP 5 * FROM [{$schema}].[{$tabla}]");
            linea("  Primeras 5 filas:");
            foreach ($rows as $row) {
                $partes = [];
                foreach ($row as $k => $v) {
                    if ($v instanceof DateTime) $v = $v->format('Y-m-d');
                    $partes[] = "{$k}=" . (is_null($v) ? 'NULL' : substr((string)$v, 0, 40));
                }
                linea("    " . implode(' | ', $partes));
            }
        } catch (Exception $e) {
            linea("  ⚠ No se pudo leer datos: " . $e->getMessage());
        }
        linea();
    }
}

linea("================================================");
linea("  FIN DEL EXPLORADOR");
linea("================================================");
