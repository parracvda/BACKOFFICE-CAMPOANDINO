<?php
// api_buscar_almacenregistros.php - busca en la tabla almacenregistros por Codigo o Descripcion
header('Content-Type: application/json; charset=utf-8');
include 'conexion.php';

// Logging helper (temporal) - escribir en archivo en caso de error para diagnosticar hosting
function api_log($msg) {
    $f = __DIR__ . DIRECTORY_SEPARATOR . 'api_debug.log';
    $line = date('Y-m-d H:i:s') . ' ' . $_SERVER['REQUEST_METHOD'] . ' ' . ($_SERVER['REQUEST_URI'] ?? '') . ' - ' . $msg . "\n";
    @file_put_contents($f, $line, FILE_APPEND | LOCK_EX);
}

$q = '';
if (isset($_GET['q'])) $q = trim($_GET['q']);
if (isset($_POST['q'])) $q = trim($_POST['q']);

if ($q === '') {
    echo json_encode(['success' => true, 'result' => []]);
    exit;
}

$like = '%' . $q . '%';
$sql = "SELECT Id, Codigo, Descripcion FROM almacenregistros WHERE Codigo LIKE ? OR Descripcion LIKE ? LIMIT 50";
$result = [];
try {
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('ss', $like, $like);
        if ($stmt->execute()) {
            $res = $stmt->get_result();
            while ($row = $res->fetch_assoc()) {
                $result[] = [
                    'Id' => $row['Id'],
                    'Codigo' => $row['Codigo'],
                    'Descripcion' => $row['Descripcion']
                ];
            }
            echo json_encode(['success' => true, 'result' => $result]);
            $stmt->close();
            exit;
        } else {
            $err = 'api_buscar_almacenregistros: execute error: ' . $stmt->error;
            api_log($err);
        }
        $stmt->close();
    } else {
        $err = 'api_buscar_almacenregistros: prepare error: ' . $conn->error;
        api_log($err);
    }
} catch (Exception $e) {
    api_log('Exception: ' . $e->getMessage());
}

// Responder con error y opcionalmente detalle si se solicita debug
$debug = isset($_GET['debug']) && $_GET['debug'] == '1';
$resp = ['success' => false, 'result' => []];
if ($debug) {
    $resp['error'] = 'Consulta fallida, revisa api_debug.log en servidor.';
}
echo json_encode($resp);
exit;
