// operadores.js - Control de Activos (tabla nativa, sin DevExtreme)
var API = 'api/datos.php';

var allData = [];
var searchTxt = '';
var curPage = 1;
var pageSize = 25;
var sortKey = 'nombre_completo';
var sortDir = 'asc';

var COLS = [
    { key: 'nombre_completo', label: 'Nombre Completo', w: '220px', sort: true },
    { key: 'documento',       label: 'Documento',        w: '120px', sort: true },
    { key: 'licencia',        label: 'Licencia',         w: '140px', sort: true },
    { key: 'telefono',        label: 'Tel\u00e9fono',            w: '130px', sort: true },
    { key: 'correo',          label: 'Correo',           w: '200px', sort: true },
    { key: 'activo',          label: 'Activo',           w: '80px',  sort: true, align: 'center' },
    { key: 'fecha_registro',  label: 'Registrado',       w: '150px', sort: true },
    { key: '_acc',            label: 'Acciones',         w: '90px',  sort: false }
];

$(function() {
    buildTableHead();
    cargarOperadores();
    bindControls();
    bindModalEvents();
});

function buildTableHead() {
    var tr = document.querySelector('#tblOperadores thead tr');
    if (!tr) return;
    tr.innerHTML = '';
    COLS.forEach(function(col) {
        var th = document.createElement('th');
        if (col.w) th.style.width = col.w;
        th.dataset.key = col.key;
        var span = document.createElement('span');
        span.textContent = col.label;
        th.appendChild(span);
        if (col.sort) {
            th.classList.add('sortable');
            th.addEventListener('click', function() {
                if (sortKey === col.key) sortDir = (sortDir === 'asc' ? 'desc' : 'asc');
                else { sortKey = col.key; sortDir = 'asc'; }
                updateSortArrows();
                applyAll();
            });
        }
        tr.appendChild(th);
    });
    updateSortArrows();
}

function updateSortArrows() {
    document.querySelectorAll('#tblOperadores thead th').forEach(function(th) {
        var k = th.dataset.key;
        var span = th.querySelector('span');
        if (!span) return;
        if (k === sortKey) {
            span.textContent = COLS.find(function(c) { return c.key === k; }).label + (sortDir === 'asc' ? ' \u25B2' : ' \u25BC');
        } else {
            span.textContent = COLS.find(function(c) { return c.key === k; }).label;
        }
    });
}

function cargarOperadores() {
    $.getJSON(API, { action: 'listar_operadores' }, function(res) {
        if (res.success) {
            allData = res.data || [];
            applyAll();
        } else if (res.redirect) {
            window.location.href = res.redirect;
        }
    });
}

