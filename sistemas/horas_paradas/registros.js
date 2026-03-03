var dataGrid

$(() => {
    DevExpress.localization.locale('es');
    
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'dw_lista' ,parametros: ''},
    dataType: 'json',
    success(data) {
       
        console.log("dw_lista",data);
          dataGrid = $('#dw_lista').dxDataGrid({
            dataSource: data,
            // columns: ['Fecha', 'Maquina', 'HoraInicio', 'HoraFin', 'Estado'],

            columns: [
        { dataField: 'IdSedes', visible: false },
        'Fecha',
        'Maquina',
        'HoraInicio',
        'HoraFin',
        {
        dataField: 'Estado',
        caption: 'Estado',
        cellTemplate: function(container, options) {
          let color = '';
          if (options.value === 'PENDIENTE') {
            color = 'green';
          } else if (options.value === 'CERRADO') {
            color = 'red';
          }
          $("<span>")
            .text(options.value)
            .css("color", color)
            .css("font-weight", "bold")
            .appendTo(container);
        }
        },
            ],

            showBorders: true,
            columnAutoWidth: true,
            onInitialized: function(e) {

          },
          onRowDblClick: function(e) {
            // Validar si el registro está cerrado (Estado == 2)
            console.log("Datos de la fila:", e.data)
            if (e.data.Estado === "CERRADO") {
              DevExpress.ui.notify('El registro ya está cerrado y no puede ser editado.', 'warning', 5000);
              return;
            }
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
