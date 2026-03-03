<?php
header('Content-Type: application/json; charset=utf-8');
include '../../shared/conexion.php';

$idSucursal = isset($_GET['id_sucursal']) ? intval($_GET['id_sucursal']) : 0;
$result = [];
if ($idSucursal > 0) {
    $sql = "SELECT Id, Almacen FROM scm_almacen WHERE IdSucursal = ? ORDER BY Almacen ASC";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('i', $idSucursal);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $result[] = [
                'Id' => $row['Id'],
                'Almacen' => $row['Almacen']
            ];
        }
        $stmt->close();
    }
}
echo json_encode($result);
