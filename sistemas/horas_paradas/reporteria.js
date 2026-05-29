var is_cmbTipoProducto_pordefecto=null
var is_cmbArea_pordefecto=null
var is_cmbSubArea_pordefecto=null
var is_cmbMaquinaArea_pordefecto=null
var is_cmbMotivo_pordefecto=null
var idxcmbSede
var idxdpFecha
var idxcmbTurno
var idxtpHoraFin
var idxtpHoraInicio
var idxcmbTipoProducto
var idxcmbArea
var idxcmbSubArea
var idxcmbMaquinaArea
var idxcmbAreaResponsable
var idxcmbMotivo
var ls_accion
var idxtxtObservacion
var idxtxtTotalHoras
var dataGrid
var popupDetalle

$(() => {
  DevExpress.localization.locale('es');

  $('#btnPanel').dxButton({
      stylingMode: 'contained',
      text: 'PANEL PRINCIPAL',
      type: 'success',
      width: 150,
      onClick() {
        window.location.href = '../../public/panel.html?par_accion=agregar&id=0';
      },
    });

    $('#btnCerrarSesion').dxButton({
      stylingMode: 'contained',
      text: 'CERRAR\nSESIÓN',
      type: 'success',
      width: 120,
      onClick() {

        $.ajax({ 
          url: 'datos.php',
          type: 'GET',
          data: { action: 'wf_cerrarsesion' ,parametros: ""},
          dataType: 'json',
          success(data) {
              
              console.log("logout",data)
              var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
              window.location.href = baseUrl + '/public/index.html';
          },
          error(e) {             
                  console.error('Error logout:', e);
          }, 
        });      
      },
    });

  let dataGridInstance;
  let dataOriginal = [];
  let sedes = [];
  let turnos = [];

  // Carga los datos y llena combos
  function cargarResumen() {
    $.ajax({
      url: 'datos.php',
      type: 'GET',
      data: { action: 'resumen_registrocontrolparadas' },
      dataType: 'json',
      success: function(data) {
        if (!Array.isArray(data)) {
          let mensaje = data && data.mensaje ? data.mensaje : (data && data.error ? data.error : "Error inesperado al cargar datos");
          DevExpress.ui.notify({
            message: mensaje,
            type: "error",
            displayTime: 5000
          });
          return;
        }
        dataOriginal = data;

        // Llena combos únicos
        sedes = [...new Set(data.map(d => d.Sede))];
        turnos = [...new Set(data.map(d => d.Turno))];

        // Inicializa combos
        $("#filtroFecha").dxDateBox({
          value: new Date(), // Fecha actual por defecto
          displayFormat: "dd/MM/yyyy",
          onValueChanged: filtrarGrid
        });
        $("#filtroSede").dxSelectBox({
          dataSource: sedes,
          placeholder: "Todas",
          showClearButton: true,
          onValueChanged: filtrarGrid
        });
        $("#filtroTurno").dxSelectBox({
          dataSource: turnos,
          placeholder: "Todos",
          showClearButton: true,
          onValueChanged: filtrarGrid
        });

        // Inicializa la grilla SIN columnas de fecha ni turno
        dataGridInstance = $("#detalleGridReporteria").dxDataGrid({
          dataSource: filtrarDatos(),
          keyExpr: "Maquina", // O usa otro campo único si tienes
          showBorders: true,
          columnAutoWidth: true,
          rowAlternationEnabled: true,
          allowColumnResizing: true,
          allowColumnReordering: true,
          filterRow: { visible: false },
          headerFilter: { visible: false },
          showColumnHeaders: true,
          grouping: { autoExpandAll: false, contextMenuEnabled: false },
          groupPanel: { visible: false },
          columnChooser: { enabled: false },
          showColumnLines: true, // o false si quieres menos líneas
          showRowLines: true,
          searchPanel: { visible: true, width: 240, placeholder: "Buscar..." },
          export: { enabled: true, fileName: "Resumen_Paradas" },
          paging: {
            enabled: true,
            pageSize: 10 // <-- Solo 10 filas por página
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true
          },
          summary: {
            totalItems: [
              { 
                column: "Horas Programadas", 
                summaryType: "sum", // <--- aquí el cambio
                valueFormat: "#0.00",
                displayFormat: "Total: {0}",
                customizeText: function(e) {
                  return "Total: " + Number(e.value).toFixed(2).replace(",", ".");
                }
              },
              { 
                column: "Horas Paradas", 
                summaryType: "sum", 
                valueFormat: "#0.00",
                displayFormat: "Total: {0}",
                customizeText: function(e) {
                  return "Total: " + Number(e.value).toFixed(2).replace(",", ".");
                }
              },
              { 
                column: "Horas x Justificar", 
                summaryType: "sum", 
                valueFormat: "#0.00",
                displayFormat: "Total: {0}",
                customizeText: function(e) {
                  return "Total: " + Number(e.value).toFixed(2).replace(",", ".");
                }
              }
            ]
          },
          columns: [
            { dataField: "Sede", groupIndex: 0, allowFiltering: false, allowHeaderFiltering: false, showWhenGrouped: false },
            { dataField: "Area", groupIndex: 1, allowFiltering: false, allowHeaderFiltering: false, showWhenGrouped: false },
            { dataField: "Maquina" }, // Ahora visible, no agrupada
            { dataField: "Horas Programadas", caption: "H. Programadas", dataType: "number", format: "#0.00", alignment: "right", customizeText: function(e) { return e.value !== null && e.value !== undefined ? Number(e.value).toFixed(2).replace(",", ".") : ""; } },
            { dataField: "Horas Paradas", caption: "H. Paradas", dataType: "number", format: "#0.00", alignment: "right", customizeText: function(e) { return e.value !== null && e.value !== undefined ? Number(e.value).toFixed(2).replace(",", ".") : ""; } },
            { dataField: "Horas x Justificar", caption: "H. Producidas", dataType: "number", format: "#0.00", alignment: "right", customizeText: function(e) { return e.value !== null && e.value !== undefined ? Number(e.value).toFixed(2).replace(",", ".") : ""; } }
          ],
          masterDetail: {
            enabled: true,
            template: function(container, options) {
              const detalles = options.data.detalles || [];
              detalles.forEach(data => {
                $("<div>")
                  .addClass("dx-detail-content")
                  .append(
                    `<div><b>Fecha:</b> ${data["Fecha"] || "-"}</div>
                    <div><b>Turno:</b> ${data["Turno"] || "-"}</div>
                    <div><b>Motivo Parada:</b> ${data["Motivo Parada"] || "-"}</div>
                    <div><b>Hora Inicio:</b> ${data["Hora Inicio"] || "-"}</div>
                    <div><b>Hora Fin:</b> ${data["Hora Fin"] || "-"}</div>
                    <div><b>Estado Registro:</b> ${data["Estado Registro"] || "-"}</div>
                    <div><b>Motivo Cierre Turno:</b> ${data["Motivo Cierre Turno"] || "-"}</div>
                    <div><b>Estado Cierre Turno:</b> ${data["Estado Cierre Turno"] || "-"}</div>
                    <div><b>Afecta Proceso:</b> ${data["Afecta Proceso"] || "-"}</div>
                    <div><b>Tipo Motivo:</b> ${data["Tipo Motivo"] || "-"}</div>
                    <div><b>Usuario:</b> ${data["Usuario"] || "-"}</div>
                    <hr>`
                  )
                  .appendTo(container);
              });
            }
          },
          onRowPrepared: function(e) {
            if (e.rowType === "data" && e.data["Horas x Justificar"] > 0) {
              e.rowElement.css("background-color", "#fff3cd");
            }
          }
        }).dxDataGrid("instance");
      }
    });
  }

  function parseFechaLocal(fechaStr) {
    if (!fechaStr) return null;
    const [y, m, d] = fechaStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  // Agrupa y suma por Sede, Área y Máquina
  function agruparDatos(datos) {
    const agrupados = [];
    const detallesPorMaquina = {};

    datos.forEach(d => {
      const key = `${d.Sede}|${d.Area}|${d.Maquina}`;
      if (!detallesPorMaquina[key]) detallesPorMaquina[key] = [];
      detallesPorMaquina[key].push(d);
    });

    Object.keys(detallesPorMaquina).forEach(key => {
      const registros = detallesPorMaquina[key];
      const base = registros[0];
      agrupados.push({
        Sede: base.Sede,
        Area: base.Area,
        Maquina: base.Maquina,
        "Horas Programadas": registros.reduce((a, b) => a + Number(b["Horas Programadas"] || 0), 0),
        "Horas Paradas": registros.reduce((a, b) => a + Number(b["Horas Paradas"] || 0), 0),
        "Horas x Justificar": registros.reduce((a, b) => a + Number(b["Horas x Justificar"] || 0), 0),
        detalles: registros // para el masterDetail
      });
    });

    // Ordena: primero los que tienen Horas Paradas > 0, luego alfabéticamente
    agrupados.sort((a, b) => {
      if (a["Horas Paradas"] > 0 && b["Horas Paradas"] === 0) return -1;
      if (a["Horas Paradas"] === 0 && b["Horas Paradas"] > 0) return 1;
      return a.Maquina.localeCompare(b.Maquina);
    });

    return agrupados;
  }

  // Función para filtrar los datos según los combos
  function filtrarDatos() {
    const sede = $("#filtroSede").dxSelectBox("instance")?.option("value");
    const fecha = $("#filtroFecha").dxDateBox("instance")?.option("value");
    const turno = $("#filtroTurno").dxSelectBox("instance")?.option("value");
    const filtrados = dataOriginal.filter(d =>
      (!sede || d.Sede === sede) &&
      (!fecha || (d.Fecha && (parseFechaLocal(d.Fecha).toDateString() === new Date(fecha).toDateString()))) &&
      (!turno || d.Turno === turno)
    );
    return agruparDatos(filtrados);
  }

  // Cuando cambian los filtros, actualiza la grilla
  function filtrarGrid() {
    if (dataGridInstance) {
      dataGridInstance.option("dataSource", filtrarDatos());
    }
  }

  cargarResumen();
});



  // Función para obtener parámetros de la URL
  function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  $(document).ready(function() {

    $.ajax({ 
      url: 'datos.php',
      type: 'GET',
      data: { action: 'wf_obtenerUsuario' ,parametros: ''},
      dataType: 'json',
      success(data) {
        console.log('ready - data', );
        lblUsuario.innerHTML = data
      },
      error() {             
              console.error('Error guardar:', textStatus, errorThrown);
      }, 
    }); 
  

  });

  
