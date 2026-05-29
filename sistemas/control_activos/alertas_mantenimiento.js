// alertas_mantenimiento.js - Control de Activos
var API = 'api/datos.php';

var allData = [];
var searchTxt = '';
var curPage = 1;
var pageSize = 25;
var sortKey = 'proxima_alerta';
var sortDir = 'asc';

var COLS = [
    { key: 'id_alerta', label: 'ID', width: 50, sortable: true },
    { key: 'activo_nombre', label: 'Activo', width: 200, sortable: true },
    { key: 'tipo_alerta', label: 'Tipo Alerta', width: 150, sortable: true },
    { key: 'periodicidad_dias', label: 'Cada (días)', width: 100, sortable: true },
    { key: 'periodicidad_km', label: 'Cada (km)', width: 100, sortable: true },
    { key: 'ultima_ejecucion', label: 'Última Ejec.', width: 110, sortable: true },
    { key: 'proxima_alerta', label: 'Próxima Alerta', width: 120, sortable: true },
    { key: 'activo', label: 'Activo', width: 80, sortable: true },
    { key: 'acciones', label: 'Acciones', width: 80, sortable: false }
];

function buildTableHead() {
    var html = '';
    COLS.forEach(function(col) {
        var cls = col.sortable ? 'sortable' : '';
        var dir = (sortKey === col.key) ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
        html += '<th class="' + cls + '" data-key="' + col.key + '" style="width:' + col.width + 'px">' + col.label + dir + '</th>';
    });
    document.querySelector('#tblAlertas thead tr').innerHTML = html;
}

function updateSortArrows() {
    document.querySelectorAll('#tblAlertas thead th.sortable').forEach(function(th) {
        var k = th.dataset.key;
        th.innerHTML = COLS.find(function(c) { return c.key === k; }).label;
        if (k === sortKey) th.innerHTML += (sortDir === 'asc' ? ' ▲' : ' ▼');
    });
}

function cargarAlertas() {
    $.getJSON(API, { action: 'listar_alertas' }, function(res) {
        if (res.success) {
            allData = res.data || [];
        } else if (res.redirect) {
            window.location.href = res.redirect;
        } else {
            allData = [];
        }
        applyAll();
    });
}

function applyAll() {
    var filtered = allData;
    if (searchTxt) {
        var s = searchTxt.toLowerCase();
        filtered = filtered.filter(function(r) {
            return (r.activo_nombre && r.activo_nombre.toLowerCase().indexOf(s) >= 0) ||
                   (r.tipo_alerta && r.tipo_alerta.toLowerCase().indexOf(s) >= 0);
        });
    }

    filtered.sort(function(a, b) {
        var va = (a[sortKey] || '').toString().toLowerCase();
        var vb = (b[sortKey] || '').toString().toLowerCase();
        if (sortKey === 'id_alerta') { va = parseInt(a[sortKey] || 0); vb = parseInt(b[sortKey] || 0); }
        if (sortKey === 'periodicidad_dias' || sortKey === 'periodicidad_km') {
            va = parseInt(a[sortKey] || 0); vb = parseInt(b[sortKey] || 0);
        }
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / pageSize));
    if (curPage > pages) curPage = pages;
    var start = (curPage - 1) * pageSize;
    var pageData = filtered.slice(start, start + pageSize);

    renderRows(pageData);
    updatePageInfo(curPage, pages, total);
}

