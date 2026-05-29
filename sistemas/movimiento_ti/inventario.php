<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Inventario de Equipos TI – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: 'Roboto', Arial, sans-serif; background: #f4f8fb; margin: 0; min-height: 100vh; }

    /* ── Cabecera ── */
    .ti-header {
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
    .ti-header-title { font-size: 1.3rem; font-weight: 700; letter-spacing: 0.5px; }
    .ti-header-sub   { font-size: 0.9rem; opacity: 0.88; }
    .ti-header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

    /* ── Barra de herramientas ── */
    .ti-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      padding: 14px 28px;
      background: #fff;
      border-bottom: 1px solid #e0eaef;
    }

    /* ── Botones principales ── */
    .btn-ti {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: 7px;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.18s, box-shadow 0.18s;
    }
    .btn-ti-primary   { background: #1fa9a0; color: #fff; }
    .btn-ti-primary:hover { background: #17857e; }
    .btn-ti-secondary { background: #3498db; color: #fff; }
    .btn-ti-secondary:hover { background: #2176ae; }
    .btn-ti-warning   { background: #e67e22; color: #fff; }
    .btn-ti-warning:hover { background: #cf6d17; }
    .btn-ti-danger    { background: #e74c3c; color: #fff; }
    .btn-ti-danger:hover { background: #c0392b; }
    .btn-ti-back      { background: #6c757d; color: #fff; }
    .btn-ti-back:hover { background: #545b62; }

    /* ── Badge estado ── */
    .badge-estado {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .badge-EN-ALMACEN         { background: #d4edda; color: #155724; }
    .badge-ASIGNADO           { background: #cce5ff; color: #004085; }
    .badge-PENDIENTE-SOPORTE  { background: #fff3cd; color: #856404; }
    .badge-EN-SOPORTE-TECNICO { background: #f8d7da; color: #721c24; }
    .badge-DE-BAJA            { background: #e2e3e5; color: #383d41; }

    /* ── Contenedor principal ── */
    .ti-content { padding: 24px 28px; }

    /* ── Grid container ── */
    #gridInventario { width: 100%; }

    /* ── Modal overlay ── */
    .ti-modal-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .ti-modal-overlay.open { display: flex; }
    .ti-modal {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      padding: 28px 32px;
      width: 100%;
      max-width: 620px;
      max-height: 92vh;
      overflow-y: auto;
      position: relative;
    }
    .ti-modal-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1fa9a0;
      margin-bottom: 20px;
    }
    .ti-modal-close {
      position: absolute; top: 14px; right: 18px;
      background: none; border: none; font-size: 1.4rem;
      cursor: pointer; color: #888;
    }
    .ti-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 20px;
    }
    .ti-form-grid .full { grid-column: 1 / -1; }
    .ti-field label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 4px;
    }
    .ti-field input,
    .ti-field select,
    .ti-field textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #cdd6e0;
      border-radius: 7px;
      font-size: 0.93rem;
      font-family: inherit;
      box-sizing: border-box;
      transition: border 0.15s;
    }
    .ti-field input:focus,
    .ti-field select:focus,
    .ti-field textarea:focus {
      outline: none;
      border-color: #1fa9a0;
    }
    .ti-field textarea { resize: vertical; min-height: 60px; }
    .ti-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 22px;
    }

    /* ── Panel historial ── */
    #panelHistorial { display: none; margin-top: 24px; }
    .historial-title { font-size: 1rem; font-weight: 700; color: #1fa9a0; margin-bottom: 10px; }

    @media (max-width: 600px) {
      .ti-content { padding: 12px; }
      .ti-toolbar { padding: 10px 12px; }
      .ti-header   { padding: 12px; }
      .ti-form-grid { grid-template-columns: 1fr; }
    }

    /* ── Tabla nativa ── */
    .ti-table-wrapper { width: 100%; overflow-x: auto; border-radius: 10px; box-shadow: 0 1px 8px rgba(31,169,160,0.07); }
    #tblInventario { width: 100%; border-collapse: collapse; font-size: 0.88rem; background: #fff; }
    #tblInventario thead th {
      background: #1fa9a0; color: #fff;
      padding: 11px 13px; text-align: left; white-space: nowrap;
      position: relative; user-select: none; font-weight: 600;
    }
    #tblInventario thead th.sortable { cursor: pointer; }
    #tblInventario thead th.sortable:hover { background: #179890; }
    #tblInventario tbody tr:nth-child(even) { background: #f8fefe; }
    #tblInventario tbody tr:hover { background: #e6f9f7; cursor: pointer; }
    #tblInventario tbody td { padding: 9px 13px; border-bottom: 1px solid #e8f0ee; vertical-align: middle; white-space: nowrap; max-width: 220px; overflow: hidden; text-overflow: ellipsis; }
    /* ── Historial ── */
    #panelHistorial { display: none; margin-top: 28px; }
    .historial-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .historial-title { font-size: 1rem; font-weight: 700; color: #1fa9a0; }
    #tblHistorial { width: 100%; border-collapse: collapse; font-size: 0.85rem; background: #fff; }
    #tblHistorial thead th { background: #e8f8f7; color: #17857e; padding: 8px 11px; text-align: left; white-space: nowrap; font-weight: 600; border-bottom: 2px solid #1fa9a0; }
    #tblHistorial tbody td { padding: 7px 11px; border-bottom: 1px solid #e8f0ee; white-space: nowrap; }
    #tblHistorial tbody tr:hover { background: #f4fdfc; }
    /* ── Controles de Grid ── */
    .ti-grid-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 14px 0 10px 0; }
    .ti-search { padding: 8px 12px; border: 1px solid #cdd6e0; border-radius: 7px; font-size: 0.9rem; width: 260px; font-family: inherit; }
    .ti-search:focus { outline: none; border-color: #1fa9a0; }
    .ti-pagination { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #555; }
    .ti-pagination select { padding: 5px 8px; border-radius: 5px; border: 1px solid #cdd6e0; font-family: inherit; }
    .btn-sm { padding: 5px 11px !important; font-size: 0.8rem !important; border-radius: 5px !important; }
    /* ── Filtros por columna ── */
    .cf-btn { background: none; border: none; color: rgba(255,255,255,0.85); cursor: pointer; padding: 0 0 0 5px; font-size: 0.75rem; vertical-align: middle; }
    .cf-btn:hover, .cf-btn.active { color: #fff; }
    .cf-badge { display: none; background: #e74c3c; color: #fff; border-radius: 10px; font-size: 0.68rem; padding: 1px 5px; margin-left: 3px; vertical-align: middle; }
    /* ── Notificación ── */
    .notif-bar { display: none; padding: 10px 16px; border-radius: 8px; margin-bottom: 12px; font-weight: 600; font-size: 0.9rem; }
    .notif-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .notif-error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .notif-warning { background: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
    .notif-info    { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    /* Accesorios checkboxes */
    .accesorios-checks { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 6px; }
    .accesorios-checks label { display: flex; align-items: center; gap: 7px; font-size: 0.9rem; font-weight: 500; color: #333; cursor: pointer; }
    .accesorios-checks input[type="checkbox"] { width: 16px; height: 16px; accent-color: #1fa9a0; cursor: pointer; }
    /* ── Badge movimiento (historial) ── */
    .badge-mov { display: inline-block; padding: 3px 9px; border-radius: 12px; font-size: 0.78rem; font-weight: 700; }
    .badge-ASIGNACION          { background: #cce5ff; color: #004085; }
    .badge-DEVOLUCION           { background: #d4edda; color: #155724; }
    .badge-TRASLADO             { background: #fff3cd; color: #856404; }
    .badge-MANTENIMIENTO        { background: #f8d7da; color: #721c24; }
    .badge-RETORNO-MANTENIMIENTO { background: #d1ecf1; color: #0c5460; }
    .badge-BAJA                 { background: #e2e3e5; color: #383d41; }
  </style>
</head>
<body>

  <!-- Cabecera -->
  <div class="ti-header">
    <div>
      <div class="ti-header-title"><i class="fa fa-desktop"></i> &nbsp;Inventario de Equipos TI</div>
      <div class="ti-header-sub">CAMPO ANDINO – Gestión de activos tecnológicos</div>
    </div>
    <div class="ti-header-actions">
      <button class="btn-ti btn-ti-back" onclick="window.location.href='../../public/panel.html'">
        <i class="fa fa-arrow-left"></i> Panel
      </button>
    </div>
  </div>

  <!-- Barra de herramientas -->
  <div class="ti-toolbar">
    <button class="btn-ti btn-ti-primary" id="btnNuevoEquipo">
      <i class="fa fa-plus"></i> Nuevo equipo
    </button>
    <button class="btn-ti btn-ti-secondary" onclick="window.location.href='registro_movimiento.php'">
      <i class="fa fa-exchange-alt"></i> Ir a Movimientos
    </button>
  </div>

  <!-- Contenido principal -->
  <div class="ti-content">

    <!-- Controles -->
    <div class="ti-grid-controls">
      <input type="text" class="ti-search" id="searchInput" placeholder="&#128269; Buscar en todos los campos..." />
      <div class="ti-pagination">
        <label>Mostrar
          <select id="pageSizeSelect">
            <option value="10">10</option>
            <option value="25" selected>25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          por página
        </label>
        <button class="btn-ti btn-ti-back btn-sm" id="prevPage">&#9664;</button>
        <span id="pageInfo" style="white-space:nowrap">&#160;</span>
        <button class="btn-ti btn-ti-back btn-sm" id="nextPage">&#9654;</button>
      </div>
      <button class="btn-ti btn-ti-back btn-sm" id="btnLimpiarFiltros">&#10005; Limpiar filtros</button>
    </div>

    <!-- Barra de notificación -->
    <div class="notif-bar" id="notifBar"></div>

    <!-- Tabla inventario -->
    <div class="ti-table-wrapper">
      <table id="tblInventario">
        <thead><tr></tr></thead>
        <tbody id="tblInventarioBody">
          <tr><td colspan="10" style="text-align:center;padding:28px;color:#888">Cargando...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Panel historial -->
    <div id="panelHistorial">
      <div class="historial-header">
        <div class="historial-title"><i class="fa fa-history"></i> Historial de movimientos &#8211; <span id="lblEquipoHistorial"></span></div>
        <button class="btn-ti btn-ti-back btn-sm" onclick="document.getElementById('panelHistorial').style.display='none'">&#10005; Cerrar</button>
      </div>
      <div class="ti-table-wrapper">
        <table id="tblHistorial">
          <thead>
            <tr>
              <th>Fecha</th><th>Movimiento</th><th>Receptor</th><th>Cargo</th>
              <th>&#193;rea</th><th>Ubicaci&#243;n</th><th>Accesorios</th><th>Observaciones</th><th>Registrado por</th>
            </tr>
          </thead>
          <tbody id="tblHistorialBody">
            <tr><td colspan="9" style="text-align:center;padding:16px;color:#888">Selecciona un equipo para ver su historial.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <!-- ── MODAL Formulario Equipo ── -->
  <div class="ti-modal-overlay" id="modalEquipo">
    <div class="ti-modal">
      <button class="ti-modal-close" id="btnCerrarModal" title="Cerrar">&times;</button>
      <div class="ti-modal-title" id="modalEquipoTitulo">Nuevo equipo</div>
      <input type="hidden" id="fldId" />
      <div class="ti-form-grid">
        <div class="ti-field">
          <label>N° Inventario</label>
          <input type="text" id="fldNInventario" placeholder="TI-LAP-001" />
        </div>
        <div class="ti-field">
          <label>Tipo <span style="color:red">*</span></label>
          <select id="fldTipo"></select>
        </div>
        <div class="ti-field">
          <label>Marca <span style="color:red">*</span></label>
          <input type="text" id="fldMarca" />
        </div>
        <div class="ti-field">
          <label>Modelo <span style="color:red">*</span></label>
          <input type="text" id="fldModelo" />
        </div>
        <div class="ti-field">
          <label>N° Serie</label>
          <input type="text" id="fldNSerie" />
        </div>
        <div class="ti-field">
          <label>PIN / Contraseña BIOS</label>
          <input type="text" id="fldPin" />
        </div>
        <div class="ti-field">
          <label>Ubicación</label>
          <input type="text" id="fldUbicacion" />
        </div>
        <div class="ti-field">
          <label>Estado</label>
          <select id="fldEstado"></select>
        </div>
        <div class="ti-field">
          <label>Correo corporativo</label>
          <input type="email" id="fldCorreo" />
        </div>
        <div class="ti-field">
          <label>Contraseña correo</label>
          <input type="text" id="fldContrasena" />
        </div>
        <div class="ti-field full">
          <label>Accesorios incluidos</label>
          <div class="accesorios-checks">
            <label><input type="checkbox" name="fldAccesorio" value="CARGADOR"> CARGADOR</label>
            <label><input type="checkbox" name="fldAccesorio" value="MOUSE"> MOUSE</label>
            <label><input type="checkbox" name="fldAccesorio" value="TECLADO"> TECLADO</label>
            <label><input type="checkbox" name="fldAccesorio" value="PAD MOUSE"> PAD MOUSE</label>
            <label><input type="checkbox" name="fldAccesorio" value="AURICULARES"> AURICULARES</label>
          </div>
        </div>
        <div class="ti-field full">
          <label>Observaciones</label>
          <textarea id="fldObservaciones"></textarea>
        </div>
      </div>
      <div class="ti-modal-footer">
        <button class="btn-ti btn-ti-back" id="btnCancelarModal">Cancelar</button>
        <button class="btn-ti btn-ti-primary" id="btnGuardarEquipo"><i class="fa fa-save"></i> Guardar</button>
      </div>
    </div>
  </div>

  <script src="inventario.js"></script>
</body>
</html>
