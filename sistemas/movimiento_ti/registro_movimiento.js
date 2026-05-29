// registro_movimiento.js  –  Registro de Movimientos TI (tabla nativa, sin DevExtreme)

(function () {
  'use strict';

  var API         = 'api/datos.php';
  var STORAGE_KEY = 'ti_mov_filters_v1';

  var COLS = [
    { key: 'Id',             label: 'ID',             w: '55px',  sort: true,  filter: false },
    { key: 'Fecha',          label: 'Fecha',           w: '108px', sort: true,  filter: true  },
    { key: 'TipoMovimiento', label: 'Movimiento',      w: '150px', sort: true,  filter: true,  badge: 'mov' },
    { key: 'NInventario',    label: 'N\u00b0 Inventario',   w: '115px', sort: true,  filter: true  },
    { key: 'Tipo',           label: 'Tipo equipo',     w: '110px', sort: true,  filter: true  },
    { key: 'Marca',          label: 'Marca',           w: '',      sort: true,  filter: true  },
    { key: 'Modelo',         label: 'Modelo',          w: '',      sort: true,  filter: false },
    { key: 'NSerie',         label: 'N\u00b0 Serie',        w: '120px', sort: true,  filter: false },
    { key: 'Usuario',        label: 'Receptor',        w: '',      sort: true,  filter: true  },
    { key: 'Cargo',          label: 'Cargo',           w: '110px', sort: true,  filter: true  },
    { key: 'Area',           label: '\u00c1rea',            w: '110px', sort: true,  filter: true  },
    { key: 'Ubicacion',      label: 'Ubicaci\u00f3n',       w: '110px', sort: true,  filter: true  },
    { key: 'registradoPor',  label: 'Registrado por',  w: '130px', sort: true,  filter: true  },
    { key: '_acc',           label: 'Acciones',        w: '170px', sort: false, filter: false }
  ];

  var allData        = [];
  var colFilters     = {};
  var searchTxt      = '';
  var curPage        = 1;
  var pageSize       = 25;
  var sortKey        = 'Id';
  var sortDir        = 'desc';
  var tiposEquipo    = [];
  var tiposMovimiento = [];
  var equipos        = [];
  var usuarios       = [];

  // ── Init ─────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    buildTableHead();
    loadFilters();
    setFechaHoy();
    cargarCombos();
    cargarDatos();
    bindControls();
    bindModalEvents();
  });

  // ── Construir cabecera ────────────────────────────────────────────
  function buildTableHead() {
    var tr = document.querySelector('#tblMovimientos thead tr');
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

  // ── Cargar datos ─────────────────────────────────────────────────
  function cargarDatos() {
    tblLoading(true);
    fetch(API + '?action=listar_movimientos')
      .then(function (r) { return r.json(); })
      .then(function (res) {
        tblLoading(false);
        if (!res.success) { showNotif('Error: ' + res.mensaje, 'error'); return; }
        allData = res.data || [];
        applyAll();
      })
      .catch(function (e) { tblLoading(false); showNotif('Error de red: ' + e.message, 'error'); });
  }

  // ── Pipeline: filtrar -> ordenar -> paginar -> renderizar ─────────
  function applyAll() {
    var data = allData.slice();
    if (searchTxt) {
      var q = searchTxt.toLowerCase();
      data = data.filter(function (r) {
        return COLS.some(function (c) {
          if (c.key === '_acc') return false;
          return String(r[c.key] || '').toLowerCase().indexOf(q) !== -1;
        });
      });
    }
    Object.keys(colFilters).forEach(function (k) {
      var s = colFilters[k];
      if (!s || s.size === 0) return;
      data = data.filter(function (r) { return s.has(String(r[k] || '')); });
    });
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
    var total = data.length;
    var pages = Math.max(1, Math.ceil(total / pageSize));
    if (curPage > pages) curPage = pages;
    renderRows(data.slice((curPage - 1) * pageSize, curPage * pageSize));
    updatePageInfo(curPage, pages, total);
  }

  function renderRows(rows) {
    var tbody = document.getElementById('tblMovimientosBody');
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
            '<button class="btn-ti btn-ti-warning btn-sm" onclick="editarMovimiento(' + r.Id + ')"><i class="fa fa-edit"></i> Editar</button>';
          if (r.TipoMovimiento === 'ASIGNACION') {
            html += ' <button class="btn-ti btn-ti-acta btn-sm" onclick="window.open(\'acta.php?id=' + r.Id + '\', \'_blank\')" title="Ver / firmar acta"><i class="fa fa-file-signature"></i> Acta</button>';
          }
          html += '</td>';
        } else if (col.badge === 'mov') {
          var cls = 'badge-mov badge-' + String(r[col.key] || '').replace(/\s/g, '-');
          html += '<td><span class="' + cls + '">' + esc(r[col.key] || '') + '</span></td>';
        } else if (col.key === 'Fecha') {
          html += '<td>' + esc(formatFecha(String(r[col.key] || ''))) + '</td>';
        } else {
          html += '<td title="' + esc(String(r[col.key] || '')) + '">' + esc(String(r[col.key] || '')) + '</td>';
        }
      });
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // ── Filtros por columna ──────────────────────────────────────────
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
        var th = document.querySelector('#tblMovimientos thead th[data-key="' + k + '"]');
        if (!th) return;
        var btn2 = th.querySelector('.cf-btn'); var bdg = btn2 && btn2.querySelector('.cf-badge');
        if (btn2) btn2.classList.add('active');
        if (bdg) { bdg.textContent = obj[k].length; bdg.style.display = 'inline-block'; }
      });
    } catch (e) {}
  }

  // ── Controles ────────────────────────────────────────────────────
  function bindControls() {
    var si = document.getElementById('searchInput');
    if (si) si.addEventListener('input', function () { searchTxt = this.value; curPage = 1; applyAll(); });
    document.getElementById('prevPage').addEventListener('click', function () { if (curPage > 1) { curPage--; applyAll(); } });
    document.getElementById('nextPage').addEventListener('click', function () { curPage++; applyAll(); });
    document.getElementById('pageSizeSelect').addEventListener('change', function () { pageSize = parseInt(this.value) || 25; curPage = 1; applyAll(); });
    document.getElementById('btnLimpiarFiltros').addEventListener('click', function () {
      colFilters = {}; searchTxt = '';
      var si2 = document.getElementById('searchInput'); if (si2) si2.value = '';
      document.querySelectorAll('#tblMovimientos .cf-btn.active').forEach(function (b) {
        b.classList.remove('active'); var bdg = b.querySelector('.cf-badge'); if (bdg) bdg.style.display = 'none';
      });
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      curPage = 1; applyAll();
    });
    document.addEventListener('click', function () { document.querySelectorAll('.cf-dropdown').forEach(function (d) { d.remove(); }); });
    var tbl = document.getElementById('tblMovimientos');
    if (tbl) tbl.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  function updatePageInfo(p, pages, total) {
    var el = document.getElementById('pageInfo');
    if (el) el.textContent = 'P\u00e1gina ' + p + ' de ' + pages + ' (' + total + ' registros)';
  }

  function updateSortArrows() {
    document.querySelectorAll('#tblMovimientos thead th[data-key]').forEach(function (th) {
      var k = th.dataset.key;
      var col = COLS.find(function (c) { return c.key === k; });
      if (!col) return;
      var span = th.querySelector('span'); if (!span) return;
      span.textContent = col.label + (k === sortKey ? (sortDir === 'asc' ? ' \u25b2' : ' \u25bc') : '');
    });
  }

  function tblLoading(v) {
    var tb = document.getElementById('tblMovimientosBody');
    if (tb && v) tb.innerHTML = '<tr><td colspan="' + COLS.length + '" style="text-align:center;padding:28px;color:#888">Cargando...</td></tr>';
  }

  // ── Combos ────────────────────────────────────────────────────────
  function cargarCombos() {
    fetch(API + '?action=cmb_tipos').then(function (r) { return r.json(); }).then(function (res) {
      if (res.success) { tiposEquipo = res.data; poblarSel('mfldTipoEquipo', tiposEquipo, '-- Tipo equipo --'); }
    });
    fetch(API + '?action=cmb_tipos_movimiento').then(function (r) { return r.json(); }).then(function (res) {
      if (res.success) { tiposMovimiento = res.data; poblarSel('mfldTipoMovimiento', tiposMovimiento, '-- Tipo movimiento --'); }
    });
    fetch(API + '?action=cmb_equipos_disponibles').then(function (r) { return r.json(); }).then(function (res) {
      if (res.success) { equipos = res.data; poblarSelectEquipos(equipos); }
    });
    fetch(API + '?action=cmb_usuarios').then(function (r) { return r.json(); }).then(function (res) {
      if (res.success) { usuarios = res.data; poblarSelectUsuarios(usuarios); }
    });
  }

  function poblarSel(id, arr, placeholder) {
    var sel = document.getElementById(id); if (!sel) return;
    sel.innerHTML = '<option value="">' + esc(placeholder) + '</option>';
    arr.forEach(function (v) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); });
  }

  function poblarSelectEquipos(arr) {
    var sel = document.getElementById('mfldEquipoSelector');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Seleccionar equipo --</option>';
    arr.forEach(function (eq) {
      var o = document.createElement('option');
      o.value = eq.Id;
      o.textContent = '[' + (eq.NInventario || 'Sin N\u00b0') + '] ' + eq.Marca + ' ' + eq.Modelo + ' (' + (eq.Estado || '') + ')';
      o.dataset.eq = JSON.stringify(eq);
      sel.appendChild(o);
    });
  }

  function poblarSelectUsuarios(arr) {
    var sel = document.getElementById('mfldUsuarioSelector');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Seleccionar usuario --</option>';
    arr.forEach(function (u) {
      var o = document.createElement('option');
      o.value = u.IdColaborador;
      o.textContent = u.Colaborador;
      o.dataset.u = JSON.stringify(u);
      sel.appendChild(o);
    });
  }

  // ── Modal ─────────────────────────────────────────────────────────
  function setFechaHoy() {
    var f = document.getElementById('mfldFecha');
    if (f && !f.value) f.value = new Date().toISOString().slice(0, 10);
  }

  function bindModalEvents() {
    document.getElementById('btnNuevoMovimiento').addEventListener('click', abrirModalNuevo);
    document.getElementById('btnCerrarModalMov').addEventListener('click', cerrarModal);
    document.getElementById('btnCancelarModalMov').addEventListener('click', cerrarModal);
    document.getElementById('btnGuardarMovimiento').addEventListener('click', guardarMovimiento);

    document.getElementById('mfldEquipoSelector').addEventListener('change', function () {
      var opt = this.options[this.selectedIndex];
      if (!opt || !opt.dataset.eq) { ocultarBannerEquipo(); return; }
      try {
        var eq = JSON.parse(opt.dataset.eq);
        setV('mfldNInventario', eq.NInventario   || '');
        setV('mfldTipoEquipo',  eq.Tipo          || '');
        setV('mfldMarca',       eq.Marca         || '');
        setV('mfldModelo',      eq.Modelo        || '');
        setV('mfldNSerie',      eq.NSerie        || '');
        setV('mfldPin',         eq.Pin           || '');
        setV('mfldUbicacion',   eq.Ubicacion     || '');
        setV('mfldCorreo',      eq.Correo        || '');
        setV('mfldContrasena',  eq['Contraseña'] || '');
        mostrarBannerEquipo(eq);
      } catch (e) { ocultarBannerEquipo(); }
    });

    document.getElementById('mfldUsuarioSelector').addEventListener('change', function () {
      var opt = this.options[this.selectedIndex];
      if (!opt || !opt.dataset.u) return;
      try {
        var u = JSON.parse(opt.dataset.u);
        setV('mfldUsuario', u.Colaborador  || '');
        setV('mfldCargo',   u.Puesto       || '');
        setV('mfldArea',    u.CentroCostos || '');
      } catch (e) {}
    });

    document.getElementById('mfldTipoMovimiento').addEventListener('change', function () {
      var btnActa = document.getElementById('btnGenerarActa');
      if (btnActa) btnActa.style.display = this.value === 'ASIGNACION' ? 'inline-flex' : 'none';
    });

    document.getElementById('modalMovimiento').addEventListener('click', function (e) {
      if (e.target === this) cerrarModal();
    });
  }

  function mostrarBannerEquipo(eq) {
    var b = document.getElementById('equipoInfoBanner');
    if (!b) return;
    b.style.display = 'block';
    b.innerHTML = '<i class="fa fa-info-circle"></i> &nbsp;Equipo cargado: <strong>' +
      esc(eq.Marca) + ' ' + esc(eq.Modelo) + '</strong> \u2013 Estado actual: <strong>' +
      esc(eq.Estado || '') + '</strong>';
  }

  function ocultarBannerEquipo() {
    var b = document.getElementById('equipoInfoBanner');
    if (b) b.style.display = 'none';
  }

  function abrirModalNuevo() {
    limpiarFormulario();
    document.getElementById('modalMovTitulo').textContent = 'Nuevo movimiento';
    document.getElementById('btnGenerarActa').style.display = 'none';
    document.getElementById('modalMovimiento').classList.add('open');
  }

  window.editarMovimiento = function (id) {
    var r = allData.find(function (d) { return d.Id == id; });
    if (!r) return;
    limpiarFormulario();
    document.getElementById('modalMovTitulo').textContent = 'Editar movimiento #' + r.Id;
    setV('mfldId',             r.Id              || '');
    setV('mfldTipoMovimiento', r.TipoMovimiento   || '');
    setV('mfldFecha',          r.Fecha            || '');
    setV('mfldNInventario',    r.NInventario      || '');
    setV('mfldTipoEquipo',     r.Tipo             || '');
    setV('mfldMarca',          r.Marca            || '');
    setV('mfldModelo',         r.Modelo           || '');
    setV('mfldNSerie',         r.NSerie           || '');
    setV('mfldPin',            r.Pin              || '');
    setV('mfldUbicacion',      r.Ubicacion        || '');
    setV('mfldCorreo',         r.Correo           || '');
    setV('mfldContrasena',     r['Contrase\u00f1a'] || '');
    setAccesorios(r.Accesorios || '');
    setV('mfldUsuario',        r.Usuario          || '');
    setV('mfldCargo',          r.Cargo            || '');
    setV('mfldArea',           r.Area             || '');
    setV('mfldObservaciones',  r.Observaciones    || '');
    var btnActa = document.getElementById('btnGenerarActa');
    if (btnActa) {
      btnActa.style.display = r.TipoMovimiento === 'ASIGNACION' ? 'inline-flex' : 'none';
      btnActa.onclick = function () { window.open('acta.php?id=' + r.Id, '_blank'); };
    }
    document.getElementById('modalMovimiento').classList.add('open');
  };

  function cerrarModal() {
    document.getElementById('modalMovimiento').classList.remove('open');
    ocultarBannerEquipo();
  }

  function limpiarFormulario() {
    ['mfldId','mfldNInventario','mfldMarca','mfldModelo','mfldNSerie',
     'mfldPin','mfldCorreo','mfldContrasena',
     'mfldUsuario','mfldCargo','mfldArea','mfldObservaciones']
      .forEach(function (id) { setV(id, ''); });
    setV('mfldTipoMovimiento', '');
    setV('mfldTipoEquipo', '');
    setV('mfldUbicacion', '');
    setV('mfldEquipoSelector', '');
    setV('mfldUsuarioSelector', '');
    document.querySelectorAll('input[name="accesorio"]').forEach(function (cb) { cb.checked = false; });
    setFechaHoy();
    ocultarBannerEquipo();
  }

  // ── Guardar movimiento ────────────────────────────────────────────
  function guardarMovimiento() {
    var usuario = gV('mfldUsuario').trim();
    var tipoMov = gV('mfldTipoMovimiento').trim();
    if (!usuario) { showNotif('El nombre del usuario receptor es requerido.', 'warning'); return; }
    if (!tipoMov) { showNotif('Selecciona el tipo de movimiento.', 'warning'); return; }

    var idEquipo = 0;
    var selEq = document.getElementById('mfldEquipoSelector');
    if (selEq && selEq.value) idEquipo = parseInt(selEq.value) || 0;

    var payload = {
      Id:             gV('mfldId'),
      IdEquipo:       idEquipo,
      TipoMovimiento: tipoMov,
      Fecha:          gV('mfldFecha') || new Date().toISOString().slice(0, 10),
      NInventario:    gV('mfldNInventario'),
      Tipo:           gV('mfldTipoEquipo'),
      Marca:          gV('mfldMarca'),
      Modelo:         gV('mfldModelo'),
      NSerie:         gV('mfldNSerie'),
      Pin:            gV('mfldPin'),
      Ubicacion:      gV('mfldUbicacion'),
      Correo:         gV('mfldCorreo'),
      'Contrase\u00f1a': gV('mfldContrasena'),
      Accesorios:     getAccesorios(),
      Usuario:        usuario,
      Cargo:          gV('mfldCargo'),
      Area:           gV('mfldArea'),
      Observaciones:  gV('mfldObservaciones')
    };

    var btn = document.getElementById('btnGuardarMovimiento');
    btn.disabled = true; btn.textContent = 'Guardando...';

    fetch(API + '?action=guardar_movimiento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).then(function (res) {
      btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> Guardar';
      if (res.success) { showNotif(res.mensaje, 'success'); cerrarModal(); cargarDatos(); }
      else showNotif('Error: ' + res.mensaje, 'error');
    }).catch(function (e) {
      btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> Guardar';
      showNotif('Error de red: ' + e.message, 'error');
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function formatFecha(v) {
    if (!v) return '';
    // YYYY-MM-DD → DD/MM/YYYY
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[3] + '/' + m[2] + '/' + m[1];
    return v; // si ya viene en otro formato, devolver tal cual
  }
  function gV(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function setV(id, v) { var el = document.getElementById(id); if (el) el.value = v || ''; }
  function getAccesorios() {
    var vals = [];
    document.querySelectorAll('input[name="accesorio"]:checked').forEach(function (cb) { vals.push(cb.value); });
    return vals.join(', ');
  }
  function setAccesorios(val) {
    var parts = (val || '').split(',').map(function (s) { return s.trim().toUpperCase(); });
    document.querySelectorAll('input[name="accesorio"]').forEach(function (cb) {
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