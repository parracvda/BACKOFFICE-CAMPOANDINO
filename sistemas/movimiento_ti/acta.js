/* acta.js — Acta de Recepcion de Equipos — Campo Andino TI
   Flujo:
   1. BACKOFFICE: TI abre el acta, firma en el pad Entregador
      -> "Guardar mi firma y notificar al receptor"
      -> se guarda firmaEntregador + se genera token
      -> boton "Enviar al receptor" -> correo con enlace
   2. PUBLIC (token): Receptor ve el acta con la firma de TI ya puesta,
      firma en el pad Receptor -> "Confirmar mi firma y cerrar acta"
      -> acta cerrada: se envia PDF a ambos por correo
*/
'use strict';

let signEntregador = null;
let signReceptor   = null;
let actaData       = null;
let actaFirmada    = false;
let logoBase64     = null;
let tokenActual    = TOKEN;

document.addEventListener('DOMContentLoaded', () => {
  initSignaturePads();
  cargarDatos();
  document.getElementById('btnGuardarFirmaTI')       .addEventListener('click', guardarFirmaTI);
  document.getElementById('btnGuardarFirmaReceptor') .addEventListener('click', guardarFirmaReceptor);
  document.getElementById('btnGuardarPresencial')    .addEventListener('click', guardarFirmasPresencial);
  document.getElementById('btnGenerarPDF')           .addEventListener('click', generarPDF);
  const btnFirmaPresencial = document.getElementById('btnFirmaPresencial');
  if (btnFirmaPresencial) btnFirmaPresencial.addEventListener('click', activarModoPresencial);
  const btnEnviarCorreo = document.getElementById('btnEnviarCorreo');
  if (btnEnviarCorreo) btnEnviarCorreo.addEventListener('click', abrirModalEnviarCorreo);
  const btnCompartir = document.getElementById('btnCompartir');
  if (btnCompartir) btnCompartir.addEventListener('click', abrirModalCompartir);
  const btnConfirmarEnvio = document.getElementById('btnConfirmarEnvio');
  if (btnConfirmarEnvio) btnConfirmarEnvio.addEventListener('click', enviarCorreoReceptor);
  precargarLogo();
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);
});

function resizeCanvases() {
  ['Entregador', 'Receptor'].forEach(nombre => {
    const canvas = document.getElementById('canvasFirma' + nombre);
    const wrap   = document.getElementById('wrapFirma'   + nombre);
    if (!canvas || !wrap) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const w = wrap.offsetWidth;
    if (w < 10) return;
    canvas.width  = w * ratio;
    canvas.height = 200 * ratio;
    canvas.style.width  = w + 'px';
    canvas.style.height = '200px';
    canvas.getContext('2d').scale(ratio, ratio);
    if (nombre === 'Entregador' && signEntregador) signEntregador.clear();
    if (nombre === 'Receptor'   && signReceptor)   signReceptor.clear();
  });
}

function initSignaturePads() {
  const cE = document.getElementById('canvasFirmaEntregador');
  const cR = document.getElementById('canvasFirmaReceptor');
  const opts = { penColor: '#000', backgroundColor: 'rgba(0,0,0,0)', minWidth: 1, maxWidth: 3 };
  signEntregador = new SignaturePad(cE, opts);
  signReceptor   = new SignaturePad(cR, opts);
  cE.addEventListener('pointerdown', () => { document.getElementById('placeholderEntregador').style.display = 'none'; });
  cR.addEventListener('pointerdown', () => { document.getElementById('placeholderReceptor').style.display   = 'none'; });
}

function limpiarFirma(nombre) {
  if (actaFirmada) return;
  if (nombre === 'Entregador') { signEntregador.clear(); document.getElementById('placeholderEntregador').style.display = 'flex'; }
  if (nombre === 'Receptor')   { signReceptor.clear();   document.getElementById('placeholderReceptor').style.display   = 'flex'; }
}
window.limpiarFirma = limpiarFirma;

