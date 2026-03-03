<?php
// guardar_tratamiento.php
session_start();
header('Content-Type: text/html; charset=utf-8');
require_once 'conexion.php';

// Sólo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: registrotratamiento.php');
  exit;
}

$errors = [];

// Validar datos comunes
$fecha = isset($_POST['fecha_tratamiento']) ? trim($_POST['fecha_tratamiento']) : '';
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
  $errors[] = 'Fecha de tratamiento inválida.';
}

$estacion = isset($_POST['estacion']) ? substr(trim($_POST['estacion']),0,45) : '';
$especie = isset($_POST['EspecieMaderaTratada']) ? substr(trim($_POST['EspecieMaderaTratada']),0,45) : '';
$observaciones = isset($_POST['observaciones']) ? substr(trim($_POST['observaciones']),0,200) : '';

// Validar especie
if ($especie === '') $errors[] = 'Especie de madera tratada requerida.';

// Procesar array de productos
$productos = [];
if (isset($_POST['productos']) && is_array($_POST['productos'])) {
  foreach ($_POST['productos'] as $idx => $prod) {
    // DEBUG: Ver qué datos están llegando
    error_log("DEBUG Producto #$idx: " . print_r($prod, true));
    
    // SALTAR BLOQUES VACÍOS: Si no tiene descripción, ignorar completamente este bloque
    $producto_desc = isset($prod['descripcion']) ? substr(trim($prod['descripcion']),0,300) : '';
    if ($producto_desc === '') {
      error_log("Bloque #$idx vacío, saltando...");
      continue; // Saltar bloques sin datos
    }
    
    // Obtener datos del producto desde el input visible o desde hidden
    $producto_id = isset($prod['id']) ? trim($prod['id']) : '';
    $producto_codigo = isset($prod['codigo']) ? substr(trim($prod['codigo']),0,100) : '';
    $producto_especie = isset($prod['especie']) ? substr(trim($prod['especie']),0,45) : '';
    
    // PARIHUELAS: usa cantidad_rumas y cantidad_unidades
    $cantidad_rumas = (isset($prod['cantidad_rumas']) && $prod['cantidad_rumas'] !== '') ? (int)$prod['cantidad_rumas'] : 0;
    $cantidad_unidades = (isset($prod['cantidad_unidades']) && $prod['cantidad_unidades'] !== '') ? (int)$prod['cantidad_unidades'] : 0;
    
    // LISTONES: usa cantidad_por_pallet (almacenado en cantidad_unidades)
    $cantidad_por_pallet = (isset($prod['cantidad_por_pallet']) && $prod['cantidad_por_pallet'] !== '') ? (int)$prod['cantidad_por_pallet'] : 0;
    
    // METROS CÚBICOS POR UNIDAD (para listones)
    $m3_unidad = (isset($prod['m3_unidad']) && $prod['m3_unidad'] !== '') ? floatval($prod['m3_unidad']) : 0.0;
    
    // CÓDIGOS DE PALLETS ESCANEADOS (para trazabilidad)
    $pallets_escaneados = [];
    if (isset($prod['pallets_escaneados'])) {
      $pallets_json = $prod['pallets_escaneados'];
      error_log("DEBUG: Campo pallets_escaneados RAW para producto #$idx: '$pallets_json'");
      
      // Intentar decodificar JSON solo si no está vacío
      if (!empty($pallets_json) && $pallets_json !== '[]') {
        $pallets_decoded = json_decode($pallets_json, true);
        if (is_array($pallets_decoded)) {
          $pallets_escaneados = $pallets_decoded;
          error_log("DEBUG: Pallets decodificados para producto #$idx: " . print_r($pallets_escaneados, true));
        } else {
          error_log("DEBUG: Error al decodificar JSON de pallets para producto #$idx - json_last_error: " . json_last_error_msg());
        }
      } else {
        error_log("DEBUG: Campo pallets_escaneados vacío o '[]' para producto #$idx");
      }
    } else {
      error_log("DEBUG: Campo pallets_escaneados NO EXISTE para producto #$idx");
    }
    
    // DETECCIÓN AUTOMÁTICA: Si tiene cantidad_por_pallet con valor, es LISTONES
    $esListones = false;
    if ($cantidad_por_pallet > 0) {
      $esListones = true;
      $cantidad_unidades = $cantidad_por_pallet;
      $cantidad_rumas = 1; // Usar 1 para indicar que hay un pallet
    } elseif (stripos($producto_especie, 'LISTON') !== false) {
      $esListones = true;
    }
    
    // Buscar la descripción del producto SOLO si no viene en el POST
    $producto_encontrado = ($producto_desc !== '');
    
    if (!$producto_encontrado) {
      error_log("Producto sin descripción en POST, intentando buscar en BD...");
      
      // Importante: El campo "id" puede contener tanto un ID numérico como un código
      // Por eso intentamos ambas búsquedas
      
      // Intento 1: Si tanto id como codigo tienen el mismo valor, probablemente sea un código
      if ($producto_id !== '' && $producto_codigo !== '' && $producto_id === $producto_codigo) {
      // Buscar directamente por código
      error_log("Intento 1: Buscando por codigo = '$producto_codigo'");
      $stmt_desc = $conn->prepare("SELECT Id, Descripcion, Codigo, Subgrupo FROM maestronisira WHERE Codigo = ? LIMIT 1");
      if ($stmt_desc) {
        $stmt_desc->bind_param('s', $producto_codigo);
        $stmt_desc->execute();
        $stmt_desc->store_result();
        error_log("Intento 1: Filas encontradas = " . $stmt_desc->num_rows);
        $stmt_desc->bind_result($id_real, $desc_found, $codigo_found, $subgrupo_found);
        if ($stmt_desc->fetch()) {
          error_log("Intento 1: ENCONTRADO - Id=$id_real, Desc=$desc_found, Subgrupo=$subgrupo_found");
          $producto_id = (string)$id_real; // Actualizar con el ID real
          $producto_desc = substr(trim($desc_found),0,300);
          $producto_codigo = substr(trim($codigo_found),0,100);
          if ($producto_especie === '' && $subgrupo_found) {
            $producto_especie = substr(trim($subgrupo_found),0,45);
          }
          if ($subgrupo_found && stripos($subgrupo_found, 'LISTON') !== false) {
            $esListones = true;
          } elseif (stripos($desc_found, 'LISTON') !== false) {
            $esListones = true;
            if ($producto_especie === '') {
              $producto_especie = 'LISTONES';
            }
          }
          $producto_encontrado = true;
        }
        $stmt_desc->close();
      }
    }
    
    // Intento 2: Buscar por ID si es numérico y no encontró en intento 1
    if (!$producto_encontrado && $producto_id !== '' && ctype_digit($producto_id)) {
      $stmt_desc2 = $conn->prepare("SELECT Descripcion, Codigo, Subgrupo FROM maestronisira WHERE Id = ? LIMIT 1");
      if ($stmt_desc2) {
        $pid_int = (int)$producto_id;
        $stmt_desc2->bind_param('i', $pid_int);
        $stmt_desc2->execute();
        $stmt_desc2->bind_result($desc_found2, $codigo_found2, $subgrupo_found2);
        if ($stmt_desc2->fetch()) {
          $producto_desc = substr(trim($desc_found2),0,300);
          if ($producto_codigo === '' && $codigo_found2) {
            $producto_codigo = substr(trim($codigo_found2),0,100);
          }
          if ($producto_especie === '' && $subgrupo_found2) {
            $producto_especie = substr(trim($subgrupo_found2),0,45);
          }
          if ($subgrupo_found2 && stripos($subgrupo_found2, 'LISTON') !== false) {
            $esListones = true;
          } elseif (stripos($desc_found2, 'LISTON') !== false) {
            $esListones = true;
            if ($producto_especie === '') {
              $producto_especie = 'LISTONES';
            }
          }
          $producto_encontrado = true;
        }
        $stmt_desc2->close();
      }
    }
    
    // Intento 3: Buscar solo por código si no encontró antes
    if (!$producto_encontrado && $producto_codigo !== '') {
      $stmt_desc3 = $conn->prepare("SELECT Id, Descripcion, Subgrupo FROM maestronisira WHERE Codigo = ? LIMIT 1");
      if ($stmt_desc3) {
        $stmt_desc3->bind_param('s', $producto_codigo);
        $stmt_desc3->execute();
        $stmt_desc3->bind_result($id_real3, $desc_found3, $subgrupo_found3);
        if ($stmt_desc3->fetch()) {
          $producto_id = (string)$id_real3; // Actualizar con el ID real
          $producto_desc = substr(trim($desc_found3),0,300);
          if ($producto_especie === '' && $subgrupo_found3) {
            $producto_especie = substr(trim($subgrupo_found3),0,45);
          }
          if ($subgrupo_found3 && stripos($subgrupo_found3, 'LISTON') !== false) {
            $esListones = true;
          } elseif (stripos($desc_found3, 'LISTON') !== false) {
            $esListones = true;
            if ($producto_especie === '') {
              $producto_especie = 'LISTONES';
            }
          }
          $producto_encontrado = true;
        }
        $stmt_desc3->close();
      }
    }
    } // Fin del if (!$producto_encontrado) - búsqueda en BD
    
    // Si aún no tenemos especie pero ya detectamos que es LISTONES, asignar por defecto
    if ($esListones && $producto_especie === '') {
      $producto_especie = 'LISTONES';
    }
    
    // Detectar tipo por descripción si aún no se detectó
    if (!$esListones && $producto_desc !== '' && stripos($producto_desc, 'LISTON') !== false) {
      $esListones = true;
      if ($producto_especie === '') {
        $producto_especie = 'LISTONES';
      }
    }
    
    // Log de debug para ver qué detectamos
    error_log("Producto #$idx detectado como " . ($esListones ? 'LISTONES' : 'PARIHUELAS') . 
              " | especie: $producto_especie | desc: $producto_desc | encontrado: " . ($producto_encontrado ? 'SI' : 'NO') . 
              " | id_busqueda: $producto_id | codigo_busqueda: $producto_codigo | cantidad_unidades: $cantidad_unidades | cantidad_rumas: $cantidad_rumas");
    
    // Validar cantidades según tipo de producto
    if ($esListones) {
      // Para LISTONES: validar que tenga cantidad_unidades (cantidad_por_pallet)
      if ($cantidad_unidades <= 0) {
        $errors[] = "Producto #" . ($idx+1) . " debe tener cantidad de unidades mayor a 0.";
      }
    } else {
      // Para PARIHUELAS: validar cantidad_rumas
      if ($cantidad_rumas <= 0) {
        $errors[] = "Producto #" . ($idx+1) . " debe tener cantidad de rumas mayor a 0.";
      }
      if ($cantidad_unidades < 0) {
        $errors[] = "Producto #" . ($idx+1) . " tiene cantidad de unidades inválida.";
      }
    }
    
    $productos[] = [
      'id' => $producto_id,
      'descripcion' => $producto_desc,
      'codigo' => $producto_codigo,
      'especie' => $producto_especie,
      'cantidad_rumas' => $cantidad_rumas,
      'cantidad_unidades' => $cantidad_unidades,
      'es_listones' => $esListones,
      'pallets_escaneados' => $pallets_escaneados,
      'm3_unidad' => $m3_unidad
    ];
  }
}

