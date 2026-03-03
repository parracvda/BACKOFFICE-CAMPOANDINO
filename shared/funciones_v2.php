<?php
/**
 * Funciones auxiliares para trabajar con la nueva estructura de base de datos
 * Versión 2.0 - Sistema de trazabilidad completa
 */

/**
 * Obtener el siguiente número de requerimiento disponible
 * @param mysqli $conn Conexión a la base de datos
 * @return int Siguiente número de requerimiento
 */
function obtenerSiguienteNRequerimiento($conn) {
    $sql = "SELECT MAX(NRequerimiento) as max_req FROM scm_requerimientos";
    $result = $conn->query($sql);
    
    if ($result && $row = $result->fetch_assoc()) {
        return isset($row['max_req']) && $row['max_req'] ? intval($row['max_req']) + 1 : 1;
    }
    
    return 1;
}

/**
 * Verificar si existe un requerimiento
 * @param mysqli $conn Conexión a la base de datos
 * @param int $nrequerimiento Número de requerimiento
 * @return bool True si existe
 */
function existeRequerimiento($conn, $nrequerimiento) {
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM scm_requerimientos WHERE NRequerimiento = ?");
    $stmt->bind_param('i', $nrequerimiento);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    
    return $row && intval($row['count']) > 0;
}

/**
 * Crear o actualizar el encabezado de un requerimiento
 * @param mysqli $conn Conexión a la base de datos
 * @param array $datos Datos del requerimiento
 * @return array ['success' => bool, 'nrequerimiento' => int, 'error' => string]
 */
function crearOActualizarRequerimiento($conn, $datos) {
    $nrequerimiento = intval($datos['nrequerimiento']);
    $fecha = $datos['fecha'];
    $codmaquina = $datos['codmaquina'] ?? '';
    $maquina = $datos['maquina'] ?? '';
    $zona = $datos['zona'] ?? '';
    $sucursal = $datos['sucursal'] ?? '';
    $almacen = $datos['almacen'] ?? '';
    $motivo = $datos['motivo'] ?? '';
    $prioridad = $datos['prioridad'] ?? 'Normal';
    $creadoPor = $datos['creado_por'] ?? null;
    $observaciones = $datos['observaciones'] ?? '';
    
    // Verificar si ya existe
    if (existeRequerimiento($conn, $nrequerimiento)) {
        // Si ya existe, actualizar algunos campos clave (Sucursal, Almacen, Motivo, Prioridad, CreadoPor, Observaciones)
        // Usamos COALESCE(NULLIF(?,''), columna) para no sobrescribir con cadenas vacías
        $sqlUp = "UPDATE scm_requerimientos SET 
                    Fecha = COALESCE(NULLIF(?,''), Fecha),
                    CodMaquina = COALESCE(NULLIF(?,''), CodMaquina),
                    Maquina = COALESCE(NULLIF(?,''), Maquina),
                    Zona = COALESCE(NULLIF(?,''), Zona),
                    Sucursal = COALESCE(NULLIF(?,''), Sucursal),
                    Almacen = COALESCE(NULLIF(?,''), Almacen),
                    Motivo = COALESCE(NULLIF(?,''), Motivo),
                    Prioridad = COALESCE(NULLIF(?,''), Prioridad),
                    CreadoPor = COALESCE(NULLIF(?,''), CreadoPor),
                    Observaciones = COALESCE(NULLIF(?,''), Observaciones)
                  WHERE NRequerimiento = ?";

        $stmtUp = $conn->prepare($sqlUp);
        if ($stmtUp) {
            // bind: fecha, codmaquina, maquina, zona, sucursal, almacen, motivo, prioridad, creadoPor, observaciones, nrequerimiento
            $stmtUp->bind_param('ssssssssssi', $fecha, $codmaquina, $maquina, $zona, $sucursal, $almacen, $motivo, $prioridad, $creadoPor, $observaciones, $nrequerimiento);
            if ($stmtUp->execute()) {
                $stmtUp->close();
                return ['success' => true, 'nrequerimiento' => $nrequerimiento, 'mode' => 'updated'];
            }
            $err = $stmtUp->error;
            $stmtUp->close();
            return ['success' => false, 'error' => 'Error actualizando encabezado existente: ' . $err];
        }

        // Si no se pudo preparar el UPDATE, devolver éxito por compatibilidad (no perder flujo)
        return ['success' => true, 'nrequerimiento' => $nrequerimiento, 'mode' => 'existing'];
    }
    
    // ===== INTEGRACIÓN TURNOS: Obtener o crear turno del día =====
    require_once __DIR__ . '/funciones_turnos.php';
    $turnoResult = obtenerOCrearTurnoDia($conn, $creadoPor);
    
    if (!$turnoResult['success']) {
        return ['success' => false, 'error' => $turnoResult['mensaje']];
    }
    
    $turno_id = $turnoResult['turno_id'];
    // ===== FIN INTEGRACIÓN TURNOS =====
    
    // Insertar nuevo - incluir Sucursal, Almacen, CodMaquina y TurnoId
    $sql = "INSERT INTO scm_requerimientos 
            (NRequerimiento, Fecha, CodMaquina, Maquina, Zona, Sucursal, Almacen, Motivo, Prioridad, CreadoPor, Observaciones, Estado, TurnoId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente', ?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return ['success' => false, 'error' => $conn->error];
    }
    
    $stmt->bind_param('issssssssssi', $nrequerimiento, $fecha, $codmaquina, $maquina, $zona, $sucursal, $almacen, $motivo, $prioridad, $creadoPor, $observaciones, $turno_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        return ['success' => true, 'nrequerimiento' => $nrequerimiento, 'mode' => 'created', 'turno_id' => $turno_id];
    }
    
    $error = $stmt->error;
    $stmt->close();
    return ['success' => false, 'error' => $error];
}