function cargarDatos() {
  const url = MODO_TOKEN
    ? API + '?action=obtener_acta_publica&token=' + encodeURIComponent(TOKEN)
    : API + '?action=obtener_acta&id='            + encodeURIComponent(ID_MOV);
  fetch(url)
    .then(r => r.json())
    .then(resp => {
      if (resp.success) { actaData = resp.data; renderActa(actaData); }
      else mostrarPantallaError(resp.mensaje || resp.message || 'Error desconocido');
    })
    .catch(() => mostrarPantallaError('Error de conexion al cargar el acta'));
}

function mostrarPantallaError(msg) {
  document.getElementById('actaDoc').innerHTML =
    '<div style="text-align:center;padding:60px 20px;color:#c0392b">'
    + '<i class="fa fa-exclamation-triangle" style="font-size:3rem;margin-bottom:20px"></i>'
    + '<p style="font-size:1.1rem;font-weight:700">' + esc(msg) + '</p></div>';
}

function formatFecha(v) {
  if (!v) return '';
  const p = String(v).split('-');
  return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderActa(d) {
  document.getElementById('aFecha').textContent        = formatFecha(d.Fecha);
  document.getElementById('aUsuario').textContent      = d.Usuario || '';
  document.getElementById('aCargo').textContent        = d.Cargo   || '';
  document.getElementById('aArea').textContent         = d.Area    || '';
  document.getElementById('aTipo').textContent         = d.Tipo    || '';
  document.getElementById('aMarcaModelo').textContent  = [d.Marca, d.Modelo].filter(Boolean).join(' / ');
  document.getElementById('aNSerie').textContent       = d.NSerie  || '';
  document.getElementById('aAccesorios').textContent   = d.Accesorios || 'Ninguno';
  document.getElementById('aNombreTI').textContent     = d.actaNombreTI || ENCARGADO_TI || '';
  document.getElementById('aUsuarioFirma').textContent = d.Usuario || '';
  document.getElementById('aCargoFirma').textContent   = d.Cargo  || 'Cargo';

  if (d.actaFirmada == 1) {
    mostrarEstadoCerrada(d);
  } else if (!MODO_TOKEN && d.actaFirmadaTI == 1) {
    mostrarEstadoPendienteReceptor(d);
  } else if (MODO_TOKEN && d.actaFirmadaTI == 1) {
    configurarModoReceptor(d);
  } else if (!MODO_TOKEN) {
    configurarModoTI();
  }
}

function configurarModoTI() {
  document.getElementById('wrapFirmaReceptor').closest('.firma-bloque').style.display = 'none';
  document.getElementById('btnGuardarFirmaTI').style.display        = 'inline-flex';
  document.getElementById('btnGuardarFirmaReceptor').style.display  = 'none';
  document.getElementById('btnGuardarPresencial').style.display     = 'none';
  const btnPresencial = document.getElementById('btnFirmaPresencial');
  if (btnPresencial) btnPresencial.style.display = 'inline-flex';
  actualizarBadge('pendiente-ti');
}

function activarModoPresencial() {
  // Mostrar ambos pads simultáneamente para firma en el mismo dispositivo
  document.getElementById('wrapFirmaReceptor').closest('.firma-bloque').style.display = '';
  document.getElementById('btnGuardarFirmaTI').style.display        = 'none';
  document.getElementById('btnGuardarPresencial').style.display     = 'inline-flex';
  const btnPresencial = document.getElementById('btnFirmaPresencial');
  if (btnPresencial) btnPresencial.style.display = 'none';
  actualizarBadge('presencial');
  mostrarNotif('Modo presencial: ambas partes deben firmar en este dispositivo.', 'info', 4000);
}

function mostrarEstadoPendienteReceptor(d) {
  tokenActual = d.actaToken || tokenActual;
  mostrarImagenFirma('Entregador', d.firmaEntregador);
  document.getElementById('wrapBtnGuardar').style.display = 'none';
  document.getElementById('wrapFirmaReceptor').closest('.firma-bloque').style.display = 'none';
  const bEnviar    = document.getElementById('btnEnviarCorreo');
  const bCompartir = document.getElementById('btnCompartir');
  if (bEnviar)    bEnviar.style.display    = 'inline-flex';
  if (bCompartir) bCompartir.style.display = 'inline-flex';
  actualizarBadge('pendiente-receptor');
}

function configurarModoReceptor(d) {
  mostrarImagenFirma('Entregador', d.firmaEntregador);
  const btnLimpiarE = document.getElementById('btnLimpiarEntregador');
  if (btnLimpiarE) btnLimpiarE.style.display = 'none';
  document.getElementById('btnGuardarFirmaTI').style.display = 'none';
  document.getElementById('btnGuardarFirmaReceptor').style.display = 'inline-flex';
  actualizarBadge('pendiente-receptor');
}

function mostrarEstadoCerrada(d) {
  actaFirmada = true;
  mostrarImagenFirma('Entregador', d.firmaEntregador);
  mostrarImagenFirma('Receptor',   d.firmaReceptor);
  document.getElementById('wrapBtnGuardar').style.display = 'none';
  ['btnLimpiarEntregador', 'btnLimpiarReceptor'].forEach(id => {
    const b = document.getElementById(id); if (b) b.style.display = 'none';
  });
  if (signEntregador) { try { signEntregador.off(); } catch(e){} }
  if (signReceptor)   { try { signReceptor.off();   } catch(e){} }
  actualizarBadge('firmada', d.actaFechaFirma);
  if (MODO_TOKEN) mostrarMensajeCierre();
}

function mostrarMensajeCierre() {
  const wrap = document.getElementById('wrapBtnGuardar');
  wrap.style.display = 'block';
  wrap.innerHTML = '<div style="background:#d4edda;border:1px solid #c3e6cb;border-radius:10px;padding:20px 28px;text-align:center;color:#155724">'
    + '<i class="fa fa-check-circle" style="font-size:1.8rem;margin-bottom:10px;display:block"></i>'
    + '<strong style="font-size:1rem">Gracias! Tu firma ha sido registrada.</strong>'
    + '<p style="margin:8px 0 0;font-size:.92rem">El acta ha sido cerrada. Recibiras una copia en tu correo electronico.</p>'
    + '</div>';
}

function mostrarImagenFirma(nombre, dataURL) {
  if (!dataURL) return;
  const wrap = document.getElementById('wrapFirma' + nombre);
  if (!wrap) return;
  wrap.classList.add('firmado');
  wrap.innerHTML = '<img class="firma-img" src="' + dataURL + '" alt="Firma" />';
  const ph = document.getElementById('placeholder' + nombre);
  if (ph) ph.style.display = 'none';
}

function actualizarBadge(estado, fecha) {
  const badge = document.getElementById('statusBadge');
  if (!badge) return;
  const estilos = {
    'pendiente-ti':       { bg: '#fff3cd', color: '#856404', border: '#ffc107', texto: 'Pendiente firma TI',             icono: 'fa-clock'        },
    'pendiente-receptor': { bg: '#cce5ff', color: '#004085', border: '#b8daff', texto: 'Pendiente firma receptor',       icono: 'fa-envelope'     },
    'presencial':         { bg: '#ffe8d6', color: '#7d3c00', border: '#f0a070', texto: 'Pendiente firma ambas partes',   icono: 'fa-users'        },
    'firmada':            { bg: '#d4edda', color: '#155724', border: '#c3e6cb', texto: 'Firmada',                        icono: 'fa-check-circle' },
  };
  const e = estilos[estado] || estilos['pendiente-ti'];
  const fechaStr = (estado === 'firmada' && fecha) ? ' el ' + String(fecha).substring(0,10).split('-').reverse().join('/') : '';
  badge.innerHTML = '<span style="background:' + e.bg + ';color:' + e.color + ';border:1px solid ' + e.border + ';border-radius:6px;padding:5px 12px;font-size:.82rem;font-weight:700">'
    + '<i class="fa ' + e.icono + '"></i> ' + e.texto + fechaStr + '</span>';
}

/* == PASO 1: TI firma ================================================ */
function guardarFirmaTI() {
  if (!actaData) { mostrarNotif('Datos no cargados', 'error'); return; }
  if (signEntregador.isEmpty()) { mostrarNotif('Por favor firme en el recuadro "Entregado por"', 'error'); return; }

  const btn = document.getElementById('btnGuardarFirmaTI');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Guardando...';

  comprimirFirma(signEntregador).then(firmaEntregador => {

  fetch(API + '?action=guardar_firma_ti', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: ID_MOV, firmaEntregador_b64: firmaEntregador, nombreTI: ENCARGADO_TI })
  })
    .then(r => r.json())
    .then(resp => {
      if (resp.success) {
        tokenActual = resp.token || tokenActual;
        // Restaurar prefijo para mostrar la imagen en pantalla
        actaData.firmaEntregador = 'data:image/jpeg;base64,' + firmaEntregador;
        actaData.actaFirmadaTI   = 1;
        actaData.actaToken       = tokenActual;
        mostrarEstadoPendienteReceptor(actaData);
        // Enviar correo automáticamente
        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Enviando correo...';
        fetch(API + '?action=enviar_acta_receptor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: ID_MOV })
        })
          .then(r2 => r2.json())
          .then(resp2 => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa fa-pen-nib"></i> Guardar mi firma y notificar al receptor';
            if (resp2.success) {
              const correo = actaData.Correo || '';
              mostrarNotif('Firma guardada y correo enviado a ' + correo, 'success', 6000);
            } else {
              // Fallo de correo: mostrar error detallado + botón manual
              const detalle = resp2.mensaje || 'Error desconocido';
              mostrarNotif('Firma guardada. Fallo correo: ' + detalle, 'error', 10000);
              const bEnviar = document.getElementById('btnEnviarCorreo');
              const bQR     = document.getElementById('btnCompartir');
              if (bEnviar) bEnviar.style.display = '';
              if (bQR)     bQR.style.display     = '';
              if (resp2.enlace) {
                document.getElementById('urlCompartir').value = resp2.enlace;
                generarQR(resp2.enlace);
              }
            }
          })
          .catch(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa fa-pen-nib"></i> Guardar mi firma y notificar al receptor';
            mostrarNotif('Firma guardada. Error al enviar correo. Usa el boton "Enviar al receptor".', 'error', 6000);
          });
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa fa-pen-nib"></i> Guardar mi firma y notificar al receptor';
        mostrarNotif('Error: ' + (resp.mensaje || 'No se pudo guardar'), 'error', 5000);
      }
    })
    .catch(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa fa-pen-nib"></i> Guardar mi firma y notificar al receptor';
      mostrarNotif('Error de conexion', 'error', 4000);
    });

  }); // fin comprimirFirma
}

