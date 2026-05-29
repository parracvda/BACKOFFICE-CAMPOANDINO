<?php
/**
 * Script de sincronización de Órdenes de Venta desde ERP Nisira (SQL Server) a MySQL
 * 
 * REQUISITOS EN UBUNTU SERVER:
 * 1. VPN Pritunl activa y configurada
 * 2. PHP con extensión pdo_sqlsrv instalada
 * 3. Credenciales del ERP configuradas
 * 
 * EJECUCIÓN: 
 * - Manual: php sync_erp_ordenes_venta.php
 * - Cron: Cada 10 minutos ejecutar este script (ver documentación)
 *   Ejemplo: crontab -e y agregar la línea del cron
 */

// Configuración de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/sync_erp_errors.log');

// Registrar inicio de sincronización
$inicio = microtime(true);
echo "\n========================================\n";
echo "Sincronización ERP Órdenes de Venta\n";
echo date('Y-m-d H:i:s') . "\n";
echo "========================================\n";

// ===========================
// CONFIGURACIÓN ERP SQL SERVER
// ===========================
$erp_config = [
    'host' => '172.51.0.10\ORACLENIS',  // IP interna del ERP (requiere VPN)
    'port' => '50562',                   // Puerto de la instancia ORACLENIS (obtenido vía SQL Browser)
    'database' => 'campoandino',
    'username' => 'jparra',              // Usuario del ERP
    'password' => 'ije161718',           // Contraseña del ERP
    'charset' => 'UTF-8'
];

// ===========================
// CONFIGURACIÓN MYSQL LOCAL
// ===========================
require_once __DIR__ . '/../../shared/conexion.php';
// $conn ya está disponible desde conexion.php

// ===========================
// FUNCIÓN: Conectar a SQL Server
// ===========================
function conectarSQLServer($config) {
    try {
        // Intentar conexión con PDO (más portable)
        if (extension_loaded('pdo_sqlsrv')) {
            $dsn = "sqlsrv:Server={$config['host']},{$config['port']};Database={$config['database']}";
            $opciones = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8
            ];
            $pdo = new PDO($dsn, $config['username'], $config['password'], $opciones);
            echo "✓ Conexión a SQL Server exitosa (PDO)\n";
            return $pdo;
        }
        // Fallback: usar sqlsrv nativo
        elseif (extension_loaded('sqlsrv')) {
            $serverName = $config['host'] . "," . $config['port'];
            $connectionInfo = [
                "Database" => $config['database'],
                "UID" => $config['username'],
                "PWD" => $config['password'],
                "CharacterSet" => "UTF-8"
            ];
            $conn = sqlsrv_connect($serverName, $connectionInfo);
            if ($conn === false) {
                throw new Exception("Error sqlsrv: " . print_r(sqlsrv_errors(), true));
            }
            echo "✓ Conexión a SQL Server exitosa (sqlsrv)\n";
            return $conn;
        } else {
            throw new Exception("No hay extensiones de SQL Server disponibles (pdo_sqlsrv o sqlsrv)");
        }
    } catch (Exception $e) {
        echo "✗ Error al conectar a SQL Server: " . $e->getMessage() . "\n";
        error_log("Error conexión SQL Server: " . $e->getMessage());
        return false;
    }
}

// ===========================
// FUNCIÓN: Consultar órdenes de venta del ERP
// ===========================
function obtenerOrdenesVentaERP($connERP) {
    // ⚠️ AJUSTAR ESTA CONSULTA SEGÚN LA ESTRUCTURA REAL DEL ERP NISIRA
    // Esta es una consulta genérica de ejemplo
    $sql = "
        SELECT TOP 1000
            OV.NumeroOrden AS orden_venta,
            CLI.RazonSocial AS cliente,
            CLI.RUC AS ruc_cliente,
            OV.FechaOrden AS fecha_orden,
            OV.CondicionVenta AS condicion_venta,
            OV.Estado AS estado,
            ALM.Nombre AS origen,
            OV.DireccionEntrega AS destino,
            OV.Moneda AS moneda,
            OV.Total AS total,
            OV.Observaciones AS observaciones
        FROM OrdenesVenta OV
        LEFT JOIN Clientes CLI ON OV.ClienteID = CLI.ClienteID
        LEFT JOIN Almacenes ALM ON OV.AlmacenOrigenID = ALM.AlmacenID
        WHERE OV.Estado IN ('Pendiente', 'Aprobada', 'En Proceso')
            AND OV.FechaOrden >= DATEADD(MONTH, -3, GETDATE())
        ORDER BY OV.FechaOrden DESC
    ";
    
    try {
        if ($connERP instanceof PDO) {
            $stmt = $connERP->query($sql);
            return $stmt->fetchAll();
        } else {
            // sqlsrv nativo
            $stmt = sqlsrv_query($connERP, $sql);
            if ($stmt === false) {
                throw new Exception(print_r(sqlsrv_errors(), true));
            }
            $resultados = [];
            while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                // Convertir objetos DateTime a strings
                if ($row['fecha_orden'] instanceof DateTime) {
                    $row['fecha_orden'] = $row['fecha_orden']->format('Y-m-d');
                }
                $resultados[] = $row;
            }
            sqlsrv_free_stmt($stmt);
            return $resultados;
        }
    } catch (Exception $e) {
        echo "✗ Error al consultar órdenes del ERP: " . $e->getMessage() . "\n";
        error_log("Error consulta ERP: " . $e->getMessage());
        return [];
    }
}

