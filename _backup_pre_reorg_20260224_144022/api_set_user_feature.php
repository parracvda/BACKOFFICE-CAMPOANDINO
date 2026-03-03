<?php
require_once "conexion.php";
session_start();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "mensaje" => "Use POST para este endpoint."]);
    exit;
}

// Verificar sesión
if (!isset($_SESSION['IdUsuario']) || empty($_SESSION['IdUsuario'])) {
    echo json_encode(["success" => false, "mensaje" => "No autenticado."]);
    exit;
}

$currentId = intval($_SESSION['IdUsuario']);
$currentUser = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : '';

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

// Permisos: solo jparra o quien tenga maintenance_access
$allowed = false;
if (strtolower($currentUser) === 'jparra') $allowed = true;
else { try { if (current_user_has_feature($conn, $currentId)) $allowed = true; } catch(Exception $e) { $allowed = false; } }

if (!$allowed) {
    echo json_encode(["success" => false, "mensaje" => "Permisos insuficientes."]);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!$body) { echo json_encode(["success" => false, "mensaje" => "JSON inválido."]); exit; }

$targetId = isset($body['idusuario']) ? intval($body['idusuario']) : 0;
$feature = isset($body['feature_key']) ? trim(substr($body['feature_key'], 0, 100)) : '';
$action = isset($body['action']) ? strtolower($body['action']) : '';

if ($targetId <= 0 || $feature === '' || !in_array($action, ['add','remove'])) {
    echo json_encode(["success" => false, "mensaje" => "Parámetros inválidos." ]);
    exit;
}

try {
    if ($action === 'add') {
        // Insertar si no existe
        $q = $conn->prepare("SELECT 1 FROM user_features WHERE idusuario = ? AND feature_key = ? LIMIT 1");
        $exists = false;
        if ($q) {
            $q->bind_param('is', $targetId, $feature);
            $q->execute(); $res = $q->get_result(); if ($res && $res->num_rows>0) $exists = true; $q->close();
        }
        if (!$exists) {
            $ins = $conn->prepare("INSERT INTO user_features (idusuario, feature_key) VALUES (?, ?)");
            if (!$ins) throw new Exception('Prepare insert failed: ' . $conn->error);
            $ins->bind_param('is', $targetId, $feature);
            if (!$ins->execute()) throw new Exception('Execute insert failed: ' . $ins->error);
            $ins->close();
        }
        echo json_encode(["success" => true, "accion" => "added", "feature" => $feature]);
        exit;
    } else {
        // remove
        $del = $conn->prepare("DELETE FROM user_features WHERE idusuario = ? AND feature_key = ?");
        if (!$del) throw new Exception('Prepare delete failed: ' . $conn->error);
        $del->bind_param('is', $targetId, $feature);
        if (!$del->execute()) throw new Exception('Execute delete failed: ' . $del->error);
        $affected = $del->affected_rows;
        $del->close();
        echo json_encode(["success" => true, "accion" => "removed", "feature" => $feature, "affected" => $affected]);
        exit;
    }
} catch (Exception $e) {
    error_log('api_set_user_feature error: ' . $e->getMessage());
    echo json_encode(["success" => false, "mensaje" => "Error al modificar feature."]);
    exit;
}

?>
