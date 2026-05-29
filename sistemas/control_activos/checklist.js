// checklist.js - Control de Activos (tabla nativa, sin DevExtreme)
var API = 'api/datos.php';

var allData = [];
var searchTxt = '';
var curPage = 1;
var pageSize = 25;
var sortKey = 'fecha_checklist';
var sortDir = 'desc';

// ── Almacén temporal de fotos por item ────────────────────────
// fotosTemp[id_item] = [ { blobUrl, file, dataUri, url } ]
// blobUrl: dataUri redimensionado (se usa como preview, ~100-200KB en WebP)
// file: null (ya no se necesita, se redimensiona al capturar)
// dataUri: base64 redimensionado (se genera al capturar, listo para subir)
// url: URL devuelta por el servidor (se llena al guardar)
var fotosTemp = {};

// ── Estado del lightbox ───────────────────────────────────────
var lbItems = [];       // Array de { src, isBase64 }
var lbIndex = 0;        // Índice actual

// ── Columnas de la grilla ─────────────────────────────────────
var COLS = [
    { key: 'id_checklist', label: 'ID', sortable: true, width: '60px' },
    { key: 'activo_nombre', label: 'Activo', sortable: true },
    { key: 'operador_nombre', label: 'Operador', sortable: true },
    { key: 'fecha_checklist', label: 'Fecha', sortable: true, width: '110px' },
    { key: 'hora_checklist', label: 'Hora', sortable: true, width: '80px' },
    { key: 'kilometraje', label: 'Kilometraje', sortable: true, width: '110px' },
    { key: 'estado_general', label: 'Estado General', sortable: true, width: '120px' },
    { key: 'resultado', label: 'Resultado', sortable: false, width: '200px' }
];

// ── Construir cabecera de la tabla ────────────────────────────
function buildTableHead() {
    var $thead = $('#tblChecklists thead tr');
    $thead.empty();
    COLS.forEach(function(col) {
        var th = $('<th>').text(col.label).css('width', col.width || 'auto');
        if (col.sortable) {
            th.addClass('sortable').attr('data-key', col.key);
            if (col.key === sortKey) {
                th.append(' ' + (sortDir === 'asc' ? '\u25B2' : '\u25BC'));
            }
        }
        $thead.append(th);
    });
    // Columna de acciones
    $thead.append($('<th>').css('width', '80px').text('Acciones'));
    updateSortArrows();
}

function updateSortArrows() {
    $('#tblChecklists thead th.sortable').off('click').on('click', function() {
        var key = $(this).data('key');
        if (key === sortKey) {
            sortDir = (sortDir === 'asc') ? 'desc' : 'asc';
        } else {
            sortKey = key;
            sortDir = 'asc';
        }
        buildTableHead();
        applyAll();
    });
}

// ── Cargar combos ─────────────────────────────────────────────
function cargarCombos() {
    $.getJSON(API, { action: 'listar_activos' }, function(res) {
        if (res.success) {
            var sel = $('#id_activo');
            sel.find('option:not(:first)').remove();
            res.data.forEach(function(a) {
                sel.append('<option value="' + a.id_activo + '">' + escHtml(a.codigo_patrimonial || a.tipo_activo || '') + ' - ' + escHtml(a.marca || '') + ' ' + escHtml(a.modelo || '') + '</option>');
            });
        }
    });
    $.getJSON(API, { action: 'listar_operadores' }, function(res) {
        if (res.success) {
            var sel = $('#id_operador');
            sel.find('option:not(:first)').remove();
            res.data.forEach(function(o) {
                sel.append('<option value="' + o.id_operador + '">' + escHtml(o.nombre_completo) + '</option>');
            });
        }
    });
}

// ── Cargar checklist ──────────────────────────────────────────
function cargarChecklists() {
    $.getJSON(API, { action: 'listar_checklists' }, function(res) {
        if (res.success) {
            allData = res.data || [];
            applyAll();
        } else if (res.redirect) {
            window.location.href = res.redirect;
        }
    });
}

