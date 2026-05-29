// maestro.js - Control de Activos (tabla nativa, sin DevExtreme)
var API = 'api/datos.php';

var allData = [];
var searchTxt = '';
var filtroTipo = '';
var curPage = 1;
var pageSize = 25;
var sortKey = 'codigo_patrimonial';
var sortDir = 'asc';

var COLS = [
    { key: 'categoria_nombre',   label: 'Categor\u00eda',               w: '120px', sort: true },
    { key: 'tipo_activo',        label: 'Tipo',                 w: '100px', sort: true },
    { key: 'codigo_patrimonial', label: 'C\u00f3d. Patrimonial', w: '140px', sort: true },
    { key: 'marca',              label: 'Marca',                w: '130px', sort: true },
    { key: 'modelo',             label: 'Modelo',               w: '130px', sort: true },
    { key: 'anio_fabricacion',   label: 'A\u00f1o Fab.',                w: '90px',  sort: true, align: 'center' },
    { key: 'capacidad_carga',    label: 'Cap. Carga',           w: '130px', sort: true },
    { key: 'estado_activo',      label: 'Estado',               w: '140px', sort: true, badge: 'estado' },
    { key: '_acc',               label: 'Acciones',             w: '90px',  sort: false }
];

$(function() {
    buildTableHead();
    cargarCombos();
    cargarActivos();
    bindControls();
    bindModalEvents();
});

