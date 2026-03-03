<?php
include 'datos.php';

if (!isset($_POST['accion']) || $_POST['accion'] !== 'guardarMotivoCierre') {
    echo json_encode(['error' => 'Acción no válida']);
    exit;
}

$motivo = isset($_POST['motivo']) ? $_POST['motivo'] : null;
$fecha = isset($_POST['fecha']) ? $_POST['fecha'] : null;
$sede = isset($_POST['sede']) ? $_POST['sede'] : null;
$turno = isset($_POST['turno']) ? $_POST['turno'] : null;
$maquina = isset($_POST['maquina']) ? $_POST['maquina'] : null;

if (!$motivo || !$fecha || !$sede || !$turno || !$maquina) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

// Obtener las horas programadas
$sqlHoras = "SELECT TotalHoras FROM produccion_registroprogramacion 
             WHERE Fecha = ? AND Sede = ? AND Turno = ? AND Maquina = ?";
$stmtHoras = $conn->prepare($sqlHoras);
$stmtHoras->bind_param("siii", $fecha, $sede, $turno, $maquina);
$stmtHoras->execute();
$stmtHoras->bind_result($horasProgramadas);
$stmtHoras->fetch();
$stmtHoras->close();

// Obtén HParadas (por ejemplo, desde produccion_registrocontrolparadas)
$sqlParadas = "SELECT TotalHoras FROM produccion_registrocontrolparadas 
               WHERE Fecha = ? AND Sede = ? AND Turno = ? AND Maquina = ?";
$stmtParadas = $conn->prepare($sqlParadas);
$stmtParadas->bind_param("siii", $fecha, $sede, $turno, $maquina);
$stmtParadas->execute();
$stmtParadas->bind_result($horasParadas);
$stmtParadas->fetch();
$stmtParadas->close();

// Calcula la diferencia
$hxjustificar = $horasProgramadas - $horasParadas;

// Ahora haces el UPDATE usando ese valor
$sqlUpdate = "UPDATE produccion_registrocontrolparadas 
              SET MotivoCierre = ?, HxJustificar = ?
              WHERE Fecha = ? AND Sede = ? AND Turno = ? AND Maquina = ?";
$stmtUpdate = $conn->prepare($sqlUpdate);
$stmtUpdate->bind_param("sdsiii", $motivo, $hxjustificar, $fecha, $sede, $turno, $maquina);
$stmtUpdate->execute();

if ($stmtUpdate->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmtUpdate->error]);
}

$stmtUpdate->close();
$conn->close();
?>