/**
 * Agregar un material/detalle al requerimiento
 * @param mysqli $conn Conexión a la base de datos
 * @param array $datos Datos del detalle
 * @return array ['success' => bool, 'id' => int, 'error' => string]
 */
function agregarDetalleRequerimiento($conn, $datos) {
    $nrequerimiento = intval($datos['nrequerimiento']);
    $codigo = $datos['codigo'] ?? '';
    $producto = $datos['producto'] ?? '';
    $npallets = intval($datos['npallets']);
    $observaciones = $datos['observaciones'] ?? '';
    
    // Debug: registrar valores
    error_log("agregarDetalleRequerimiento - Observaciones recibidas: '" . $observaciones . "' (length: " . strlen($observaciones) . ")");
    
    $sql = "INSERT INTO scm_requerimientos_detalle (NRequerimiento, Codigo, Producto, NPallets, Observaciones, EstadoAprobacion) 
            VALUES (?, ?, ?, ?, ?, 'Pendiente')";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return ['success' => false, 'error' => $conn->error];
    }
    
    $stmt->bind_param('issis', $nrequerimiento, $codigo, $producto, $npallets, $observaciones);
    
    if ($stmt->execute()) {
        $id = $stmt->insert_id;
        $stmt->close();
        return ['success' => true, 'id_detalle' => $id, 'id' => $id]; // id_detalle para compatibilidad
    }
    
    $error = $stmt->error;
    $stmt->close();
    return ['success' => false, 'error' => $error];
}

/**
 * Obtener detalles de un requerimiento
 * @param mysqli $conn Conexión a la base de datos
 * @param int $nrequerimiento Número de requerimiento
 * @return array Lista de detalles
 */
function obtenerDetallesRequerimiento($conn, $nrequerimiento) {
    // Consultar detalles con información del encabezado (JOIN)
    $sql = "SELECT 
                d.Id as id_detalle,
                d.NRequerimiento as nrequerimiento,
                d.Codigo as codigo,
                d.Producto as producto,
                d.NPallets as npallets,
                d.Observaciones as observaciones,
                d.EstadoAprobacion as estado,
                r.Fecha as fecha,
                r.Maquina as maquina,
                r.Zona as zona,
                r.Motivo as motivo,
                r.Prioridad as prioridad,
                r.Sucursal as sucursal,
                r.Almacen as almacen
            FROM scm_requerimientos_detalle d
            JOIN scm_requerimientos r ON d.NRequerimiento = r.NRequerimiento
            WHERE d.NRequerimiento = ? 
            ORDER BY d.Id DESC";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return [];
    }
    
    $stmt->bind_param('i', $nrequerimiento);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $detalles = [];
    while ($row = $result->fetch_assoc()) {
        $detalles[] = $row;
    }
    
    $stmt->close();
    return $detalles;
}

