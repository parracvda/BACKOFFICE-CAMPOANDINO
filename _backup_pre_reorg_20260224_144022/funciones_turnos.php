<?php
// ====================================================================
// FUNCIONES PARA GESTIÓN DE TURNOS DE REQUERIMIENTOS
// ====================================================================

require_once 'conexion.php';

/**
 * Obtiene o crea automáticamente el turno del día actual
 * @param mysqli $conn Conexión a base de datos
 * @param string $usuario Usuario que crea el requerimiento
 * @return array ['success' => bool, 'turno_id' => int, 'estado' => string, 'mensaje' => string]
 */
function obtenerOCrearTurnoDia($conn, $usuario) {
    $fecha_hoy = date('Y-m-d');
    
    // Iniciar transacción para evitar race conditions
    $conn->begin_transaction();
    
    try {
        // Buscar turno existente con bloqueo
        $stmt = $conn->prepare("
            SELECT id, estado, fecha 
            FROM turnos_requerimientos 
            WHERE fecha = ? 
            FOR UPDATE
        ");
        $stmt->bind_param("s", $fecha_hoy);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            // Turno ya existe
            $turno_id = $row['id'];
            $estado = $row['estado'];
            $stmt->close();
            
            if ($estado === 'cerrado') {
                $conn->rollback();
                return [
                    'success' => false,
                    'turno_id' => $turno_id,
                    'estado' => 'cerrado',
                    'mensaje' => 'El turno de hoy ya está cerrado. No se pueden crear nuevos requerimientos.'
                ];
            }
            
            $conn->commit();
            return [
                'success' => true,
                'turno_id' => $turno_id,
                'estado' => $estado,
                'mensaje' => 'Turno encontrado'
            ];
        }
        
        $stmt->close();
        
        // Crear nuevo turno
        $stmt_insert = $conn->prepare("
            INSERT INTO turnos_requerimientos (fecha, estado, creado_por, creado_at) 
            VALUES (?, 'abierto', ?, NOW())
        ");
        $stmt_insert->bind_param("ss", $fecha_hoy, $usuario);
        
        if (!$stmt_insert->execute()) {
            throw new Exception("Error al crear turno: " . $stmt_insert->error);
        }
        
        $turno_id = $conn->insert_id;
        $stmt_insert->close();
        
        // Registrar en log de auditoría
        registrarLogTurno($conn, $turno_id, 'apertura_automatica', $usuario, 
            json_encode(['fecha' => $fecha_hoy, 'accion' => 'Apertura automática de turno']));
        
        $conn->commit();
        
        return [
            'success' => true,
            'turno_id' => $turno_id,
            'estado' => 'abierto',
            'mensaje' => 'Turno creado automáticamente'
        ];
        
    } catch (Exception $e) {
        $conn->rollback();
        return [
            'success' => false,
            'turno_id' => null,
            'estado' => null,
            'mensaje' => 'Error al gestionar turno: ' . $e->getMessage()
        ];
    }
}

/**
 * Obtiene el turno actual del día
 * @param mysqli $conn Conexión a base de datos
 * @return array|null Datos del turno o null si no existe
 */
function obtenerTurnoActual($conn) {
    $fecha_hoy = date('Y-m-d');
    
    $stmt = $conn->prepare("
        SELECT 
            id, 
            fecha, 
            estado, 
            creado_por, 
            creado_at, 
            cerrado_por, 
            cerrado_at, 
            motivo_cierre,
            total_requerimientos,
            total_entregados
        FROM turnos_requerimientos 
        WHERE fecha = ?
    ");
    $stmt->bind_param("s", $fecha_hoy);
    $stmt->execute();
    $result = $stmt->get_result();
    $turno = $result->fetch_assoc();
    $stmt->close();
    
    return $turno;
}

/**
 * Cierra el turno actual
 * @param mysqli $conn Conexión a base de datos
 * @param string $usuario Usuario que cierra el turno
 * @param string $motivo Motivo del cierre
 * @return array ['success' => bool, 'mensaje' => string, 'datos' => array]
 */
function cerrarTurno($conn, $usuario, $motivo = '') {
    $fecha_hoy = date('Y-m-d');
    
    $conn->begin_transaction();
    
    try {
        // Obtener turno actual
        $stmt = $conn->prepare("
            SELECT id, estado 
            FROM turnos_requerimientos 
            WHERE fecha = ? 
            FOR UPDATE
        ");
        $stmt->bind_param("s", $fecha_hoy);
        $stmt->execute();
        $result = $stmt->get_result();
        $turno = $result->fetch_assoc();
        $stmt->close();
        
        if (!$turno) {
            $conn->rollback();
            return [
                'success' => false,
                'mensaje' => 'No existe un turno para el día de hoy',
                'datos' => null
            ];
        }
        
        if ($turno['estado'] === 'cerrado') {
            $conn->rollback();
            return [
                'success' => false,
                'mensaje' => 'El turno ya está cerrado',
                'datos' => null
            ];
        }
        
        $turno_id = $turno['id'];
        
        // Calcular estadísticas antes de cerrar
        $stats = obtenerEstadisticasTurno($conn, $turno_id);
        
        // Cerrar turno
        $stmt_close = $conn->prepare("
            UPDATE turnos_requerimientos 
            SET 
                estado = 'cerrado',
                cerrado_por = ?,
                cerrado_at = NOW(),
                motivo_cierre = ?,
                total_requerimientos = ?,
                total_entregados = ?
            WHERE id = ?
        ");
        $stmt_close->bind_param(
            "ssiii", 
            $usuario, 
            $motivo, 
            $stats['total_requerimientos'],
            $stats['total_entregados'],
            $turno_id
        );
        
        if (!$stmt_close->execute()) {
            throw new Exception("Error al cerrar turno: " . $stmt_close->error);
        }
        $stmt_close->close();
        
        // Registrar en log
        $log_detalles = json_encode([
            'fecha' => $fecha_hoy,
            'motivo' => $motivo,
            'estadisticas' => $stats
        ]);
        registrarLogTurno($conn, $turno_id, 'cierre_manual', $usuario, $log_detalles);
        
        $conn->commit();
        
        return [
            'success' => true,
            'mensaje' => 'Turno cerrado exitosamente',
            'datos' => array_merge(['turno_id' => $turno_id, 'fecha' => $fecha_hoy], $stats)
        ];
        
    } catch (Exception $e) {
        $conn->rollback();
        return [
            'success' => false,
            'mensaje' => 'Error al cerrar turno: ' . $e->getMessage(),
            'datos' => null
        ];
    }
}

/**
 * Obtiene estadísticas del turno
 * @param mysqli $conn Conexión a base de datos
 * @param int $turno_id ID del turno
 * @return array Estadísticas del turno
 */
function obtenerEstadisticasTurno($conn, $turno_id) {
    $sql = "SELECT
            COUNT(DISTINCT r.NRequerimiento) AS total_requerimientos,
            COALESCE(SUM(d.NPallets),0) AS total_pallets_solicitados,
            COALESCE(SUM(COALESCE(m.total_entregado,0)),0) AS total_pallets_entregados,
            SUM(CASE WHEN d.EstadoAprobacion = 'Aprobado' THEN 1 ELSE 0 END) AS total_aprobados,
            SUM(CASE WHEN d.EstadoAprobacion = 'Rechazado' THEN 1 ELSE 0 END) AS total_rechazados,
            SUM(CASE WHEN d.EstadoAprobacion = 'Pendiente' THEN 1 ELSE 0 END) AS total_pendientes,
            SUM(CASE WHEN COALESCE(m.total_entregado,0) >= d.NPallets AND d.NPallets > 0 THEN 1 ELSE 0 END) AS total_entregados
        FROM scm_requerimientos r
        JOIN scm_requerimientos_detalle d ON r.NRequerimiento = d.NRequerimiento
        LEFT JOIN (
            SELECT DetalleId, SUM(Cantidad) AS total_entregado
            FROM scm_entregas_movimientos
            WHERE TipoMovimiento = 'Entrega'
            GROUP BY DetalleId
        ) m ON d.Id = m.DetalleId
        WHERE r.TurnoId = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Error preparando consulta de estadísticas: ' . $conn->error);
    }
    $stmt->bind_param('i', $turno_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stats = $result->fetch_assoc();
    $stmt->close();

    // Asegurar campos numéricos
    $stats = array_map(function($v){ return $v === null ? 0 : (int)$v; }, $stats);
    $stats['total_diferencias'] = ($stats['total_pallets_solicitados'] ?? 0) - ($stats['total_pallets_entregados'] ?? 0);

    return $stats;
}

/**
 * Verifica si el turno está abierto
 * @param mysqli $conn Conexión a base de datos
 * @param int $turno_id ID del turno
 * @return bool True si está abierto, false si está cerrado o no existe
 */
function turnoEstaAbierto($conn, $turno_id) {
    if (!$turno_id) {
        return false;
    }
    
    $stmt = $conn->prepare("SELECT estado FROM turnos_requerimientos WHERE id = ?");
    $stmt->bind_param("i", $turno_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $turno = $result->fetch_assoc();
    $stmt->close();
    
    return $turno && $turno['estado'] === 'abierto';
}

/**
 * Registra operación en log de auditoría
 * @param mysqli $conn Conexión a base de datos
 * @param int $turno_id ID del turno
 * @param string $accion Tipo de acción
 * @param string $usuario Usuario que ejecuta la acción
 * @param string $detalles Detalles en formato JSON
 * @param string $ip IP del usuario (opcional)
 */
function registrarLogTurno($conn, $turno_id, $accion, $usuario, $detalles = null, $ip = null) {
    if (!$ip) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO turnos_requerimientos_logs (turno_id, accion, usuario, detalles, ip_address) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("issss", $turno_id, $accion, $usuario, $detalles, $ip);
    $stmt->execute();
    $stmt->close();
}

/**
 * Verifica si un usuario es aprobador
 * @param string $usuario Usuario a verificar
 * @return bool True si es aprobador
 */
function esUsuarioAprobador($usuario) {
    // Lista de usuarios aprobadores (ajustar según tu lógica de roles)
    $aprobadores = ['phuaman', 'admin'];
    return in_array(strtolower($usuario), array_map('strtolower', $aprobadores));
}

/**
 * Obtiene el historial de turnos
 * @param mysqli $conn Conexión a base de datos
 * @param int $limite Número de turnos a devolver
 * @return array Lista de turnos
 */
function obtenerHistorialTurnos($conn, $limite = 30) {
    $stmt = $conn->prepare("
        SELECT 
            id, 
            fecha, 
            estado, 
            creado_por, 
            creado_at, 
            cerrado_por, 
            cerrado_at, 
            motivo_cierre,
            total_requerimientos,
            total_entregados
        FROM turnos_requerimientos 
        ORDER BY fecha DESC 
        LIMIT ?
    ");
    $stmt->bind_param("i", $limite);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $turnos = [];
    while ($row = $result->fetch_assoc()) {
        $turnos[] = $row;
    }
    $stmt->close();
    
    return $turnos;
}
?>
