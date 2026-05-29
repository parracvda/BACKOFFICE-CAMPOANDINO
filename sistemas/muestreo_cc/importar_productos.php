<?php
/**
 * Importar Maestro de Productos desde Excel / CSV
 * ─────────────────────────────────────────────────
 * El usuario descarga el maestro de Nisira en Excel,
 * lo sube aquí y el sistema llena sig_cc_productos.
 *
 * Soporta: .xlsx  .xls (guardado como xlsx)  .csv
 */
session_start();
set_time_limit(0);   // sin límite — necesario para archivos grandes
if (!isset($_SESSION['usuario'])) {
    header('Location: ../../public/index.html');
    exit;
}
// Limpiar sesión si se pide reset (debe ir antes de cualquier output)
if (isset($_GET['reset'])) {
    unset($_SESSION['imp_headers'], $_SESSION['imp_filas']);
    header('Location: importar_productos.php');
    exit;
}
require_once __DIR__ . '/../../shared/conexion.php';

// ══════════════════════════════════════════════════
//  FUNCIONES: PARSEAR ARCHIVOS
// ══════════════════════════════════════════════════

/** Convierte "A" → 0, "B" → 1, "AA" → 26 … */
function colStrToIdx($col) {
    $col = strtoupper($col);
    $idx = 0;
    for ($i = 0; $i < strlen($col); $i++) {
        $idx = $idx * 26 + (ord($col[$i]) - 64);
    }
    return $idx - 1;
}

/** Lee un .xlsx usando ZipArchive + SimpleXML (sin librerías extra) */
function leerXLSX($ruta) {
    if (!class_exists('ZipArchive')) {
        return ['error' => 'PHP no tiene ZipArchive habilitado.'];
    }
    $zip = new ZipArchive();
    if ($zip->open($ruta) !== true) {
        return ['error' => 'No se pudo abrir el archivo. ¿Está dañado?'];
    }

    // Cadenas compartidas
    $ss = [];
    $ssXml = $zip->getFromName('xl/sharedStrings.xml');
    if ($ssXml) {
        $xml = @simplexml_load_string($ssXml);
        if ($xml) {
            foreach ($xml->si as $si) {
                if (isset($si->t)) {
                    $ss[] = (string)$si->t;
                } else {
                    $t = '';
                    foreach ($si->r as $r) { $t .= (string)$r->t; }
                    $ss[] = $t;
                }
            }
        }
    }

    // Primera hoja
    $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
    $zip->close();

    if (!$sheetXml) {
        return ['error' => 'No se encontró la hoja de datos en el archivo.'];
    }
    $sheet = @simplexml_load_string($sheetXml);
    if (!$sheet) {
        return ['error' => 'No se pudo leer el contenido del archivo.'];
    }

    $rows = [];
    foreach ($sheet->sheetData->row as $row) {
        $cells   = [];
        $maxCol  = 0;
        foreach ($row->c as $cell) {
            $colStr = preg_replace('/[0-9]/', '', (string)$cell['r']);
            $ci     = colStrToIdx($colStr);
            $type   = (string)$cell['t'];
            $val    = isset($cell->v) ? (string)$cell->v : '';
            if ($type === 's') {
                $val = $ss[(int)$val] ?? '';
            }
            $cells[$ci] = trim($val);
            if ($ci > $maxCol) $maxCol = $ci;
        }
        $norm = [];
        for ($i = 0; $i <= $maxCol; $i++) {
            $norm[] = $cells[$i] ?? '';
        }
        $rows[] = $norm;
    }
    return ['rows' => $rows];
}