/**
 * Obtener requerimientos pendientes de aprobación
 * @param mysqli $conn Conexión a la base de datos
 * @return array Requerimientos agrupados
 */
function obtenerRequerimientosPendientes($conn) {
    $sql = "SELECT 
                d.Id,
                d.NRequerimiento,
                d.Codigo,
                d.Producto,
                d.NPallets,
                d.Observaciones,
                d.EstadoAprobacion,
                r.Fecha,
                r.Maquina,
                r.Zona,
                r.Motivo,
                r.Prioridad,
                r.CreadoPor
            FROM scm_requerimientos_detalle d
            JOIN scm_requerimientos r ON d.NRequerimiento = r.NRequerimiento
            WHERE d.EstadoAprobacion = 'Pendiente' 
            ORDER BY d.NRequerimiento DESC, d.Id DESC";
    
    $result = $conn->query($sql);
    
    $groups = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $nr = intval($row['NRequerimiento']);
            if (!isset($groups[$nr])) {
                $groups[$nr] = [
                    'nrequerimiento' => $nr,
                    'fecha' => $row['Fecha'] ?? '',
                    'maquina' => $row['Maquina'] ?? '',
                    'prioridad' => $row['Prioridad'] ?? 'Normal',
                    'count' => 0,
                    'items' => []
                ];
            }
            $groups[$nr]['items'][] = [
                'id_detalle' => $row['Id'],
                'nrequerimiento' => $nr,
                'codigo' => $row['Codigo'] ?? '',
                'producto' => $row['Producto'] ?? '',
                'npallets' => $row['NPallets'] ?? 0,
                'observaciones' => $row['Observaciones'] ?? '',
                'estado_aprobacion' => $row['EstadoAprobacion'] ?? 'Pendiente',
                'fecha' => $row['Fecha'] ?? '',
                'maquina' => $row['Maquina'] ?? '',
                'motivo' => $row['Motivo'] ?? '',
                'prioridad' => $row['Prioridad'] ?? 'Normal'
            ];
            $groups[$nr]['count']++;
        }
    }
    
    return $groups;
}

/**
 * Aprobar un detalle de requerimiento
 * @param mysqli $conn Conexión a la base de datos
 * @param int $detalleId ID del detalle
 * @param string $aprobadoPor Usuario que aprueba
 * @param string $asignadoA Usuario asignado
 * @return array ['success' => bool, 'error' => string]
 */
