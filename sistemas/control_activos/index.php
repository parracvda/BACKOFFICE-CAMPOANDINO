<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Control de Activos – CAMPO ANDINO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Roboto', Arial, sans-serif;
      background: #f0f4f8;
      min-height: 100vh;
      color: #2d3748;
    }

    /* ── HEADER ── */
    .ca-header {
      background: linear-gradient(135deg, #1fa9a0 0%, #0d7a73 100%);
      color: #fff;
      padding: 18px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 3px 12px rgba(31,169,160,0.25);
    }
    .ca-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .ca-header-icon {
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.18);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }
    .ca-header-title { font-size: 1.25rem; font-weight: 700; letter-spacing: 0.3px; }
    .ca-header-sub   { font-size: 0.8rem; opacity: 0.85; margin-top: 2px; }
    .ca-header-actions { display: flex; gap: 8px; }
    .btn-header {
      background: rgba(255,255,255,0.15);
      color: #fff;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
      text-decoration: none;
    }
    .btn-header:hover { background: rgba(255,255,255,0.25); }

    /* ── CONTENEDOR PRINCIPAL ── */
    .ca-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 20px 40px;
    }

    /* ── TARJETAS DE KPI ── */
    .kpi-section {
      margin-bottom: 32px;
    }
    .kpi-section + .kpi-section {
      padding-top: 8px;
      border-top: 2px dashed #e2e8f0;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 14px;
    }
    .kpi-card {
      background: #fff;
      border-radius: 14px;
      padding: 18px 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      text-align: center;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    }
    .kpi-number {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
    }
    .kpi-label {
      font-size: 0.78rem;
      color: #718096;
      font-weight: 500;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kpi-icon {
      font-size: 1.3rem;
      margin-bottom: 6px;
    }
    .kpi-total .kpi-number { color: #1fa9a0; }
    .kpi-camion .kpi-number { color: #2d3748; }
    .kpi-camioneta .kpi-number { color: #4a5568; }
    .kpi-montacargas .kpi-number { color: #d69e2e; }
    .kpi-stocka .kpi-number { color: #9b59b6; }
    .kpi-operativo .kpi-number { color: #27ae60; }
    .kpi-mantenimiento .kpi-number { color: #e67e22; }
    .kpi-inoperativo .kpi-number { color: #e74c3c; }
    .kpi-baja .kpi-number { color: #a0aec0; }

    /* ── SECCIÓN: ACCESOS DIRECTOS ── */
    .section-title {
      font-size: 1rem;
      font-weight: 700;
      color: #4a5568;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title i { color: #1fa9a0; }

    .apps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 14px;
      margin-bottom: 32px;
    }
    .app-card {
      background: #fff;
      border-radius: 16px;
      padding: 22px 14px 18px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      text-align: center;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      text-decoration: none;
      color: inherit;
      display: block;
      border: 1px solid transparent;
    }
    .app-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(31,169,160,0.12);
      border-color: #1fa9a0;
    }
    .app-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin: 0 auto 10px;
      color: #fff;
    }
    .app-icon.verde  { background: linear-gradient(135deg, #1fa9a0, #0d7a73); }
    .app-icon.azul   { background: linear-gradient(135deg, #3498db, #2176ae); }
    .app-icon.naranja{ background: linear-gradient(135deg, #e67e22, #cf6d17); }
    .app-icon.rojo   { background: linear-gradient(135deg, #e74c3c, #c0392b); }
    .app-icon.morado { background: linear-gradient(135deg, #9b59b6, #7d3c98); }
    .app-icon.ambar  { background: linear-gradient(135deg, #f39c12, #d68910); }
    .app-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #2d3748;
    }
    .app-desc {
      font-size: 0.72rem;
      color: #a0aec0;
      margin-top: 3px;
    }

    /* ── SECCIÓN: ÚLTIMOS REGISTROS ── */
    .recent-section {
      background: #fff;
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .recent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .recent-header .section-title { margin-bottom: 0; }
    .recent-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }
    .recent-table th {
      text-align: left;
      padding: 8px 6px;
      color: #718096;
      font-weight: 600;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .recent-table td {
      padding: 8px 6px;
      border-bottom: 1px solid #f0f4f8;
    }
    .recent-table tr:last-child td { border-bottom: none; }
    .badge-estado {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 700;
    }
    .badge-OPERATIVO        { background: #d4edda; color: #155724; }
    .badge-EN_MANTENIMIENTO { background: #fff3cd; color: #856404; }
    .badge-INOPERATIVO      { background: #f8d7da; color: #721c24; }
    .badge-DE_BAJA          { background: #e2e3e5; color: #383d41; }

    /* ── RESPONSIVE ── */
    @media (max-width: 640px) {
      .ca-header { padding: 14px 16px; }
      .ca-container { padding: 16px 12px 30px; }
      .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .kpi-card { padding: 14px 10px; }
      .kpi-number { font-size: 1.5rem; }
      .apps-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .app-card { padding: 16px 10px 14px; }
      .app-icon { width: 44px; height: 44px; font-size: 1.1rem; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="ca-header">
    <div class="ca-header-left">
      <div class="ca-header-icon"><i class="fas fa-truck"></i></div>
      <div>
        <div class="ca-header-title">Control de Activos</div>
        <div class="ca-header-sub">Cadena de Suministros – CAMPO ANDINO</div>
      </div>
    </div>
    <div class="ca-header-actions">
      <a class="btn-header" href="launcher.php"><i class="fas fa-arrow-left"></i> Volver al Launcher</a>
    </div>
  </div>

  <div class="ca-container">

    <!-- KPIs: Por Tipo -->
    <div class="kpi-section">
      <div class="section-title" style="margin-bottom:12px;"><i class="fas fa-tag"></i> Por Tipo de Activo</div>
      <div class="kpi-grid">
        <div class="kpi-card kpi-total">
          <div class="kpi-icon"><i class="fas fa-boxes"></i></div>
          <div class="kpi-number" id="kpiTotal">0</div>
          <div class="kpi-label">Total Activos</div>
        </div>
        <div class="kpi-card kpi-camion">
          <div class="kpi-icon"><i class="fas fa-truck"></i></div>
          <div class="kpi-number" id="kpiCamion">0</div>
          <div class="kpi-label">Camiones</div>
        </div>
        <div class="kpi-card kpi-camioneta">
          <div class="kpi-icon"><i class="fas fa-truck-pickup"></i></div>
          <div class="kpi-number" id="kpiCamioneta">0</div>
          <div class="kpi-label">Camionetas</div>
        </div>
        <div class="kpi-card kpi-montacargas">
          <div class="kpi-icon"><i class="fas fa-arrow-up-from-ground-water"></i></div>
          <div class="kpi-number" id="kpiMontacargas">0</div>
          <div class="kpi-label">Montacargas</div>
        </div>
        <div class="kpi-card kpi-stocka">
          <div class="kpi-icon"><i class="fas fa-dolly"></i></div>
          <div class="kpi-number" id="kpiStocka">0</div>
          <div class="kpi-label">Stockas</div>
        </div>
      </div>
    </div>

    <!-- KPIs: Por Estado -->
    <div class="kpi-section">
      <div class="section-title" style="margin-bottom:12px;"><i class="fas fa-clipboard-list"></i> Por Estado</div>
      <div class="kpi-grid">
        <div class="kpi-card kpi-operativo">
          <div class="kpi-icon"><i class="fas fa-check-circle"></i></div>
          <div class="kpi-number" id="kpiOperativo">0</div>
          <div class="kpi-label">Operativos</div>
        </div>
        <div class="kpi-card kpi-mantenimiento">
          <div class="kpi-icon"><i class="fas fa-tools"></i></div>
          <div class="kpi-number" id="kpiMantenimiento">0</div>
          <div class="kpi-label">En Mantenimiento</div>
        </div>
        <div class="kpi-card kpi-inoperativo">
          <div class="kpi-icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="kpi-number" id="kpiInoperativo">0</div>
          <div class="kpi-label">Inoperativos</div>
        </div>
        <div class="kpi-card kpi-baja">
          <div class="kpi-icon"><i class="fas fa-trash-alt"></i></div>
          <div class="kpi-number" id="kpiBaja">0</div>
          <div class="kpi-label">De Baja</div>
        </div>
      </div>
    </div>

    <!-- ACCESOS DIRECTOS -->
    <div class="section-title"><i class="fas fa-th-large"></i> Módulos</div>
    <div class="apps-grid">
      <a class="app-card" href="maestro.php">
        <div class="app-icon verde"><i class="fas fa-truck"></i></div>
        <div class="app-name">Maestro</div>
        <div class="app-desc">Gestionar activos</div>
      </a>
      <a class="app-card" href="checklist.php">
        <div class="app-icon azul"><i class="fas fa-clipboard-check"></i></div>
        <div class="app-name">Checklist</div>
        <div class="app-desc">Inspección diaria</div>
      </a>
      <a class="app-card" href="mantenimiento.php">
        <div class="app-icon naranja"><i class="fas fa-wrench"></i></div>
        <div class="app-name">Mantenimiento</div>
        <div class="app-desc">Registro y control</div>
      </a>
      <a class="app-card" href="alertas_mantenimiento.php">
        <div class="app-icon rojo"><i class="fas fa-bell"></i></div>
        <div class="app-name">Alertas</div>
        <div class="app-desc">Alertas programadas</div>
      </a>
      <a class="app-card" href="operadores.php">
        <div class="app-icon morado"><i class="fas fa-users"></i></div>
        <div class="app-name">Operadores</div>
        <div class="app-desc">Gestionar operadores</div>
      </a>
      <a class="app-card" href="maestro.php">
        <div class="app-icon ambar"><i class="fas fa-chart-bar"></i></div>
        <div class="app-name">Reportes</div>
        <div class="app-desc">Próximamente</div>
      </a>
    </div>

    <!-- ÚLTIMOS REGISTROS -->
    <div class="recent-section">
      <div class="recent-header">
        <div class="section-title"><i class="fas fa-history"></i> Últimos Activos Registrados</div>
        <a href="maestro.php" style="font-size:0.78rem;color:#1fa9a0;font-weight:600;text-decoration:none;">
          Ver todos <i class="fas fa-arrow-right"></i>
        </a>
      </div>
      <table class="recent-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Marca / Modelo</th>
            <th>Placa</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody id="recentTableBody">
          <tr><td colspan="5" style="text-align:center;color:#a0aec0;padding:20px;">Cargando...</td></tr>
        </tbody>
      </table>
    </div>

  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
    var API = 'api/datos.php';

    $(function() {
      cargarDashboard();
    });

    function cargarDashboard() {
      $.getJSON(API, { action: 'listar_activos' }, function(res) {
        if (!res.success) return;
        var data = res.data || [];

        // ── KPIs ──
        var total = data.length;
        var camion = 0, camioneta = 0, montacargas = 0, stocka = 0;
        var operativo = 0, mantenimiento = 0, inoperativo = 0, baja = 0;

        data.forEach(function(r) {
          var tipo = (r.tipo_activo || '').toUpperCase();
          if (tipo === 'CAMION') camion++;
          else if (tipo === 'CAMIONETA') camioneta++;
          else if (tipo === 'MONTACARGAS') montacargas++;
          else if (tipo === 'STOCKA') stocka++;

          var est = (r.estado_activo || '').toUpperCase();
          if (est === 'OPERATIVO') operativo++;
          else if (est === 'EN MANTENIMIENTO') mantenimiento++;
          else if (est === 'INOPERATIVO') inoperativo++;
          else if (est === 'DE BAJA') baja++;
        });

        document.getElementById('kpiTotal').textContent = total;
        document.getElementById('kpiCamion').textContent = camion;
        document.getElementById('kpiCamioneta').textContent = camioneta;
        document.getElementById('kpiMontacargas').textContent = montacargas;
        document.getElementById('kpiStocka').textContent = stocka;
        document.getElementById('kpiOperativo').textContent = operativo;
        document.getElementById('kpiMantenimiento').textContent = mantenimiento;
        document.getElementById('kpiInoperativo').textContent = inoperativo;
        document.getElementById('kpiBaja').textContent = baja;

        // ── Últimos 5 registros ──
        var recientes = data.slice(0, 5);
        var html = '';
        recientes.forEach(function(r) {
          var badgeCls = 'badge-estado badge-' + String(r.estado_activo || '').replace(/ /g, '_');
          html += '<tr>' +
            '<td>' + escHtml(r.codigo_patrimonial || '-') + '</td>' +
            '<td>' + escHtml(r.tipo_activo || '-') + '</td>' +
            '<td>' + escHtml(r.marca || '') + ' ' + escHtml(r.modelo || '') + '</td>' +
            '<td>' + escHtml(r.placa || '-') + '</td>' +
            '<td><span class="' + badgeCls + '">' + escHtml(r.estado_activo || '') + '</span></td>' +
            '</tr>';
        });
        document.getElementById('recentTableBody').innerHTML = html;
      });
    }

    function escHtml(s) {
      if (!s) return '';
      return String(s)
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');
    }
  </script>
</body>
</html>