/* == PASO 2: Enviar correo al receptor ================================ */
function abrirModalEnviarCorreo() {
  if (!actaData) return;
  const correo = actaData.Correo || '';
  const label  = document.getElementById('correoReceptorLabel');
  if (label) label.textContent = correo || '(sin correo registrado)';
  document.getElementById('modalEnviarCorreo').classList.add('open');
}

function enviarCorreoReceptor() {
  const btn = document.getElementById('btnConfirmarEnvio');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Enviando...';

  fetch(API + '?action=enviar_acta_receptor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: ID_MOV })
  })
    .then(r => r.json())
    .then(resp => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa fa-paper-plane"></i> Enviar correo';
      document.getElementById('modalEnviarCorreo').classList.remove('open');
      if (resp.success) {
        mostrarNotif('Correo enviado correctamente.', 'success', 4000);
      } else {
        if (resp.enlace) {
          mostrarNotif('No se pudo enviar el correo. Comparte el enlace manualmente.', 'error', 5000);
          document.getElementById('urlCompartir').value = resp.enlace;
          generarQR(resp.enlace);
          document.getElementById('modalCompartir').classList.add('open');
        } else {
          mostrarNotif('Error: ' + (resp.mensaje || 'No se pudo enviar'), 'error', 5000);
        }
      }
    })
    .catch(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa fa-paper-plane"></i> Enviar correo';
      mostrarNotif('Error de conexion', 'error', 4000);
    });
}

