// mantenimiento.js - Control de Activos (tabla nativa, sin DevExtreme)
var API = 'api/datos.php';

var allData = [];
var searchTxt = '';
var curPage = 1;
var pageSize = 25;
var sortKey = 'fecha_programada';
var sortDir = 'desc';

var COLS = [
    { key: 'id_mantenimiento', label: 'ID', width: 60, sortable: true },
    { key: 'activo_nombre', label: 'Activo', width: 200, sortable: true },
    { key: 'tipo_mantenimiento', label: 'Tipo', width: 110, sortable: true },
    { key: 'fecha_programada', label: 'Fecha Prog.', width: 110, sortable: true },
    { key: 'fecha_ejecucion', label: 'Fecha Ejec.', width: 110, sortable: true },
    { key: 'proveedor', label: 'Proveedor', width: 150, sortable: true },
    { key: 'estado', label: 'Estado', width: 120, sortable: true },
    { key: 'descripcion', label: 'Descripción', width: 200, sortable: false },
    { key: 'acciones', label: 'Acciones', width: 80, sortable: false }
];

function buildTableHead() {
    var html = '';
    COLS.forEach(function(col) {
        var cls = col.sortable ? 'sortable' : '';
        var dir = (sortKey === col.key) ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';
        html += '<th class="' + cls + '" data-key="' + col.key + '" style="width:' + col.width + 'px">' + col.label + dir + '</th>';
    });
    document.querySelector('#tblMantenimientos thead tr').innerHTML = html;
}

function updateSortArrows() {
    document.querySelectorAll('#tblMantenimientos thead th.sortable').forEach(function(th) {
        var k = th.dataset.key;
        th.innerHTML = COLS.find(function(c) { return c.key === k; }).label;
        if (k === sortKey) th.innerHTML += (sortDir === 'asc' ? ' ▲' : ' ▼');
    });
}