// ===========================
// FUNCIÓN: Sincronizar a MySQL
// ===========================
function sincronizarAMySQL($ordenes, $connMySQL) {
    $insertados = 0;
    $actualizados = 0;
    $errores = 0;
    
    // Preparar statement para INSERT/UPDATE
    $stmt = $connMySQL->prepare("
        INSERT INTO erp_ordenes_venta (
            orden_venta, cliente, ruc_cliente, fecha_orden, condicion_venta,
            estado, origen, destino, moneda, total, observaciones, fecha_sincronizacion, activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)
        ON DUPLICATE KEY UPDATE
            cliente = VALUES(cliente),
            ruc_cliente = VALUES(ruc_cliente),
            fecha_orden = VALUES(fecha_orden),
            condicion_venta = VALUES(condicion_venta),
            estado = VALUES(estado),
            origen = VALUES(origen),
            destino = VALUES(destino),
            moneda = VALUES(moneda),
            total = VALUES(total),
            observaciones = VALUES(observaciones),
            fecha_sincronizacion = NOW(),
            activo = 1
    ");
    
    if (!$stmt) {
        echo "✗ Error al preparar statement: " . $connMySQL->error . "\n";
        return;
    }
    
    foreach ($ordenes as $orden) {
        try {
            // Validar que existe el campo orden_venta
            if (empty($orden['orden_venta'])) {
                continue;
            }
            
            $stmt->bind_param(
                'sssssssssd',
                $orden['orden_venta'],
                $orden['cliente'],
                $orden['ruc_cliente'],
                $orden['fecha_orden'],
                $orden['condicion_venta'],
                $orden['estado'],
                $orden['origen'],
                $orden['destino'],
                $orden['moneda'],
                $orden['total'],
                $orden['observaciones']
            );
            
            if ($stmt->execute()) {
                if ($stmt->affected_rows == 1) {
                    $insertados++;
                } elseif ($stmt->affected_rows == 2) {
                    $actualizados++;
                }
            } else {
                $errores++;
                error_log("Error al sincronizar orden {$orden['orden_venta']}: " . $stmt->error);
            }
        } catch (Exception $e) {
            $errores++;
            error_log("Excepción al sincronizar orden: " . $e->getMessage());
        }
    }
    
    $stmt->close();
    
    echo "\n--- Resultados de sincronización ---\n";
    echo "✓ Insertados: $insertados\n";
    echo "✓ Actualizados: $actualizados\n";
    if ($errores > 0) {
        echo "✗ Errores: $errores\n";
    }
    
    return ['insertados' => $insertados, 'actualizados' => $actualizados, 'errores' => $errores];
}

// ===========================
// FUNCIÓN: Marcar órdenes inactivas
// ===========================
function marcarOrdenesInactivas($connMySQL) {
    // Marcar como inactivas las órdenes que no se sincronizaron en las últimas 24 horas
    $sql = "UPDATE erp_ordenes_venta 
            SET activo = 0 
            WHERE fecha_sincronizacion < DATE_SUB(NOW(), INTERVAL 24 HOUR) 
            AND activo = 1";
    
    if ($connMySQL->query($sql)) {
        $afectados = $connMySQL->affected_rows;
        if ($afectados > 0) {
            echo "⚠ Marcadas como inactivas: $afectados órdenes\n";
        }
    }
}

// ===========================
// EJECUCIÓN PRINCIPAL
// ===========================
try {
    // 1. Conectar a SQL Server (ERP)
    $connERP = conectarSQLServer($erp_config);
    if (!$connERP) {
        throw new Exception("No se pudo conectar al ERP");
    }
    
    // 2. Obtener órdenes de venta
    echo "\n→ Consultando órdenes de venta del ERP...\n";
    $ordenes = obtenerOrdenesVentaERP($connERP);
    echo "✓ Obtenidas " . count($ordenes) . " órdenes\n";
    
    if (count($ordenes) == 0) {
        echo "⚠ No hay órdenes para sincronizar\n";
    } else {
        // 3. Sincronizar a MySQL
        echo "\n→ Sincronizando a MySQL...\n";
        $resultado = sincronizarAMySQL($ordenes, $conn);
        
        // 4. Marcar órdenes antiguas como inactivas
        marcarOrdenesInactivas($conn);
    }
    
    // 5. Cerrar conexión ERP
    if ($connERP instanceof PDO) {
        $connERP = null;
    } else {
        sqlsrv_close($connERP);
    }
    
    // 6. Estadísticas finales
    $tiempoTotal = round(microtime(true) - $inicio, 2);
    echo "\n✓ Sincronización completada en {$tiempoTotal}s\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "\n✗ ERROR CRÍTICO: " . $e->getMessage() . "\n";
    error_log("Error crítico en sincronización: " . $e->getMessage());
    exit(1);
}

// Cerrar conexión MySQL
$conn->close();
exit(0);
