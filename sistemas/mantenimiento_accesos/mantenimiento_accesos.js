// mantenimiento_accesos.js
// Maneja la UI de asignación de features por usuario

(function(){
  const featuresCatalog = [
    // Horas Paradas (card + sub-features)
    { key: 'panel_horas_paradas', label: 'Horas Paradas (toda la tarjeta)' },
    { key: 'panel_horas_paradas_registro', label: 'Horas Paradas - Registro' },
    { key: 'panel_horas_paradas_consultas', label: 'Horas Paradas - Consultas' },
    { key: 'panel_horas_paradas_programacion', label: 'Horas Paradas - Programación' },

    // Requerimientos (card + sub-features)
    { key: 'panel_requerimientos', label: 'Requerimientos Internos (toda la tarjeta)' },
    { key: 'panel_requerimientos_registro', label: 'Requerimientos - Registro' },
    { key: 'panel_requerimientos_consultas', label: 'Requerimientos - Consultas' },
    { key: 'panel_aprobacion_requerimientos', label: 'Requerimientos - Aprobación' },
    { key: 'panel_requerimientos_entrega', label: 'Requerimientos - Entrega' },

    // Tratamiento (card + sub-features)
    { key: 'panel_tratamiento', label: 'Tratamiento Térmico (toda la tarjeta)' },
    { key: 'panel_tratamiento_registro', label: 'Tratamiento - Registro' },
    { key: 'panel_tratamiento_consultas', label: 'Tratamiento - Consultas' },

    // Control de Calidad (card + sub-features)
    { key: 'panel_control_calidad', label: 'Control de Calidad (toda la tarjeta)' },
    { key: 'panel_control_calidad_registro', label: 'Control de Calidad - Registro' },
    
    // Trazabilidad (card + sub-features)
    { key: 'panel_trazabilidad', label: 'Trazabilidad (toda la tarjeta)' },
    { key: 'panel_trazabilidad_consultas', label: 'Trazabilidad - Consultas' },
    
    // Despachos (nueva tarjeta)
    { key: 'panel_despachos', label: 'Despachos (toda la tarjeta)' },
    { key: 'panel_despachos_registro', label: 'Despachos - Registro' },
    { key: 'panel_despachos_consultas', label: 'Despachos - Consultas' },

    // Movimiento de equipos TI
    { key: 'panel_movimiento_ti', label: 'Movimiento de equipos TI (toda la tarjeta)' },
    { key: 'panel_movimiento_ti_inventario', label: 'Movimiento TI - Inventario equipos' },
    { key: 'panel_movimiento_ti_registro', label: 'Movimiento TI - Registro movimiento' },

    // Muestreo Control de Calidad
    { key: 'panel_muestreo_cc', label: 'Muestreo Control de Calidad (toda la tarjeta)' },
    { key: 'panel_muestreo_cc_registro', label: 'Muestreo CC - Registro' },
    { key: 'panel_muestreo_cc_consultas', label: 'Muestreo CC - Consultas' },
    { key: 'panel_muestreo_cc_tablas', label: 'Muestreo CC - Tablas' },
    { key: 'panel_muestreo_cc_importar', label: 'Muestreo CC - Importar Productos' },

    // Control de Activos
    { key: 'panel_control_activos', label: 'Control de Activos (toda la tarjeta)' },
    { key: 'panel_control_activos_maestro', label: 'Control Activos - Maestro' },
    { key: 'panel_control_activos_checklist', label: 'Control Activos - Checklist Diario' },
    { key: 'panel_control_activos_mantenimiento', label: 'Control Activos - Mantenimientos' },
    { key: 'panel_control_activos_operadores', label: 'Control Activos - Operadores' },
    { key: 'panel_control_activos_alertas', label: 'Control Activos - Alertas de Mantenimiento' },

    { key: 'maintenance_access', label: 'Acceso a Mantenimiento (maintenance_access)' }
  ];

  // Definir relaciones padre -> hijos para sincronizar checkboxes
  const parentMap = {
    'panel_horas_paradas': ['panel_horas_paradas_registro','panel_horas_paradas_consultas','panel_horas_paradas_programacion'],
    'panel_requerimientos': ['panel_requerimientos_registro','panel_requerimientos_consultas','panel_aprobacion_requerimientos','panel_requerimientos_entrega'],
    'panel_tratamiento': ['panel_tratamiento_registro','panel_tratamiento_consultas'],
    'panel_control_calidad': ['panel_control_calidad_registro']
    , 'panel_trazabilidad': ['panel_trazabilidad_consultas']
    , 'panel_despachos': ['panel_despachos_registro','panel_despachos_consultas']
    , 'panel_movimiento_ti': ['panel_movimiento_ti_inventario','panel_movimiento_ti_registro']
    , 'panel_muestreo_cc': ['panel_muestreo_cc_registro','panel_muestreo_cc_consultas','panel_muestreo_cc_tablas','panel_muestreo_cc_importar']
    , 'panel_control_activos': ['panel_control_activos_maestro','panel_control_activos_checklist','panel_control_activos_mantenimiento','panel_control_activos_alertas','panel_control_activos_operadores']
  };

  // Invertir map para buscar padre desde hijo
  const childToParent = {};
  Object.keys(parentMap).forEach(pk => { parentMap[pk].forEach(ch => { childToParent[ch] = pk; }); });

  // Durante cambios programáticos evitamos duplicar llamadas a la API
  var programmaticChange = false;

  const sel = document.getElementById('selUsers');
  const featuresList = document.getElementById('featuresList');
  const msj = document.getElementById('msj');
  const btnRefresh = document.getElementById('btnRefresh');

  function showMessage(t, timeout){
    msj.textContent = t;
    if (timeout) setTimeout(()=> msj.textContent = '', timeout);
  }

  function renderCatalog(currentFeatures){
    featuresList.innerHTML = '';
    featuresCatalog.forEach(f => {
      const div = document.createElement('div');
      div.className = 'feature-item';
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.id = 'feat_' + f.key;
      chk.dataset.key = f.key;
      chk.checked = currentFeatures.indexOf(f.key) !== -1;
      // Si este feature es hijo de otro, marcar clase visual y guardar relación
      if (childToParent[f.key]) {
        div.classList.add('child-item');
        chk.dataset.parent = childToParent[f.key];
      }
      const lbl = document.createElement('label');
      lbl.htmlFor = chk.id;
      lbl.style.marginLeft = '8px';
      lbl.textContent = f.label;
      div.appendChild(chk);
      div.appendChild(lbl);
      featuresList.appendChild(div);

      chk.addEventListener('change', function(){
        // Si el cambio es programático desde el padre, solo ejecutar la llamada si no estamos en modo programmatic
        const key = this.dataset.key;
        const userId = parseInt(sel.value);
        if (!programmaticChange) {
          toggleFeature(userId, key, this.checked);
        }

        // Si es hijo, actualizar el estado del padre (si existe)
        var parentKey = this.dataset.parent || null;
        if (parentKey) {
          try {
            var parentChk = document.querySelector('[data-key="' + parentKey + '"]');
            if (parentChk) {
              // Si todos los hijos están marcados -> marcar padre; si alguno no -> desmarcar padre
              var allChecked = parentMap[parentKey].every(k => {
                var c = document.querySelector('[data-key="' + k + '"]');
                return c && c.checked;
              });
              // Evitar loop: hacer cambio programático en el padre
              programmaticChange = true;
              parentChk.checked = allChecked;
              // Notificar backend sólo si el estado del padre cambió
              toggleFeature(userId, parentKey, parentChk.checked);
              programmaticChange = false;
            }
          } catch(e){}
        }
      });
    });

    // Después de renderizar, asegurar que los padres reflejen estados de hijos sin llamar a API
    Object.keys(parentMap).forEach(pk => {
      try {
        var parentChk = document.querySelector('[data-key="' + pk + '"]');
        if (!parentChk) return;
        var allChecked = parentMap[pk].every(k => {
          var c = document.querySelector('[data-key="' + k + '"]');
          return c && c.checked;
        });
        programmaticChange = true;
        parentChk.checked = allChecked;
        programmaticChange = false;

        // Añadir listener al padre: al cambiar, marcar/desmarcar hijos
        parentChk.addEventListener('change', function(){
          var userId = parseInt(sel.value);
          var parentState = this.checked;
          // Notificar backend para la feature padre
          if (!programmaticChange) toggleFeature(userId, pk, parentState);
          // Aplicar a hijos
          programmaticChange = true;
          parentMap[pk].forEach(k => {
            var c = document.querySelector('[data-key="' + k + '"]');
            if (!c) return;
            if (c.checked !== parentState) {
              c.checked = parentState;
              // Llamada a API para cada hijo
              toggleFeature(userId, k, parentState);
            }
          });
          programmaticChange = false;
        });
      } catch(e){}
    });
  }

  function fetchFeaturesFor(userId){
    if (!userId || userId <= 0) { renderCatalog([]); return; }
    showMessage('Cargando features...');
    fetch('api/api_get_user_features.php?idusuario=' + encodeURIComponent(userId), { credentials: 'same-origin' })
      .then(r => r.json())
      .then(resp => {
        if (!resp.success) { showMessage('Error: ' + (resp.mensaje || 'no se pudieron cargar'), 4000); renderCatalog([]); return; }
        renderCatalog(resp.features || []);
        showMessage('Features cargadas', 1500);
      })
      .catch(err => { console.error(err); showMessage('Error de red cargando features', 4000); renderCatalog([]); });
  }

  function toggleFeature(userId, featureKey, add){
    if (!userId || userId <= 0) { alert('Selecciona un usuario primero'); return; }
    const payload = { idusuario: userId, feature_key: featureKey, action: add ? 'add' : 'remove' };
    showMessage((add ? 'Agregando ' : 'Removiendo ') + featureKey + '...', 0);
    fetch('api/api_set_user_feature.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json())
      .then(resp => {
        if (!resp.success) {
          showMessage('Error: ' + (resp.mensaje || 'no se pudo actualizar'), 4000);
          // revertir checkbox visual
          const chk = document.querySelector('[data-key="' + featureKey + '"]');
          if (chk) chk.checked = !add;
          return;
        }
        showMessage('Operación realizada', 1500);
        // Si actualizamos el usuario de la sesión actual, refrescar localStorage.features
        try { if (typeof currentSessionUserId !== 'undefined' && parseInt(userId) === parseInt(currentSessionUserId)) { scheduleLocalFeaturesRefresh(userId); } } catch(e){}
      })
      .catch(err => { console.error(err); showMessage('Error de red al actualizar', 4000); const chk = document.querySelector('[data-key="' + featureKey + '"]'); if (chk) chk.checked = !add; });
  }

  // Debounced refresh of localStorage.features for the current session user
  var refreshTimer = null;
  function scheduleLocalFeaturesRefresh(userId) {
    try {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(function(){
        fetch('api/api_get_user_features.php?idusuario=' + encodeURIComponent(userId), { credentials: 'same-origin' })
          .then(r => r.json())
          .then(data => {
            if (data && data.success) {
              try { localStorage.setItem('features', JSON.stringify(data.features || [])); console.log('localStorage.features actualizadas', data.features); } catch(e){}
            }
          })
          .catch(e => { console.warn('No se pudieron refrescar features locales', e); });
      }, 300);
    } catch(e){}
  }

  sel.addEventListener('change', function(){
    fetchFeaturesFor(parseInt(this.value));
  });

  btnRefresh.addEventListener('click', function(){ fetchFeaturesFor(parseInt(sel.value)); });

  // Si hay un usuario preseleccionado en la lista, seleccionarlo
  if (sel && sel.options && sel.options.length > 1) {
    // mantener opción 0 si es intencional; no auto seleccionar
  }
})();