// ── Aplicar filtros, paginación y render ──────────────────────
function applyAll() {
    var filtered = allData.slice();
    if (searchTxt) {
        var q = searchTxt.toLowerCase();
        filtered = filtered.filter(function(r) {
            return (r.activo_nombre && r.activo_nombre.toLowerCase().indexOf(q) !== -1) ||
                   (r.operador_nombre && r.operador_nombre.toLowerCase().indexOf(q) !== -1) ||
                   (r.kilometraje && r.kilometraje.toLowerCase().indexOf(q) !== -1);
        });
    }

    // Ordenar
    filtered.sort(function(a, b) {
        var va = a[sortKey] || '';
        var vb = b[sortKey] || '';
        if (typeof va === 'string') {
            va = va.toLowerCase();
            vb = (vb || '').toLowerCase();
        }
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    var total = filtered.length;
    var pages = Math.ceil(total / pageSize) || 1;
    if (curPage > pages) curPage = pages;
    var start = (curPage - 1) * pageSize;
    var pageData = filtered.slice(start, start + pageSize);

    renderRows(pageData);
    updatePageInfo(curPage, pages, total);
}

function renderRows(rows) {
    var $body = $('#tblChecklistsBody');
    $body.empty();
    if (!rows || rows.length === 0) {
        $body.html('<tr><td colspan="' + (COLS.length + 1) + '" style="text-align:center;padding:30px;color:#999;">No se encontraron registros</td></tr>');
        return;
    }
    rows.forEach(function(r) {
        var tr = $('<tr>').css('cursor', 'pointer');
        COLS.forEach(function(col) {
            var val = r[col.key] !== undefined && r[col.key] !== null ? r[col.key] : '';
            var td = $('<td>');
            if (col.key === 'estado_general') {
                var badgeClass = 'badge-' + val;
                td.html('<span class="badge-estado ' + badgeClass + '">' + escHtml(val) + '</span>');
            } else if (col.key === 'resultado') {
                td.html(escHtml(val)).css('max-width', col.width || '200px');
            } else {
                td.text(val);
            }
            tr.append(td);
        });
        // Acciones
        var tdAcc = $('<td>');
        tdAcc.append(
            $('<button class="btn-ca btn-ca-secondary btn-sm" title="Editar">')
                .html('<i class="fas fa-edit"></i>')
                .on('click', function(e) { e.stopPropagation(); editarChecklist(r.id_checklist); })
        );
        tdAcc.append(' ');
        tdAcc.append(
            $('<button class="btn-ca btn-ca-danger btn-sm" title="Eliminar">')
                .html('<i class="fas fa-trash"></i>')
                .on('click', function(e) { e.stopPropagation(); eliminarChecklist(r.id_checklist); })
        );
        tr.append(tdAcc);

        // Doble clic para editar
        tr.on('dblclick', function() { editarChecklist(r.id_checklist); });
        $body.append(tr);
    });
}

function updatePageInfo(page, pages, total) {
    $('#lblPageInfo').text(total + ' registros');
    $('#lblPageNum').text(page + ' / ' + pages);
    $('#btnPrevPage').prop('disabled', page <= 1);
    $('#btnNextPage').prop('disabled', page >= pages);
}

// ── Controles de paginación y búsqueda ────────────────────────
function bindControls() {
    $('#txtBuscar').on('input', function() {
        searchTxt = $(this).val();
        curPage = 1;
        applyAll();
    });
    $('#selPageSize').on('change', function() {
        pageSize = parseInt($(this).val());
        curPage = 1;
        applyAll();
    });
    $('#btnPrevPage').on('click', function() { if (curPage > 1) { curPage--; applyAll(); } });
    $('#btnNextPage').on('click', function() { if (curPage < Math.ceil(allData.length / pageSize)) { curPage++; applyAll(); } });
    $('#btnRefrescar').on('click', function() { cargarChecklists(); });
    $('#btnNuevoChecklist').on('click', function() {
        $('#id_checklist').val(0);
        $('#modalTitle').text('Registrar Checklist');
        $('#formChecklist')[0].reset();
        $('#fecha_checklist').val(new Date().toISOString().split('T')[0]);
        $('#hora_checklist').val(new Date().toTimeString().slice(0,5));
        fotosTemp = {};
        cargarItemsChecklist();
        $('#modalChecklist').addClass('open');
        // Restaurar borrador después de que los items se hayan renderizado
        setTimeout(function() { restaurarBorrador(); }, 100);
    });
}

// ── Eventos del modal ─────────────────────────────────────────
function bindModalEvents() {
    $('#btnCerrarModal, #btnCancelarModal').on('click', function() {
        $('#modalChecklist').removeClass('open');
        eliminarBorrador();
    });
    $('#modalChecklist').on('click', function(e) {
        if (e.target === this) {
            $('#modalChecklist').removeClass('open');
            eliminarBorrador();
        }
    });

    $('#formChecklist').on('submit', function(e) {
        e.preventDefault();
        guardarChecklist();
    });
}

// ── Generar HTML de items con estructura de árbol (acordeón) ──
//    Ahora incluye botones de cámara y galería por cada item
function generarItemsHTML(grupos, detalles, fotosPorItem) {
    var html = '';
    var itemCounter = 1;
    grupos.forEach(function(grupo) {
        var allOk = true;
        var someChecked = false;
        var grupoHtml = '';
        grupo.items.forEach(function(nombreItem, idx) {
            var idItem = itemCounter;
            var det = null;
            if (detalles) {
                det = detalles.find(function(d) { return d.id_item == idItem; });
            }
            var resultado = det ? det.resultado : '';
            var comentario = det ? (det.comentario || '') : '';
            var chkB = resultado === 'BUENO' ? ' checked' : '';
            var chkC = resultado === 'CORREGIR' ? ' checked' : '';
            var chkM = resultado === 'MAL_ESTADO' ? ' checked' : '';
            var selB = chkB ? ' selected' : '';
            var selC = chkC ? ' selected' : '';
            var selM = chkM ? ' selected' : '';

            if (resultado) someChecked = true;
            if (resultado && resultado !== 'BUENO') allOk = false;

            // Fotos existentes en BD para este item
            var fotosExistentes = (fotosPorItem && fotosPorItem[idItem]) ? fotosPorItem[idItem] : [];
            // Fotos temporales (base64) para este item
            var fotosTmp = fotosTemp[idItem] || [];

            // Construir thumbnails
            var thumbsHtml = '';
            // Fotos de BD (ya guardadas) — incluir data-id-item para que abrirLightbox funcione
            fotosExistentes.forEach(function(url) {
                thumbsHtml += '<img src="../../' + url + '" class="cl-item-foto-thumb" data-url="' + escHtml(url) + '" data-id-item="' + idItem + '" onclick="abrirLightbox(this)">';
            });
            // Fotos temporales (blobUrl)
            fotosTmp.forEach(function(f, fi) {
                var src = f.blobUrl || f.dataUri || '';
                if (src) {
                    thumbsHtml += '<img src="' + src + '" class="cl-item-foto-thumb" data-idx="' + fi + '" data-id-item="' + idItem + '" onclick="abrirLightbox(this)">';
                }
            });

            var hasFotos = fotosExistentes.length > 0 || fotosTmp.length > 0;
            var camClass = fotosTmp.length > 0 ? ' has-foto' : '';
            var galClass = hasFotos ? ' has-foto' : '';

            grupoHtml += '<div class="cl-item">';
            grupoHtml += '<span class="cl-item-name">' + (idx + 1) + '. ' + escHtml(nombreItem) + '</span>';
            grupoHtml += '<div class="radio-group" data-id-item="' + idItem + '">';
            grupoHtml += '<label class="rdo-bueno' + selB + '"><input type="radio" name="rdo_' + idItem + '" value="BUENO"' + chkB + '><span>B</span></label>';
            grupoHtml += '<label class="rdo-corregir' + selC + '"><input type="radio" name="rdo_' + idItem + '" value="CORREGIR"' + chkC + '><span>C</span></label>';
            grupoHtml += '<label class="rdo-mal' + selM + '"><input type="radio" name="rdo_' + idItem + '" value="MAL_ESTADO"' + chkM + '><span>M</span></label>';
            grupoHtml += '</div>';
            grupoHtml += '<div class="cl-item-actions">';
            // Botón cámara
            grupoHtml += '<button type="button" class="cl-item-btn-cam' + camClass + '" title="Tomar foto" data-id-item="' + idItem + '" onclick="capturarFoto(' + idItem + ')"><i class="fas fa-camera"></i></button>';
            // Botón galería
            grupoHtml += '<button type="button" class="cl-item-btn-gal' + galClass + '" title="Ver fotos (' + (fotosExistentes.length + fotosTmp.length) + ')" data-id-item="' + idItem + '" onclick="verGaleria(' + idItem + ')"><i class="fas fa-images"></i></button>';
            grupoHtml += '</div>';
            grupoHtml += '<input type="text" class="cl-item-coment" placeholder="Comentario..." data-id-item="' + idItem + '" value="' + escHtml(comentario) + '">';
            // Contenedor de thumbnails
            if (thumbsHtml) {
                grupoHtml += '<div class="cl-item-fotos">' + thumbsHtml + '</div>';
            }
            grupoHtml += '</div>';

            itemCounter++;
        });

        var grupoStatus = '';
        if (someChecked) {
            if (allOk) grupoStatus = '<span class="cl-grupo-status cl-gs-ok">\u2713</span>';
            else grupoStatus = '<span class="cl-grupo-status cl-gs-warn">\u26A0</span>';
        }

        html += '<div class="cl-grupo">';
        html += '<div class="cl-grupo-header" onclick="toggleGrupo(this)">';
        html += '<span class="cl-grupo-arrow">&#9654;</span>';
        html += '<span class="cl-grupo-nombre">' + escHtml(grupo.nombre_grupo) + '</span>';
        html += grupoStatus;
        html += '</div>';
        html += '<div class="cl-grupo-body" style="display:none">';
        html += grupoHtml;
        html += '</div>';
        html += '</div>';
    });
    return html;
}

// ── Cargar items del checklist (nuevo) ────────────────────────
function cargarItemsChecklist() {
    $.getJSON(API, { action: 'cmb_items_checklist' }, function(res) {
        if (res.success && res.data) {
            var html = generarItemsHTML(res.data, null, null);
            $('#itemsContainer').html(html);
            bindRadioChange();
        }
    });
}

// ── Editar checklist ──────────────────────────────────────────
function editarChecklist(id) {
    $.getJSON(API, { action: 'obtener_checklist', id: id }, function(res) {
        if (!res.success) { showNotif('Error: ' + (res.mensaje || 'No encontrado'), 'error'); return; }
        var d = res.data;
        $('#id_checklist').val(d.id_checklist);
        $('#modalTitle').text('Editar Checklist');
        $('#id_activo').val(d.id_activo);
        $('#id_operador').val(d.id_operador);
        $('#fecha_checklist').val(d.fecha_checklist);
        $('#hora_checklist').val(d.hora_checklist || '');
        $('#kilometraje').val(d.kilometraje || '');
        $('#estado_general').val(d.estado_general || 'BUENO');
        $('#observaciones').val(d.observaciones || '');
        // Poblar fotosTemp con las fotos existentes del servidor para preservarlas al guardar
        fotosTemp = {};
        if (d.fotos_por_item) {
            Object.keys(d.fotos_por_item).forEach(function(idItem) {
                var urls = d.fotos_por_item[idItem];
                if (Array.isArray(urls)) {
                    fotosTemp[idItem] = urls.map(function(url) {
                        return { url: url, blobUrl: null, dataUri: null };
                    });
                }
            });
        }
        cargarItemsChecklistConValores(d.detalles, d.fotos_por_item);
        $('#modalChecklist').addClass('open');
        // Al editar, eliminar cualquier borrador previo (los datos vienen del servidor)
        eliminarBorrador();
    });
}

// ── Cargar items con valores existentes ───────────────────────
function cargarItemsChecklistConValores(detalles, fotosPorItem) {
    $.getJSON(API, { action: 'cmb_items_checklist' }, function(res) {
        if (res.success && res.data) {
            var html = generarItemsHTML(res.data, detalles, fotosPorItem);
            $('#itemsContainer').html(html);
            bindRadioChange();
        }
    });
}

// ── Capturar foto (usa input permanente en el HTML) ───────────
var capturaFotoIdItem = null;

function capturarFoto(idItem) {
    var input = document.getElementById('capturaFotoInput');
    if (!input) return;
    capturaFotoIdItem = idItem;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        input.setAttribute('capture', 'environment');
    } else {
        input.removeAttribute('capture');
    }
    input.value = '';
    input.click();
}

// ── Redimensionar imagen a un tamaño razonable (máx 800px, calidad 0.6) ──
// Esto reduce drásticamente el peso: de ~5MB a ~100-200KB
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
        // Convertir a WebP (mejor compresión que JPEG) con calidad 0.6
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

// ── Evento change del input permanente ──
$(document).ready(function() {
    var input = document.getElementById('capturaFotoInput');
    if (!input) return;

    input.addEventListener('change', function(e) {
        var idItem = capturaFotoIdItem;
        capturaFotoIdItem = null;
        if (idItem === null || idItem === undefined) return;

        var file = input.files[0];
        if (!file) return;

        // Redimensionar la imagen ANTES de guardarla
        redimensionarImagen(file, 800, 0.6, function(dataUri) {
            // dataUri ahora es un WebP de ~100-200KB en lugar de 5MB

            // Crear blob URL para preview (usamos el dataUri redimensionado como blob)
            // Para preview podemos usar el mismo dataUri (ya es pequeño)
            if (!fotosTemp[idItem]) fotosTemp[idItem] = [];
            fotosTemp[idItem].push({
                blobUrl: dataUri,   // Usamos el dataUri redimensionado como preview
                file: null,         // Ya no necesitamos el file original
                dataUri: dataUri,   // El base64 ya está listo para subir
                url: null
            });

            actualizarUIItem(idItem);
            guardarBorrador();
        });
    });
});

// ── Actualizar UI de un item después de agregar/quitar foto ───
function actualizarUIItem(idItem) {
    var fotosTmp = fotosTemp[idItem] || [];
    var $item = $('.cl-item').filter(function() {
        return $(this).find('.radio-group').data('id-item') == idItem;
    });

    if ($item.length === 0) return;

    // Actualizar badge del botón cámara
    var $btnCam = $item.find('.cl-item-btn-cam');
    if (fotosTmp.length > 0) $btnCam.addClass('has-foto');
    else $btnCam.removeClass('has-foto');

    // Actualizar contenedor de thumbnails
    var $fotosContainer = $item.find('.cl-item-fotos');
    var thumbsHtml = '';
    fotosTmp.forEach(function(f, fi) {
        // Usar blobUrl si existe (preview rápido), sino dataUri, sino url del servidor
        var src = f.blobUrl || f.dataUri || (f.url ? '../../' + f.url : '');
        if (src) {
            thumbsHtml += '<img src="' + src + '" class="cl-item-foto-thumb" data-idx="' + fi + '" data-id-item="' + idItem + '" onclick="abrirLightbox(this)">';
        }
    });

    if (thumbsHtml) {
        if ($fotosContainer.length === 0) {
            $item.append('<div class="cl-item-fotos">' + thumbsHtml + '</div>');
        } else {
            $fotosContainer.html(thumbsHtml);
        }
    } else {
        $fotosContainer.remove();
    }

    // Actualizar badge del botón galería
    var totalFotos = fotosTmp.length;
    var $btnGal = $item.find('.cl-item-btn-gal');
    if (totalFotos > 0) $btnGal.addClass('has-foto');
    else $btnGal.removeClass('has-foto');
    $btnGal.prop('title', 'Ver fotos (' + totalFotos + ')');
}

// ── Abrir lightbox ────────────────────────────────────────────
function abrirLightbox(imgEl) {
    var $img = $(imgEl);
    var idItem = $img.data('id-item');

    lbItems = [];

    // 1) Mostrar todas las fotos de servidor (thumbnails con data-url) de este item
    if (idItem) {
        $('.cl-item-foto-thumb[data-id-item="' + idItem + '"][data-url]').each(function() {
            var url = $(this).data('url');
            if (url) {
                lbItems.push({ src: '../../' + url });
            }
        });
    }

    // 2) Mostrar todas las fotos temporales de este item
    var fotosTmp = fotosTemp[idItem] || [];
    fotosTmp.forEach(function(f) {
        var src = f.blobUrl || f.dataUri || (f.url ? '../../' + f.url : '');
        if (src) {
            lbItems.push({ src: src });
        }
    });

    if (lbItems.length === 0) return;
    lbIndex = 0;
    mostrarLightbox();
}

// ── Ver galería completa de un item ───────────────────────────
function verGaleria(idItem) {
    lbItems = [];

    // 1) Fotos de servidor (thumbnails con data-url)
    $('.cl-item-foto-thumb[data-id-item="' + idItem + '"][data-url]').each(function() {
        var url = $(this).data('url');
        if (url) {
            lbItems.push({ src: '../../' + url });
        }
    });

    // 2) Fotos temporales (blobUrl o base64)
    var fotosTmp = fotosTemp[idItem] || [];
    fotosTmp.forEach(function(f) {
        var src = f.blobUrl || f.dataUri || (f.url ? '../../' + f.url : '');
        if (src) {
            lbItems.push({ src: src });
        }
    });

    if (lbItems.length === 0) {
        // Mostrar aviso visual en el botón de galería (dentro del modal)
        var $btn = $('.cl-item-btn-gal[data-id-item="' + idItem + '"]');
        if ($btn.length) {
            var $originalHtml = $btn.html();
            $btn.html('<i class="fas fa-exclamation-circle"></i>').css('color', '#e74c3c').prop('disabled', true);
            setTimeout(function() {
                $btn.html($originalHtml).css('color', '').prop('disabled', false);
            }, 1500);
        }
        return;
    }

    lbIndex = 0;
    mostrarLightbox();
}

function mostrarLightbox() {
    if (lbItems.length === 0) return;
    var item = lbItems[lbIndex];
    $('#lightboxImg').attr('src', item.src);
    $('#lightboxCounter').text((lbIndex + 1) + ' / ' + lbItems.length);
    $('#lightboxOverlay').addClass('open');
}

// ── Eventos del lightbox ──────────────────────────────────────
$(document).ready(function() {
    $('#lightboxClose').on('click', function() {
        $('#lightboxOverlay').removeClass('open');
    });
    $('#lightboxOverlay').on('click', function(e) {
        if (e.target === this) $('#lightboxOverlay').removeClass('open');
    });
    $('#lightboxPrev').on('click', function() {
        if (lbItems.length === 0) return;
        lbIndex--;
        if (lbIndex < 0) lbIndex = lbItems.length - 1;
        mostrarLightbox();
    });
    $('#lightboxNext').on('click', function() {
        if (lbItems.length === 0) return;
        lbIndex++;
        if (lbIndex >= lbItems.length) lbIndex = 0;
        mostrarLightbox();
    });
    // Teclado
    $(document).on('keydown', function(e) {
        if (!$('#lightboxOverlay').hasClass('open')) return;
        if (e.key === 'Escape') $('#lightboxOverlay').removeClass('open');
        if (e.key === 'ArrowLeft') $('#lightboxPrev').click();
        if (e.key === 'ArrowRight') $('#lightboxNext').click();
    });
});

// ── Guardar checklist ─────────────────────────────────────────
function recolectarDetalles() {
    var detalles = [];
    $('.radio-group').each(function() {
        var idItem = $(this).data('id-item');
        var resultado = $(this).find('input[type="radio"]:checked').val() || '';
        var comentario = $('.cl-item-coment[data-id-item="' + idItem + '"]').val() || '';

        // Recolectar fotos (las que ya tienen url del servidor, incluyendo las recién subidas)
        var fotosTmp = fotosTemp[idItem] || [];
        var fotosUrls = fotosTmp.map(function(f) { return f.url; }).filter(function(u) { return u; });

        detalles.push({
            id_item: idItem,
            resultado: resultado,
            comentario: comentario,
            fotos: fotosUrls
        });
    });
    return detalles;
}

function guardarChecklist() {
    var id_checklist = parseInt($('#id_checklist').val());
    var id_activo = parseInt($('#id_activo').val());
    var id_operador = parseInt($('#id_operador').val());
    var fecha_checklist = $('#fecha_checklist').val();
    var hora_checklist = $('#hora_checklist').val();
    var kilometraje = $('#kilometraje').val();
    var estado_general = $('#estado_general').val();
    var observaciones = $('#observaciones').val();

    if (!id_activo || !id_operador || !fecha_checklist) {
        showNotif('Complete los campos obligatorios', 'error');
        return;
    }

    // Subir fotos pendientes (las que no tienen url) al servidor ANTES de guardar
    var fotosPendientes = [];
    Object.keys(fotosTemp).forEach(function(idItem) {
        fotosTemp[idItem].forEach(function(f, fi) {
            if (!f.url && f.dataUri) {
                fotosPendientes.push({ idItem: parseInt(idItem), idx: fi, dataUri: f.dataUri });
            }
        });
    });

    if (fotosPendientes.length > 0) {
        showNotif('Subiendo fotos (' + fotosPendientes.length + ')...', 'info');
        subirFotosSecuencial(fotosPendientes, 0, function() {
            // Recolectar detalles DESPUÉS de subir fotos (para que fotosUrls incluya las URLs recién subidas)
            var detalles = recolectarDetalles();
            ejecutarGuardadoChecklist(id_checklist, id_activo, id_operador, fecha_checklist, hora_checklist, kilometraje, estado_general, observaciones, detalles);
        });
    } else {
        var detalles = recolectarDetalles();
        ejecutarGuardadoChecklist(id_checklist, id_activo, id_operador, fecha_checklist, hora_checklist, kilometraje, estado_general, observaciones, detalles);
    }
}

// ── Subir fotos pendientes (dataUri redimensionado → servidor) ──
function subirFotosSecuencial(pendientes, index, callback) {
    if (index >= pendientes.length) {
        if (callback) callback();
        return;
    }
    var p = pendientes[index];

    if (!p.dataUri) {
        subirFotosSecuencial(pendientes, index + 1, callback);
        return;
    }

    $.ajax({
        url: 'api/subir_foto_checklist.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ foto_base64: p.dataUri }),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                var arr = fotosTemp[p.idItem];
                if (arr && arr[p.idx]) {
                    arr[p.idx].url = res.url;
                }
            }
            subirFotosSecuencial(pendientes, index + 1, callback);
        },
        error: function() {
            subirFotosSecuencial(pendientes, index + 1, callback);
        }
    });
}