/** Lee un .csv detectando delimitador y encoding */
function leerCSV($ruta) {
    $raw = file_get_contents($ruta);
    if ($raw === false) return ['error' => 'No se pudo leer el archivo CSV.'];

    // Convertir a UTF-8 si está en Latin-1 (frecuente en exportaciones de ERP)
    if (!mb_detect_encoding($raw, 'UTF-8', true)) {
        $raw = mb_convert_encoding($raw, 'UTF-8', 'ISO-8859-1');
        file_put_contents($ruta, $raw);
    }

    $handle = fopen($ruta, 'r');
    if (!$handle) return ['error' => 'No se pudo abrir el CSV.'];

    $firstLine = fgets($handle);
    rewind($handle);
    $delim = (substr_count($firstLine, ';') >= substr_count($firstLine, ',')) ? ';' : ',';

    $rows = [];
    while (($row = fgetcsv($handle, 0, $delim)) !== false) {
        $rows[] = array_map('trim', $row);
    }
    fclose($handle);
    return ['rows' => $rows];
}

/** Mapea columnas según la fuente del Excel (campos conocidos) */
function mapearColumnas($headers, $fuente) {
    // Campos fijos por fuente
    $campos = [
        'vpn'    => ['cod' => 'idproducto',  'nom' => 'producto',     'grp' => 'grupo'],
        'nisira' => ['cod' => 'idproducto',  'nom' => 'descripcion',  'grp' => 'grupo_dsc'],
    ];
    $cfg  = $campos[$fuente] ?? $campos['vpn'];
    $rCod = -1; $rNom = -1; $rGrp = -1;
    foreach ($headers as $i => $h) {
        $hl = mb_strtolower(trim($h));
        if ($rCod === -1 && $hl === $cfg['cod']) $rCod = $i;
        if ($rNom === -1 && $hl === $cfg['nom']) $rNom = $i;
        if ($rGrp === -1 && $hl === $cfg['grp']) $rGrp = $i;
    }
    return [$rCod, $rNom, $rGrp];
}

