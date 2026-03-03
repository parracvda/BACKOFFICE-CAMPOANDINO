<?php
require 'conexion.php';
if (session_status() === PHP_SESSION_NONE) session_start();

// Param: id = Id de la fila aprobada (no NRequerimiento). Opcional: auto_print=1

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$nreq = isset($_GET['nrequerimiento']) ? intval($_GET['nrequerimiento']) : 0;
$autoPrint = isset($_GET['auto_print']) && $_GET['auto_print'] == '1';

if ($nreq <= 0) {
  // si no se pasó nrequerimiento intentar resolver desde id
  if ($id <= 0) {
    echo "<p>Id o NRequerimiento inválido.</p>";
    exit;
  }
  // Obtener NRequerimiento de la fila
  $stmt = $conn->prepare('SELECT NRequerimiento FROM scm_requerimientosproduccion WHERE Id = ? LIMIT 1');
  if (!$stmt) { echo "<p>Error preparando consulta.</p>"; exit; }
  $stmt->bind_param('i', $id);
  $stmt->execute();
  $res = $stmt->get_result();
  $row = $res ? $res->fetch_assoc() : null;
  $stmt->close();
  if (!$row || empty($row['NRequerimiento'])) { echo "<p>No se encontró el requerimiento.</p>"; exit; }
  $nreq = intval($row['NRequerimiento']);
}

// Obtener todas las filas (materiales) para ese NRequerimiento
$stmt2 = $conn->prepare('SELECT NRequerimiento, Fecha, Maquina, Zona, Motivo, Prioridad, Producto, Codigo, NPallets, Observaciones FROM scm_requerimientosproduccion WHERE NRequerimiento = ? ORDER BY Id ASC');
if (!$stmt2) { echo "<p>Error preparando consulta 2.</p>"; exit; }
$stmt2->bind_param('i', $nreq);
$stmt2->execute();
$res2 = $stmt2->get_result();
$rows = [];
while ($r = $res2->fetch_assoc()) $rows[] = $r;
$stmt2->close();

// Render printable HTML
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Impresión Requerimiento <?php echo htmlspecialchars(str_pad((string)$nreq,5,'0',STR_PAD_LEFT)); ?></title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;margin:20px;color:#111}
    h1{font-size:18px;margin-bottom:8px}
    .meta{margin-bottom:12px;color:#333}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th,td{border:1px solid #ccc;padding:8px;text-align:left;font-size:13px}
    thead th{background:#f6f8fa}
    @media print {
      body{margin:8mm}
      .no-print{display:none}
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom:10px">
    <button onclick="window.print();">Imprimir</button>
  </div>
  <h1>Requerimiento N° <?php echo htmlspecialchars(str_pad((string)$nreq,5,'0',STR_PAD_LEFT)); ?></h1>
  <div class="meta">Generado por: <?php echo isset($_SESSION['usuarionombre'])?htmlspecialchars($_SESSION['usuarionombre']):'(no identificado)'; ?> — Fecha: <?php echo date('d-m-Y H:i'); ?></div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Fecha</th>
        <th>Máquina</th>
        <th>Motivo</th>
        <th>Producto</th>
        <th>Código</th>
        <th>N° Pallets</th>
        <th>Observaciones</th>
      </tr>
    </thead>
    <tbody>
    <?php if (empty($rows)): ?>
      <tr><td colspan="8">No hay materiales registrados para este requerimiento.</td></tr>
    <?php else: $i=1; foreach($rows as $rr): ?>
      <tr>
        <td><?php echo $i++; ?></td>
        <td><?php echo htmlspecialchars((!empty($rr['Fecha']) && strtotime($rr['Fecha'])) ? date('d-m-Y', strtotime($rr['Fecha'])) : $rr['Fecha']); ?></td>
        <td><?php echo htmlspecialchars($rr['Maquina']); ?></td>
        <td><?php echo htmlspecialchars($rr['Motivo']); ?></td>
        <td><?php echo htmlspecialchars($rr['Producto']); ?></td>
        <td><?php echo htmlspecialchars($rr['Codigo']); ?></td>
        <td style="text-align:center"><?php echo htmlspecialchars($rr['NPallets']); ?></td>
        <td><?php echo htmlspecialchars($rr['Observaciones']); ?></td>
      </tr>
    <?php endforeach; endif; ?>
    </tbody>
  </table>

  <?php if ($autoPrint): ?>
  <script>
    // Auto print when loaded (useful when opened from aprobaciones JS)
    window.addEventListener('DOMContentLoaded', function(){
      setTimeout(function(){ window.print(); }, 300);
      // optionally close after printing (commented out):
      // window.onafterprint = function(){ window.close(); };
    });
  </script>
  <?php endif; ?>
</body>
</html>