function ejecutarGuardadoChecklist(id_checklist, id_activo, id_operador, fecha_checklist, hora_checklist, kilometraje, estado_general, observaciones, detalles) {
    var data = {
        action: 'guardar_checklist',
        id_checklist: id_checklist,
        id_activo: id_activo,
        id_operador: id_operador,
        fecha_checklist: fecha_checklist,
        hora_checklist: hora_checklist,
        kilometraje: kilometraje,
        estado_general: estado_general,
        observaciones: observaciones,
        detalles: JSON.stringify(detalles)
    };

    $.ajax({
        url: API,
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Checklist guardado correctamente', 'success');
                $('#modalChecklist').removeClass('open');
                fotosTemp = {};
                eliminarBorrador();
                cargarChecklists();
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

// ── Eliminar checklist ────────────────────────────────────────
function eliminarChecklist(id) {
    if (!confirm('¿Está seguro de eliminar este checklist?')) return;
    $.ajax({
        url: API,
        method: 'POST',
        data: { action: 'eliminar_checklist', id: id },
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                showNotif('Checklist eliminado', 'success');
                cargarChecklists();
            } else {
                showNotif('Error: ' + (res.mensaje || 'Error'), 'error');
            }
        }
    });
}

// ── Acordeón: toggle grupo ────────────────────────────────────
function toggleGrupo(header) {
    var $body = $(header).next('.cl-grupo-body');
    var $arrow = $(header).find('.cl-grupo-arrow');
    if ($body.is(':visible')) {
        $body.slideUp(150);
        $arrow.css('transform', 'rotate(0deg)');
    } else {
        $body.slideDown(150);
        $arrow.css('transform', 'rotate(90deg)');
    }
}

// ── Formateo de fechas ────────────────────────────────────────
function formatFecha(v) {
    if (!v) return '';
    var d = new Date(v);
    if (isNaN(d.getTime())) return v;
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth()+1)).slice(-2) + '/' + d.getFullYear();
}