/* == PASO 3: Receptor firma (modo token) ============================== */
function guardarFirmaReceptor() {
  if (!actaData) { mostrarNotif('Datos no cargados', 'error'); return; }
  if (signReceptor.isEmpty()) { mostrarNotif('Por favor firme en el recuadro "Recibido por"', 'error'); return; }

  const btn = document.getElementById('btnGuardarFirmaReceptor');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Guardando...';

  comprimirFirma(signReceptor).then(firmaReceptor => {

  fetch(API + '?action=guardar_firma_receptor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: TOKEN, firmaReceptor_b64: firmaReceptor })
  })
    .then(r => r.json())
    .then(resp => {
      if (resp.actaYaCerrada || resp.success) {
        actaData.firmaReceptor  = firmaReceptor;
        actaData.actaFirmada    = 1;
        actaData.actaFechaFirma = new Date().toISOString().substring(0, 10);
        mostrarEstadoCerrada(actaData);
        mostrarNotif(resp.actaYaCerrada ? 'Esta acta ya fue registrada anteriormente.' : 'Acta firmada y cerrada!', resp.actaYaCerrada ? 'info' : 'success', 4000);
        if (!resp.actaYaCerrada) setTimeout(() => enviarPDFFirmado(), 2000);
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa fa-check-circle"></i> Confirmar mi firma y cerrar acta';
        mostrarNotif('Error: ' + (resp.mensaje || 'No se pudo guardar'), 'error', 5000);
      }
    })
    .catch(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa fa-check-circle"></i> Confirmar mi firma y cerrar acta';
      mostrarNotif('Error de conexion', 'error', 4000);
    });

  }); // fin comprimirFirma
}

