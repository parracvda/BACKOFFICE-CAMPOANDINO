<?php
// registro.php - Plan de Despacho
session_start();
// Verificar sesión
$usuarioNombre = '';
if (isset($_SESSION['usuarionombre']) && strlen(trim($_SESSION['usuarionombre']))) {
  $usuarioNombre = $_SESSION['usuarionombre'];
} elseif (isset($_SESSION['usuario']) && strlen(trim($_SESSION['usuario']))) {
  $usuarioNombre = $_SESSION['usuario'];
}
if (trim($usuarioNombre) === '') {
  header('Location: ../../public/index.html?error=' . urlencode('Debe iniciar sesión para acceder a esta página.'));
  exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Solicitud de Despacho</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- DevExtreme para DateTimePicker -->
  <link rel="stylesheet" href="https://cdn3.devexpress.com/jslib/22.2.6/css/dx.common.css">
  <link rel="stylesheet" href="https://cdn3.devexpress.com/jslib/22.2.6/css/dx.light.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdn3.devexpress.com/jslib/22.2.6/js/dx.all.js"></script>
  <!-- Mensajes de DevExtreme en Español -->
  <script src="https://cdn3.devexpress.com/jslib/22.2.6/js/localization/dx.messages.es.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin:0; padding:20px; background:#f7f7f7; }
    .container { max-width:900px; margin:0 auto; background:#fff; padding:20px; border-radius:6px; box-shadow:0 1px 6px rgba(0,0,0,0.06); position:relative; }
    .top-right-user { position:absolute; top:12px; right:16px; background:#1fa9a0; color:#fff; padding:6px 12px; border-radius:12px; font-weight:600; font-size:0.95rem; box-shadow:0 1px 4px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center; min-width:140px; max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    @media (max-width:700px) { .top-right-user { position:static; display:inline-flex; margin-bottom:10px; min-width:0; max-width:none; } }
    h1 { font-size:1.5rem; color:#1fa9a0; margin-bottom:20px; text-align:center; }
    .button-row { display:flex; gap:10px; margin-top:14px; margin-bottom:20px; justify-content:center; flex-wrap:wrap; }
    .button-row button { padding:10px 14px; border-radius:6px; border:none; cursor:pointer; font-weight:600; }
    #btnPanel { background:#6c757d; color:#fff; }
    #btnPanel:hover { background:#5a6268; }
    #btnCerrarSesion { background:#dc3545; color:#fff; }
    #btnCerrarSesion:hover { background:#c82333; }
    
    .radio-group { margin:20px 0; text-align:center; }
    .radio-group label { margin:0 20px; font-weight:600; font-size:1.1rem; cursor:pointer; }
    .radio-group input[type="radio"] { margin-right:8px; cursor:pointer; transform:scale(1.2); }
    
    .form-grid { display:grid; grid-template-columns:1fr; gap:12px; margin-top:20px; }
    .form-group { display:grid; grid-template-columns: 180px 1fr; gap:12px; align-items:center; position:relative; }
    .form-group:has(textarea) { align-items:start; }
    .form-group:has(textarea) label { padding-top:8px; }
    
    label { font-weight:600; }
    input[type="text"], input[type="number"], select, textarea {
      padding:8px 10px;
      min-height:36px;
      border:1px solid #ccc;
      border-radius:4px;
      font-size:1rem;
      box-sizing:border-box;
      width:100%;
    }
    textarea { resize:vertical; font-family: Arial, sans-serif; min-height:80px; }
    
    /* Guardar como botón compacto dentro de la fila */
    .btn-guardar { background:#1fa9a0; color:#fff; padding:10px 14px; border-radius:6px; border:none; cursor:pointer; font-weight:600; font-size:1rem; margin:0; display:inline-flex; align-items:center; }
    .btn-guardar:hover { background:#178a83; }

    /* Forzar tamaño compacto para Panel y Cerrar Sesión para evitar que el botón Guardar los expanda */
    #btnPanel, #btnCerrarSesion {
      padding:10px 14px;
      font-size:1rem;
      border-radius:6px;
      min-width: auto;
      line-height: 1.2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Mensajes de éxito/error - modal centrado */
    .msg-box { 
      display:none; 
      position:fixed;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      z-index:9999;
      min-width:320px;
      max-width:500px;
      padding:20px 24px;
      border-radius:12px;
      font-weight:600;
      box-shadow:0 8px 32px rgba(0,0,0,0.2);
      animation:slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { opacity:0; transform:translate(-50%, -60%); }
      to { opacity:1; transform:translate(-50%, -50%); }
    }
    .msg-overlay {
      display:none;
      position:fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background:rgba(0,0,0,0.4);
      z-index:9998;
    }
    .msg-success { background: linear-gradient(135deg,#dff6ef,#e9fff9); color:#0b7a6a; border:2px solid #1fa9a0; }
    .msg-error { background: linear-gradient(135deg,#ffecec,#fff2f2); color:#8a1f1f; border:2px solid #f44336; }
    .msg-close { float:right; background:transparent; border:none; font-weight:700; color:inherit; cursor:pointer; font-size:1.2rem; line-height:1; padding:0; margin:-4px 0 0 12px; }
    .msg-close:hover { opacity:0.7; }
    
    .hidden { display:none !important; }
    
    /* Responsive */
    @media (max-width:700px) {
      .container { padding: 12px; }
      .form-group { grid-template-columns:1fr; gap:6px; align-items:stretch; }
      .form-group label { margin-bottom:4px; }
      .button-row button { flex: 1 1 calc(50% - 5px); min-width: 0; padding: 8px 10px; font-size: 0.9rem; }
      h1 { font-size: 1.2rem; margin-bottom: 12px; }
      .radio-group label { display:block; margin:10px 0; }
    }
  </style>
</head>
<body>
  <div class="msg-overlay" id="msgOverlay"></div>
  <div class="msg-box msg-success" id="msgSuccess">
    <button class="msg-close" onclick="closeMsg()">×</button>
    <span id="msgSuccessText"></span>
  </div>
  <div class="msg-box msg-error" id="msgError">
    <button class="msg-close" onclick="closeMsg()">×</button>
    <span id="msgErrorText"></span>
  </div>
  
  <div class="container">
    <div class="top-right-user"><?php echo htmlspecialchars($usuarioNombre); ?></div>
    
    <h1>Solicitud de Despacho</h1>
    
    <form id="formDespacho">
      <div class="button-row">
        <button type="submit" class="btn-guardar" id="btnGuardar">Guardar</button>
        <button type="button" id="btnPanel" onclick="window.location.href='../../public/panel.html'">Panel</button>
        <button type="button" id="btnCerrarSesion" onclick="cerrarSesion()">Cerrar Sesión</button>
      </div>
      
      <div class="radio-group">
      <label>
        <input type="radio" name="tipoOrden" value="con" checked>
        Con Orden de Venta
      </label>
      <label>
        <input type="radio" name="tipoOrden" value="sin">
        Sin Orden de Venta
      </label>
    </div>
    
      <div class="form-grid" id="formFields">
        <!-- Campos con Orden de Venta (por defecto) -->
        <div class="form-group campo-con" id="grupoOrdenVenta">
          <label for="ordenVenta">Orden de Venta:</label>
          <select id="ordenVenta" name="ordenVenta" style="cursor:pointer;">
            <option value="">Cargando órdenes...</option>
          </select>
        </div>
        
        <!-- Campos adicionales sin Orden de Venta (ocultos por defecto) -->
        <div class="form-group campo-sin hidden">
          <label for="ordenCompra">Orden de Compra:</label>
          <input type="text" id="ordenCompra" name="ordenCompra">
        </div>
        
        <div class="form-group campo-sin hidden">
          <label for="cliente">Cliente:</label>
          <input type="text" id="cliente" name="cliente" autocomplete="off">
        </div>
        
        <div class="form-group campo-sin hidden">
          <label for="condicionVenta">Condición Venta:</label>
          <input type="text" id="condicionVenta" name="condicionVenta" autocomplete="off">
        </div>
        
        <div class="form-group campo-sin hidden">
          <label for="origen">Origen:</label>
          <input type="text" id="origen" name="origen" autocomplete="off">
        </div>
        
        <div class="form-group campo-sin hidden">
          <label for="destino">Destino:</label>
          <input type="text" id="destino" name="destino" autocomplete="off">
        </div>
        
        <!-- Campos comunes a ambos tipos -->
        <div class="form-group campo-con">
          <label for="codigo">Código:</label>
          <input type="text" id="codigo" name="codigo">
        </div>
        
        <div class="form-group campo-con">
          <label for="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" name="cantidad" step="1" min="0">
        </div>
        
        <div class="form-group campo-con">
          <label for="fechaSugerida">Fecha Sugerida de Entrega:</label>
          <div id="fechaSugerida"></div>
        </div>
        
        <div class="form-group campo-con">
          <label for="observaciones">Observaciones:</label>
          <textarea id="observaciones" name="observaciones" rows="3"></textarea>
        </div>
      </div>
    </form>
  </div>
  
  <script>
    // Variables globales
    let fechaSugeridaWidget = null;
    let ordenesVentaData = []; // Almacenar todas las órdenes para búsqueda rápida
    
    // Inicializar DateTimePicker de DevExtreme y cargar órdenes
    $(function() {
      try { DevExpress.localization.locale('es'); } catch(e) { console.warn('No se pudo establecer locale es:', e); }
      fechaSugeridaWidget = $("#fechaSugerida").dxDateBox({
        type: "date",
        displayFormat: "dd/MM/yyyy",
        placeholder: "Seleccione fecha",
        width: "100%",
        showClearButton: true,
        useMaskBehavior: true
      }).dxDateBox("instance");
      
      // Cargar órdenes de venta al iniciar
      cargarOrdenesVenta();
    });
    
    // Función para cargar órdenes de venta desde la API
    function cargarOrdenesVenta() {
      const selectOrden = document.getElementById('ordenVenta');
      selectOrden.innerHTML = '<option value="">Cargando órdenes de venta...</option>';
      selectOrden.disabled = true;
      
      fetch('api/obtener_ordenes_venta.php')
        .then(response => response.json())
        .then(data => {
          if (data.success && data.data.length > 0) {
            ordenesVentaData = data.data; // Guardar para referencia
            selectOrden.innerHTML = '<option value="">-- Seleccione una orden de venta --</option>';
            
            data.data.forEach(orden => {
              const option = document.createElement('option');
              option.value = orden.orden_venta;
              option.textContent = `${orden.orden_venta} - ${orden.cliente} (${orden.fecha_orden_formato})`;
              option.dataset.ordenData = JSON.stringify(orden);
              selectOrden.appendChild(option);
            });
            
            selectOrden.disabled = false;
            console.log(`✓ Cargadas ${data.data.length} órdenes de venta`);
          } else {
            selectOrden.innerHTML = '<option value="">No hay órdenes disponibles</option>';
            console.warn('No hay órdenes de venta disponibles');
          }
        })
        .catch(error => {
          console.error('Error al cargar órdenes:', error);
          selectOrden.innerHTML = '<option value="">Error al cargar órdenes</option>';
          showError('Error al cargar órdenes de venta desde el servidor');
        });
    }
    
    // Evento: Auto-completar campos al seleccionar una orden
    document.getElementById('ordenVenta').addEventListener('change', function() {
      const selectedOption = this.options[this.selectedIndex];
      if (selectedOption && selectedOption.dataset.ordenData) {
        try {
          const orden = JSON.parse(selectedOption.dataset.ordenData);
          // Mostrar info en consola (útil para debug)
          console.log('Orden seleccionada:', orden);
          
          // Auto-completar campos si existen (para modo "Sin Orden de Venta" ocultos)
          // Estos campos se pueden usar internamente o mostrar en el futuro
          const campoCliente = document.getElementById('cliente');
          const campoCondicion = document.getElementById('condicionVenta');
          const campoOrigen = document.getElementById('origen');
          const campoDestino = document.getElementById('destino');
          
          if (campoCliente) campoCliente.value = orden.cliente || '';
          if (campoCondicion) campoCondicion.value = orden.condicion_venta || '';
          if (campoOrigen) campoOrigen.value = orden.origen || '';
          if (campoDestino) campoDestino.value = orden.destino || '';
          
        } catch (e) {
          console.error('Error al procesar datos de orden:', e);
        }
      }
    });
    
    // Manejar cambio de tipo de orden
    document.querySelectorAll('input[name="tipoOrden"]').forEach(radio => {
      radio.addEventListener('change', function() {
        const tipo = this.value;
        const camposCon = document.querySelectorAll('.campo-con');
        const camposSin = document.querySelectorAll('.campo-sin');
        
        if (tipo === 'con') {
          // Mostrar solo campos con orden de venta
          camposCon.forEach(el => el.classList.remove('hidden'));
          camposSin.forEach(el => el.classList.add('hidden'));
          // Asegurar que el grupo Orden de Venta esté visible
          const grupoOV = document.getElementById('grupoOrdenVenta');
          if (grupoOV) grupoOV.classList.remove('hidden');
          // Limpiar campos ocultos
          document.getElementById('ordenCompra').value = '';
          document.getElementById('cliente').value = '';
          document.getElementById('condicionVenta').value = '';
          document.getElementById('origen').value = '';
          document.getElementById('destino').value = '';
        } else {
          // Mostrar campos pero ocultar explícitamente Orden de Venta
          camposCon.forEach(el => el.classList.remove('hidden'));
          camposSin.forEach(el => el.classList.remove('hidden'));
          const grupoOV = document.getElementById('grupoOrdenVenta');
          if (grupoOV) {
            grupoOV.classList.add('hidden');
            // limpiar valor de Orden de Venta cuando no aplica
            const ov = document.getElementById('ordenVenta');
            if (ov) ov.value = '';
          }
        }
      });
    });
    
    // Manejar envío del formulario
    document.getElementById('formDespacho').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const tipoOrden = document.querySelector('input[name="tipoOrden"]:checked').value;
      const fechaValue = fechaSugeridaWidget ? fechaSugeridaWidget.option('value') : null;
      
      // Validar campos requeridos según el tipo
      if (tipoOrden === 'con') {
        if (!document.getElementById('ordenVenta').value.trim()) {
          showError('Por favor, ingrese la Orden de Venta');
          return;
        }
      } else {
        // Validar campos adicionales si es necesario
        if (!document.getElementById('ordenCompra').value.trim() && 
            !document.getElementById('cliente').value.trim()) {
          showError('Por favor, complete al menos Orden de Compra o Cliente');
          return;
        }
      }
      
      // Preparar datos
      const data = {
        tipoOrden: tipoOrden,
        ordenVenta: document.getElementById('ordenVenta').value.trim(),
        ordenCompra: tipoOrden === 'sin' ? document.getElementById('ordenCompra').value.trim() : '',
        cliente: tipoOrden === 'sin' ? document.getElementById('cliente').value.trim() : '',
        condicionVenta: tipoOrden === 'sin' ? document.getElementById('condicionVenta').value.trim() : '',
        origen: tipoOrden === 'sin' ? document.getElementById('origen').value.trim() : '',
        destino: tipoOrden === 'sin' ? document.getElementById('destino').value.trim() : '',
        codigo: document.getElementById('codigo').value.trim(),
        cantidad: document.getElementById('cantidad').value,
        fechaSugerida: fechaValue ? formatDateTimeForDB(fechaValue) : null,
        observaciones: document.getElementById('observaciones').value.trim()
      };
      
      // Enviar al servidor
      fetch('guardar_plan_despacho.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          showSuccess(resp.mensaje || 'Plan de despacho guardado exitosamente');
          // Limpiar formulario después de 2 segundos
          setTimeout(() => {
            document.getElementById('formDespacho').reset();
            if (fechaSugeridaWidget) fechaSugeridaWidget.option('value', null);
            // Volver a estado inicial (con orden de venta)
            document.querySelector('input[name="tipoOrden"][value="con"]').checked = true;
            document.querySelector('input[name="tipoOrden"][value="con"]').dispatchEvent(new Event('change'));
          }, 2000);
        } else {
          showError(resp.mensaje || 'Error al guardar el plan de despacho');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        showError('Error de conexión al guardar el plan de despacho');
      });
    });
    
    function formatDateTimeForDB(date) {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    function showSuccess(msg) {
      document.getElementById('msgSuccessText').textContent = msg;
      document.getElementById('msgSuccess').style.display = 'block';
      document.getElementById('msgOverlay').style.display = 'block';
      setTimeout(closeMsg, 4000);
    }
    
    function showError(msg) {
      document.getElementById('msgErrorText').textContent = msg;
      document.getElementById('msgError').style.display = 'block';
      document.getElementById('msgOverlay').style.display = 'block';
    }
    
    function closeMsg() {
      document.getElementById('msgSuccess').style.display = 'none';
      document.getElementById('msgError').style.display = 'none';
      document.getElementById('msgOverlay').style.display = 'none';
    }
    
    function cerrarSesion() {
      if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('nombreUsuario');
        window.location.href = '../../logout.php';
      }
    }
  </script>
</body>
</html>