function formatFechaCorta(v) {
    if (!v) return '';
    var parts = v.split('-');
    if (parts.length === 3) return parts[2] + '/' + parts[1] + '/' + parts[0];
    return v;
}

// ── Utilidades ────────────────────────────────────────────────
function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}

function showNotif(msg, type) {
    var $bar = $('#notifBar');
    $bar.text(msg).removeClass('notif-success notif-error').addClass(type === 'success' ? 'notif-success' : 'notif-error').fadeIn(200);
    setTimeout(function() { $bar.fadeOut(400); }, 4000);
}

// ── Radio buttons: toggle y actualizar status del grupo ───────
function bindRadioChange() {
    // Usar delegación de eventos para que funcione con contenido dinámico
    $('#itemsContainer').off('click', '.radio-group label').on('click', '.radio-group label', function(e) {
        e.preventDefault(); // Evitar comportamiento nativo del label sobre el input oculto
        var $label = $(this);
        var $input = $label.find('input[type="radio"]');
        var $group = $label.closest('.radio-group');

        // Toggle: si ya estaba seleccionado, deseleccionar
        if ($label.hasClass('selected')) {
            $input.prop('checked', false);
            $label.removeClass('selected');
        } else {
            $group.find('label').removeClass('selected');
            $group.find('input[type="radio"]').prop('checked', false);
            $input.prop('checked', true);
            $label.addClass('selected');
        }

        // Actualizar status del grupo
        actualizarStatusGrupo($group[0]);
        guardarBorrador();
    });

    // Comentarios: guardar borrador al escribir (delegación)
    $('#itemsContainer').off('input', '.cl-item-coment').on('input', '.cl-item-coment', function() {
        guardarBorrador();
    });
}

