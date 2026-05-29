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
  <title>Tablas – Muestreo CC – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'Roboto', Arial, sans-serif; background: #f4f8fb; margin: 0; min-height: 100vh; }

    /* ── Pestañas de navegación ── */
    .tabs-nav {
      display: flex; gap: 0; padding: 0 28px;
      background: #fff; border-bottom: 2px solid #e0eaef;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .tab-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 12px 22px; border: none; background: none;
      font-size: 0.9rem; font-family: inherit; font-weight: 600;
      color: #888; cursor: pointer; border-bottom: 3px solid transparent;
      margin-bottom: -2px; transition: color 0.15s, border-color 0.15s;
    }
    .tab-btn:hover { color: #1fa9a0; }
    .tab-btn.active { color: #1fa9a0; border-bottom-color: #1fa9a0; }

    /* ── Paneles de pestañas ── */
    .tab-panel { display: none; }
    .tab-panel.active { display: block; }

    /* ── Layout single (almacenes / tipos) ── */
    .tablas-layout-single {
      padding: 24px 28px; max-width: 600px;
    }

    /* ── Cabecera ── */
    .mcc-header {
      background: linear-gradient(90deg, #1fa9a0 0%, #17857e 100%);
      color: #fff; padding: 14px 28px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    .mcc-header-title  { font-size: 1.3rem; font-weight: 700; letter-spacing: 0.5px; }
    .mcc-header-sub    { font-size: 0.88rem; opacity: 0.88; margin-top: 2px; }
    .mcc-header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

    /* ── Botones ── */
    .btn-mcc {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border: none; border-radius: 7px;
      font-size: 0.92rem; font-family: inherit; font-weight: 600;
      cursor: pointer; transition: background 0.18s;
    }
    .btn-mcc-primary  { background: #1fa9a0; color: #fff; }
    .btn-mcc-primary:hover  { background: #17857e; }
    .btn-mcc-back     { background: #6c757d; color: #fff; }
    .btn-mcc-back:hover     { background: #545b62; }
    .btn-mcc-danger   { background: #e74c3c; color: #fff; }
    .btn-mcc-danger:hover   { background: #c0392b; }
    .btn-mcc-warning  { background: #e67e22; color: #fff; }
    .btn-mcc-warning:hover  { background: #cf6d17; }
    .btn-mcc:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-sm { padding: 5px 10px !important; font-size: 0.8rem !important; }

    /* ── Layout dos columnas ── */
    .tablas-layout {
      display: grid;
      grid-template-columns: 480px 1fr;
      gap: 20px;
      padding: 24px 28px;
      align-items: start;
    }

    /* ── Tarjetas de panel ── */
    .panel-card {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 14px rgba(31,169,160,0.09);
      display: flex; flex-direction: column;
      overflow: hidden; min-height: 320px;
    }
    .panel-card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 13px 18px;
      border-bottom: 2px solid #e0eaef;
      background: #f8fdfc;
    }
    .panel-card-title {
      font-size: 0.97rem; font-weight: 700; color: #1fa9a0;
      display: flex; align-items: center; gap: 8px;
    }

    /* ── Filtros ── */
    .panel-filter-row {
      display: flex; gap: 8px; padding: 10px 14px;
      border-bottom: 1px solid #f0f4f7;
      background: #fafcfc; flex-wrap: wrap;
    }
    .panel-filter-row select {
      flex: 1; min-width: 130px;
      padding: 7px 9px; border: 1px solid #cdd6e0;
      border-radius: 7px; font-size: 0.88rem; font-family: inherit;
      background: #fff; text-transform: uppercase;
      outline: none; transition: border 0.15s;
    }
    .panel-filter-row select:focus { border-color: #1fa9a0; }
    .panel-filter-row select:disabled { background: #f5f5f5; color: #aaa; }

    /* ── Tablas nativas ── */
    .panel-table-wrap { overflow-x: auto; }
    .panel-table { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
    .panel-table th {
      background: #1fa9a0; color: #fff;
      padding: 9px 12px; text-align: left;
      white-space: nowrap; font-weight: 600;
    }
    .panel-table td { padding: 9px 12px; border-bottom: 1px solid #eef2f5; vertical-align: middle; }
    .panel-table tbody tr:hover { background: #f0fafa; cursor: pointer; }
    .panel-table tbody tr.selected { background: #d8f3f1 !important; }
    .panel-table .empty-row td { text-align: center; color: #aaa; padding: 30px; font-style: italic; }

    /* ── Scroll vertical para lista de materiales (panel izquierdo) ── */
    .tablas-layout > .panel-card:first-child { /* límite prudente para la tarjeta izquierda */
      max-height: calc(100vh - 220px);
      display: flex; flex-direction: column;
    }
    .tablas-layout > .panel-card:first-child .panel-table-wrap {
      overflow-y: auto; /* habilita scroll vertical */
      max-height: calc(100vh - 340px); /* dejar espacio para header/filtros */
      -webkit-overflow-scrolling: touch;
    }
    /* Ajustes de columna para la tabla izquierda */
    /* Permitir wrap en la primera columna (Material) y limitar su ancho */
    .tablas-layout > .panel-card:first-child .panel-table th:first-child,
    .tablas-layout > .panel-card:first-child .panel-table td:first-child {
      width: 180px; max-width: 180px; word-break: break-word; white-space: normal;
    }
    /* Mantener sin wrap en la columna de acciones para que los botones no se rompan */
    .tablas-layout > .panel-card:first-child .panel-table th:last-child,
    .tablas-layout > .panel-card:first-child .panel-table td:last-child {
      white-space: nowrap;
    }

    /* ── Badges ── */
    .badge-activo   { background: #d4edda; color: #155724; padding: 3px 9px; border-radius: 12px; font-size: 0.78rem; font-weight: 700; display: inline-block; }
    .badge-inactivo { background: #f8d7da; color: #721c24; padding: 3px 9px; border-radius: 12px; font-size: 0.78rem; font-weight: 700; display: inline-block; }

    /* ── Material seleccionado en panel obs ── */
    .obs-subtitle {
      display: none; padding: 8px 16px;
      background: #e8f8f7; border-bottom: 1px solid #d0ece9;
      font-size: 0.84rem; color: #17857e; font-weight: 600;
    }
    .obs-placeholder {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 54px 24px; color: #b0bec5; text-align: center;
    }
    .obs-placeholder i { font-size: 2.4rem; margin-bottom: 12px; }
    .obs-placeholder p { font-size: 0.93rem; margin: 0; }

    /* ── Modales ── */
    .mcc-modal-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.45); z-index: 1000;
      align-items: center; justify-content: center;
    }
    .mcc-modal-overlay.open { display: flex; }
    .mcc-modal {
      background: #fff; border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      padding: 26px 30px; width: 100%; max-width: 460px;
      position: relative; max-height: 94vh; overflow-y: auto;
    }
    .mcc-modal-title { font-size: 1.05rem; font-weight: 700; color: #1fa9a0; margin-bottom: 18px; }
    .mcc-modal-close {
      position: absolute; top: 14px; right: 18px;
      background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #888;
    }
    .mcc-modal-close:hover { color: #e74c3c; }
    .mcc-modal-field { margin-bottom: 14px; }
    .mcc-modal-field label { display: block; font-size: 0.82rem; font-weight: 600; color: #555; margin-bottom: 5px; }
    .mcc-modal-field input,
    .mcc-modal-field select {
      width: 100%; padding: 9px 11px;
      border: 1px solid #cdd6e0; border-radius: 7px;
      font-size: 0.93rem; font-family: inherit;
      text-transform: uppercase; transition: border 0.15s;
    }
    .mcc-modal-field input:focus,
    .mcc-modal-field select:focus { outline: none; border-color: #1fa9a0; }
    .mcc-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; flex-wrap: wrap; }

    /* ── Confirmación ── */
    .confirm-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.45); z-index: 2000;
      align-items: center; justify-content: center;
    }
    .confirm-overlay.open { display: flex; }
    .confirm-box {
      background: #fff; border-radius: 12px;
      padding: 26px 28px; max-width: 360px; width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2); text-align: center;
    }
    .confirm-box p { font-size: 0.97rem; color: #333; margin: 0 0 22px; line-height: 1.5; }
    .confirm-actions { display: flex; justify-content: center; gap: 12px; }

    /* ── Notificación ── */
    .notif-bar {
      display: none; position: fixed; bottom: 24px; left: 50%;
      transform: translateX(-50%); padding: 12px 28px;
      border-radius: 9px; font-size: 0.95rem; font-weight: 600;
      z-index: 9999; box-shadow: 0 4px 18px rgba(0,0,0,0.16); white-space: nowrap;
    }
    .notif-success { background: #27ae60; color: #fff; }
    .notif-error   { background: #e74c3c; color: #fff; }
    .notif-warning { background: #f39c12; color: #fff; }
    .notif-info    { background: #2980b9; color: #fff; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .tablas-layout { grid-template-columns: 1fr; padding: 14px 10px; gap: 14px; }
      .mcc-header { padding: 12px 14px; }
      .mcc-header-title { font-size: 1.1rem; }
    }
  </style>
</head>
<body>

  <!-- Cabecera -->
  <div class="mcc-header">
    <div>
      <div class="mcc-header-title"><i class="fa fa-table"></i>&nbsp; Tablas – Muestreo de Control de Calidad</div>
      <div class="mcc-header-sub">CAMPO ANDINO – Gestión de tablas del módulo</div>
    </div>
    <div class="mcc-header-actions">
      <a href="importar_productos.php" class="btn-mcc btn-mcc-back" style="text-decoration:none">
        <i class="fa fa-file-import"></i> Importar Productos
      </a>
      <a href="../../public/panel.html" class="btn-mcc btn-mcc-back" style="text-decoration:none">
        <i class="fa fa-arrow-left"></i> Panel
      </a>
    </div>
  </div>

  <!-- Pestañas de navegación -->
  <div class="tabs-nav">
    <button class="tab-btn active" data-tab="tabMateriales"><i class="fa fa-cubes"></i> Materiales</button>
    <button class="tab-btn" data-tab="tabAlmacenes"><i class="fa fa-warehouse"></i> Almacenes</button>
    <button class="tab-btn" data-tab="tabTipos"><i class="fa fa-tags"></i> Tipos de Producto</button>
  </div>

  <!-- ══ TAB: Materiales + Observaciones ══ -->
  <div class="tab-panel active" id="tabMateriales">
  <!-- Layout dos columnas -->
  <div class="tablas-layout">

    <!-- ══ Panel: Materiales ══ -->
    <div class="panel-card">
      <div class="panel-card-header">
        <div class="panel-card-title"><i class="fa fa-cubes"></i> Materiales</div>
        <button class="btn-mcc btn-mcc-primary btn-sm" id="btnNuevoMaterial">
          <i class="fa fa-plus"></i> Nuevo
        </button>
      </div>

      <!-- Filtros -->
      <div class="panel-filter-row">
        <select id="filtroAlmacen" title="Filtrar por almacén">
          <option value="">— Todos los almacenes —</option>
        </select>
        <select id="filtroTipo" title="Filtrar por tipo de producto">
          <option value="">— Todos los tipos —</option>
        </select>
      </div>

      <!-- Tabla -->
      <div class="panel-table-wrap">
        <table class="panel-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Almacén</th>
              <th>Tipo</th>
              <th style="width:82px">Estado</th>
              <th style="width:78px">Acc.</th>
            </tr>
          </thead>
          <tbody id="tblMaterialesBody">
            <tr class="empty-row"><td colspan="5">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══ Panel: Observaciones ══ -->
    <div class="panel-card">
      <div class="panel-card-header">
        <div class="panel-card-title"><i class="fa fa-clipboard-list"></i> Observaciones</div>
        <button class="btn-mcc btn-mcc-primary btn-sm" id="btnNuevaObservacion" disabled>
          <i class="fa fa-plus"></i> Nueva
        </button>
      </div>

      <div id="obsSubtitle" class="obs-subtitle"></div>

      <div id="obsPlaceholder" class="obs-placeholder">
        <i class="fa fa-hand-point-left"></i>
        <p>Selecciona un material de la izquierda<br>para ver sus observaciones</p>
      </div>

      <div id="obsTableWrap" class="panel-table-wrap" style="display:none;">
        <table class="panel-table">
          <thead>
            <tr>
              <th>Observación</th>
              <th style="width:82px">Estado</th>
              <th style="width:78px">Acc.</th>
            </tr>
          </thead>
          <tbody id="tblObservacionesBody"></tbody>
        </table>
      </div>
    </div>

  </div><!-- /tablas-layout -->
  </div><!-- /tabMateriales -->

  <!-- ══ TAB: Almacenes ══ -->
  <div class="tab-panel" id="tabAlmacenes">
    <div class="tablas-layout-single">
      <div class="panel-card">
        <div class="panel-card-header">
          <div class="panel-card-title"><i class="fa fa-warehouse"></i> Almacenes</div>
          <button class="btn-mcc btn-mcc-primary btn-sm" id="btnNuevoAlmacen"><i class="fa fa-plus"></i> Nuevo</button>
        </div>
        <div class="panel-table-wrap">
          <table class="panel-table">
            <thead><tr><th>Nombre</th><th style="width:90px">Estado</th><th style="width:90px">Acc.</th></tr></thead>
            <tbody id="tblAlmacenesBody"><tr class="empty-row"><td colspan="3">Cargando...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  </div><!-- /tabAlmacenes -->

  <!-- ══ TAB: Tipos de Producto ══ -->
  <div class="tab-panel" id="tabTipos">
    <div class="tablas-layout-single">
      <div class="panel-card">
        <div class="panel-card-header">
          <div class="panel-card-title"><i class="fa fa-tags"></i> Tipos de Producto</div>
          <button class="btn-mcc btn-mcc-primary btn-sm" id="btnNuevoTipo"><i class="fa fa-plus"></i> Nuevo</button>
        </div>
        <div class="panel-table-wrap">
          <table class="panel-table">
            <thead><tr><th>Nombre</th><th style="width:90px">Estado</th><th style="width:90px">Acc.</th></tr></thead>
            <tbody id="tblTiposBody"><tr class="empty-row"><td colspan="3">Cargando...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  </div><!-- /tabTipos -->

  <!-- ── Modal: Almacén ── -->
  <div class="mcc-modal-overlay" id="modalAlmacen">
    <div class="mcc-modal">
      <button class="mcc-modal-close" id="btnCerrarModalAlm">&times;</button>
      <div class="mcc-modal-title" id="modalAlmTitulo">Nuevo almacén</div>
      <input type="hidden" id="almId" />
      <div class="mcc-modal-field">
        <label>Nombre <span style="color:red">*</span></label>
        <input type="text" id="almNombre" placeholder="Ej: PRODUCTOS TERMINADOS" autocomplete="off" />
      </div>
      <div class="mcc-modal-field">
        <label>Estado</label>
        <select id="almActivo">
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
      <div class="mcc-modal-footer">
        <button class="btn-mcc btn-mcc-back" id="btnCancelarModalAlm"><i class="fa fa-times"></i> Cancelar</button>
        <button class="btn-mcc btn-mcc-primary" id="btnGuardarAlmacen"><i class="fa fa-save"></i> Guardar</button>
      </div>
    </div>
  </div>

  <!-- ── Modal: Tipo de producto ── -->
  <div class="mcc-modal-overlay" id="modalTipo">
    <div class="mcc-modal">
      <button class="mcc-modal-close" id="btnCerrarModalTipo">&times;</button>
      <div class="mcc-modal-title" id="modalTipoTitulo">Nuevo tipo de producto</div>
      <input type="hidden" id="tipoId" />
      <div class="mcc-modal-field">
        <label>Nombre <span style="color:red">*</span></label>
        <input type="text" id="tipoNombre" placeholder="Ej: CAJA" autocomplete="off" />
      </div>
      <div class="mcc-modal-field">
        <label>Estado</label>
        <select id="tipoActivo">
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
      <div class="mcc-modal-footer">
        <button class="btn-mcc btn-mcc-back" id="btnCancelarModalTipo"><i class="fa fa-times"></i> Cancelar</button>
        <button class="btn-mcc btn-mcc-primary" id="btnGuardarTipo"><i class="fa fa-save"></i> Guardar</button>
      </div>
    </div>
  </div>

  <!-- ── Modal: Material ── -->
  <div class="mcc-modal-overlay" id="modalMaterial">
    <div class="mcc-modal">
      <button class="mcc-modal-close" id="btnCerrarModalMat">&times;</button>
      <div class="mcc-modal-title" id="modalMatTitulo">Nuevo material</div>
      <input type="hidden" id="matId" />

      <div class="mcc-modal-field">
        <label>Nombre <span style="color:red">*</span></label>
        <input type="text" id="matNombre" placeholder="Nombre del material" autocomplete="off" />
      </div>
      <div class="mcc-modal-field">
        <label>Almacén <span style="color:red">*</span></label>
        <select id="matAlmacen">
          <option value="">— Seleccionar —</option>
        </select>
      </div>
      <div class="mcc-modal-field" id="matTipoField" style="display:none;">
        <label>Tipo de producto</label>
        <select id="matTipo">
          <option value="">— Todos / No aplica —</option>
        </select>
      </div>
      <div class="mcc-modal-field">
        <label>Estado</label>
        <select id="matActivo">
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>

      <div class="mcc-modal-footer">
        <button class="btn-mcc btn-mcc-back" id="btnCancelarModalMat"><i class="fa fa-times"></i> Cancelar</button>
        <button class="btn-mcc btn-mcc-primary" id="btnGuardarMaterial"><i class="fa fa-save"></i> Guardar</button>
      </div>
    </div>
  </div>

  <!-- ── Modal: Observación ── -->
  <div class="mcc-modal-overlay" id="modalObservacion">
    <div class="mcc-modal">
      <button class="mcc-modal-close" id="btnCerrarModalObs">&times;</button>
      <div class="mcc-modal-title" id="modalObsTitulo">Nueva observación</div>
      <input type="hidden" id="obsId" />
      <input type="hidden" id="obsIdMaterial" />

      <div class="mcc-modal-field">
        <label>Observación <span style="color:red">*</span></label>
        <input type="text" id="obsNombre" placeholder="Descripción de la observación" autocomplete="off" />
      </div>
      <div class="mcc-modal-field">
        <label>Estado</label>
        <select id="obsActivo">
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>

      <div class="mcc-modal-footer">
        <button class="btn-mcc btn-mcc-back" id="btnCancelarModalObs"><i class="fa fa-times"></i> Cancelar</button>
        <button class="btn-mcc btn-mcc-primary" id="btnGuardarObservacion"><i class="fa fa-save"></i> Guardar</button>
      </div>
    </div>
  </div>

  <!-- ── Confirmación ── -->
  <div class="confirm-overlay" id="confirmOverlay">
    <div class="confirm-box">
      <p id="confirmMsg">¿Confirmas la eliminación?</p>
      <div class="confirm-actions">
        <button class="btn-mcc btn-mcc-back" id="btnConfirmNo"><i class="fa fa-times"></i> No</button>
        <button class="btn-mcc btn-mcc-danger" id="btnConfirmSi"><i class="fa fa-trash"></i> Sí, eliminar</button>
      </div>
    </div>
  </div>

  <!-- Notificación -->
  <div class="notif-bar" id="notifBar"></div>

  <script>
  (function () {
    'use strict';

    var API = 'api/datos.php';

    // Estado
    var allMateriales      = [];
    var allObservaciones   = [];
    var allAlmacenes       = [];
    var allTipos           = [];
    var selectedMatId      = null;
    var selectedMatNombre  = '';
    var confirmCallback    = null;

    // ── Init ────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
      cargarAlmacenes();
      cargarTipos();
      cargarMateriales();
      bindControls();
    });

    // ── Bindings ─────────────────────────────────────────────────────
    function bindControls() {

      // Pestañas
      document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
          document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
          btn.classList.add('active');
          document.getElementById(btn.dataset.tab).classList.add('active');
        });
      });

      // Filtros
      document.getElementById('filtroAlmacen').addEventListener('change', function () {
        var selTipo = document.getElementById('filtroTipo');
        if (this.value === 'PRODUCTOS EN PROCESO') {
          selTipo.value = ''; selTipo.disabled = true;
        } else {
          selTipo.disabled = false;
        }
        cargarMateriales();
      });
      document.getElementById('filtroTipo').addEventListener('change', cargarMateriales);

      // Modal material
      document.getElementById('btnNuevoMaterial').addEventListener('click', function () { abrirModalMaterial(null); });
      document.getElementById('btnCerrarModalMat').addEventListener('click', function () { cerrarModal('modalMaterial'); });
      document.getElementById('btnCancelarModalMat').addEventListener('click', function () { cerrarModal('modalMaterial'); });
      document.getElementById('btnGuardarMaterial').addEventListener('click', guardarMaterial);

      // Almacén en modal → mostrar/ocultar campo Tipo
      document.getElementById('matAlmacen').addEventListener('change', function () {
        var show = this.value === 'PRODUCTOS TERMINADOS';
        document.getElementById('matTipoField').style.display = show ? 'block' : 'none';
        if (!show) document.getElementById('matTipo').value = '';
      });

      // Modal observación
      document.getElementById('btnNuevaObservacion').addEventListener('click', function () { abrirModalObservacion(null); });
      document.getElementById('btnCerrarModalObs').addEventListener('click', function () { cerrarModal('modalObservacion'); });
      document.getElementById('btnCancelarModalObs').addEventListener('click', function () { cerrarModal('modalObservacion'); });
      document.getElementById('btnGuardarObservacion').addEventListener('click', guardarObservacion);

      // Confirmación
      document.getElementById('btnConfirmNo').addEventListener('click', function () {
        cerrarModal('confirmOverlay'); confirmCallback = null;
      });
      document.getElementById('btnConfirmSi').addEventListener('click', function () {
        cerrarModal('confirmOverlay');
        if (confirmCallback) { confirmCallback(); confirmCallback = null; }
      });

      // Mayúsculas en tiempo real
      ['matNombre', 'obsNombre', 'almNombre', 'tipoNombre'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', function () {
          var p = this.selectionStart;
          this.value = this.value.toUpperCase();
          try { this.setSelectionRange(p, p); } catch (e) {}
        });
      });

      // Modal Almacén
      document.getElementById('btnNuevoAlmacen').addEventListener('click', function () { abrirModalAlmacen(null); });
      document.getElementById('btnCerrarModalAlm').addEventListener('click', function () { cerrarModal('modalAlmacen'); });
      document.getElementById('btnCancelarModalAlm').addEventListener('click', function () { cerrarModal('modalAlmacen'); });
      document.getElementById('btnGuardarAlmacen').addEventListener('click', guardarAlmacen);

      // Modal Tipo de producto
      document.getElementById('btnNuevoTipo').addEventListener('click', function () { abrirModalTipo(null); });
      document.getElementById('btnCerrarModalTipo').addEventListener('click', function () { cerrarModal('modalTipo'); });
      document.getElementById('btnCancelarModalTipo').addEventListener('click', function () { cerrarModal('modalTipo'); });
      document.getElementById('btnGuardarTipo').addEventListener('click', guardarTipo);

      // Delegación tabla almacenes
      document.getElementById('tblAlmacenesBody').addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-action]');
        if (!btn) return;
        var id = parseInt(btn.dataset.id), nombre = btn.dataset.nombre || '';
        if (btn.dataset.action === 'edit-alm') abrirModalAlmacen(id);
        if (btn.dataset.action === 'del-alm')  confirmarEliminar('¿Eliminar almacén "' + nombre + '"?', function () { eliminarAlmacen(id); });
      });

      // Delegación tabla tipos
      document.getElementById('tblTiposBody').addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-action]');
        if (!btn) return;
        var id = parseInt(btn.dataset.id), nombre = btn.dataset.nombre || '';
        if (btn.dataset.action === 'edit-tipo') abrirModalTipo(id);
        if (btn.dataset.action === 'del-tipo')  confirmarEliminar('¿Eliminar tipo "' + nombre + '"?', function () { eliminarTipo(id); });
      });

      // Delegación de eventos en tabla materiales
      document.getElementById('tblMaterialesBody').addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-action]');
        if (btn) {
          e.stopPropagation();
          var id     = parseInt(btn.dataset.id);
          var nombre = btn.dataset.nombre || '';
          if (btn.dataset.action === 'edit-mat')  abrirModalMaterial(id);
          if (btn.dataset.action === 'del-mat')   confirmarEliminar('¿Eliminar material "' + nombre + '"?', function () { eliminarMaterial(id); });
          return;
        }
        var tr = e.target.closest('tr[data-mid]');
        if (tr) seleccionarMaterial(parseInt(tr.dataset.mid), tr.dataset.nombre);
      });

      // Delegación en tabla observaciones
      document.getElementById('tblObservacionesBody').addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-action]');
        if (!btn) return;
        var id     = parseInt(btn.dataset.id);
        var nombre = btn.dataset.nombre || '';
        if (btn.dataset.action === 'edit-obs') abrirModalObservacion(id);
        if (btn.dataset.action === 'del-obs')  confirmarEliminar('¿Eliminar observación "' + nombre + '"?', function () { eliminarObservacion(id); });
      });
    }

    // ── Materiales ────────────────────────────────────────────────────
    // ── Almacenes ─────────────────────────────────────────────────────
    function cargarAlmacenes() {
      fetch(API + '?action=listar_almacenes')
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error al cargar almacenes', 'error'); return; }
          allAlmacenes = res.data || [];
          renderAlmacenes();
          poblarFiltroAlmacen();
          poblarSelectAlmacen('matAlmacen');
        })
        .catch(function () { showNotif('Error de red (almacenes)', 'error'); });
    }

    function renderAlmacenes() {
      var tbody = document.getElementById('tblAlmacenesBody');
      if (!allAlmacenes.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="3">Sin almacenes. Agrega el primero.</td></tr>';
        return;
      }
      var html = '';
      allAlmacenes.forEach(function (r) {
        var badge = r.activo == 1 ? '<span class="badge-activo">Activo</span>' : '<span class="badge-inactivo">Inactivo</span>';
        html += '<tr>'
          + '<td>' + escHtml(r.nombre) + '</td>'
          + '<td>' + badge + '</td>'
          + '<td style="white-space:nowrap">'
          +   '<button class="btn-mcc btn-mcc-warning btn-sm" data-action="edit-alm" data-id="' + r.id + '" title="Editar"><i class="fa fa-edit"></i></button> '
          +   '<button class="btn-mcc btn-mcc-danger btn-sm" data-action="del-alm" data-id="' + r.id + '" data-nombre="' + escAttr(r.nombre) + '" title="Eliminar"><i class="fa fa-trash"></i></button>'
          + '</td></tr>';
      });
      tbody.innerHTML = html;
    }

    function poblarFiltroAlmacen() {
      var sel = document.getElementById('filtroAlmacen');
      sel.innerHTML = '<option value="">— Todos los almacenes —</option>';
      allAlmacenes.forEach(function (r) {
        if (r.activo == 1) sel.innerHTML += '<option value="' + escAttr(r.nombre) + '">' + escHtml(r.nombre) + '</option>';
      });
    }

    function poblarSelectAlmacen(id) {
      var sel = document.getElementById(id);
      var val = sel.value;
      sel.innerHTML = '<option value="">— Seleccionar —</option>';
      allAlmacenes.forEach(function (r) {
        if (r.activo == 1) sel.innerHTML += '<option value="' + escAttr(r.nombre) + '">' + escHtml(r.nombre) + '</option>';
      });
      sel.value = val;
    }

    function abrirModalAlmacen(id) {
      var r = id ? allAlmacenes.find(function (x) { return x.id == id; }) : null;
      document.getElementById('almId').value       = r ? r.id      : '';
      document.getElementById('almNombre').value   = r ? r.nombre  : '';
      document.getElementById('almActivo').value   = r ? r.activo  : '1';
      document.getElementById('modalAlmTitulo').textContent = r ? 'Editar almacén' : 'Nuevo almacén';
      abrirModal('modalAlmacen');
      setTimeout(function () { document.getElementById('almNombre').focus(); }, 100);
    }

    function guardarAlmacen() {
      var nombre = document.getElementById('almNombre').value.trim().toUpperCase();
      if (!nombre) { showNotif('El nombre es obligatorio.', 'error'); return; }
      var body = {
        id:     parseInt(document.getElementById('almId').value) || 0,
        nombre: nombre,
        activo: parseInt(document.getElementById('almActivo').value)
      };
      fetch(API + '?action=guardar_almacen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error al guardar', 'error'); return; }
          cerrarModal('modalAlmacen');
          showNotif(res.mensaje || 'Almacén guardado.', 'ok');
          cargarAlmacenes();
        })
        .catch(function () { showNotif('Error de red', 'error'); });
    }

    function eliminarAlmacen(id) {
      fetch(API + '?action=eliminar_almacen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          showNotif(res.mensaje || (res.success ? 'Eliminado.' : 'Error.'), res.success ? 'ok' : 'error');
          if (res.success) cargarAlmacenes();
        })
        .catch(function () { showNotif('Error de red', 'error'); });
    }

    // ── Tipos de Producto ─────────────────────────────────────────────
    function cargarTipos() {
      fetch(API + '?action=listar_tipoproducto')
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error al cargar tipos', 'error'); return; }
          allTipos = res.data || [];
          renderTipos();
          poblarFiltroTipo();
          poblarSelectTipo('matTipo');
        })
        .catch(function () { showNotif('Error de red (tipos)', 'error'); });
    }

    function renderTipos() {
      var tbody = document.getElementById('tblTiposBody');
      if (!allTipos.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="3">Sin tipos. Agrega el primero.</td></tr>';
        return;
      }
      var html = '';
      allTipos.forEach(function (r) {
        var badge = r.activo == 1 ? '<span class="badge-activo">Activo</span>' : '<span class="badge-inactivo">Inactivo</span>';
        html += '<tr>'
          + '<td>' + escHtml(r.nombre) + '</td>'
          + '<td>' + badge + '</td>'
          + '<td style="white-space:nowrap">'
          +   '<button class="btn-mcc btn-mcc-warning btn-sm" data-action="edit-tipo" data-id="' + r.id + '" title="Editar"><i class="fa fa-edit"></i></button> '
          +   '<button class="btn-mcc btn-mcc-danger btn-sm" data-action="del-tipo" data-id="' + r.id + '" data-nombre="' + escAttr(r.nombre) + '" title="Eliminar"><i class="fa fa-trash"></i></button>'
          + '</td></tr>';
      });
      tbody.innerHTML = html;
    }

    function poblarFiltroTipo() {
      var sel = document.getElementById('filtroTipo');
      sel.innerHTML = '<option value="">— Todos los tipos —</option>';
      allTipos.forEach(function (r) {
        if (r.activo == 1) sel.innerHTML += '<option value="' + escAttr(r.nombre) + '">' + escHtml(r.nombre) + '</option>';
      });
    }

    function poblarSelectTipo(id) {
      var sel = document.getElementById(id);
      var val = sel.value;
      sel.innerHTML = '<option value="">— Todos / No aplica —</option>';
      allTipos.forEach(function (r) {
        if (r.activo == 1) sel.innerHTML += '<option value="' + escAttr(r.nombre) + '">' + escHtml(r.nombre) + '</option>';
      });
      sel.value = val;
    }

    function abrirModalTipo(id) {
      var r = id ? allTipos.find(function (x) { return x.id == id; }) : null;
      document.getElementById('tipoId').value      = r ? r.id     : '';
      document.getElementById('tipoNombre').value  = r ? r.nombre : '';
      document.getElementById('tipoActivo').value  = r ? r.activo : '1';
      document.getElementById('modalTipoTitulo').textContent = r ? 'Editar tipo' : 'Nuevo tipo de producto';
      abrirModal('modalTipo');
      setTimeout(function () { document.getElementById('tipoNombre').focus(); }, 100);
    }

    function guardarTipo() {
      var nombre = document.getElementById('tipoNombre').value.trim().toUpperCase();
      if (!nombre) { showNotif('El nombre es obligatorio.', 'error'); return; }
      var body = {
        id:     parseInt(document.getElementById('tipoId').value) || 0,
        nombre: nombre,
        activo: parseInt(document.getElementById('tipoActivo').value)
      };
      fetch(API + '?action=guardar_tipoproducto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error al guardar', 'error'); return; }
          cerrarModal('modalTipo');
          showNotif(res.mensaje || 'Tipo guardado.', 'ok');
          cargarTipos();
        })
        .catch(function () { showNotif('Error de red', 'error'); });
    }

    function eliminarTipo(id) {
      fetch(API + '?action=eliminar_tipoproducto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          showNotif(res.mensaje || (res.success ? 'Eliminado.' : 'Error.'), res.success ? 'ok' : 'error');
          if (res.success) cargarTipos();
        })
        .catch(function () { showNotif('Error de red', 'error'); });
    }

    // ── Materiales ────────────────────────────────────────────────────
    function cargarMateriales() {
      var almacen = document.getElementById('filtroAlmacen').value;
      var tipo    = document.getElementById('filtroTipo').value;
      var url     = API + '?action=listar_materiales';
      if (almacen) url += '&almacen='       + encodeURIComponent(almacen);
      if (tipo)    url += '&tipo_producto=' + encodeURIComponent(tipo);

      fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error al cargar', 'error'); return; }
          allMateriales = res.data || [];
          renderMateriales();
        })
        .catch(function (e) { showNotif('Error de red', 'error'); });
    }

    function renderMateriales() {
      var tbody = document.getElementById('tblMaterialesBody');
      if (!allMateriales.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Sin materiales. Agrega el primero.</td></tr>';
        return;
      }
      var html = '';
      allMateriales.forEach(function (r) {
        var badge   = r.activo == 1 ? '<span class="badge-activo">Activo</span>' : '<span class="badge-inactivo">Inactivo</span>';
        var tipo    = r.tipo_producto ? escHtml(r.tipo_producto) : '<span style="color:#aaa">—</span>';
        var almAbb  = r.almacen === 'PRODUCTOS TERMINADOS' ? 'PT' : 'PP';
        var selCls  = r.id == selectedMatId ? ' class="selected"' : '';
        html += '<tr data-mid="' + r.id + '" data-nombre="' + escAttr(r.nombre) + '"' + selCls + '>'
          + '<td>' + escHtml(r.nombre) + '</td>'
          + '<td><span title="' + escAttr(r.almacen) + '">' + almAbb + '</span></td>'
          + '<td>' + tipo + '</td>'
          + '<td>' + badge + '</td>'
          + '<td style="white-space:nowrap">'
          +   '<button class="btn-mcc btn-mcc-warning btn-sm" data-action="edit-mat" data-id="' + r.id + '" title="Editar"><i class="fa fa-edit"></i></button> '
          +   '<button class="btn-mcc btn-mcc-danger btn-sm" data-action="del-mat" data-id="' + r.id + '" data-nombre="' + escAttr(r.nombre) + '" title="Eliminar"><i class="fa fa-trash"></i></button>'
          + '</td>'
          + '</tr>';
      });
      tbody.innerHTML = html;
    }

    function seleccionarMaterial(id, nombre) {
      selectedMatId     = id;
      selectedMatNombre = nombre;
      renderMateriales(); // re-renderizar para actualizar clase selected
      document.getElementById('btnNuevaObservacion').disabled = false;
      var sub = document.getElementById('obsSubtitle');
      sub.textContent = 'Material: ' + nombre;
      sub.style.display = 'block';
      cargarObservaciones(id);
    }

    function abrirModalMaterial(id) {
      var m = id ? allMateriales.find(function (x) { return x.id == id; }) : null;
      // Repoblar selects con datos actuales de BD
      poblarSelectAlmacen('matAlmacen');
      poblarSelectTipo('matTipo');
      document.getElementById('matId').value     = m ? m.id     : '';
      document.getElementById('matNombre').value = m ? m.nombre : '';
      document.getElementById('matAlmacen').value= m ? m.almacen : '';
      document.getElementById('matTipo').value   = m && m.tipo_producto ? m.tipo_producto : '';
      document.getElementById('matActivo').value = m ? m.activo : 1;
      document.getElementById('matTipoField').style.display = (m && m.almacen === 'PRODUCTOS TERMINADOS') ? 'block' : 'none';
      document.getElementById('modalMatTitulo').textContent = id ? 'Editar material' : 'Nuevo material';
      abrirModal('modalMaterial');
    }

    function guardarMaterial() {
      var id      = document.getElementById('matId').value;
      var nombre  = document.getElementById('matNombre').value.trim();
      var almacen = document.getElementById('matAlmacen').value;
      var tipo    = document.getElementById('matTipo').value;
      var activo  = document.getElementById('matActivo').value;

      if (!nombre)  { showNotif('Ingresa el nombre del material.', 'warning'); return; }
      if (!almacen) { showNotif('Selecciona el almacén.', 'warning'); return; }

      var payload = { nombre: nombre, almacen: almacen, tipo_producto: tipo || null, activo: parseInt(activo) };
      if (id) payload.id = parseInt(id);

      var btnGuardar = document.getElementById('btnGuardarMaterial');
      btnGuardar.disabled = true;

      fetch(API + '?action=guardar_material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          btnGuardar.disabled = false;
          if (!res.success) { showNotif(res.mensaje || 'Error al guardar', 'error'); return; }
          cerrarModal('modalMaterial');
          showNotif('Material guardado.', 'success');
          cargarMateriales();
        })
        .catch(function () { btnGuardar.disabled = false; showNotif('Error de red', 'error'); });
    }

    function eliminarMaterial(id) {
      fetch(API + '?action=eliminar_material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error al eliminar', 'error'); return; }
          showNotif('Material eliminado.', 'success');
          if (selectedMatId == id) {
            selectedMatId = null; selectedMatNombre = '';
            resetObsPanel();
          }
          cargarMateriales();
        })
        .catch(function () { showNotif('Error de red', 'error'); });
    }

    // ── Observaciones ─────────────────────────────────────────────────
    function cargarObservaciones(id_material) {
      fetch(API + '?action=listar_observaciones&id_material=' + id_material)
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error', 'error'); return; }
          allObservaciones = res.data || [];
          document.getElementById('obsPlaceholder').style.display = 'none';
          document.getElementById('obsTableWrap').style.display   = '';
          renderObservaciones();
        })
        .catch(function () { showNotif('Error de red', 'error'); });
    }

    function renderObservaciones() {
      var tbody = document.getElementById('tblObservacionesBody');
      if (!allObservaciones.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="3">Sin observaciones. Agrega la primera.</td></tr>';
        return;
      }
      var html = '';
      allObservaciones.forEach(function (r) {
        var badge = r.activo == 1 ? '<span class="badge-activo">Activo</span>' : '<span class="badge-inactivo">Inactivo</span>';
        html += '<tr>'
          + '<td>' + escHtml(r.nombre) + '</td>'
          + '<td>' + badge + '</td>'
          + '<td style="white-space:nowrap">'
          +   '<button class="btn-mcc btn-mcc-warning btn-sm" data-action="edit-obs" data-id="' + r.id + '" title="Editar"><i class="fa fa-edit"></i></button> '
          +   '<button class="btn-mcc btn-mcc-danger btn-sm" data-action="del-obs" data-id="' + r.id + '" data-nombre="' + escAttr(r.nombre) + '" title="Eliminar"><i class="fa fa-trash"></i></button>'
          + '</td>'
          + '</tr>';
      });
      tbody.innerHTML = html;
    }

    function resetObsPanel() {
      document.getElementById('obsPlaceholder').style.display = 'flex';
      document.getElementById('obsTableWrap').style.display   = 'none';
      document.getElementById('obsSubtitle').style.display    = 'none';
      document.getElementById('btnNuevaObservacion').disabled = true;
      allObservaciones = [];
    }

    function abrirModalObservacion(id) {
      var o = id ? allObservaciones.find(function (x) { return x.id == id; }) : null;
      document.getElementById('obsId').value         = o ? o.id     : '';
      document.getElementById('obsNombre').value     = o ? o.nombre : '';
      document.getElementById('obsActivo').value     = o ? o.activo : 1;
      document.getElementById('obsIdMaterial').value = selectedMatId || '';
      document.getElementById('modalObsTitulo').textContent = id ? 'Editar observación' : 'Nueva observación';
      abrirModal('modalObservacion');
    }

    function guardarObservacion() {
      var id         = document.getElementById('obsId').value;
      var idMaterial = document.getElementById('obsIdMaterial').value;
      var nombre     = document.getElementById('obsNombre').value.trim();
      var activo     = document.getElementById('obsActivo').value;

      if (!nombre) { showNotif('Ingresa la descripción de la observación.', 'warning'); return; }

      var payload = { id_material: parseInt(idMaterial), nombre: nombre, activo: parseInt(activo) };
      if (id) payload.id = parseInt(id);

      var btnGuardar = document.getElementById('btnGuardarObservacion');
      btnGuardar.disabled = true;

      fetch(API + '?action=guardar_observacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          btnGuardar.disabled = false;
          if (!res.success) { showNotif(res.mensaje || 'Error al guardar', 'error'); return; }
          cerrarModal('modalObservacion');
          showNotif('Observación guardada.', 'success');
          cargarObservaciones(idMaterial);
        })
        .catch(function () { btnGuardar.disabled = false; showNotif('Error de red', 'error'); });
    }

    function eliminarObservacion(id) {
      fetch(API + '?action=eliminar_observacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) { showNotif(res.mensaje || 'Error al eliminar', 'error'); return; }
          showNotif('Observación eliminada.', 'success');
          cargarObservaciones(selectedMatId);
        })
        .catch(function () { showNotif('Error de red', 'error'); });
    }

    // ── Helpers ──────────────────────────────────────────────────────
    function confirmarEliminar(msg, cb) {
      document.getElementById('confirmMsg').textContent = msg;
      confirmCallback = cb;
      abrirModal('confirmOverlay');
    }
    function abrirModal(id)  { document.getElementById(id).classList.add('open'); }
    function cerrarModal(id) { document.getElementById(id).classList.remove('open'); }

    function showNotif(msg, type, ms) {
      var bar = document.getElementById('notifBar');
      bar.textContent = msg;
      bar.className   = 'notif-bar notif-' + (type || 'info');
      bar.style.display = 'block';
      clearTimeout(bar._t);
      bar._t = setTimeout(function () { bar.style.display = 'none'; }, ms || 3500);
    }

    function escHtml(s) {
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function escAttr(s) {
      return String(s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

  })();
  </script>
</body>
</html>
