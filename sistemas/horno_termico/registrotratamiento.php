<?php
// registrotratamiento.php
// Formulario básico (sin diseño avanzado) para control de ingreso/salida de madera tratada
session_start();
// Preferir nombre completo almacenado en sesión; si no existe, usar usuario como fallback
$usuarioNombre = '';
if (isset($_SESSION['usuarionombre']) && strlen(trim($_SESSION['usuarionombre']))) {
  $usuarioNombre = $_SESSION['usuarionombre'];
} elseif (isset($_SESSION['usuario']) && strlen(trim($_SESSION['usuario']))) {
  $usuarioNombre = $_SESSION['usuario'];
}
// Si no hay usuario en sesión, forzar re-login: la página requiere sesión
if (trim($usuarioNombre) === '') {
  header('Location: ../../public/index.html?error=' . urlencode('Debe iniciar sesión para acceder a esta página.'));
  exit;
}

// Ya no se calcula el lote manualmente; se generará automáticamente por especie al guardar
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>REGISTRO DE TRATAMIENTO TÉRMICO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Biblioteca para escaneo de QR -->
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin:0; padding:20px; background:#f7f7f7; }
    .container { max-width:900px; margin:0 auto; background:#fff; padding:20px; border-radius:6px; box-shadow:0 1px 6px rgba(0,0,0,0.06); position:relative; }
    .top-right-user { position:absolute; top:12px; right:16px; background:#1fa9a0; color:#fff; padding:6px 12px; border-radius:12px; font-weight:600; font-size:0.95rem; box-shadow:0 1px 4px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center; min-width:140px; max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    @media (max-width:700px) { .top-right-user { position:static; display:inline-flex; margin-bottom:10px; min-width:0; max-width:none; } }
    h1 { font-size:1.1rem; color:#1fa9a0; margin-bottom:16px; text-align:center; }
    .form-grid { display:grid; grid-template-columns:1fr; gap:12px; }
    
    /* Form groups por defecto: layout horizontal (label al costado) */
    .form-group { 
      display:grid; 
      grid-template-columns: 180px 1fr; 
      gap:12px; 
      align-items:center; 
      position:relative; 
    }
    
    /* Cuando hay textarea, alinear label arriba */
    .form-group:has(textarea) {
      align-items:start;
    }
    .form-group:has(textarea) label {
      padding-top:8px;
    }
    
    /* Campo de producto y código: mantener layout vertical (label arriba) */
    .form-group.campo-producto, .form-group.campo-codigo-busqueda { 
      display:flex; 
      flex-direction:column; 
      align-items:stretch; 
    }
    .form-group.campo-producto label, .form-group.campo-codigo-busqueda label { 
      margin-bottom:0px; 
    }
    
    label { font-weight:600; }
    /* Inputs con altura consistente */
    input[type="text"], input[type="number"], input[type="date"], input[type="datetime-local"], select, textarea {
      padding:8px 10px;
      min-height:36px;
      border:1px solid #ccc;
      border-radius:4px;
      font-size:1rem;
      box-sizing:border-box;
      width:100%;
    }
    textarea { 
      resize:vertical; 
      font-family: Arial, sans-serif;
    }
    /* Suggestion dropdown (custom) */
    .suggestions-box {
      position:absolute;
      left:0;
      top:100%;
      z-index:1200;
      width:100%;
      background:#fff;
      border:1px solid rgba(0,0,0,0.12);
      box-shadow:0 6px 20px rgba(0,0,0,0.08);
      max-height:260px;
      overflow:auto;
      border-radius:6px;
      margin-top:6px;
    }
    /* Para el campo producto y codigo, el suggestions box debe estar dentro del form-group con layout vertical */
    .campo-producto, .campo-codigo-busqueda { position:relative; }
    .campo-producto .suggestions-box, .campo-codigo-busqueda .suggestions-box { 
      position:absolute; 
      left:0; 
      right:0;
      top:100%; 
      width:100%;
    }
    .suggestion-item { padding:10px 12px; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.04); font-size:0.95rem; }
    .suggestion-item:hover { background:#f5f5f5; }
    .suggestion-item:last-child { border-bottom:none; }
    .button-row { display:flex; gap:10px; margin-top:14px; margin-bottom:20px; justify-content:center; }
    .button-row button#btnPanel { background:#ccc; color:#000; margin-right:16px; }
    .button-row button#btnPanel:hover { background:#bfbfbf; }
    button { padding:10px 14px; border-radius:6px; border:none; cursor:pointer; background:#1fa9a0; color:#fff; font-weight:600; }
    button[type="reset"] { background:#ccc; color:#000; }
    
    /* Responsive */
    @media (max-width:700px) { 
      .container { padding: 12px; }
      .form-grid { grid-template-columns:1fr; } 
      .button-row { 
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
        margin-bottom: 14px;
      } 
      .button-row button { 
        flex: 1 1 calc(50% - 4px);
        min-width: 0;
        padding: 8px 10px;
        font-size: 0.9rem;
      }
      .button-row button#btnPanel,
      .button-row button#btnCerrarSesion {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      /* En móviles, form-group también vertical */
      .form-group { 
        grid-template-columns:1fr; 
        gap:6px;
        align-items:stretch;
      }
      .form-group label {
        margin-bottom:4px;
      }
      /* Ajustar botón de cámara en móviles */
      .btn-camera {
        right: 4px;
        padding: 5px 8px;
        font-size: 0.95rem;
        min-width: 36px;
        height: 32px;
      }
      .campo-codigo-busqueda .codigo-input {
        padding-right: 45px;
        font-size: 0.95rem;
      }
      /* Ajustar header de usuario en móviles */
      .top-right-user {
        font-size: 0.85rem;
        padding: 5px 10px;
        min-width: 100px;
      }
      h1 {
        font-size: 1rem;
        margin-bottom: 12px;
        margin-top: 8px;
      }
    }
    /* Mensajes de éxito/error - ahora como modal centrado */
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
    /* estilo visual para campos readonly (ej. lote) */
    input[readonly] { background:#efefef; color:#333; }
    
    /* Estilos para escáner QR con cámara - BOTÓN FLOTANTE */
    .btn-camera-floating {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #1fa9a0;
      border: none;
      border-radius: 50%;
      width: 70px;
      height: 70px;
      cursor: pointer;
      color: #fff;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(31, 169, 160, 0.4);
    }
    .btn-camera-floating:hover {
      background: #178a83;
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(31, 169, 160, 0.6);
    }
    .btn-camera-floating:active {
      transform: scale(0.95);
    }
    
    /* Ocultar botones de cámara inline (ya no se usan) */
    .btn-camera {
      display: none !important;
    }
    .campo-codigo-busqueda {
      position: relative;
    }
    .campo-codigo-busqueda .codigo-input {
      padding-right: 10px; /* Ajustado: ya no hay botón de cámara inline */
    }
    
    /* Modal de escáner QR */
    #qrScannerModal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 20px;
    }
    #qrScannerModal.active {
      display: flex;
    }
    .scanner-container {
      max-width: 500px;
      width: 100%;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    .scanner-header {
      background: #1fa9a0;
      color: #fff;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .scanner-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }
    .scanner-close {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1.8rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .scanner-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .scanner-body {
      position: relative;
      background: #000;
    }
    #qrVideo {
      width: 100%;
      height: auto;
      display: block;
    }
    .scanner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    .scanner-frame {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 250px;
      border: 3px solid #1fa9a0;
      border-radius: 12px;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    }
    .scanner-corners {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 250px;
    }
    .scanner-corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 3px solid #1fa9a0;
    }
    .scanner-corner.top-left {
      top: -3px;
      left: -3px;
      border-right: none;
      border-bottom: none;
    }
    .scanner-corner.top-right {
      top: -3px;
      right: -3px;
      border-left: none;
      border-bottom: none;
    }
    .scanner-corner.bottom-left {
      bottom: -3px;
      left: -3px;
      border-right: none;
      border-top: none;
    }
    .scanner-corner.bottom-right {
      bottom: -3px;
      right: -3px;
      border-left: none;
      border-top: none;
    }
    .scanner-status {
      background: #fff;
      padding: 16px 20px;
      text-align: center;
      color: #666;
      font-size: 0.95rem;
    }
    .scanner-status.scanning {
      background: #e3f2fd;
      color: #1976d2;
    }
    .scanner-status.success {
      background: #e8f5e9;
      color: #2e7d32;
      font-weight: 600;
    }
    .scanner-status.error {
      background: #ffebee;
      color: #c62828;
    }
    #canvasQR {
      display: none;
    }
    
    @media (max-width: 700px) {
      .scanner-container {
        max-width: 100%;
        border-radius: 0;
      }
      .scanner-frame,
      .scanner-corners {
        width: 200px;
        height: 200px;
      }
    }
    /* Estilos para bloques de productos múltiples */
    .producto-bloque { 
      background:#f9f9f9; 
      border:2px solid #e0e0e0; 
      border-radius:8px; 
      padding:16px; 
      margin-bottom:16px; 
      position:relative;
    }
    .producto-bloque:first-child { border-color:#1fa9a0; background:#f0f9f8; }
    .bloque-header { 
      font-size:1.05rem; 
      color:#1fa9a0; 
      margin-bottom:12px; 
      padding-bottom:8px; 
      border-bottom:2px solid #1fa9a0; 
    }
    .btn-eliminar-bloque { cursor:pointer; }
    .btn-eliminar-bloque:hover { background:#d32f2f !important; }
  </style>
</head>
<body>
  <!-- Modal de Escáner QR -->
  <div id="qrScannerModal">
    <div class="scanner-container">
      <div class="scanner-header">
        <h3>📷 Escanear Código QR</h3>
        <button class="scanner-close" id="closeScannerBtn" aria-label="Cerrar">×</button>
      </div>
      <div class="scanner-body">
        <video id="qrVideo" playsinline></video>
        <canvas id="canvasQR"></canvas>
        <div class="scanner-overlay">
          <div class="scanner-frame"></div>
          <div class="scanner-corners">
            <div class="scanner-corner top-left"></div>
            <div class="scanner-corner top-right"></div>
            <div class="scanner-corner bottom-left"></div>
            <div class="scanner-corner bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="scanner-status" id="scannerStatus">Apunte la cámara hacia el código QR</div>
    </div>
  </div>

  <div class="container">
    <!-- Overlay para mensajes -->
    <div id="msgOverlay" class="msg-overlay"></div>
    <!-- Mensaje flotante centrado -->
    <div id="msgBox" class="msg-box" role="status" aria-live="polite"><button class="msg-close" aria-label="cerrar">×</button><span id="msgText"></span></div>
    
    <div class="top-right-user" id="lblUsuarioRegistro"><?php echo htmlspecialchars($usuarioNombre); ?></div>
    <h1>REGISTRO DE TRATAMIENTO TÉRMICO</h1>

    <form id="formTratamiento" method="post" action="guardar_tratamiento.php">
      <!-- Registrar usuario en un campo oculto para que llegue siempre al servidor -->
      <input type="hidden" name="registro_usuario" id="registro_usuario_hidden" value="<?php echo htmlspecialchars($usuarioNombre); ?>">
      <div class="button-row">
        <button type="button" id="btnPanel">Panel</button>
        <button type="reset">Limpiar</button>
        <button type="submit">Guardar</button>
        <button type="button" id="btnCerrarSesion" style="background:#ccc;color:#000;margin-left:12px;">Cerrar sesión</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label for="fechaTratamiento">Fecha T.T.</label>
          <input type="date" id="fechaTratamiento" name="fecha_tratamiento" value="<?php echo date('Y-m-d'); ?>" max="<?php echo date('Y-m-d'); ?>" required>
        </div>

        <div class="form-group">
          <label for="estacion">Estación</label>
          <select id="estacion" name="estacion" required>
            <option value="HT-144">HT-144</option>
          </select>
        </div>

        <div class="form-group">
          <label for="lote">Lote T.T.</label>
          <input type="text" id="lote" name="lote" value="" readonly style="background:#efefef;color:#777;">
        </div>

        <!-- EspecieMaderaTratada: se rellenará automáticamente desde Subgrupo del producto seleccionado -->
        <input type="hidden" id="EspecieMaderaTratada" name="EspecieMaderaTratada" value="">
        
        <!-- Contenedor dinámico para productos (único o múltiple según tipo) -->
        <div id="productosContainer">
          <!-- Primer bloque (siempre visible) -->
          <div class="producto-bloque" data-index="0">
            <div class="bloque-header">
              <strong>Producto #<span class="bloque-numero">1</span></strong>
            </div>
            
            <input type="hidden" class="producto-id" name="productos[0][id]" value="">
            <input type="hidden" class="producto-codigo" name="productos[0][codigo]" value="">
            <input type="hidden" class="producto-especie" name="productos[0][especie]" value="">
            <input type="hidden" class="producto-descripcion" name="productos[0][descripcion]" value="">
            <input type="hidden" class="m3-por-unidad" name="productos[0][m3_unidad]" value="0">
            <input type="hidden" class="pallets-escaneados" name="productos[0][pallets_escaneados]" value="[]">
            
            <div class="form-group campo-codigo-busqueda">
              <label>Código</label>
              <input type="text" class="codigo-input" data-index="0" autocomplete="off" required>
              <div class="suggestions-box" style="display:none;"></div>
            </div>
            
            <div class="form-group campo-producto" style="display:none;">
              <label>Producto a Tratar</label>
              <input type="text" class="producto-input" data-index="0" autocomplete="off" readonly style="background:#efefef;color:#333;">
            </div>

            <!-- CAMPOS PARA PARIHUELAS (ocultos por defecto, aparecen al seleccionar producto) -->
            <!-- Campo cantidad-rumas: oculto pero funcional, se auto-asigna valor 1 -->
            <div class="form-group campos-parihuelas" style="display:none;">
              <label>Cantidad en Rumas</label>
              <input type="number" class="cantidad-rumas" name="productos[0][cantidad_rumas]" step="1" min="1" max="8" value="1" style="display:none;">
            </div>

            <div class="form-group campos-parihuelas" style="display:none;">
              <label>Cantidad en Unidades</label>
              <input type="number" class="cantidad-unidades" name="productos[0][cantidad_unidades]" step="1" min="0">
            </div>
            
            <!-- CAMPOS PARA LISTONES (inicialmente ocultos) -->
            <!-- Campos de stock y observación: ocultos visualmente pero manteniendo lógica -->
            <div class="form-group campos-listones" style="display:none;">
              <label>Stock (Unidades)</label>
              <input type="text" class="campo-stock-unidades" name="productos[0][stock_unidades]" readonly style="background:#efefef;color:#333;">
            </div>
            
            <div class="form-group campos-listones" style="display:none;">
              <label>Stock (Pallets)</label>
              <input type="text" class="campo-stock-pallets" name="productos[0][stock_pallets]" readonly style="background:#efefef;color:#333;">
            </div>
            
            <div class="form-group campos-listones" style="display:none;">
              <label>Observación Producto</label>
              <textarea class="campo-observacion-producto" name="productos[0][observacion_producto]" readonly rows="2" style="background:#efefef;color:#333;padding:8px;border:1px solid #ccc;border-radius:4px;font-size:1rem;resize:none;"></textarea>
            </div>
            
            <div class="form-group campos-listones" style="display:none;">
              <label>Unidades</label>
              <input type="number" class="campo-cantidad-por-pallet" name="productos[0][cantidad_por_pallet]" step="1" min="1">
            </div>
            
            <button type="button" class="btn-eliminar-bloque" style="display:none;background:#f44336;color:#fff;padding:6px 10px;border-radius:4px;margin-top:8px;">Eliminar producto</button>
          </div>
        </div>
        
        <!-- Botón para agregar más productos - YA NO ES NECESARIO (el sistema crea automáticamente) -->
        <button type="button" id="btnAgregarProducto" style="display:none !important;background:#4caf50;color:#fff;padding:10px 14px;border-radius:6px;margin:12px 0;width:100%;">+ Agregar otro producto (Tratamiento Mixto)</button>
        
        <div id="infoRumas" style="margin:10px 0;padding:8px;background:#e3f2fd;border-left:4px solid #2196f3;border-radius:4px;font-size:0.9rem;display:none;">
          <strong>Rumas totales:</strong> <span id="rumasTotales">0</span> / 8
        </div>
        
        <div id="infoMetrosCubicos" style="margin:10px 0;padding:8px;background:#e8f5e9;border-left:4px solid #4caf50;border-radius:4px;font-size:0.9rem;display:none;">
          <strong>Capacidad del horno:</strong> <span id="m3Totales">0.00</span> / 20.00 m³
        </div>

        <div class="form-group">
          <label for="observaciones">Observaciones</label>
          <textarea id="observaciones" name="observaciones" rows="3" style="padding:8px;border:1px solid #ccc;border-radius:4px;font-size:1rem;"></textarea>
        </div>
      </div>

      
    </form>
  </div>

  <!-- Botón flotante de cámara QR (siempre visible) -->
  <button type="button" id="btnCameraFloating" class="btn-camera-floating" title="Escanear código QR">
    📷
  </button>

  <script>
    // ============================================
    // VARIABLES GLOBALES Y ESTADO
    // ============================================
    var bloqueIndex = 0; // Contador para nuevos bloques
    var esParihuelas = false; // Se actualiza cuando se selecciona el primer producto
    var esListones = false; // Se actualiza cuando se selecciona un producto tipo LISTONES
    var CAPACIDAD_HORNO_M3 = 20; // Capacidad máxima del horno térmico en metros cúbicos
    var MIN_SEARCH_LENGTH = 3; // Longitud mínima para iniciar búsqueda en almacenregistros
    
    // Variables para escáner QR con cámara
    var qrStream = null;
    var qrAnimationFrame = null;
    var qrCurrentIndex = null; // Índice del bloque actual escaneando
    
    // Mostrar mensajes bonitos sin alert()
    function showMessage(text, type){
      try{
        var box = document.getElementById('msgBox');
        var txt = document.getElementById('msgText');
        var overlay = document.getElementById('msgOverlay');
        if(!box || !txt) return;
        
        box.classList.remove('msg-success','msg-error');
        box.classList.add(type === 'error' ? 'msg-error' : 'msg-success');
        txt.textContent = text;
        
        // Mostrar overlay y mensaje
        if (overlay) overlay.style.display = 'block';
        box.style.display = 'block';
        
        // Botón cerrar
        var btn = box.querySelector('.msg-close');
        if(btn) {
          btn.onclick = function(){ 
            box.style.display='none'; 
            if (overlay) overlay.style.display = 'none';
          };
        }
        
        // Click en overlay para cerrar
        if (overlay) {
          overlay.onclick = function(){
            box.style.display='none';
            overlay.style.display = 'none';
          };
        }
        
        // Auto-hide después de 5 segundos
        setTimeout(function(){ 
          try{ 
            box.style.opacity=0; 
            setTimeout(function(){ 
              box.style.display='none'; 
              if (overlay) overlay.style.display = 'none';
              box.style.opacity=1; 
            },300);
          }catch(e){} 
        }, 5000);
        
        // Limpiar query string
        if(window.history && window.history.replaceState){
          var url = new URL(window.location.href);
          url.searchParams.delete('ok');
          url.searchParams.delete('error');
          window.history.replaceState({}, document.title, url.pathname + url.search);
        }
      }catch(e){ console.warn(e); }
    }

    // Verificar en servidor si un CodigoPallet ya existe en registros previos
    function checkPalletExists(codigo) {
      if (!codigo) return Promise.resolve(false);
      return fetch('api/api_check_pallet.php?codigo=' + encodeURIComponent(codigo), { cache: 'no-store' })
        .then(function(res){ return res.json(); })
        .then(function(data){ return data && data.exists === true; })
        .catch(function(err){ console.warn('Error comprobando pallet en servidor:', err); return false; });
    }

    // Comprobar parámetros de URL para mostrar mensajes
    (function(){
      var p = new URLSearchParams(window.location.search);
      if (p.has('ok')){
        showMessage('Guardado exitoso.', 'success');
      } else if (p.has('error')){
        try{ var msg = decodeURIComponent(p.get('error')); }
        catch(e){ var msg = p.get('error'); }
        showMessage(msg || 'Error al guardar.', 'error');
      }
    })();

    // ============================================
    // FUNCIONES PARA ESCÁNER QR CON CÁMARA
    // ============================================
    function abrirEscanerQR(index){
      qrCurrentIndex = index;
      
      var modal = document.getElementById('qrScannerModal');
      var video = document.getElementById('qrVideo');
      var status = document.getElementById('scannerStatus');
      
      if (!modal || !video) {
        showMessage('Error: No se pudo inicializar el escáner.', 'error');
        return;
      }
      
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showMessage('Tu navegador no soporta acceso a la cámara. Usa un navegador moderno.', 'error');
        return;
      }
      
      modal.classList.add('active');
      status.className = 'scanner-status';
      status.textContent = 'Iniciando cámara...';
      
      // Solicitar acceso a la cámara (preferir cámara trasera en móviles)
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Cámara trasera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      .then(function(stream){
        qrStream = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.play();
        
        status.className = 'scanner-status scanning';
        status.textContent = 'Apunte la cámara hacia el código QR';
        
        // Iniciar detección de QR
        requestAnimationFrame(escanearFrameQR);
      })
      .catch(function(err){
        console.error('Error al acceder a la cámara:', err);
        modal.classList.remove('active');
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          showMessage('Permiso de cámara denegado. Permite el acceso a la cámara en la configuración.', 'error');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          showMessage('No se encontró ninguna cámara en el dispositivo.', 'error');
        } else {
          showMessage('Error al acceder a la cámara: ' + err.message, 'error');
        }
      });
    }
    
    function escanearFrameQR(){
      var video = document.getElementById('qrVideo');
      var canvas = document.getElementById('canvasQR');
      var status = document.getElementById('scannerStatus');
      
      if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
        qrAnimationFrame = requestAnimationFrame(escanearFrameQR);
        return;
      }
      
      var ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Detectar código QR usando jsQR
      if (typeof jsQR !== 'undefined') {
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });
        
        if (code && code.data) {
          // QR detectado exitosamente
          status.className = 'scanner-status success';
          status.textContent = '✓ Código detectado';
          
          // Guardar el índice INMEDIATAMENTE antes de cualquier otra operación
          var indexGuardado = qrCurrentIndex;
          
          // Detener el escaneo inmediatamente
          if (qrAnimationFrame) {
            cancelAnimationFrame(qrAnimationFrame);
            qrAnimationFrame = null;
          }
          
          // Procesar el código QR ANTES de cerrar
          setTimeout(function(){
            procesarQRDesdeCamera(code.data, indexGuardado);
            // Cerrar DESPUÉS de procesar
            cerrarEscanerQR();
          }, 500);
          
          return; // Detener el escaneo
        }
      }
      
      // Continuar escaneando
      qrAnimationFrame = requestAnimationFrame(escanearFrameQR);
    }
    
    function cerrarEscanerQR(){
      var modal = document.getElementById('qrScannerModal');
      var video = document.getElementById('qrVideo');
      
      // Detener la animación
      if (qrAnimationFrame) {
        cancelAnimationFrame(qrAnimationFrame);
        qrAnimationFrame = null;
      }
      
      // Detener el stream de video
      if (qrStream) {
        qrStream.getTracks().forEach(function(track){
          track.stop();
        });
        qrStream = null;
      }
      
      // Limpiar el video
      if (video) {
        video.srcObject = null;
      }
      
      // Cerrar modal
      if (modal) {
        modal.classList.remove('active');
      }
      
      qrCurrentIndex = null;
    }
    
    function procesarQRDesdeCamera(codigoQR, index){
      // Usar el índice pasado como parámetro (prioritario) o el global como fallback
      var bloqueIndex = (index !== undefined && index !== null) ? index : qrCurrentIndex;
      
      if (bloqueIndex === null || bloqueIndex === undefined) {
        console.error('Error al procesar QR: índice de bloque no válido');
        showMessage('Error: No se pudo identificar el campo de destino.', 'error');
        return;
      }
      
      console.log('Procesando QR desde cámara para bloque:', bloqueIndex);
      
      var bloque = document.querySelector('.producto-bloque[data-index="' + bloqueIndex + '"]');
      if (!bloque) {
        showMessage('Error: Bloque no encontrado.', 'error');
        return;
      }
      
      var inputCodigo = bloque.querySelector('.codigo-input');
      if (inputCodigo) {
        // Llenar el input con el código QR completo
        inputCodigo.value = codigoQR;
        
        // Procesar igual que la pistola QR
        var datosQR = parseCodigoQR(codigoQR);
        if (datosQR) {
          procesarCodigoQR(bloqueIndex, datosQR);
        } else {
          showMessage('El código QR no tiene el formato esperado.', 'error');
          inputCodigo.value = ''; // Limpiar input
        }
      }
    }
    
    // Event listeners para el modal de escáner
    document.addEventListener('DOMContentLoaded', function(){
      var closeBtn = document.getElementById('closeScannerBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', cerrarEscanerQR);
      }
      
      var modal = document.getElementById('qrScannerModal');
      if (modal) {
        modal.addEventListener('click', function(e){
          if (e.target === modal) {
            cerrarEscanerQR();
          }
        });
      }
      
      // Cerrar con tecla ESC
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
          cerrarEscanerQR();
        }
      });
      
      // Inicializar botón de cámara flotante
      inicializarBotonCameraFlotante();
    });
    
    function inicializarBotonCameraFlotante(){
      var btnFlotante = document.getElementById('btnCameraFloating');
      if (btnFlotante) {
        btnFlotante.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          
          // Determinar el índice del bloque donde se debe escanear
          // Prioridad: 1) Bloque con código vacío, 2) Último bloque, 3) Primer bloque
          var bloques = document.querySelectorAll('.producto-bloque');
          var indexToScan = 0; // Por defecto, primer bloque
          
          // Buscar primer bloque vacío (sin código de producto)
          for (var i = 0; i < bloques.length; i++) {
            var bloque = bloques[i];
            var codigoHidden = bloque.querySelector('.producto-codigo');
            var descripcionInput = bloque.querySelector('.producto-input');
            
            // Si el bloque no tiene código de producto, usar ese
            if (!codigoHidden || !codigoHidden.value || !descripcionInput || !descripcionInput.value) {
              indexToScan = parseInt(bloque.getAttribute('data-index'), 10);
              console.log('Escaneando en bloque vacío #' + indexToScan);
              break;
            }
          }
          
          // Si no hay bloques vacíos, usar el primer bloque (se acumulará o creará nuevo según corresponda)
          if (indexToScan === 0 && bloques.length > 0) {
            var primerBloque = bloques[0];
            indexToScan = parseInt(primerBloque.getAttribute('data-index'), 10);
            console.log('Todos los bloques tienen datos, escaneando en bloque #' + indexToScan + ' (se acumulará o creará nuevo)');
          }
          
          abrirEscanerQR(indexToScan);
        });
      }
    }

    // Función para eliminar bloques que fueron auto-creados y fallaron validaciones
    function eliminarBloqueAutoCreado(bloque){
      if (!bloque) return;
      
      // Verificar si el bloque tiene el atributo data-auto-created
      var esAutoCreado = bloque.getAttribute('data-auto-created') === 'true';
      
      if (esAutoCreado) {
        console.log('Eliminando bloque auto-creado que falló validación:', bloque.getAttribute('data-index'));
        bloque.remove();
        renumerarBloques();
        
        // Actualizar contadores según el tipo
        actualizarContadorRumas();
        actualizarEstadoBotones();
        
        if (esListones) {
          actualizarContadorM3();
          actualizarEstadoBotonAgregarListones();
        }
        
        // NO mostrar mensaje adicional aquí - el mensaje de error específico ya fue mostrado
        // showMessage('Bloque vacío eliminado automáticamente.', 'info');
      }
    }

    // Validación antes de enviar formulario
    document.getElementById('formTratamiento').addEventListener('submit', function(e){
      // Asegurar que exista usuario registrado en el formulario
      var registroUsuarioHidden = document.getElementById('registro_usuario_hidden');
      if (!registroUsuarioHidden || !registroUsuarioHidden.value || registroUsuarioHidden.value.trim() === '') {
        e.preventDefault();
        showMessage('Sesión expirada. Por favor inicie sesión nuevamente.', 'error');
        return false;
      }
      var bloques = document.querySelectorAll('.producto-bloque');
      if (bloques.length === 0) {
        e.preventDefault();
        showMessage('Debe agregar al menos un producto.', 'error');
        return false;
      }
      
      // DEBUG: Ver qué valores tienen los campos antes de enviar
      bloques.forEach(function(bloque, idx){
        var idHidden = bloque.querySelector('.producto-id');
        var codigoHidden = bloque.querySelector('.producto-codigo');
        var especieHidden = bloque.querySelector('.producto-especie');
        var palletsEscaneados = bloque.querySelector('.pallets-escaneados');
        console.log('=== BLOQUE #' + idx + ' ANTES DE ENVIAR ===');
        console.log('  ID:', idHidden ? idHidden.value : 'NO EXISTE');
        console.log('  Código:', codigoHidden ? codigoHidden.value : 'NO EXISTE');
        console.log('  Especie:', especieHidden ? especieHidden.value : 'NO EXISTE');
        console.log('  Pallets escaneados:', palletsEscaneados ? palletsEscaneados.value : 'NO EXISTE');
        console.log('  Pallets array:', palletsEscaneados && palletsEscaneados.value ? JSON.parse(palletsEscaneados.value) : 'VACIO');
      });
      
      // Validar que todos los bloques tengan código y producto seleccionado
      var validos = true;
      bloques.forEach(function(bloque){
        var inputCodigo = bloque.querySelector('.codigo-input');
        var inputDescripcion = bloque.querySelector('.producto-input');
        if (!inputCodigo || !inputCodigo.value || inputCodigo.value.trim() === '') {
          validos = false;
        }
        if (!inputDescripcion || !inputDescripcion.value || inputDescripcion.value.trim() === '') {
          validos = false;
        }
      });
      
      if (!validos) {
        e.preventDefault();
        showMessage('Todos los bloques deben tener un código y producto seleccionado.', 'error');
        return false;
      }
      
      // Validar suma de rumas para parihuelas
      if (esParihuelas) {
        var totalRumas = calcularRumasTotales();
        if (totalRumas > 8) {
          e.preventDefault();
          showMessage('El total de rumas no puede exceder 8.', 'error');
          return false;
        }
      }
      
      // Validar campos específicos de LISTONES
      if (esListones) {
        var validoListones = true;
        bloques.forEach(function(bloque){
          var unidades = bloque.querySelector('.campo-cantidad-por-pallet');
          
          // Validar que el campo de unidades tenga valor
          if (unidades && unidades.offsetParent !== null) {
            if (!unidades.value || parseInt(unidades.value, 10) <= 0) {
              validoListones = false;
            }
          }
        });
        
        if (!validoListones) {
          e.preventDefault();
          showMessage('Debe ingresar la cantidad de unidades para todos los productos.', 'error');
          return false;
        }
        
        // Validar que no exceda la capacidad del horno
        var totalM3 = calcularM3Totales();
        if (totalM3 > CAPACIDAD_HORNO_M3) {
          e.preventDefault();
          showMessage('La capacidad del horno es de ' + CAPACIDAD_HORNO_M3 + ' m³. Actualmente tiene ' + totalM3.toFixed(2) + ' m³. Reduzca la cantidad de pallets.', 'error');
          return false;
        }
      }
    });

    // Usuario en cabecera
    document.addEventListener('DOMContentLoaded', function(){
      try {
        var el = document.getElementById('lblUsuarioRegistro');
        if (!el) return;
        if (!el.textContent || el.textContent.trim() === '') {
          var fromLocal = localStorage.getItem('nombreUsuario') || '';
          var name = '';
          if (fromLocal && fromLocal.indexOf('-') !== -1) {
            name = fromLocal.split('-').slice(1).join('-').trim();
          } else {
            name = fromLocal;
          }
          if (!name || name.trim() === '') {
            if (fromLocal && fromLocal.indexOf('-') !== -1) {
              name = fromLocal.split('-')[0].trim();
            } else {
              name = fromLocal || 'Usuario';
            }
          }
          el.textContent = name || 'Usuario';
          el.title = (fromLocal && fromLocal.indexOf('-') !== -1) ? fromLocal.split('-').slice(1).join('-').trim() : fromLocal;
        }
      } catch(e) { console.warn('No se pudo cargar usuario en cabecera:', e); }
      
      // Inicializar autocompletado para el primer bloque
      inicializarAutocomplete(0);
      
      // Evento para cambio en cantidades (actualizar contador y modo)
      document.addEventListener('input', function(e){
        if (e.target.classList.contains('cantidad-rumas')) {
          var bloque = e.target.closest('.producto-bloque');
          var index = bloque ? parseInt(bloque.dataset.index, 10) : -1;
          
          // Si es el primer bloque y es parihuelas, reevaluar modo
          if (index === 0 && esParihuelas) {
            evaluarModoTratamiento();
          } else {
            actualizarContadorRumas();
            actualizarEstadoBotones();
          }
        }
        
        // Actualizar m³ cuando cambie la cantidad de unidades (LISTONES)
        if (e.target.classList.contains('campo-cantidad-por-pallet')) {
          if (esListones) {
            actualizarContadorM3();
            actualizarEstadoBotonAgregarListones();
          }
        }
      });
    });

    // ============================================
    // FUNCIONES PARA CÓDIGO QR CONCATENADO
    // ============================================
    function detectarSubgrupoPorDescripcion(descripcion){
      // Intenta detectar el tipo de producto por patrones en la descripción
      var desc = (descripcion || '').toUpperCase();
      
      // PRIMERO: Si dice PARIHUELA, es PARIHUELAS (prioritario)
      // Las parihuelas también tienen medidas, pero la palabra las identifica claramente
      if (desc.indexOf('PARIHUELA') !== -1) {
        return 'PARIHUELAS';
      }
      
      // SEGUNDO: Si tiene formato de medidas (XXxXXxXXMM), es LISTONES
      if (/\d+\s*[xX×]\s*\d+\s*[xX×]\s*\d+\s*MM/i.test(desc)) {
        return 'LISTONES';
      }
      
      // Por defecto, asumir LISTONES si no se puede determinar
      return 'LISTONES';
    }
    
    // Función para normalizar y limpiar códigos QR con caracteres problemáticos
    function normalizarCodigoQR(texto) {
      if (!texto) return texto;
      
      console.log('Texto QR original (raw):', texto);
      
      // Mapeo de caracteres problemáticos conocidos a sus equivalentes correctos
      var reemplazos = {
        '燜': ' F',     // Carácter chino que aparece en lugar de " F"
        '燤': ' M',     // Posibles variantes
        '燳': ' S',
        '燵': ' T',
        '燶': ' U',
        '燷': ' V',
        '燸': ' W',
        '燹': ' X',
        '燺': ' Y',
        '燻': ' Z',
        '燼': ' A',
        '燽': ' B',
        '燾': ' C',
        '燿': ' D',
        '爀': ' E',
        '爁': ' G',
        '爂': ' H',
        '爃': ' I',
        '爄': ' J',
        '爅': ' K',
        '爆': ' L',
        '爇': ' N',
        '爈': ' O',
        '爉': ' P',
        '爊': ' Q',
        '爋': ' R',
        '�': '',        // Carácter de reemplazo Unicode genérico
        '\uFFFD': '',   // Otro carácter de reemplazo
        '\u0000': '',   // Null
        '\uFEFF': '',   // Zero width no-break space (BOM)
      };
      
      var textoNormalizado = texto;
      var caracteresCorregidos = [];
      
      // Reemplazar caracteres problemáticos conocidos
      for (var char in reemplazos) {
        if (reemplazos.hasOwnProperty(char)) {
          if (textoNormalizado.indexOf(char) !== -1) {
            caracteresCorregidos.push(char + ' → "' + reemplazos[char] + '"');
            var regex = new RegExp(char, 'g');
            textoNormalizado = textoNormalizado.replace(regex, reemplazos[char]);
          }
        }
      }
      
      // Limpiar caracteres de control y espacios múltiples
      textoNormalizado = textoNormalizado.replace(/[\r\n\t]/g, '');
      textoNormalizado = textoNormalizado.replace(/\s{2,}/g, ' '); // Múltiples espacios a uno solo
      
      // Normalización específica para patrón común: (NNNxNNNxNNNMM)[caracter raro]T-NN
      // Debería ser: (NNNxNNNxNNNMM) FT-NN
      // Buscar patrón: ) seguido de cualquier carácter no-ASCII seguido de T- o PT o FT
      textoNormalizado = textoNormalizado.replace(/\)([^\x00-\x7F])([FP]?T-)/g, ') F$2');
      // También buscar patrón sin la F/P: ) [caracter raro] T-
      textoNormalizado = textoNormalizado.replace(/\)([^\x00-\x7F])(T-\d)/g, ') F$2');
      
      // Remover caracteres unicode raros (fuera del rango ASCII extendido)
      // Permitir: letras, números, espacios, signos de puntuación comunes, paréntesis, guiones, $, /, etc.
      // Filtrar: caracteres fuera de rango latin-1 (0-255) excepto algunos específicos
      var caracteresValidos = '';
      var caracteresRemovidos = [];
      for (var i = 0; i < textoNormalizado.length; i++) {
        var char = textoNormalizado.charAt(i);
        var code = textoNormalizado.charCodeAt(i);
        // Permitir ASCII (0-127) y Latin-1 extendido (128-255)
        // Y algunos caracteres especiales comunes: × (215), ° (176), ± (177), etc.
        if (code <= 255 || code === 215 || code === 176 || code === 177) {
          caracteresValidos += char;
        } else {
          // Caracter fuera de rango, intentar normalizar o remover
          caracteresRemovidos.push(char + ' (code: ' + code + ')');
        }
      }
      
      if (caracteresRemovidos.length > 0) {
        console.warn('⚠ Caracteres unicode inusuales detectados y removidos:', caracteresRemovidos.join(', '));
      }
      
      if (caracteresCorregidos.length > 0) {
        console.warn('✓ Caracteres problemáticos corregidos automáticamente:', caracteresCorregidos.join(', '));
        showMessage('QR normalizado: se corrigieron ' + caracteresCorregidos.length + ' caracteres problemáticos', 'info');
      }
      
      if (caracteresValidos !== textoNormalizado) {
        console.log('Texto después de filtrar caracteres unicode raros:', caracteresValidos);
        textoNormalizado = caracteresValidos;
      }
      
      console.log('Texto QR normalizado:', textoNormalizado);
      return textoNormalizado.trim();
    }
    
    function parseCodigoQR(codigoConcatenado){
      // Primero normalizar el código QR para eliminar caracteres problemáticos
      var codigoNormalizado = normalizarCodigoQR(codigoConcatenado);
      
      // Limpiar caracteres especiales que la pistola QR puede agregar (Enter, saltos de línea, espacios, etc.)
      var codigoLimpio = codigoNormalizado.replace(/[\r\n\t]/g, '').trim();
      
      console.log('Código QR original:', codigoConcatenado);
      console.log('Código QR limpio:', codigoLimpio);
      
      var partes = codigoLimpio.split('$');
      console.log('Partes encontradas:', partes.length, partes);
      
      if (partes.length < 4) {
        console.warn('Código QR inválido, se esperaban al menos 4 campos, se encontraron:', partes.length);
        return null; // No es un código QR válido
      }
      
      // Detectar el tipo de QR basándose en el contenido
      // PARIHUELAS: CAM270126TPD1080$400400022$PARIHUELA (1020x1220x144MM) FT-16 TT$18$CAMPO ANDINO S.A.C.$0379-20261
      //   Campo 1: ID interno (CAM270126TPD1080)
      //   Campo 2: Código (400400022)
      //   Campo 3: Producto (PARIHUELA...)
      //   Campo 4: Cantidad (18)
      //   Campo 5+: otros datos
      //
      // LISTONES: PC170126ALM9335$17/01/2026$100030077$PINO RADIATA GM (30X30X1830 MM) PT CEP$480$ALMACEN$100030077-11072$CONFORME$V.B.
      //   Campo 1: ID interno (PC170126ALM9335)
      //   Campo 2: Fecha (17/01/2026)
      //   Campo 3: Código (100030077)
      //   Campo 4: Producto (PINO RADIATA...)
      //   Campo 5: Cantidad (480)
      //   Campo 6+: otros datos
      
      var resultado = null;
      var tipoDetectado = '';
      
      // Detectar si es PARIHUELAS (la palabra PARIHUELA aparece en el campo 3)
      if (partes.length >= 4 && (partes[2] || '').toUpperCase().indexOf('PARIHUELA') !== -1) {
        tipoDetectado = 'PARIHUELAS';
        // Extraer fecha de recepción del código de pallet (formato: CAMDDMMYYXXX)
        var codigoPallet = (partes[0] || '').trim();
        var fechaRecepcion = '';
        if (codigoPallet.length >= 9) {
          // Caracteres 4-9: DDMMYY (índices 3-8)
          var ddmmyy = codigoPallet.substring(3, 9);
          if (/^\d{6}$/.test(ddmmyy)) {
            var dd = ddmmyy.substring(0, 2);
            var mm = ddmmyy.substring(2, 4);
            var yy = ddmmyy.substring(4, 6);
            fechaRecepcion = dd + '/' + mm + '/20' + yy;
            console.log('Fecha de recepción PARIHUELAS extraída:', fechaRecepcion, 'de código:', codigoPallet);
          } else {
            console.warn('Formato de fecha inválido en código pallet:', codigoPallet);
          }
        }
        resultado = {
          tipo: 'PARIHUELAS',
          codigoPallet: codigoPallet,            // Campo 1: código del pallet (único)
          codigo: (partes[1] || '').trim(),      // Campo 2: código
          descripcion: (partes[2] || '').trim(), // Campo 3: producto
          unidades: (partes[3] || '').trim(),    // Campo 4: cantidad
          fechaRecepcion: fechaRecepcion         // Fecha extraída del código pallet
        };
      }
      // Si no es PARIHUELAS, asumir LISTONES (formato con fecha en campo 2)
      else if (partes.length >= 5) {
        tipoDetectado = 'LISTONES';
        var fechaRecepcion = (partes[1] || '').trim(); // Campo 2: fecha DD/MM/YYYY
        console.log('Fecha de recepción LISTONES:', fechaRecepcion);
        resultado = {
          tipo: 'LISTONES',
          codigoPallet: (partes[0] || '').trim(),// Campo 1: código del pallet (único)
          codigo: (partes[2] || '').trim(),      // Campo 3: código
          descripcion: (partes[3] || '').trim(), // Campo 4: producto
          unidades: (partes[4] || '').trim(),    // Campo 5: cantidad
          fechaRecepcion: fechaRecepcion         // Fecha de recepción
        };
      }
      // Formato desconocido o inválido
      else {
        console.warn('No se pudo determinar el tipo de QR');
        return null;
      }
      
      console.log('Tipo detectado:', tipoDetectado);
      console.log('Datos extraídos del QR:', resultado);
      
      return resultado;
    }
    
    function procesarCodigoQR(index, datosQR){
      var bloque = document.querySelector('.producto-bloque[data-index="' + index + '"]');
      if (!bloque || !datosQR) return;

      // Si hay codigoPallet, comprobar en servidor si ya existe antes de continuar
      var codigoPalletToCheck = datosQR.codigoPallet || '';
      if (codigoPalletToCheck) {
        checkPalletExists(codigoPalletToCheck).then(function(exists){
          if (exists) {
            showMessage('El código de pallet "' + codigoPalletToCheck + '" ya fue registrado anteriormente. No se permite reuso.', 'error');
            var inputCodigo = bloque.querySelector('.codigo-input');
            if (inputCodigo) inputCodigo.value = '';
            
            // Si el bloque fue auto-creado y falla la validación, eliminarlo
            eliminarBloqueAutoCreado(bloque);
            return;
          }
          // Si no existe, continuar con el procesamiento normal
          _procesarCodigoQRBody(index, datosQR);
        }).catch(function(err){
          console.warn('Error comprobando pallet en servidor, procediendo localmente:', err);
          // En caso de error en la comprobación remota, permitir proceder con la lógica local (no ideal)
          _procesarCodigoQRBody(index, datosQR);
        });
        return;
      }

      // Si no hay codigoPallet, proceder normalmente
      _procesarCodigoQRBody(index, datosQR);
    }

    // Cuerpo original de procesarCodigoQR (extraído a función para poder ejecutar tras la validación remota)
    function _procesarCodigoQRBody(index, datosQR){
      var bloque = document.querySelector('.producto-bloque[data-index="' + index + '"]');
      if (!bloque || !datosQR) return;

      // VALIDACIÓN: Si el bloque actual ya tiene datos de OTRO producto, crear nuevo bloque automáticamente
      var codigoExistente = bloque.querySelector('.producto-codigo');
      var descripcionExistente = bloque.querySelector('.producto-input');
      
      if (codigoExistente && codigoExistente.value && descripcionExistente && descripcionExistente.value) {
        // El bloque ya tiene datos, verificar si es el mismo producto
        var codigoActual = codigoExistente.value.trim();
        var codigoNuevo = datosQR.codigo.trim();
        
        if (codigoActual !== codigoNuevo) {
          // Es un producto DIFERENTE, crear nuevo bloque automáticamente
          console.log('Producto diferente detectado (actual: ' + codigoActual + ', nuevo: ' + codigoNuevo + '). Creando nuevo bloque...');
          
          // Detectar tipo del nuevo producto para validar límites antes de crear el bloque
          var subgrupoNuevo = detectarSubgrupoPorDescripcion(datosQR.descripcion).toUpperCase();
          var esNuevoParihuelas = subgrupoNuevo.indexOf('PARIHUELA') !== -1;
          var esNuevoListones = subgrupoNuevo.indexOf('LISTON') !== -1;
          
          // Si es PARIHUELAS, verificar límite de 8 rumas antes de crear nuevo bloque
          if (esNuevoParihuelas) {
            var totalRumas = calcularRumasTotales();
            if (totalRumas >= 8) {
              showMessage('No se puede agregar otro producto. Ya se alcanzó el máximo de 8 rumas permitidas.', 'error');
              var inputCodigoActual = bloque.querySelector('.codigo-input');
              if (inputCodigoActual) inputCodigoActual.value = '';
              return;
            }
          }
          
          // Si es LISTONES, verificar capacidad del horno antes de crear nuevo bloque
          if (esNuevoListones) {
            // Calcular m³ del nuevo pallet
            var medidas = extraerMedidasYCalcularM3(datosQR.descripcion);
            if (medidas) {
              var m3Nuevos = medidas.m3 * (parseInt(datosQR.unidades) || 0);
              var m3Actuales = calcularM3Totales();
              var m3TotalesConNuevo = m3Actuales + m3Nuevos;
              
              console.log('Validando capacidad antes de crear bloque: actual=' + m3Actuales.toFixed(2) + ' m³, nuevo=' + m3Nuevos.toFixed(2) + ' m³, total=' + m3TotalesConNuevo.toFixed(2) + ' m³');
              
              if (m3TotalesConNuevo > CAPACIDAD_HORNO_M3) {
                showMessage('No se puede agregar otro producto. La capacidad del horno es de ' + CAPACIDAD_HORNO_M3 + ' m³. Con este pallet alcanzaría ' + m3TotalesConNuevo.toFixed(2) + ' m³.', 'error');
                var inputCodigoActual = bloque.querySelector('.codigo-input');
                if (inputCodigoActual) inputCodigoActual.value = '';
                return;
              }
            }
          }
          
          var nuevoIndex = agregarBloqueProducto();
          if (nuevoIndex !== null) {
            // Marcar el nuevo bloque como auto-creado para poder eliminarlo si falla alguna validación
            var nuevoBloque = document.querySelector('.producto-bloque[data-index="' + nuevoIndex + '"]');
            if (nuevoBloque) {
              nuevoBloque.setAttribute('data-auto-created', 'true');
            }
            
            // Procesar el QR en el nuevo bloque llamando a la función principal (no recursión)
            console.log('Redirigiendo escaneo al nuevo bloque #' + nuevoIndex);
            showMessage('Producto diferente detectado. Se creó automáticamente un nuevo bloque.', 'info');
            
            // NO limpiar el campo del bloque actual - el usuario necesita ver lo que escaneó
            // El bloque actual mantiene sus datos correctos
            
            // Procesar el QR en el nuevo bloque usando setTimeout para evitar conflictos
            setTimeout(function(){
              procesarCodigoQR(nuevoIndex, datosQR);
            }, 100);
          }
          return; // Terminar aquí
        }
        
        // Si es el MISMO producto, verificar que el código de pallet NO sea duplicado en este bloque
        var campoPalletsEscaneados = bloque.querySelector('.pallets-escaneados');
        if (campoPalletsEscaneados && datosQR.codigoPallet) {
          var palletsArray = [];
          try {
            palletsArray = JSON.parse(campoPalletsEscaneados.value || '[]');
          } catch(e) {
            palletsArray = [];
          }
          
          if (palletsArray.indexOf(datosQR.codigoPallet) !== -1) {
            showMessage('Este código de pallet ("' + datosQR.codigoPallet + '") ya fue escaneado en este bloque. No se permiten pallets duplicados.', 'error');
            var inputCodigo = bloque.querySelector('.codigo-input');
            if (inputCodigo) inputCodigo.value = '';
            
            // Si el bloque fue auto-creado y falla la validación, eliminarlo
            eliminarBloqueAutoCreado(bloque);
            return;
          }
        }
        // Si es el mismo código y el pallet NO es duplicado, continuar normalmente (acumulación)
      }

      // VALIDACIÓN DE FECHA: Comparar fecha de recepción con fecha TT
      if (datosQR.fechaRecepcion) {
        var inputFechaTT = document.getElementById('fechaTratamiento');
        if (inputFechaTT && inputFechaTT.value) {
          var fechaTT = inputFechaTT.value; // Formato YYYY-MM-DD
          var fechaRecepcion = datosQR.fechaRecepcion; // Formato DD/MM/YYYY
          
          // Convertir fecha de recepción a formato YYYY-MM-DD para comparar
          var partesFecha = fechaRecepcion.split('/');
          if (partesFecha.length === 3) {
            var dd = partesFecha[0];
            var mm = partesFecha[1];
            var yyyy = partesFecha[2];
            var fechaRecepcionISO = yyyy + '-' + mm + '-' + dd;
            
            // Convertir fecha TT a formato DD/MM/YYYY para mostrar
            var partesFechaTT = fechaTT.split('-');
            var fechaTTDisplay = partesFechaTT[2] + '/' + partesFechaTT[1] + '/' + partesFechaTT[0];
            
            console.log('Comparando fechas - TT:', fechaTT, 'Recepción:', fechaRecepcionISO);
            
            // Si fecha TT < fecha recepción, rechazar con mensaje según tipo
            if (fechaTT < fechaRecepcionISO) {
              var tipo = (datosQR.tipo || '').toString().toUpperCase();
              var msg = '';
              if (tipo === 'LISTONES') {
                msg = 'La fecha de tratamiento térmico no puede ser anterior a la fecha de ingreso a almacén.';
              } else if (tipo === 'PARIHUELAS') {
                msg = 'La fecha de tratamiento no puede ser anterior a la fecha de producción.';
              } else {
                msg = 'No corresponde a listones ni parihuelas.';
              }
              // if (tipo === 'LISTONES') {
              //   msg = 'La fecha de tratamiento térmico (' + fechaTTDisplay + ') no puede ser anterior a la fecha de ingreso a almacén (' + fechaRecepcion + ').';
              // } else if (tipo === 'PARIHUELAS') {
              //   msg = 'La fecha de tratamiento (' + fechaTTDisplay + ') no puede ser anterior a la fecha de producción (' + fechaRecepcion + ').';
              // } else {
              //   msg = 'La fecha de tratamiento (' + fechaTTDisplay + ') no puede ser anterior a la fecha de recepción (' + fechaRecepcion + ').';
              // }
              showMessage(msg, 'error');
              var inputCodigo = bloque.querySelector('.codigo-input');
              if (inputCodigo) inputCodigo.value = '';
              
              // Si el bloque fue auto-creado y falla la validación, eliminarlo
              eliminarBloqueAutoCreado(bloque);
              return;
            }
          } else {
            console.warn('Formato de fecha de recepción inválido:', fechaRecepcion);
          }
        }
      }

      // VALIDACIÓN DE DUPLICADOS: Verificar si ya existe este código de pallet en los bloques actuales
      var bloques = document.querySelectorAll('.producto-bloque');
      var palletDuplicado = false;
      var bloqueExistente = null;
      var codigoPalletDuplicado = '';
      
      // Detectar tipo del producto escaneado (PARIHUELAS o LISTONES)
      var subgrupoDetectado = detectarSubgrupoPorDescripcion(datosQR.descripcion).toUpperCase();
      var esTipoParihuelas = subgrupoDetectado.indexOf('PARIHUELA') !== -1;
      var esTipoListones = subgrupoDetectado.indexOf('LISTON') !== -1;
      
      bloques.forEach(function(otroBloque){
        var otroIndex = parseInt(otroBloque.dataset.index, 10);
        
        var otroCodigoInput = otroBloque.querySelector('.codigo-input');
        var otroDescripcionInput = otroBloque.querySelector('.producto-input');
        var otroCodigoHidden = otroBloque.querySelector('.producto-codigo');
        var otroPalletsEscaneados = otroBloque.querySelector('.pallets-escaneados');
        
        // VALIDACIÓN DE DUPLICADOS: Solo en OTROS bloques (no en el actual)
        if (otroIndex !== index && otroDescripcionInput && otroDescripcionInput.value) {
          // Verificar duplicado por código de pallet
          var nuevoCodigoPallet = datosQR.codigoPallet || '';
          
          // Verificar en el array de pallets escaneados (más confiable)
          if (otroPalletsEscaneados && nuevoCodigoPallet) {
            var palletsArray = [];
            try {
              palletsArray = JSON.parse(otroPalletsEscaneados.value || '[]');
            } catch(e) {
              palletsArray = [];
            }
            
            if (palletsArray.indexOf(nuevoCodigoPallet) !== -1) {
              palletDuplicado = true;
              codigoPalletDuplicado = nuevoCodigoPallet;
            }
          }
          
          // También verificar en el campo de código actual (por si aún no se guardó en el array)
          if (!palletDuplicado && otroCodigoInput && otroCodigoInput.value) {
            var otrosPartes = otroCodigoInput.value.split('$');
            var otroCodigoPallet = (otrosPartes[0] || '').trim();
            
            if (otroCodigoPallet && nuevoCodigoPallet && otroCodigoPallet === nuevoCodigoPallet) {
              palletDuplicado = true;
              codigoPalletDuplicado = nuevoCodigoPallet;
            }
          }
        }
      });
      
      // BÚSQUEDA DE BLOQUE EXISTENTE: Buscar en TODOS los bloques (incluido el actual) si tienen el mismo producto
      if ((esTipoParihuelas || esTipoListones) && !palletDuplicado) {
        bloques.forEach(function(otroBloque){
          var otroIndex = parseInt(otroBloque.dataset.index, 10);
          var otroDescripcionInput = otroBloque.querySelector('.producto-input');
          var otroCodigoHidden = otroBloque.querySelector('.producto-codigo');
          
          // Solo considerar bloques que YA tienen datos (código de producto)
          if (otroCodigoHidden && otroCodigoHidden.value && otroDescripcionInput && otroDescripcionInput.value) {
            var otroCodigoProducto = otroCodigoHidden.value.trim();
            var nuevoCodigoProducto = datosQR.codigo || '';
            
            console.log('Comparando códigos para acumular: otro=' + otroCodigoProducto + ' (bloque ' + otroIndex + '), nuevo=' + nuevoCodigoProducto);
            
            if (otroCodigoProducto && nuevoCodigoProducto && otroCodigoProducto === nuevoCodigoProducto) {
              bloqueExistente = otroBloque;
              console.log('✓ Producto encontrado en bloque ' + otroIndex + ', se acumulará ahí (tipo: ' + (esTipoParihuelas ? 'PARIHUELAS' : 'LISTONES') + ')');
            }
          }
        });
      }
      
      // Si el pallet ya fue escaneado, rechazar
      if (palletDuplicado) {
        showMessage('El código de pallet "' + codigoPalletDuplicado + '" ya fue escaneado en este lote. No se permiten pallets duplicados.', 'error');
        var inputCodigo = bloque.querySelector('.codigo-input');
        if (inputCodigo) inputCodigo.value = '';
        
        // Si el bloque fue auto-creado y falla la validación, eliminarlo
        eliminarBloqueAutoCreado(bloque);
        return;
      }
      
      // ========== LÓGICA DE ACUMULACIÓN ==========
      // Si encontramos un bloque existente con el mismo producto, acumular ahí en lugar de crear nuevo
      if (bloqueExistente) {
        var bloqueExistenteIndex = parseInt(bloqueExistente.dataset.index, 10);
        console.log('ACUMULANDO en bloque existente #' + bloqueExistenteIndex);
        
        // VALIDACIÓN: Para PARIHUELAS, verificar límite de 8 rumas ANTES de acumular
        if (esTipoParihuelas) {
          var campoRumasCheck = bloqueExistente.querySelector('.cantidad-rumas');
          if (campoRumasCheck) {
            var rumasActualesCheck = parseInt(campoRumasCheck.value) || 0;
            if (rumasActualesCheck >= 8) {
              showMessage('No se puede agregar más. Ya se alcanzó el máximo de 8 rumas.', 'error');
              // NO limpiar el campo del bloque actual, mantener el valor para que el usuario vea qué escaneó
              
              // Si el bloque fue auto-creado (escaneo de producto diferente) y falla la validación, eliminarlo
              eliminarBloqueAutoCreado(bloque);
              return;
            }
          }
        }
        
        // Agregar el nuevo código de pallet al array de pallets-escaneados
        var campoPalletsEscaneados = bloqueExistente.querySelector('.pallets-escaneados');
        if (campoPalletsEscaneados && datosQR.codigoPallet) {
          var palletsArray = [];
          try {
            palletsArray = JSON.parse(campoPalletsEscaneados.value || '[]');
          } catch(e) {
            palletsArray = [];
          }
          
          palletsArray.push(datosQR.codigoPallet);
          campoPalletsEscaneados.value = JSON.stringify(palletsArray);
          console.log('✓ Pallet agregado al array existente:', datosQR.codigoPallet);
          console.log('✓ Array completo de pallets:', palletsArray);
        }
        
        // Acumular cantidades según el tipo
        if (esTipoParihuelas) {
          // Para PARIHUELAS: sumar rumas y unidades
          var campoRumas = bloqueExistente.querySelector('.cantidad-rumas');
          var campoUnidades = bloqueExistente.querySelector('.cantidad-unidades');
          
          if (campoRumas && campoUnidades) {
            var rumasActuales = parseInt(campoRumas.value) || 0;
            var unidadesActuales = parseInt(campoUnidades.value) || 0;
            var nuevasUnidades = parseInt(datosQR.unidades) || 0;
            
            campoRumas.value = rumasActuales + 1; // +1 ruma por cada pallet
            campoUnidades.value = unidadesActuales + nuevasUnidades;
            
            console.log('✓ PARIHUELAS acumuladas: Rumas=' + campoRumas.value + ', Unidades=' + campoUnidades.value);
          }
          
          // Actualizar contadores globales
          actualizarContadorRumas();
          actualizarEstadoBotones();
          
        } else if (esTipoListones) {
          // Para LISTONES: validar capacidad del horno ANTES de acumular
          var campoUnidades = bloqueExistente.querySelector('.campo-cantidad-por-pallet');
          var campoM3Unidad = bloqueExistente.querySelector('.m3-por-unidad');
          
          if (campoUnidades && campoM3Unidad) {
            var unidadesActuales = parseInt(campoUnidades.value) || 0;
            var nuevasUnidades = parseInt(datosQR.unidades) || 0;
            var m3PorUnidad = parseFloat(campoM3Unidad.value) || 0;
            
            // Calcular m³ actuales y nuevos
            var m3Actuales = calcularM3Totales();
            var m3Nuevos = nuevasUnidades * m3PorUnidad;
            var m3TotalesConNuevo = m3Actuales + m3Nuevos;
            
            console.log('Validando capacidad LISTONES: actual=' + m3Actuales.toFixed(2) + ' m³, nuevo=' + m3Nuevos.toFixed(2) + ' m³, total=' + m3TotalesConNuevo.toFixed(2) + ' m³');
            
            // Verificar si excede la capacidad
            if (m3TotalesConNuevo > CAPACIDAD_HORNO_M3) {
              showMessage('No se puede agregar más. La capacidad del horno es de ' + CAPACIDAD_HORNO_M3 + ' m³. Con este pallet alcanzaría ' + m3TotalesConNuevo.toFixed(2) + ' m³.', 'error');
              // NO limpiar el campo del bloque actual
              
              // Si el bloque fue auto-creado y falla la validación, eliminarlo
              eliminarBloqueAutoCreado(bloque);
              return;
            }
            
            // Si está dentro de la capacidad, acumular
            campoUnidades.value = unidadesActuales + nuevasUnidades;
            
            console.log('✓ LISTONES acumulados: Unidades=' + campoUnidades.value);
          }
          
          // Actualizar contadores globales
          actualizarContadorM3();
          actualizarEstadoBotonAgregarListones();
        }
        
        // Actualizar preview del lote
        var especieGlobal = document.getElementById('EspecieMaderaTratada');
        if (especieGlobal && especieGlobal.value) {
          actualizarPreviewLote(especieGlobal.value);
        }
        
        // Limpiar el campo de código del bloque actual SOLO si se acumuló en otro bloque diferente
        // Si es el mismo bloque, NO limpiar para que el usuario vea el código escaneado
        if (bloqueExistenteIndex !== index) {
          var inputCodigo = bloque.querySelector('.codigo-input');
          if (inputCodigo) {
            inputCodigo.value = '';
            console.log('Campo de código limpiado en bloque ' + index + ' (acumulado en bloque ' + bloqueExistenteIndex + ')');
          }
        } else {
          console.log('No se limpia campo: escaneo en el mismo bloque donde se acumuló (bloque ' + index + ')');
        }
        
        showMessage('Producto acumulado correctamente en el bloque existente (QR #' + palletsArray.length + ')', 'success');
        return; // Terminar aquí, no continuar con el flujo normal
      }
      // ========== FIN LÓGICA DE ACUMULACIÓN ==========

      // ... El resto del cuerpo original permanece igual (no modificado) ...
      if (index > 0 || bloques.length > 1) {
        // Obtener el tipo del primer producto
        var primerBloque = document.querySelector('.producto-bloque[data-index="0"]');
        if (primerBloque) {
          var primerEspecieHidden = primerBloque.querySelector('.producto-especie');
          if (primerEspecieHidden && primerEspecieHidden.value) {
            var primerTipo = primerEspecieHidden.value.toUpperCase().trim();
            var nuevoTipo = detectarSubgrupoPorDescripcion(datosQR.descripcion).toUpperCase().trim();
            
            var esPrimeroParihuelas = (primerTipo === 'PARIHUELAS' || primerTipo === 'PARIHUELA');
            var esPrimeroListones = (primerTipo === 'LISTONES' || primerTipo === 'LISTON');
            var esNuevoParihuelas = (nuevoTipo === 'PARIHUELAS' || nuevoTipo === 'PARIHUELA');
            var esNuevoListones = (nuevoTipo === 'LISTONES' || nuevoTipo === 'LISTON');
            
            if ((esPrimeroParihuelas && esNuevoListones) || (esPrimeroListones && esNuevoParihuelas)) {
              var tipoActual = esPrimeroParihuelas ? 'PARIHUELAS' : 'LISTONES';
              var tipoIntentado = esNuevoParihuelas ? 'PARIHUELAS' : 'LISTONES';
              showMessage('No se pueden mezclar productos de diferentes tipos. Ya tiene productos tipo "' + tipoActual + '", no puede agregar "' + tipoIntentado + '".', 'error');
              // Limpiar el campo de código del bloque actual
              var inputCodigo = bloque.querySelector('.codigo-input');
              if (inputCodigo) inputCodigo.value = '';
              
              // Si el bloque fue auto-creado y falla la validación, eliminarlo
              eliminarBloqueAutoCreado(bloque);
              return;
            }
          }
        }
      }
      
      // Rellenar el input de código (desde donde se escanea) y la descripción
      var inputCodigo = bloque.querySelector('.codigo-input');
      var inputDescripcion = bloque.querySelector('.producto-input');
      var descripcionHidden = bloque.querySelector('.producto-descripcion');
      if (inputCodigo) inputCodigo.value = datosQR.codigo.trim();
      if (inputDescripcion) inputDescripcion.value = datosQR.descripcion.trim();
      if (descripcionHidden) descripcionHidden.value = datosQR.descripcion.trim();
      
      // Ahora necesitamos buscar el producto en la base de datos para obtener ID y Subgrupo
      // Usamos la búsqueda en `almacenregistros` por CÓDIGO (más preciso que descripción)
      console.log('Buscando en almacenregistros con código:', datosQR.codigo);
      fetch('../requerimientos/api/api_buscar_almacenregistros.php?q=' + encodeURIComponent(datosQR.codigo))
        .then(function(res){ 
          console.log('Respuesta API recibida, status:', res.status);
          return res.json(); 
        })
        .then(function(data){
          console.log('Datos API parseados:', data);
          var producto = null;
          
          // Intentar obtener datos de la API
          if (data && data.success && Array.isArray(data.result) && data.result.length > 0) {
            console.log('Producto encontrado en API:', data.result[0]);
            producto = data.result[0];
          } else {
            // Si no se encuentra en la API, crear objeto con datos del QR
            console.warn('Producto no encontrado en API, usando datos del QR');
            producto = {
              Id: '',
              Codigo: datosQR.codigo,
              Descripcion: datosQR.descripcion,
              Subgrupo: detectarSubgrupoPorDescripcion(datosQR.descripcion),
              Cantidad: datosQR.unidades || '0' ,
              Pallets: '0',
              Observacion: ''
            };
          }
          
          console.log('Producto final a procesar:', producto);
          
          // Si el Subgrupo está vacío, intentar detectarlo por la descripción
          if (!producto.Subgrupo || producto.Subgrupo.trim() === '') {
            console.log('Subgrupo vacío, detectando por descripción...');
            producto.Subgrupo = detectarSubgrupoPorDescripcion(producto.Descripcion || datosQR.descripcion);
            console.log('Subgrupo detectado:', producto.Subgrupo);
          }
          
          // Rellenar campos ocultos
          var idHidden = bloque.querySelector('.producto-id');
          var codigoHidden = bloque.querySelector('.producto-codigo');
          var especieHidden = bloque.querySelector('.producto-especie');
          
          if (idHidden) idHidden.value = producto.Id || '';
          if (codigoHidden) codigoHidden.value = datosQR.codigo;
          if (especieHidden) especieHidden.value = producto.Subgrupo || '';
          
          // Si es el primer bloque, determinar tipo de tratamiento
          if (index === 0) {
            var especieGlobal = document.getElementById('EspecieMaderaTratada');
            if (especieGlobal) especieGlobal.value = producto.Subgrupo || '';
            
            // Detectar tipo de producto
            var subgrupo = (producto.Subgrupo || '').toUpperCase().trim();
            esParihuelas = (subgrupo === 'PARIHUELAS' || subgrupo === 'PARIHUELA');
            esListones = (subgrupo === 'LISTONES' || subgrupo === 'LISTON');
            
            // Transformar bloque según tipo
            if (esListones) {
              transformarBloque(index, 'LISTONES');
              
              // Rellenar campo de unidades para LISTONES
              var campoUnidades = bloque.querySelector('.campo-cantidad-por-pallet');
              if (campoUnidades) campoUnidades.value = datosQR.unidades;
              
              // CALCULAR METROS CÚBICOS del producto
              var medidas = extraerMedidasYCalcularM3(datosQR.descripcion);
              var campoM3Hidden = bloque.querySelector('.m3-por-unidad');
              
              if (!medidas) {
                console.warn('No se pudieron extraer medidas de:', datosQR.descripcion);
                if (campoM3Hidden) campoM3Hidden.value = '0';
              } else {
                if (campoM3Hidden) {
                  campoM3Hidden.value = medidas.m3.toFixed(6);
                  console.log('m³ calculado:', medidas.m3.toFixed(6), 'para producto:', datosQR.descripcion);
                }
              }
              
              // Agregar código de pallet al array de pallets escaneados (primer escaneo LISTONES)
              var campoPalletsEscaneados = bloque.querySelector('.pallets-escaneados');
              console.log('DEBUG LISTONES: campoPalletsEscaneados encontrado?', campoPalletsEscaneados !== null);
              console.log('DEBUG LISTONES: datosQR.codigoPallet =', datosQR.codigoPallet);
              if (campoPalletsEscaneados && datosQR.codigoPallet) {
                campoPalletsEscaneados.value = JSON.stringify([datosQR.codigoPallet]);
                console.log('✓ Primer pallet LISTONES guardado en array:', datosQR.codigoPallet);
                console.log('✓ Valor del campo pallets-escaneados:', campoPalletsEscaneados.value);
              } else {
                console.error('✗ NO se guardó pallet LISTONES - campo no existe o codigoPallet vacío');
              }
              
              // Mostrar campo de producto después de seleccionar
              var campoProducto = bloque.querySelector('.campo-producto');
              if (campoProducto) campoProducto.style.display = 'flex';
              
              // Actualizar contadores
              actualizarContadorM3();
              actualizarEstadoBotonAgregarListones();
            } else {
              transformarBloque(index, 'PARIHUELAS');
              
              // Para PARIHUELAS: rellenar cantidad en unidades
              var campoUnidades = bloque.querySelector('.cantidad-unidades');
              if (campoUnidades) campoUnidades.value = datosQR.unidades;
              
              // Asignar automáticamente 1 ruma (campo oculto)
              var campoRumas = bloque.querySelector('.cantidad-rumas');
              if (campoRumas) campoRumas.value = '1';
              
              // Agregar código de pallet al array de pallets escaneados (primer escaneo)
              var campoPalletsEscaneados = bloque.querySelector('.pallets-escaneados');
              if (campoPalletsEscaneados && datosQR.codigoPallet) {
                campoPalletsEscaneados.value = JSON.stringify([datosQR.codigoPallet]);
                console.log('Primer pallet escaneado:', datosQR.codigoPallet);
              }
              
              // Mostrar campo de producto después de seleccionar
              var campoProducto = bloque.querySelector('.campo-producto');
              if (campoProducto) campoProducto.style.display = 'flex';
              
              // Actualizar contadores de parihuelas
              actualizarContadorRumas();
              actualizarEstadoBotones();
            }
            
            evaluarModoTratamiento();
            actualizarPreviewLote(producto.Subgrupo || '');
          } else {
            // Para bloques adicionales
            if (esListones) {
              transformarBloque(index, 'LISTONES');
              
              var campoUnidades = bloque.querySelector('.campo-cantidad-por-pallet');
              if (campoUnidades) campoUnidades.value = datosQR.unidades;
              
              var medidas = extraerMedidasYCalcularM3(datosQR.descripcion);
              var campoM3Hidden = bloque.querySelector('.m3-por-unidad');
              
              if (!medidas) {
                console.warn('No se pudieron extraer medidas de:', datosQR.descripcion);
                if (campoM3Hidden) campoM3Hidden.value = '0';
              } else {
                if (campoM3Hidden) {
                  campoM3Hidden.value = medidas.m3.toFixed(6);
                  console.log('m³ calculado:', medidas.m3.toFixed(6), 'para producto:', datosQR.descripcion);
                }
              }
              
              // Agregar código de pallet al array de pallets escaneados (bloques adicionales LISTONES)
              var campoPalletsEscaneados = bloque.querySelector('.pallets-escaneados');
              console.log('DEBUG LISTONES (bloque adicional): campoPalletsEscaneados encontrado?', campoPalletsEscaneados !== null);
              console.log('DEBUG LISTONES (bloque adicional): datosQR.codigoPallet =', datosQR.codigoPallet);
              if (campoPalletsEscaneados && datosQR.codigoPallet) {
                campoPalletsEscaneados.value = JSON.stringify([datosQR.codigoPallet]);
                console.log('✓ Pallet LISTONES guardado en bloque adicional:', datosQR.codigoPallet);
                console.log('✓ Valor del campo pallets-escaneados:', campoPalletsEscaneados.value);
              } else {
                console.error('✗ NO se guardó pallet LISTONES en bloque adicional - campo no existe o codigoPallet vacío');
              }
              
              // Mostrar campo de producto después de seleccionar
              var campoProducto = bloque.querySelector('.campo-producto');
              if (campoProducto) campoProducto.style.display = 'flex';
              
              actualizarContadorM3();
              actualizarEstadoBotonAgregarListones();
            } else {
              transformarBloque(index, 'PARIHUELAS');
              
              // Para PARIHUELAS: rellenar cantidad en unidades
              var campoUnidades = bloque.querySelector('.cantidad-unidades');
              if (campoUnidades) campoUnidades.value = datosQR.unidades;
              
              // Asignar automáticamente 1 ruma (campo oculto)
              var campoRumas = bloque.querySelector('.cantidad-rumas');
              if (campoRumas) campoRumas.value = '1';
              
              // Agregar código de pallet al array de pallets escaneados (primer escaneo en bloque adicional)
              var campoPalletsEscaneados = bloque.querySelector('.pallets-escaneados');
              if (campoPalletsEscaneados && datosQR.codigoPallet) {
                campoPalletsEscaneados.value = JSON.stringify([datosQR.codigoPallet]);
                console.log('Primer pallet escaneado en bloque adicional:', datosQR.codigoPallet);
              }
              
              // Mostrar campo de producto después de seleccionar
              var campoProducto = bloque.querySelector('.campo-producto');
              if (campoProducto) campoProducto.style.display = 'flex';
              
              // Actualizar contadores de parihuelas
              actualizarContadorRumas();
              actualizarEstadoBotones();
            }
          }
        })
        .catch(function(err){ 
          console.warn('Error buscando producto del QR:', err);
          showMessage('Error al buscar el producto en el sistema.', 'error');
        });
    }

    // ============================================
    // FUNCIONES PARA AUTOCOMPLETADO
    // ============================================
    function inicializarAutocomplete(index){
      var bloque = document.querySelector('.producto-bloque[data-index="' + index + '"]');
      if (!bloque) return;
      
      var input = bloque.querySelector('.codigo-input');
      var box = bloque.querySelector('.campo-codigo-busqueda .suggestions-box');
      if (!input || !box) return;

      var timeout = null;
      var currentSearchId = 0; // Identificador de búsqueda para ignorar respuestas antiguas
      function clearBox(){ box.innerHTML = ''; box.style.display = 'none'; }

      input.addEventListener('input', function(){
        var q = input.value.trim();
        
        // Cancelar timeout anterior si existe
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        
        // Si se borró el código, limpiar todos los campos relacionados
        if (q.length < 1) { 
          clearBox();
          var inputDescripcion = bloque.querySelector('.producto-input');
          var campoProducto = bloque.querySelector('.campo-producto');
          var idHidden = bloque.querySelector('.producto-id');
          var codigoHidden = bloque.querySelector('.producto-codigo');
          var especieHidden = bloque.querySelector('.producto-especie');
          var m3Hidden = bloque.querySelector('.m3-por-unidad');
          
          if (inputDescripcion) inputDescripcion.value = '';
          if (campoProducto) campoProducto.style.display = 'none';
          if (idHidden) idHidden.value = '';
          if (codigoHidden) codigoHidden.value = '';
          if (especieHidden) especieHidden.value = '';
          if (m3Hidden) m3Hidden.value = '0';
          
          // Ocultar campos de producto específicos
          var camposParihuelas = bloque.querySelectorAll('.campos-parihuelas');
          var camposListones = bloque.querySelectorAll('.campos-listones');
          camposParihuelas.forEach(function(c){ c.style.display = 'none'; });
          camposListones.forEach(function(c){ c.style.display = 'none'; });
          
          // Actualizar contadores
          if (esListones) {
            actualizarContadorM3();
            actualizarEstadoBotonAgregarListones();
          } else if (esParihuelas) {
            actualizarContadorRumas();
            actualizarEstadoBotones();
          }
          
          return; 
        }
        
        // Requerir al menos MIN_SEARCH_LENGTH caracteres para buscar
        if (q.length < MIN_SEARCH_LENGTH) { clearBox(); return; }
        
        // Detectar si contiene $ (posible código QR)
        if (q.indexOf('$') !== -1) {
          // NO procesar inmediatamente, esperar a que termine de escribirse
          // Solo limpiar el box de sugerencias
          clearBox();
          
          // Establecer timeout corto para procesar cuando termine el escaneo
          timeout = setTimeout(function(){
            var valorFinal = input.value.trim();
            console.log('Timeout completado, procesando valor final:', valorFinal);
            if (valorFinal.indexOf('$') !== -1) {
              var datosQR = parseCodigoQR(valorFinal);
              if (datosQR) {
                console.log('Procesando código QR desde timeout...');
                procesarCodigoQR(index, datosQR);
              } else {
                showMessage('El código QR no tiene el formato esperado.', 'error');
              }
            }
          }, 100); // Reducir timeout a 100ms para QR rápido
          return;
        }

        // Para búsqueda normal (sin $), usar timeout más largo y buscar por código
        timeout = setTimeout(function(){
          // Incrementar ID de búsqueda
          currentSearchId++;
          var thisSearchId = currentSearchId;
          
          // Limpiar el box antes de la nueva búsqueda
          clearBox();
          
          // Buscar por código en almacenregistros
          console.log('Buscando almacenregistros con término:', q, '(ID:', thisSearchId, ')');
          fetch('../requerimientos/api/api_buscar_almacenregistros.php?q=' + encodeURIComponent(q))
            .then(function(res){ 
              console.log('Respuesta recibida, status:', res.status);
              return res.json(); 
            })
            .then(function(data){
              // Ignorar respuesta si ya hay una búsqueda más reciente
              if (thisSearchId !== currentSearchId) {
                console.log('Ignorando respuesta antigua (ID:', thisSearchId, ', actual:', currentSearchId, ')');
                return;
              }
              
              console.log('Datos JSON recibidos:', data);
              if (!data || !data.success || !Array.isArray(data.result) || data.result.length === 0) { 
                    console.log('No hay resultados o error en la respuesta');
                    clearBox();
                    // Mostrar un indicador "sin resultados" en el dropdown en lugar de un mensaje de error
                    var nores = document.createElement('div');
                    nores.className = 'suggestion-item';
                    nores.style.opacity = '0.7';
                    nores.textContent = 'No se encontraron resultados';
                    box.appendChild(nores);
                    box.style.display = 'block';
                    return; 
                  }
              box.innerHTML = '';
              var seen = {};
              data.result.forEach(function(item){
                if (!item || !item.Codigo) return;
                var key = item.Codigo;
                if (seen[key]) return; seen[key] = true;
                var div = document.createElement('div');
                div.className = 'suggestion-item';
                // Mostrar código y descripción en el dropdown
                div.textContent = item.Codigo + ' - ' + (item.Descripcion || '');
                div.dataset.descripcion = item.Descripcion;
                div.dataset.subgrupo = item.Subgrupo || '';
                div.dataset.id = item.Id || '';
                div.dataset.codigo = item.Codigo || '';
                div.addEventListener('mousedown', function(ev){
                  ev.preventDefault();
                  seleccionarProducto(index, this.dataset);
                  clearBox();
                });
                box.appendChild(div);
              });
              box.style.display = 'block';
            })
            .catch(function(err){ console.warn('Error buscando productos:', err); clearBox(); });
        }, 300);
      });

      input.addEventListener('blur', function(){
        setTimeout(function(){
          try { clearBox(); } catch(e){}
          var valor = input.value ? input.value.trim() : '';
          if (!valor) return;
          // Si contiene $, ya será procesado por el timeout/paste/enter
          if (valor.indexOf('$') !== -1) return;
          // Solo comprobar pallets si el valor tiene longitud suficiente para evitar búsquedas prematuras
          if (valor.length < MIN_SEARCH_LENGTH) return;
          // Comprobar si el valor pegado/tipeado corresponde a un CodigoPallet ya registrado
          checkPalletExists(valor).then(function(exists){
            if (exists) {
              showMessage('El código de pallet "' + valor + '" ya fue registrado anteriormente. No se permite reuso.', 'error');
              input.value = '';
            }
          }).catch(function(err){ console.warn('Error comprobando pallet en blur:', err); });
        }, 150);
      });
      input.addEventListener('keydown', function(e){
        if (e.key === 'Escape') clearBox;
        
        // Detectar Enter (la pistola QR envía Enter al final del escaneo)
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault();
          clearTimeout(timeout);
          clearBox();
          
          var valor = input.value.trim();
          console.log('Enter detectado, valor del input:', valor);
          
          // Si contiene $, es un código QR
          if (valor.indexOf('$') !== -1) {
            var datosQR = parseCodigoQR(valor);
            if (datosQR) {
              console.log('Procesando código QR desde Enter...');
              procesarCodigoQR(index, datosQR);
            } else {
              showMessage('El código QR no tiene el formato esperado.', 'error');
            }
          }
        }
      });
      
      // Detectar cuando se pega un código QR
      input.addEventListener('paste', function(e){
        setTimeout(function(){
          var valor = input.value.trim();
          if (valor.indexOf('$') !== -1) {
            clearBox();
            var datosQR = parseCodigoQR(valor);
            if (datosQR) {
              procesarCodigoQR(index, datosQR);
            } else {
              showMessage('El código QR no tiene el formato esperado.', 'error');
            }
          }
        }, 50);
      });
    }

    // ============================================
    // CÁLCULO DE METROS CÚBICOS PARA LISTONES
    // ============================================
    function extraerMedidasYCalcularM3(descripcion){
      // Patrón flexible: captura 3 números separados por X (mayúscula, minúscula o ×) seguidos de MM
      var patron = /(\d+)\s*[xX×]\s*(\d+)\s*[xX×]\s*(\d+)\s*MM/i;
      
      console.log('Intentando extraer medidas de:', descripcion);
      
      var match = descripcion.match(patron);
      
      if (!match) {
        console.warn('No coincidió el patrón de medidas. Patron:', patron, 'Descripción:', descripcion);
        return null; // No se encontraron medidas en el formato esperado
      }
      
      console.log('Match encontrado:', match);
      
      var dim1 = parseInt(match[1], 10); // mm
      var dim2 = parseInt(match[2], 10); // mm
      var dim3 = parseInt(match[3], 10); // mm
      
      // Convertir de milímetros a metros y calcular volumen en m³
      var m3 = (dim1 / 1000) * (dim2 / 1000) * (dim3 / 1000);
      
      console.log('Dimensiones extraídas:', dim1, 'x', dim2, 'x', dim3, 'mm =', m3, 'm³');
      
      return {
        dim1: dim1,
        dim2: dim2,
        dim3: dim3,
        m3: m3
      };
    }
    
    function calcularM3Totales(){
      var total = 0;
      var bloques = document.querySelectorAll('.producto-bloque');
      
      console.log('Calculando m³ totales, bloques encontrados:', bloques.length);
      
      bloques.forEach(function(bloque){
        // Verificar si el campo de unidades (cantidad por pallet) está visible
        var campoUnidades = bloque.querySelector('.campo-cantidad-por-pallet');
        if (!campoUnidades) return;
        
        // Verificar si el campo padre está visible
        var campoParent = campoUnidades.closest('.form-group');
        if (!campoParent || campoParent.style.display === 'none') return;
        
        var m3Unidad = parseFloat(bloque.querySelector('.m3-por-unidad').value) || 0;
        var unidades = parseInt(campoUnidades.value, 10) || 0;
        
        console.log('Bloque:', bloque.dataset.index, 'm³/unidad:', m3Unidad, 'unidades:', unidades, 'subtotal:', (m3Unidad * unidades));
        
        // Fórmula: m³_total = m³_unidad × unidades
        total += (m3Unidad * unidades);
      });
      
      console.log('Total m³ calculado:', total);
      
      return total;
    }
    
    function actualizarContadorM3(){
      var total = calcularM3Totales();
      var span = document.getElementById('m3Totales');
      if (span) span.textContent = total.toFixed(2);
      
      var infoM3 = document.getElementById('infoMetrosCubicos');
      if (infoM3) {
        if (total > CAPACIDAD_HORNO_M3) {
          infoM3.style.background = '#ffebee';
          infoM3.style.borderColor = '#f44336';
        } else {
          infoM3.style.background = '#e8f5e9';
          infoM3.style.borderColor = '#4caf50';
        }
      }
    }
    
    function actualizarEstadoBotonAgregarListones(){
      var totalM3 = calcularM3Totales();
      var btnAgregar = document.getElementById('btnAgregarProducto');
      
      if (btnAgregar && esListones) {
        if (totalM3 >= CAPACIDAD_HORNO_M3) {
          btnAgregar.disabled = true;
          btnAgregar.style.opacity = '0.5';
          btnAgregar.style.cursor = 'not-allowed';
        } else {
          btnAgregar.disabled = false;
          btnAgregar.style.opacity = '1';
          btnAgregar.style.cursor = 'pointer';
        }
      }
    }
    
    // ============================================
    // TRANSFORMACIÓN DE BLOQUES SEGÚN TIPO
    // ============================================
    function transformarBloque(index, tipo){
      // tipo: 'PARIHUELAS' o 'LISTONES'
      var bloque = document.querySelector('.producto-bloque[data-index="' + index + '"]');
      if (!bloque) return;
      
      var camposParihuelas = bloque.querySelectorAll('.campos-parihuelas');
      var camposListones = bloque.querySelectorAll('.campos-listones');
      
      if (tipo === 'LISTONES') {
        // Ocultar campos de parihuelas
        camposParihuelas.forEach(function(campo){
          campo.style.display = 'none';
          // Remover required de campos parihuelas
          var inputs = campo.querySelectorAll('input');
          inputs.forEach(function(inp){ inp.removeAttribute('required'); });
        });
        
        // Para LISTONES: solo mostrar el campo de Unidades
        // Los campos de stock y observación permanecen ocultos (ya tienen display:none en HTML)
        camposListones.forEach(function(campo){
          // Buscar si el campo contiene el input de unidades
          var esUnidades = campo.querySelector('.campo-cantidad-por-pallet');
          if (esUnidades) {
            campo.style.display = 'block';
          }
          // Los demás campos permanecen ocultos (stock unidades, stock pallets, observación)
        });
        
        // Agregar required al campo unidades
        var campoUnidades = bloque.querySelector('.campo-cantidad-por-pallet');
        if (campoUnidades) campoUnidades.setAttribute('required', 'required');
        
      } else {
        // Mostrar campos de parihuelas
        camposParihuelas.forEach(function(campo){
          // Solo mostrar el campo de "Cantidad en Unidades", no el de rumas
          var inputRumas = campo.querySelector('.cantidad-rumas');
          if (inputRumas) {
            // Campo rumas: mantener oculto pero funcional
            campo.style.display = 'none';
            inputRumas.removeAttribute('required');
            // Asegurar que tenga valor 1
            if (!inputRumas.value || inputRumas.value === '0') {
              inputRumas.value = '1';
            }
          } else {
            // Campo unidades: mostrar normalmente
            campo.style.display = 'block';
            var inputs = campo.querySelectorAll('input');
            inputs.forEach(function(inp){ inp.setAttribute('required', 'required'); });
          }
        });
        
        // Ocultar campos de listones
        camposListones.forEach(function(campo){
          campo.style.display = 'none';
          // Limpiar valores
          var inputs = campo.querySelectorAll('input, textarea');
          inputs.forEach(function(inp){ 
            inp.value = ''; 
            inp.removeAttribute('required');
          });
        });
      }
    }
    
    function seleccionarProducto(index, data){
      var bloque = document.querySelector('.producto-bloque[data-index="' + index + '"]');
      if (!bloque) return;
      
      // VALIDACIÓN: Si es parihuelas y hay múltiples bloques, verificar que no se repita el producto
      if (esParihuelas) {
        var bloques = document.querySelectorAll('.producto-bloque');
        if (bloques.length > 1 || index > 0) {
          // Verificar si este producto ya está seleccionado en otro bloque
          var productoYaSeleccionado = false;
          bloques.forEach(function(otroBloque){
            var otroIndex = parseInt(otroBloque.dataset.index, 10);
            if (otroIndex === index) return; // Saltar el bloque actual
            
            var otroInputCodigo = otroBloque.querySelector('.codigo-input');
            var otroIdHidden = otroBloque.querySelector('.producto-id');
            
            // Comparar por ID si está disponible, sino por código
            if (data.id && otroIdHidden && otroIdHidden.value) {
              if (otroIdHidden.value === data.id) {
                productoYaSeleccionado = true;
              }
            } else if (otroInputCodigo && otroInputCodigo.value) {
              if (otroInputCodigo.value.trim() === (data.codigo || '').trim()) {
                productoYaSeleccionado = true;
              }
            }
          });
          
          if (productoYaSeleccionado) {
            showMessage('Este producto ya fue seleccionado en otro bloque. Elija un producto diferente.', 'error');
            // Limpiar los inputs del bloque actual
            var inputCodigo = bloque.querySelector('.codigo-input');
            var inputDescripcion = bloque.querySelector('.producto-input');
            if (inputCodigo) inputCodigo.value = '';
            if (inputDescripcion) inputDescripcion.value = '';
            
            // Si el bloque fue auto-creado y falla la validación, eliminarlo
            eliminarBloqueAutoCreado(bloque);
            return;
          }
        }
      }
      
      // Rellenar inputs
      var inputCodigo = bloque.querySelector('.codigo-input');
      var inputDescripcion = bloque.querySelector('.producto-input');
      var campoProducto = bloque.querySelector('.campo-producto');
      var idHidden = bloque.querySelector('.producto-id');
      var codigoHidden = bloque.querySelector('.producto-codigo');
      var especieHidden = bloque.querySelector('.producto-especie');
      var descripcionHidden = bloque.querySelector('.producto-descripcion');
      
      if (inputCodigo) inputCodigo.value = (data.codigo || '').trim();
      if (inputDescripcion) inputDescripcion.value = (data.descripcion || '').trim();
      if (idHidden) idHidden.value = data.id || '';
      if (codigoHidden) codigoHidden.value = data.codigo || '';
      if (especieHidden) especieHidden.value = data.subgrupo || '';
      if (descripcionHidden) descripcionHidden.value = (data.descripcion || '').trim();
      
      // Mostrar campo de producto después de seleccionar
      if (campoProducto) campoProducto.style.display = 'flex';
      
      // Si es el primer bloque, determinar tipo de tratamiento
      if (index === 0) {
        var especieGlobal = document.getElementById('EspecieMaderaTratada');
        if (especieGlobal) especieGlobal.value = data.subgrupo || '';
        
        // Detectar tipo de producto (normalizar comparación)
        var subgrupo = (data.subgrupo || '').toUpperCase().trim();
        esParihuelas = (subgrupo === 'PARIHUELAS' || subgrupo === 'PARIHUELA');
        esListones = (subgrupo === 'LISTONES' || subgrupo === 'LISTON');
        
        // Transformar bloque según tipo
        if (esListones) {
          transformarBloque(index, 'LISTONES');
          // Buscar datos completos de stock desde product_search.php
          buscarDatosStockListones(index, data.descripcion || '');
        } else {
          transformarBloque(index, 'PARIHUELAS');
          // Asignar automáticamente 1 ruma
          var campoRumas = bloque.querySelector('.cantidad-rumas');
          if (campoRumas) campoRumas.value = '1';
        }
        
        // Evaluar interfaz según tipo y cantidad de rumas actual
        evaluarModoTratamiento();
        actualizarPreviewLote(data.subgrupo || '');
      } else {
        // Para bloques adicionales, usar el tipo del primer bloque
        if (esListones) {
          transformarBloque(index, 'LISTONES');
          buscarDatosStockListones(index, data.descripcion || '');
        } else {
          transformarBloque(index, 'PARIHUELAS');
          // Asignar automáticamente 1 ruma
          var campoRumas = bloque.querySelector('.cantidad-rumas');
          if (campoRumas) campoRumas.value = '1';
        }
      }
    }
    
    // Función auxiliar para buscar datos de stock cuando es LISTONES
    function buscarDatosStockListones(index, descripcion){
      if (!descripcion) return;
      
      fetch('product_search.php?q=' + encodeURIComponent(descripcion))
        .then(function(res){ return res.json(); })
        .then(function(data){
          if (!data || !Array.isArray(data) || data.length === 0) return;
          
          // Tomar el primer resultado que coincida exactamente
          var item = data[0];
          var bloque = document.querySelector('.producto-bloque[data-index="' + index + '"]');
          if (!bloque) return;
          
          // Rellenar campos de stock
          var inputCodigo = bloque.querySelector('.codigo-input');
          var campoStockUnidades = bloque.querySelector('.campo-stock-unidades');
          var campoStockPallets = bloque.querySelector('.campo-stock-pallets');
          var campoObservacion = bloque.querySelector('.campo-observacion-producto');
          
          if (inputCodigo) inputCodigo.value = item.Codigo || '';
          if (campoStockUnidades) campoStockUnidades.value = item.Cantidad || '0';
          if (campoStockPallets) campoStockPallets.value = item.Pallets || '0';
          if (campoObservacion) campoObservacion.value = item.Observacion || '';
          
          // También actualizar los campos hidden (código, ID y especie)
          var codigoHidden = bloque.querySelector('.producto-codigo');
          var idHidden = bloque.querySelector('.producto-id');
          var especieHidden = bloque.querySelector('.producto-especie');
          var descripcionHidden = bloque.querySelector('.producto-descripcion');
          
          if (codigoHidden) codigoHidden.value = item.Codigo || '';
          if (idHidden) idHidden.value = item.Id || '';
          if (especieHidden) especieHidden.value = item.Subgrupo || '';
          if (descripcionHidden) descripcionHidden.value = item.Descripcion || '';
          
          console.log('Datos hidden actualizados:', {
            id: item.Id,
            codigo: item.Codigo,
            especie: item.Subgrupo,
            descripcion: item.Descripcion
          });
          
          // CALCULAR METROS CÚBICOS del producto
          var medidas = extraerMedidasYCalcularM3(item.Descripcion || descripcion);
          var campoM3Hidden = bloque.querySelector('.m3-por-unidad');
          
          if (!medidas) {
            // No se pudieron extraer las medidas
            showMessage('El producto "' + (item.Descripcion || descripcion) + '" no tiene el formato de medidas correcto (debe contener dimensiones como 30X30X1520MM).', 'error');
            // Limpiar el input de producto para que el usuario elija otro
            var inputProducto = bloque.querySelector('.producto-input');
            if (inputProducto) inputProducto.value = '';
            if (campoM3Hidden) campoM3Hidden.value = '0';
            return;
          }
          
          // Guardar m³ por unidad en el campo hidden
          if (campoM3Hidden) campoM3Hidden.value = medidas.m3.toFixed(6);
          
          // Actualizar contador si ya hay cantidad ingresada
          actualizarContadorM3();
          actualizarEstadoBotonAgregarListones();
        })
        .catch(function(err){ console.warn('Error obteniendo stock de listones:', err); });
    }

    // ============================================
    // GESTIÓN DE BLOQUES DINÁMICOS
    // ============================================
    function evaluarModoTratamiento(){
      // Esta función decide si mostrar u ocultar el botón agregar
      // basándose en el tipo de producto y la cantidad de rumas del primer bloque
      
      var btnAgregar = document.getElementById('btnAgregarProducto');
      var infoRumas = document.getElementById('infoRumas');
      
      if (esListones) {
        // Para LISTONES: permitir múltiples productos (tratamiento mixto)
        if (btnAgregar) {
          btnAgregar.style.display = 'block';
          btnAgregar.textContent = '+ Agregar otro producto (Tratamiento Mixto)';
        }
        if (infoRumas) infoRumas.style.display = 'none';
        
        // Mostrar contador de metros cúbicos
        var infoM3 = document.getElementById('infoMetrosCubicos');
        if (infoM3) infoM3.style.display = 'block';
        
        actualizarContadorM3();
        actualizarEstadoBotonAgregarListones();
        return;
      }
      
      if (!esParihuelas) {
        // Para otros tipos: siempre ÚNICO
        if (btnAgregar) btnAgregar.style.display = 'none';
        if (infoRumas) infoRumas.style.display = 'none';
        // Eliminar bloques adicionales si existen
        var bloques = document.querySelectorAll('.producto-bloque');
        bloques.forEach(function(bloque, idx){
          if (idx > 0) bloque.remove();
        });
        return;
      }
      
      // Para PARIHUELAS: depende de la cantidad de rumas del primer bloque
      var primerBloque = document.querySelector('.producto-bloque[data-index="0"]');
      if (!primerBloque) return;
      
      var inputRumas = primerBloque.querySelector('.cantidad-rumas');
      var cantidadRumas = parseInt(inputRumas ? inputRumas.value : 0, 10) || 0;
      
      if (cantidadRumas === 8) {
        // Si ya puso 8 rumas en el primer producto → ÚNICO
        if (btnAgregar) btnAgregar.style.display = 'none';
        if (infoRumas) infoRumas.style.display = 'block';
        // Eliminar bloques adicionales si existen
        var bloques = document.querySelectorAll('.producto-bloque');
        bloques.forEach(function(bloque, idx){
          if (idx > 0) bloque.remove();
        });
      } else if (cantidadRumas > 0 && cantidadRumas < 8) {
        // Si puso menos de 8 → MIXTO (permitir agregar más)
        if (btnAgregar) btnAgregar.style.display = 'block';
        if (infoRumas) infoRumas.style.display = 'block';
      } else {
        // Si no ha puesto cantidad aún, ocultar botón agregar por ahora
        if (btnAgregar) btnAgregar.style.display = 'none';
        if (infoRumas) infoRumas.style.display = 'block';
      }
      
      actualizarContadorRumas();
      actualizarEstadoBotones();
    }
    
    function actualizarInterfazSegunTipo(){
      // Deprecated - ahora usamos evaluarModoTratamiento()
      evaluarModoTratamiento();
    }

    // Botón agregar producto
    document.addEventListener('DOMContentLoaded', function(){
      var btnAgregar = document.getElementById('btnAgregarProducto');
      if (btnAgregar) {
        btnAgregar.addEventListener('click', function(){
          agregarBloqueProducto();
        });
      }
    });

    function agregarBloqueProducto(){
      // Validar límite de rumas solo para parihuelas
      if (esParihuelas) {
        var totalRumas = calcularRumasTotales();
        if (totalRumas >= 8) {
          showMessage('Ya se alcanzó el máximo de 8 rumas.', 'error');
          return null;
        }
      }
      
      bloqueIndex++;
      var container = document.getElementById('productosContainer');
      if (!container) return null;
      
      var nuevoBloque = document.createElement('div');
      nuevoBloque.className = 'producto-bloque';
      nuevoBloque.dataset.index = bloqueIndex;
      nuevoBloque.innerHTML = `
        <div class="bloque-header">
          <strong>Producto #<span class="bloque-numero">${bloqueIndex + 1}</span></strong>
        </div>
        
        <input type="hidden" class="producto-id" name="productos[${bloqueIndex}][id]" value="">
        <input type="hidden" class="producto-codigo" name="productos[${bloqueIndex}][codigo]" value="">
        <input type="hidden" class="producto-especie" name="productos[${bloqueIndex}][especie]" value="">
        <input type="hidden" class="producto-descripcion" name="productos[${bloqueIndex}][descripcion]" value="">
        <input type="hidden" class="m3-por-unidad" name="productos[${bloqueIndex}][m3_unidad]" value="0">
        <input type="hidden" class="pallets-escaneados" name="productos[${bloqueIndex}][pallets_escaneados]" value="[]">
        
        <div class="form-group campo-codigo-busqueda">
          <label>Código</label>
          <input type="text" class="codigo-input" data-index="${bloqueIndex}" autocomplete="off" required>
          <div class="suggestions-box" style="display:none;"></div>
        </div>
        
        <div class="form-group campo-producto" style="display:none;">
          <label>Producto a Tratar</label>
          <input type="text" class="producto-input" data-index="${bloqueIndex}" autocomplete="off" readonly style="background:#efefef;color:#333;">
        </div>

        <div class="form-group campos-parihuelas" style="display:none;">
          <label>Cantidad en Rumas</label>
          <input type="number" class="cantidad-rumas" name="productos[${bloqueIndex}][cantidad_rumas]" step="1" min="1" max="8" value="1" style="display:none;">
        </div>

        <div class="form-group campos-parihuelas" style="display:none;">
          <label>Cantidad en Unidades</label>
          <input type="number" class="cantidad-unidades" name="productos[${bloqueIndex}][cantidad_unidades]" step="1" min="0">
        </div>
        
        <div class="form-group campos-listones" style="display:none;">
          <label>Stock (Unidades)</label>
          <input type="text" class="campo-stock-unidades" name="productos[${bloqueIndex}][stock_unidades]" readonly style="background:#efefef;color:#333;">
        </div>
        
        <div class="form-group campos-listones" style="display:none;">
          <label>Stock (Pallets)</label>
          <input type="text" class="campo-stock-pallets" name="productos[${bloqueIndex}][stock_pallets]" readonly style="background:#efefef;color:#333;">
        </div>
        
        <div class="form-group campos-listones" style="display:none;">
          <label>Observación Producto</label>
          <textarea class="campo-observacion-producto" name="productos[${bloqueIndex}][observacion_producto]" readonly rows="2" style="background:#efefef;color:#333;padding:8px;border:1px solid #ccc;border-radius:4px;font-size:1rem;resize:none;"></textarea>
        </div>
        
        <div class="form-group campos-listones" style="display:none;">
          <label>Unidades</label>
          <input type="number" class="campo-cantidad-por-pallet" name="productos[${bloqueIndex}][cantidad_por_pallet]" step="1" min="1">
        </div>
        
        <button type="button" class="btn-eliminar-bloque" style="background:#f44336;color:#fff;padding:6px 10px;border-radius:4px;margin-top:8px;">Eliminar producto</button>
      `;
      
      container.appendChild(nuevoBloque);
      
      // Aplicar transformación según tipo detectado
      if (esListones) {
        transformarBloque(bloqueIndex, 'LISTONES');
      } else if (esParihuelas) {
        transformarBloque(bloqueIndex, 'PARIHUELAS');
      }
      
      // Inicializar autocompletado para el nuevo bloque
      inicializarAutocomplete(bloqueIndex);
      
      // Botón de cámara YA NO SE USA - solo el botón flotante
      // La lógica del botón flotante detecta automáticamente dónde escanear
      
      // Evento eliminar
      var btnEliminar = nuevoBloque.querySelector('.btn-eliminar-bloque');
      if (btnEliminar) {
        btnEliminar.addEventListener('click', function(){
          nuevoBloque.remove();
          renumerarBloques();
          actualizarContadorRumas();
          actualizarEstadoBotones();
          
          // Recalcular m³ si es LISTONES
          if (esListones) {
            actualizarContadorM3();
            actualizarEstadoBotonAgregarListones();
          }
        });
      }
      
      actualizarContadorRumas();
      actualizarEstadoBotones();
      
      return bloqueIndex; // Retornar el índice del nuevo bloque creado
    }

    function renumerarBloques(){
      var bloques = document.querySelectorAll('.producto-bloque');
      bloques.forEach(function(bloque, idx){
        var numero = bloque.querySelector('.bloque-numero');
        if (numero) numero.textContent = idx + 1;
      });
    }

    function calcularRumasTotales(){
      var total = 0;
      var bloques = document.querySelectorAll('.producto-bloque');
      bloques.forEach(function(bloque){
        var inputDescripcion = bloque.querySelector('.producto-input');
        var inputRumas = bloque.querySelector('.cantidad-rumas');
        
        // Solo contar si el bloque tiene un producto seleccionado
        if (inputDescripcion && inputDescripcion.value && inputRumas) {
          var val = parseInt(inputRumas.value, 10) || 0;
          total += val;
        }
      });
      return total;
    }

    function actualizarContadorRumas(){
      var total = calcularRumasTotales();
      var span = document.getElementById('rumasTotales');
      if (span) span.textContent = total;
      
      var infoRumas = document.getElementById('infoRumas');
      if (infoRumas) {
        if (total > 8) {
          infoRumas.style.background = '#ffebee';
          infoRumas.style.borderColor = '#f44336';
        } else {
          infoRumas.style.background = '#e3f2fd';
          infoRumas.style.borderColor = '#2196f3';
        }
      }
    }

    function actualizarEstadoBotones(){
      var totalRumas = calcularRumasTotales();
      var btnAgregar = document.getElementById('btnAgregarProducto');
      if (btnAgregar && esParihuelas) {
        if (totalRumas >= 8) {
          btnAgregar.disabled = true;
          btnAgregar.style.opacity = '0.5';
          btnAgregar.style.cursor = 'not-allowed';
        } else {
          btnAgregar.disabled = false;
          btnAgregar.style.opacity = '1';
          btnAgregar.style.cursor = 'pointer';
        }
      }
    }

    // ============================================
    // PREVIEW DE LOTE
    // ============================================
    function actualizarPreviewLote(especie){
      var inputLote = document.getElementById('lote');
      if (!inputLote || !especie) return;
      
      inputLote.value = 'Cargando...';
      
      fetch('api/api_preview_lote.php?especie=' + encodeURIComponent(especie))
        .then(function(res){ return res.json(); })
        .then(function(data){
          if (data && data.success && data.lote) {
            inputLote.value = data.lote;
          } else {
            inputLote.value = 'Error: ' + (data.mensaje || 'No disponible');
          }
        })
        .catch(function(err){
          console.warn('Error obteniendo preview de lote:', err);
          inputLote.value = 'Se generará automáticamente';
        });
    }

    // Panel button
    (function(){
      var p = document.getElementById('btnPanel');
      if (!p) return;
      p.addEventListener('click', function(){ window.location.href = '../../public/panel.html'; });
    })();

    // Cerrar sesión (botón en formulario)
    (function(){
      var b = document.getElementById('btnCerrarSesion');
      if (!b) return;
      b.addEventListener('click', function(){
        try { localStorage.removeItem('nombreUsuario'); } catch(e) {}
        var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
        window.location.href = baseUrl + '/public/index.html';
      });
    })();
  </script>
</body>
</html>
