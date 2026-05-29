<?php
require_once __DIR__ . '/../../shared/conexion.php';
session_start();

// Permisos: solo jparra o quien tenga maintenance_access
$currentUser = isset($_SESSION['usuario']) ? strtolower($_SESSION['usuario']) : '';
$currentId = isset($_SESSION['IdUsuario']) ? intval($_SESSION['IdUsuario']) : 0;

function current_user_has_feature_local($conn, $currentId) {
    $has = false;
    $q = $conn->prepare("SELECT 1 FROM user_features WHERE idusuario = ? AND feature_key = ? LIMIT 1");
    if ($q) {
        $feature = 'maintenance_access';
        $q->bind_param('is', $currentId, $feature);
        $q->execute();
        $res = $q->get_result();
        if ($res && $res->num_rows > 0) $has = true;
        $q->close();
    }
    return $has;
}

if ($currentUser !== 'jparra') {
  $ok = false;
  $hasFeature = false;
  try {
    if ($currentId > 0) {
      $hasFeature = current_user_has_feature_local($conn, $currentId);
      if ($hasFeature) $ok = true;
    }
  } catch(Exception $e) { $ok = false; }

  // Log detallado para depuración
  error_log(sprintf("mantenimiento_accesos: session usuario=%s id=%s hasFeature=%s computed_ok=%s",
    var_export($currentUser, true), var_export($currentId, true), var_export($hasFeature, true), var_export($ok, true)
  ));

  if (!$ok) {
    header('Content-Type: text/html; charset=utf-8');
    echo '<h2>Acceso denegado</h2><p>No tienes permisos para ver esta página.</p>';
    exit;
  }
}

// Marcar en la sesión que el usuario actual pasó la comprobación de mantenimiento
try { $_SESSION['can_maintain'] = true; } catch(Exception $e) { error_log('mantenimiento_accesos: no se pudo setear can_maintain'); }

// Obtener lista de usuarios para el selector
$users = array();
$res = $conn->query("SELECT IdUsuario, Usuario, Nombres FROM usuarios ORDER BY Usuario ASC");
if ($res) {
    while ($r = $res->fetch_assoc()) {
        $users[] = $r;
    }
    $res->close();
}

?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Mantenimiento de Accesos</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="../../public/stylespanel.css">
  <style>
    body{font-family:Arial,Helvetica,sans-serif;padding:18px;background:#f6fbfb}
    .card{background:#fff;padding:18px;border-radius:10px;max-width:900px;margin:0 auto;box-shadow:0 4px 18px rgba(0,0,0,0.06)}
    .row{display:flex;gap:12px;align-items:center}
    label{font-weight:600}
    /* Mostrar features en columna vertical */
    .features{margin-top:12px;display:flex;flex-direction:column;gap:8px}
    .feature-item{background:#fff;border:1px solid #e6f6f4;padding:10px 12px;border-radius:8px;display:flex;align-items:center;width:100%}
    .feature-item label{margin-left:10px}
    /* hijos indentados */
    .feature-item.child-item{margin-left:18px; background:#fbfefe}
    .msj{margin-top:12px}
    @media (max-width:600px){ .card{padding:12px; margin: 8px} .row{flex-direction:column;align-items:flex-start} }
  </style>
</head>
<body>
  <div class="card">
    <h2>Mantenimiento de Accesos</h2>
    <p>Selecciona un usuario y marca las funcionalidades que debe tener.</p>

    <div class="row">
      <label for="selUsers">Usuario:</label>
      <select id="selUsers">
        <option value="0">-- Seleccionar usuario --</option>
        <?php foreach($users as $u): ?>
          <option value="<?= htmlspecialchars($u['IdUsuario']) ?>"><?= htmlspecialchars($u['Usuario']) ?> - <?= htmlspecialchars($u['Nombres']) ?></option>
        <?php endforeach; ?>
      </select>
      <button id="btnRefresh">Refrescar features</button>
      <a href="../../public/panel.html" style="margin-left:auto">Volver al panel</a>
    </div>

    <div class="features" id="featuresList">
      <!-- Checkboxes renderizados por JS -->
    </div>

    <div class="msj" id="msj"></div>
  </div>

  <script>
    // Usuarios embebidos para uso si es necesario
    var availableUsers = <?= json_encode($users, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) ?>;
    // Id del usuario logueado en esta sesión (para actualizar localStorage cuando se edita a sí mismo)
    var currentSessionUserId = <?= intval($currentId) ?>;
  </script>
  <script src="mantenimiento_accesos.js"></script>
</body>
</html>
