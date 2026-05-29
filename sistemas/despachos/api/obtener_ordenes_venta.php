<?php
/**
 * API para obtener Órdenes de Venta sincronizadas desde ERP
 * Endpoint: api/obtener_ordenes_venta.php
 * Método: GET
 * Respuesta: JSON con lista de órdenes activas
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Incluir conexión a MySQL
require_once __DIR__ . '/../../../shared/conexion.php';

try {
    // Consultar órdenes de venta activas
    $sql = "
        SELECT 
            orden_venta,
            cliente,
            ruc_cliente,
            DATE_FORMAT(fecha_orden, '%d/%m/%Y') as fecha_orden_formato,
            fecha_orden,
            condicion_venta,
            estado,
            origen,
            destino,
            moneda,
            total,
            observaciones,
            DATE_FORMAT(fecha_sincronizacion, '%d/%m/%Y %H:%i:%s') as ultima_sincronizacion
        FROM erp_ordenes_venta
        WHERE activo = 1
        ORDER BY fecha_orden DESC, orden_venta DESC
    ";
    
    $resultado = $conn->query($sql);
    
    if (!$resultado) {
        throw new Exception("Error en consulta: " . $conn->error);
    }
    
    $ordenes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $ordenes[] = $fila;
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'total' => count($ordenes),
        'data' => $ordenes,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // Respuesta de error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al obtener órdenes de venta: ' . $e->getMessage(),
        'data' => []
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