function renderRows(rows) {
    var tbody = document.getElementById('tblAlertasBody');
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="' + COLS.length + '" style="text-align:center;padding:30px;color:#888">No hay alertas configuradas.</td></tr>';
        return;
    }
    var html = '';
    rows.forEach(function(r) {
        html += '<tr ondblclick="editarAlerta(' + r.id_alerta + ')">';
        COLS.forEach(function(col) {
            var val = r[col.key] || '';
            if (col.key === 'activo') {
                val = val == '1' ? '<span style="color:#27ae60;font-weight:700;">✓</span>' : '<span style="color:#e74c3c;">✗</span>';
            } else if (col.key === 'proxima_alerta') {
                var cls = '';
                if (r.proxima_alerta) {
                    var hoy = new Date();
                    var prox = new Date(r.proxima_alerta + 'T00:00:00');
                    var diff = Math.ceil((prox - hoy) / (1000*60*60*24));
                    if (diff <= 0) cls = 'badge-vencida';
                    else if (diff <= 7) cls = 'badge-proxima';
                }
                val = '<span class="alerta-dias ' + cls + '">' + formatFechaCorta(val) + '</span>';
            } else if (col.key === 'ultima_ejecucion') {
                val = formatFechaCorta(val);
            } else if (col.key === 'acciones') {
                val = '<button class="btn-ca btn-ca-danger btn-sm" onclick="event.stopPropagation();eliminarAlerta(' + r.id_alerta + ')"><i class="fas fa-trash"></i></button>';
            } else {
                val = escHtml(val);
            }
            html += '<td style="max-width:' + col.width + 'px">' + val + '</td>';
        });
        html += '</tr>';
    });
    tbody.innerHTML = html;
}

function updatePageInfo(page, pages, total) {
    document.getElementById('lblPageInfo').textContent = total + ' alertas';
    document.getElementById('lblPageNum').textContent = page + ' / ' + pages;
}

function bindControls() {
    document.getElementById('btnNuevaAlerta').addEventListener('click', function() {
        document.getElementById('formAlerta').reset();
        document.getElementById('id_alerta').value = '0';
        document.getElementById('modalTitle').textContent = 'Configurar Alerta';
        document.getElementById('activo_flag').value = '1';
        document.getElementById('modalAlerta').classList.add('open');
        cargarCombos();
    });

    document.getElementById('btnRefrescar').addEventListener('click', cargarAlertas);

    document.getElementById('txtBuscar').addEventListener('input', function() {
        searchTxt = this.value;
        curPage = 1;
        applyAll();
    });

    document.getElementById('selPageSize').addEventListener('change', function() {
        pageSize = parseInt(this.value);
        curPage = 1;
        applyAll();
    });

    document.getElementById('btnPrevPage').addEventListener('click', function() {
        if (curPage > 1) { curPage--; applyAll(); }
    });

    document.getElementById('btnNextPage').addEventListener('click', function() {
        var pages = Math.max(1, Math.ceil(allData.length / pageSize));
        if (curPage < pages) { curPage++; applyAll(); }
    });

    document.querySelector('#tblAlertas thead').addEventListener('click', function(e) {
        var th = e.target.closest('th.sortable');
        if (!th) return;
        var k = th.dataset.key;
        if (sortKey === k) sortDir = (sortDir === 'asc' ? 'desc' : 'asc');
        else { sortKey = k; sortDir = 'asc'; }
        updateSortArrows();
        applyAll();
    });

    // Calcular próxima alerta automáticamente
    document.getElementById('ultima_ejecucion').addEventListener('change', calcularProximaAlerta);
    document.getElementById('periodicidad_dias').addEventListener('input', calcularProximaAlerta);
}

function calcularProximaAlerta() {
    var ultima = document.getElementById('ultima_ejecucion').value;
    var dias = parseInt(document.getElementById('periodicidad_dias').value);
    if (ultima && dias > 0) {
        var d = new Date(ultima + 'T00:00:00');
        d.setDate(d.getDate() + dias);
        var y = d.getFullYear();
        var m = ('0' + (d.getMonth() + 1)).slice(-2);
        var day = ('0' + d.getDate()).slice(-2);
        document.getElementById('proxima_alerta').value = y + '-' + m + '-' + day;
    }
}

function bindModalEvents() {
    document.getElementById('btnCerrarModal').addEventListener('click', function() {
        document.getElementById('modalAlerta').classList.remove('open');
    });
    document.getElementById('btnCancelarModal').addEventListener('click', function() {
        document.getElementById('modalAlerta').classList.remove('open');
    });
    document.getElementById('modalAlerta').addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('open');
    });

    document.getElementById('formAlerta').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarAlerta();
    });
}