function aprobarDetalle($conn, $detalleId, $aprobadoPor, $asignadoA) {
    $conn->begin_transaction();
    
    try {
        // 1. Actualizar estado en detalle
        $stmt1 = $conn->prepare("UPDATE scm_requerimientos_detalle SET EstadoAprobacion = 'Aprobado' WHERE Id = ?");
        $stmt1->bind_param('i', $detalleId);
        $stmt1->execute();
        $stmt1->close();
        
        // 2. Obtener NRequerimiento
        $stmt2 = $conn->prepare("SELECT NRequerimiento FROM scm_requerimientos_detalle WHERE Id = ?");
        $stmt2->bind_param('i', $detalleId);
        $stmt2->execute();
        $result = $stmt2->get_result();
        $row = $result->fetch_assoc();
        $nrequerimiento = intval($row['NRequerimiento']);
        $stmt2->close();
        
        // 3. Registrar aprobación
        $stmt3 = $conn->prepare("INSERT INTO scm_aprobaciones (DetalleId, NRequerimiento, AprobadoPor, AsignadoA, Accion) VALUES (?, ?, ?, ?, 'Aprobado')");
        $stmt3->bind_param('iiss', $detalleId, $nrequerimiento, $aprobadoPor, $asignadoA);
        $stmt3->execute();
        $stmt3->close();
        
        $conn->commit();
        return ['success' => true];
        
    } catch (Exception $e) {
        $conn->rollback();
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

/**
 * Registrar una entrega
 * @param mysqli $conn Conexión a la base de datos
 * @param int $detalleId ID del detalle
 * @param int $cantidad Cantidad entregada
 * @param string $entregadoPor Usuario que entrega
 * @param string $observaciones Observaciones opcionales
 * @return array ['success' => bool, 'entregaCompleta' => bool, 'pendiente' => int, 'error' => string]
 */
function registrarEntrega($conn, $detalleId, $cantidad, $entregadoPor, $observaciones = '') {
    $conn->begin_transaction();
    
    try {
        // 1. Obtener información del detalle y turno
        $stmt1 = $conn->prepare("
            SELECT d.NRequerimiento, d.NPallets, r.TurnoId 
            FROM scm_requerimientos_detalle d
            JOIN scm_requerimientos r ON d.NRequerimiento = r.NRequerimiento
            WHERE d.Id = ?
        ");
        $stmt1->bind_param('i', $detalleId);
        $stmt1->execute();
        $result = $stmt1->get_result();
        $row = $result->fetch_assoc();
        
        if (!$row) {
            $conn->rollback();
            return ['success' => false, 'error' => 'Detalle no encontrado'];
        }
        
        $nrequerimiento = intval($row['NRequerimiento']);
        $totalPallets = intval($row['NPallets']);
        $turnoId = $row['TurnoId'];
        $stmt1->close();
        
        // ===== VALIDACIÓN TURNO CERRADO =====
        if ($turnoId) {
            require_once __DIR__ . '/funciones_turnos.php';
            if (!turnoEstaAbierto($conn, $turnoId)) {
                $conn->rollback();
                return ['success' => false, 'error' => 'No se pueden registrar entregas. El turno está cerrado.'];
            }
        }
        // ===== FIN VALIDACIÓN TURNO =====
        
        // 2. Calcular total entregado actual
        $stmt2 = $conn->prepare("SELECT COALESCE(SUM(Cantidad), 0) as total FROM scm_entregas_movimientos WHERE DetalleId = ? AND TipoMovimiento = 'Entrega'");
        $stmt2->bind_param('i', $detalleId);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $row2 = $result2->fetch_assoc();
        $yaEntregado = intval($row2['total']);
        $stmt2->close();
        
        $pendiente = $totalPallets - $yaEntregado;
        
        // Validar que no exceda
        if ($cantidad > $pendiente) {
            $conn->rollback();
            return ['success' => false, 'error' => 'La cantidad excede los pallets pendientes'];
        }
        
        // 3. Registrar movimiento
        $stmt3 = $conn->prepare("INSERT INTO scm_entregas_movimientos (DetalleId, NRequerimiento, Cantidad, TipoMovimiento, EntregadoPor, Observaciones) VALUES (?, ?, ?, 'Entrega', ?, ?)");
        $stmt3->bind_param('iiiss', $detalleId, $nrequerimiento, $cantidad, $entregadoPor, $observaciones);
        $stmt3->execute();
        $stmt3->close();
        
        $nuevoPendiente = $pendiente - $cantidad;
        
        // 4. Si se completó, marcar como entregado
        if ($nuevoPendiente <= 0) {
            $stmt4 = $conn->prepare("UPDATE scm_requerimientos_detalle SET EstadoAprobacion = 'Entregado' WHERE Id = ?");
            $stmt4->bind_param('i', $detalleId);
            $stmt4->execute();
            $stmt4->close();
        }
        
        $conn->commit();
        return [
            'success' => true,
            'entregaCompleta' => $nuevoPendiente <= 0,
            'cantidadEntregada' => $cantidad,
            'cantidadRestante' => $nuevoPendiente
        ];
        
    } catch (Exception $e) {
        $conn->rollback();
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

/**
 * Obtener pendientes de entrega para un usuario
 * @param mysqli $conn Conexión a la base de datos
 * @param string $usuario Usuario asignado
 * @return array Pendientes agrupados por requerimiento
 */
function obtenerPendientesEntrega($conn, $usuario = null) {
    // Evitar duplicación por joins: calcular entregado/pendiente con subconsultas
        $sql = "SELECT 
                                d.Id,
                                d.NRequerimiento,
                                d.Codigo,
                                d.Producto,
                                d.NPallets,
                                d.Observaciones,
                                d.EstadoAprobacion,
                                r.Fecha,
                                r.Maquina,
                                r.Zona,
                                r.Prioridad,
                                (
                                    SELECT COALESCE(SUM(m2.Cantidad),0)
                                    FROM scm_entregas_movimientos m2
                                    WHERE m2.DetalleId = d.Id AND m2.TipoMovimiento = 'Entrega'
                                ) as Entregado,
                                (d.NPallets - (
                                    SELECT COALESCE(SUM(m3.Cantidad),0)
                                    FROM scm_entregas_movimientos m3
                                    WHERE m3.DetalleId = d.Id AND m3.TipoMovimiento = 'Entrega'
                                )) as Pendiente,
                                (
                                    SELECT ax.AsignadoA
                                    FROM scm_aprobaciones ax
                                    WHERE ax.DetalleId = d.Id AND ax.AsignadoA IS NOT NULL
                                    ORDER BY ax.AprobadoAt DESC, ax.Id DESC
                                    LIMIT 1
                                ) as AsignadoA
                        FROM scm_requerimientos_detalle d
                        JOIN scm_requerimientos r ON d.NRequerimiento = r.NRequerimiento
                        WHERE d.EstadoAprobacion = 'Aprobado'";

    // Si se solicita filtrar por usuario asignado, usar EXISTS para evitar duplicados
    if ($usuario) {
        // Comparación case-insensitive y sin espacios al inicio/final para evitar mismatch por formato
        $sql .= " AND EXISTS (SELECT 1 FROM scm_aprobaciones ax WHERE ax.DetalleId = d.Id AND LOWER(TRIM(ax.AsignadoA)) = LOWER(TRIM(?)))";
    }

    $sql .= " AND (d.NPallets - (
                  SELECT COALESCE(SUM(m3.Cantidad),0)
                  FROM scm_entregas_movimientos m3
                  WHERE m3.DetalleId = d.Id AND m3.TipoMovimiento = 'Entrega'
                )) > 0
              ORDER BY r.NRequerimiento DESC, d.Id DESC";

    if ($usuario) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $usuario);
    } else {
        $stmt = $conn->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    
    $groups = [];
    while ($row = $result->fetch_assoc()) {
        $nr = intval($row['NRequerimiento']);
        if (!isset($groups[$nr])) {
            $groups[$nr] = [
                'nrequerimiento' => $nr,
                'fecha' => $row['Fecha'] ?? '',
                'maquina' => $row['Maquina'] ?? '',
                'prioridad' => $row['Prioridad'] ?? 'Normal',
                'count' => 0,
                'items' => []
            ];
        }
        $groups[$nr]['items'][] = [
            'Id' => $row['Id'],
            'Codigo' => $row['Codigo'] ?? '',
            'Producto' => $row['Producto'] ?? '',
            'NPallets' => $row['NPallets'] ?? 0,
            'Observaciones' => $row['Observaciones'] ?? '',
            'EstadoAprobacion' => $row['EstadoAprobacion'] ?? 'Aprobado',
            'AsignadoA' => $row['AsignadoA'] ?? '',
            'Entregado' => $row['Entregado'] ?? 0,
            'Pendiente' => $row['Pendiente'] ?? 0
        ];
        $groups[$nr]['count']++;
    }
    
    $stmt->close();
    return $groups;
}

/**
 * Eliminar un detalle de requerimiento
 * @param mysqli $conn Conexión a la base de datos
 * @param int $detalleId ID del detalle
 * @return array ['success' => bool, 'error' => string]
 */
function eliminarDetalle($conn, $detalleId) {
    // Las FK CASCADE se encargarán de eliminar registros relacionados
    $stmt = $conn->prepare("DELETE FROM scm_requerimientos_detalle WHERE Id = ? LIMIT 1");
    $stmt->bind_param('i', $detalleId);
    
    if ($stmt->execute()) {
        $stmt->close();
        return ['success' => true];
    }
    
    $error = $stmt->error;
    $stmt->close();
    return ['success' => false, 'error' => $error];
}

/**
 * Obtener historial de entregas de un detalle
 * @param mysqli $conn Conexión a la base de datos
 * @param int $detalleId ID del detalle
 * @return array Lista de movimientos
 */
function obtenerHistorialEntregas($conn, $detalleId) {
    $stmt = $conn->prepare("SELECT * FROM scm_entregas_movimientos WHERE DetalleId = ? ORDER BY EntregadoAt DESC");
    $stmt->bind_param('i', $detalleId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $movimientos = [];
    while ($row = $result->fetch_assoc()) {
        $movimientos[] = $row;
    }
    
    $stmt->close();
    return $movimientos;
}