// Validar que haya al menos un producto
if (count($productos) === 0) {
  $errors[] = 'Debe ingresar al menos un producto.';
}

// Validar suma de rumas <= 8 (solo para parihuelas)
$tiene_parihuelas = false;
$total_rumas = 0;
foreach ($productos as $p) {
  if (!$p['es_listones']) {
    $tiene_parihuelas = true;
    $total_rumas += $p['cantidad_rumas'];
  }
}
if ($tiene_parihuelas && $total_rumas > 8) {
  $errors[] = 'La suma total de rumas no puede exceder 8. Total ingresado: ' . $total_rumas;
}

if (count($errors) > 0) {
  $msg = urlencode(implode(' | ', $errors));
  header('Location: registrotratamiento.php?error=' . $msg);
  exit;
}

$estado = 'ACTIVO';
// Preferir valor enviado por POST (campo oculto en el formulario). Si no está, usar sesión.
$registro_usuario = '';
if (isset($_POST['registro_usuario']) && strlen(trim($_POST['registro_usuario']))) {
  $registro_usuario = substr(trim($_POST['registro_usuario']),0,100);
} elseif (isset($_SESSION['usuario']) && strlen(trim($_SESSION['usuario']))) {
  $registro_usuario = substr(trim($_SESSION['usuario']),0,100);
} elseif (isset($_SESSION['usuarionombre']) && strlen(trim($_SESSION['usuarionombre']))) {
  $registro_usuario = substr(trim($_SESSION['usuarionombre']),0,100);
}