function cargarCombos() {
    $.getJSON(API, { action: 'listar_activos' }, function(res) {
        var sel = document.getElementById('id_activo');
        var currentVal = sel.value;
        sel.innerHTML = '<option value="">Seleccione...</option>';
        if (res.success && res.data) {
            res.data.forEach(function(a) {
                var nombre = a.marca + ' ' + a.modelo + (a.placa ? ' - ' + a.placa : '') + ' (' + a.tipo_activo + ')';
                sel.innerHTML += '<option value="' + a.id_activo + '">' + escHtml(nombre) + '</option>';
            });
        }
        if (currentVal) sel.value = currentVal;
    });
}

function editarAlerta(id) {
    $.getJSON(API, { action: 'obtener_alerta', id: id }, function(res) {
        if (res.success) {
            var d = res.data;
            document.getElementById('id_alerta').value = d.id_alerta;
            document.getElementById('id_activo').value = d.id_activo || '';
            document.getElementById('tipo_alerta').value = d.tipo_alerta || '';
            document.getElementById('periodicidad_dias').value = d.periodicidad_dias || '';
            document.getElementById('periodicidad_km').value = d.periodicidad_km || '';
            document.getElementById('ultima_ejecucion').value = d.ultima_ejecucion || '';
            document.getElementById('proxima_alerta').value = d.proxima_alerta || '';
            document.getElementById('activo_flag').value = d.activo == '1' ? '1' : '0';
            document.getElementById('modalTitle').textContent = 'Editar Alerta';
            document.getElementById('modalAlerta').classList.add('open');
            cargarCombos();
        } else if (res.redirect) {
            window.location.href = res.redirect;
        }
    });
}

function guardarAlerta() {
    var data = {
        id_alerta: document.getElementById('id_alerta').value,
        id_activo: document.getElementById('id_activo').value,
        tipo_alerta: document.getElementById('tipo_alerta').value,
        periodicidad_dias: document.getElementById('periodicidad_dias').value,
        periodicidad_km: document.getElementById('periodicidad_km').value,
        ultima_ejecucion: document.getElementById('ultima_ejecucion').value,
        proxima_alerta: document.getElementById('proxima_alerta').value,
        activo: document.getElementById('activo_flag').value
    };
    data.action = 'guardar_alerta';

    $.ajax({
        url: API,
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Alerta guardada correctamente', 'success');
                document.getElementById('modalAlerta').classList.remove('open');
                cargarAlertas();
            } else if (res.redirect) {
                window.location.href = res.redirect;
            } else {
                showNotif('Error: ' + (res.mensaje || 'Error desconocido'), 'error');
            }
        },
        error: function() {
            showNotif('Error de conexión', 'error');
        }
    });
}

function eliminarAlerta(id) {
    if (!confirm('¿Eliminar esta alerta?')) return;
    $.ajax({
        url: API,
        method: 'POST',
        data: { action: 'eliminar_alerta', id: id },
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Alerta eliminada', 'success');
                cargarAlertas();
            } else if (res.redirect) {
                window.location.href = res.redirect;
            } else {
                showNotif('Error: ' + (res.mensaje || 'Error desconocido'), 'error');
            }
        },
        error: function() {
            showNotif('Error de conexión', 'error');
        }
    });
}

function formatFechaCorta(v) {
    if (!v) return '';
    try {
        var parts = v.split(' ');
        if (parts.length > 0) {
            var dateParts = parts[0].split('-');
            if (dateParts.length === 3) {
                return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
            }
        }
        return v;
    } catch (e) { return v; }
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

function showNotif(msg, type) {
    var bar = document.getElementById('notifBar');
    if (!bar) return;
    bar.textContent = msg;
    bar.className = 'notif-bar notif-' + type;
    bar.style.display = 'block';
    setTimeout(function() { bar.style.display = 'none'; }, 3000);
}

// ── Init ────────────────────────────────────────────────────────
buildTableHead();
bindControls();
bindModalEvents();
cargarAlertas();
