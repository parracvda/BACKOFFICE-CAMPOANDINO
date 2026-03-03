<?php
require_once __DIR__ . '/../../../shared/conexion.php';
session_start();

header('Content-Type: application/json');

// Verificar sesión
if (!isset($_SESSION['IdUsuario']) || empty($_SESSION['IdUsuario'])) {
    echo json_encode(["success" => false, "mensaje" => "No autenticado."]);
    exit;
}

$currentId = intval($_SESSION['IdUsuario']);
$currentUser = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : '';

// Función auxiliar: comprobar si el usuario actual tiene la feature maintenance_access
function current_user_has_feature($conn, $currentId) {
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

// Solo permitir si el usuario actual es administrador lógico: usuario 'jparra' o tiene maintenance_access
$allowed = false;
if (strtolower($currentUser) === 'jparra') $allowed = true;
else {
    try { if (current_user_has_feature($conn, $currentId)) $allowed = true; } catch(Exception $e) { $allowed = false; }
}
// Permitir también si la página de mantenimiento marcó la sesión como autorizada
if (!$allowed) {
    try { if (isset($_SESSION['can_maintain']) && $_SESSION['can_maintain'] === true) $allowed = true; } catch(Exception $e) {}
}

if (!$allowed) {
    error_log('api_get_user_features: permisos insuficientes para usuario=' . ($currentUser ?? 'NULL') . ' id=' . intval($currentId));
    echo json_encode(["success" => false, "mensaje" => "Permisos insuficientes."]);
    exit;
}

$targetId = isset($_GET['idusuario']) ? intval($_GET['idusuario']) : 0;
if ($targetId <= 0) {
    echo json_encode(["success" => false, "mensaje" => "Parámetro idusuario faltante o inválido."]);
    exit;
}

$features = array();
try {
    $q = $conn->prepare("SELECT feature_key FROM user_features WHERE idusuario = ?");
    if ($q) {
        $q->bind_param('i', $targetId);
        $q->execute();
        $res = $q->get_result();
        while ($r = $res->fetch_assoc()) {
            $features[] = $r['feature_key'];
        }
        $q->close();
    }
} catch (Exception $e) {
    error_log('api_get_user_features error: ' . $e->getMessage());
    echo json_encode(["success" => false, "mensaje" => "Error leyendo features."]);
    exit;
}

echo json_encode(["success" => true, "idusuario" => $targetId, "features" => $features]);
exit;
?>