function applyAll() {
    var data = allData.slice();
    if (searchTxt) {
        var q = searchTxt.toLowerCase();
        data = data.filter(function(r) {
            return COLS.some(function(c) {
                if (c.key === '_acc') return false;
                return String(r[c.key] || '').toLowerCase().indexOf(q) !== -1;
            });
        });
    }
    if (sortKey && sortKey !== '_acc') {
        data.sort(function(a, b) {
            var na = parseFloat(a[sortKey]);
            var nb = parseFloat(b[sortKey]);
            if (!isNaN(na) && !isNaN(nb)) {
                return sortDir === 'asc' ? na - nb : nb - na;
            }
            var va = String(a[sortKey] || '').toLowerCase();
            var vb = String(b[sortKey] || '').toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }
    var total = data.length;
    var pages = Math.max(1, Math.ceil(total / pageSize));
    if (curPage > pages) curPage = pages;
    renderRows(data.slice((curPage - 1) * pageSize, curPage * pageSize));
    updatePageInfo(curPage, pages, total);
}

function renderRows(rows) {
    var tbody = document.getElementById('tblOperadoresBody');
    if (!tbody) return;
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="' + COLS.length + '" style="text-align:center;padding:28px;color:#888">Sin registros</td></tr>';
        return;
    }
    var html = '';
    rows.forEach(function(r) {
        html += '<tr onclick="editarOperador(' + r.id_operador + ')">';
        COLS.forEach(function(col) {
            if (col.key === '_acc') {
                html += '<td style="white-space:nowrap" onclick="event.stopPropagation()">' +
                    '<button class="btn-ca btn-ca-danger btn-sm" onclick="eliminarOperador(' + r.id_operador + ')"><i class="fa fa-trash"></i></button>' +
                    '</td>';
            } else if (col.key === 'activo') {
                var checked = r.activo == 1 || r.activo === '1';
                html += '<td style="text-align:center"><i class="fa ' + (checked ? 'fa-check-circle" style="color:#27ae60' : 'fa-times-circle" style="color:#ccc') + '"></i></td>';
            } else if (col.key === 'fecha_registro') {
                html += '<td>' + formatFecha(r[col.key]) + '</td>';
            } else {
                html += '<td title="' + escHtml(String(r[col.key] || '')) + '">' + escHtml(String(r[col.key] || '')) + '</td>';
            }
        });
        html += '</tr>';
    });
    tbody.innerHTML = html;
}

function updatePageInfo(page, pages, total) {
    document.getElementById('lblPageInfo').textContent = total + ' registros';
    document.getElementById('lblPageNum').textContent = page + ' / ' + pages;
    document.getElementById('btnPrevPage').disabled = (page <= 1);
    document.getElementById('btnNextPage').disabled = (page >= pages);
}

function bindControls() {
    var searchTimer;
    document.getElementById('txtBuscar').addEventListener('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            searchTxt = document.getElementById('txtBuscar').value;
            curPage = 1;
            applyAll();
        }, 300);
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
    document.getElementById('btnNuevoOperador').addEventListener('click', function() {
        document.getElementById('formOperador').reset();
        document.getElementById('id_operador').value = '0';
        document.getElementById('activo').checked = true;
        document.getElementById('modalTitle').textContent = 'Registrar Operador';
        document.getElementById('modalOperador').classList.add('open');
    });
    document.getElementById('btnRefrescar').addEventListener('click', function() {
        cargarOperadores();
        showNotif('Datos actualizados', 'success');
    });
}

function bindModalEvents() {
    var modal = document.getElementById('modalOperador');
    document.getElementById('btnCerrarModal').addEventListener('click', function() { modal.classList.remove('open'); });
    document.getElementById('btnCancelarModal').addEventListener('click', function() { modal.classList.remove('open'); });
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.classList.remove('open'); });
    document.getElementById('formOperador').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarOperador();
    });
}

function editarOperador(id) {
    $.getJSON(API, { action: 'obtener_operador', id: id }, function(res) {
        if (res.success) {
            var d = res.data;
            document.getElementById('id_operador').value = d.id_operador;
            document.getElementById('nombre_completo').value = d.nombre_completo || '';
            document.getElementById('documento').value = d.documento || '';
            document.getElementById('licencia').value = d.licencia || '';
            document.getElementById('telefono').value = d.telefono || '';
            document.getElementById('correo').value = d.correo || '';
            document.getElementById('activo').checked = (d.activo == 1 || d.activo === '1');
            document.getElementById('observaciones').value = d.observaciones || '';
            document.getElementById('modalTitle').textContent = 'Editar Operador';
            document.getElementById('modalOperador').classList.add('open');
        } else if (res.redirect) {
            window.location.href = res.redirect;
        }
    });
}

function guardarOperador() {
    var data = {
        id_operador: document.getElementById('id_operador').value,
        nombre_completo: document.getElementById('nombre_completo').value,
        documento: document.getElementById('documento').value,
        licencia: document.getElementById('licencia').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        activo: document.getElementById('activo').checked ? '1' : '0',
        observaciones: document.getElementById('observaciones').value
    };
    data.action = 'guardar_operador';
    $.ajax({
        url: API,
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Operador guardado correctamente', 'success');
                document.getElementById('modalOperador').classList.remove('open');
                cargarOperadores();
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

function eliminarOperador(id) {
    if (!confirm('¿Eliminar este operador?')) return;
    $.ajax({
        url: API,
        method: 'POST',
        data: { action: 'eliminar_operador', id: id },
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Operador eliminado', 'success');
                cargarOperadores();
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

function formatFecha(v) {
    if (!v) return '';
    try {
        var d = new Date(v);
        if (isNaN(d.getTime())) return v;
        var dd = ('0' + d.getDate()).slice(-2);
        var mm = ('0' + (d.getMonth() + 1)).slice(-2);
        var yyyy = d.getFullYear();
        var hh = ('0' + d.getHours()).slice(-2);
        var mi = ('0' + d.getMinutes()).slice(-2);
        return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mi;
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
