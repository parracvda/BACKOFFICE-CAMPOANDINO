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
              window.location.href = 'index.html?par_accion=agregar&id=0';
          },
          error(e) {             
                  console.error('Error logout:', e);
          }, 
        });      
      },
    });

    function cargarResumen() {
      $.ajax({
        url: 'datos.php',
        type: 'GET',
        data: { action: 'resumen_registrocontrolparadas' },
        dataType: 'json',
        success: function(data) {
          $("#detalleGrid").dxDataGrid({
            dataSource: data,
            columns: [
              { dataField: "Sede" },
              { dataField: "Fecha" },
              { dataField: "Turno" },
              { dataField: "Area" },
              { dataField: "Maquina" },
              { dataField: "Motivo Parada" },
              { dataField: "Hora Inicio" },
              { dataField: "Hora Fin" },
              { dataField: "Estado Registro" },
              { dataField: "Horas Programadas" },
              { dataField: "Horas Paradas" },
              { dataField: "Horas x Justificar" },
              { dataField: "Motivo Cierre Turno" },
              { dataField: "Estado Cierre Turno" },
              { dataField: "Proceso Afectado" },
              { dataField: "Tipo Motivo" },
              { dataField: "Usuario" }
            ],
            showBorders: true,
            columnAutoWidth: true
          });
        }
      });
    }

  // Llama a la función cuando abras el modal o al cargar la página
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

  
