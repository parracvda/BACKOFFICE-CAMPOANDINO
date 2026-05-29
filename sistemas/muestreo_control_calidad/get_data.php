<?php
// get_data.php

include 'db.php';

$action = $_GET['action'];

if ($action == 'getOrdenCompra') {
    
    $stmt = $pdo->query("SELECT DISTINCT OC FROM logistica_estatus_compras");
    $ordenes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ordenes);
} elseif ($action == 'getDescripcionMaterial') {
    $ordenCompra = $_GET['ordenCompra'];
    
    $stmt = $pdo->prepare("SELECT DISTINCT DescripcionMaterial FROM logistica_estatus_compras WHERE OC = ?");
    $stmt->execute([$ordenCompra]);
    $descripcion = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($descripcion);
} elseif ($action == 'getCodigoMaterial') {
    $descripcionMaterial = $_GET['descripcionMaterial'];
  
    $stmt = $pdo->prepare("SELECT CodigoMaterial FROM logistica_estatus_compras WHERE DescripcionMaterial = ?");
    $stmt->execute([$descripcionMaterial]);
    $codigos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($codigos);
}
?>
