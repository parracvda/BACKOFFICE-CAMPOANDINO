<?php
// consultas.php - Reporte de Despachos
session_start();
require_once __DIR__ . '/../../shared/conexion.php';

$usuarioNombre = '';
if (isset($_SESSION['usuarionombre']) && strlen(trim($_SESSION['usuarionombre']))) {
  $usuarioNombre = $_SESSION['usuarionombre'];
} elseif (isset($_SESSION['usuario']) && strlen(trim($_SESSION['usuario']))) {
  $usuarioNombre = $_SESSION['usuario'];
}

if (trim($usuarioNombre) === '') {
  header('Location: ../../public/index.html?error=' . urlencode('Debe iniciar sesión.'));
  exit;
}

// Consultar registros de despachos
$sql = "SELECT 
            Id,
            DocDespacho,
            OrdenVenta,
            OrdenCompra,
            Cliente,
            CondicionVenta,
            Origen,
            Destino,
            Codigo,
            Cantidad,
            FechaSugerida,
            Observaciones,
            registro_usuario,
            registro_timestamp
        FROM scm_plan_despacho
        ORDER BY registro_timestamp DESC, Id DESC";

$res = $conn->query($sql);
$rows = [];
if ($res && $res->num_rows > 0) {
    while ($r = $res->fetch_assoc()) $rows[] = $r;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Reporte de Despachos</title>
<style>
    body{font-family:Arial,Helvetica,sans-serif;margin:20px}
    h2{margin-bottom:18px}
    .controls{display:flex;justify-content:flex-start;align-items:center;margin-bottom:12px;gap:12px}
    .controls-left{display:flex;align-items:center;gap:12px}
    .controls-right{display:flex;gap:10px}
    input[type=text]{padding:8px;border:1px solid #ccc;border-radius:4px}
    button{padding:8px 12px;border-radius:4px;border:none;background:#1976d2;color:#fff;cursor:pointer}
    button:hover{background:#1565c0}
    table{width:100%;border-collapse:collapse;margin-top:10px}
    th,td{padding:8px;border:1px solid #ddd;text-align:left}
    th{background:#f0f0f0}
    /* Cabeceras ligeramente más pequeñas y no-wrap */
    #grid thead th { font-size: 13px; white-space: nowrap; }
    /* Evitar que celdas de datos se rompan y usar ellipsis para contenido largo */
    #grid tbody td { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* Anchos específicos para columnas importantes */
    #grid thead th.col-doc { width: 120px; }
    #grid thead th.col-fecha { width: 110px; }
    #grid tbody tr td:nth-child(2) { white-space: nowrap; width: 120px; }
    /* Opcionales: permitir que la columna Observaciones sea más ancha si hay espacio */
    #grid thead th.col-observaciones { width: 20%; }
    /* Texto más pequeño para los registros (filas del cuerpo) */
    #grid tbody td { font-size: 12px; }
    /* Estilos para botones de filtro en cabecera */
    .col-filter-btn { background: transparent; color: #444; border: 1px solid #ccc; padding: 2px 6px; margin-left:6px; border-radius:4px; }
    .col-filter-btn:hover { background: #f4f6fb; }
    .col-filter-btn.active { background: #0d47a1; color: #fff; border-color: #0b3b91; }
    .col-filter-badge { display:inline-block; min-width:18px; height:18px; line-height:18px; padding:0 5px; margin-left:6px; background:#ef5350; color:#fff; border-radius:12px; font-size:12px; text-align:center; }
    .col-filter-dropdown { font-size:13px; }
    .col-filter-dropdown label { cursor: pointer; }
    .col-filter-dropdown input[type=checkbox] { transform:scale(1.02); margin-right:6px; }
    /* Modal confirmación */
    .modal-overlay { position:fixed; left:0; top:0; right:0; bottom:0; background:rgba(0,0,0,0.4); display:none; align-items:center; justify-content:center; z-index:2000; }
    .modal { background:#fff; padding:18px; border-radius:6px; width:320px; box-shadow:0 8px 30px rgba(0,0,0,0.3); }
    .modal h3{ margin:0 0 10px 0; font-size:16px }
    .modal .row{ display:flex; justify-content:flex-end; gap:8px; margin-top:12px }
    .btn-secondary{ background:#f1f1f1; color:#333; border:none; padding:8px 10px; border-radius:4px }
    .btn-danger{ background:#d32f2f; color:#fff; border:none; padding:8px 10px; border-radius:4px }
</style>
</head>
<body>
    <h2>Reporte de Despachos</h2>
    <div class="controls">
        <div class="controls-left">
            <label style="display:inline-flex;align-items:center;gap:8px;margin-right:8px">
                Mostrar
                <select id="pageSizeSelect" style="padding:6px;border-radius:4px;border:1px solid #ccc">
                    <option value="10">10</option>
                    <option value="25" selected>25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                por página
            </label>
            <div id="paginationControls" style="display:inline-flex;align-items:center;gap:8px;margin-right:8px">
                <button id="prevPage" style="padding:6px 8px">◀</button>
                <span id="pageInfo">Página 1 de 1</span>
                <button id="nextPage" style="padding:6px 8px">▶</button>
            </div>
            <button id="clearAllBtn" title="Limpiar todos los filtros">Limpiar filtros</button>
            <button id="exportPdf">Exportar PDF</button>
            <button id="btn-panel" onclick="location.href='../../public/panel.html'">Panel</button>
            <button id="btnCerrarSesion" title="Cerrar sesión">Cerrar Sesión</button>
        </div>
    </div>

    <!-- Modal confirmación limpiar -->
    <div id="modalOverlay" class="modal-overlay">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <h3 id="modalTitle">Confirmar acción</h3>
            <div>¿Estás seguro que deseas limpiar todos los filtros?</div>
            <div class="row">
                <button id="modalCancel" class="btn-secondary">Cancelar</button>
                <button id="modalConfirm" class="btn-danger">Sí, limpiar</button>
            </div>
        </div>
    </div>

    <table id="grid">
        <thead>
        <tr>
            <th class="col-id">ID</th>
            <th class="col-doc">Doc Despacho</th>
            <th class="col-orden">Orden Venta</th>
            <th class="col-ordencompra">Orden Compra</th>
            <th class="col-cliente">Cliente</th>
            <th class="col-condicion">Condición Venta</th>
            <th class="col-origen">Origen</th>
            <th class="col-destino">Destino</th>
            <th class="col-codigo">Código</th>
            <th class="col-cantidad">Cantidad</th>
            <th class="col-fecha">Fecha Sugerida</th>
            <th class="col-observaciones">Observaciones</th>
        </tr>
        </thead>
        <tbody>
            <?php foreach($rows as $r): ?>
            <tr>
                <td><?php echo htmlspecialchars($r['Id'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['DocDespacho'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['OrdenVenta'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['OrdenCompra'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['Cliente'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['CondicionVenta'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['Origen'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['Destino'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['Codigo'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['Cantidad'] ?? ''); ?></td>
                <td><?php 
                    $fecha = $r['FechaSugerida'] ?? '';
                    echo htmlspecialchars((!empty($fecha) && strtotime($fecha)) ? date('d-m-Y', strtotime($fecha)) : $fecha); 
                ?></td>
                <td><?php echo htmlspecialchars($r['Observaciones'] ?? ''); ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <script>
// Filtrado cliente con filtros por columna (checkboxes) + paginación
document.addEventListener('DOMContentLoaded', function(){
    var table = document.getElementById('grid');
    var exportBtn = document.getElementById('exportPdf');

    // Estado de filtros por columna: { colIndex: Set(values) }
    var selectedFilters = {};

    var STORAGE_KEY = 'despachos_column_filters_v1';

    // Paginación - definir antes de aplicar filtros al cargar
    var currentPage = 1;
    var pageSize = parseInt((document.getElementById('pageSizeSelect')||{value:25}).value,10) || 25;

    function saveFiltersToStorage(){
        try {
            var plain = {};
            Object.keys(selectedFilters).forEach(function(k){
                var s = selectedFilters[k];
                if (!s || s.size === 0) return; // no persistir vacíos
                plain[k] = Array.from(s);
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
        } catch(e){ console.warn('No se pudo guardar filtros en localStorage', e); }
    }

    function loadFiltersFromStorage(){
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            var obj = JSON.parse(raw);
            console.log('[DEBUG] raw filters from storage:', obj);
            // Validar columnas y valores existentes antes de restaurar
            var thsLocal = table.querySelectorAll('thead th');
            var colCount = thsLocal.length;
            Object.keys(obj).forEach(function(k){
                var colIdx = parseInt(k,10);
                if (isNaN(colIdx) || colIdx < 0 || colIdx >= colCount) {
                    console.warn('Filtro restaurado con columna inválida, se omite:', k);
                    return;
                }
                var available = getUniqueValues(colIdx);
                console.log('[DEBUG] columna', colIdx, 'valores disponibles:', available.length, available.slice(0,6));
                var vals = Array.isArray(obj[k]) ? obj[k] : [];
                // conservar solo valores que aún existen en la columna
                var filtered = vals.filter(function(v){ return available.indexOf(String(v).trim()) !== -1; });
                console.log('[DEBUG] columna', colIdx, 'valores guardados:', vals, 'filtrados->', filtered);
                if (filtered.length > 0) selectedFilters[colIdx] = new Set(filtered);
            });
        } catch(e){ console.warn('No se pudo leer filtros de localStorage', e); }
    }

    // Restaurar filtros guardados
    loadFiltersFromStorage();

    // Añadir botones de filtro a cada th
    var ths = table.querySelectorAll('thead th');
    ths.forEach(function(th, idx){
        th.style.position = 'relative';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'col-filter-btn';
        btn.title = 'Filtrar columna';
        btn.innerText = '▾';
        // badge para contador
        var badge = document.createElement('span');
        badge.className = 'col-filter-badge';
        badge.style.display = 'none';
        badge.innerText = '0';
        btn.appendChild(badge);
        btn.addEventListener('click', function(e){
            e.stopPropagation();
            toggleDropdown(th, idx, btn, badge);
        });
        th.appendChild(btn);
    });

    // Inicializar badges/estados según filtros restaurados
    ths.forEach(function(th, idx){
        var btnEl = th.querySelector('.col-filter-btn');
        var badgeEl = btnEl ? btnEl.querySelector('.col-filter-badge') : null;
        var count = (selectedFilters[idx] && selectedFilters[idx].size) ? selectedFilters[idx].size : 0;
        if (btnEl) {
            if (count > 0) { btnEl.classList.add('active'); if (badgeEl) { badgeEl.style.display = 'inline-block'; badgeEl.innerText = String(count); } }
            else { btnEl.classList.remove('active'); if (badgeEl) { badgeEl.style.display = 'none'; badgeEl.innerText = '0'; } }
        }
    });
    // Aplicar filtros restaurados al cargar la página
    currentPage = 1;
    applyFilters();

    // Construir lista única de valores para una columna
    function getUniqueValues(colIndex, respectOtherFilters){
        if (typeof respectOtherFilters === 'undefined') respectOtherFilters = true;
        var vals = new Set();
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(r){
            // Si pedimos respetar otros filtros, comprobar si la fila cumple
            if (respectOtherFilters) {
                var skip = false;
                Object.keys(selectedFilters).forEach(function(col){
                    var ci = parseInt(col,10);
                    if (ci === colIndex) return; // ignorar la columna objetivo
                    var sel = selectedFilters[col];
                    if (!sel || sel.size === 0) return;
                    var cellOther = r.children[ci];
                    var valOther = cellOther ? cellOther.innerText.trim() : '';
                    if (!sel.has(valOther)) { skip = true; }
                });
                if (skip) return; // esta fila no aporta valores para la columna objetivo
            }
            var cell = r.children[colIndex];
            if (!cell) return;
            var txt = cell.innerText.trim();
            vals.add(txt);
        });
        return Array.from(vals).sort();
    }

    // Crear/mostrar/ocultar dropdown
    function toggleDropdown(th, colIndex, btn, badge){
        // Cerrar otros
        document.querySelectorAll('.col-filter-dropdown').forEach(function(d){ d.remove(); });

        var values = getUniqueValues(colIndex);
        var dropdown = document.createElement('div');
        dropdown.className = 'col-filter-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = 'calc(100% + 6px)';
        dropdown.style.left = '0';
        dropdown.style.background = '#fff';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        dropdown.style.padding = '8px';
        dropdown.style.zIndex = 1000;
        dropdown.style.maxHeight = '240px';
        dropdown.style.overflow = 'auto';
        dropdown.style.minWidth = '180px';

        // Lista de checkboxes
        var list = document.createElement('div');
        values.forEach(function(v){
            var id = 'chk_' + colIndex + '_' + Math.random().toString(36).substr(2,6);
            var wrap = document.createElement('div');
            wrap.style.marginBottom = '4px';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = id;
            cb.value = v;
            cb.style.marginRight = '6px';
            // si ya hay seleccion previa, marcar
            if (selectedFilters[colIndex] && selectedFilters[colIndex].has(v)) cb.checked = true;
            var lbl = document.createElement('label');
            lbl.htmlFor = id;
            lbl.innerText = v;
            wrap.appendChild(cb);
            wrap.appendChild(lbl);
            list.appendChild(wrap);
        });
        dropdown.appendChild(list);

        // Botones
        var btns = document.createElement('div');
        btns.style.display = 'flex';
        btns.style.justifyContent = 'space-between';
        btns.style.marginTop = '8px';

        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.innerText = 'Limpiar';
        clearBtn.style.background = '#f44336';
        clearBtn.style.border = 'none';
        clearBtn.style.color = '#fff';
        clearBtn.style.padding = '6px 8px';
        clearBtn.style.borderRadius = '3px';
        clearBtn.addEventListener('click', function(){
            // desmarcar todos
            dropdown.querySelectorAll('input[type=checkbox]').forEach(function(c){ c.checked = false; });
            delete selectedFilters[colIndex];
            dropdown.remove();
            // actualizar estado visual del botón
            var btnEl = th.querySelector('.col-filter-btn');
            var badgeEl = btnEl ? btnEl.querySelector('.col-filter-badge') : null;
            if (btnEl) { btnEl.classList.remove('active'); if (badgeEl) { badgeEl.style.display = 'none'; badgeEl.innerText = '0'; } }
            saveFiltersToStorage();
            applyFilters();
        });

        var applyBtn = document.createElement('button');
        applyBtn.type = 'button';
        applyBtn.innerText = 'Aplicar';
        applyBtn.style.background = '#1976d2';
        applyBtn.style.border = 'none';
        applyBtn.style.color = '#fff';
        applyBtn.style.padding = '6px 8px';
        applyBtn.style.borderRadius = '3px';
        applyBtn.addEventListener('click', function(){
            var sels = new Set();
            dropdown.querySelectorAll('input[type=checkbox]:checked').forEach(function(c){ sels.add(c.value); });
            if (sels.size > 0) selectedFilters[colIndex] = sels; else delete selectedFilters[colIndex];
            // actualizar estado visual del botón
            var btnEl = th.querySelector('.col-filter-btn');
            var badgeEl = btnEl ? btnEl.querySelector('.col-filter-badge') : null;
            if (btnEl) {
                if (sels.size > 0) { btnEl.classList.add('active'); if (badgeEl) { badgeEl.style.display = 'inline-block'; badgeEl.innerText = String(sels.size); } }
                else { btnEl.classList.remove('active'); if (badgeEl) { badgeEl.style.display = 'none'; badgeEl.innerText = '0'; } }
            }
            saveFiltersToStorage();
            dropdown.remove();
            applyFilters();
        });

        btns.appendChild(clearBtn);
        btns.appendChild(applyBtn);
        dropdown.appendChild(btns);

        th.appendChild(dropdown);
    }

    // Aplicar filtros por columnas
    function applyFilters(){
        // marcar filas que cumplen filtros
        var rows = Array.from(table.querySelectorAll('tbody tr'));
        console.log('[DEBUG] aplicando filtros, selectedFilters keys:', Object.keys(selectedFilters));
        var visibleRows = [];
        rows.forEach(function(r){
            var show = true;
            Object.keys(selectedFilters).forEach(function(col){
                var colIndex = parseInt(col,10);
                var sel = selectedFilters[col];
                console.log('[DEBUG] comprobando fila col', colIndex, 'seleccionados:', sel ? Array.from(sel) : null);
                if (!sel || sel.size === 0) return;
                var cell = r.children[colIndex];
                var val = cell ? cell.innerText.trim() : '';
                if (!sel.has(val)) show = false;
            });
            if (show) visibleRows.push(r);
            // ocultamos todas por ahora; renderPagination mostrará la página correcta
            r.style.display = 'none';
        });
        console.log('[DEBUG] filas totales:', rows.length, 'filas visibles tras filtros:', visibleRows.length);
        renderPagination(visibleRows);
    }

    // --- Paginación ---
    function renderPagination(visibleRows){
        var total = visibleRows.length;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
        var start = (currentPage - 1) * pageSize;
        var end = start + pageSize;
        console.log('[DEBUG] renderPagination: total=', total, 'pageSize=', pageSize, 'currentPage=', currentPage, 'totalPages=', totalPages, 'start=', start, 'end=', end);
        // ocultar todos
        table.querySelectorAll('tbody tr').forEach(function(r){ r.style.display = 'none'; });
        var pageRows = visibleRows.slice(start, end);
        console.log('[DEBUG] renderPagination: nro filas en página=', pageRows.length);
        pageRows.forEach(function(r, i){
            console.log('[DEBUG] mostrando fila idx=', start + i, 'contenido:', r.innerText.replace(/\s+/g,' ').substr(0,120));
            r.style.display = '';
        });
        updatePageInfo(currentPage, totalPages, total);
    }

    function updatePageInfo(page, totalPages, totalRows){
        var info = document.getElementById('pageInfo');
        if (!info) return;
        info.innerText = 'Página ' + page + ' de ' + totalPages + ' (' + totalRows + ')';
    }

    // Controls
    var prevPageBtn = document.getElementById('prevPage');
    var nextPageBtn = document.getElementById('nextPage');
    var pageSizeSelect = document.getElementById('pageSizeSelect');
    if (prevPageBtn) prevPageBtn.addEventListener('click', function(){ if (currentPage>1){ currentPage--; applyFilters(); } });
    if (nextPageBtn) nextPageBtn.addEventListener('click', function(){ currentPage++; applyFilters(); });
    if (pageSizeSelect) pageSizeSelect.addEventListener('change', function(){ pageSize = parseInt(this.value,10)||25; currentPage = 1; applyFilters(); });

    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', function(){
        document.querySelectorAll('.col-filter-dropdown').forEach(function(d){ d.remove(); });
    });

    // Limpiar todos los filtros
    function clearAllFilters(){
        selectedFilters = {};
        // reset badges
        var ths = table.querySelectorAll('thead th');
        ths.forEach(function(th){
            var btnEl = th.querySelector('.col-filter-btn');
            var badgeEl = btnEl ? btnEl.querySelector('.col-filter-badge') : null;
            if (btnEl) { btnEl.classList.remove('active'); if (badgeEl) { badgeEl.style.display = 'none'; badgeEl.innerText = '0'; } }
        });
        try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
        applyFilters();
    }

    // Enlazar botón Limpiar todos
    var clearAllBtn = document.getElementById('clearAllBtn');
    var modalOverlay = document.getElementById('modalOverlay');
    var modalConfirm = document.getElementById('modalConfirm');
    var modalCancel = document.getElementById('modalCancel');
    if (clearAllBtn) clearAllBtn.addEventListener('click', function(){ if (modalOverlay) modalOverlay.style.display = 'flex'; });
    if (modalCancel) modalCancel.addEventListener('click', function(){ if (modalOverlay) modalOverlay.style.display = 'none'; });
    if (modalConfirm) modalConfirm.addEventListener('click', function(){ if (modalOverlay) modalOverlay.style.display = 'none'; clearAllFilters(); });

    // Evitar cierre inmediato al click dentro del dropdown
    table.addEventListener('click', function(e){ e.stopPropagation(); });

    // Exportar a PDF - abrir una ventana limpia con solo la tabla y lanzar impresión
    exportBtn.addEventListener('click', function(){
        try {
            var printWin = window.open('', '_blank');
            if (!printWin) { window.print(); return; }
            // Clonar estilos esenciales para impresión
            var styles = ''+
                '<style>html,body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:8px;color:#000}'+
                'table{width:100%;border-collapse:collapse} th,td{padding:6px;border:1px solid #ddd;text-align:left;font-size:12px} th{background:#f0f0f0}'+
                '@media print{ body{margin:0} } @page{ margin:10mm; }</style>';
            // Solo incluir la tabla (sin encabezados ni controles)
            var content = '<!doctype html><html><head><meta charset="utf-8"><title>Imprimir</title>'+styles+'</head><body>' + document.getElementById('grid').outerHTML + '</body></html>';
            printWin.document.open();
            printWin.document.write(content);
            printWin.document.close();
            printWin.focus();
            setTimeout(function(){ printWin.print(); /* no forzar close: dejar al usuario decidir */ }, 300);
        } catch(e){ console.error('Error al intentar imprimir:', e); window.print(); }
    });
    
    // Cerrar sesión: llamar al endpoint server-side y limpiar storage
    var btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function(){
            // Intentar cerrar sesión en servidor y luego redirigir
            fetch('/BACKOFFICE/logout.php', { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function(resp){
                try { localStorage.removeItem('nombreUsuario'); } catch(e){}
                // Redirigir al login/portada
                var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
                window.location.href = baseUrl + '/public/index.html';
            }).catch(function(err){
                console.error('Error logout:', err);
                try { localStorage.removeItem('nombreUsuario'); } catch(e){}
                var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
                window.location.href = baseUrl + '/public/index.html';
            });
        });
    }
});
</script>
</body>
</html>
