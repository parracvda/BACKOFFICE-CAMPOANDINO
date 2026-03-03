var dataGrid

$(() => {
    DevExpress.localization.locale('es');

  $(document).ready(function() { 

    $.ajax({ 
      url: '../sistemas/horas_paradas/datos.php',
      type: 'GET',
      data: { action: 'wf_obtenerUsuario' ,parametros: ''},
      dataType: 'json',
      success(data) {
        console.log('Usuario obtenido:', data);
        if (data && !data.error) {
          document.getElementById('lblUsuario').innerText = data.nombreUsuario;
          // También lo guardamos por si otra página lo necesita
          localStorage.setItem('nombreUsuario', data.nombreUsuario);
          localStorage.setItem('idUsuario', data.idUsuario);
        } else {
            DevExpress.ui.notify("Debe iniciar sesión nuevamente.", "warning", 3000);
            window.location.href = "index.html";
          }
      },
      error(xhr, textStatus, errorThrown) {
        console.error('Error guardar:', textStatus, errorThrown);
      }, 
    }); 
  });

  $('#btnConsultas').dxButton({
    onClick() {    
      window.location.href = '../sistemas/horas_paradas/reporteria.html?par_accion=agregar&id=0';
    },
  });

  $('#btnProgramacion').dxButton({
    onClick() {    
      window.location.href = '../sistemas/horas_paradas/programacion.html?par_accion=agregar&id=0';
    },
  });

  $('#btnReporte').dxButton({
    onClick() {    
      window.location.href = '../sistemas/horas_paradas/resumen.html?par_accion=agregar&id=0';
    },
  });

  $('#btnNuevoRegistro').dxButton({
    onClick() {    
      window.location.href = '../sistemas/horas_paradas/formulario.html?par_accion=agregar&id=0';
    },
  });

  $('#btnCerrarSesion').dxButton({  
    onClick() {

      $.ajax({ 
      url: '../sistemas/horas_paradas/datos.php',
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
});
