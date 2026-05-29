<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Registro de Movimientos TI – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: 'Roboto', Arial, sans-serif; background: #f4f8fb; margin: 0; min-height: 100vh; }

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

    .ti-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      padding: 14px 28px;
      background: #fff;
      border-bottom: 1px solid #e0eaef;
    }

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
    .btn-ti-success   { background: #27ae60; color: #fff; }
    .btn-ti-success:hover { background: #1e8449; }
    .btn-ti-warning   { background: #e67e22; color: #fff; }
    .btn-ti-warning:hover { background: #cf6d17; }
    .btn-ti-back      { background: #6c757d; color: #fff; }
    .btn-ti-back:hover { background: #545b62; }
    .btn-ti-acta      { background: #8e44ad; color: #fff; }
    .btn-ti-acta:hover { background: #6c3483; }

    /* Badge tipo movimiento */
    .badge-mov {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .badge-ASIGNACION          { background: #cce5ff; color: #004085; }
    .badge-DEVOLUCION           { background: #d4edda; color: #155724; }
    .badge-TRASLADO             { background: #fff3cd; color: #856404; }
    .badge-MANTENIMIENTO        { background: #f8d7da; color: #721c24; }
    .badge-RETORNO-MANTENIMIENTO { background: #d1ecf1; color: #0c5460; }
    .badge-BAJA                 { background: #e2e3e5; color: #383d41; }

    .ti-content { padding: 24px 28px; }
    #gridMovimientos { width: 100%; }

    /* Modal */
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
      max-width: 680px;
      max-height: 94vh;
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
    /* Separador de sección dentro del form */
    .ti-section-label {
      grid-column: 1 / -1;
      font-size: 0.8rem;
      font-weight: 700;
      color: #1fa9a0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e0eaef;
      padding-bottom: 4px;
      margin-top: 4px;
    }
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
    .ti-field textarea:focus { outline: none; border-color: #1fa9a0; }
    .ti-field textarea { resize: vertical; min-height: 60px; }

    .ti-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 22px;
      flex-wrap: wrap;
    }

    /* Info banner del equipo seleccionado */
    #equipoInfoBanner {
      display: none;
      background: #e8f8f7;
      border: 1px solid #1fa9a0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 14px;
      font-size: 0.9rem;
      color: #17857e;
      grid-column: 1 / -1;
    }

    @media (max-width: 600px) {
      .ti-content { padding: 12px; }
      .ti-toolbar { padding: 10px 12px; }
      .ti-header   { padding: 12px; }
      .ti-form-grid { grid-template-columns: 1fr; }
    }

    /* ── Tabla nativa ───────────────────────────────────────────── */
    .table-wrap { overflow-x: auto; }
    #tblMovimientos { width: 100%; border-collapse: collapse; font-size: 0.87rem; background: #fff; }
    #tblMovimientos thead th {
      background: #1fa9a0; color: #fff; padding: 10px 10px; text-align: left;
      white-space: nowrap; user-select: none; position: sticky; top: 0; z-index: 2;
    }
    #tblMovimientos thead th.sortable { cursor: pointer; }
    #tblMovimientos thead th.sortable:hover { background: #17857e; }
    #tblMovimientos tbody tr:nth-child(even) { background: #f4fffe; }
    #tblMovimientos tbody tr:hover { background: #d8f3f1; }
    #tblMovimientos tbody td { padding: 8px 10px; border-bottom: 1px solid #e8f0ef; vertical-align: middle; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .btn-sm { padding: 4px 9px !important; font-size: 0.78rem !important; }
    /* Badge estado equipo */
    .badge-estado { display: inline-block; padding: 3px 9px; border-radius: 12px; font-size: 0.78rem; font-weight: 700; }
    .badge-EN-ALMACEN        { background: #d4edda; color: #155724; }
    .badge-ASIGNADO          { background: #cce5ff; color: #004085; }
    .badge-PENDIENTE-SOPORTE { background: #fff3cd; color: #856404; }
    .badge-EN-SOPORTE-TECNICO { background: #f8d7da; color: #721c24; }
    .badge-DE-BAJA           { background: #e2e3e5; color: #383d41; }
    /* Controles de grid */
    .grid-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 10px 0 14px; }
    .search-input { padding: 7px 12px; border: 1px solid #cdd6e0; border-radius: 7px; font-size: 0.9rem; min-width: 220px; outline: none; transition: border 0.15s; }
    .search-input:focus { border-color: #1fa9a0; }
    .pagination-bar { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
    .pagination-bar select { padding: 6px 8px; border: 1px solid #cdd6e0; border-radius: 7px; font-size: 0.88rem; }
    #pageInfo { font-size: 0.85rem; color: #555; min-width: 160px; }
    /* Column filter dropdown */
    .cf-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.85); font-size: 0.72rem; padding: 0 3px; margin-left: 4px; vertical-align: middle; }
    .cf-btn.active { color: #ffe066; }
    .cf-badge { background: #ffe066; color: #333; border-radius: 50%; font-size: 0.68rem; padding: 1px 4px; font-weight: 700; display: none; margin-left: 2px; }
    /* Notificación */
    .notif-bar { display: none; position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); padding: 11px 26px; border-radius: 9px; font-size: 0.95rem; font-weight: 600; z-index: 9999; box-shadow: 0 4px 18px rgba(0,0,0,0.16); }
    .notif-success { background: #27ae60; color: #fff; }
    .notif-error   { background: #e74c3c; color: #fff; }
    .notif-warning { background: #f39c12; color: #fff; }
    .notif-info    { background: #2980b9; color: #fff; }
    /* Accesorios checkboxes */
    .accesorios-checks { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 6px; }
    .accesorios-checks label { display: flex; align-items: center; gap: 7px; font-size: 0.9rem; font-weight: 500; color: #333; cursor: pointer; }
    .accesorios-checks input[type="checkbox"] { width: 16px; height: 16px; accent-color: #1fa9a0; cursor: pointer; }
  </style>
</head>
<body>

  <!-- Cabecera -->
  <div class="ti-header">
    <div>
      <div class="ti-header-title"><i class="fa fa-exchange-alt"></i> &nbsp;Registro de Movimientos TI</div>
      <div class="ti-header-sub">CAMPO ANDINO – Historial de asignaciones y cambios de equipos</div>
    </div>
    <div class="ti-header-actions">
      <button class="btn-ti btn-ti-secondary" onclick="window.location.href='inventario.php'">
        <i class="fa fa-desktop"></i> Inventario
      </button>
      <button class="btn-ti btn-ti-back" onclick="window.location.href='../../public/panel.html'">
        <i class="fa fa-arrow-left"></i> Panel
      </button>
    </div>
  </div>

  <!-- Barra de herramientas -->
  <div class="ti-toolbar">
    <button class="btn-ti btn-ti-primary" id="btnNuevoMovimiento">
      <i class="fa fa-plus"></i> Nuevo movimiento
    </button>
  </div>

  <!-- Grid de movimientos -->
  <div class="ti-content">
    <div class="grid-controls">
      <input type="text" id="searchInput" class="search-input" placeholder="&#128269; Buscar en todos los campos...">
      <div class="pagination-bar">
        <select id="pageSizeSelect">
          <option value="25">25 / pág</option>
          <option value="50">50 / pág</option>
          <option value="100">100 / pág</option>
          <option value="9999">Todo</option>
        </select>
        <button class="btn-ti btn-ti-back btn-sm" id="prevPage">&#8249;</button>
        <span id="pageInfo">Página 1 de 1</span>
        <button class="btn-ti btn-ti-back btn-sm" id="nextPage">&#8250;</button>
        <button class="btn-ti btn-ti-back btn-sm" id="btnLimpiarFiltros" title="Limpiar todos los filtros">
          <i class="fa fa-times"></i> Limpiar filtros
        </button>
      </div>
    </div>
    <div class="table-wrap">
      <table id="tblMovimientos">
        <thead><tr></tr></thead>
        <tbody id="tblMovimientosBody"></tbody>
      </table>
    </div>
  </div>

  <!-- ── MODAL Formulario Movimiento ── -->
  <div class="ti-modal-overlay" id="modalMovimiento">
    <div class="ti-modal">
      <button class="ti-modal-close" id="btnCerrarModalMov" title="Cerrar">&times;</button>
      <div class="ti-modal-title" id="modalMovTitulo">Nuevo movimiento</div>
      <input type="hidden" id="mfldId" />

      <div class="ti-form-grid">

        <!-- Sección: Movimiento -->
        <div class="ti-section-label">Datos del movimiento</div>

        <div class="ti-field">
          <label>Tipo de movimiento <span style="color:red">*</span></label>
          <select id="mfldTipoMovimiento"></select>
        </div>
        <div class="ti-field">
          <label>Fecha <span style="color:red">*</span></label>
          <input type="date" id="mfldFecha" />
        </div>

        <!-- Sección: Equipo -->
        <div class="ti-section-label">Equipo</div>

        <div class="ti-field full">
          <label>Seleccionar equipo del inventario (opcional)</label>
          <select id="mfldEquipoSelector">
            <option value="">-- Seleccionar equipo --</option>
          </select>
        </div>

        <div id="equipoInfoBanner"></div>

        <div class="ti-field">
          <label>N° Inventario</label>
          <input type="text" id="mfldNInventario" />
        </div>
        <div class="ti-field">
          <label>Tipo equipo</label>
          <select id="mfldTipoEquipo"></select>
        </div>
        <div class="ti-field">
          <label>Marca <span style="color:red">*</span></label>
          <input type="text" id="mfldMarca" />
        </div>
        <div class="ti-field">
          <label>Modelo <span style="color:red">*</span></label>
          <input type="text" id="mfldModelo" />
        </div>
        <div class="ti-field">
          <label>N° Serie</label>
          <input type="text" id="mfldNSerie" />
        </div>
        <div class="ti-field">
          <label>Pin</label>
          <input type="text" id="mfldPin" />
        </div>
        <div class="ti-field">
          <label>Ubicación</label>
          <select id="mfldUbicacion">
            <option value="">-- Seleccionar --</option>
            <option value="CAMPO ANDINO (ICA)">CAMPO ANDINO (ICA)</option>
            <option value="CAMPO ANDINO (LIMA)">CAMPO ANDINO (LIMA)</option>
          </select>
        </div>
        <div class="ti-field">
          <label>Correo corporativo</label>
          <input type="email" id="mfldCorreo" />
        </div>
        <div class="ti-field">
          <label>Contraseña correo</label>
          <input type="text" id="mfldContrasena" />
        </div>
        <div class="ti-field full">
          <label>Accesorios entregados</label>
          <div class="accesorios-checks">
            <label><input type="checkbox" name="accesorio" value="CARGADOR"> CARGADOR</label>
            <label><input type="checkbox" name="accesorio" value="MOUSE"> MOUSE</label>
            <label><input type="checkbox" name="accesorio" value="TECLADO"> TECLADO</label>
            <label><input type="checkbox" name="accesorio" value="PAD MOUSE"> PAD MOUSE</label>
            <label><input type="checkbox" name="accesorio" value="AURICULARES"> AURICULARES</label>
          </div>
        </div>

        <!-- Sección: Usuario receptor -->
        <div class="ti-section-label">Usuario receptor</div>

        <div class="ti-field full">
          <label>Seleccionar usuario del sistema (opcional)</label>
          <select id="mfldUsuarioSelector">
            <option value="">-- Seleccionar usuario --</option>
          </select>
        </div>

        <div class="ti-field full">
          <label>Nombre completo <span style="color:red">*</span></label>
          <input type="text" id="mfldUsuario" />
        </div>
        <div class="ti-field">
          <label>Cargo</label>
          <input type="text" id="mfldCargo" />
        </div>
        <div class="ti-field">
          <label>Área</label>
          <input type="text" id="mfldArea" />
        </div>

        <!-- Observaciones -->
        <div class="ti-section-label">Observaciones</div>
        <div class="ti-field full">
          <label>Observaciones</label>
          <textarea id="mfldObservaciones"></textarea>
        </div>

      </div>

      <div class="ti-modal-footer">
        <button class="btn-ti btn-ti-back" id="btnCancelarModalMov">Cancelar</button>
        <!-- Botón acta de entrega: visible solo en movimientos de Asignación (stanby hasta implementación) -->
        <button class="btn-ti btn-ti-acta" id="btnGenerarActa" style="display:none;" title="Ver / firmar acta de entrega">
          <i class="fa fa-file-signature"></i> Acta de entrega
        </button>
        <button class="btn-ti btn-ti-primary" id="btnGuardarMovimiento">
          <i class="fa fa-save"></i> Guardar
        </button>
      </div>
    </div>
  </div>

  <div class="notif-bar" id="notifBar"></div>
  <script src="registro_movimiento.js"></script>
</body>
</html>
