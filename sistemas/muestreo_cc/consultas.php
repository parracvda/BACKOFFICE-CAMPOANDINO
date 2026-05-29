<?php
// consultas.php - Reporte de Muestreo Control de Calidad
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

// Consultar registros de muestreo CC con JOIN a observaciones (solo activos)
$sql = "SELECT
            r.id,
            r.almacen,
            r.fecha,
            r.turno,
            r.hora,
            r.maquina,
            r.descripcion,
            r.responsable,
            r.tipo_producto,
            r.cantidad_muestreada,
            r.observaciones,
            r.humedad_promedio,
            r.cantidad_observada,
            r.porcentaje_general,
            r.comentarios,
            r.acciones_preventivas,
            r.fecha_registro,
            r.fecha_actualizacion,
            o.id AS obs_id,
            o.nombre_material,
            o.nombre_obs,
            o.cantidad AS obs_cantidad,
            o.porcentaje AS obs_porcentaje
        FROM sig_registrocc r
        LEFT JOIN sig_registrocc_observaciones o ON o.id_registro = r.id
        WHERE (r.anulado IS NULL OR r.anulado = 0)
        ORDER BY r.fecha_registro DESC, r.id DESC";

$res = $conn->query($sql);
$rows = [];
if ($res && $res->num_rows > 0) {
    while ($r = $res->fetch_assoc()) $rows[] = $r;
}
// Liberar resultado y cerrar conexión inmediatamente después de obtener los datos
if ($res instanceof mysqli_result) {
    $res->free();
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Reporte de Muestreo Control de Calidad</title>
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
    #grid thead th.col-fecha { width: 110px; }
    #grid thead th.col-hora { width: 80px; }
    #grid thead th.col-almacen { width: 130px; }
    #grid thead th.col-maquina { width: 120px; }
    #grid thead th.col-cant { width: 90px; }
    #grid thead th.col-pct { width: 80px; }
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

    /* Botones de acción en la tabla (solo íconos) */
    .btn-accion {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border: none;
        border-radius: 50%;
        font-size: 15px;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s, transform 0.1s;
        margin: 0 2px;
        line-height: 1;
    }
    .btn-accion:hover { transform: scale(1.12); }
    .btn-editar   { background: #1976d2; color: #fff; }
    .btn-editar:hover   { background: #1565c0; }
    .btn-anular    { background: #d32f2f; color: #fff; }
    .btn-anular:hover    { background: #b71c1c; }
    .col-acciones { width: 80px; text-align: center; white-space: nowrap; }

    /* Modal de edición (más grande) */
    .modal-edit { width: 520px; max-width: 94vw; }
    .modal-edit .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px 16px;
        margin-top: 10px;
    }
    .modal-edit .form-grid .full-width { grid-column: 1 / -1; }
    .modal-edit label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #555;
        margin-bottom: 3px;
    }
    .modal-edit input,
    .modal-edit select,
    .modal-edit textarea {
        width: 100%;
        padding: 7px 9px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 13px;
        font-family: inherit;
        box-sizing: border-box;
    }
    .modal-edit textarea { resize: vertical; min-height: 50px; }
    .modal-edit .row { margin-top: 14px; }
    .btn-success { background: #2e7d32; color: #fff; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer; }
    .btn-success:hover { background: #1b5e20; }
    .btn-success:disabled { background: #a5d6a7; cursor: not-allowed; }

    /* Modal anular */
    .modal-anular .icon-warning {
        font-size: 40px;
        color: #f57c00;
        text-align: center;
        margin-bottom: 8px;
    }
    .modal-anular p { text-align: center; font-size: 14px; color: #555; margin: 6px 0; }

    /* Notificación tipo toast */
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 280px;
        max-width: 420px;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        display: none;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-family: Arial, Helvetica, sans-serif;
        animation: toastIn 0.3s ease;
    }
    .toast-notification.toast-success { background: #2e7d32; color: #fff; }
    .toast-notification.toast-error   { background: #d32f2f; color: #fff; }
    .toast-notification .toast-icon   { font-size: 22px; flex-shrink: 0; }
    .toast-notification .toast-msg    { flex: 1; line-height: 1.4; }
    .toast-notification .toast-close  {
        background: none; border: none; color: inherit; font-size: 18px;
        cursor: pointer; padding: 0 2px; opacity: 0.8; flex-shrink: 0;
    }
    .toast-notification .toast-close:hover { opacity: 1; }
    @keyframes toastIn {
        from { transform: translateX(100%); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
    }
</style>
</head>
<body>
    <h2>Reporte de Muestreo Control de Calidad</h2>
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

    <!-- Modal confirmación anular -->
    <div id="modalAnularOverlay" class="modal-overlay">
        <div class="modal modal-anular" role="dialog" aria-modal="true" aria-labelledby="modalAnularTitle">
            <div class="icon-warning">⚠</div>
            <h3 id="modalAnularTitle" style="text-align:center">Anular registro</h3>
            <p>¿Estás seguro que deseas anular este registro?</p>
            <p style="font-size:12px;color:#999">El registro quedará oculto del reporte pero se conservará en la base de datos.</p>
            <div class="row" style="justify-content:center">
                <button id="modalAnularCancel" class="btn-secondary">Cancelar</button>
                <button id="modalAnularConfirm" class="btn-danger">Sí, anular</button>
            </div>
        </div>
    </div>

    <!-- Modal editar registro -->
    <div id="modalEditOverlay" class="modal-overlay">
        <div class="modal modal-edit" role="dialog" aria-modal="true" aria-labelledby="modalEditTitle">
            <h3 id="modalEditTitle">Editar registro #<span id="editIdDisplay"></span></h3>
            <input type="hidden" id="editId" value="">
            <div class="form-grid">
                <div>
                    <label for="editAlmacen">Tipo Inspección</label>
                    <select id="editAlmacen">
                        <option value="MATERIA PRIMA">MATERIA PRIMA</option>
                        <option value="PRODUCTOS TERMINADOS">PRODUCTOS TERMINADOS</option>
                        <option value="PRODUCTOS EN PROCESO">PRODUCTOS EN PROCESO</option>
                    </select>
                </div>
                <div>
                    <label for="editFecha">Fecha</label>
                    <input type="date" id="editFecha">
                </div>
                <div>
                    <label for="editTurno">Turno</label>
                    <select id="editTurno">
                        <option value="MAÑANA">MAÑANA</option>
                        <option value="NOCHE">NOCHE</option>
                    </select>
                </div>
                <div>
                    <label for="editHora">Hora</label>
                    <input type="time" id="editHora">
                </div>
                <div>
                    <label for="editMaquina">Máquina</label>
                    <input type="text" id="editMaquina" placeholder="Máquina">
                </div>
                <div>
                    <label for="editDescripcion">Descripción</label>
                    <input type="text" id="editDescripcion" placeholder="Descripción">
                </div>
                <div>
                    <label for="editTipoProducto">Tipo Producto</label>
                    <input type="text" id="editTipoProducto" placeholder="Tipo producto">
                </div>
                <div>
                    <label for="editCantMuestreada">Cant. Muestreada</label>
                    <input type="number" id="editCantMuestreada" min="0">
                </div>
                <div>
                    <label for="editHumedad">Humedad Promedio</label>
                    <input type="number" step="0.01" id="editHumedad" placeholder="0.00">
                </div>
                <div>
                    <label for="editObservaciones">¿Observaciones?</label>
                    <select id="editObservaciones">
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                    </select>
                </div>
                <div>
                    <label for="editCantObservada">Cant. Observada</label>
                    <input type="number" id="editCantObservada" min="0">
                </div>
                <div>
                    <label for="editPorcentaje">% General</label>
                    <input type="number" step="0.01" id="editPorcentaje" placeholder="0.00">
                </div>
                <div class="full-width">
                    <label for="editComentarios">Comentarios</label>
                    <textarea id="editComentarios" placeholder="Comentarios..."></textarea>
                </div>
                <div class="full-width">
                    <label for="editAcciones">Acciones Preventivas</label>
                    <textarea id="editAcciones" placeholder="Acciones preventivas..."></textarea>
                </div>
            </div>
            <div class="row">
                <button id="modalEditCancel" class="btn-secondary">Cancelar</button>
                <button id="modalEditConfirm" class="btn-success">Guardar cambios</button>
            </div>
        </div>
    </div>

    <!-- Notificación toast -->
    <div id="toastNotification" class="toast-notification">
        <span class="toast-icon" id="toastIcon">✓</span>
        <span class="toast-msg" id="toastMsg"></span>
        <button class="toast-close" id="toastClose" onclick="cerrarToast()">✕</button>
    </div>

    <table id="grid">
        <thead>
        <tr>
            <!-- <th class="col-id">ID</th> -->
            <th class="col-acciones">Acciones</th>
            <th class="col-fecha">Fecha</th>
            <th class="col-hora">Hora</th>
            <th class="col-turno">Turno</th>
            <th class="col-almacen">Tipo Inspección</th>
            <th class="col-maquina">Máquina</th>
            <th class="col-descripcion">Descripción</th>
            <th class="col-tipo">Tipo Producto</th>
            <th class="col-cant">Cant. Muestreada</th>
            <th class="col-cant">Cant. Observada</th>
            <th class="col-pct">% Observ.</th>
            <th class="col-humedad">Humedad</th>
            <th class="col-obs">Observaciones</th>
            <th class="col-material">Material</th>
            <th class="col-detalle">Detalle Obs.</th>
            <th class="col-cant">Cant. Detalle</th>
            <th class="col-pct">% Detalle</th>
            <th class="col-responsable">Responsable</th>
            <th class="col-comentarios">Comentarios</th>
            <th class="col-acciones">Acciones Preventivas</th>
            <!-- <th class="col-fecha">Fecha Registro</th> -->
        </tr>
        </thead>
        <tbody>
            <?php foreach($rows as $r): ?>
            <tr data-id="<?php echo intval($r['id'] ?? 0); ?>">
                <td class="col-acciones">
                    <button type="button" class="btn-accion btn-editar" onclick="editarRegistro(<?php echo intval($r['id'] ?? 0); ?>)">✎</button>
                    <button type="button" class="btn-accion btn-anular" onclick="anularRegistro(<?php echo intval($r['id'] ?? 0); ?>)">✕</button>
                </td>
                <td><?php
                    $fecha = $r['fecha'] ?? '';
                    echo htmlspecialchars((!empty($fecha) && strtotime($fecha)) ? date('d-m-Y', strtotime($fecha)) : $fecha);
                ?></td>
                <td><?php echo htmlspecialchars($r['hora'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['turno'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['almacen'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['maquina'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['descripcion'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['tipo_producto'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['cantidad_muestreada'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['cantidad_observada'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['porcentaje_general'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['humedad_promedio'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['observaciones'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['nombre_material'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['nombre_obs'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['obs_cantidad'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['obs_porcentaje'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['responsable'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['comentarios'] ?? ''); ?></td>
                <td><?php echo htmlspecialchars($r['acciones_preventivas'] ?? ''); ?></td>
                <td><?php
                    $freg = $r['fecha_registro'] ?? '';
                    // echo htmlspecialchars((!empty($freg) && strtotime($freg)) ? date('d-m-Y H:i', strtotime($freg)) : $freg);
                ?></td>
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

    var STORAGE_KEY = 'muestreocc_column_filters_v1';

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
                var vals = Array.isArray(obj[k]) ? obj[k] : [];
                // conservar solo valores que aún existen en la columna
                var filtered = vals.filter(function(v){ return available.indexOf(String(v).trim()) !== -1; });
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
        var visibleRows = [];
        rows.forEach(function(r){
            var show = true;
            Object.keys(selectedFilters).forEach(function(col){
                var colIndex = parseInt(col,10);
                var sel = selectedFilters[col];
                if (!sel || sel.size === 0) return;
                var cell = r.children[colIndex];
                var val = cell ? cell.innerText.trim() : '';
                if (!sel.has(val)) show = false;
            });
            if (show) visibleRows.push(r);
            // ocultamos todas por ahora; renderPagination mostrará la página correcta
            r.style.display = 'none';
        });
        renderPagination(visibleRows);
    }

    // --- Paginación ---
    function renderPagination(visibleRows){
        var total = visibleRows.length;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
        var start = (currentPage - 1) * pageSize;
        var end = start + pageSize;
        // ocultar todos
        table.querySelectorAll('tbody tr').forEach(function(r){ r.style.display = 'none'; });
        var pageRows = visibleRows.slice(start, end);
        pageRows.forEach(function(r){
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

    // ══ TOAST DE NOTIFICACIÓN ═══════════════════════════════════════════════
    var toastTimeout = null;

    window.mostrarToast = function(mensaje, tipo){
        tipo = tipo || 'success';
        var toast = document.getElementById('toastNotification');
        var icon = document.getElementById('toastIcon');
        var msg  = document.getElementById('toastMsg');
        if (!toast || !msg) return;

        // Limpiar timeout anterior
        if (toastTimeout) { clearTimeout(toastTimeout); toastTimeout = null; }

        toast.className = 'toast-notification toast-' + tipo;
        icon.innerText = tipo === 'success' ? '✓' : '✕';
        msg.innerText = mensaje;
        toast.style.display = 'flex';

        // Auto-ocultar después de 4 segundos
        toastTimeout = setTimeout(function(){
            toast.style.display = 'none';
            toastTimeout = null;
        }, 4000);
    };

    window.cerrarToast = function(){
        var toast = document.getElementById('toastNotification');
        if (toast) toast.style.display = 'none';
        if (toastTimeout) { clearTimeout(toastTimeout); toastTimeout = null; }
    };

    // ══ FUNCIONES GLOBALES: EDITAR Y ANULAR ═════════════════════════════════

    // Variable para almacenar datos de filas (para editar)
    var datosRegistros = {};

    // Recolectar datos de todas las filas al cargar
    (function(){
        var filas = table.querySelectorAll('tbody tr');
        filas.forEach(function(fila){
            var id = fila.getAttribute('data-id');
            if (!id) return;
            var celdas = fila.querySelectorAll('td');
            // La celda 0 es Acciones, la 1 es Fecha, etc.
            // Mapear según el orden de columnas en el PHP
            datosRegistros[id] = {
                fecha:              (celdas[1] ? celdas[1].innerText.trim() : ''),
                hora:               (celdas[2] ? celdas[2].innerText.trim() : ''),
                turno:              (celdas[3] ? celdas[3].innerText.trim() : ''),
                almacen:            (celdas[4] ? celdas[4].innerText.trim() : ''),
                maquina:            (celdas[5] ? celdas[5].innerText.trim() : ''),
                descripcion:        (celdas[6] ? celdas[6].innerText.trim() : ''),
                tipo_producto:      (celdas[7] ? celdas[7].innerText.trim() : ''),
                cantidad_muestreada:(celdas[8] ? celdas[8].innerText.trim() : ''),
                cantidad_observada: (celdas[9] ? celdas[9].innerText.trim() : ''),
                porcentaje_general: (celdas[10] ? celdas[10].innerText.trim() : ''),
                humedad_promedio:   (celdas[11] ? celdas[11].innerText.trim() : ''),
                observaciones:      (celdas[12] ? celdas[12].innerText.trim() : ''),
                comentarios:        (celdas[17] ? celdas[17].innerText.trim() : ''),
                acciones_preventivas:(celdas[18] ? celdas[18].innerText.trim() : '')
            };
        });
    })();

    // ── ANULAR ──────────────────────────────────────────────────────────
    var idAnular = null;
    var modalAnularOverlay = document.getElementById('modalAnularOverlay');
    var modalAnularConfirm = document.getElementById('modalAnularConfirm');
    var modalAnularCancel = document.getElementById('modalAnularCancel');

    window.anularRegistro = function(id){
        idAnular = id;
        if (modalAnularOverlay) modalAnularOverlay.style.display = 'flex';
    };

    if (modalAnularCancel) {
        modalAnularCancel.addEventListener('click', function(){
            modalAnularOverlay.style.display = 'none';
            idAnular = null;
        });
    }

    if (modalAnularConfirm) {
        modalAnularConfirm.addEventListener('click', function(){
            if (!idAnular) return;
            var btn = modalAnularConfirm;
            btn.disabled = true;
            btn.innerText = 'Anulando...';

            fetch('api/datos.php?action=anular_registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: idAnular })
            })
            .then(function(resp){ return resp.json(); })
            .then(function(data){
                if (data.success) {
                    // Eliminar la fila visualmente
                    var fila = table.querySelector('tbody tr[data-id="' + idAnular + '"]');
                    if (fila) fila.remove();
                    // Re-aplicar filtros y paginación
                    applyFilters();
                    // Mostrar notificación
                    mostrarToast('Registro anulado correctamente.', 'success');
                } else {
                    mostrarToast(data.mensaje || 'No se pudo anular el registro', 'error');
                }
            })
            .catch(function(err){
                mostrarToast('Error de conexión al anular: ' + err.message, 'error');
            })
            .finally(function(){
                btn.disabled = false;
                btn.innerText = 'Sí, anular';
                modalAnularOverlay.style.display = 'none';
                idAnular = null;
            });
        });
    }

    // ── EDITAR ──────────────────────────────────────────────────────────
    var modalEditOverlay = document.getElementById('modalEditOverlay');
    var modalEditConfirm = document.getElementById('modalEditConfirm');
    var modalEditCancel = document.getElementById('modalEditCancel');
    var editIdInput = document.getElementById('editId');
    var editIdDisplay = document.getElementById('editIdDisplay');

    window.editarRegistro = function(id){
        var d = datosRegistros[id];
        if (!d) {
            mostrarToast('No se encontraron datos del registro #' + id, 'error');
            return;
        }

        editIdInput.value = id;
        if (editIdDisplay) editIdDisplay.innerText = id;

        // Convertir fecha DD-MM-YYYY a YYYY-MM-DD para input date
        var fechaParts = d.fecha.split('-');
        var fechaValue = '';
        if (fechaParts.length === 3) {
            fechaValue = fechaParts[2] + '-' + fechaParts[1] + '-' + fechaParts[0];
        } else {
            fechaValue = d.fecha;
        }

        document.getElementById('editAlmacen').value          = d.almacen || 'MATERIA PRIMA';
        document.getElementById('editFecha').value            = fechaValue;
        document.getElementById('editTurno').value            = d.turno || 'MAÑANA';
        document.getElementById('editHora').value             = d.hora || '';
        document.getElementById('editMaquina').value          = d.maquina || '';
        document.getElementById('editDescripcion').value      = d.descripcion || '';
        document.getElementById('editTipoProducto').value     = d.tipo_producto || '';
        document.getElementById('editCantMuestreada').value   = d.cantidad_muestreada || 0;
        document.getElementById('editHumedad').value          = d.humedad_promedio || '';
        document.getElementById('editObservaciones').value    = d.observaciones === 'SI' ? 'SI' : 'NO';
        document.getElementById('editCantObservada').value    = d.cantidad_observada || 0;
        document.getElementById('editPorcentaje').value       = d.porcentaje_general || '';
        document.getElementById('editComentarios').value      = d.comentarios || '';
        document.getElementById('editAcciones').value         = d.acciones_preventivas || '';

        if (modalEditOverlay) modalEditOverlay.style.display = 'flex';
    };

    if (modalEditCancel) {
        modalEditCancel.addEventListener('click', function(){
            modalEditOverlay.style.display = 'none';
        });
    }

    if (modalEditConfirm) {
        modalEditConfirm.addEventListener('click', function(){
            var id = editIdInput.value;
            if (!id) return;

            var btn = modalEditConfirm;
            btn.disabled = true;
            btn.innerText = 'Guardando...';

            var data = {
                id: parseInt(id, 10),
                almacen:            document.getElementById('editAlmacen').value,
                fecha:              document.getElementById('editFecha').value,
                turno:              document.getElementById('editTurno').value,
                hora:               document.getElementById('editHora').value,
                maquina:            document.getElementById('editMaquina').value,
                descripcion:        document.getElementById('editDescripcion').value,
                tipo_producto:      document.getElementById('editTipoProducto').value,
                cantidad_muestreada:parseInt(document.getElementById('editCantMuestreada').value, 10) || 0,
                humedad_promedio:   parseFloat(document.getElementById('editHumedad').value) || null,
                observaciones:      document.getElementById('editObservaciones').value,
                cantidad_observada: parseInt(document.getElementById('editCantObservada').value, 10) || 0,
                porcentaje_general: parseFloat(document.getElementById('editPorcentaje').value) || 0,
                comentarios:        document.getElementById('editComentarios').value,
                acciones_preventivas: document.getElementById('editAcciones').value
            };

            fetch('api/datos.php?action=actualizar_registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(function(resp){ return resp.json(); })
            .then(function(result){
                if (result.success) {
                    mostrarToast('Registro actualizado correctamente.', 'success');
                    modalEditOverlay.style.display = 'none';
                    // Recargar la página para reflejar cambios
                    location.reload();
                } else {
                    mostrarToast(result.mensaje || 'No se pudo actualizar', 'error');
                }
            })
            .catch(function(err){
                mostrarToast('Error de conexión: ' + err.message, 'error');
            })
            .finally(function(){
                btn.disabled = false;
                btn.innerText = 'Guardar cambios';
            });
        });
    }

    // Cerrar modales al hacer clic fuera del contenido
    if (modalAnularOverlay) {
        modalAnularOverlay.addEventListener('click', function(e){
            if (e.target === modalAnularOverlay) modalAnularOverlay.style.display = 'none';
        });
    }
    if (modalEditOverlay) {
        modalEditOverlay.addEventListener('click', function(e){
            if (e.target === modalEditOverlay) modalEditOverlay.style.display = 'none';
        });
    }
});
</script>
</body>
</html>
