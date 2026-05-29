<?php
session_start();

if (!isset($_SESSION['usuario'])) {
    header('Location: ../../public/index.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Muestreo de Control de Calidad – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: 'Roboto', Arial, sans-serif;
      background: #f4f8fb;
      margin: 0;
      min-height: 100vh;
    }

    /* ── Cabecera ── */
    .mcc-header {
      background: linear-gradient(90deg, #1fa9a0 0%, #17857e 100%);
      color: #fff;
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    .mcc-header-title {
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .mcc-header-sub {
      font-size: 0.88rem;
      opacity: 0.88;
      margin-top: 2px;
    }
    .mcc-header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

    /* ── Botones ── */
    .btn-mcc {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border: none;
      border-radius: 7px;
      font-size: 0.92rem;
      font-family: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.18s, box-shadow 0.18s;
    }
    .btn-mcc-primary   { background: #1fa9a0; color: #fff; }
    .btn-mcc-primary:hover   { background: #17857e; }
    .btn-mcc-back      { background: #6c757d; color: #fff; }
    .btn-mcc-back:hover      { background: #545b62; }
    .btn-mcc-primary:disabled {
      background: #a0d4d0;
      cursor: not-allowed;
      opacity: 0.7;
    }

    /* ── Contenido ── */
    .mcc-content {
      padding: 28px;
      max-width: 780px;
      margin: 0 auto;
    }

    /* ── Tarjeta de formulario ── */
    .mcc-card {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 14px rgba(31,169,160,0.09);
      padding: 28px 32px 32px;
    }

    /* ── Step wrappers (revelado progresivo) ── */
    .step-wrap {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      transform: translateY(-8px);
      transition: max-height 0.4s ease,
                  opacity    0.3s ease 0.05s,
                  transform  0.3s ease 0.05s;
      pointer-events: none;
    }
    .step-wrap.visible {
      max-height: 1200px;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      overflow: visible;
    }
    /* Eleva el step activo para que su dropdown superponga los steps siguientes */
    .step-wrap.visible:focus-within {
      position: relative;
      z-index: 50;
    }
    .step-wrap .full { grid-column: 1 / -1; }

    /* ── Footer animado ── */
    #formFooter {
      opacity: 0;
      transform: translateY(6px);
      pointer-events: none;
      transition: opacity   0.3s ease 0.28s,
                  transform 0.3s ease 0.28s;
    }
    #formFooter.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* ── Grid del formulario ── */
    .mcc-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
    }
    .mcc-form-grid .full { grid-column: 1 / -1; }

    /* ── Separador de sección ── */
    .mcc-section-label {
      grid-column: 1 / -1;
      font-size: 0.78rem;
      font-weight: 700;
      color: #1fa9a0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e0eaef;
      padding-bottom: 4px;
      margin-top: 4px;
    }

    /* ── Campo ── */
    .mcc-field label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 5px;
    }
    .mcc-field input[type="date"],
    .mcc-field input[type="number"],
    .mcc-field select,
    .mcc-field textarea {
      width: 100%;
      padding: 9px 11px;
      border: 1px solid #cdd6e0;
      border-radius: 7px;
      font-size: 0.93rem;
      font-family: inherit;
      background: #fff;
      transition: border 0.15s;
      appearance: auto;
      -webkit-appearance: auto;
      -webkit-appearance: auto;
    }
    /* Igualar altura y padding visual entre selects nativos y combobox personalizados */
    .mcc-field select, .cs-input {
      min-height: 44px;
      padding-top: 9px;
      padding-bottom: 9px;
    }

    /* Forzar apariencia uniforme en selects nativos sin cambiar diseño: quitar apariencia
       nativa y dibujar una flecha similar por CSS; manteniendo colores y bordes. */
    .mcc-field select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px; /* espacio para la flecha */
      box-sizing: border-box;
    }
    .mcc-field select:focus { outline: none; border-color: #1fa9a0; }
    .mcc-field input[type="date"]:focus,
    .mcc-field input[type="number"]:focus,
    .mcc-field select:focus { outline: none; border-color: #1fa9a0; }

    /* ── Mayúsculas en inputs y combobox ── */
    .mcc-field input[type="date"],
    .mcc-field select,
    .cs-input { text-transform: uppercase; }

    .cs-option { text-transform: uppercase; }
    /* El placeholder no hereda text-transform, queda en minúsculas a propósito */

    /* Ocultar flechas del spinner en number inputs */
    .mcc-field input[type="number"]::-webkit-inner-spin-button,
    .mcc-field input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    .mcc-field input[type="number"] { -moz-appearance: textfield; }

    /* ── Campo calculado (readonly automático) ── */
    .mcc-field input[readonly].input-calc {
      background: #eaf8f6;
      border-color: #a8d8d4;
      color: #17857e;
      font-weight: 700;
      cursor: default;
    }
    .mcc-field input[readonly].input-calc:focus { border-color: #a8d8d4; outline: none; }
    .mcc-field input[readonly].input-calc.input-calc-error {
      background: #fff0f0;
      border-color: #e74c3c;
      color: #c0392b;
    }
    .lbl-calc {
      font-size: 0.72rem;
      color: #1fa9a0;
      font-weight: 600;
      margin-left: 5px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* ── Campo Responsable (bloqueado) ── */
    .mcc-field .responsable-display {
      width: 100%;
      padding: 9px 11px;
      border: 1px solid #a8d8d4;
      border-radius: 7px;
      font-size: 0.93rem;
      font-family: inherit;
      background: #eaf8f6;
      color: #17857e;
      font-weight: 700;
      min-height: 38px;
      text-transform: uppercase;
    }

    /* ── Hora 12h – grupo de selectores ── */
    .time-group {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    /* Hacer que cada select ajuste su ancho al contenido y tenga un mínimo
       en pantallas pequeñas. Hour/Minute usan ancho fijo mínimo; AM/PM ya
       tiene su tamaño definido. */
    .time-group select {
      flex: 0 0 auto;
      min-width: 56px;
      padding: 9px 8px;
      border: 1px solid #cdd6e0;
      border-radius: 7px;
      font-size: 0.93rem;
      font-family: inherit;
      background: #fff;
      transition: border 0.15s;
      text-align: center;
    }
    /* Asegurar ancho razonable para hora y minutos */
    #fldHoraH, #fldHoraM { min-width: 64px; max-width: 92px; }
    .time-group select:focus { outline: none; border-color: #1fa9a0; }
    .time-group .time-sep {
      font-weight: 700;
      color: #888;
      flex: 0 0 auto;
      font-size: 1.05rem;
      padding: 0 2px;
    }
    .time-group .ampm-sel { flex: 0 0 68px; min-width:68px; }

    /* Forzar que los combobox de máquina y descripción ocupen todo el ancho del bloque */
    #csMaquinaWrap, #csDescWrap { width: 100%; box-sizing: border-box; }
    #csMaquinaInput, #csDescInput { width: 100%; box-sizing: border-box; }
    /* Asegurar que el dropdown se posicione correctamente dentro del wrap
       y ocupe todo el ancho del contenedor sin romper el flujo. */
    #csMaquinaWrap .cs-dropdown,
    #csDescWrap .cs-dropdown {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      box-sizing: border-box;
      z-index: 500;
    }

    /* ── Combobox buscable ── */
    .cs-wrap {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      /* darle al wrapper el mismo borde y radio que el select nativo */
      border: 1px solid #cdd6e0;
      border-radius: 7px;
      background: #fff;
    }
    .cs-wrap:focus-within { border-color: #1fa9a0; }
    .cs-input {
      display: block;
      width: 100%;
      padding: 9px 11px; /* igual padding que los selects nativos */
      padding-right: 36px; /* espacio para la flecha, igual que select nativo */
      border: none; /* dejar el borde al contenedor */
      border-radius: 0;
      font-size: 0.93rem;
      font-family: inherit;
      background: transparent;
      transition: none;
      box-sizing: border-box;
      min-height: 44px;
      line-height: 1.2;
    }
    .cs-input:focus { outline: none; border-color: #1fa9a0; }
    .cs-wrap.open .cs-input { border-radius: 7px 7px 0 0; border-color: #1fa9a0; }
    .cs-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #aaa;
      font-size: 0.75rem;
      pointer-events: none;
      width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
    }
    .cs-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #1fa9a0;
      border-top: none;
      border-radius: 0 0 7px 7px;
      max-height: 210px;
      overflow-y: auto;
      z-index: 200;
      box-shadow: 0 6px 18px rgba(31,169,160,0.12);
      box-sizing: border-box;
    }
    .cs-wrap.open .cs-dropdown { display: block; }
    .cs-option {
      padding: 9px 12px;
      cursor: pointer;
      font-size: 0.92rem;
      color: #333;
      transition: background 0.12s;
    }
    .cs-option:hover, .cs-option.highlighted { background: #e8f8f7; color: #17857e; }
    .cs-option.no-results {
      color: #aaa;
      font-style: italic;
      cursor: default;
      padding: 9px 12px;
    }
    .cs-hidden { display: none; }

    /* ── Footer del formulario ── */
    .mcc-form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 28px;
      padding-top: 18px;
      border-top: 1px solid #e0eaef;
      flex-wrap: wrap;
    }

    /* ── Notificación flotante ── */
    .notif-bar {
      display: none;
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 28px;
      border-radius: 9px;
      font-size: 0.95rem;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 4px 18px rgba(0,0,0,0.16);
      white-space: nowrap;
    }
    .notif-success { background: #27ae60; color: #fff; }
    .notif-error   { background: #e74c3c; color: #fff; }
    .notif-warning { background: #f39c12; color: #fff; }
    .notif-info    { background: #2980b9; color: #fff; }

    /* ── Acordeón de observaciones por material ── */
    .obs-accordion { display: flex; flex-direction: column; gap: 8px; }
    .obs-acc-item { border: 1px solid #c9e4e1; border-radius: 9px; overflow: hidden; }
    .obs-acc-header {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding: 11px 14px; background: #f0faf9; cursor: pointer;
      user-select: none; transition: background 0.15s;
    }
    .obs-acc-header:hover { background: #e2f3f1; }
    .obs-acc-header.open  { background: #cce8e5; border-bottom: 1px solid #b8dad6; }
    .obs-acc-left { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
    .obs-acc-name { font-weight: 700; font-size: 0.88rem; color: #17857e; }
    .obs-acc-badge {
      font-size: 0.76rem; background: #1fa9a0; color: #fff;
      border-radius: 10px; padding: 2px 8px;
    }
    .obs-acc-icon { color: #1fa9a0; font-size: 0.82rem; transition: transform 0.25s; flex-shrink: 0; }
    .obs-acc-header.open .obs-acc-icon { transform: rotate(180deg); }
    .obs-acc-body {
      max-height: 0; overflow: hidden; padding: 0 14px;
      background: #fff; transition: max-height 0.32s ease, padding 0.25s ease;
    }
    .obs-acc-body.open { max-height: 700px; padding: 10px 14px 14px; }
    .obs-check-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 6px 10px;
    }
    .obs-check-item {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 8px; border-radius: 6px; font-size: 0.86rem; color: #333;
      border: 1px solid transparent; transition: background 0.12s, border-color 0.12s;
    }
    .obs-check-item:hover { background: #f0faf9; border-color: #c9e4e1; }
    .obs-check-item.checked { background: #e8f8f7; border-color: #a8d8d4; }
    .obs-check-item input[type="checkbox"] {
      width: 15px; height: 15px; accent-color: #1fa9a0; cursor: pointer; flex-shrink: 0;
    }
    .obs-check-label { line-height: 1.3; flex: 1; cursor: pointer; user-select: none; }
    /* Cantidad por observación: aparece al marcar el check */
    .obs-qty-wrap {
      overflow: hidden; max-width: 0; opacity: 0; flex-shrink: 0;
      transition: max-width 0.25s ease, opacity 0.2s ease;
      pointer-events: none;
    }
    .obs-check-item.checked .obs-qty-wrap {
      max-width: 80px; opacity: 1; pointer-events: auto;
    }
    .obs-qty-input {
      width: 72px; padding: 4px 7px;
      border: 1px solid #a8d8d4; border-radius: 6px;
      font-size: 0.85rem; font-family: inherit; text-align: center;
      background: #fff; outline: none;
    }
    .obs-qty-input:focus { border-color: #1fa9a0; }
    .obs-qty-input::-webkit-inner-spin-button,
    .obs-qty-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    .obs-qty-input { -moz-appearance: textfield; }
    .obs-acc-empty { font-size: 0.85rem; color: #aaa; font-style: italic; }

    /* ── Turno automático ── */
    .turno-wrap { display: flex; flex-direction: column; gap: 6px; }
    .turno-badge {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 7px 12px; border-radius: 7px; font-size: 0.9rem; font-weight: 700;
      border: 1px solid #d0ece9; background: #eaf8f6; color: #17857e;
      min-height: 38px;
    }
    .turno-badge i { font-size: 0.85rem; opacity: 0.75; }
    .turno-manual-row {
      display: flex; align-items: center; gap: 7px;
      font-size: 0.8rem; color: #777; cursor: pointer; user-select: none;
    }
    .turno-manual-row input[type="checkbox"] { accent-color: #1fa9a0; cursor: pointer; width: 14px; height: 14px; }

    /* ── Barra fija de resumen ── */
    .barra-resumen {
      position: sticky;
      top: 0;
      z-index: 500;
      background: linear-gradient(90deg, #17857e 0%, #1fa9a0 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      padding: 10px 28px;
      box-shadow: 0 3px 12px rgba(23,133,126,0.25);
      flex-wrap: wrap;
    }
    .br-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 20px;
      gap: 2px;
    }
    .br-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.8;
      font-weight: 500;
    }
    .br-value {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .br-pct {
      font-size: 1.25rem;
      color: #ffe066;
    }
    .br-sep {
      width: 1px;
      height: 32px;
      background: rgba(255,255,255,0.25);
      flex-shrink: 0;
    }

    /* ── Textareas ── */
    .mcc-field textarea {
      width: 100%;
      padding: 9px 11px;
      border: 1px solid #cdd6e0;
      border-radius: 7px;
      font-size: 0.93rem;
      font-family: inherit;
      background: #fff;
      resize: vertical;
      transition: border 0.15s;
      line-height: 1.5;
      text-transform: uppercase;
    }
    .mcc-field textarea:focus { outline: none; border-color: #1fa9a0; }
    .lbl-opcional {
      font-size: 0.75rem;
      font-weight: 400;
      color: #aaa;
      margin-left: 4px;
    }

    /* ── Responsive ── */
    @media (max-width: 620px) {
      .mcc-content { padding: 14px 10px; }
      .mcc-card { padding: 18px 14px 22px; }
      .mcc-form-grid { grid-template-columns: 1fr; }
      .mcc-form-grid .full { grid-column: 1; }
      .mcc-header { padding: 12px 14px; }
      .mcc-header-title { font-size: 1.1rem; }
      /* Los step-wrap también deben ser 1 columna en responsive */
      .step-wrap { grid-template-columns: 1fr; }
      /* Forzar que los combobox ocupen el 100% del ancho disponible */
      #csMaquinaWrap, #csDescWrap,
      #csMaquinaWrap .cs-dropdown,
      #csDescWrap .cs-dropdown { width: 100% !important; min-width: 0 !important; max-width: 100% !important; }
      .cs-wrap { width: 100% !important; min-width: 0 !important; max-width: 100% !important; }
    }
  </style>
</head>
<body>

  <!-- Cabecera -->
  <div class="mcc-header">
    <div>
      <div class="mcc-header-title">
        <i class="fa fa-flask"></i>&nbsp; Muestreo de Control de Calidad
      </div>
      <div class="mcc-header-sub">CAMPO ANDINO – Registro de muestreo</div>
    </div>
    <div class="mcc-header-actions">
      <button class="btn-mcc btn-mcc-back" onclick="window.location.href='../../public/panel.html'">
        <i class="fa fa-arrow-left"></i> Panel
      </button>
    </div>
  </div>

  <!-- Barra fija de resumen de muestreo -->
  <div id="barraResumen" class="barra-resumen" style="display:none">
    <div class="br-item">
      <span class="br-label">Muestreada</span>
      <span class="br-value" id="brCantMuestreada">—</span>
    </div>
    <div class="br-sep"></div>
    <div class="br-item">
      <span class="br-label">Observada</span>
      <span class="br-value" id="brCantObservada">—</span>
    </div>
    <div class="br-sep"></div>
    <div class="br-item br-item-pct">
      <span class="br-label">% Observaciones</span>
      <span class="br-value br-pct" id="brPorcentaje">—</span>
    </div>
  </div>

  <!-- Contenido -->
  <div class="mcc-content">
    <div class="mcc-card">

      <div class="mcc-form-grid">

        <!-- Almacén: siempre visible -->
        <div class="mcc-field full">
          <label for="fldAlmacen">Tipo de Inspección <span style="color:red">*</span></label>
          <select id="fldAlmacen">
            <option value="">Cargando...</option>
          </select>
        </div>

        <!-- STEP 1: Fecha · Turno · Hora · Máquina -->
        <div class="step-wrap" id="step1">

          <div class="mcc-section-label">Datos generales</div>

          <!-- Fecha -->
          <div class="mcc-field">
            <label for="fldFecha">Fecha <span style="color:red">*</span></label>
            <input type="date" id="fldFecha" />
          </div>

          <!-- Turno -->
          <div class="mcc-field">
            <label>Turno <span style="color:red">*</span></label>
            <div class="turno-wrap">
              <div class="turno-badge" id="turnoBadge"><i class="fa fa-clock"></i> <span id="turnoTexto">Detectando...</span></div>
              <select id="fldTurno" style="display:none">
                <option value="">— Seleccionar —</option>
                <option value="MAÑANA">Mañana</option>
                <option value="NOCHE">Noche</option>
              </select>
              <label class="turno-manual-row">
                <input type="checkbox" id="chkTurnoManual" />
                Manual
              </label>
            </div>
          </div>

          <!-- Hora -->
          <div class="mcc-field">
            <label>Hora <span style="color:red">*</span></label>
            <div class="time-group">
              <select id="fldHoraH" title="Hora"></select>
              <span class="time-sep">:</span>
              <select id="fldHoraM" title="Minutos"></select>
              <select id="fldHoraAMPM" class="ampm-sel" title="AM / PM">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <!-- Máquina -->
          <div class="mcc-field full">
            <label>Máquina <span style="color:red">*</span></label>
            <div class="cs-wrap" id="csMaquinaWrap">
              <input type="text" class="cs-input" id="csMaquinaInput"
                     placeholder="Escribe para filtrar..."
                     autocomplete="off" />
              <i class="fa fa-chevron-down cs-icon"></i>
              <div class="cs-dropdown" id="csMaquinaDrop"></div>
              <input type="hidden" id="csMaquinaVal" />
            </div>
          </div>

        </div><!-- /step1 -->

        <!-- STEP 2: Descripción -->
        <div class="step-wrap" id="step2">
          <div class="mcc-field full">
            <label>Descripción <span style="color:red">*</span></label>
            <div class="cs-wrap" id="csDescWrap">
              <input type="text" class="cs-input" id="csDescInput"
                     placeholder="Escribe para filtrar..."
                     autocomplete="off" />
              <i class="fa fa-chevron-down cs-icon"></i>
              <div class="cs-dropdown" id="csDescDrop"></div>
              <input type="hidden" id="csDescVal" />
            </div>
          </div>
        </div><!-- /step2 -->

        <!-- STEP 3: Humedad promedio -->
        <div class="step-wrap" id="step3">
          <div class="mcc-field">
            <label for="fldHumedad">Humedad promedio <span style="color:red">*</span></label>
            <input type="number" id="fldHumedad" min="0" step="0.1" placeholder="0.0" />
          </div>
        </div><!-- /step3 -->

        <!-- STEP 4: Tipo de producto (solo PT) -->
        <div class="step-wrap" id="step4">
          <div class="mcc-section-label">Registro</div>
          <div class="mcc-field">
            <label for="fldTipoProducto">Tipo de producto <span style="color:red">*</span></label>
            <select id="fldTipoProducto">
              <option value="">Cargando...</option>
            </select>
          </div>
        </div><!-- /step4 -->

        <!-- STEP 5: Cantidad muestreada -->
        <div class="step-wrap" id="step5">
          <div class="mcc-field">
            <label for="fldCantMuestreada">Cantidad muestreada <span style="color:red">*</span></label>
            <input type="number" id="fldCantMuestreada" min="0" step="1" placeholder="0" />
          </div>
        </div><!-- /step5 -->

        <!-- STEP 6: Observaciones -->
        <div class="step-wrap" id="step6">
          <div class="mcc-field">
            <label for="fldObservaciones">Observaciones <span style="color:red">*</span></label>
            <select id="fldObservaciones">
              <option value="">— Seleccionar —</option>
              <option value="SI">Si</option>
              <option value="NO">No</option>
            </select>
          </div>
        </div><!-- /step6 -->

        <!-- STEP 7: Cantidad observada (calculado automáticamente) -->
        <div class="step-wrap" id="step7">
          <div class="mcc-field">
            <label for="fldCantObservada">Cantidad observada <span class="lbl-calc">↺ automático</span></label>
            <input type="number" id="fldCantObservada" class="input-calc" min="0" step="1" placeholder="0" readonly />
          </div>
        </div><!-- /step7 -->

        <!-- STEP 8: Acordeón de observaciones por material + comentarios -->
        <div class="step-wrap" id="step8">
          <div class="mcc-section-label full">Detalle de observaciones</div>
          <div class="mcc-field full">
            <div class="obs-accordion" id="obsAccordion"></div>
          </div>
          <div class="mcc-field full">
            <label for="fldComentarios">Comentarios <span class="lbl-opcional">(opcional)</span></label>
            <textarea id="fldComentarios" rows="3" placeholder="Escribe aquí los comentarios..."></textarea>
          </div>
          <div class="mcc-field full">
            <label for="fldAccionesPreventivas">Acciones preventivas <span class="lbl-opcional">(opcional)</span></label>
            <textarea id="fldAccionesPreventivas" rows="3" placeholder="Escribe aquí las acciones preventivas..."></textarea>
          </div>
        </div><!-- /step8 -->

        <!-- Campo oculto: Responsable -->
        <input type="hidden" id="lblResponsable" />

      </div><!-- /mcc-form-grid -->

      <!-- Footer (oculto hasta elegir almacén) -->
      <div class="mcc-form-footer" id="formFooter">
        <button class="btn-mcc btn-mcc-back" onclick="window.location.href='../../public/panel.html'">
          <i class="fa fa-times"></i> Cancelar
        </button>
        <button class="btn-mcc btn-mcc-primary" id="btnGuardar">
          <i class="fa fa-save"></i> Guardar
        </button>
      </div>

    </div><!-- /mcc-card -->
  </div><!-- /mcc-content -->

  <!-- Notificación flotante -->
  <div class="notif-bar" id="notifBar"></div>

  <script>
  (function () {
    'use strict';

    // ── Datos desde BD ─────────────────────────────────────────────
    var MAQUINAS     = [];   // se carga al init
    var ALMACENES    = [];   // se carga al init
    var TIPOS        = [];   // se carga al init
    var DESCRIPCIONES = []; // se carga desde sig_cc_productos vía API

    // ── Bandera: el usuario tocó la hora manualmente ──────────────
    var horaCongelada = false;

    // ── Helpers de step ─────────────────────────────────────────────
    function showStep(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.add('visible');
    }
    function hideStep(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('visible');
    }
    // Oculta steps desde startId en adelante (step1..step8)
    function resetFrom(startNum) {
      for (var i = startNum; i <= 8; i++) {
        hideStep('step' + i);
      }
      // Limpiar campos cuando se resetea
      if (startNum <= 2) { resetCombobox('csDescWrap', 'csDescInput', 'csDescVal'); }
      if (startNum <= 3) { document.getElementById('fldHumedad').value = ''; }
      if (startNum <= 4) { document.getElementById('fldTipoProducto').value = ''; }
      if (startNum <= 5) { document.getElementById('fldCantMuestreada').value = ''; }
      if (startNum <= 6) { document.getElementById('fldObservaciones').value = ''; }
      if (startNum <= 7) { document.getElementById('fldCantObservada').value = ''; }
      if (startNum <= 8) { ocultarAccordion(); }
      // Ocultar footer si se resetea desde el inicio
      if (startNum <= 6) { document.getElementById('formFooter').classList.remove('visible'); }
    }

    function resetCombobox(wrapId, inputId, hiddenId) {
      var inp = document.getElementById(inputId);
      var hid = document.getElementById(hiddenId);
      var wrp = document.getElementById(wrapId);
      if (inp) inp.value = '';
      if (hid) hid.value = '';
      if (inp) inp.dataset.selected = '';
      if (wrp) wrp.classList.remove('open');
    }

    // Forzar render de opciones del combobox: disparar focus -> input
    function triggerComboboxRender(inputId) {
      var inp = document.getElementById(inputId);
      if (!inp) return;
      try {
        inp.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true }));
      } catch (e) {}
      // Asegurar render de opciones con evento input
      var ev = new Event('input', { bubbles: true, cancelable: true });
      inp.dispatchEvent(ev);
    }

    // ── Init ────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
      setFechaHoy();
      buildHoraSelects();
      tickHora();
      setInterval(tickHora, 1000);
      detectarTurno();

      // Cargar almacenes desde BD
      fetch('api/datos.php?action=listar_almacenes')
        .then(function(r) { return r.json(); })
        .then(function(res) {
          var sel = document.getElementById('fldAlmacen');
          sel.innerHTML = '<option value="">— Seleccionar —</option>';
          if (res.success) res.data.filter(function(a){ return a.activo==1; }).forEach(function(a) {
            ALMACENES.push(a);
            var opt = document.createElement('option');
            opt.value = a.nombre; opt.textContent = a.nombre;
            sel.appendChild(opt);
          });
        })
        .catch(function() {
          var sel = document.getElementById('fldAlmacen');
          sel.innerHTML = '<option value="">— Seleccionar —</option>' +
            '<option value="PRODUCTOS TERMINADOS">PRODUCTOS TERMINADOS</option>' +
            '<option value="PRODUCTOS EN PROCESO">PRODUCTOS EN PROCESO</option>';
        });

      // Cargar tipos de producto desde BD
      fetch('api/datos.php?action=listar_tipoproducto')
        .then(function(r) { return r.json(); })
        .then(function(res) {
          var sel = document.getElementById('fldTipoProducto');
          sel.innerHTML = '<option value="">— Seleccionar —</option>';
          if (res.success) res.data.filter(function(t){ return t.activo==1; }).forEach(function(t) {
            TIPOS.push(t);
            var opt = document.createElement('option');
            opt.value = t.nombre; opt.textContent = t.nombre;
            sel.appendChild(opt);
          });
        })
        .catch(function() {
          var sel = document.getElementById('fldTipoProducto');
          sel.innerHTML = '<option value="">— Seleccionar —</option>' +
            '<option value="CAJA">CAJA</option>' +
            '<option value="PARIHUELA">PARIHUELA</option>' +
            '<option value="TAPA">TAPA</option>';
        });

      // Si el usuario cambia la hora manualmente, dejar de actualizar
      ['fldHoraH','fldHoraM','fldHoraAMPM'].forEach(function(id){
        document.getElementById(id).addEventListener('change', function(){
          horaCongelada = true;
        });
      });

      // Turno manual
      document.getElementById('chkTurnoManual').addEventListener('change', function () {
        var manual = this.checked;
        document.getElementById('turnoBadge').style.display = manual ? 'none' : '';
        document.getElementById('fldTurno').style.display   = manual ? ''     : 'none';
        if (manual) document.getElementById('fldTurno').focus();
        else detectarTurno();
      });

      // Inicializar combobox máquinas inmediatamente (array vacío), luego poblar
      buildCombobox('csMaquinaWrap', 'csMaquinaInput', 'csMaquinaDrop', 'csMaquinaVal', MAQUINAS, function(val) {
        if (val) { showStep('step2'); } else { resetFrom(2); }
      });
      fetch('api/datos.php?action=listar_maquinas')
        .then(function(r) { return r.json(); })
        .then(function(res) {
          if (res.success && res.data && res.data.length) {
            res.data.forEach(function(item) { MAQUINAS.push(item); });
          }
        })
        .catch(function() { /* sin datos remotos, queda vacío */ });

      // Cargar productos desde sig_cc_productos
      fetch('api/datos.php?action=listar_productos')
        .then(function(r) { return r.json(); })
        .then(function(res) {
          if (res.success && res.data) {
            res.data.forEach(function(p) {
              DESCRIPCIONES.push({ id: p.id, label: p.label });
            });
          }
        })
        .catch(function() { /* sin productos remotos, queda vacío */ })
        .finally(function() {
          buildCombobox('csDescWrap', 'csDescInput', 'csDescDrop', 'csDescVal', DESCRIPCIONES, function(val) {
            if (val) {
              showStep('step3');
            } else {
              resetFrom(3);
            }
          });
        });

      cargarResponsable();
      document.getElementById('btnGuardar').addEventListener('click', guardar);

      // ── STEP 1: Almacén ──
      document.getElementById('fldAlmacen').addEventListener('change', function () {
        var val = this.value;
        if (!val) {
          resetFrom(1);
          return;
        }
        // Resetear desde step2 en adelante al cambiar almacén
        resetFrom(2);
        resetCombobox('csMaquinaWrap', 'csMaquinaInput', 'csMaquinaVal');
        showStep('step1');
        // Preparar dropdown de máquinas al mostrar step1
        triggerComboboxRender('csMaquinaInput');
        detectarTurno();
      });

      // ── STEP 3 → STEP 4 o 5: Humedad ──
      document.getElementById('fldHumedad').addEventListener('change', function () {
        var val = this.value.trim();
        if (val === '') { resetFrom(4); return; }
        var numVal = parseFloat(val);
        if (isNaN(numVal)) { resetFrom(4); return; }
        var almacen = document.getElementById('fldAlmacen').value;
        resetFrom(4);
        if (almacen === 'PRODUCTOS TERMINADOS') {
          showStep('step4');
        } else {
          showStep('step5');
        }
      });

      // ── STEP 4 → STEP 5: Tipo de producto ──
      document.getElementById('fldTipoProducto').addEventListener('change', function () {
        var val = this.value;
        resetFrom(5);
        if (val) {
          showStep('step5');
        }
      });

      // ── STEP 5 → STEP 6: Cantidad muestreada ──
      document.getElementById('fldCantMuestreada').addEventListener('change', function () {
        var val = this.value.trim();
        resetFrom(6);
        if (val !== '' && !isNaN(parseFloat(val))) {
          showStep('step6');
        }
        actualizarBarraResumen();
      });

      // ── STEP 6 → STEP 7 + STEP 8: Observaciones ──
      document.getElementById('fldObservaciones').addEventListener('change', function () {
        resetFrom(7);
        if (this.value === 'SI') {
          var almacen = document.getElementById('fldAlmacen').value;
          var tipo    = document.getElementById('fldTipoProducto').value;
          showStep('step7');
          showStep('step8');
          actualizarAccordion(almacen, tipo);
          // El footer se muestra cuando haya al menos 1 observación con cantidad
        } else if (this.value === 'NO') {
          document.getElementById('formFooter').classList.add('visible');
        }
      });

      // fldCantObservada es readonly: se actualiza automáticamente desde el acordeón

      // Textareas en mayúsculas (CSS solo es visual; esto convierte el valor real)
      ['fldComentarios', 'fldAccionesPreventivas'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', function () {
          var pos = this.selectionStart;
          this.value = this.value.toUpperCase();
          this.setSelectionRange(pos, pos);
        });
      });

      // Delegación: toggle cabecera del acordeón
      document.getElementById('obsAccordion').addEventListener('click', function (e) {
        var header = e.target.closest('.obs-acc-header');
        if (!header) return;
        var mid  = header.dataset.mid;
        var body = document.getElementById('obsBody_' + mid);
        var open = header.classList.toggle('open');
        if (body) body.classList.toggle('open', open);
      });

      // Delegación: highlight visual del checkbox + mostrar/ocultar cantidad
      document.getElementById('obsAccordion').addEventListener('change', function (e) {
        if (e.target.type !== 'checkbox') return;
        var item    = e.target.closest('.obs-check-item');
        var checked = e.target.checked;
        if (item) {
          item.classList.toggle('checked', checked);
          var qtyInput = item.querySelector('.obs-qty-input');
          if (qtyInput) {
            qtyInput.disabled = !checked;
            if (!checked) { qtyInput.value = ''; }
            else qtyInput.focus();
          }
        }
        actualizarPorcentajesObservaciones();
      });

      // Delegación: recalcular porcentajes al cambiar cantidad de observación
      document.getElementById('obsAccordion').addEventListener('input', function (e) {
        if (!e.target.classList.contains('obs-qty-input')) return;
        actualizarPorcentajesObservaciones();
      });

    });  // fin DOMContentLoaded

    // Evitar que la rueda del mouse / scroll táctil cambie valores en inputs numéricos
    document.addEventListener('wheel', function () {
      if (document.activeElement && document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    }, { passive: true });

    // ── Barra de resumen y porcentajes ────────────────────────────────────────────
    function actualizarBarraResumen() {
      var barra     = document.getElementById('barraResumen');
      var cantMstr  = parseFloat(document.getElementById('fldCantMuestreada').value) || 0;
      var cantObs   = parseFloat(document.getElementById('fldCantObservada').value)  || 0;

      if (cantMstr <= 0) { barra.style.display = 'none'; return; }
      barra.style.display = 'flex';

      document.getElementById('brCantMuestreada').textContent = cantMstr;
      if (cantObs > 0) {
        document.getElementById('brCantObservada').textContent = cantObs;
        var pct = ((cantObs / cantMstr) * 100).toFixed(1);
        document.getElementById('brPorcentaje').textContent   = pct + '%';
      } else {
        document.getElementById('brCantObservada').textContent = '—';
        document.getElementById('brPorcentaje').textContent   = '—';
      }
    }

    // Calcula porcentajes individuales, suma total y actualiza fldCantObservada
    function actualizarPorcentajesObservaciones() {
      var cantMstr   = parseFloat(document.getElementById('fldCantMuestreada').value) || 0;
      var totalObs   = 0;
      document.querySelectorAll('#obsAccordion .obs-check-item').forEach(function (item) {
        var chk      = item.querySelector('input[type="checkbox"]');
        var qtyInput = item.querySelector('.obs-qty-input');
        if (!chk || !qtyInput) return;
        if (chk.checked) {
          var qty = parseFloat(qtyInput.value) || 0;
          totalObs += qty;
          var pct = (cantMstr > 0 && qty > 0) ? ((qty / cantMstr) * 100).toFixed(2) : '0.00';
          qtyInput.dataset.porcentaje = pct;
        } else {
          qtyInput.dataset.porcentaje = '0.00';
        }
      });

      var fldObs = document.getElementById('fldCantObservada');
      fldObs.value = totalObs > 0 ? totalObs : '';

      // Validar que no supere la cantidad muestreada
      var excede = cantMstr > 0 && totalObs > cantMstr;
      fldObs.classList.toggle('input-calc-error', excede);
      if (excede) {
        showNotif(
          'La cantidad observada (' + totalObs + ') supera la cantidad muestreada (' + cantMstr + ').',
          'error', 4000
        );
        document.getElementById('formFooter').classList.remove('visible');
        actualizarBarraResumen();
        return;
      }

      // Mostrar/ocultar footer
      if (totalObs > 0) {
        document.getElementById('formFooter').classList.add('visible');
      } else {
        document.getElementById('formFooter').classList.remove('visible');
      }
      actualizarBarraResumen();
    }

    // ── Turno automático ────────────────────────────────────────────────
    function detectarTurno() {
      fetch('api/datos.php?action=turno_actual')
        .then(function (r) { return r.json(); })
        .then(function (res) {
          var badge = document.getElementById('turnoBadge');
          var texto = document.getElementById('turnoTexto');
          if (res.success && res.turno) {
            var nombre = res.turno.nombre;
            var hI     = res.turno.hora_inicio.substring(0, 5);
            var hF     = res.turno.hora_fin.substring(0, 5);
            var icono  = nombre === 'MAÑANA' ? 'fa-sun' : 'fa-moon';
            texto.textContent = nombre;
            badge.querySelector('i').className = 'fa ' + icono;
            badge.dataset.turno = nombre;
            badge.title = hI + ' – ' + hF;
          } else {
            // Sin turno en BD: calcular desde hora local
            turnoDesdeHoraLocal();
          }
        })
        .catch(function () {
          // Fallback: calcular turno desde hora local del cliente
          turnoDesdeHoraLocal();
        });
    }

    function turnoDesdeHoraLocal() {
      var now  = new Date();
      var mins = now.getHours() * 60 + now.getMinutes();
      // MAÑANA: 07:00 (420) – 15:44 (944)
      // NOCHE:  15:45 (945) – 00:14 (14, cruza medianoche)
      var nombre = (mins >= 420 && mins <= 944) ? 'MAÑANA' : 'NOCHE';
      var hI     = nombre === 'MAÑANA' ? '07:00' : '15:45';
      var hF     = nombre === 'MAÑANA' ? '15:44' : '00:14';
      var icono  = nombre === 'MAÑANA' ? 'fa-sun' : 'fa-moon';
      var badge  = document.getElementById('turnoBadge');
      var texto  = document.getElementById('turnoTexto');
      texto.textContent = nombre;
      badge.querySelector('i').className = 'fa ' + icono;
      badge.dataset.turno = nombre;
      badge.title = hI + ' – ' + hF;
    }

    // ── Fecha de hoy ─────────────────────────────────────────────────
    function setFechaHoy() {
      var hoy = new Date();
      var mm = String(hoy.getMonth() + 1).padStart(2, '0');
      var dd = String(hoy.getDate()).padStart(2, '0');
      document.getElementById('fldFecha').value = hoy.getFullYear() + '-' + mm + '-' + dd;
    }

    // ── Hora actual 12h ──────────────────────────────────────────────
    function buildHoraSelects() {
      var selH = document.getElementById('fldHoraH');
      var selM = document.getElementById('fldHoraM');
      // Horas 1–12
      for (var h = 1; h <= 12; h++) {
        var opt = document.createElement('option');
        opt.value = String(h).padStart(2, '0');
        opt.textContent = String(h).padStart(2, '0');
        selH.appendChild(opt);
      }
      // Minutos 00–59
      for (var m = 0; m <= 59; m++) {
        var opt2 = document.createElement('option');
        opt2.value = String(m).padStart(2, '0');
        opt2.textContent = String(m).padStart(2, '0');
        selM.appendChild(opt2);
      }
    }

    // ── Tick en tiempo real (cada segundo, para los minutos) ────────
    function tickHora() {
      if (horaCongelada) return;
      var now   = new Date();
      var h24   = now.getHours();
      var min   = now.getMinutes();
      var ampm  = h24 >= 12 ? 'PM' : 'AM';
      var h12   = h24 % 12 || 12;

      var selH    = document.getElementById('fldHoraH');
      var selM    = document.getElementById('fldHoraM');
      var selAMPM = document.getElementById('fldHoraAMPM');

      selH.value    = String(h12).padStart(2, '0');
      selM.value    = String(min).padStart(2, '0');
      selAMPM.value = ampm;
    }

    // ── Combobox buscable ────────────────────────────────────────────
    function buildCombobox(wrapId, inputId, dropId, hiddenId, items, onSelect) {
      var wrap   = document.getElementById(wrapId);
      var input  = document.getElementById(inputId);
      var drop   = document.getElementById(dropId);
      var hidden = document.getElementById(hiddenId);

      function renderOptions(filter) {
        drop.innerHTML = '';
        var q = (filter || '').toLowerCase();
        var matches = items.filter(function (it) {
          return it.label.toLowerCase().indexOf(q) !== -1;
        });
        if (!matches.length) {
          var div = document.createElement('div');
          div.className = 'cs-option no-results';
          div.textContent = 'Sin coincidencias';
          drop.appendChild(div);
          return;
        }
        matches.forEach(function (it) {
          var div = document.createElement('div');
          div.className = 'cs-option';
          // Resaltar parte coincidente
          if (q) {
            var idx = it.label.toLowerCase().indexOf(q);
            div.innerHTML =
              escHtml(it.label.slice(0, idx)) +
              '<strong>' + escHtml(it.label.slice(idx, idx + q.length)) + '</strong>' +
              escHtml(it.label.slice(idx + q.length));
          } else {
            div.textContent = it.label;
          }
          div.dataset.val   = it.id;
          div.dataset.label = it.label;
          div.addEventListener('mousedown', function (e) {
            e.preventDefault(); // evitar blur antes del click
            selectOption(it.id, it.label);
          });
          drop.appendChild(div);
        });
      }

      function selectOption(val, label) {
        input.value  = label;
        hidden.value = val;
        wrap.classList.remove('open');
        input.dataset.selected = '1';
        if (typeof onSelect === 'function') onSelect(val);
      }

      function openDrop() {
        renderOptions(input.value);
        wrap.classList.add('open');
      }

      function closeDrop() {
        wrap.classList.remove('open');
        // Si el texto no corresponde a ninguna opción seleccionada, limpiar
        if (!hidden.value) {
          input.value = '';
        } else {
          // Verificar que el texto aún corresponde al valor seleccionado
          var match = items.find(function (it) { return String(it.id) === String(hidden.value); });
          if (!match || match.label !== input.value) {
            input.value  = '';
            hidden.value = '';
            if (typeof onSelect === 'function') onSelect('');
          }
        }
      }

      input.addEventListener('focus', function () { openDrop(); });
      input.addEventListener('input', function () {
        // Forzar mayúsculas mientras escribe
        var pos = this.selectionStart;
        this.value = this.value.toUpperCase();
        try { this.setSelectionRange(pos, pos); } catch(e){}
        hidden.value = '';
        input.dataset.selected = '';
        renderOptions(input.value);
        wrap.classList.add('open');
      });
      input.addEventListener('blur', function () {
        setTimeout(function () { closeDrop(); }, 150);
      });
    }

    // ── Responsable (usuario logueado) ───────────────────────────────
    function cargarResponsable() {
      fetch('../../sistemas/horas_paradas/datos.php?action=wf_obtenerUsuario', {
        credentials: 'same-origin'
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var nombre = (data && data.nombreUsuario) ? data.nombreUsuario : '—';
          document.getElementById('lblResponsable').value = nombre;
        })
        .catch(function () {
          document.getElementById('lblResponsable').value = '—';
        });
    }

    // ── Guardar ──────────────────────────────────────────────────────
    // Bandera para evitar doble envío
    var _guardando = false;

    function guardar() {
      if (_guardando) { return; }
      _guardando = true;
      var almacen        = document.getElementById('fldAlmacen').value;
      var fecha          = document.getElementById('fldFecha').value;
      // Turno: si modo manual toma el select, si auto toma el badge
      var manual = document.getElementById('chkTurnoManual').checked;
      var turno  = manual
        ? document.getElementById('fldTurno').value
        : (document.getElementById('turnoBadge').dataset.turno || '');
      var horaH          = document.getElementById('fldHoraH').value;
      var horaM          = document.getElementById('fldHoraM').value;
      var ampm           = document.getElementById('fldHoraAMPM').value;
      var maqVal         = document.getElementById('csMaquinaVal').value;
      var descVal        = document.getElementById('csDescVal').value;
      var tipoProducto   = document.getElementById('fldTipoProducto').value;
      var cantMuestreada = document.getElementById('fldCantMuestreada').value;
      var observaciones  = document.getElementById('fldObservaciones').value;
      var humedad        = document.getElementById('fldHumedad').value;
      var cantObservada  = document.getElementById('fldCantObservada').value;
      var comentarios    = document.getElementById('fldComentarios').value.trim();
      var accionesPreventivas = document.getElementById('fldAccionesPreventivas').value.trim();

      if (!almacen)        { _guardando = false; showNotif('Selecciona el almacén.', 'warning'); return; }
      if (!fecha)          { _guardando = false; showNotif('Ingresa la fecha.', 'warning'); return; }
      if (!turno)          { _guardando = false; showNotif('Selecciona el turno.', 'warning'); return; }
      if (!maqVal)         { _guardando = false; showNotif('Selecciona una máquina.', 'warning'); return; }
      if (!descVal)        { _guardando = false; showNotif('Selecciona una descripción.', 'warning'); return; }
      if (almacen === 'PRODUCTOS TERMINADOS' && !tipoProducto) {
        _guardando = false; showNotif('Selecciona el tipo de producto.', 'warning'); return;
      }
      if (cantMuestreada === '') { _guardando = false; showNotif('Ingresa la cantidad muestreada.', 'warning'); return; }
      if (!observaciones)  { _guardando = false; showNotif('Selecciona Observaciones.', 'warning'); return; }
      if (humedad === '')  { _guardando = false; showNotif('Ingresa la humedad promedio.', 'warning'); return; }
      if (observaciones === 'SI' && cantObservada === '') { _guardando = false; showNotif('Ingresa la cantidad observada.', 'warning'); return; }

      var hora12 = horaH + ':' + horaM + ' ' + ampm;

      // Recopilar observaciones marcadas en el acordeón
      var obsDetalle = [];
      var qtyError   = false;
      document.querySelectorAll('#obsAccordion .obs-check-item input[type="checkbox"]:checked').forEach(function (chk) {
        var item     = chk.closest('.obs-check-item');
        var qtyInput = item ? item.querySelector('.obs-qty-input') : null;
        var cantidad = qtyInput ? parseInt(qtyInput.value, 10) : NaN;
        if (!qtyInput || isNaN(cantidad) || cantidad < 1) { qtyError = true; return; }
        var cantMstr = parseFloat(document.getElementById('fldCantMuestreada').value) || 0;
        var pct = (cantMstr > 0 && cantidad > 0) ? parseFloat(((cantidad / cantMstr) * 100).toFixed(2)) : 0;
        obsDetalle.push({
          id_material:     parseInt(chk.dataset.midMat),
          nombre_material: chk.dataset.nombreMat,
          id_observacion:  parseInt(chk.dataset.idObs),
          nombre_obs:      chk.dataset.nombreObs,
          cantidad:        cantidad,
          porcentaje:      pct
        });
      });
      if (qtyError) {
        _guardando = false; showNotif('Ingresa una cantidad válida (≥ 1) en cada observación marcada.', 'warning'); return;
      }
      if (observaciones === 'SI' && !obsDetalle.length) {
        _guardando = false; showNotif('Marca al menos una observación en el detalle inferior.', 'warning'); return;
      }

      // Enviar al API
      var cantMstrNum = parseFloat(cantMuestreada) || 0;
      var cantObsNum  = parseFloat(cantObservada)  || 0;
      var pctGeneral  = (cantMstrNum > 0 && cantObsNum > 0)
        ? parseFloat(((cantObsNum / cantMstrNum) * 100).toFixed(2)) : 0;

      var payload = {
        almacen:              almacen,
        fecha:                fecha,
        turno:                turno,
        hora:                 hora12,
        id_maquina:           parseInt(maqVal, 10) || 0,
        maquina:              document.getElementById('csMaquinaInput').value,
        id_descripcion:       parseInt(descVal, 10) || 0,
        descripcion:          document.getElementById('csDescInput').value,
        id_usuario:           parseInt(document.getElementById('lblResponsable').dataset.id || '0', 10),
        responsable:          document.getElementById('lblResponsable').value,
        tipo_producto:        tipoProducto,
        humedad:              parseFloat(document.getElementById('fldHumedad').value) || 0,
        cant_muestreada:      cantMstrNum,
        observaciones:        observaciones,
        cant_observada:       cantObsNum,
        porcentaje_general:   pctGeneral,
        comentarios:          comentarios,
        acciones_preventivas: accionesPreventivas,
        obs_detalle:          obsDetalle
      };

      var btnGuardar = document.querySelector('#formFooter .btn-mcc-primary');
      if (btnGuardar) { btnGuardar.disabled = true; btnGuardar.textContent = 'Guardando...'; }

      fetch('api/datos.php?action=guardar_registro', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          showNotif('Registro guardado correctamente.', 'success', 3000);
          setTimeout(function () { location.reload(); }, 1500);
        } else {
          _guardando = false;
          showNotif('Error: ' + (res.mensaje || 'No se pudo guardar.'), 'error', 5000);
          if (btnGuardar) { btnGuardar.disabled = false; btnGuardar.textContent = 'Guardar'; }
        }
      })
      .catch(function (err) {
        _guardando = false;
        showNotif('Error de conexión al guardar.', 'error', 5000);
        if (btnGuardar) { btnGuardar.disabled = false; btnGuardar.textContent = 'Guardar'; }
      });
    }

    // ── Acordeón: funciones ───────────────────────────────────────────
    function ocultarAccordion() {
      document.getElementById('obsAccordion').innerHTML = '';
    }

    function actualizarAccordion(almacen, tipo) {
      if (!almacen) { ocultarAccordion(); return; }
      // PP carga directo; PT espera a que se elija tipo de producto
      if (almacen === 'PRODUCTOS TERMINADOS' && !tipo) { ocultarAccordion(); return; }
      cargarAccordion(almacen, tipo || '');
    }

    function cargarAccordion(almacen, tipo) {
      document.getElementById('obsAccordion').innerHTML =
        '<p style="font-size:0.85rem;color:#999;padding:8px 0"><i class="fa fa-spinner fa-spin"></i> Cargando materiales...</p>';
      var url = 'api/datos.php?action=listar_materiales_obs&almacen=' + encodeURIComponent(almacen);
      if (tipo) url += '&tipo_producto=' + encodeURIComponent(tipo);
      fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) {
            document.getElementById('obsAccordion').innerHTML =
              '<p style="color:#e74c3c;font-size:0.85rem">Error al cargar materiales.</p>';
            return;
          }
          renderAccordion(res.data || []);
        })
        .catch(function () {
          document.getElementById('obsAccordion').innerHTML =
            '<p style="color:#e74c3c;font-size:0.85rem">Error de red.</p>';
        });
    }

    function renderAccordion(mats) {
      var container = document.getElementById('obsAccordion');
      if (!mats.length) {
        container.innerHTML =
          '<p style="font-size:0.86rem;color:#aaa;font-style:italic;padding:6px 0">' +
          'Sin materiales configurados para este tipo.</p>';
        return;
      }
      var html = '';
      mats.forEach(function (mat) {
        html += '<div class="obs-acc-item">';
        html += '<div class="obs-acc-header" data-mid="' + mat.id + '">';
        html +=   '<div class="obs-acc-left">';
        html +=     '<span class="obs-acc-name">' + escHtml(mat.nombre) + '</span>';
        if (mat.observaciones.length) {
          html += '<span class="obs-acc-badge">' + mat.observaciones.length + '</span>';
        }
        html +=   '</div>';
        html +=   '<i class="fa fa-chevron-down obs-acc-icon"></i>';
        html += '</div>'; // /header
        html += '<div class="obs-acc-body" id="obsBody_' + mat.id + '">';
        if (!mat.observaciones.length) {
          html += '<p class="obs-acc-empty">Sin observaciones configuradas.</p>';
        } else {
          html += '<div class="obs-check-grid">';
          mat.observaciones.forEach(function (obs) {
            var chkId = 'chk_' + mat.id + '_' + obs.id;
            html += '<div class="obs-check-item">'
              + '<input type="checkbox" id="' + chkId + '"'
              + ' data-mid-mat="' + mat.id + '"'
              + ' data-nombre-mat="' + escAttr(mat.nombre) + '"'
              + ' data-id-obs="' + obs.id + '"'
              + ' data-nombre-obs="' + escAttr(obs.nombre) + '">'
              + '<label class="obs-check-label" for="' + chkId + '">' + escHtml(obs.nombre) + '</label>'
              + '<div class="obs-qty-wrap">'
              +   '<input type="number" class="obs-qty-input" min="1" step="1" placeholder="Cant." disabled>'
              + '</div>'
              + '</div>';
          });
          html += '</div>';
        }
        html += '</div>'; // /body
        html += '</div>'; // /item
      });
      container.innerHTML = html;
    }

    // ── Notificación ─────────────────────────────────────────────────
    function showNotif(msg, type, ms) {
      var bar = document.getElementById('notifBar');
      bar.textContent = msg;
      bar.className   = 'notif-bar notif-' + (type || 'info');
      bar.style.display = 'block';
      clearTimeout(bar._t);
      bar._t = setTimeout(function () { bar.style.display = 'none'; }, ms || 3500);
    }

    // ── Utilidades ───────────────────────────────────────────────────
    function escHtml(s) {
      return String(s)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;');
    }
    function escAttr(s) {
      return String(s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ── Ajuste visual: copiar estilos computados del select nativo
    // Copia padding, bordes, background, sombra y altura para que el
    // `.cs-wrap` coincida exactamente con `#fldAlmacen` en el dispositivo.
    document.addEventListener('DOMContentLoaded', function () {
      function copySelectStylesToWraps() {
        var base = document.getElementById('fldAlmacen');
        if (!base) return;
        try {
          var cs = window.getComputedStyle(base);
          ['#csMaquinaWrap', '#csDescWrap'].forEach(function (sel) {
            var wrap = document.querySelector(sel);
            if (!wrap) return;
            wrap.style.boxSizing = 'border-box';
            wrap.style.borderWidth = cs.borderWidth;
            wrap.style.borderStyle = cs.borderStyle;
            wrap.style.borderColor = cs.borderColor;
            wrap.style.borderRadius = cs.borderRadius;
            wrap.style.backgroundColor = cs.backgroundColor;
            wrap.style.boxShadow = cs.boxShadow;
            // Mantener ancho responsivo: usar 100% y evitar fijar en px
            wrap.style.display = 'block';
            wrap.style.width = '100%';
            wrap.style.maxWidth = '100%';
            // Ajustar el input interno para igualar padding/altura/line-height/fuente
            var inp = wrap.querySelector('.cs-input');
            if (inp) {
              inp.style.paddingTop = cs.paddingTop;
              inp.style.paddingBottom = cs.paddingBottom;
              inp.style.paddingLeft = cs.paddingLeft;
              // mantener espacio para la flecha a la derecha
              inp.style.paddingRight = cs.paddingRight;
              inp.style.minHeight = cs.height;
              inp.style.lineHeight = cs.lineHeight;
              inp.style.fontSize = cs.fontSize;
            }
          });
        } catch (e) {
          // no crítico
        }
      }
      // Ejecutar tras un pequeño delay para asegurar render nativo en móviles
      setTimeout(copySelectStylesToWraps, 60);
      // También al cambiar orientación o tamaño de ventana
      window.addEventListener('resize', function () { setTimeout(copySelectStylesToWraps, 60); });
    });

  })();
  </script>
</body>
</html>
