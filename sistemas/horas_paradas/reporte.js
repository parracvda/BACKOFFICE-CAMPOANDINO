var dataGrid

$(() => {
    DevExpress.localization.locale('es');
    
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'dw_reporte' ,parametros: ''},
    dataType: 'json',
    success(data) {
       
        console.log("dw_lista",data);
          dataGrid = $('#dw_lista').dxDataGrid({
            dataSource: data,
            //columns: ['Fecha', 'HoraInicio', 'HoraFin', 'Estado'],
 
            showBorders: true,
            columnAutoWidth: true,

            headerFilter: {
              visible: true,
            },

            export: {
              enabled: true,
              allowExportSelectedData: true,
            },
            onExporting(e) {
              const workbook = new ExcelJS.Workbook();
              const worksheet = workbook.addWorksheet('Reporte');
        
              DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
              }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reporte.xlsx');
                });
              });
            },
            onInitialized: function(e) {

             
          },
          onRowDblClick: function(e) {
            //console.log(e.data.Idregistrocontrolparadas)
            window.location.href = 'formulario.html?par_accion=editar&id='+e.data.Idregistrocontrolparadas;
          }
          }).dxDataGrid("instance");     
    },
    error() {             
            console.error('Error guardar:', textStatus, errorThrown);
    }, 
  }); 

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

  $('#success-contained').dxButton({
    stylingMode: 'contained',
    text: 'Nuevo',
    type: 'success',
    width: 120,
    onClick() {
      
      window.location.href = 'formulario.html?par_accion=agregar&id=0';
      //DevExpress.ui.notify('Se guardó con éxito');
    },
  });

  $('#btnCerrarSesion').dxButton({
    stylingMode: 'contained',
    text: 'Cerrar Sesión',
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
            window.location.href = 'acceso.html?par_accion=agregar&id=0';
            //window.location.href = 'acceso.html';
          
        },
        error(e) {             
                console.error('Error logout:', e);
        }, 
      }); 
    },
  });
});