// ══════════════════════════════════════════════════
//  LÓGICA DE PASOS
// ══════════════════════════════════════════════════
$paso    = 1;
$error   = '';
$headers = [];
$filas   = [];
$resultado = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';

    // ── PASO 1 → 2 : subir y previsualizar ──────────────────
    if ($accion === 'subir') {        $fuente = in_array($_POST['fuente'] ?? '', ['vpn','nisira']) ? $_POST['fuente'] : 'vpn';        if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
            $error = 'No se recibió el archivo o hubo un error al subirlo. Intenta de nuevo.';
        } else {
            $nombre = $_FILES['archivo']['name'];
            $ext    = strtolower(pathinfo($nombre, PATHINFO_EXTENSION));

            if (!in_array($ext, ['xlsx', 'csv'])) {
                $error = 'Solo se aceptan archivos .xlsx o .csv';
            } else {
                $tmpDest = sys_get_temp_dir() . '/mcc_import_' . session_id() . '.' . $ext;
                if (!move_uploaded_file($_FILES['archivo']['tmp_name'], $tmpDest)) {
                    $error = 'Error al guardar el archivo. Verifica permisos del servidor.';
                } else {
                    $parsed = ($ext === 'csv') ? leerCSV($tmpDest) : leerXLSX($tmpDest);
                    if (isset($parsed['error'])) {
                        $error = $parsed['error'];
                        @unlink($tmpDest);
                    } elseif (empty($parsed['rows']) || count($parsed['rows']) < 2) {
                        $error = 'El archivo está vacío o solo tiene encabezado.';
                        @unlink($tmpDest);
                    } else {
                        $headers = $parsed['rows'][0];
                        $filas   = array_values(array_filter(
                            array_slice($parsed['rows'], 1),
                            function($r) {
                                return count(array_filter($r, function($v) { return $v !== ''; })) > 0;
                            }
                        ));
                        $_SESSION['imp_headers'] = $headers;
                        $_SESSION['imp_filas']   = $filas;
                        $_SESSION['imp_fuente']  = $fuente;
                        $paso = 2;
                    }
                }
            }
        }

    // ── PASO 2 → 3 : importar ───────────────────────────────
    } elseif ($accion === 'importar') {
        $headers  = $_SESSION['imp_headers'] ?? [];
        $filas    = $_SESSION['imp_filas']   ?? [];
        $fuente   = $_SESSION['imp_fuente']  ?? 'vpn';
        [$colCod, $colNom, $colGrp] = mapearColumnas($headers, $fuente);

        if (empty($filas)) {
            $error = 'Sesión expirada. Vuelve a subir el archivo.';
        } elseif ($colNom < 0) {
            $error = 'No se encontró la columna de nombre/descripción. Verifica que el archivo sea del tipo correcto (' . ($fuente === 'vpn' ? 'Excel VPN' : 'Excel Nisira') . ').';
            $paso = 2;
        } else {
            $ins = 0; $upd = 0; $omit = 0; $errLines = [];

            // Preparar filas válidas
            $validas = [];
            foreach ($filas as $n => $fila) {
                $nombre = isset($fila[$colNom]) ? trim($fila[$colNom]) : '';
                $codigo = ($colCod >= 0 && isset($fila[$colCod])) ? trim($fila[$colCod]) : '';
                $grupo  = ($colGrp >= 0 && isset($fila[$colGrp])) ? trim($fila[$colGrp]) : '';
                if ($nombre === '') { $omit++; continue; }
                if ($codigo === '') { $codigo = mb_substr($nombre, 0, 60); }
                $validas[] = [
                    mb_substr($codigo, 0, 60),
                    mb_substr($nombre, 0, 255),
                    mb_substr($grupo,  0, 80),
                ];
            }

            // INSERT en lotes de 500 filas
            $lote = 500;
            foreach (array_chunk($validas, $lote) as $chunk) {
                $placeholders = implode(',', array_fill(0, count($chunk), '(?,?,?,1)'));
                $sql = "INSERT INTO sig_cc_productos (codigo, nombre, grupo, activo)
                        VALUES {$placeholders}
                        ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), grupo = VALUES(grupo), activo = 1";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    $errLines[] = 'Error prepare: ' . $conn->error;
                    $omit += count($chunk);
                    continue;
                }
                $tipos  = str_repeat('sss', count($chunk));
                $params = [];
                foreach ($chunk as $row) { $params[] = $row[0]; $params[] = $row[1]; $params[] = $row[2]; }
                // bind_param requiere referencias; construimos array de referencias
                $refs = [$tipos];
                foreach ($params as $k => $v) { $refs[] = &$params[$k]; }
                call_user_func_array([$stmt, 'bind_param'], $refs);
                if ($stmt->execute()) {
                    $ins += $stmt->affected_rows > 0 ? count($chunk) : 0;
                } else {
                    $errLines[] = 'Error lote: ' . $stmt->error;
                    $omit += count($chunk);
                }
                $stmt->close();
            }

            // Limpiar sesión
            unset($_SESSION['imp_headers'], $_SESSION['imp_filas'], $_SESSION['imp_fuente']);

            $resultado = ['ins' => $ins, 'upd' => $upd, 'omit' => $omit, 'errores' => $errLines];
            $paso = 3;
        }
    }
}

// Restaurar paso 2 si hay datos en sesión (recarga o back)
if ($paso === 1 && isset($_SESSION['imp_headers'])) {
    $headers = $_SESSION['imp_headers'];
    $filas   = $_SESSION['imp_filas'];
    $paso    = 2;
}

