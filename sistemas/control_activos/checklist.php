<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Checklist Diario – Control de Activos – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="shared/estilos.css">
  <style>
    body { font-family: 'Roboto', Arial, sans-serif; background: #f4f8fb; margin: 0; min-height: 100vh; }

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

    .ca-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      padding: 14px 28px;
      background: #fff;
      border-bottom: 1px solid #e0eaef;
    }

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
      transition: background 0.18s;
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

    .badge-estado {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .badge-BUENO       { background: #d4edda; color: #155724; }
    .badge-CORREGIR    { background: #fff3cd; color: #856404; }
    .badge-MAL_ESTADO  { background: #f8d7da; color: #721c24; }
    .badge-REGULAR     { background: #fff3cd; color: #856404; }

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
    .ca-pagination select { padding: 5px 8px; border-radius: 5px; border: 1px solid #cdd6e0; font-family: inherit; }

    .ca-content { padding: 0 28px 24px 28px; }

    .ca-table-wrapper {
      width: 100%;
      overflow-x: auto;
      border-radius: 10px;
      box-shadow: 0 1px 8px rgba(31,169,160,0.07);
      background: #fff;
    }
    #tblChecklists {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      background: #fff;
    }
    #tblChecklists thead th {
      background: #1fa9a0;
      color: #fff;
      padding: 11px 13px;
      text-align: left;
      white-space: nowrap;
      position: relative;
      user-select: none;
      font-weight: 600;
    }
    #tblChecklists thead th.sortable { cursor: pointer; }
    #tblChecklists thead th.sortable:hover { background: #179890; }
    #tblChecklists tbody tr:nth-child(even) { background: #f8fefe; }
    #tblChecklists tbody tr:hover { background: #e6f9f7; cursor: pointer; }
    #tblChecklists tbody td {
      padding: 9px 13px;
      border-bottom: 1px solid #e8f0ee;
      vertical-align: middle;
      white-space: nowrap;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

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
      max-width: 920px;
      max-height: 96vh;
      overflow-y: auto;
      position: relative;
    }
    .ca-modal h3 { margin: 0 0 18px 0; color: #1fa9a0; font-size: 1.2rem; }
    .ca-modal-close {
      position: absolute; top: 14px; right: 18px;
      background: none; border: none; font-size: 1.6rem;
      cursor: pointer; color: #888;
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
    }
    .ca-form-grid input:focus,
    .ca-form-grid select:focus,
    .ca-form-grid textarea:focus {
      border-color: #1fa9a0;
      outline: none;
      box-shadow: 0 0 0 2px rgba(31,169,160,0.15);
    }
    .ca-form-grid textarea { resize: vertical; min-height: 60px; }

    /* ── Acordeón de grupos ──────────────────────────────────── */
    .checklist-items {
      margin-top: 16px;
      border: 1px solid #e0eaef;
      border-radius: 8px;
      padding: 14px;
      background: #fafcfd;
      max-height: 500px;
      overflow-y: auto;
    }
    .checklist-items h4 {
      margin: 0 0 12px 0;
      color: #1fa9a0;
      font-size: 1rem;
      position: sticky;
      top: 0;
      background: #fafcfd;
      padding-bottom: 8px;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .checklist-legend {
      font-size: 0.75rem;
      font-weight: 500;
      color: #666;
      background: #f0f4f7;
      padding: 3px 10px;
      border-radius: 12px;
      white-space: nowrap;
    }
    .checklist-legend span { margin: 0 4px; }
    .checklist-legend .lgd-b { color: #27ae60; font-weight: 700; }
    .checklist-legend .lgd-c { color: #e67e22; font-weight: 700; }
    .checklist-legend .lgd-m { color: #e74c3c; font-weight: 700; }

    /* Grupo acordeón */
    .cl-grupo {
      border: 1px solid #e0eaef;
      border-radius: 7px;
      margin-bottom: 6px;
      background: #fff;
      overflow: hidden;
    }
    .cl-grupo-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 12px;
      background: #f0f7f9;
      cursor: pointer;
      user-select: none;
      transition: background 0.12s;
      font-weight: 600;
      font-size: 0.9rem;
      color: #1a5a5a;
    }
    .cl-grupo-header:hover { background: #e0f0f2; }
    .cl-grupo-arrow {
      font-size: 0.7rem;
      transition: transform 0.2s;
      color: #1fa9a0;
      flex-shrink: 0;
    }
    .cl-grupo-nombre { flex: 1; }
    .cl-grupo-status {
      font-size: 0.9rem;
      flex-shrink: 0;
    }
    .cl-gs-ok { color: #27ae60; }
    .cl-gs-warn { color: #e67e22; }
    .cl-grupo-body {
      padding: 6px 12px 10px 12px;
      border-top: 1px solid #e8f0ee;
    }

    /* Items dentro del grupo */
    .cl-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 5px 0;
      border-bottom: 1px solid #f4f8fa;
      flex-wrap: wrap;
    }
    .cl-item:last-child { border-bottom: none; }
    .cl-item-name {
      flex: 1;
      font-size: 0.84rem;
      color: #333;
      min-width: 140px;
      padding-top: 2px;
    }
    .cl-item-coment {
      width: 130px;
      padding: 3px 6px;
      border: 1px solid #d0dbe3;
      border-radius: 5px;
      font-size: 0.8rem;
      flex-shrink: 0;
    }
    .cl-item-coment:focus { outline: none; border-color: #1fa9a0; }

    /* ── Botones de cámara y galería ──────────────────────────── */
    .cl-item-actions {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex-shrink: 0;
    }
    .cl-item-btn-cam, .cl-item-btn-gal {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: 1px solid #d0dbe3;
        border-radius: 6px;
        background: #fff;
        cursor: pointer;
        font-size: 0.85rem;
        color: #555;
        transition: all 0.12s;
    }
    .cl-item-btn-cam:hover { background: #e8f5e9; border-color: #27ae60; color: #27ae60; }
    .cl-item-btn-gal:hover { background: #e3f2fd; border-color: #3498db; color: #3498db; }
    .cl-item-btn-cam.has-foto { background: #e8f5e9; border-color: #27ae60; color: #27ae60; }
    .cl-item-btn-gal.has-foto { background: #e3f2fd; border-color: #3498db; color: #3498db; }

    /* ── Thumbnails de fotos por item ─────────────────────────── */
    .cl-item-fotos {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;
        width: 100%;
    }
    .cl-item-foto-thumb {
        width: 48px;
        height: 48px;
        border-radius: 5px;
        object-fit: cover;
        border: 1px solid #e0eaef;
        cursor: pointer;
        transition: transform 0.12s;
    }
    .cl-item-foto-thumb:hover { transform: scale(1.15); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }

    /* ── Lightbox ─────────────────────────────────────────────── */
    .lightbox-overlay {
        display: none;
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.8);
        z-index: 2000;
        align-items: center;
        justify-content: center;
    }
    .lightbox-overlay.open { display: flex; }
    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }
    .lightbox-content img {
        max-width: 90vw;
        max-height: 85vh;
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0,0,0,0.5);
    }
    .lightbox-close {
        position: absolute;
        top: -36px;
        right: 0;
        background: none;
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
        opacity: 0.8;
    }
    .lightbox-close:hover { opacity: 1; }
    .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.2);
        border: none;
        color: #fff;
        font-size: 2rem;
        padding: 8px 14px;
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.12s;
    }
    .lightbox-nav:hover { background: rgba(255,255,255,0.4); }
    .lightbox-prev { left: -50px; }
    .lightbox-next { right: -50px; }
    .lightbox-counter {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        color: #ccc;
        font-size: 0.85rem;
    }

    /* Radio buttons group */
    .radio-group {
      display: inline-flex;
      gap: 3px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }
    .radio-group label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border: 1px solid #d0dbe3;
      border-radius: 50%;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.12s;
      background: #fff;
    }
    .radio-group label:hover { border-color: #1fa9a0; }
    .radio-group input[type="radio"] { display: none; }
    .radio-group label.rdo-bueno.selected { background: #d4edda; border-color: #27ae60; color: #155724; }
    .radio-group label.rdo-corregir.selected { background: #fff3cd; border-color: #e67e22; color: #856404; }
    .radio-group label.rdo-mal.selected { background: #f8d7da; border-color: #e74c3c; color: #721c24; }

    .ca-modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid #e8eef3;
    }

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

    @media (max-width: 700px) {
      .ca-header { padding: 10px 14px; }
      .ca-toolbar { padding: 10px 14px; }
      .ca-grid-controls { padding: 10px 14px; flex-direction: column; align-items: stretch; }
      .ca-search { width: 100%; }
      .ca-pagination { margin-left: 0; justify-content: center; }
      .ca-content { padding: 0 14px 14px 14px; }
      .ca-modal { padding: 18px; max-width: 100%; margin: 10px; }
      .ca-form-grid { grid-template-columns: 1fr; }
      .cl-item { flex-wrap: wrap; }
      .cl-item .cl-item-coment { width: 100%; }
      .cl-item-actions { margin-top: 4px; }
      .lightbox-prev { left: 5px; }
      .lightbox-next { right: 5px; }
    }
  </style>
</head>
<body>

  <div class="ca-header">
    <div>
      <div class="ca-header-title"><i class="fas fa-clipboard-check"></i> Checklist Diario</div>
      <div class="ca-header-sub">Cadena de Suministros – Control de Activos</div>
    </div>
    <div class="ca-header-actions">
      <button class="btn-ca btn-ca-back" onclick="window.location.href='launcher.php'">
        <i class="fas fa-arrow-left"></i> Volver al Launcher
      </button>
    </div>
  </div>

  <div class="ca-toolbar">
    <button class="btn-ca btn-ca-primary" id="btnNuevoChecklist">
      <i class="fas fa-plus"></i> Nuevo Checklist
    </button>
    <button class="btn-ca btn-ca-secondary" id="btnRefrescar">
      <i class="fas fa-sync-alt"></i> Refrescar
    </button>
  </div>

  <div class="notif-bar" id="notifBar"></div>

  <div class="ca-grid-controls">
    <input type="text" class="ca-search" id="txtBuscar" placeholder="Buscar checklist..." />
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

  <div class="ca-content">
    <div class="ca-table-wrapper">
      <table id="tblChecklists">
        <thead>
          <tr></tr>
        </thead>
        <tbody id="tblChecklistsBody"></tbody>
      </table>
    </div>
  </div>

  <!-- MODAL -->
  <div class="ca-modal-overlay" id="modalChecklist">
    <div class="ca-modal">
      <button class="ca-modal-close" id="btnCerrarModal">&times;</button>
      <h3 id="modalTitle">Registrar Checklist</h3>
      <form id="formChecklist" autocomplete="off">
        <input type="hidden" id="id_checklist" value="0">

        <div class="ca-form-grid">
          <div>
            <label for="id_activo">Activo *</label>
            <select id="id_activo" required>
              <option value="">Seleccione...</option>
            </select>
          </div>
          <div>
            <label for="id_operador">Operador *</label>
            <select id="id_operador" required>
              <option value="">Seleccione...</option>
            </select>
          </div>
          <div>
            <label for="fecha_checklist">Fecha *</label>
            <input type="date" id="fecha_checklist" required>
          </div>
          <div>
            <label for="hora_checklist">Hora</label>
            <input type="time" id="hora_checklist">
          </div>
          <div>
            <label for="kilometraje">Kilometraje / Horómetro</label>
            <input type="text" id="kilometraje" placeholder="Ej: 15000 km">
          </div>
          <div>
            <label for="estado_general">Estado General</label>
            <select id="estado_general">
              <option value="BUENO">Bueno</option>
              <option value="REGULAR">Regular</option>
              <option value="MALO">Malo</option>
            </select>
          </div>
          <div class="full-width">
            <label for="observaciones">Observaciones</label>
            <textarea id="observaciones" placeholder="Notas adicionales..."></textarea>
          </div>
        </div>

        <!-- Items del checklist -->
        <div class="checklist-items">
          <h4>Items de Inspección <span class="checklist-legend"><span class="lgd-b">B</span>: Bueno <span class="lgd-c">C</span>: Corregir <span class="lgd-m">M</span>: Mal Estado</span></h4>
          <div id="itemsContainer"></div>
        </div>

        <div class="ca-modal-actions">
          <button type="button" class="btn-ca btn-ca-back" id="btnCancelarModal">Cancelar</button>
          <button type="submit" class="btn-ca btn-ca-primary"><i class="fas fa-save"></i> Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- INPUT FILE OCULTO PERMANENTE para capturar fotos (más confiable en móviles) -->
  <input type="file" id="capturaFotoInput" accept="image/*" style="display:none" capture="environment">

  <!-- LIGHTBOX para galería de fotos -->
  <div class="lightbox-overlay" id="lightboxOverlay">
    <div class="lightbox-content">
      <button class="lightbox-close" id="lightboxClose">&times;</button>
      <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#10094;</button>
      <img id="lightboxImg" src="" alt="Foto">
      <button class="lightbox-nav lightbox-next" id="lightboxNext">&#10095;</button>
      <div class="lightbox-counter" id="lightboxCounter"></div>
    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="checklist.js"></script>
</body>
</html>