/* == Modo presencial: ambas firmas simultáneas ======================= */
function guardarFirmasPresencial() {
  if (!actaData) { mostrarNotif('Datos no cargados', 'error'); return; }
  if (signEntregador.isEmpty()) { mostrarNotif('Por favor firme en el recuadro "Entregado por"', 'error'); return; }
  if (signReceptor.isEmpty())   { mostrarNotif('Por favor firme en el recuadro "Recibido por"', 'error'); return; }

  const btn = document.getElementById('btnGuardarPresencial');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Guardando...';

  Promise.all([comprimirFirma(signEntregador), comprimirFirma(signReceptor)])
    .then(([firmaE, firmaR]) => {
      fetch(API + '?action=guardar_firmas_presencial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:                  ID_MOV,
          firmaEntregador_b64: firmaE,
          firmaReceptor_b64:   firmaR,
          nombreTI:            ENCARGADO_TI
        })
      })
        .then(r => r.json())
        .then(resp => {
          if (resp.success) {
            actaData.firmaEntregador = 'data:image/jpeg;base64,' + firmaE;
            actaData.firmaReceptor   = 'data:image/jpeg;base64,' + firmaR;
            actaData.actaFirmadaTI   = 1;
            actaData.actaFirmada     = 1;
            actaData.actaToken       = resp.token || tokenActual;
            actaData.actaFechaFirma  = new Date().toISOString().substring(0, 10);
            tokenActual              = actaData.actaToken;
            mostrarEstadoCerrada(actaData);
            mostrarNotif('Acta firmada por ambas partes!', 'success', 4000);
            setTimeout(() => enviarPDFFirmado(), 2000);
          } else {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa fa-check-double"></i> Guardar ambas firmas y enviar PDF';
            mostrarNotif('Error: ' + (resp.mensaje || 'No se pudo guardar'), 'error', 5000);
          }
        })
        .catch(() => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa fa-check-double"></i> Guardar ambas firmas y enviar PDF';
          mostrarNotif('Error de conexion', 'error', 4000);
        });
    });
}

