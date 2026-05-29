<?php
// consultas.php - Módulo de Trazabilidad con escaneo QR
session_start();
require_once __DIR__ . '/../../shared/conexion.php';

// Verificar sesión
$usuarioNombre = '';
if (isset($_SESSION['usuarionombre']) && strlen(trim($_SESSION['usuarionombre']))) {
  $usuarioNombre = $_SESSION['usuarionombre'];
} elseif (isset($_SESSION['usuario']) && strlen(trim($_SESSION['usuario']))) {
  $usuarioNombre = $_SESSION['usuario'];
}

if (trim($usuarioNombre) === '') {
  header('Location: ../../public/index.html?error=' . urlencode('Debe iniciar sesión.'));
  exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Trazabilidad - Consultas</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Biblioteca jsQR para escaneo de códigos QR -->
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      min-height: 100vh; 
      padding: 20px; 
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      overflow: hidden;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #1fa9a0 0%, #17857e 100%);
      padding: 30px;
      color: #fff;
      position: relative;
    }
    
    .header h1 {
      font-size: 2rem;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .header p {
      opacity: 0.95;
      font-size: 1rem;
    }
    
    .user-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    /* Content Area */
    .content {
      padding: 40px 30px;
    }
    
    /* Botón Escanear */
    .scan-button-container {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .btn-scan {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      padding: 18px 50px;
      font-size: 1.2rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }
    
    .btn-scan:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
    
    .btn-scan:active {
      transform: translateY(0);
    }
    
    .btn-scan svg {
      width: 24px;
      height: 24px;
    }
    
    /* Área de resultados */
    .results-area {
      display: none;
      animation: fadeIn 0.5s ease;
    }
    
    .results-area.visible {
      display: block;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .results-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 24px;
      border-left: 4px solid #1fa9a0;
    }
    
    .results-card h2 {
      color: #1fa9a0;
      font-size: 1.4rem;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    
    .data-item {
      background: #fff;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .data-item label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      font-weight: 600;
    }
    
    .data-item .value {
      font-size: 1.1rem;
      color: #333;
      font-weight: 500;
      word-break: break-word;
    }
    
    /* QR Scanner Modal */
    .qr-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 9999;
      justify-content: center;
      align-items: center;
    }
    
    .qr-modal.active {
      display: flex;
    }
    
    .qr-modal-content {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      max-width: 600px;
      width: 90%;
      position: relative;
    }
    
    .qr-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .qr-modal-header h3 {
      color: #333;
      font-size: 1.3rem;
    }
    
    .btn-close {
      background: #e74c3c;
      color: #fff;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    
    .btn-close:hover {
      background: #c0392b;
    }
    
    .video-container {
      position: relative;
      width: 100%;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
    }
    
    #qrVideo {
      width: 100%;
      height: auto;
      display: block;
    }
    
    #canvasQR {
      display: none;
    }
    
    .scanner-status {
      text-align: center;
      padding: 12px;
      margin-top: 16px;
      border-radius: 8px;
      font-weight: 600;
    }
    
    .scanner-status.scanning {
      background: #fff3cd;
      color: #856404;
    }
    
    .scanner-status.success {
      background: #d4edda;
      color: #155724;
    }
    
    .scanner-status.error {
      background: #f8d7da;
      color: #721c24;
    }
    
    /* Botones de navegación */
    .nav-buttons {
      margin-top: 30px;
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-nav {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-panel {
      background: #6c757d;
      color: #fff;
    }
    
    .btn-panel:hover {
      background: #5a6268;
    }
    
    .btn-logout {
      background: #e74c3c;
      color: #fff;
    }
    
    .btn-logout:hover {
      background: #c0392b;
    }
    
    /* === TOGGLE REGISTRO MANUAL === */
    .toggle-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding: 12px 20px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #1fa9a0;
    }
    
    .toggle-container label {
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
      cursor: pointer;
      user-select: none;
    }
    
    .toggle-switch {
      position: relative;
      width: 48px;
      height: 26px;
      flex-shrink: 0;
    }
    
    .toggle-switch input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 2;
      margin: 0;
      top: 0;
      left: 0;
    }
    
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #ccc;
      border-radius: 26px;
      transition: 0.3s;
    }
    
    .toggle-slider::before {
      content: '';
      position: absolute;
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: #fff;
      border-radius: 50%;
      transition: 0.3s;
    }
    
    .toggle-switch input:checked + .toggle-slider {
      background: #1fa9a0;
    }
    
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(22px);
    }
    
    /* === CAMPOS MANUALES (modo registro manual) === */
    .manual-fields {
      display: none;
      animation: fadeIn 0.3s ease;
      margin-bottom: 30px;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 24px;
      border-left: 4px solid #ff9800;
    }
    
    .manual-fields.visible {
      display: block;
    }
    
    .manual-fields h3 {
      color: #ff9800;
      font-size: 1.1rem;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .manual-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    
    .manual-group {
      display: flex;
      flex-direction: column;
    }
    
    .manual-group label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      font-weight: 600;
    }
    
    .manual-group input[type="text"],
    .manual-group input[type="number"] {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      color: #333;
      background: #fff;
      transition: border-color 0.2s;
      outline: none;
      font-family: inherit;
      box-sizing: border-box;
    }
    
    .manual-group input[type="text"]:focus,
    .manual-group input[type="number"]:focus {
      border-color: #ff9800;
    }
    
    .manual-group input[readonly] {
      background: #f5f7fa;
      border-color: #d0d5dd;
      cursor: default;
    }
    
    /* Combobox personalizado para campos manuales */
    .cs-wrap {
      position: relative;
      width: 100%;
    }
    
    .cs-wrap .cs-input {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      color: #333;
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 14px center;
      transition: border-color 0.2s;
      outline: none;
      font-family: inherit;
      cursor: pointer;
      box-sizing: border-box;
    }
    
    .cs-wrap .cs-input:focus {
      border-color: #ff9800;
    }
    
    .cs-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      z-index: 100;
    }
    
    .cs-wrap.open .cs-dropdown {
      display: block;
    }
    
    .cs-option {
      padding: 10px 14px;
      cursor: pointer;
      font-size: 0.95rem;
      color: #333;
      transition: background 0.15s;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .cs-option:last-child {
      border-bottom: none;
    }
    
    .cs-option:hover {
      background: #fff3e0;
      color: #e65100;
    }
    
    .cs-option.no-results {
      color: #999;
      font-style: italic;
      cursor: default;
    }
    
    .cs-option.no-results:hover {
      background: transparent;
      color: #999;
    }
    
    /* === FILTROS: Fecha y Máquina === */
    .filtros-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 24px;
      border-left: 4px solid #1fa9a0;
    }
    
    .filtro-group {
      flex: 1 1 200px;
      min-width: 180px;
    }
    
    .filtro-group label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      font-weight: 600;
    }
    
    .filtro-group input[type="date"] {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      color: #333;
      background: #fff;
      transition: border-color 0.2s;
      outline: none;
      font-family: inherit;
    }
    
    .filtro-group input[type="date"]:focus {
      border-color: #1fa9a0;
    }
    
    /* Select personalizado con búsqueda */
    .select-wrapper {
      position: relative;
      width: 100%;
    }
    
    .select-wrapper input[type="text"] {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      color: #333;
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 14px center;
      transition: border-color 0.2s;
      outline: none;
      font-family: inherit;
      cursor: pointer;
      box-sizing: border-box;
    }
    
    .select-wrapper input[type="text"]:focus {
      border-color: #1fa9a0;
    }
    
    .select-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      z-index: 100;
    }
    
    .select-dropdown.open {
      display: block;
    }
    
    .select-dropdown .option-item {
      padding: 10px 14px;
      cursor: pointer;
      font-size: 0.95rem;
      color: #333;
      transition: background 0.15s;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .select-dropdown .option-item:last-child {
      border-bottom: none;
    }
    
    .select-dropdown .option-item:hover {
      background: #e0fcf8;
      color: #1fa9a0;
    }
    
    .select-dropdown .option-item.selected {
      background: #1fa9a0;
      color: #fff;
    }
    
    .select-dropdown .option-item.no-results {
      color: #999;
      font-style: italic;
      cursor: default;
    }
    
    .select-dropdown .option-item.no-results:hover {
      background: transparent;
      color: #999;
    }
    
    /* Input deshabilitado para Nuevo Lote - mismo diseño que los demás */
    .filtro-group input[readonly] {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #d0d5dd;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 700;
      color: #1fa9a0;
      letter-spacing: 0.5px;
      background: #f5f7fa;
      transition: border-color 0.2s;
      outline: none;
      font-family: inherit;
      cursor: default;
      box-sizing: border-box;
    }
    
    .filtro-group input[readonly]::placeholder {
      color: #aaa;
      font-weight: 400;
      font-size: 0.9rem;
      letter-spacing: 0;
    }
    
    /* === Botón Guardar === */
    .save-container {
      text-align: center;
      margin-top: 24px;
      margin-bottom: 8px;
    }
    
    .btn-save {
      background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
      color: #fff;
      border: none;
      padding: 14px 48px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    
    .btn-save:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.6);
    }
    
    .btn-save:active {
      transform: translateY(0);
    }
    
    .btn-save:disabled {
      background: #aaa;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    
    /* === Toast / Notificación flotante === */
    .toast-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      z-index: 99999;
      justify-content: center;
      align-items: center;
    }
    
    .toast-modal.active {
      display: flex;
    }
    
    .toast-content {
      background: #fff;
      border-radius: 16px;
      padding: 40px 48px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      animation: toastIn 0.3s ease;
      max-width: 400px;
      width: 90%;
    }
    
    @keyframes toastIn {
      from { opacity: 0; transform: scale(0.8) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    
    .toast-icon {
      color: #28a745;
      margin-bottom: 16px;
    }
    
    .toast-message {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      body { padding: 10px; }
      .header { padding: 20px; }
      .header h1 { font-size: 1.5rem; }
      .user-badge {
        position: static;
        display: block;
        margin-top: 12px;
        text-align: center;
      }
      .content { padding: 20px 16px; }
      .filtros-container {
        padding: 16px;
        gap: 14px;
      }
      .filtro-group {
        flex: 1 1 100%;
        min-width: 0;
      }
      .btn-scan {
        padding: 14px 30px;
        font-size: 1rem;
      }
      .data-grid {
        grid-template-columns: 1fr;
      }
      .manual-grid {
        grid-template-columns: 1fr;
      }
      .manual-fields {
        padding: 16px;
      }
      .toggle-container {
        padding: 10px 16px;
      }
    }
    @media (max-width: 1024px) and (min-width: 769px) {
      .filtros-container {
        padding: 20px;
      }
      .filtro-group {
        flex: 1 1 45%;
      }
      .manual-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Sistema de Trazabilidad</h1>
      <p>Consulta de información mediante códigos QR</p>
      <div class="user-badge"><?= htmlspecialchars($usuarioNombre) ?></div>
    </div>
    
    <!-- Content -->
    <div class="content">
      <!-- Toggle Registro Manual -->
      <div class="toggle-container">
        <div class="toggle-switch">
          <input type="checkbox" id="toggleManual">
          <span class="toggle-slider"></span>
        </div>
        <label for="toggleManual">Registro Manual</label>
      </div>
      
      <!-- Filtros: Fecha y Máquina -->
      <div class="filtros-container">
        <div class="filtro-group">
          <label for="filtroFecha">Fecha</label>
          <input type="date" id="filtroFecha">
        </div>
        <div class="filtro-group">
          <label for="filtroMaquina">Máquina</label>
          <div class="select-wrapper">
            <input type="text" id="filtroMaquina" placeholder="Seleccione o escriba..." autocomplete="off">
            <div class="select-dropdown" id="maquinaDropdown"></div>
          </div>
        </div>
        <div class="filtro-group">
          <label for="nuevoLote">Nuevo Lote</label>
          <input type="text" id="nuevoLote" readonly disabled placeholder="Seleccione máquina y fecha">
        </div>
      </div>
      
      <!-- Botón de escanear -->
      <div class="scan-button-container">
        <button class="btn-scan" id="btnEscanear">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Escanear Código QR
        </button>
      </div>
      
      <!-- Área de resultados -->
      <div class="results-area" id="resultsArea">
        <div class="results-card">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Datos Escaneados
          </h2>
          <div class="data-grid" id="dataGrid">
            <!-- Los datos se insertarán aquí dinámicamente -->
          </div>
        </div>
      </div>
      
      <!-- Campos Manuales (modo registro manual) -->
      <div class="manual-fields" id="manualFields">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Registro Manual
        </h3>
        <div class="manual-grid">
          <!-- Descripción (combobox) -->
          <div class="manual-group">
            <label for="manualDescripcion">Descripción</label>
            <div class="cs-wrap" id="wrapDescripcion">
              <input type="text" class="cs-input" id="manualDescripcion" placeholder="Buscar descripción..." autocomplete="off">
              <div class="cs-dropdown" id="dropDescripcion"></div>
              <input type="hidden" id="hiddenDescripcion" value="">
            </div>
          </div>
          <!-- Código de Producto (auto desde descripción) -->
          <div class="manual-group">
            <label for="manualCodigoProducto">Código de Producto</label>
            <input type="text" id="manualCodigoProducto" readonly placeholder="Se auto-completa">
          </div>
          <!-- Lote -->
          <div class="manual-group">
            <label for="manualLote">Lote</label>
            <input type="text" id="manualLote" placeholder="Ingrese lote" style="text-transform:uppercase;" oninput="this.value=this.value.toUpperCase()">
          </div>
          <!-- Máquina (mismo combo que el existente) -->
          <div class="manual-group">
            <label for="manualMaquina">Máquina</label>
            <div class="cs-wrap" id="wrapMaquina">
              <input type="text" class="cs-input" id="manualMaquina" placeholder="Seleccione máquina..." autocomplete="off">
              <div class="cs-dropdown" id="dropMaquina"></div>
              <input type="hidden" id="hiddenMaquina" value="">
            </div>
          </div>
          <!-- Cantidad -->
          <div class="manual-group">
            <label for="manualCantidad">Cantidad</label>
            <input type="number" id="manualCantidad" placeholder="0" min="0" step="any">
          </div>
          <!-- Movimiento -->
          <div class="manual-group">
            <label for="manualMovimiento">Movimiento</label>
            <div class="cs-wrap" id="wrapMovimiento">
              <input type="text" class="cs-input" id="manualMovimiento" placeholder="Seleccione movimiento..." autocomplete="off">
              <div class="cs-dropdown" id="dropMovimiento"></div>
              <input type="hidden" id="hiddenMovimiento" value="">
            </div>
          </div>
          <!-- Observación -->
          <div class="manual-group">
            <label for="manualObservacion">Observación</label>
            <input type="text" id="manualObservacion" placeholder="INGRESE OBSERVACIÓN (OPCIONAL)" style="text-transform:uppercase;" oninput="this.value=this.value.toUpperCase()">
          </div>
        </div>
      </div>
      
      <!-- Botón Guardar (visible solo cuando hay datos escaneados o modo manual) -->
      <div class="save-container" id="saveContainer" style="display:none;">
        <button class="btn-save" id="btnGuardar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Guardar
        </button>
      </div>
      
      <!-- Botones de navegación -->
      <div class="nav-buttons">
        <button class="btn-nav btn-panel" onclick="window.location.href='../../public/panel.html'">
          Volver al Panel
        </button>
      </div>
    </div>
  </div>
  
  <!-- Modal de mensaje (notificación flotante) -->
  <div class="toast-modal" id="toastModal">
    <div class="toast-content">
      <div class="toast-icon" id="toastIcon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      </div>
      <div class="toast-message" id="toastMessage">Guardado correctamente</div>
    </div>
  </div>
  
  <!-- Modal de escaneo QR -->
  <div class="qr-modal" id="qrScannerModal">
    <div class="qr-modal-content">
      <div class="qr-modal-header">
        <h3>Escanear Código QR</h3>
        <button class="btn-close" id="btnCerrarScanner">×</button>
      </div>
      <div class="video-container">
        <video id="qrVideo" playsinline></video>
        <canvas id="canvasQR"></canvas>
      </div>
      <div class="scanner-status scanning" id="scannerStatus">
        Apunte la cámara hacia el código QR
      </div>
    </div>
  </div>
  
  <script>
    console.log('Script de trazabilidad iniciando...');
    
    // Variables globales para el escáner
    var qrStream = null;
    var qrAnimationFrame = null;
    
    // Elementos del DOM
    var btnEscanear = document.getElementById('btnEscanear');
    var modal = document.getElementById('qrScannerModal');
    var btnCerrar = document.getElementById('btnCerrarScanner');
    var video = document.getElementById('qrVideo');
    var canvas = document.getElementById('canvasQR');
    var status = document.getElementById('scannerStatus');
    var resultsArea = document.getElementById('resultsArea');
    var dataGrid = document.getElementById('dataGrid');
    var saveContainer = document.getElementById('saveContainer');
    var btnGuardar = document.getElementById('btnGuardar');
    var toastModal = document.getElementById('toastModal');
    var toastMessage = document.getElementById('toastMessage');
    
    // Variables para guardar
    var ultimosDatosParseados = null;  // {codigo_producto, descripcion, lote, maquina_origen, cantidad, movimiento}
    var ultimoConcatenado = '';        // String original del QR
    
    // ===== MODO REGISTRO MANUAL =====
    var toggleManual = document.getElementById('toggleManual');
    var manualFields = document.getElementById('manualFields');
    var scanButtonContainer = document.querySelector('.scan-button-container');
    
    console.log('toggleManual:', toggleManual);
    console.log('manualFields:', manualFields);
    console.log('scanButtonContainer:', scanButtonContainer);
    
    // Elementos de campos manuales
    var manualDescripcion = document.getElementById('manualDescripcion');
    var manualCodigoProducto = document.getElementById('manualCodigoProducto');
    var manualLote = document.getElementById('manualLote');
    var manualMaquina = document.getElementById('manualMaquina');
    var manualCantidad = document.getElementById('manualCantidad');
    var manualMovimiento = document.getElementById('manualMovimiento');
    
    // Lista de productos para el combobox de descripción
    var productosList = [];
    
    // Función global para el toggle (llamada desde onchange en HTML como respaldo)
    window.toggleModoManual = function(el) {
      try {
        console.log('toggleModoManual llamado, checked:', el.checked);
        if (el.checked) {
          if (manualFields) {
            manualFields.classList.add('visible');
            manualFields.style.display = 'block';
          }
          if (scanButtonContainer) scanButtonContainer.style.display = 'none';
          if (resultsArea) {
            resultsArea.style.display = 'none';
            resultsArea.classList.remove('visible');
          }
          if (dataGrid) dataGrid.innerHTML = '';
          ultimosDatosParseados = null;
          ultimoConcatenado = '';
          if (saveContainer) saveContainer.style.display = 'block';
        } else {
          if (manualFields) {
            manualFields.classList.remove('visible');
            manualFields.style.display = '';
          }
          if (scanButtonContainer) scanButtonContainer.style.display = '';
          limpiarCamposManuales();
          if (!ultimosDatosParseados && saveContainer) {
            saveContainer.style.display = 'none';
          }
        }
      } catch(e) {
        console.error('Error en toggleModoManual:', e);
      }
    };

    // Toggle: mostrar/ocultar campos manuales (event listener adicional)
    if (toggleManual) {
      toggleManual.addEventListener('change', function() {
        window.toggleModoManual(this);
      });
      console.log('Event listener del toggle registrado correctamente');
    } else {
      console.error('ERROR: toggleManual es NULL - el elemento #toggleManual no existe en el DOM');
    }
    
    function limpiarCamposManuales() {
      if (manualDescripcion) manualDescripcion.value = '';
      var hd = document.getElementById('hiddenDescripcion');
      if (hd) hd.value = '';
      if (manualCodigoProducto) manualCodigoProducto.value = '';
      if (manualLote) manualLote.value = '';
      if (manualMaquina) manualMaquina.value = '';
      var hm = document.getElementById('hiddenMaquina');
      if (hm) hm.value = '';
      if (manualCantidad) manualCantidad.value = '';
      if (manualMovimiento) manualMovimiento.value = '';
      var hmo = document.getElementById('hiddenMovimiento');
      if (hmo) hmo.value = '';
      var obs = document.getElementById('manualObservacion');
      if (obs) obs.value = '';
    }
    
    // ── buildCombobox: Combobox buscable ────────────────────────────────
    function buildCombobox(wrapId, inputId, dropId, hiddenId, items, onSelect) {
      var wrap   = document.getElementById(wrapId);
      var input  = document.getElementById(inputId);
      var drop   = document.getElementById(dropId);
      var hidden = document.getElementById(hiddenId);
      
      if (!wrap || !input || !drop || !hidden) {
        console.error('buildCombobox: elementos no encontrados', wrapId, inputId, dropId, hiddenId);
        return;
      }
      if (!items || !items.length) {
        console.warn('buildCombobox: sin items para', wrapId);
        return;
      }
    
      function escHtml(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
      }
    
      function renderOptions(filter) {
        drop.innerHTML = '';
        var q = (filter || '').toLowerCase();
        var matches = items.filter(function (it) {
          return it.label.toLowerCase().indexOf(q) !== -1;
        });
        if (!matches.length) {
          var div = document.createElement('div');
          div.className = 'cs-option no-results';
          div.textContent = 'Sin coincidencias';
          drop.appendChild(div);
          return;
        }
        matches.forEach(function (it) {
          var div = document.createElement('div');
          div.className = 'cs-option';
          if (q) {
            var idx = it.label.toLowerCase().indexOf(q);
            div.innerHTML =
              escHtml(it.label.slice(0, idx)) +
              '<strong>' + escHtml(it.label.slice(idx, idx + q.length)) + '</strong>' +
              escHtml(it.label.slice(idx + q.length));
          } else {
            div.textContent = it.label;
          }
          div.dataset.val   = it.id;
          div.dataset.label = it.label;
          div.addEventListener('mousedown', function (e) {
            e.preventDefault();
            selectOption(it.id, it.label);
          });
          drop.appendChild(div);
        });
      }
    
      function selectOption(val, label) {
        input.value  = label;
        hidden.value = val;
        wrap.classList.remove('open');
        input.dataset.selected = '1';
        if (typeof onSelect === 'function') onSelect(val, label);
      }
    
      function openDrop() {
        renderOptions(input.value);
        wrap.classList.add('open');
      }
    
      function closeDrop() {
        wrap.classList.remove('open');
        if (!hidden.value) {
          input.value = '';
        } else {
          var match = items.find(function (it) { return String(it.id) === String(hidden.value); });
          if (!match || match.label !== input.value) {
            input.value  = '';
            hidden.value = '';
            if (typeof onSelect === 'function') onSelect('', '');
          }
        }
      }
    
      input.addEventListener('focus', function () { openDrop(); });
      input.addEventListener('input', function () {
        var pos = this.selectionStart;
        this.value = this.value.toUpperCase();
        try { this.setSelectionRange(pos, pos); } catch(e){}
        hidden.value = '';
        input.dataset.selected = '';
        renderOptions(input.value);
        wrap.classList.add('open');
      });
      input.addEventListener('blur', function () {
        setTimeout(function () { closeDrop(); }, 150);
      });
    }
    
    // ── Cargar productos desde API ─────────────────────────────────────
    function cargarProductos() {
      try {
        fetch('api/obtener_productos.php')
          .then(function(res) {
            if (!res.ok) {
              console.error('HTTP error al cargar productos:', res.status);
              return { success: false, error: 'HTTP ' + res.status };
            }
            return res.json();
          })
          .then(function(resp) {
            if (resp && resp.success && resp.data) {
              // Transformar a formato {id, label} para el combobox
              productosList = resp.data.map(function(p) {
                return { id: p.id, label: p.label, codigo: p.codigo, nombre: p.nombre };
              });
              console.log('Productos cargados:', productosList.length);
              
              // Inicializar combobox de descripción
              try {
                buildCombobox('wrapDescripcion', 'manualDescripcion', 'dropDescripcion', 'hiddenDescripcion', productosList, function(val, label) {
                  // Al seleccionar una descripción, auto-completar código de producto
                  var prod = productosList.find(function(p) { return String(p.id) === String(val); });
                  if (prod && manualCodigoProducto) {
                    manualCodigoProducto.value = prod.codigo || '';
                  } else if (manualCodigoProducto) {
                    manualCodigoProducto.value = '';
                  }
                });
              } catch(e) {
                console.error('Error al inicializar combobox de descripción:', e);
              }
            } else {
              console.error('Error al cargar productos:', (resp && resp.error) || 'Respuesta inválida');
            }
          })
          .catch(function(err) {
            console.error('Error al cargar productos:', err);
          });
      } catch(e) {
        console.error('Error en cargarProductos:', e);
      }
    }
    cargarProductos();
    
    // ── Inicializar combobox de máquina manual ─────────────────────────
    // Se llena cuando se carguen las máquinas (después de cargarMaquinas)
    function inicializarCombosManuales() {
      try {
        if (maquinasList && maquinasList.length > 0) {
          var itemsMaquinas = maquinasList.map(function(m) {
            return { id: m.id, label: m.descripcion, codmaquina: m.codmaquina };
          });
          buildCombobox('wrapMaquina', 'manualMaquina', 'dropMaquina', 'hiddenMaquina', itemsMaquinas);
        }
      } catch(e) {
        console.error('Error en inicializarCombosManuales:', e);
      }
    }
    
    // ── Cargar movimientos desde la API ───────────────────────────────
    function cargarMovimientos() {
      try {
        fetch('api/obtener_movimientos.php')
          .then(function(r) { return r.json(); })
          .then(function(resp) {
            if (resp.success && resp.data && resp.data.length > 0) {
              var items = resp.data.map(function(m) {
                return { id: m.nombre, label: m.label };
              });
              buildCombobox('wrapMovimiento', 'manualMovimiento', 'dropMovimiento', 'hiddenMovimiento', items);
            } else {
              // Fallback: si no hay datos, usar valor por defecto
              buildCombobox('wrapMovimiento', 'manualMovimiento', 'dropMovimiento', 'hiddenMovimiento', [
                { id: 'INGRESO INTERNO', label: 'INGRESO INTERNO' }
              ]);
            }
          })
          .catch(function(err) {
            console.error('Error al cargar movimientos:', err);
            // Fallback
            buildCombobox('wrapMovimiento', 'manualMovimiento', 'dropMovimiento', 'hiddenMovimiento', [
              { id: 'INGRESO INTERNO', label: 'INGRESO INTERNO' }
            ]);
          });
      } catch(e) {
        console.error('Error en cargarMovimientos:', e);
      }
    }
    cargarMovimientos();
    
    // ===== FILTROS: Fecha y Máquina =====
    var filtroFecha = document.getElementById('filtroFecha');
    var filtroMaquina = document.getElementById('filtroMaquina');
    var maquinaDropdown = document.getElementById('maquinaDropdown');
    
    var maquinasList = [];      // Lista completa {id, descripcion, codmaquina}
    var maquinaSeleccionada = null;  // {id, descripcion, codmaquina} o null
    
    // ===== NUEVO LOTE =====
    var nuevoLoteInput = document.getElementById('nuevoLote');
    var turnoActual = 'D';  // Default
    
    function generarNuevoLote() {
      if (!maquinaSeleccionada || !maquinaSeleccionada.codmaquina) {
        nuevoLoteInput.value = '';
        nuevoLoteInput.placeholder = 'Seleccione máquina y fecha';
        return;
      }
      
      var fecha = filtroFecha.value;
      if (!fecha) {
        nuevoLoteInput.value = '';
        nuevoLoteInput.placeholder = 'Seleccione una fecha';
        return;
      }
      
      // Extraer día, mes, año de la fecha (YYYY-MM-DD)
      var partes = fecha.split('-');
      var dd = partes[2];
      var mm = partes[1];
      var aa = partes[0].substring(2);  // últimos 2 dígitos del año
      
      var fechaStr = dd + mm + aa;  // ddmmaa
      var codMaq = maquinaSeleccionada.codmaquina;
      
      nuevoLoteInput.value = 'CAM' + fechaStr + codMaq + turnoActual;
    }
    
    // Cargar turno actual desde el API
    (function() {
      fetch('api/obtener_turno.php')
        .then(function(r) { return r.json(); })
        .then(function(resp) {
          if (resp.success) {
            turnoActual = resp.turno;
            generarNuevoLote();
          }
        })
        .catch(function(err) {
          console.error('Error al obtener turno:', err);
        });
    })();
    
    // Re-generar lote cuando cambie la fecha
    filtroFecha.addEventListener('change', generarNuevoLote);
    
    // Establecer fecha actual por defecto
    (function() {
      var hoy = new Date();
      var dd = String(hoy.getDate()).padStart(2, '0');
      var mm = String(hoy.getMonth() + 1).padStart(2, '0');
      var yyyy = hoy.getFullYear();
      filtroFecha.value = yyyy + '-' + mm + '-' + dd;
    })();
    
    // Cargar máquinas desde el API
    function cargarMaquinas() {
      fetch('api/obtener_maquinas.php')
        .then(function(res) { return res.json(); })
        .then(function(resp) {
          console.log('Respuesta API máquinas:', resp);
          if (resp.success && resp.data) {
            maquinasList = resp.data;
            console.log('Máquinas cargadas:', maquinasList.length);
            // Inicializar combobox de máquina manual
            inicializarCombosManuales();
          } else {
            console.error('Error del API:', resp.error || 'Respuesta inválida');
          }
        })
        .catch(function(err) {
          console.error('Error al cargar máquinas:', err);
        });
    }
    cargarMaquinas();
    
    // Abrir/cerrar dropdown
    filtroMaquina.addEventListener('focus', function() {
      renderizarDropdown(maquinasList, '');
      maquinaDropdown.classList.add('open');
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
      var wrapper = document.querySelector('.select-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        maquinaDropdown.classList.remove('open');
      }
    });
    
    // Filtrar mientras escribe
    filtroMaquina.addEventListener('input', function() {
      var texto = this.value.toLowerCase().trim();
      var filtradas;
      
      if (texto === '') {
        filtradas = maquinasList;
      } else {
        filtradas = maquinasList.filter(function(m) {
          return m.descripcion.toLowerCase().indexOf(texto) !== -1;
        });
      }
      
      renderizarDropdown(filtradas, texto);
      maquinaDropdown.classList.add('open');
    });
    
    function renderizarDropdown(lista, textoBusqueda) {
      maquinaDropdown.innerHTML = '';
      
      if (lista.length === 0) {
        var div = document.createElement('div');
        div.className = 'option-item no-results';
        div.textContent = textoBusqueda ? 'Sin resultados' : 'No hay máquinas disponibles';
        maquinaDropdown.appendChild(div);
        return;
      }
      
      lista.forEach(function(m) {
        var div = document.createElement('div');
        div.className = 'option-item';
        if (maquinaSeleccionada && maquinaSeleccionada.id === m.id) {
          div.classList.add('selected');
        }
        div.textContent = m.descripcion;
        div.dataset.id = m.id;
        div.dataset.descripcion = m.descripcion;
        div.dataset.codmaquina = m.codmaquina || '';
        
        div.addEventListener('click', function(e) {
          e.stopPropagation();
          seleccionarMaquina(m.id, m.descripcion, m.codmaquina || '');
          maquinaDropdown.classList.remove('open');
        });
        
        maquinaDropdown.appendChild(div);
      });
    }
    
    function seleccionarMaquina(id, descripcion, codmaquina) {
      maquinaSeleccionada = { id: id, descripcion: descripcion, codmaquina: codmaquina || '' };
      filtroMaquina.value = descripcion;
      
      // Actualizar clase selected en el dropdown
      var items = maquinaDropdown.querySelectorAll('.option-item');
      items.forEach(function(item) {
        if (item.dataset.id == id) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
      
      // Generar el nuevo lote
      generarNuevoLote();
    }
    
    // Abrir escáner
    btnEscanear.addEventListener('click', function() {
      abrirEscanerQR();
    });
    
    // Cerrar escáner
    btnCerrar.addEventListener('click', function() {
      cerrarEscanerQR();
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        cerrarEscanerQR();
      }
    });
    
    function abrirEscanerQR() {
      modal.classList.add('active');
      status.className = 'scanner-status scanning';
      status.textContent = 'Iniciando cámara...';
      
      // Solicitar acceso a la cámara
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Usar cámara trasera en móviles
      })
      .then(function(stream) {
        qrStream = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.play();
        
        status.className = 'scanner-status scanning';
        status.textContent = 'Apunte la cámara hacia el código QR';
        
        // Iniciar detección de QR
        requestAnimationFrame(escanearFrameQR);
      })
      .catch(function(err) {
        console.error('Error al acceder a la cámara:', err);
        modal.classList.remove('active');
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          alert('Permiso de cámara denegado. Permite el acceso a la cámara en la configuración.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          alert('No se encontró ninguna cámara en el dispositivo.');
        } else {
          alert('Error al acceder a la cámara: ' + err.message);
        }
      });
    }
    
    function escanearFrameQR() {
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
          
          // Detener el escaneo inmediatamente
          if (qrAnimationFrame) {
            cancelAnimationFrame(qrAnimationFrame);
            qrAnimationFrame = null;
          }
          
          // Procesar el código QR
          setTimeout(function() {
            procesarCodigoQR(code.data);
            cerrarEscanerQR();
          }, 500);
          
          return; // Detener el escaneo
        }
      }
      
      // Continuar escaneando
      qrAnimationFrame = requestAnimationFrame(escanearFrameQR);
    }
    
    function cerrarEscanerQR() {
      // Detener la animación
      if (qrAnimationFrame) {
        cancelAnimationFrame(qrAnimationFrame);
        qrAnimationFrame = null;
      }
      
      // Detener el stream de video
      if (qrStream) {
        qrStream.getTracks().forEach(function(track) {
          track.stop();
        });
        qrStream = null;
      }
      
      // Limpiar el video
      if (video) {
        video.srcObject = null;
      }
      
      // Cerrar modal
      modal.classList.remove('active');
      
      // Resetear status
      status.className = 'scanner-status scanning';
      status.textContent = 'Apunte la cámara hacia el código QR';
    }
    
    function procesarCodigoQR(codigoCompleto) {
      console.log('Código QR escaneado:', codigoCompleto);
      
      // Guardar el concatenado original
      ultimoConcatenado = codigoCompleto;
      
      // Parsear el código separando por $ y filtrando partes vacías
      var partes = codigoCompleto.split('$').filter(function(p) {
        return p.trim() !== '';
      });
      
      console.log('Partes detectadas:', partes.length, partes);
      
      var datos = {};
      ultimosDatosParseados = null;
      
      // Detectar tipo de etiqueta por cantidad de campos
      // Etiqueta 4 campos: LOTE$DESCRIPCION$CODIGO_PRODUCTO$CANTIDAD
      // Nueva etiqueta: 6 campos (CODIGO$DESC$LOTE$MAQUINA$CANTIDAD$MOVIMIENTO)
      // Antigua etiqueta: 9 campos (LOTE$FECHA$CODIGO$DESC$CANTIDAD$MAQUINA$...)
      var esEtiquetaAntigua = (partes.length >= 8);
      var esEtiqueta4Campos = (partes.length === 4);
      
      if (esEtiquetaAntigua) {
        // Formato antiguo:
        // 0: LOTE, 1: FECHA, 2: CODIGO PRODUCTO, 3: DESCRIPCION,
        // 4: CANTIDAD, 5: MAQUINA, 6-8: otros (ignorados)
        datos = {
          'Código de Producto': partes[2] || '-',
          'Descripción': partes[3] || '-',
          'Lote': partes[0] || '-',
          'Máquina': partes[5] || '-',
          'Cantidad': partes[4] || '-',
          'Movimiento': '-'
        };
        ultimosDatosParseados = {
          codigo_producto: partes[2] || '',
          descripcion: partes[3] || '',
          lote: partes[0] || '',
          maquina_origen: partes[5] || '',
          cantidad: partes[4] || '',
          movimiento: ''  // La etiqueta antigua no tiene movimiento
        };
      } else if (esEtiqueta4Campos) {
        // Formato 4 campos: LOTE$DESCRIPCION$CODIGO_PRODUCTO$CANTIDAD
        // 0: LOTE, 1: DESCRIPCION, 2: CODIGO PRODUCTO, 3: CANTIDAD
        datos = {
          'Código de Producto': partes[2] || '-',
          'Descripción': partes[1] || '-',
          'Lote': partes[0] || '-',
          'Máquina': '-',
          'Cantidad': partes[3] || '-',
          'Movimiento': '-'
        };
        ultimosDatosParseados = {
          codigo_producto: partes[2] || '',
          descripcion: partes[1] || '',
          lote: partes[0] || '',
          maquina_origen: '',
          cantidad: partes[3] || '',
          movimiento: ''  // Este formato tampoco tiene movimiento
        };
      } else if (partes.length >= 6) {
        // Formato nuevo: CODIGO DE PRODUCTO$DESCRIPCION$LOTE$MAQUINA$CANTIDAD$MOVIMIENTO
        datos = {
          'Código de Producto': partes[0] || '-',
          'Descripción': partes[1] || '-',
          'Lote': partes[2] || '-',
          'Máquina': partes[3] || '-',
          'Cantidad': partes[4] || '-',
          'Movimiento': partes[5] || '-'
        };
        ultimosDatosParseados = {
          codigo_producto: partes[0] || '',
          descripcion: partes[1] || '',
          lote: partes[2] || '',
          maquina_origen: partes[3] || '',
          cantidad: partes[4] || '',
          movimiento: partes[5] || ''
        };
      } else {
        // Formato no reconocido, mostrar datos raw
        datos = {
          'Datos Raw': codigoCompleto,
          'Partes Detectadas': partes.length + ' campos'
        };
      }
      
      // Mostrar los datos
      mostrarDatos(datos);
    }
    
    function mostrarDatos(datos) {
      // Limpiar grid anterior
      dataGrid.innerHTML = '';
      
      // Crear elementos para cada dato
      Object.keys(datos).forEach(function(key) {
        var item = document.createElement('div');
        item.className = 'data-item';
        
        var label = document.createElement('label');
        label.textContent = key;
        
        var value = document.createElement('div');
        value.className = 'value';
        value.textContent = datos[key];
        
        item.appendChild(label);
        item.appendChild(value);
        dataGrid.appendChild(item);
      });
      
      // Mostrar el área de resultados
      resultsArea.classList.add('visible');
      
      // Mostrar botón guardar solo si hay datos parseados (formato válido)
      if (ultimosDatosParseados) {
        saveContainer.style.display = 'block';
      } else {
        saveContainer.style.display = 'none';
      }
      
      // Scroll suave hacia los resultados
      setTimeout(function() {
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
    
    // ===== GUARDAR =====
    btnGuardar.addEventListener('click', function() {
      var esManual = toggleManual.checked;
      var fecha = filtroFecha.value;
      
      if (esManual) {
        // Modo manual: validar solo fecha
        if (!fecha) {
          mostrarToast('Seleccione una fecha.');
          return;
        }
        
        // Obtener datos de los campos manuales
        var codProducto = manualCodigoProducto.value;
        var descripcionVal = document.getElementById('hiddenDescripcion').value ?
          (productosList.find(function(p) { return String(p.id) === String(document.getElementById('hiddenDescripcion').value); }) || {}).nombre || manualDescripcion.value :
          manualDescripcion.value;
        var loteVal = manualLote.value;
        var maqDesc = document.getElementById('hiddenMaquina').value ?
          manualMaquina.value : '';
        var cantVal = manualCantidad.value;
        var movVal = document.getElementById('hiddenMovimiento').value || '';
        var obsVal = document.getElementById('manualObservacion') ? document.getElementById('manualObservacion').value : '';
        
        // Deshabilitar botón mientras se guarda
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'Guardando...';
        
        var payload = {
          nuevo_lote: nuevoLoteInput.value,
          fecha: fecha,
          maquina_descripcion: maquinaSeleccionada ? maquinaSeleccionada.descripcion : '',
          codigo_producto: codProducto,
          descripcion: descripcionVal,
          lote: loteVal,
          maquina_origen: maqDesc,
          cantidad: cantVal,
          movimiento: movVal,
          observacion: obsVal,
          concatenado: 'MANUAL'
        };
        
        console.log('Guardando (manual):', payload);
        
        fetch('api/guardar_trazabilidad.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(function(res) { return res.json(); })
        .then(function(resp) {
          btnGuardar.disabled = false;
          btnGuardar.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar';
          
          if (resp.success) {
            mostrarToast('Guardado correctamente', true);
          } else {
            mostrarToast('Error: ' + (resp.mensaje || 'Error al guardar'));
          }
        })
        .catch(function(err) {
          btnGuardar.disabled = false;
          btnGuardar.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar';
          mostrarToast('Error de conexión al guardar.');
          console.error('Error al guardar:', err);
        });
        
        return;
      }
      
      // Modo escaneo: validar que haya datos para guardar
      if (!ultimosDatosParseados) {
        mostrarToast('No hay datos para guardar. Escanee un código QR primero.');
        return;
      }
      
      // Validar que se haya seleccionado una máquina
      if (!maquinaSeleccionada) {
        mostrarToast('Seleccione una máquina antes de guardar.');
        return;
      }
      
      // Validar fecha
      if (!fecha) {
        mostrarToast('Seleccione una fecha.');
        return;
      }
      
      // Deshabilitar botón mientras se guarda
      btnGuardar.disabled = true;
      btnGuardar.textContent = 'Guardando...';
      
      var payload = {
        nuevo_lote: nuevoLoteInput.value,
        fecha: fecha,
        maquina_descripcion: maquinaSeleccionada.descripcion,
        codigo_producto: ultimosDatosParseados.codigo_producto,
        descripcion: ultimosDatosParseados.descripcion,
        lote: ultimosDatosParseados.lote,
        maquina_origen: ultimosDatosParseados.maquina_origen,
        cantidad: ultimosDatosParseados.cantidad,
        movimiento: ultimosDatosParseados.movimiento,
        concatenado: ultimoConcatenado
      };
      
      console.log('Guardando:', payload);
      
      fetch('api/guardar_trazabilidad.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(res) { return res.json(); })
      .then(function(resp) {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar';
        
        if (resp.success) {
          mostrarToast('Guardado correctamente', true);
        } else {
          mostrarToast('Error: ' + (resp.mensaje || 'Error al guardar'));
        }
      })
      .catch(function(err) {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar';
        mostrarToast('Error de conexión al guardar.');
        console.error('Error al guardar:', err);
      });
    });
    
    // ===== LIMPIAR DATOS =====
    function limpiarDatos() {
      // Limpiar variables de datos parseados
      ultimosDatosParseados = null;
      ultimoConcatenado = '';
      // Ocultar grid de resultados
      resultsArea.style.display = 'none';
      dataGrid.innerHTML = '';
      // Ocultar botón guardar
      saveContainer.style.display = 'none';
      // Limpiar máquina seleccionada (la fecha se conserva)
      maquinaSeleccionada = null;
      filtroMaquina.value = '';
      maquinaDropdown.innerHTML = '';
      // Limpiar campo nuevo lote
      nuevoLoteInput.value = '';
      nuevoLoteInput.placeholder = 'Seleccione máquina y fecha';
      // Resetear modo manual: desactivar toggle y ocultar bloque manual
      if (toggleManual) {
        toggleManual.checked = false;
        window.toggleModoManual(toggleManual);
      }
    }
    
    // ===== TOAST =====
    var toastTimeout = null;
    var pendienteLimpiar = false;
    
    function mostrarToast(mensaje, limpiarAlCerrar) {
      // Limpiar timeout anterior si existe
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
      pendienteLimpiar = limpiarAlCerrar === true;
      toastMessage.textContent = mensaje;
      toastModal.classList.add('active');
      // Cerrar automáticamente después de 2.5 segundos
      toastTimeout = setTimeout(function() {
        toastModal.classList.remove('active');
        if (pendienteLimpiar) {
          limpiarDatos();
        }
        pendienteLimpiar = false;
      }, 2500);
    }
    
    // Cerrar toast al hacer clic fuera del contenido
    toastModal.addEventListener('click', function(e) {
      if (e.target === toastModal) {
        toastModal.classList.remove('active');
        if (toastTimeout) {
          clearTimeout(toastTimeout);
        }
        if (pendienteLimpiar) {
          limpiarDatos();
          pendienteLimpiar = false;
        }
      }
    });
  </script>
</body>
</html>