function cargarMantenimientos() {
    $.getJSON(API, { action: 'listar_mantenimientos' }, function(res) {
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
                   (r.tipo_mantenimiento && r.tipo_mantenimiento.toLowerCase().indexOf(s) >= 0) ||
                   (r.proveedor && r.proveedor.toLowerCase().indexOf(s) >= 0) ||
                   (r.estado && r.estado.toLowerCase().indexOf(s) >= 0) ||
                   (r.descripcion && r.descripcion.toLowerCase().indexOf(s) >= 0);
        });
    }

    // Sort
    filtered.sort(function(a, b) {
        var va = (a[sortKey] || '').toString().toLowerCase();
        var vb = (b[sortKey] || '').toString().toLowerCase();
        if (sortKey === 'costo') {
            va = parseFloat(a[sortKey] || 0);
            vb = parseFloat(b[sortKey] || 0);
        }
        if (sortKey === 'id_mantenimiento') {
            va = parseInt(a[sortKey] || 0);
            vb = parseInt(b[sortKey] || 0);
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
    var tbody = document.getElementById('tblMantenimientosBody');
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="' + COLS.length + '" style="text-align:center;padding:30px;color:#888">No hay registros.</td></tr>';
        return;
    }
    var html = '';
    rows.forEach(function(r) {
        var tipoBadge = 'badge-' + r.tipo_mantenimiento;
        var estBadge = 'badge-' + (r.estado || '').replace(/ /g, '_');
        html += '<tr ondblclick="editarMantenimiento(' + r.id_mantenimiento + ')">';
        COLS.forEach(function(col) {
            var val = r[col.key] || '';
            if (col.key === 'tipo_mantenimiento') {
                val = '<span class="badge-estado ' + tipoBadge + '">' + escHtml(val) + '</span>';
            } else if (col.key === 'estado') {
                val = '<span class="badge-estado ' + estBadge + '">' + escHtml(val) + '</span>';
            } else if (col.key === 'fecha_programada' || col.key === 'fecha_ejecucion') {
                val = formatFechaCorta(val);
            } else if (col.key === 'acciones') {
                val = '<button class="btn-ca btn-ca-danger btn-sm" onclick="event.stopPropagation();eliminarMantenimiento(' + r.id_mantenimiento + ')"><i class="fas fa-trash"></i></button>';
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
    document.getElementById('lblPageInfo').textContent = total + ' registros';
    document.getElementById('lblPageNum').textContent = page + ' / ' + pages;
}

// ─── FLUJO LÓGICO SEGÚN ESTADO ─────────────────────────────────

function onEstadoChange() {
    var estado = document.getElementById('estado').value;
    var tipo = document.getElementById('tipo_mantenimiento').value;

    var fProg = document.getElementById('fecha_programada');
    var fEje  = document.getElementById('fecha_ejecucion');
    var prov  = document.getElementById('proveedor');
    var costo = document.getElementById('costo');
    var obs   = document.getElementById('observaciones');
    var km    = document.getElementById('kilometraje_actual');

    // Resetear todos los campos a enabled y required
    [fProg, fEje, prov, costo, obs, km].forEach(function(el) {
        el.disabled = false;
        el.required = false;
        el.closest('.field-group') ? el.closest('.field-group').classList.remove('required-active') : null;
    });

    // Resetear placeholders/hints
    fProg.placeholder = '';
    fEje.placeholder = '';
    prov.placeholder = 'Nombre del proveedor o taller';
    obs.placeholder = 'Notas adicionales...';

    if (estado === 'PROGRAMADO') {
        // Fecha Programada obligatoria
        fProg.required = true;
        // Fecha Ejecución, Proveedor, Costo, Km: disabled
        fEje.disabled = true;
        fEje.value = '';
        prov.disabled = true;
        prov.value = '';
        costo.disabled = true;
        costo.value = '';
        km.disabled = true;
        km.value = '';
        // Si es preventivo, fecha programada debe ser >= hoy
        if (tipo === 'PREVENTIVO') {
            fProg.min = todayStr();
        } else {
            fProg.min = '';
        }
    }
    else if (estado === 'EN EJECUCION') {
        // Fecha Programada obligatoria
        fProg.required = true;
        // Fecha Ejecución: por defecto hoy, editable
        if (!fEje.value) fEje.value = todayStr();
        // Proveedor: sugerido pero no obligatorio
        prov.disabled = false;
        prov.required = false;
        // Costo: disabled aún
        costo.disabled = true;
        costo.value = '';
        // Km: disabled aún
        km.disabled = true;
        km.value = '';
    }
    else if (estado === 'COMPLETADO') {
        // Fecha Programada obligatoria
        fProg.required = true;
        // Fecha Ejecución obligatoria
        fEje.required = true;
        if (!fEje.value) fEje.value = todayStr();
        // Proveedor obligatorio
        prov.required = true;
        // Costo: habilitado pero no obligatorio (puede ser 0.00)
        costo.disabled = false;
        costo.required = false;
        // Km: habilitado para que el usuario ingrese el kilometraje actual
        km.disabled = false;
        km.required = false;
    }
    else if (estado === 'CANCELADO') {
        // Fecha Programada obligatoria
        fProg.required = true;
        // Fecha Ejecución, Proveedor, Costo, Km: disabled
        fEje.disabled = true;
        fEje.value = '';
        prov.disabled = true;
        prov.value = '';
        costo.disabled = true;
        costo.value = '';
        km.disabled = true;
        km.value = '';
        // Observaciones obligatorio (justificar cancelación)
        obs.required = true;
        obs.placeholder = 'Indique el motivo de cancelación *';
    }
}

function todayStr() {
    var d = new Date();
    var y = d.getFullYear();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return y + '-' + m + '-' + day;
}

// ─── VALIDACIÓN FRONTEND ────────────────────────────────────────

function validarFormulario() {
    var estado = document.getElementById('estado').value;
    var tipo = document.getElementById('tipo_mantenimiento').value;
    var idActivo = document.getElementById('id_activo').value;
    var fProg = document.getElementById('fecha_programada').value;
    var fEje  = document.getElementById('fecha_ejecucion').value;
    var prov  = document.getElementById('proveedor').value;
    var obs   = document.getElementById('observaciones').value;
    var errores = [];

    // Validaciones comunes
    if (!idActivo) errores.push('Debe seleccionar un Activo.');
    if (!tipo) errores.push('Debe seleccionar el Tipo de mantenimiento.');
    if (!estado) errores.push('Debe seleccionar el Estado.');

    // Según estado
    if (estado === 'PROGRAMADO') {
        if (!fProg) errores.push('Fecha Programada es obligatoria para estado Programado.');
        if (tipo === 'PREVENTIVO' && fProg && fProg < todayStr()) {
            errores.push('Para mantenimiento Preventivo, la Fecha Programada debe ser hoy o futura.');
        }
    }
    else if (estado === 'EN EJECUCION') {
        if (!fProg) errores.push('Fecha Programada es obligatoria.');
        if (!fEje) errores.push('Fecha Ejecución es obligatoria para estado En Ejecución.');
        if (fProg && fEje && fEje < fProg) {
            errores.push('La Fecha de Ejecución no puede ser anterior a la Fecha Programada.');
        }
    }
    else if (estado === 'COMPLETADO') {
        if (!fProg) errores.push('Fecha Programada es obligatoria.');
        if (!fEje) errores.push('Fecha Ejecución es obligatoria para estado Completado.');
        if (fProg && fEje && fEje < fProg) {
            errores.push('La Fecha de Ejecución no puede ser anterior a la Fecha Programada.');
        }
        if (!prov) errores.push('Proveedor / Taller es obligatorio para estado Completado.');
    }
    else if (estado === 'CANCELADO') {
        if (!fProg) errores.push('Fecha Programada es obligatoria.');
        if (!obs) errores.push('Debe indicar el motivo de cancelación en Observaciones.');
    }

    if (errores.length > 0) {
        showNotif('⚠ ' + errores.join(' | '), 'error');
        return false;
    }
    return true;
}

// ─── COMBOS Y EVENTOS ───────────────────────────────────────────

function bindControls() {
    document.getElementById('btnNuevoMantenimiento').addEventListener('click', function() {
        document.getElementById('formMantenimiento').reset();
        document.getElementById('id_mantenimiento').value = '0';
        document.getElementById('modalTitle').textContent = 'Registrar Mantenimiento';
        // Resetear disabled
        document.querySelectorAll('#formMantenimiento input, #formMantenimiento select, #formMantenimiento textarea').forEach(function(el) {
            el.disabled = false;
            el.required = false;
        });
        document.getElementById('modalMantenimiento').classList.add('open');
        cargarCombos();
        // Aplicar reglas según estado default (PROGRAMADO)
        setTimeout(onEstadoChange, 100);
    });

    document.getElementById('btnRefrescar').addEventListener('click', cargarMantenimientos);

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

    // Sort on header click
    document.querySelector('#tblMantenimientos thead').addEventListener('click', function(e) {
        var th = e.target.closest('th.sortable');
        if (!th) return;
        var k = th.dataset.key;
        if (sortKey === k) sortDir = (sortDir === 'asc' ? 'desc' : 'asc');
        else { sortKey = k; sortDir = 'asc'; }
        updateSortArrows();
        applyAll();
    });

    // Estado change → aplicar reglas
    document.getElementById('estado').addEventListener('change', onEstadoChange);

    // Tipo change → si es CORRECTIVO, sugerir estado EN EJECUCION
    document.getElementById('tipo_mantenimiento').addEventListener('change', function() {
        if (this.value === 'CORRECTIVO') {
            var est = document.getElementById('estado');
            if (est.value === 'PROGRAMADO') {
                est.value = 'EN EJECUCION';
                onEstadoChange();
            }
        }
    });
}

function bindModalEvents() {
    document.getElementById('btnCerrarModal').addEventListener('click', function() {
        document.getElementById('modalMantenimiento').classList.remove('open');
    });
    document.getElementById('btnCancelarModal').addEventListener('click', function() {
        document.getElementById('modalMantenimiento').classList.remove('open');
    });
    document.getElementById('modalMantenimiento').addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('open');
    });

    document.getElementById('formMantenimiento').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validarFormulario()) return;
        guardarMantenimiento();
    });
}

function cargarCombos() {
    // Cargar activos
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

function editarMantenimiento(id) {
    $.getJSON(API, { action: 'obtener_mantenimiento', id: id }, function(res) {
        if (res.success) {
            var d = res.data;
            document.getElementById('id_mantenimiento').value = d.id_mantenimiento;
            document.getElementById('id_activo').value = d.id_activo || '';
            document.getElementById('tipo_mantenimiento').value = d.tipo_mantenimiento || 'PREVENTIVO';
            document.getElementById('estado').value = d.estado || 'PROGRAMADO';
            document.getElementById('fecha_programada').value = d.fecha_programada || '';
            document.getElementById('fecha_ejecucion').value = d.fecha_ejecucion || '';
            document.getElementById('proveedor').value = d.proveedor || '';
            document.getElementById('costo').value = d.costo || '';
            document.getElementById('kilometraje_actual').value = d.kilometraje_actual || '';
            document.getElementById('descripcion').value = d.descripcion || '';
            document.getElementById('observaciones').value = d.observaciones || '';
            document.getElementById('modalTitle').textContent = 'Editar Mantenimiento';
            document.getElementById('modalMantenimiento').classList.add('open');
            cargarCombos();
            // Aplicar reglas según estado actual
            setTimeout(onEstadoChange, 100);
        } else if (res.redirect) {
            window.location.href = res.redirect;
        }
    });
}

function guardarMantenimiento() {
    var data = {
        id_mantenimiento: document.getElementById('id_mantenimiento').value,
        id_activo: document.getElementById('id_activo').value,
        tipo_mantenimiento: document.getElementById('tipo_mantenimiento').value,
        estado: document.getElementById('estado').value,
        fecha_programada: document.getElementById('fecha_programada').value,
        fecha_ejecucion: document.getElementById('fecha_ejecucion').value,
        proveedor: document.getElementById('proveedor').value,
        costo: document.getElementById('costo').value,
        kilometraje_actual: document.getElementById('kilometraje_actual').value,
        descripcion: document.getElementById('descripcion').value,
        observaciones: document.getElementById('observaciones').value
    };
    data.action = 'guardar_mantenimiento';

    $.ajax({
        url: API,
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Mantenimiento guardado correctamente', 'success');
                document.getElementById('modalMantenimiento').classList.remove('open');
                cargarMantenimientos();
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

function eliminarMantenimiento(id) {
    if (!confirm('¿Eliminar este mantenimiento?')) return;
    $.ajax({
        url: API,
        method: 'POST',
        data: { action: 'eliminar_mantenimiento', id: id },
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Mantenimiento eliminado', 'success');
                cargarMantenimientos();
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
    setTimeout(function() { bar.style.display = 'none'; }, 5000);
}

// ── Init ────────────────────────────────────────────────────────
buildTableHead();
bindControls();
bindModalEvents();
cargarMantenimientos();
