<?php
/**
 * subir_foto_checklist.php - Control de Activos
 *
 * Recibe una imagen en base64 (data URI) y la guarda en uploads/control_activos/checklist_fotos/
 * Devuelve la URL relativa.
 *
 * POST: { foto_base64: "data:image/webp;base64,..." }
 * Retorna: { success: true, url: "uploads/control_activos/checklist_fotos/foto_xxx.webp" }
 */
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['foto_base64'])) {
    echo json_encode(['success' => false, 'mensaje' => 'No se recibió la imagen']);
    exit;
}

$dataUri = $input['foto_base64'];

// Extraer el tipo MIME y los datos base64
if (!preg_match('/^data:image\/(\w+);base64,(.+)$/', $dataUri, $matches)) {
    echo json_encode(['success' => false, 'mensaje' => 'Formato de imagen inválido']);
    exit;
}

$ext = strtolower($matches[1]);
$base64Data = $matches[2];

// Validar extensión
$allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
if (!in_array($ext, $allowedExts)) {
    echo json_encode(['success' => false, 'mensaje' => 'Tipo de imagen no permitido: ' . $ext]);
    exit;
}

// Decodificar
$imageData = base64_decode($base64Data);
if ($imageData === false) {
    echo json_encode(['success' => false, 'mensaje' => 'Error al decodificar la imagen']);
    exit;
}

// Validar tamaño máximo (2 MB por foto)
$maxSize = 2 * 1024 * 1024;
if (strlen($imageData) > $maxSize) {
    echo json_encode(['success' => false, 'mensaje' => 'La imagen no debe superar los 2 MB']);
    exit;
}

// Directorio de destino
$uploadDir = __DIR__ . '/../../../uploads/control_activos/checklist_fotos/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
    if (!is_dir($uploadDir)) {
        echo json_encode(['success' => false, 'mensaje' => 'No se pudo crear el directorio de uploads']);
        exit;
    }
}

// Generar nombre único
$filename = 'cl_foto_' . uniqid() . '.' . $ext;
$destPath = $uploadDir . $filename;

if (!@file_put_contents($destPath, $imageData)) {
    echo json_encode(['success' => false, 'mensaje' => 'Error al guardar la imagen']);
    exit;
}

$url = 'uploads/control_activos/checklist_fotos/' . $filename;
echo json_encode(['success' => true, 'url' => $url]);
