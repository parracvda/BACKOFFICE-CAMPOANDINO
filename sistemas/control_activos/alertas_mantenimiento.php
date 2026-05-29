<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Alertas de Mantenimiento – Control de Activos – CAMPO ANDINO</title>
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

    /* Badges para estado de alerta (próxima fecha) */
    .alerta-dias {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .badge-vencida  { background: #f8d7da; color: #721c24; }
    .badge-proxima  { background: #fff3cd; color: #856404; }

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
    #tblAlertas {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      background: #fff;
    }
    #tblAlertas thead th {
      background: #1fa9a0;
      color: #fff;
      padding: 11px 13px;
      text-align: left;
      white-space: nowrap;
      position: relative;
      user-select: none;
      font-weight: 600;
    }
    #tblAlertas thead th.sortable { cursor: pointer; }
    #tblAlertas thead th.sortable:hover { background: #179890; }
    #tblAlertas tbody tr:nth-child(even) { background: #f8fefe; }
    #tblAlertas tbody tr:hover { background: #e6f9f7; cursor: pointer; }
    #tblAlertas tbody td {
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
      max-width: 650px;
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
    .ca-form-grid .field-hint {
      font-size: 0.75rem;
      color: #888;
      font-style: italic;
      margin-top: 2px;
    }

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
    }
  </style>
</head>
<body>

  <div class="ca-header">
    <div>
      <div class="ca-header-title"><i class="fas fa-bell"></i> Alertas de Mantenimiento</div>
      <div class="ca-header-sub">Cadena de Suministros – Control de Activos</div>
    </div>
    <div class="ca-header-actions">
      <button class="btn-ca btn-ca-back" onclick="window.location.href='launcher.php'">
        <i class="fas fa-arrow-left"></i> Volver al Launcher
      </button>
    </div>
  </div>

  <div class="ca-toolbar">
    <button class="btn-ca btn-ca-primary" id="btnNuevaAlerta">
      <i class="fas fa-plus"></i> Nueva Alerta
    </button>
    <button class="btn-ca btn-ca-secondary" id="btnRefrescar">
      <i class="fas fa-sync-alt"></i> Refrescar
    </button>
  </div>

  <div class="notif-bar" id="notifBar"></div>

  <div class="ca-grid-controls">
    <input type="text" class="ca-search" id="txtBuscar" placeholder="Buscar alerta..." />
    <div class="ca-pagination">
      <span id="lblPageInfo">0 alertas</span>
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
      <table id="tblAlertas">
        <thead>
          <tr></tr>
        </thead>
        <tbody id="tblAlertasBody"></tbody>
      </table>
    </div>
  </div>

  <!-- MODAL -->
  <div class="ca-modal-overlay" id="modalAlerta">
    <div class="ca-modal">
      <button class="ca-modal-close" id="btnCerrarModal">&times;</button>
      <h3 id="modalTitle">Configurar Alerta</h3>
      <form id="formAlerta" autocomplete="off">
        <input type="hidden" id="id_alerta" value="0">

        <div class="ca-form-grid">
          <div class="full-width">
            <label for="id_activo">Activo *</label>
            <select id="id_activo" required>
              <option value="">Seleccione...</option>
            </select>
          </div>
          <div class="full-width">
            <label for="tipo_alerta">Tipo de Alerta *</label>
            <input type="text" id="tipo_alerta" required placeholder="Ej: Cambio de aceite, Revisión de frenos, etc.">
          </div>
          <div>
            <label for="periodicidad_dias">Periodicidad (días)</label>
            <input type="number" id="periodicidad_dias" min="1" placeholder="Ej: 90">
            <div class="field-hint">Cada cuántos días se repite</div>
          </div>
          <div>
            <label for="periodicidad_km">Periodicidad (km)</label>
            <input type="number" id="periodicidad_km" min="1" placeholder="Ej: 5000">
            <div class="field-hint">O cada cuántos kilómetros</div>
          </div>
          <div>
            <label for="ultima_ejecucion">Última Ejecución</label>
            <input type="date" id="ultima_ejecucion">
          </div>
          <div>
            <label for="proxima_alerta">Próxima Alerta</label>
            <input type="date" id="proxima_alerta">
            <div class="field-hint">Se calcula automáticamente si ingresas días</div>
          </div>
          <div>
            <label for="activo_flag">Estado</label>
            <select id="activo_flag">
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="ca-modal-actions">
          <button type="button" class="btn-ca btn-ca-back" id="btnCancelarModal">Cancelar</button>
          <button type="submit" class="btn-ca btn-ca-primary"><i class="fas fa-save"></i> Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="alertas_mantenimiento.js"></script>
</body>
</html>
