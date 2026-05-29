<?php
/**
 * subir_foto.php - Control de Activos
 *
 * Recibe una imagen vía $_FILES (raw) o $_POST['dataUri'] (base64 redimensionada),
 * la guarda en uploads/control_activos/ y devuelve la URL relativa.
 *
 * Uso:
 *   - POST multipart/form-data con campo "archivo" (raw, sin redimensionar)
 *   - POST application/x-www-form-urlencoded con campo "dataUri" (base64 redimensionada)
 *
 * Retorna: JSON { success: true, url: "uploads/control_activos/foto_xxx.webp" }
 */
header('Content-Type: application/json; charset=utf-8');

// Directorio de destino (relativo a la raíz del proyecto)
$uploadDir = __DIR__ . '/../../../uploads/control_activos/';

// Crear directorio si no existe
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
    if (!is_dir($uploadDir)) {
        echo json_encode(['success' => false, 'mensaje' => 'No se pudo crear el directorio de uploads']);
        exit;
    }
}

// ── Determinar si recibimos dataUri (base64) o archivo raw ──
$dataUri = $_POST['dataUri'] ?? '';

if (!empty($dataUri)) {
    // ── MODO: dataUri (base64) - imagen ya redimensionada desde el cliente ──
    // Validar formato data URI
    if (!preg_match('/^data:image\/(\w+);base64,(.+)$/', $dataUri, $matches)) {
        echo json_encode(['success' => false, 'mensaje' => 'Formato dataUri inválido']);
        exit;
    }

    $imgType = strtolower($matches[1]); // webp, jpeg, png, gif
    $base64Data = $matches[2];
    $imgData = @base64_decode($base64Data);
    if ($imgData === false || strlen($imgData) === 0) {
        echo json_encode(['success' => false, 'mensaje' => 'No se pudo decodificar la imagen base64']);
        exit;
    }

    // Validar tipo de imagen
    $allowedTypes = ['webp', 'jpeg', 'jpg', 'png', 'gif'];
    if (!in_array($imgType, $allowedTypes)) {
        echo json_encode(['success' => false, 'mensaje' => 'Tipo de imagen no permitido: ' . $imgType]);
        exit;
    }

    // Validar tamaño máximo (5 MB después de decodificar)
    $maxSize = 5 * 1024 * 1024;
    if (strlen($imgData) > $maxSize) {
        echo json_encode(['success' => false, 'mensaje' => 'La imagen no debe superar los 5 MB']);
        exit;
    }

    // Extensión: si es jpeg, usar .jpg
    $ext = ($imgType === 'jpeg') ? 'jpg' : $imgType;
    $filename = 'foto_' . uniqid() . '.' . $ext;
    $destPath = $uploadDir . $filename;

    if (@file_put_contents($destPath, $imgData) === false) {
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar la imagen']);
        exit;
    }

    $url = 'uploads/control_activos/' . $filename;
    echo json_encode(['success' => true, 'url' => $url]);
    exit;
}

// ── MODO: archivo raw vía $_FILES (compatibilidad hacia atrás) ──
if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
    $code = isset($_FILES['archivo']) ? $_FILES['archivo']['error'] : -1;
    echo json_encode(['success' => false, 'mensaje' => 'Error al subir archivo (código: ' . $code . ')']);
    exit;
}

$file = $_FILES['archivo'];

// Validar tipo de archivo por extensión
$allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExts)) {
    echo json_encode(['success' => false, 'mensaje' => 'Solo se permiten imágenes (JPG, PNG, GIF, WebP)']);
    exit;
}

// Validar tipo MIME básico
$allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowedMimes)) {
    echo json_encode(['success' => false, 'mensaje' => 'Tipo de archivo no permitido: ' . $file['type']]);
    exit;
}

// Validar tamaño máximo (5 MB)
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'mensaje' => 'La imagen no debe superar los 5 MB']);
    exit;
}

// Generar nombre único
$filename = 'foto_' . uniqid() . '.' . $ext;
$destPath = $uploadDir . $filename;

if (!@move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode(['success' => false, 'mensaje' => 'Error al guardar el archivo']);
    exit;
}

$url = 'uploads/control_activos/' . $filename;
echo json_encode(['success' => true, 'url' => $url]);