function actualizarStatusGrupo(radioGroup) {
    var $group = $(radioGroup);
    var $clItem = $group.closest('.cl-item');
    var $grupoBody = $clItem.closest('.cl-grupo-body');
    var $grupo = $grupoBody.closest('.cl-grupo');
    var $status = $grupo.find('.cl-grupo-status');

    var allOk = true;
    var someChecked = false;
    $grupoBody.find('.radio-group').each(function() {
        var $sel = $(this).find('label.selected');
        if ($sel.length > 0) {
            someChecked = true;
            var val = $sel.find('input').val();
            if (val !== 'BUENO') allOk = false;
        }
    });

    if (someChecked) {
        if (allOk) {
            if ($status.length === 0) {
                $grupo.find('.cl-grupo-header').append('<span class="cl-grupo-status cl-gs-ok">\u2713</span>');
            } else {
                $status.removeClass('cl-gs-warn').addClass('cl-gs-ok').text('\u2713');
            }
        } else {
            if ($status.length === 0) {
                $grupo.find('.cl-grupo-header').append('<span class="cl-grupo-status cl-gs-warn">\u26A0</span>');
            } else {
                $status.removeClass('cl-gs-ok').addClass('cl-gs-warn').text('\u26A0');
            }
        }
    } else {
        $status.remove();
    }
}

