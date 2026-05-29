<?php
// api/obtener_turno.php - Devuelve el turno actual (D/N) según sig_turno
session_start();
require_once __DIR__ . '/../../../shared/conexion.php';

header('Content-Type: application/json');

try {
  $horaActual = date('H:i:s');

  $stmt = $conn->prepare("
    SELECT nombre, hora_inicio, hora_fin 
    FROM sig_turno 
    WHERE activo = 1
    ORDER BY id ASC
  ");
  $stmt->execute();
  $result = $stmt->get_result();

  $turnoLetra = 'D'; // Default día

  while ($row = $result->fetch_assoc()) {
    $horaInicio = $row['hora_inicio'];
    $horaFin = $row['hora_fin'];
    $nombre = strtoupper(trim($row['nombre']));

    // Determinar si la hora actual está en el rango del turno
    $enRango = false;

    if ($horaFin > $horaInicio) {
      // Rango normal: mismo día
      if ($horaActual >= $horaInicio && $horaActual < $horaFin) {
        $enRango = true;
      }
    } else {
      // Rango que cruza medianoche (ej: 22:00 - 06:00)
      if ($horaActual >= $horaInicio || $horaActual < $horaFin) {
        $enRango = true;
      }
    }

    if ($enRango) {
      if (strpos($nombre, 'DIA') !== false || strpos($nombre, 'MAÑANA') !== false) {
        $turnoLetra = 'D';
      } elseif (strpos($nombre, 'NOCHE') !== false || strpos($nombre, 'TARDE') !== false) {
        $turnoLetra = 'N';
      }
      break;
    }
  }

  echo json_encode([
    'success' => true,
    'turno' => $turnoLetra,
    'hora_actual' => $horaActual
  ]);

} catch (Exception $e) {
  echo json_encode(['success' => false, 'error' => $e->getMessage(), 'turno' => 'D']);
}