/* == Enviar PDF firmado a ambas partes ================================ */
function enviarPDFFirmado() {
  if (!actaData || !actaData.actaFirmada) return;
  const pdfBase64 = generarPDFBase64();
  if (!pdfBase64) return;
  const payload = MODO_TOKEN
    ? { token: TOKEN,  pdf: pdfBase64 }
    : { id:    ID_MOV, pdf: pdfBase64 };
  fetch(API + '?action=enviar_pdf_firmado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(resp => { if (resp.success) mostrarNotif('Copia del PDF enviada por correo.', 'success', 4000); })
    .catch(() => {});
}

/* == Modal compartir enlace + QR ===================================== */
function abrirModalCompartir() {
  if (!tokenActual) {
    fetch(API + '?action=generar_token_acta&id=' + encodeURIComponent(ID_MOV))
      .then(r => r.json())
      .then(resp => { if (resp.success) { tokenActual = resp.token; mostrarModalEnlace(); } else mostrarNotif('No se pudo generar el enlace', 'error'); });
  } else {
    mostrarModalEnlace();
  }
}

function mostrarModalEnlace() {
  const base = window.location.origin + window.location.pathname.replace('acta.php', '');
  const url  = base + 'acta.php?token=' + tokenActual;
  document.getElementById('urlCompartir').value = url;
  generarQR(url);
  document.getElementById('modalCompartir').classList.add('open');
}

function generarQR(url) {
  const cont = document.getElementById('qrCanvas');
  cont.innerHTML = '';
  try { new QRCode(cont, { text: url, width: 180, height: 180 }); } catch(e) {}
}

function copiarEnlace() {
  const url = document.getElementById('urlCompartir').value;
  if (!url) return;
  navigator.clipboard.writeText(url)
    .then(() => mostrarNotif('Enlace copiado al portapapeles', 'success', 2500))
    .catch(() => { document.getElementById('urlCompartir').select(); document.execCommand('copy'); mostrarNotif('Enlace copiado', 'success', 2500); });
}

/* == Comprimir firma (PNG grande → JPEG pequeño ~15KB) ================ */
function comprimirFirma(signPad) {
  // Redibujar en canvas 400×160 JPEG calidad 0.7 → ~10-15KB vs ~100KB PNG
  // Se retorna SOLO el base64 puro (sin prefijo data:...) para evitar filtros ModSecurity
  const src = signPad.toDataURL('image/png');
  const cv  = document.createElement('canvas');
  cv.width  = 400;
  cv.height = 160;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cv.width, cv.height);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      const dataUri = cv.toDataURL('image/jpeg', 0.7);
      // Quitar prefijo "data:image/jpeg;base64," — lo reconstruye el servidor
      const b64 = dataUri.split(',')[1] || dataUri;
      resolve(b64);
    };
    img.onerror = () => {
      // fallback: PNG sin prefijo
      const b64 = src.split(',')[1] || src;
      resolve(b64);
    };
    img.src = src;
  });
}

/* == Logo base64 ====================================================== */
function precargarLogo() {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    const cv = document.createElement('canvas');
    cv.width  = img.naturalWidth;
    cv.height = img.naturalHeight;
    cv.getContext('2d').drawImage(img, 0, 0);
    try { logoBase64 = cv.toDataURL('image/png'); } catch(e) { logoBase64 = null; }
  };
  img.onerror = () => { logoBase64 = null; };
  img.src = '../../shared/images/logo.png?_cb=' + Date.now();
}

/* == PDF ============================================================== */
function generarPDFBase64() {
  if (!actaData) return null;
  const raw = construirPDF().output('datauristring');
  return raw.split(',')[1] || null;
}