// ═══════════════════════════════════════════════════════════════
//  LOCALSTORAGE - Borrador automático
// ═══════════════════════════════════════════════════════════════
var DRAFT_KEY = 'ca_checklist_draft';

function guardarBorrador() {
    // Solo guardar si el modal está abierto
    if (!$('#modalChecklist').hasClass('open')) return;

    // Recolectar items (radios y comentarios)
    var items = {};
    $('.radio-group').each(function() {
        var idItem = $(this).data('id-item');
        var resultado = $(this).find('input[type="radio"]:checked').val() || '';
        var comentario = $('.cl-item-coment[data-id-item="' + idItem + '"]').val() || '';
        items[idItem] = { resultado: resultado, comentario: comentario };
    });

    // Recolectar fotos (ahora son dataUri redimensionados ~100-200KB, caben en localStorage)
    var fotos = {};
    Object.keys(fotosTemp).forEach(function(idItem) {
        fotosTemp[idItem].forEach(function(f, fi) {
            if (f.dataUri) {
                if (!fotos[idItem]) fotos[idItem] = [];
                fotos[idItem].push(f.dataUri);
            }
        });
    });

    var draft = {
        id_checklist: $('#id_checklist').val(),
        id_activo: $('#id_activo').val(),
        id_operador: $('#id_operador').val(),
        fecha_checklist: $('#fecha_checklist').val(),
        hora_checklist: $('#hora_checklist').val(),
        kilometraje: $('#kilometraje').val(),
        estado_general: $('#estado_general').val(),
        observaciones: $('#observaciones').val(),
        items: items,
        fotos: fotos
    };

    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch(e) {
        console.warn('No se pudo guardar el borrador:', e);
    }
}

