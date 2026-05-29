<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Maestro de Activos – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="shared/estilos.css">
  <style>
    body { font-family: 'Roboto', Arial, sans-serif; background: #f4f8fb; margin: 0; min-height: 100vh; }

    /* ── Cabecera ── */
    .ca-header {
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
    .ca-header-title { font-size: 1.3rem; font-weight: 700; letter-spacing: 0.5px; }
    .ca-header-sub   { font-size: 0.9rem; opacity: 0.88; }
    .ca-header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

    /* ── Barra de herramientas ── */
    .ca-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      padding: 14px 28px;
      background: #fff;
      border-bottom: 1px solid #e0eaef;
    }

    /* ── Botones ── */
    .btn-ca {
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
    .btn-ca-primary   { background: #1fa9a0; color: #fff; }
    .btn-ca-primary:hover { background: #17857e; }
    .btn-ca-secondary { background: #3498db; color: #fff; }
    .btn-ca-secondary:hover { background: #2176ae; }
    .btn-ca-success   { background: #27ae60; color: #fff; }
    .btn-ca-success:hover { background: #1e8449; }
    .btn-ca-warning   { background: #e67e22; color: #fff; }
    .btn-ca-warning:hover { background: #cf6d17; }
    .btn-ca-danger    { background: #e74c3c; color: #fff; }
    .btn-ca-danger:hover { background: #c0392b; }
    .btn-ca-back      { background: #6c757d; color: #fff; }
    .btn-ca-back:hover { background: #545b62; }
    .btn-sm { padding: 5px 11px !important; font-size: 0.8rem !important; border-radius: 5px !important; }

    /* ── Badges estado ── */
    .badge-estado {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .badge-OPERATIVO           { background: #d4edda; color: #155724; }
    .badge-EN_MANTENIMIENTO    { background: #fff3cd; color: #856404; }
    .badge-INOPERATIVO         { background: #f8d7da; color: #721c24; }
    .badge-DE_BAJA             { background: #e2e3e5; color: #383d41; }
    /* ── Select de filtro por tipo ── */
    .ca-filter-tipo {
      padding: 8px 12px;
      border: 1px solid #cdd6e0;
      border-radius: 7px;
      font-size: 0.9rem;
      font-family: inherit;
      background: #fff;
      min-width: 140px;
    }
    .ca-filter-tipo:focus { outline: none; border-color: #1fa9a0; }
    /* ── Controles de Grid ── */
    .ca-grid-controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      padding: 14px 28px 10px 28px;
      background: #fff;
    }
    .ca-search {
      padding: 8px 12px;
      border: 1px solid #cdd6e0;
      border-radius: 7px;
      font-size: 0.9rem;
      width: 260px;
      font-family: inherit;
    }
    .ca-search:focus { outline: none; border-color: #1fa9a0; }
    .ca-pagination {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88rem;
      color: #555;
      margin-left: auto;
    }
    .ca-pagination select {
      padding: 5px 8px;
      border-radius: 5px;
      border: 1px solid #cdd6e0;
      font-family: inherit;
    }

    /* ── Contenedor principal ── */
    .ca-content { padding: 0 28px 24px 28px; }

    /* ── Tabla nativa ── */
    .ca-table-wrapper {
      width: 100%;
      overflow-x: auto;
      border-radius: 10px;
      box-shadow: 0 1px 8px rgba(31,169,160,0.07);
      background: #fff;
    }
    #tblActivos {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      background: #fff;
    }
    #tblActivos thead th {
      background: #1fa9a0;
      color: #fff;
      padding: 11px 13px;
      text-align: left;
      white-space: nowrap;
      position: relative;
      user-select: none;
      font-weight: 600;
    }
    #tblActivos thead th.sortable { cursor: pointer; }
    #tblActivos thead th.sortable:hover { background: #179890; }
    #tblActivos tbody tr:nth-child(even) { background: #f8fefe; }
    #tblActivos tbody tr:hover { background: #e6f9f7; cursor: pointer; }
    #tblActivos tbody td {
      padding: 9px 13px;
      border-bottom: 1px solid #e8f0ee;
      vertical-align: middle;
      white-space: nowrap;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Modal ── */
    .ca-modal-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .ca-modal-overlay.open { display: flex; }
    .ca-modal {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      padding: 28px 32px;
      width: 100%;
      max-width: 720px;
      max-height: 94vh;
      overflow-y: auto;
      position: relative;
    }
    .ca-modal h3 { margin: 0 0 18px 0; color: #1fa9a0; font-size: 1.2rem; }
    .ca-modal-close {
      position: absolute; top: 14px; right: 18px;
      background: none; border: none; font-size: 1.6rem;
      cursor: pointer; color: #888; transition: color 0.15s;
    }
    .ca-modal-close:hover { color: #e74c3c; }

    .ca-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 20px;
    }
    .ca-form-grid .full-width { grid-column: 1 / -1; }
    .ca-form-grid label {
      display: block;
      font-weight: 600;
      font-size: 0.85rem;
      color: #444;
      margin-bottom: 3px;
    }
    .ca-form-grid input,
    .ca-form-grid select,
    .ca-form-grid textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #d0dbe3;
      border-radius: 6px;
      font-size: 0.92rem;
      box-sizing: border-box;
      transition: border 0.15s;
    }
    .ca-form-grid input:focus,
    .ca-form-grid select:focus,
    .ca-form-grid textarea:focus {
      border-color: #1fa9a0;
      outline: none;
      box-shadow: 0 0 0 2px rgba(31,169,160,0.15);
    }
    .ca-form-grid textarea { resize: vertical; min-height: 60px; }

    /* ── Resaltar controles con valor ── */
    .ca-form-grid .has-value {
      border-color: #27ae60 !important;
      background-color: #f0faf4 !important;
    }
    .ca-form-grid select.has-value {
      background-color: #f0faf4 !important;
    }

    .ca-modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid #e8eef3;
    }

    /* ── Notificación ── */
    .notif-bar {
      display: none;
      padding: 10px 16px;
      border-radius: 8px;
      margin: 0 28px 12px 28px;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .notif-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .notif-error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

    /* ── Foto Upload ── */
    .foto-upload-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .foto-upload-area {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: 1px solid #c0d0db;
      border-radius: 6px;
      background: #f5f8fa;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      color: #4a5a6a;
      font-size: 0.85rem;
      white-space: nowrap;
    }
    .foto-upload-area:hover { border-color: #1fa9a0; background: #e8f4f4; }
    .foto-upload-area i { font-size: 1.1rem; color: #1fa9a0; }
    .foto-upload-area.has-file { border-color: #27ae60; background: #eafaf1; }
    .foto-preview {
      position: relative;
      display: inline-block;
      flex-shrink: 0;
    }
    .foto-preview img {
      max-width: 100%;
      max-height: 60px;
      border-radius: 4px;
      border: 1px solid #e0eaef;
      object-fit: contain;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .foto-preview img:hover { opacity: 0.8; }
    .foto-preview .btn-ca-danger.btn-sm {
      position: absolute;
      top: -8px;
      right: -8px;
      border-radius: 50% !important;
      width: 20px;
      height: 20px;
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
    }
    .foto-nombre-archivo {
      font-size: 0.8rem;
      color: #4a5a6a;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ── Lightbox ── */
    .ca-lightbox-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .ca-lightbox-overlay.open { display: flex; }
    .ca-lightbox-overlay img {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: 8px;
      box-shadow: 0 4px 40px rgba(0,0,0,0.5);
      object-fit: contain;
      cursor: default;
    }
    .ca-lightbox-close {
      position: absolute;
      top: 20px;
      right: 30px;
      background: rgba(0,0,0,0.5);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 1.6rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    .ca-lightbox-close:hover { background: rgba(0,0,0,0.8); }

    @media (max-width: 700px) {
      .ca-header { padding: 10px 14px; }
      .ca-toolbar { padding: 10px 14px; }
      .ca-grid-controls { padding: 10px 14px; flex-direction: column; align-items: stretch; }
      .ca-search { width: 100%; }
      .ca-pagination { margin-left: 0; justify-content: center; }
      .ca-content { padding: 0 14px 14px 14px; }
      .ca-modal { padding: 18px; max-width: 100%; margin: 10px; }
      .ca-form-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="ca-header">
    <div>
      <div class="ca-header-title"><i class="fas fa-truck"></i> Maestro de Activos</div>
      <div class="ca-header-sub">Cadena de Suministros – Control de Activos</div>
    </div>
    <div class="ca-header-actions">
      <button class="btn-ca btn-ca-back" onclick="window.location.href='launcher.php'">
        <i class="fas fa-arrow-left"></i> Volver al Launcher
      </button>
    </div>
  </div>

  <!-- TOOLBAR -->
  <div class="ca-toolbar">
    <button class="btn-ca btn-ca-primary" id="btnNuevoActivo">
      <i class="fas fa-plus"></i> Nuevo Activo
    </button>
    <button class="btn-ca btn-ca-secondary" id="btnRefrescar">
      <i class="fas fa-sync-alt"></i> Refrescar
    </button>
  </div>

  <!-- NOTIFICACIÓN -->
  <div class="notif-bar" id="notifBar"></div>

  <!-- CONTROLES DE GRID -->
  <div class="ca-grid-controls">
    <select class="ca-filter-tipo" id="selFiltrarTipo">
      <option value="">Todos los tipos</option>
      <option value="CAMION">Camión</option>
      <option value="CAMIONETA">Camioneta</option>
      <option value="MONTACARGAS">Montacargas</option>
      <option value="STOCKA">Stocka</option>
    </select>
    <input type="text" class="ca-search" id="txtBuscar" placeholder="Buscar activo..." />
    <div class="ca-pagination">
      <span id="lblPageInfo">0 registros</span>
      <select id="selPageSize">
        <option value="10">10</option>
        <option value="25" selected>25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <button class="btn-ca btn-ca-back btn-sm" id="btnPrevPage"><i class="fas fa-chevron-left"></i></button>
      <span id="lblPageNum">1 / 1</span>
      <button class="btn-ca btn-ca-back btn-sm" id="btnNextPage"><i class="fas fa-chevron-right"></i></button>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="ca-content">
    <div class="ca-table-wrapper">
      <table id="tblActivos">
        <thead>
          <tr></tr>
        </thead>
        <tbody id="tblActivosBody"></tbody>
      </table>
    </div>
  </div>

  <!-- MODAL -->
  <div class="ca-modal-overlay" id="modalActivo">
    <div class="ca-modal">
      <button class="ca-modal-close" id="btnCerrarModal">&times;</button>
      <h3 id="modalTitle">Registrar Activo</h3>
      <form id="formActivo" autocomplete="off">
        <input type="hidden" id="id_activo" value="0">

        <div class="ca-form-grid">
          <div>
            <label for="id_categoria">Categoría *</label>
            <select id="id_categoria" required>
              <option value="">Seleccione...</option>
            </select>
          </div>
          <div>
            <label for="tipo_activo">Tipo de Activo *</label>
            <select id="tipo_activo" required>
              <option value="">Seleccione...</option>
            </select>
          </div>
          <div>
            <label for="codigo_patrimonial">Código Patrimonial</label>
            <input type="text" id="codigo_patrimonial" placeholder="Ej: PAT-001">
          </div>
          <div>
            <label for="marca">Marca *</label>
            <input type="text" id="marca" placeholder="Ej: Toyota" required>
          </div>
          <div>
            <label for="modelo">Modelo *</label>
            <input type="text" id="modelo" placeholder="Ej: Hilux" required>
          </div>
          <div>
            <label for="numero_serie">Número de Serie</label>
            <input type="text" id="numero_serie" placeholder="N/S del fabricante">
          </div>
          <div>
            <label for="placa">Placa</label>
            <input type="text" id="placa" placeholder="Ej: ABC-123">
          </div>
          <div>
            <label for="kilometraje_actual">Kilometraje Actual (km)</label>
            <input type="number" id="kilometraje_actual" min="0" step="1" placeholder="Ej: 50000">
          </div>
          <div>
            <label for="anio_fabricacion">Año Fabricación</label>
            <input type="number" id="anio_fabricacion" min="1980" max="2030" placeholder="Ej: 2020">
          </div>
          <div>
            <label for="color">Color</label>
            <input type="text" id="color" placeholder="Ej: Blanco">
          </div>
          <div>
            <label for="combustible">Combustible</label>
            <select id="combustible">
              <option value="">Seleccione...</option>
            </select>
          </div>
          <div>
            <label for="capacidad_carga">Capacidad de Carga (kg)</label>
            <input type="text" id="capacidad_carga" placeholder="Ej: 1500 kg">
          </div>
          <div>
            <label for="peso_bruto">Peso Bruto (kg)</label>
            <input type="number" id="peso_bruto" step="0.01" placeholder="Ej: 2500.00">
          </div>
          <div>
            <label for="dimensiones">Dimensiones</label>
            <input type="text" id="dimensiones" placeholder="Ej: 5.3m x 1.8m x 1.7m">
          </div>
          <div>
            <label for="altura_elevacion">Altura Elevación (m)</label>
            <input type="number" id="altura_elevacion" step="0.01" min="0" max="20" placeholder="Ej: 4.95">
          </div>
          <div>
            <label for="longitud_unas">Longitud de Uñas (m)</label>
            <input type="number" id="longitud_unas" step="0.01" min="0" max="10" placeholder="Ej: 1.20">
          </div>
          <div>
            <label for="soat_codigo">Código SOAT</label>
            <input type="text" id="soat_codigo" placeholder="N° de póliza SOAT">
          </div>
          <div>
            <label for="soat_vencimiento">Vencimiento SOAT</label>
            <input type="date" id="soat_vencimiento">
          </div>
          <div>
            <label for="revision_tecnica_codigo">Código Revisión Técnica</label>
            <input type="text" id="revision_tecnica_codigo" placeholder="N° de certificado">
          </div>
          <div>
            <label for="revision_tecnica_vencimiento">Vencimiento Revisión Técnica</label>
            <input type="date" id="revision_tecnica_vencimiento">
          </div>
          <div>
            <label for="fecha_adquisicion">Fecha de Adquisición</label>
            <input type="date" id="fecha_adquisicion">
          </div>
          <div>
            <label for="ubicacion_fisica">Ubicación Física</label>
            <input type="text" id="ubicacion_fisica" placeholder="Ej: Almacén Principal">
          </div>
          <div>
            <label for="estado_activo">Estado *</label>
            <select id="estado_activo" required>
              <option value="OPERATIVO">Operativo</option>
              <option value="EN MANTENIMIENTO">En Mantenimiento</option>
              <option value="INOPERATIVO">Inoperativo</option>
              <option value="DE BAJA">De Baja</option>
            </select>
          </div>
          <div>
            <label for="valor_libros">Valor en Libros (USD)</label>
            <input type="number" id="valor_libros" step="0.01" min="0" placeholder="Ej: 45000.00">
          </div>
          <div>
            <label for="foto_url">Foto del Activo</label>
            <div class="foto-upload-container">
              <input type="file" id="fotoInput" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none">
              <input type="hidden" id="foto_url" value="">
              <div class="foto-upload-area" id="fotoUploadArea">
                <i class="fas fa-camera"></i>
                <span id="fotoUploadText">Elegir foto</span>
              </div>
              <span class="foto-nombre-archivo" id="fotoNombreArchivo"></span>
              <div class="foto-preview" id="fotoPreview" style="display:none">
                <img id="fotoPreviewImg" src="" alt="Vista previa">
                <button type="button" class="btn-ca btn-ca-danger btn-sm" id="btnQuitarFoto" title="Quitar foto">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="full-width">
            <label for="observaciones">Observaciones</label>
            <textarea id="observaciones" placeholder="Notas adicionales..."></textarea>
          </div>
        </div>

        <div class="ca-modal-actions">
          <button type="button" class="btn-ca btn-ca-back" id="btnCancelarModal">Cancelar</button>
          <button type="button" class="btn-ca btn-ca-warning" id="btnEditarActivo" style="display:none">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button type="submit" class="btn-ca btn-ca-primary" id="btnGuardarActivo">
            <i class="fas fa-save"></i> Guardar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL CONFIRMAR ELIMINACIÓN -->
  <div class="ca-modal-overlay" id="modalConfirmar" style="z-index:9999">
    <div class="ca-modal" style="max-width:420px">
      <button class="ca-modal-close" id="btnCerrarConfirmar">&times;</button>
      <h3 style="color:#d32f2f"><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
      <p id="confirmarMensaje" style="font-size:1rem;color:#444;margin:16px 0 24px">¿Está seguro de eliminar este activo?</p>
      <div class="ca-modal-actions">
        <button type="button" class="btn-ca btn-ca-back" id="btnCancelarConfirmar">Cancelar</button>
        <button type="button" class="btn-ca btn-ca-danger" id="btnConfirmarEliminar">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  </div>

  <!-- LIGHTBOX -->
  <div class="ca-lightbox-overlay" id="lightboxOverlay">
    <button class="ca-lightbox-close" id="btnCerrarLightbox">&times;</button>
    <img id="lightboxImg" src="" alt="Foto del activo">
  </div>

  <!-- SCRIPTS -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="maestro.js"></script>
</body>
</html>
