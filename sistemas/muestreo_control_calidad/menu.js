var dataGrid

$(() => {
    DevExpress.localization.locale('es');

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


  $('#btnMateriaPrima').dxButton({
    onClick() {    
      window.location.href = 'formulario.php?par_accion=agregar&id=0';
    },
  });

  $('#btnProductoTerminado').dxButton({
    onClick() {    
      window.location.href = 'formulario_pt.php?par_accion=agregar&id=0';
    },
  });

  $('#btnProductosEnProceso').dxButton({
    onClick() {    
      window.location.href = 'formulario_pp.php?par_accion=agregar&id=0';
    },
  });

  $('#btnDespacho').dxButton({
    onClick() {    
      window.location.href = 'formulario_de.php?par_accion=agregar&id=0';
    },
  });

  $('#btnCerrarSesion').dxButton({  
    onClick() {

      $.ajax({ 
        url: '../../sistemas/horas_paradas/datos.php',
        type: 'GET',
        data: { action: 'wf_cerrarsesion' ,parametros: ""},
        dataType: 'json',
        success(data) {         
            console.log("logout",data)
            // Redirigir al login del backoffice
            var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
            window.location.href = baseUrl + '/public/index.html';     
        },
        error(e) {             
                console.error('Error logout:', e);
                // En caso de error también redirigir al login
                var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
                window.location.href = baseUrl + '/public/index.html';
        }, 
      }); 
    },
  });
});