function generarPDF() {
  if (!actaData) { mostrarNotif('Cargue el acta antes de descargar', 'error'); return; }
  const nombre = 'Acta_' + (actaData.Usuario || 'Receptor').replace(/\s+/g, '_')
               + '_' + (formatFecha(actaData.Fecha) || '').replace(/\//g,'') + '.pdf';
  construirPDF().save(nombre);
}

function construirPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, ml = 25, mr = 25, mt = 18;
  let y = mt;
  const cw = W - ml - mr;

  if (logoBase64) { try { doc.addImage(logoBase64, 'PNG', ml, y, 30, 13); } catch(e){} }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const tituloTxt = 'ACTA DE RECEPCION DE EQUIPOS NUEVOS';
  doc.text(tituloTxt, W / 2, y + 7, { align: 'center' });
  // Subrayado solo del ancho del título
  const tituloAncho = doc.getTextWidth(tituloTxt);
  const tituloX = (W / 2) - (tituloAncho / 2);
  doc.setLineWidth(0.3);
  doc.line(tituloX, y + 8.5, tituloX + tituloAncho, y + 8.5);
  y += 22;

  doc.setFontSize(10);
  doc.text('Campo Andino S.A.C.', ml, y); y += 5;
  doc.text('Area de Tecnologia de la Informacion', ml, y); y += 9;

  const campos = [
    ['Fecha:',   formatFecha(actaData.Fecha)],
    ['Usuario:', actaData.Usuario || ''],
    ['Cargo:',   actaData.Cargo   || ''],
    ['Area:',    actaData.Area    || ''],
  ];
  campos.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'bold');   doc.text(lbl, ml, y);
    doc.setFont('helvetica', 'normal'); doc.text(val, ml + 18, y);
    y += 6;
  });
  y += 4;

  doc.setFont('helvetica', 'bold'); doc.text('Estimado(a):', ml, y); y += 6;
  doc.setFont('helvetica', 'normal');

  const p1 = doc.splitTextToSize('Por medio de la presente, dejamos constancia de la entrega y recepcion de un equipo de trabajo, asignado para el desarrollo de sus funciones en Campo Andino S.A.C.', cw);
  doc.text(p1, ml, y); y += p1.length * 5 + 6;

  doc.setFont('helvetica', 'bold'); doc.text('Detalle del equipo entregado:', ml, y); y += 6;
  doc.setFont('helvetica', 'normal');
  [
    '- Tipo de equipo: '       + (actaData.Tipo || ''),
    '- Marca / Modelo: '       + [actaData.Marca, actaData.Modelo].filter(Boolean).join(' / '),
    '- Numero de serie: '      + (actaData.NSerie || ''),
    '- Accesorios incluidos: ' + (actaData.Accesorios || 'Ninguno'),
  ].forEach(l => { doc.text(l, ml + 3, y); y += 5.5; });
  y += 3;

  const p2 = doc.splitTextToSize('El usuario declara haber recibido el equipo en buen estado de funcionamiento, asi como los accesorios detallados. Asimismo, se compromete a:', cw);
  doc.text(p2, ml, y); y += p2.length * 5 + 5;

  [
    '1. Hacer uso responsable del equipo unicamente para fines laborales.',
    '2. Velar por el cuidado, seguridad y conservacion de este.',
    '3. Comunicar de inmediato al area de TI cualquier desperfecto o incidente relacionado con el equipo.',
    '4. Devolver el equipo en caso de cese de labores, reasignacion o renovacion, en las condiciones mas cercanas a las originales, salvo el desgaste natural por uso.',
    '5. Asumir plena responsabilidad por el equipo asignado; en caso de robo, perdida o dano por negligencia, el colaborador debera cubrir el costo total o parcial del mismo, segun lo determine la empresa.',
  ].forEach(comp => {
    const lineas = doc.splitTextToSize(comp, cw - 4);
    doc.text(lineas, ml + 2, y); y += lineas.length * 5 + 2;
  });
  y += 8;

  const firmaH = 28, firmaW = 70;
  const xE = ml, xR = W - mr - firmaW;

  const fE = actaData.firmaEntregador || (signEntregador && !signEntregador.isEmpty() ? signEntregador.toDataURL('image/png') : null);
  const fR = actaData.firmaReceptor   || (signReceptor   && !signReceptor.isEmpty()   ? signReceptor.toDataURL('image/png')   : null);

  if (fE) { try { doc.addImage(fE, 'PNG', xE, y, firmaW, firmaH, '', 'FAST'); } catch(e){} }
  if (fR) { try { doc.addImage(fR, 'PNG', xR, y, firmaW, firmaH, '', 'FAST'); } catch(e){} }

  y += firmaH + 2;
  doc.setLineWidth(0.4);
  doc.line(xE, y, xE + firmaW, y);
  doc.line(xR, y, xR + firmaW, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Entregado por:', xE, y); doc.text('Recibido por:', xR, y); y += 4;
  doc.setFont('helvetica', 'normal');
  doc.text(actaData.actaNombreTI || ENCARGADO_TI || '', xE, y);
  doc.text(actaData.Usuario || '', xR, y); y += 4;
  doc.text('ÁREA DE TECNOLOGÍA DE LA INFORMACIÓN', xE, y);
  doc.text(actaData.Cargo || '', xR, y);

  return doc;
}

/* == Notificaciones =================================================== */
let notifTO = null;
function mostrarNotif(msg, tipo, dur) {
  const bar = document.getElementById('notifBar');
  bar.className   = 'notif-bar notif-' + (tipo || 'info');
  bar.textContent = msg;
  bar.style.display = 'block';
  clearTimeout(notifTO);
  notifTO = setTimeout(() => { bar.style.display = 'none'; }, dur || 3000);
}