function restaurarBorrador() {
    var raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    var draft;
    try {
        draft = JSON.parse(raw);
    } catch(e) {
        eliminarBorrador();
        return;
    }

    if (!draft || !draft.items) {
        eliminarBorrador();
        return;
    }

    // Restaurar campos del formulario
    if (draft.id_checklist) $('#id_checklist').val(draft.id_checklist);
    if (draft.id_activo) $('#id_activo').val(draft.id_activo);
    if (draft.id_operador) $('#id_operador').val(draft.id_operador);
    if (draft.fecha_checklist) $('#fecha_checklist').val(draft.fecha_checklist);
    if (draft.hora_checklist) $('#hora_checklist').val(draft.hora_checklist);
    if (draft.kilometraje) $('#kilometraje').val(draft.kilometraje);
    if (draft.estado_general) $('#estado_general').val(draft.estado_general);
    if (draft.observaciones) $('#observaciones').val(draft.observaciones);

    // Restaurar fotos desde localStorage (ahora son dataUri redimensionados ~100-200KB)
    if (draft.fotos) {
        Object.keys(draft.fotos).forEach(function(idItem) {
            var fotosArr = draft.fotos[idItem];
            if (fotosArr && fotosArr.length > 0) {
                if (!fotosTemp[idItem]) fotosTemp[idItem] = [];
                fotosArr.forEach(function(dataUri) {
                    fotosTemp[idItem].push({
                        blobUrl: dataUri,
                        file: null,
                        dataUri: dataUri,
                        url: null
                    });
                });
            }
        });
    }

    // Restaurar radios y comentarios (debe ejecutarse DESPUÉS de generarItemsHTML)
    Object.keys(draft.items).forEach(function(idItem) {
        var item = draft.items[idItem];
        if (item.resultado) {
            var $radio = $('input[name="rdo_' + idItem + '"][value="' + item.resultado + '"]');
            if ($radio.length) {
                $radio.prop('checked', true);
                $radio.closest('label').addClass('selected');
            }
        }
        if (item.comentario) {
            $('.cl-item-coment[data-id-item="' + idItem + '"]').val(item.comentario);
        }
    });

    // Actualizar status de grupos
    $('.radio-group').each(function() {
        actualizarStatusGrupo(this);
    });

    // Restaurar thumbnails de fotos en cada item
    if (draft.fotos) {
        Object.keys(draft.fotos).forEach(function(idItem) {
            actualizarUIItem(idItem);
        });
    }
}

function eliminarBorrador() {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch(e) {
        // Ignorar
    }
}

// ═══════════════════════════════════════════════════════════════
//  INIT - Punto de entrada
// ═══════════════════════════════════════════════════════════════
$(document).ready(function() {
    buildTableHead();
    cargarCombos();
    cargarChecklists();
    bindControls();
    bindModalEvents();
});