$totalFilas  = count($filas);
$fuente      = $_SESSION['imp_fuente'] ?? 'vpn';
$nomFuente   = $fuente === 'nisira' ? 'Excel Nisira' : 'Excel (VPN)';
[$colCodPrev, $colNomPrev, $colGrpPrev] = ($paso === 2 && !empty($headers)) ? mapearColumnas($headers, $fuente) : [-1, -1, -1];
$camposDetectados = [
    'vpn'    => ['cod' => 'idproducto', 'nom' => 'producto',    'grp' => 'grupo'],
    'nisira' => ['cod' => 'idproducto', 'nom' => 'descripcion', 'grp' => 'grupo_dsc'],
];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Importar Productos – Muestreo CC</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'Roboto', sans-serif; background: #f4f8fb; margin: 0; min-height: 100vh; }

    .mcc-header {
      background: linear-gradient(90deg, #1fa9a0 0%, #17857e 100%);
      color: #fff; padding: 14px 28px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,.12);
    }
    .mcc-header-title { font-size: 1.2rem; font-weight: 700; }
    .mcc-header-sub   { font-size: .85rem; opacity: .85; margin-top: 2px; }
    .btn-header {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 16px; border-radius: 6px; border: none;
      font-size: .85rem; font-weight: 600; cursor: pointer;
      background: rgba(255,255,255,.18); color: #fff;
      text-decoration: none; transition: background .15s;
    }
    .btn-header:hover { background: rgba(255,255,255,.3); }

    .container { max-width: 820px; margin: 32px auto; padding: 0 20px; }

    /* Stepper */
    .stepper { display: flex; align-items: center; margin-bottom: 28px; }
    .step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
    .step:not(:last-child)::after {
      content: ''; position: absolute; top: 16px; left: calc(50% + 20px);
      width: calc(100% - 40px); height: 2px; background: #d0dde5;
    }
    .step.done:not(:last-child)::after  { background: #1fa9a0; }
    .step.active:not(:last-child)::after { background: #d0dde5; }
    .step-circle {
      width: 32px; height: 32px; border-radius: 50%; border: 2px solid #d0dde5;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: .85rem; color: #999; background: #fff;
      position: relative; z-index: 1;
    }
    .step.active .step-circle { border-color: #1fa9a0; color: #1fa9a0; }
    .step.done   .step-circle { background: #1fa9a0; border-color: #1fa9a0; color: #fff; }
    .step-label { font-size: .75rem; color: #999; margin-top: 5px; text-align: center; }
    .step.active .step-label { color: #1fa9a0; font-weight: 600; }
    .step.done   .step-label { color: #1fa9a0; }

    /* Card */
    .card {
      background: #fff; border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,.07);
      padding: 28px 32px;
    }
    .card-title { font-size: 1.05rem; font-weight: 700; color: #17857e; margin: 0 0 6px; }
    .card-sub   { color: #6b7a87; font-size: .88rem; margin: 0 0 24px; }

    /* Upload zone */
    .upload-zone {
      border: 2px dashed #b2ccd6; border-radius: 10px;
      padding: 40px 20px; text-align: center;
      background: #f8fcfc; cursor: pointer;
      transition: border-color .2s, background .2s;
    }
    .upload-zone:hover, .upload-zone.over {
      border-color: #1fa9a0; background: #edf9f8;
    }
    .upload-zone i { font-size: 2.4rem; color: #1fa9a0; }
    .upload-zone p { margin: 10px 0 4px; font-weight: 600; color: #3a3a4a; }
    .upload-zone small { color: #888; font-size: .82rem; }
    #fileInput { display: none; }
    #fileName  { margin-top: 10px; font-size: .85rem; color: #1fa9a0; font-weight: 600; }

    .btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 9px 22px; border-radius: 7px; border: none;
      font-size: .9rem; font-weight: 600; cursor: pointer;
      font-family: inherit; transition: background .15s;
    }
    .btn-primary   { background: #1fa9a0; color: #fff; }
    .btn-primary:hover { background: #17857e; }
    .btn-secondary { background: #e8f0f2; color: #3a3a4a; }
    .btn-secondary:hover { background: #d5e4ea; }
    .btn:disabled  { opacity: .5; cursor: not-allowed; }

    .error-box {
      background: #fff3f3; border-left: 4px solid #e05252;
      padding: 12px 16px; border-radius: 6px; color: #c0392b;
      font-size: .88rem; margin-bottom: 20px;
      display: flex; align-items: flex-start; gap: 10px;
    }

    /* Preview table */
    .preview-wrap { overflow-x: auto; margin: 16px 0; border-radius: 8px; border: 1px solid #e0eaef; }
    table { width: 100%; border-collapse: collapse; font-size: .82rem; }
    thead th {
      background: #f0f7f8; color: #17857e; padding: 8px 12px;
      text-align: left; font-weight: 700; white-space: nowrap;
      border-bottom: 2px solid #d0e8ea;
    }
    tbody td { padding: 7px 12px; border-bottom: 1px solid #f0f4f6; color: #3a3a4a; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover td { background: #f8fcfc; }

    /* Column mapper */
    .mapper-row {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 14px; flex-wrap: wrap;
    }
    .mapper-label { font-weight: 600; color: #3a3a4a; min-width: 180px; font-size: .9rem; }
    .mapper-label small { display: block; font-weight: 400; color: #888; font-size: .78rem; }
    .mapper-row select {
      flex: 1; min-width: 200px; padding: 8px 12px;
      border: 1.5px solid #d0dde5; border-radius: 7px;
      font-size: .88rem; font-family: inherit; color: #3a3a4a;
      background: #fff; cursor: pointer;
    }
    .mapper-row select:focus { outline: none; border-color: #1fa9a0; }

    /* Result */
    .result-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr));
      gap: 16px; margin: 20px 0;
    }
    .result-card {
      background: #f0f9f8; border-radius: 10px; padding: 18px;
      text-align: center; border: 1.5px solid #d0eeea;
    }
    .result-card .num { font-size: 2rem; font-weight: 700; color: #1fa9a0; }
    .result-card .lbl { font-size: .8rem; color: #6b7a87; margin-top: 4px; }
    .result-card.warn { background: #fff9ef; border-color: #f0d58c; }
    .result-card.warn .num { color: #c47d0e; }

    .success-banner {
      background: #edfaf8; border-left: 4px solid #1fa9a0;
      border-radius: 8px; padding: 16px 20px;
      display: flex; align-items: center; gap: 14px;
      color: #155e59; font-weight: 600; margin-bottom: 20px;
    }
    .success-banner i { font-size: 1.5rem; color: #1fa9a0; }

    .errlist { font-size: .8rem; color: #c0392b; margin: 8px 0 0 18px; }

    .actions { display: flex; gap: 10px; margin-top: 22px; flex-wrap: wrap; }

    @media(max-width:600px) {
      .container { padding: 0 10px; }
      .card { padding: 18px 14px; }
      .mapper-label { min-width: 100%; }
    }
  </style>
</head>
<body>

<div class="mcc-header">
  <div>
    <div class="mcc-header-title"><i class="fa fa-file-import"></i> Importar Maestro de Productos</div>
    <div class="mcc-header-sub">Muestreo Control de Calidad – Campo Andino</div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;">
    <a href="tablas.php" class="btn-header"><i class="fa fa-table"></i> Tablas</a>
    <a href="registro.php" class="btn-header"><i class="fa fa-clipboard-list"></i> Registro</a>
    <a href="../../public/panel.html" class="btn-header"><i class="fa fa-home"></i> Panel</a>
  </div>
</div>

<div class="container">

  <!-- Stepper -->
  <div class="stepper">
    <div class="step <?= $paso >= 1 ? ($paso > 1 ? 'done' : 'active') : '' ?>">
      <div class="step-circle"><?= $paso > 1 ? '<i class="fa fa-check"></i>' : '1' ?></div>
      <span class="step-label">Elegir fuente y archivo</span>
    </div>
    <div class="step <?= $paso >= 2 ? ($paso > 2 ? 'done' : 'active') : '' ?>">
      <div class="step-circle"><?= $paso > 2 ? '<i class="fa fa-check"></i>' : '2' ?></div>
      <span class="step-label">Vista previa y confirmar</span>
    </div>
    <div class="step <?= $paso >= 3 ? 'active' : '' ?>">
      <div class="step-circle">3</div>
      <span class="step-label">Resultado</span>
    </div>
  </div>

  <?php if ($error): ?>
  <div class="error-box"><i class="fa fa-circle-exclamation"></i><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>


  <!-- ══ PASO 1: Subir archivo ══════════════════════════════ -->
  <?php if ($paso === 1): ?>
  <div class="card">
    <p class="card-title">Selecciona el archivo exportado de Nisira</p>
    <p class="card-sub">
      Desde Nisira, abre el maestro de productos y exporta a <strong>Excel (.xlsx)</strong> o <strong>CSV</strong>.
      Luego súbelo aquí — el sistema detectará automáticamente las columnas.
    </p>

    <form method="post" enctype="multipart/form-data" id="frmSubir">
      <input type="hidden" name="accion" value="subir">

      <!-- Radio: fuente -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px;">
        <label style="flex:1;min-width:220px;display:flex;gap:12px;align-items:flex-start;border:2px solid #d0e8ea;border-radius:10px;padding:14px 16px;cursor:pointer;" id="rcVPN">
          <input type="radio" name="fuente" value="vpn" checked style="margin-top:3px">
          <span>
            <strong style="display:block;color:#1fa9a0"><i class="fa fa-network-wired"></i> Excel (VPN)</strong>
            <small style="color:#6b7a87">Descargado de la vista Nisira con VPN activa</small><br>
            <small style="color:#aaa">Columnas: <em>idproducto</em> &middot; <em>producto</em> &middot; <em>grupo</em></small>
          </span>
        </label>
        <label style="flex:1;min-width:220px;display:flex;gap:12px;align-items:flex-start;border:2px solid #d0e8ea;border-radius:10px;padding:14px 16px;cursor:pointer;" id="rcNisira">
          <input type="radio" name="fuente" value="nisira" style="margin-top:3px">
          <span>
            <strong style="display:block;color:#1fa9a0"><i class="fa fa-file-excel"></i> Excel (Nisira)</strong>
            <small style="color:#6b7a87">Exportado desde el módulo de Nisira sin VPN</small><br>
            <small style="color:#aaa">Columnas: <em>Idproducto</em> &middot; <em>Descripcion</em> &middot; <em>Grupo_dsc</em></small>
          </span>
        </label>
      </div>

      <div class="upload-zone" id="dropZone">
        <input type="file" name="archivo" id="fileInput" accept=".xlsx,.csv">
        <i class="fa fa-cloud-arrow-up"></i>
        <p>Arrastra tu archivo aquí o haz clic para seleccionar</p>
        <small>Formatos aceptados: .xlsx · .csv &nbsp;|&nbsp; Máx. 10 MB</small>
        <div id="fileName"></div>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary" id="btnSubir" disabled>
          <i class="fa fa-arrow-right"></i> Continuar
        </button>
      </div>
    </form>
  </div>


  <!-- ══ PASO 2: Vista previa + confirmar ════════════════════ -->
  <?php elseif ($paso === 2): ?>
  <div class="card">
    <p class="card-title">Vista previa &ndash; <?= htmlspecialchars($nomFuente) ?></p>
    <p class="card-sub">
      Se encontraron <strong><?= number_format($totalFilas) ?> filas</strong>.
      <?php if ($colNomPrev >= 0): ?>
        Columnas detectadas:
        <strong><?= htmlspecialchars($headers[$colCodPrev] ?? '&mdash;') ?></strong> (código) &middot;
        <strong><?= htmlspecialchars($headers[$colNomPrev] ?? '&mdash;') ?></strong> (nombre) &middot;
        <strong><?= htmlspecialchars($colGrpPrev >= 0 ? ($headers[$colGrpPrev] ?? '—') : 'no encontrado') ?></strong> (grupo).
      <?php else: ?>
        <span style="color:#e05252">No se encontraron las columnas esperadas para <strong><?= htmlspecialchars($nomFuente) ?></strong>.
        Verifica que sea el archivo correcto o cambia el tipo de origen.</span>
      <?php endif; ?>
    </p>

    <div class="preview-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <?php foreach ($headers as $h): ?>
            <th><?= htmlspecialchars($h ?: '(sin título)') ?></th>
            <?php endforeach; ?>
          </tr>
        </thead>
        <tbody>
          <?php foreach (array_slice($filas, 0, 8) as $i => $fila): ?>
          <tr>
            <td style="color:#aaa"><?= $i + 1 ?></td>
            <?php foreach ($headers as $ci => $h): ?>
            <td><?= htmlspecialchars(mb_substr($fila[$ci] ?? '', 0, 60)) ?></td>
            <?php endforeach; ?>
          </tr>
          <?php endforeach; ?>
          <?php if ($totalFilas > 8): ?>
          <tr>
            <td colspan="<?= count($headers) + 1 ?>" style="color:#aaa;text-align:center;padding:8px">
              … y <?= number_format($totalFilas - 8) ?> filas más
            </td>
          </tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

    <form method="post" id="frmImportar">
      <input type="hidden" name="accion" value="importar">

      <div class="actions">
        <a href="importar_productos.php?reset=1" class="btn btn-secondary">
          <i class="fa fa-arrow-left"></i> Cambiar archivo
        </a>
        <button type="submit" class="btn btn-primary" id="btnImportar" <?= $colNomPrev < 0 ? 'disabled title="No se detectaron columnas correctas"' : '' ?>>
          <i class="fa fa-database"></i> Importar <?= number_format($totalFilas) ?> productos
        </button>
      </div>
    </form>
  </div>

  <!-- ══ PASO 3: Resultado ══════════════════════════════════ -->
  <?php elseif ($paso === 3 && $resultado): ?>
  <div class="card">
    <?php if ($resultado['ins'] > 0 || $resultado['upd'] > 0): ?>
    <div class="success-banner">
      <i class="fa fa-circle-check"></i>
      Importación completada correctamente.
    </div>
    <?php else: ?>
    <div class="error-box"><i class="fa fa-triangle-exclamation"></i> No se importó ningún producto. Revisa el mapeo de columnas.</div>
    <?php endif; ?>

    <div class="result-grid">
      <div class="result-card">
        <div class="num"><?= number_format($resultado['ins']) ?></div>
        <div class="lbl">Productos importados<br>(nuevos o actualizados)</div>
      </div>
      <?php if ($resultado['omit'] > 0): ?>
      <div class="result-card warn">
        <div class="num"><?= number_format($resultado['omit']) ?></div>
        <div class="lbl">Filas omitidas<br>(vacías o con error)</div>
      </div>
      <?php endif; ?>
    </div>

    <?php if (!empty($resultado['errores'])): ?>
    <details style="margin-top:10px">
      <summary style="cursor:pointer;color:#c0392b;font-size:.85rem">
        Ver <?= count($resultado['errores']) ?> errores de fila
      </summary>
      <ul class="errlist">
        <?php foreach (array_slice($resultado['errores'], 0, 20) as $e): ?>
        <li><?= htmlspecialchars($e) ?></li>
        <?php endforeach; ?>
      </ul>
    </details>
    <?php endif; ?>

    <div class="actions">
      <a href="importar_productos.php" class="btn btn-secondary">
        <i class="fa fa-rotate-right"></i> Nueva importación
      </a>
      <a href="registro.php" class="btn btn-primary">
        <i class="fa fa-clipboard-list"></i> Ir a Registro
      </a>
    </div>
  </div>
  <?php endif; ?>

</div><!-- /container -->

<script>
  // Drag & drop
  const zone    = document.getElementById('dropZone');
  const input   = document.getElementById('fileInput');
  const btnSub  = document.getElementById('btnSubir');
  const lblFile = document.getElementById('fileName');

  if (zone) {
    zone.addEventListener('click',      () => input.click());
    zone.addEventListener('dragover',   e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave',  () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('over');
      if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', () => { if (input.files[0]) setFile(input.files[0]); });
  }

  function setFile(f) {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['xlsx','csv'].includes(ext)) {
      lblFile.innerHTML = '<span style="color:#e05252"><i class="fa fa-circle-xmark"></i> Solo .xlsx o .csv</span>';
      if (btnSub) btnSub.disabled = true;
      return;
    }
    const dt = new DataTransfer();
    dt.items.add(f);
    input.files = dt.files;
    lblFile.innerHTML = '<i class="fa fa-file-excel"></i> ' + f.name;
    if (btnSub) btnSub.disabled = false;
  }

  // Bloquear doble submit
  const frmImp = document.getElementById('frmImportar');
  if (frmImp) {
    frmImp.addEventListener('submit', () => {
      const btn = document.getElementById('btnImportar');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Importando…'; }
    });
  }
</script>
</body>
</html>
