<?php
// api_check_pallet.php - comprueba si un CodigoPallet ya fue registrado en scm_registrotratamiento_pallets
header('Content-Type: application/json; charset=utf-8');
include 'conexion.php';

function api_log($msg) {
    $f = __DIR__ . DIRECTORY_SEPARATOR . 'api_debug.log';
    $line = date('Y-m-d H:i:s') . ' ' . $_SERVER['REQUEST_METHOD'] . ' ' . ($_SERVER['REQUEST_URI'] ?? '') . ' - ' . $msg . "\n";
    @file_put_contents($f, $line, FILE_APPEND | LOCK_EX);
}

$codigo = '';
if (isset($_GET['codigo'])) $codigo = trim($_GET['codigo']);
if (isset($_POST['codigo'])) $codigo = trim($_POST['codigo']);

if ($codigo === '') {
    echo json_encode(['success' => true, 'exists' => false]);
    exit;
}

$resp = ['success' => false, 'exists' => false];

$sql = "SELECT COUNT(*) AS c FROM scm_registrotratamiento_pallets WHERE CodigoPallet = ? LIMIT 1";
try {
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('s', $codigo);
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            if ($row = $res->fetch_assoc()) {
                $count = intval($row['c']);
                $resp['success'] = true;
                $resp['exists'] = ($count > 0);
            }
        } else {
            $err = 'api_check_pallet: execute failed: ' . $stmt->error;
            api_log($err);
        }
        $stmt->close();
    } else {
        $err = 'api_check_pallet: prepare failed: ' . $conn->error;
        api_log($err);
    }
} catch (Exception $e) {
    api_log('Exception: ' . $e->getMessage());
}

echo json_encode($resp);
exit;