// Si no hay usuario, rechazar la petición y pedir login (no usar 'web')
if ($registro_usuario === '') {
  $msg = urlencode('Usuario no encontrado. Por favor inicie sesión.');
  error_log("DEBUG: registro_usuario vacío al guardar tratamiento. Abortando.");
  header('Location: registrotratamiento.php?error=' . $msg);
  exit;
}
error_log("DEBUG: registro_usuario resuelto a: " . $registro_usuario);

// =====================================================================
// GENERAR CORRELATIVO Y GUARDAR (TRANSACCIÓN ATÓMICA)
// =====================================================================
$conn->begin_transaction();

try {
  // 1. Obtener configuración de correlativo para la especie y bloquear la fila
  $stmt_get = $conn->prepare("SELECT last_number, prefijo, padding FROM scm_lotes_correlativos WHERE especie = ? FOR UPDATE");
  if (!$stmt_get) {
    throw new Exception('Error preparando consulta de correlativo: ' . $conn->error);
  }
  $stmt_get->bind_param('s', $especie);
  $stmt_get->execute();
  $stmt_get->bind_result($last_number, $prefijo, $padding);
  if (!$stmt_get->fetch()) {
    $stmt_get->close();
    throw new Exception('Especie no configurada en tabla de correlativos: ' . $especie);
  }
  $stmt_get->close();

  // 2. Incrementar el correlativo
  $nuevo_numero = $last_number + 1;

  // 3. Actualizar el last_number en la tabla de correlativos
  $stmt_upd = $conn->prepare("UPDATE scm_lotes_correlativos SET last_number = ? WHERE especie = ?");
  if (!$stmt_upd) {
    throw new Exception('Error preparando actualización de correlativo: ' . $conn->error);
  }
  $stmt_upd->bind_param('is', $nuevo_numero, $especie);
  $stmt_upd->execute();
  $stmt_upd->close();

  // 4. Formatear el lote: PREFIJO-XXXX (mismo para todos los productos)
  $lote_generado = $prefijo . '-' . str_pad((string)$nuevo_numero, $padding, '0', STR_PAD_LEFT);

  // 5. Preparar statement de inserción (se reutilizará para cada producto)
  $sql = "INSERT INTO scm_registrotratamientotermico
    (FechaTratamiento, Estacion, Lote, CorrelativoNumerico, EspecieMaderaTratada, Codigo, Producto, CantidadRumas, CantidadUnidades, Observaciones, estado, registro_usuario, registro_timestamp)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?, NOW())";

  $stmt_ins = $conn->prepare($sql);
  if (!$stmt_ins) {
    throw new Exception('Error preparando inserción: ' . $conn->error);
  }

  // 6. Insertar un registro por cada producto (todos con el mismo lote)
  $pallets_insertados = 0;
  foreach ($productos as $prod) {
    $codigo = $prod['codigo'];
    $producto_desc = $prod['descripcion'];
    $cantidad_rumas = $prod['cantidad_rumas'];
    $cantidad_unidades = $prod['cantidad_unidades'];
    $pallets_escaneados = $prod['pallets_escaneados'];
    $m3_unidad = $prod['m3_unidad'];
    $es_listones = $prod['es_listones'];
    
    // Si no hay código, intentar buscarlo por ID
    if ($codigo === '' && $prod['id'] !== '' && ctype_digit($prod['id'])) {
      $stmt_c = $conn->prepare("SELECT Codigo FROM maestronisira WHERE Id = ? LIMIT 1");
      if ($stmt_c) {
        $pid_int = (int)$prod['id'];
        $stmt_c->bind_param('i', $pid_int);
        $stmt_c->execute();
        $stmt_c->bind_result($found_codigo);
        if ($stmt_c->fetch()) {
          $codigo = substr(trim($found_codigo),0,100);
        }
        $stmt_c->close();
      }
    }
    
    // Bind y ejecutar inserción
    // Tipos: s Fecha, s Estacion, s Lote, i Correlativo, s Especie, s Codigo, s Producto, i CantRumas, i CantUnid, s Observaciones, s Estado, s Usuario
    $stmt_ins->bind_param('sssisssiisss', $fecha, $estacion, $lote_generado, $nuevo_numero, $especie, $codigo, $producto_desc, $cantidad_rumas, $cantidad_unidades, $observaciones, $estado, $registro_usuario);
    
    if (!$stmt_ins->execute()) {
      throw new Exception('Error al insertar producto "' . $producto_desc . '": ' . $stmt_ins->error);
    }
    
    // Obtener el ID del registro insertado para relacionar los pallets
    $id_tratamiento_insertado = $conn->insert_id;
    
    error_log("DEBUG: Tratamiento insertado con ID: $id_tratamiento_insertado");
    error_log("DEBUG: Pallets a insertar: " . count($pallets_escaneados) . " - Array: " . print_r($pallets_escaneados, true));
    
    // 6.1. Insertar los códigos de pallets escaneados en la tabla de trazabilidad
    if (!empty($pallets_escaneados) && is_array($pallets_escaneados)) {
      error_log("DEBUG: Iniciando inserción de pallets para tratamiento ID: $id_tratamiento_insertado");
      $stmt_pallet = $conn->prepare("INSERT INTO scm_registrotratamiento_pallets (IdTratamiento, CodigoPallet, Orden, CantidadUnidades, MetrosCubicos) VALUES (?, ?, ?, ?, ?)");
      if (!$stmt_pallet) {
        throw new Exception('Error preparando inserción de pallets: ' . $conn->error);
      }
      
      // Calcular cantidad y m³ por pallet
      $cantidad_por_pallet = 0;
      // Para especies que no son LISTONES no guardamos m3 (NULL)
      $m3_por_pallet = null;
      
      $num_pallets = count($pallets_escaneados);
      
      if ($es_listones) {
        // LISTONES: dividir cantidad_unidades entre número de pallets escaneados
        // Esto permite acumular varios pallets del mismo producto en un solo registro
        if ($num_pallets > 0 && $cantidad_unidades > 0) {
          $cantidad_por_pallet = (int) round($cantidad_unidades / $num_pallets);
        }
        // Calcular m³ por pallet
        if ($m3_unidad > 0 && $cantidad_por_pallet > 0) {
          $m3_por_pallet = $m3_unidad * $cantidad_por_pallet;
        }
      } else {
        // PARIHUELAS: dividir cantidad_unidades entre cantidad de pallets escaneados
        if ($num_pallets > 0 && $cantidad_unidades > 0) {
          $cantidad_por_pallet = (int) round($cantidad_unidades / $num_pallets);
        }
        
        // PARIHUELAS: Buscar m³ por unidad en tabla maestra
        if ($codigo !== '' && $cantidad_por_pallet > 0) {
          $stmt_m3 = $conn->prepare("SELECT M3PorUnidad FROM scm_maestro_m3_producto WHERE Codigo = ? AND Activo = 1 LIMIT 1");
          if ($stmt_m3) {
            $stmt_m3->bind_param('s', $codigo);
            $stmt_m3->execute();
            $stmt_m3->bind_result($m3_unidad_maestro);
            if ($stmt_m3->fetch()) {
              // Calcular m³ por pallet: m³_unidad × cantidad_por_pallet
              $m3_por_pallet = $m3_unidad_maestro * $cantidad_por_pallet;
              error_log("DEBUG: m³ PARIHUELA encontrado en maestro - Código: $codigo, m³/unidad: $m3_unidad_maestro, cantidad: $cantidad_por_pallet, m³ total: $m3_por_pallet");
            } else {
              error_log("DEBUG: m³ PARIHUELA NO encontrado en maestro para código: $codigo");
            }
            $stmt_m3->close();
          }
        }
      }
      
      $orden = 1;
      foreach ($pallets_escaneados as $codigo_pallet) {
        $codigo_pallet_clean = substr(trim($codigo_pallet), 0, 100);
        if ($codigo_pallet_clean !== '') {
          $stmt_pallet->bind_param('isiid', $id_tratamiento_insertado, $codigo_pallet_clean, $orden, $cantidad_por_pallet, $m3_por_pallet);
          if ($stmt_pallet->execute()) {
            $pallets_insertados++;
            error_log("Pallet insertado: $codigo_pallet_clean (Tratamiento ID: $id_tratamiento_insertado, Orden: $orden, Cantidad: $cantidad_por_pallet, m³: " . ($m3_por_pallet === null ? 'NULL' : $m3_por_pallet) . ")");
          } else {
            error_log("Error al insertar pallet $codigo_pallet_clean: " . $stmt_pallet->error);
          }
          $orden++;
        }
      }
      $stmt_pallet->close();
    } else {
      error_log("DEBUG: NO se insertaron pallets para tratamiento ID: $id_tratamiento_insertado - Razón: pallets_escaneados vacío o no es array. Count: " . count($pallets_escaneados) . ", Is array: " . (is_array($pallets_escaneados) ? 'SI' : 'NO'));
    }
  }
  
  $stmt_ins->close();

  // 7. Confirmar la transacción
  $conn->commit();

  // Determinar mensaje de éxito según cantidad de productos
  $tipo_tratamiento = count($productos) > 1 ? 'MIXTO' : 'ÚNICO';
  $msg_exito = 'Tratamiento ' . $tipo_tratamiento . ' guardado exitosamente. Lote: ' . $lote_generado . ' (' . count($productos) . ' producto' . (count($productos) > 1 ? 's' : '') . ')';
  if ($pallets_insertados > 0) {
    $msg_exito .= ' - ' . $pallets_insertados . ' pallet' . ($pallets_insertados > 1 ? 's' : '') . ' registrado' . ($pallets_insertados > 1 ? 's' : '');
  }
  
  error_log("GUARDADO EXITOSO: " . $msg_exito);
  
  // Redirigir con éxito
  header('Location: registrotratamiento.php?ok=' . urlencode($msg_exito));
  exit;

} catch (Exception $e) {
  // Revertir la transacción en caso de error
  $conn->rollback();
  $err = 'Error al guardar: ' . $e->getMessage();
  header('Location: registrotratamiento.php?error=' . urlencode($err));
  exit;
}
