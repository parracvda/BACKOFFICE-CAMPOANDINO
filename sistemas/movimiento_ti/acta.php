<?php
session_start();
require_once __DIR__ . '/../../shared/conexion.php';

// Determinar modo: por ID (backoffice con sesión) o por token (enlace público)
$modoToken = false;
$token = isset($_GET['token']) ? preg_replace('/[^a-f0-9]/', '', substr($_GET['token'], 0, 48)) : '';
$id    = intval($_GET['id'] ?? 0);

if (!empty($token)) {
    $modoToken = true;
} elseif (empty($_SESSION['IdUsuario'])) {
    http_response_code(403);
    echo '<h3>Acceso no autorizado. <a href="../../public/panel.html">Ir al panel</a></h3>';
    exit;
}

// Nombre del usuario logueado (encargado TI) para el campo "Entregado por"
$encargadoTI = $_SESSION['usuarionombre'] ?? ($_SESSION['usuario'] ?? '');
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Acta de Entrega – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Roboto', Arial, sans-serif; background: #f4f8fb; margin: 0; padding: 0; }

    /* ── Toolbar ── */
    .acta-toolbar {
      background: linear-gradient(90deg, #1fa9a0, #17857e);
      color: #fff; padding: 12px 20px;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
      position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .acta-toolbar-title { font-size: 1rem; font-weight: 700; }
    .acta-toolbar-btns  { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-acta { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
      border: none; border-radius: 7px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
    .btn-primary   { background: #fff; color: #1fa9a0; }
    .btn-primary:hover { background: #e0faf8; }
    .btn-success   { background: #27ae60; color: #fff; }
    .btn-success:hover { background: #1e8449; }
    .btn-secondary { background: rgba(255,255,255,0.2); color: #fff; }
    .btn-secondary:hover { background: rgba(255,255,255,0.35); }
    .btn-danger    { background: #e74c3c; color: #fff; }
    .btn-danger:hover { background: #c0392b; }

    /* ── Contenedor del documento ── */
    .acta-wrap { max-width: 800px; margin: 24px auto; padding: 0 16px 60px; }

    /* ── Hoja A4 simulada ── */
    .acta-doc {
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      padding: 48px 56px 48px;
    }
    @media (max-width: 600px) {
      .acta-doc { padding: 28px 20px; }
    }

    /* ── Encabezado ── */
    .acta-header { position: relative; min-height: 70px; margin-bottom: 28px; }
    .acta-logo   { width: 90px; position: absolute; top: 0; left: 0; }
    .acta-title  { width: 100%; text-align: center; padding-top: 10px; }
    .acta-title h2 { font-size: 1.05rem; font-weight: 700; text-decoration: underline; margin: 0 0 10px; text-transform: uppercase; }

    .acta-company { margin-bottom: 18px; }
    .acta-company p { margin: 2px 0; font-size: 0.93rem; font-weight: 700; }

    .acta-field-row { font-size: 0.93rem; margin: 6px 0; }
    .acta-field-row span { font-weight: 700; }

    .acta-body { font-size: 0.93rem; line-height: 1.65; }
    .acta-body p { margin: 12px 0; }
    .acta-body .acta-saludo { margin: 24px 0 8px; font-weight: 700; font-size: 0.93rem; }
    .acta-detalle { margin: 14px 0 14px 10px; }
    .acta-detalle p { margin: 4px 0; font-size: 0.93rem; }

    .acta-compromisos { margin: 16px 0; }
    .acta-compromisos p { margin: 6px 0; font-size: 0.93rem; line-height: 1.6; }

    /* ── Sección firmas ── */
    .acta-firmas { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    @media (max-width: 1024px) { .acta-firmas { grid-template-columns: 1fr; } }

    .firma-bloque { display: flex; flex-direction: column; }
    .firma-label  { font-size: 0.88rem; font-weight: 700; margin-bottom: 8px; color: #333; }
    .firma-canvas-wrap {
      border: 1.5px dashed #1fa9a0; border-radius: 8px; background: #f9ffff;
      position: relative; overflow: hidden;
    }
    .firma-canvas-wrap canvas { display: block; width: 100%; max-width: 100%; height: 200px; touch-action: none; cursor: crosshair; }
    .firma-canvas-wrap { overflow: hidden; }
    .firma-canvas-wrap.firmado { border-color: #27ae60; background: #f0fff4; cursor: default; }
    .firma-canvas-wrap .firma-img { display: block; width: 100%; height: 200px; object-fit: contain; }
    .firma-placeholder {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      color: #aaa; font-size: 0.82rem; pointer-events: none;
    }
    .firma-line { border-top: 1.5px solid #333; margin-top: 12px; padding-top: 6px; font-size: 0.82rem; color: #555; }
    .btn-limpiar-firma {
      align-self: flex-end; margin-top: 4px; padding: 3px 10px;
      font-size: 0.78rem; background: none; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; color: #777;
    }
    .btn-limpiar-firma:hover { background: #fef0f0; border-color: #e74c3c; color: #e74c3c; }

    /* ── Estado acta firmada ── */
    .badge-firmada {
      display: inline-flex; align-items: center; gap: 6px;
      background: #d4edda; color: #155724; border: 1px solid #c3e6cb;
      border-radius: 8px; padding: 8px 16px; font-size: 0.92rem; font-weight: 700; margin-bottom: 20px;
    }

    /* ── Modal compartir enlace ── */
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; align-items: center; justify-content: center; }
    .modal-overlay.open { display: flex; }
    .modal-box { background: #fff; border-radius: 12px; padding: 28px 28px; max-width: 480px; width: 92%; box-shadow: 0 8px 32px rgba(0,0,0,0.18); }
    .modal-box h3 { margin: 0 0 16px; font-size: 1.05rem; color: #1fa9a0; }
    .modal-url { width: 100%; padding: 9px 12px; border: 1px solid #cdd6e0; border-radius: 7px; font-size: 0.88rem; color: #333; background: #f8fcff; }
    .modal-footer { display: flex; gap: 8px; margin-top: 14px; justify-content: flex-end; }
    #qrCanvas { display: block; margin: 14px auto 0; }

    /* ── Notif ── */
    .notif-bar { display: none; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      padding: 11px 26px; border-radius: 9px; font-size: 0.95rem; font-weight: 600; z-index: 9999;
      box-shadow: 0 4px 18px rgba(0,0,0,0.16); white-space: normal;
      max-width: 90vw; width: max-content; text-align: center; }
    .notif-success { background: #27ae60; color: #fff; }
    .notif-error   { background: #e74c3c; color: #fff; }
    .notif-info    { background: #2980b9; color: #fff; }
  </style>
</head>
<body>

<!-- Toolbar -->
<div class="acta-toolbar">
  <div class="acta-toolbar-title"><i class="fa fa-file-signature"></i> Acta de Recepción de Equipos</div>
  <div class="acta-toolbar-btns">
    <span id="statusBadge"></span>
    <?php if (!$modoToken): ?>
    <button class="btn-acta btn-secondary" id="btnEnviarCorreo" style="display:none" title="Enviar enlace al receptor por correo para que firme">
      <i class="fa fa-envelope"></i> Enviar al receptor
    </button>
    <button class="btn-acta btn-secondary" id="btnCompartir" style="display:none" title="Mostrar enlace / QR">
      <i class="fa fa-share-alt"></i> Enlace / QR
    </button>
    <button class="btn-acta btn-secondary" id="btnFirmaPresencial" style="display:none" title="Ambas partes firman en este mismo dispositivo">
      <i class="fa fa-users"></i> Firma presencial
    </button>
    <?php endif; ?>
    <button class="btn-acta btn-primary" id="btnGenerarPDF">
      <i class="fa fa-file-pdf"></i> Descargar PDF
    </button>
    <?php if (!$modoToken): ?>
    <button class="btn-acta btn-secondary" onclick="window.close(); if(!window.closed) window.history.back();">
      <i class="fa fa-arrow-left"></i> Volver
    </button>
    <?php endif; ?>
  </div>
</div>

<!-- Documento -->
<div class="acta-wrap">
  <div id="actaDoc" class="acta-doc">

    <!-- Encabezado con logo -->
    <div class="acta-header">
      <img src="../../shared/images/logo.png" alt="Campo Andino" class="acta-logo" />
      <div class="acta-title">
        <h2>Acta de Recepción de Equipos Nuevos</h2>
      </div>
    </div>

    <div class="acta-company">
      <p>Campo Andino S.A.C.</p>
      <p>Área de Tecnología de la Información</p>
    </div>

    <div class="acta-field-row">Fecha: <span id="aFecha"></span></div>
    <div class="acta-field-row">Usuario: <span id="aUsuario"></span></div>
    <div class="acta-field-row">Cargo: <span id="aCargo"></span></div>
    <div class="acta-field-row">Área: <span id="aArea"></span></div>

    <div class="acta-body">
      <p class="acta-saludo">Estimado(a):</p>
      <p>Por medio de la presente, dejamos constancia de la entrega y recepción de un equipo de trabajo, asignado para el desarrollo de sus funciones en Campo Andino S.A.C.</p>

      <p><strong>Detalle del equipo entregado:</strong></p>
      <div class="acta-detalle">
        <p>- Tipo de equipo: <span id="aTipo"></span></p>
        <p>- Marca / Modelo: <span id="aMarcaModelo"></span></p>
        <p>- Número de serie: <span id="aNSerie"></span></p>
        <p>- Accesorios incluidos: <span id="aAccesorios"></span></p>
      </div>

      <p>El usuario declara haber recibido el equipo en buen estado de funcionamiento, así como los accesorios detallados. Asimismo, se compromete a:</p>

      <div class="acta-compromisos">
        <p>1. Hacer uso responsable del equipo únicamente para fines laborales.</p>
        <p>2. Velar por el cuidado, seguridad y conservación de este.</p>
        <p>3. Comunicar de inmediato al área de TI cualquier desperfecto o incidente relacionado con el equipo.</p>
        <p>4. Devolver el equipo en caso de cese de labores, reasignación o renovación, en las condiciones más cercanas a las originales, salvo el desgaste natural por uso.</p>
        <p>5. Asumir plena responsabilidad por el equipo asignado; en caso de robo, pérdida o daño por negligencia, el colaborador deberá cubrir el costo total o parcial del mismo, según lo determine la empresa.</p>
      </div>
    </div>

    <!-- Firmas -->
    <div class="acta-firmas" id="seccionFirmas">

      <div class="firma-bloque">
        <div class="firma-label">Entregado por:</div>
        <div class="firma-canvas-wrap" id="wrapFirmaEntregador">
          <canvas id="canvasFirmaEntregador" height="200"></canvas>
          <div class="firma-placeholder" id="placeholderEntregador">Firme aquí</div>
        </div>
        <button class="btn-limpiar-firma" id="btnLimpiarEntregador" onclick="limpiarFirma('Entregador')">
          <i class="fa fa-eraser"></i> Limpiar
        </button>
        <div class="firma-line" id="lineaEntregador"><span id="aNombreTI"></span><br>Área de TI</div>
      </div>

      <div class="firma-bloque">
        <div class="firma-label">Recibido por:</div>
        <div class="firma-canvas-wrap" id="wrapFirmaReceptor">
          <canvas id="canvasFirmaReceptor" height="200"></canvas>
          <div class="firma-placeholder" id="placeholderReceptor">Firme aquí</div>
        </div>
        <button class="btn-limpiar-firma" id="btnLimpiarReceptor" onclick="limpiarFirma('Receptor')">
          <i class="fa fa-eraser"></i> Limpiar
        </button>
        <div class="firma-line"><span id="aUsuarioFirma"></span><br><span id="aCargoFirma"></span></div>
      </div>

    </div>

    <!-- Botón guardar firmas -->
    <div style="text-align:center; margin-top: 28px;" id="wrapBtnGuardar">
      <!-- PASO 1 (backoffice): TI firma y guarda su firma -->
      <button class="btn-acta btn-success" id="btnGuardarFirmaTI" style="font-size:1rem; padding: 10px 28px;">
        <i class="fa fa-pen-nib"></i> Guardar mi firma y notificar al receptor
      </button>
      <!-- PASO 3 (modo token): receptor confirma su firma -->
      <button class="btn-acta btn-success" id="btnGuardarFirmaReceptor" style="display:none;font-size:1rem; padding: 10px 28px;">
        <i class="fa fa-check-circle"></i> Confirmar mi firma y cerrar acta
      </button>
      <!-- Modo presencial: ambas firmas en el mismo dispositivo -->
      <button class="btn-acta btn-success" id="btnGuardarPresencial" style="display:none;font-size:1rem; padding: 10px 28px;">
        <i class="fa fa-check-double"></i> Guardar ambas firmas y enviar PDF
      </button>
    </div>

  </div><!-- /acta-doc -->
</div><!-- /acta-wrap -->

<!-- Modal compartir enlace -->
<div class="modal-overlay" id="modalCompartir">
  <div class="modal-box">
    <h3><i class="fa fa-share-alt"></i> Enlace para firma del receptor</h3>
    <p style="font-size:0.88rem;color:#555;margin:0 0 10px">El receptor puede abrir este enlace desde su celular y firmar digitalmente.</p>
    <input type="text" class="modal-url" id="urlCompartir" readonly />
    <div id="qrCanvas" style="margin:14px auto 0;text-align:center"></div>
    <div class="modal-footer">
      <button class="btn-acta btn-primary" style="color:#1fa9a0;border:1px solid #1fa9a0;" onclick="copiarEnlace()">
        <i class="fa fa-copy"></i> Copiar enlace
      </button>
      <button class="btn-acta btn-secondary" style="background:#6c757d;" onclick="document.getElementById('modalCompartir').classList.remove('open')">
        Cerrar
      </button>
    </div>
  </div>
</div>

<!-- Modal enviar correo -->
<div class="modal-overlay" id="modalEnviarCorreo">
  <div class="modal-box">
    <h3><i class="fa fa-envelope"></i> Enviar acta al receptor</h3>
    <p style="font-size:0.9rem;color:#333;margin:0 0 6px">
      Se enviará un correo a <strong id="correoReceptorLabel"></strong> con el enlace del acta para que la firme.
    </p>
    <p style="font-size:0.82rem;color:#888;margin:0 0 16px">El acta se cerrará automáticamente cuando el receptor firme.</p>
    <div class="modal-footer">
      <button class="btn-acta btn-success" id="btnConfirmarEnvio">
        <i class="fa fa-paper-plane"></i> Enviar correo
      </button>
      <button class="btn-acta btn-secondary" style="background:#6c757d;" onclick="document.getElementById('modalEnviarCorreo').classList.remove('open')">
        Cancelar
      </button>
    </div>
  </div>
</div>

<div class="notif-bar" id="notifBar"></div>

<!-- Librerías -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/4.1.7/signature_pad.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
  var MODO_TOKEN = <?= $modoToken ? 'true' : 'false' ?>;
  var TOKEN      = <?= json_encode($token) ?>;
  var ID_MOV     = <?= json_encode($id) ?>;
  var ENCARGADO_TI = <?= json_encode($encargadoTI) ?>;
  var API        = 'api/datos.php';
</script>
<script src="acta.js"></script>
</body>
</html>
