// inventario.js  â€“  Inventario de Equipos TI (tabla nativa, sin DevExtreme)

(function () {
  'use strict';

  var API = 'api/datos.php';
  var STORAGE_KEY = 'ti_inv_filters_v1';

  // â”€â”€ Columnas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var COLS = [
    { key: 'Id',              label: 'ID',           w: '55px', sort: true,  filter: false },
    { key: 'NInventario',     label: 'N\u00b0 Inventario',    sort: true,  filter: false },
    { key: 'Tipo',            label: 'Tipo',          sort: true,  filter: true  },
    { key: 'Marca',           label: 'Marca',         sort: true,  filter: true  },
    { key: 'Modelo',          label: 'Modelo',        sort: true,  filter: false },
    { key: 'NSerie',          label: 'N\u00b0 Serie',         sort: true,  filter: false },
    { key: 'Ubicacion',       label: 'Ubicaci\u00f3n',        sort: true,  filter: true  },
    { key: 'UsuarioAsignado', label: 'Asignado a',    sort: true,  filter: true  },
    { key: 'Estado',          label: 'Estado',        sort: true,  filter: true, badge: 'estado' },
    { key: '_acc',            label: 'Acciones',      sort: false, filter: false, w: '170px' }
  ];

  var allData    = [];
  var colFilters = {};
  var searchTxt  = '';
  var curPage    = 1;
  var pageSize   = 25;
  var sortKey    = 'NInventario';
  var sortDir    = 'asc';
  var tiposEquipo  = [];
  var estadosEquipo = [];

  // â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  document.addEventListener('DOMContentLoaded', function () {
    buildTableHead();
    loadFilters();
    cargarCombos();
    cargarDatos();
    bindControls();
    bindModalEvents();
  });

  // â”€â”€ Construir cabecera â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function buildTableHead() {
    var tr = document.querySelector('#tblInventario thead tr');
    if (!tr) return;
    tr.innerHTML = '';
    COLS.forEach(function (col) {
      var th = document.createElement('th');
      if (col.w) th.style.width = col.w;
      th.dataset.key = col.key;
      var span = document.createElement('span');
      span.textContent = col.label;
      th.appendChild(span);
      if (col.sort) {
        th.classList.add('sortable');
        th.addEventListener('click', function (e) {
          if (e.target.closest && e.target.closest('.cf-btn, .cf-dropdown')) return;
          if (sortKey === col.key) sortDir = (sortDir === 'asc' ? 'desc' : 'asc');
          else { sortKey = col.key; sortDir = 'asc'; }
          updateSortArrows();
          applyAll();
        });
      }
      if (col.filter) {
        var btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'cf-btn'; btn.title = 'Filtrar'; btn.innerHTML = '&#9660;';
        var badge = document.createElement('span'); badge.className = 'cf-badge';
        btn.appendChild(badge);
        btn.addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown(th, col.key, btn, badge); });
        th.appendChild(btn);
      }
      tr.appendChild(th);
    });
    updateSortArrows();
  }

  // â”€â”€ Cargar datos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function cargarDatos() {
    tblLoading(true);
    fetch(API + '?action=listar_equipos')
      .then(function (r) { return r.json(); })
      .then(function (res) {
        tblLoading(false);
        if (!res.success) { showNotif('Error: ' + res.mensaje, 'error'); return; }
        allData = res.data || [];
        applyAll();
      })
      .catch(function (e) { tblLoading(false); showNotif('Error de red: ' + e.message, 'error'); });
  }

  // â”€â”€ Pipeline: filtrar â†’ ordenar â†’ paginar â†’ renderizar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function applyAll() {
    var data = allData.slice();
    // bÃºsqueda global
    if (searchTxt) {
      var q = searchTxt.toLowerCase();
      data = data.filter(function (r) {
        return COLS.some(function (c) {
          if (c.key === '_acc') return false;
          return String(r[c.key] || '').toLowerCase().indexOf(q) !== -1;
        });
      });
    }
    // filtros por columna
    Object.keys(colFilters).forEach(function (k) {
      var s = colFilters[k];
      if (!s || s.size === 0) return;
      data = data.filter(function (r) { return s.has(String(r[k] || '')); });
    });
    // ordenar
    if (sortKey && sortKey !== '_acc') {
      data.sort(function (a, b) {
        var na = parseFloat(a[sortKey]);
        var nb = parseFloat(b[sortKey]);
        if (!isNaN(na) && !isNaN(nb)) {
          return sortDir === 'asc' ? na - nb : nb - na;
        }
        var va = String(a[sortKey] || '').toLowerCase();
        var vb = String(b[sortKey] || '').toLowerCase();
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ?  1 : -1;
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
    var tbody = document.getElementById('tblInventarioBody');
    if (!tbody) return;
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="' + COLS.length + '" style="text-align:center;padding:28px;color:#888">Sin registros</td></tr>';
      return;
    }
    var html = '';
    rows.forEach(function (r) {
      html += '<tr>';
      COLS.forEach(function (col) {
        if (col.key === '_acc') {
          html += '<td style="white-space:nowrap">' +
            '<button class="btn-ti btn-ti-warning btn-sm" onclick="editarEquipo(' + r.Id + ')"><i class="fa fa-edit"></i> Editar</button> ' +
            '<button class="btn-ti btn-ti-secondary btn-sm" onclick="verHistorialById(' + r.Id + ')"><i class="fa fa-history"></i> Historial</button>' +
            '</td>';
        } else if (col.badge === 'estado') {
          var cls = 'badge-estado badge-' + String(r[col.key] || '').replace(/\s/g, '-');
          html += '<td><span class="' + cls + '">' + esc(r[col.key] || '') + '</span></td>';
        } else {
          html += '<td title="' + esc(String(r[col.key] || '')) + '">' + esc(String(r[col.key] || '')) + '</td>';
        }
      });
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // â”€â”€ Historial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  window.verHistorialById = function (id) {
    var r = allData.find(function (d) { return d.Id == id; });
    if (!r) return;
    var panel = document.getElementById('panelHistorial');
    document.getElementById('lblEquipoHistorial').textContent =
      '[' + (r.NInventario || 'Sin N\u00b0') + '] ' + r.Marca + ' ' + r.Modelo;
    document.getElementById('tblHistorialBody').innerHTML =
      '<tr><td colspan="9" style="text-align:center;padding:18px">Cargando...</td></tr>';
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });

    fetch(API + '?action=listar_movimientos&id_equipo=' + id)
      .then(function (rr) { return rr.json(); })
      .then(function (res) {
        if (!res.success) { showNotif('Error historial: ' + res.mensaje, 'error'); return; }
        var rows = res.data || [];
        if (!rows.length) {
          document.getElementById('tblHistorialBody').innerHTML =
            '<tr><td colspan="9" style="text-align:center;padding:16px;color:#888">Sin movimientos registrados.</td></tr>';
          return;
        }
        var html = '';
        rows.forEach(function (m) {
          var cls = 'badge-mov badge-' + (m.TipoMovimiento || '').replace(/\s/g, '-');
          html += '<tr>' +
            '<td>' + esc(formatFecha(m.Fecha || '')) + '</td>' +
            '<td><span class="' + cls + '">' + esc(m.TipoMovimiento || '-') + '</span></td>' +
            '<td>' + esc(m.Usuario || '') + '</td>' +
            '<td>' + esc(m.Cargo || '') + '</td>' +
            '<td>' + esc(m.Area || '') + '</td>' +
            '<td>' + esc(m.Ubicacion || '') + '</td>' +
            '<td>' + esc(m.Accesorios || '') + '</td>' +
            '<td>' + esc(m.Observaciones || '') + '</td>' +
            '<td>' + esc(m.registradoPor || '') + '</td>' +
            '</tr>';
        });
        document.getElementById('tblHistorialBody').innerHTML = html;
      });
  };

  // â”€â”€ Filtros por columna â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function toggleDropdown(th, colKey, btn, badge) {
    document.querySelectorAll('.cf-dropdown').forEach(function (d) { d.remove(); });
    var cur = colFilters[colKey] || new Set();
    var vals = [];
    var seen = {};
    allData.forEach(function (r) {
      var v = String(r[colKey] || '');
      if (!seen[v]) { seen[v] = true; vals.push(v); }
    });
    vals.sort();

    var dd = document.createElement('div');
    dd.className = 'cf-dropdown';
    dd.style.cssText = 'position:absolute;top:calc(100% + 4px);left:0;background:#fff;border:1px solid #cdd6e0;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.13);padding:10px;z-index:3000;min-width:190px;max-height:260px;overflow-y:auto;';

    var list = document.createElement('div');
    vals.forEach(function (v) {
      var uid = 'cf_' + colKey + '_' + Math.random().toString(36).substr(2, 5);
      var wrap = document.createElement('div'); wrap.style.marginBottom = '5px';
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = uid; cb.value = v;
      cb.style.marginRight = '7px'; if (cur.has(v)) cb.checked = true;
      var lbl = document.createElement('label'); lbl.htmlFor = uid; lbl.textContent = v || '(vac\u00edo)'; lbl.style.cursor = 'pointer';
      wrap.appendChild(cb); wrap.appendChild(lbl); list.appendChild(wrap);
    });
    dd.appendChild(list);

    var footer = document.createElement('div');
    footer.style.cssText = 'display:flex;justify-content:space-between;margin-top:10px;gap:6px;';

    var bClear = document.createElement('button'); bClear.type = 'button'; bClear.textContent = 'Limpiar';
    bClear.className = 'btn-ti btn-ti-danger btn-sm';
    bClear.onclick = function () {
      delete colFilters[colKey]; btn.classList.remove('active'); badge.style.display = 'none';
      saveFilters(); dd.remove(); curPage = 1; applyAll();
    };

    var bApply = document.createElement('button'); bApply.type = 'button'; bApply.textContent = 'Aplicar';
    bApply.className = 'btn-ti btn-ti-primary btn-sm';
    bApply.onclick = function () {
      var s = new Set();
      dd.querySelectorAll('input:checked').forEach(function (c) { s.add(c.value); });
      if (s.size) { colFilters[colKey] = s; btn.classList.add('active'); badge.textContent = s.size; badge.style.display = 'inline-block'; }
      else { delete colFilters[colKey]; btn.classList.remove('active'); badge.style.display = 'none'; }
      saveFilters(); dd.remove(); curPage = 1; applyAll();
    };

    footer.appendChild(bClear); footer.appendChild(bApply); dd.appendChild(footer);
    th.style.position = 'relative'; th.appendChild(dd);
  }

  function saveFilters() {
    try {
      var obj = {};
      Object.keys(colFilters).forEach(function (k) { if (colFilters[k].size) obj[k] = Array.from(colFilters[k]); });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {}
  }

  function loadFilters() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY); if (!raw) return;
      var obj = JSON.parse(raw);
      Object.keys(obj).forEach(function (k) {
        colFilters[k] = new Set(obj[k]);
        var th = document.querySelector('#tblInventario thead th[data-key="' + k + '"]');
        if (!th) return;
        var btn = th.querySelector('.cf-btn'); var bdg = btn && btn.querySelector('.cf-badge');
        if (btn) btn.classList.add('active');
        if (bdg) { bdg.textContent = obj[k].length; bdg.style.display = 'inline-block'; }
      });
    } catch (e) {}
  }

  // â”€â”€ Controles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function bindControls() {
    var si = document.getElementById('searchInput');
    if (si) si.addEventListener('input', function () { searchTxt = this.value; curPage = 1; applyAll(); });
    document.getElementById('prevPage').addEventListener('click', function () { if (curPage > 1) { curPage--; applyAll(); } });
    document.getElementById('nextPage').addEventListener('click', function () { curPage++; applyAll(); });
    document.getElementById('pageSizeSelect').addEventListener('change', function () { pageSize = parseInt(this.value) || 25; curPage = 1; applyAll(); });
    document.getElementById('btnLimpiarFiltros').addEventListener('click', function () {
      colFilters = {}; searchTxt = '';
      var si2 = document.getElementById('searchInput'); if (si2) si2.value = '';
      document.querySelectorAll('#tblInventario .cf-btn.active').forEach(function (b) {
        b.classList.remove('active'); var bdg = b.querySelector('.cf-badge'); if (bdg) bdg.style.display = 'none';
      });
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      curPage = 1; applyAll();
    });
    document.addEventListener('click', function () { document.querySelectorAll('.cf-dropdown').forEach(function (d) { d.remove(); }); });
    var tbl = document.getElementById('tblInventario');
    if (tbl) tbl.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  function updatePageInfo(p, pages, total) {
    var el = document.getElementById('pageInfo');
    if (el) el.textContent = 'P\u00e1gina ' + p + ' de ' + pages + ' (' + total + ' registros)';
  }

  function updateSortArrows() {
    document.querySelectorAll('#tblInventario thead th[data-key]').forEach(function (th) {
      var k = th.dataset.key;
      var col = COLS.find(function (c) { return c.key === k; });
      if (!col) return;
      var span = th.querySelector('span'); if (!span) return;
      span.textContent = col.label + (k === sortKey ? (sortDir === 'asc' ? ' \u25b2' : ' \u25bc') : '');
    });
  }

  function tblLoading(v) {
    var tb = document.getElementById('tblInventarioBody');
    if (tb && v) tb.innerHTML = '<tr><td colspan="' + COLS.length + '" style="text-align:center;padding:28px;color:#888">Cargando...</td></tr>';
  }

  // â”€â”€ Combos para modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function cargarCombos() {
    fetch(API + '?action=cmb_tipos').then(function (r) { return r.json(); }).then(function (res) {
      if (res.success) { tiposEquipo = res.data; poblarSel('fldTipo', tiposEquipo); }
    });
    fetch(API + '?action=cmb_estados_equipo').then(function (r) { return r.json(); }).then(function (res) {
      if (res.success) { estadosEquipo = res.data; poblarSel('fldEstado', estadosEquipo, 'EN ALMACEN'); }
    });
  }

  function poblarSel(id, arr, def) {
    var sel = document.getElementById(id); if (!sel) return;
    sel.innerHTML = '<option value="">-- Seleccionar --</option>';
    arr.forEach(function (v) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); });
    if (def) sel.value = def;
  }

  // â”€â”€ Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function bindModalEvents() {
    document.getElementById('btnNuevoEquipo').addEventListener('click', abrirModalNuevo);
    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('btnCancelarModal').addEventListener('click', cerrarModal);
    document.getElementById('btnGuardarEquipo').addEventListener('click', guardarEquipo);
    document.getElementById('modalEquipo').addEventListener('click', function (e) { if (e.target === this) cerrarModal(); });
  }

  function abrirModalNuevo() {
    resetForm();
    document.getElementById('modalEquipoTitulo').textContent = 'Nuevo equipo';
    document.getElementById('modalEquipo').classList.add('open');
  }

  window.editarEquipo = function (id) {
    var r = allData.find(function (d) { return d.Id == id; }); if (!r) return;
    resetForm();
    document.getElementById('modalEquipoTitulo').textContent = 'Editar equipo \u2013 ' + r.Marca + ' ' + r.Modelo;
    setV('fldId', r.Id); setV('fldNInventario', r.NInventario); setV('fldTipo', r.Tipo);
    setV('fldMarca', r.Marca); setV('fldModelo', r.Modelo); setV('fldNSerie', r.NSerie);
    setV('fldPin', r.Pin); setV('fldUbicacion', r.Ubicacion); setV('fldEstado', r.Estado);
    setV('fldCorreo', r.Correo); setV('fldContrasena', r['\u0043ontra\u0073e\u00f1a'] || r['Contrase\u00f1a'] || '');
    setAccesorios(r.Accesorios); setV('fldObservaciones', r.Observaciones);
    document.getElementById('modalEquipo').classList.add('open');
  };

  function cerrarModal() { document.getElementById('modalEquipo').classList.remove('open'); }

  function resetForm() {
    ['fldId','fldNInventario','fldMarca','fldModelo','fldNSerie','fldPin',
     'fldUbicacion','fldCorreo','fldContrasena','fldObservaciones']
      .forEach(function (id) { setV(id, ''); });
    document.querySelectorAll('input[name="fldAccesorio"]').forEach(function (cb) { cb.checked = false; });
    setV('fldTipo', ''); setV('fldEstado', 'EN ALMACEN');
  }

  function guardarEquipo() {
    var marca = gV('fldMarca').trim(), modelo = gV('fldModelo').trim();
    if (!marca || !modelo) { showNotif('Marca y Modelo son requeridos.', 'warning'); return; }
    var btn = document.getElementById('btnGuardarEquipo');
    btn.disabled = true; btn.textContent = 'Guardando...';
    fetch(API + '?action=guardar_equipo', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Id: gV('fldId'), NInventario: gV('fldNInventario'), Tipo: gV('fldTipo'),
        Marca: marca, Modelo: modelo, NSerie: gV('fldNSerie'), Pin: gV('fldPin'),
        Ubicacion: gV('fldUbicacion'), Estado: gV('fldEstado') || 'Disponible',
        Correo: gV('fldCorreo'), 'ContraseÃ±a': gV('fldContrasena'),
        Accesorios: getAccesorios(), Observaciones: gV('fldObservaciones')
      })
    }).then(function (r) { return r.json(); }).then(function (res) {
      btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> Guardar';
      if (res.success) { showNotif(res.mensaje, 'success'); cerrarModal(); cargarDatos(); }
      else showNotif('Error: ' + res.mensaje, 'error');
    }).catch(function (e) {
      btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> Guardar';
      showNotif('Error de red: ' + e.message, 'error');
    });
  }

  // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function formatFecha(v) {
    if (!v) return '';
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[3] + '/' + m[2] + '/' + m[1];
    return v;
  }
  function gV(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function setV(id, v) { var el = document.getElementById(id); if (el) el.value = v || ''; }
  function getAccesorios() {
    var vals = [];
    document.querySelectorAll('input[name="fldAccesorio"]:checked').forEach(function (cb) { vals.push(cb.value); });
    return vals.join(', ');
  }
  function setAccesorios(val) {
    var parts = (val || '').split(',').map(function (s) { return s.trim().toUpperCase(); });
    document.querySelectorAll('input[name="fldAccesorio"]').forEach(function (cb) {
      cb.checked = parts.indexOf(cb.value) !== -1;
    });
  }
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showNotif(msg, type) {
    var bar = document.getElementById('notifBar'); if (!bar) return;
    bar.textContent = msg;
    bar.className = 'notif-bar notif-' + (type || 'info');
    bar.style.display = 'block';
    clearTimeout(bar._t);
    bar._t = setTimeout(function () { bar.style.display = 'none'; }, 4000);
  }

})();