function buildTableHead() {
    var tr = document.querySelector('#tblActivos thead tr');
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
    document.querySelectorAll('#tblActivos thead th').forEach(function(th) {
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

// Mapa de categoría → tipos de activo permitidos
var TIPO_ACTIVO_MAP = {
    '1': ['CAMION', 'CAMIONETA', 'MONTACARGAS', 'STOCKA']
};

var TIPO_ACTIVO_LABELS = {
    CAMION: 'CAMION',
    CAMIONETA: 'CAMIONETA',
    MONTACARGAS: 'MONTACARGAS',
    STOCKA: 'STOCKA'
};

function filtrarTipoActivo(idCategoria) {
    var tipos = TIPO_ACTIVO_MAP[idCategoria] || ['OTRO'];
    var sel = document.getElementById('tipo_activo');
    sel.innerHTML = '<option value="">Seleccione...</option>';
    tipos.forEach(function(t) {
        var label = TIPO_ACTIVO_LABELS[t] || t;
        sel.innerHTML += '<option value="' + t + '">' + label + '</option>';
    });
}

function cargarCombos() {
    $.getJSON(API, { action: 'listar_categorias' }, function(res) {
        if (res.success) {
            var sel = document.getElementById('id_categoria');
            sel.innerHTML = '<option value="">Seleccione...</option>';
            res.data.forEach(function(c) {
                sel.innerHTML += '<option value="' + c.id_categoria + '">' + escHtml(c.nombre) + '</option>';
            });
            // Default: seleccionar "Vehículos" (id_categoria=1)
            sel.value = '1';
            filtrarTipoActivo('1');
        }
    });
    // Evento change en categoría para filtrar tipo_activo
    document.getElementById('id_categoria').addEventListener('change', function() {
        filtrarTipoActivo(this.value);
    });
    $.getJSON(API, { action: 'cmb_combustibles' }, function(res) {
        if (res.success) {
            var sel = document.getElementById('combustible');
            sel.innerHTML = '<option value="">Seleccione...</option>';
            res.data.forEach(function(c) {
                sel.innerHTML += '<option value="' + escHtml(c.valor) + '">' + escHtml(c.valor) + '</option>';
            });
        }
    });
}

function cargarActivos() {
    $.getJSON(API, { action: 'listar_activos' }, function(res) {
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
    // filtro por tipo de activo
    if (filtroTipo) {
        data = data.filter(function(r) {
            return String(r.tipo_activo || '') === filtroTipo;
        });
    }
    // búsqueda global
    if (searchTxt) {
        var q = searchTxt.toLowerCase();
        data = data.filter(function(r) {
            return COLS.some(function(c) {
                if (c.key === '_acc') return false;
                return String(r[c.key] || '').toLowerCase().indexOf(q) !== -1;
            });
        });
    }
    // ordenar
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
    // paginar
    var total = data.length;
    var pages = Math.max(1, Math.ceil(total / pageSize));
    if (curPage > pages) curPage = pages;
    renderRows(data.slice((curPage - 1) * pageSize, curPage * pageSize));
    updatePageInfo(curPage, pages, total);
}

function renderRows(rows) {
    var tbody = document.getElementById('tblActivosBody');
    if (!tbody) return;
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="' + COLS.length + '" style="text-align:center;padding:28px;color:#888">Sin registros</td></tr>';
        return;
    }
    var html = '';
    rows.forEach(function(r) {
        html += '<tr ondblclick="editarActivo(' + r.id_activo + ')">';
        COLS.forEach(function(col) {
            if (col.key === '_acc') {
                html += '<td style="white-space:nowrap" onclick="event.stopPropagation()">' +
                    '<button class="btn-ca btn-ca-danger btn-sm" onclick="eliminarActivo(' + r.id_activo + ')"><i class="fa fa-trash"></i></button>' +
                    '</td>';
            } else if (col.badge === 'estado') {
                var cls = 'badge-estado badge-' + String(r[col.key] || '').replace(/ /g, '_');
                html += '<td><span class="' + cls + '">' + escHtml(r[col.key] || '') + '</span></td>';
            } else if (col.key === 'capacidad_carga') {
                // Mostrar capacidad con unidad (ej: "2500 kg")
                var val = r[col.key];
                var displayVal = val ? String(val) : '';
                // Si el valor es solo numérico (sin unidad), agregar " kg"
                if (displayVal && /^\d+(\.\d+)?$/.test(displayVal.trim())) {
                    displayVal = displayVal.trim() + ' kg';
                }
                html += '<td title="' + escHtml(String(val || '')) + '">' + escHtml(displayVal) + '</td>';
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
    // Filtro por tipo de activo
    document.getElementById('selFiltrarTipo').addEventListener('change', function() {
        filtroTipo = this.value;
        curPage = 1;
        applyAll();
    });
    // Búsqueda
    var searchTimer;
    document.getElementById('txtBuscar').addEventListener('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            searchTxt = document.getElementById('txtBuscar').value;
            curPage = 1;
            applyAll();
        }, 300);
    });
    // Page size
    document.getElementById('selPageSize').addEventListener('change', function() {
        pageSize = parseInt(this.value);
        curPage = 1;
        applyAll();
    });
    // Paginación
    document.getElementById('btnPrevPage').addEventListener('click', function() {
        if (curPage > 1) { curPage--; applyAll(); }
    });
    document.getElementById('btnNextPage').addEventListener('click', function() {
        var pages = Math.max(1, Math.ceil(allData.length / pageSize));
        if (curPage < pages) { curPage++; applyAll(); }
    });
    // Botones toolbar
    document.getElementById('btnNuevoActivo').addEventListener('click', function() {
        document.getElementById('formActivo').reset();
        document.getElementById('id_activo').value = '0';
        document.getElementById('modalTitle').textContent = 'Registrar Activo';
        quitarFoto(); // Resetear uploader de foto
        // En modo nuevo: campos habilitados, ocultar botón Editar, mostrar Guardar
        setFormEnabled(true);
        document.getElementById('btnGuardarActivo').style.display = 'inline-flex';
        document.getElementById('btnEditarActivo').style.display = 'none';
        document.getElementById('modalActivo').classList.add('open');
    });
    document.getElementById('btnRefrescar').addEventListener('click', function() {
        cargarActivos();
        showNotif('Datos actualizados', 'success');
    });
}

function bindModalEvents() {
    var modal = document.getElementById('modalActivo');
    document.getElementById('btnCerrarModal').addEventListener('click', function() { cerrarModal(); });
    document.getElementById('btnCancelarModal').addEventListener('click', function() { cerrarModal(); });
    modal.addEventListener('click', function(e) { if (e.target === modal) cerrarModal(); });
    document.getElementById('formActivo').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarActivo();
    });
    // Botón Editar (habilita campos en modo visualización)
    document.getElementById('btnEditarActivo').addEventListener('click', function() {
        habilitarEdicion();
    });

    // ── Foto Upload ──
    var fotoInput = document.getElementById('fotoInput');
    var uploadArea = document.getElementById('fotoUploadArea');

    // Click en el área → abrir selector de archivos
    uploadArea.addEventListener('click', function() {
        fotoInput.click();
    });

    // Cambio de archivo → mostrar preview + nombre archivo
    fotoInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            var file = this.files[0];
            document.getElementById('fotoNombreArchivo').textContent = file.name;
            var reader = new FileReader();
            reader.onload = function(ev) {
                mostrarPreviewFoto(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Botón quitar foto
    document.getElementById('btnQuitarFoto').addEventListener('click', function(e) {
        e.stopPropagation();
        quitarFoto();
    });

    // ── Modal Confirmar Eliminación ──
    var modalConfirmar = document.getElementById('modalConfirmar');
    document.getElementById('btnConfirmarEliminar').addEventListener('click', ejecutarEliminar);
    document.getElementById('btnCancelarConfirmar').addEventListener('click', function() {
        modalConfirmar.classList.remove('open');
    });
    document.getElementById('btnCerrarConfirmar').addEventListener('click', function() {
        modalConfirmar.classList.remove('open');
    });
    modalConfirmar.addEventListener('click', function(e) {
        if (e.target === modalConfirmar) modalConfirmar.classList.remove('open');
    });
}

function cerrarModal() {
    document.getElementById('modalActivo').classList.remove('open');
    // Resetear uploader de foto
    quitarFoto();
}

function mostrarPreviewFoto(src) {
    var preview = document.getElementById('fotoPreview');
    var img = document.getElementById('fotoPreviewImg');
    var area = document.getElementById('fotoUploadArea');
    img.src = src;
    preview.style.display = 'inline-block';
    area.classList.add('has-file');
    document.getElementById('fotoUploadText').textContent = 'Cambiar foto';
    // Al hacer clic en la miniatura → abrir lightbox
    img.onclick = function() {
        abrirLightbox(src);
    };
}

function quitarFoto() {
    var input = document.getElementById('fotoInput');
    var hidden = document.getElementById('foto_url');
    var preview = document.getElementById('fotoPreview');
    var area = document.getElementById('fotoUploadArea');
    input.value = '';
    hidden.value = '';
    preview.style.display = 'none';
    document.getElementById('fotoPreviewImg').src = '';
    document.getElementById('fotoNombreArchivo').textContent = '';
    area.classList.remove('has-file');
    document.getElementById('fotoUploadText').textContent = 'Elegir foto';
}

function editarActivo(id) {
    $.getJSON(API, { action: 'obtener_activo', id: id }, function(res) {
        if (res.success) {
            var d = res.data;
            document.getElementById('id_activo').value = d.id_activo;
            document.getElementById('id_categoria').value = d.id_categoria || '';
            // Filtrar tipo_activo según la categoría del activo
            filtrarTipoActivo(String(d.id_categoria || ''));
            document.getElementById('tipo_activo').value = d.tipo_activo || '';
            document.getElementById('altura_elevacion').value = d.altura_elevacion || '';
            document.getElementById('longitud_unas').value = d.longitud_unas || '';
            document.getElementById('soat_codigo').value = d.soat_codigo || '';
            document.getElementById('soat_vencimiento').value = d.soat_vencimiento || '';
            document.getElementById('revision_tecnica_codigo').value = d.revision_tecnica_codigo || '';
            document.getElementById('revision_tecnica_vencimiento').value = d.revision_tecnica_vencimiento || '';
            document.getElementById('fecha_adquisicion').value = d.fecha_adquisicion || '';
            document.getElementById('codigo_patrimonial').value = d.codigo_patrimonial || '';
            document.getElementById('placa').value = d.placa || '';
            document.getElementById('kilometraje_actual').value = d.kilometraje_actual || '';
            document.getElementById('marca').value = d.marca || '';
            document.getElementById('modelo').value = d.modelo || '';
            document.getElementById('numero_serie').value = d.numero_serie || '';
            document.getElementById('anio_fabricacion').value = d.anio_fabricacion || '';
            document.getElementById('color').value = d.color || '';
            document.getElementById('combustible').value = d.combustible || '';
            document.getElementById('capacidad_carga').value = d.capacidad_carga || '';
            document.getElementById('peso_bruto').value = d.peso_bruto || '';
            document.getElementById('dimensiones').value = d.dimensiones || '';
            document.getElementById('ubicacion_fisica').value = d.ubicacion_fisica || '';
            document.getElementById('estado_activo').value = d.estado_activo || 'OPERATIVO';
            document.getElementById('valor_libros').value = d.valor_libros || '';
            document.getElementById('observaciones').value = d.observaciones || '';
            document.getElementById('modalTitle').textContent = 'Editar Activo';

            // Resaltar campos que tienen valor
            resaltarCamposConValor();

            // Mostrar foto existente si tiene URL
            var fotoUrl = d.foto_url || '';
            document.getElementById('foto_url').value = fotoUrl;
            if (fotoUrl) {
                mostrarPreviewFoto('../../' + fotoUrl);
            } else {
                quitarFoto();
            }

            // ── MODO VISUALIZACIÓN: campos deshabilitados ──
            setFormEnabled(false);
            document.getElementById('btnGuardarActivo').style.display = 'none';
            document.getElementById('btnEditarActivo').style.display = 'inline-flex';

            document.getElementById('modalActivo').classList.add('open');
        } else if (res.redirect) {
            window.location.href = res.redirect;
        }
    });
}

// ── Resalta los campos del formulario que tienen valor ──
function resaltarCamposConValor() {
    var form = document.getElementById('formActivo');
    var campos = form.querySelectorAll('input:not([type=hidden]):not([type=file]), select, textarea');
    // IDs de campos numéricos cuyo valor 0 / 0.00 significa "sin dato"
    var camposCeroEsVacio = ['peso_bruto', 'altura_elevacion', 'longitud_unas', 'valor_libros', 'kilometraje_actual', 'anio_fabricacion', 'capacidad_carga'];
    campos.forEach(function(el) {
        var val = el.value;
        // Para selects: considerar que tienen valor si no están en la opción vacía
        if (el.tagName === 'SELECT') {
            if (val && val !== '') {
                el.classList.add('has-value');
            } else {
                el.classList.remove('has-value');
            }
            return;
        }
        // Para campos numéricos donde 0 = sin dato
        if (camposCeroEsVacio.indexOf(el.id) !== -1) {
            var num = parseFloat(val);
            if (val && !isNaN(num) && num !== 0) {
                el.classList.add('has-value');
            } else {
                el.classList.remove('has-value');
            }
            return;
        }
        // Para el resto: cualquier texto no vacío
        if (val && String(val).trim() !== '') {
            el.classList.add('has-value');
        } else {
            el.classList.remove('has-value');
        }
    });
}

// ── Habilita/deshabilita todos los campos del formulario ──
function setFormEnabled(enabled) {
    var form = document.getElementById('formActivo');
    var inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(function(el) {
        // No deshabilitar hidden inputs ni botones de acción del modal
        if (el.type === 'hidden') return;
        if (el.id === 'btnCerrarModal') return;
        if (el.id === 'btnCancelarModal') return;
        if (el.id === 'btnEditarActivo') return;
        if (el.id === 'btnGuardarActivo') return;
        if (el.id === 'btnQuitarFoto') return;
        el.disabled = !enabled;
    });
    // El área de upload de foto también se deshabilita visualmente
    var uploadArea = document.getElementById('fotoUploadArea');
    if (uploadArea) {
        uploadArea.style.pointerEvents = enabled ? 'auto' : 'none';
        uploadArea.style.opacity = enabled ? '1' : '0.5';
    }
}

// ── Habilita campos para edición ──
function habilitarEdicion() {
    setFormEnabled(true);
    document.getElementById('btnGuardarActivo').style.display = 'inline-flex';
    document.getElementById('btnEditarActivo').style.display = 'none';
}

// ── Redimensionar imagen en cliente (canvas → WebP) ──
function redimensionarImagen(file, maxW, calidad, callback) {
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function() {
        URL.revokeObjectURL(url);
        var canvas = document.createElement('canvas');
        var w = img.width, h = img.height;
        if (w > maxW) {
            h = Math.round(h * maxW / w);
            w = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        var dataUri = canvas.toDataURL('image/webp', calidad);
        callback(dataUri);
    };
    img.onerror = function() {
        // Fallback: leer como base64 sin redimensionar
        var reader = new FileReader();
        reader.onload = function(ev) { callback(ev.target.result); };
        reader.readAsDataURL(file);
    };
    img.src = url;
}

function guardarActivo() {
    var fotoInput = document.getElementById('fotoInput');
    var fotoHidden = document.getElementById('foto_url');

    // Función que ejecuta el guardado del activo con la foto_url actual
    function ejecutarGuardado(fotoUrl) {
        var data = {
            id_activo: document.getElementById('id_activo').value,
            id_categoria: document.getElementById('id_categoria').value,
            tipo_activo: document.getElementById('tipo_activo').value,
            altura_elevacion: document.getElementById('altura_elevacion').value,
            longitud_unas: document.getElementById('longitud_unas').value,
            soat_codigo: document.getElementById('soat_codigo').value,
            soat_vencimiento: document.getElementById('soat_vencimiento').value,
            revision_tecnica_codigo: document.getElementById('revision_tecnica_codigo').value,
            revision_tecnica_vencimiento: document.getElementById('revision_tecnica_vencimiento').value,
            fecha_adquisicion: document.getElementById('fecha_adquisicion').value,
            codigo_patrimonial: document.getElementById('codigo_patrimonial').value,
            placa: document.getElementById('placa').value,
            kilometraje_actual: document.getElementById('kilometraje_actual').value,
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            numero_serie: document.getElementById('numero_serie').value,
            anio_fabricacion: document.getElementById('anio_fabricacion').value,
            color: document.getElementById('color').value,
            combustible: document.getElementById('combustible').value,
            capacidad_carga: document.getElementById('capacidad_carga').value,
            peso_bruto: document.getElementById('peso_bruto').value,
            dimensiones: document.getElementById('dimensiones').value,
            ubicacion_fisica: document.getElementById('ubicacion_fisica').value,
            estado_activo: document.getElementById('estado_activo').value,
            valor_libros: document.getElementById('valor_libros').value,
            foto_url: fotoUrl,
            observaciones: document.getElementById('observaciones').value
        };
        data.action = 'guardar_activo';
        $.ajax({
            url: API,
            method: 'POST',
            data: data,
            dataType: 'json',
            success: function(res) {
                if (res.success) {
                    showNotif('Activo guardado correctamente', 'success');
                    document.getElementById('modalActivo').classList.remove('open');
                    cargarActivos();
                } else if (res.redirect) {
                    window.location.href = res.redirect;
                } else {
                    showNotif('Error: ' + (res.mensaje || 'Error desconocido'), 'error');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX error:', textStatus, errorThrown, jqXHR.responseText);
                showNotif('Error de conexión: ' + (errorThrown || 'desconocido'), 'error');
            }
        });
    }

    // Si hay un archivo seleccionado, redimensionarlo y subirlo
    if (fotoInput.files && fotoInput.files[0]) {
        var file = fotoInput.files[0];
        // Mostrar notificación de proceso
        showNotif('Redimensionando imagen...', 'info');

        redimensionarImagen(file, 800, 0.6, function(dataUri) {
            // Enviar la dataUri (base64 WebP redimensionada) al servidor
            $.ajax({
                url: 'api/subir_foto.php',
                method: 'POST',
                data: { dataUri: dataUri },
                dataType: 'json',
                success: function(res) {
                    if (res.success) {
                        fotoHidden.value = res.url;
                        ejecutarGuardado(res.url);
                    } else {
                        showNotif('Error al subir foto: ' + (res.mensaje || 'Error desconocido'), 'error');
                    }
                },
                error: function() {
                    showNotif('Error de conexión al subir la foto', 'error');
                }
            });
        });
    } else {
        // No hay archivo nuevo, usar el valor actual del hidden
        ejecutarGuardado(fotoHidden.value);
    }
}

var eliminarActivoId = 0;

function eliminarActivo(id) {
    eliminarActivoId = id;
    document.getElementById('confirmarMensaje').textContent = '¿Está seguro de eliminar este activo? Esta acción no se puede deshacer.';
    document.getElementById('modalConfirmar').classList.add('open');
}

function ejecutarEliminar() {
    var id = eliminarActivoId;
    if (!id) return;
    document.getElementById('modalConfirmar').classList.remove('open');
    $.ajax({
        url: API,
        method: 'POST',
        data: { action: 'eliminar_activo', id: id },
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Activo eliminado', 'success');
                cargarActivos();
            } else if (res.redirect) {
                window.location.href = res.redirect;
            } else {
                showNotif('Error: ' + (res.mensaje || 'Error desconocido'), 'error');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('eliminarActivo AJAX error:', textStatus, errorThrown, jqXHR.status, jqXHR.responseText);
            try {
                var errData = JSON.parse(jqXHR.responseText);
                if (errData.redirect) {
                    window.location.href = errData.redirect;
                    return;
                }
                showNotif('Error: ' + (errData.mensaje || 'Error de conexión'), 'error');
            } catch(e) {
                showNotif('Error de conexión (HTTP ' + jqXHR.status + ')', 'error');
            }
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

// ── Lightbox ──
function abrirLightbox(src) {
    var overlay = document.getElementById('lightboxOverlay');
    var img = document.getElementById('lightboxImg');
    img.src = src;
    overlay.classList.add('open');
}

function cerrarLightbox() {
    document.getElementById('lightboxOverlay').classList.remove('open');
}

// Cerrar lightbox al hacer clic en overlay, botón cerrar o tecla ESC
document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) cerrarLightbox();
    });
    document.getElementById('btnCerrarLightbox').addEventListener('click', cerrarLightbox);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarLightbox();
    });
});
