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
            columns: ['Fecha', 'HoraInicio', 'HoraFin', 'Estado'],

        //    columns: [ {
        //     type: "buttons",
        //     buttons: [
        //         {
        //             text: "Custom Action",
        //             onClick: function(e) {
        //                 var rowData = e.row.data;
        //                 alert("Custom action on row: " + rowData.id);
        //             }
        //         }
        //     ]
        // }],

            showBorders: true,
            columnAutoWidth: true,
            onInitialized: function(e) {

              // var dataGrid = e.component 
              // dataGrid.addColumn(
                
              //   {
              //     type: "buttons",
              //     buttons: [
              //         {
              //             text: "Custom Action",
              //             onClick: function(e) {
              //                 var rowData = e.row.data;
              //                 alert("Custom action on row: " + rowData.id);
              //             }
              //         }
              //     ]}
              // )
/*

              console.log("DataGrid content is ready",e);

              var columns = e.component.option("columns");

              
              console.log("columns",columns);
              columnNames = columns.map(function(column) {
                  return column.caption;
              });
              console.log("Column names:", columnNames);

              // Aquí puedes realizar acciones después de que se ha cargado la data
              dataGrid = this
              var newColumns = dataGrid.option("columns");
              console.log("dataGrid",newColumns)
    
              newColumns.push( 
    
                {
                  type: "buttons",
                  buttons: [
                      {
                          text: "Custom Action",
                          onClick: function(e) {
                              var rowData = e.row.data;
                              alert("Custom action on row: " + rowData.id);
                          }
                      }
                  ]}
              );
              dataGrid.option("columns", newColumns);
              */
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
    text: 'Cerrar Sesion',
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
