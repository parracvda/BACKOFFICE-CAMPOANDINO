var is_cmbTipoProducto_pordefecto=null
var is_cmbArea_pordefecto=null
var is_cmbSubArea_pordefecto=null
var is_cmbMaquinaArea_pordefecto=null
var is_cmbMotivo_pordefecto=null
var idxcmbSede
var idxdpFecha
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

$(() => {

  // COMBO DEPENDIENTE SEDE-TIPOPRODUCTO-AREA-SUBAREA-MAQUINA
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbSede' },
    dataType: 'json',
    success(data) {
        
        console.log(data)

        idxcmbSede=$('#cmbSede').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Sedes',
        valueExpr: 'IdSedes',

          onValueChanged(val) {
            console.log("item",val);

        $.ajax({ 
          url: 'datos.php',
          type: 'GET',
          data: { action: 'cmbTipoProducto' ,parametros: val.value },
          dataType: 'json',
          success(data) {
              
              console.log("TipoProducto",data)

              idxcmbTipoProducto=$('#cmbTipoProducto').dxSelectBox({ 
              dataSource: data,
              displayExpr: 'TipoProducto',
              valueExpr: 'IdTipoProducto',
              value: is_cmbTipoProducto_pordefecto,

                onValueChanged(val) {
                  console.log("item",val);

                  $.ajax({ 
                    url: 'datos.php',
                    type: 'GET',
                    data: { action: 'cmbArea' ,parametros: val.value},
                    dataType: 'json',
                    success(data) {
                        
                        console.log("area",data);
            
                        idxcmbArea=$('#cmbArea').dxSelectBox({ 
                        dataSource: data,
                        displayExpr: 'Area',
                        valueExpr: 'IdArea',
                        value: is_cmbArea_pordefecto,
                        onValueChanged(val) {
                          console.log("item",val);


                          $.ajax({ 
                            url: 'datos.php',
                            type: 'GET',
                            data: { action: 'cmbSubArea' ,parametros: val.value},
                            dataType: 'json',
                            success(data) {
                                
                                console.log("subarea",data);
                    
                                idxcmbSubArea=$('#cmbSubArea').dxSelectBox({ 
                                dataSource: data,
                                displayExpr: 'SubArea',
                                valueExpr: 'IdSubArea',
                                value: is_cmbSubArea_pordefecto,
                                onValueChanged(val) {
                                  console.log("item",val);
                      
                                  $.ajax({ 
                                    url: 'datos.php',
                                    type: 'GET',
                                    data: { action: 'cmbMaquinaArea' ,parametros: val.value},
                                    dataType: 'json',
                                    success(data) {
                                        
                                        console.log("maquinaarea",data);
                            
                                        idxcmbMaquinaArea=$('#cmbMaquinaArea').dxSelectBox({ 
                                        dataSource: data,
                                        displayExpr: 'MaquinaArea',
                                        valueExpr: 'IdMaquinaArea',
                                        value: is_cmbMaquinaArea_pordefecto,
                                      }).dxSelectBox("instance");
                                    },
                                    error(textStatus,errorThrown) {             
                                            console.error('Error cmbMaquinaArea:', textStatus, errorThrown);
                                    }, 
                                  });                
                                },
                              }).dxSelectBox("instance");
                              $("#cmbSubArea").dxSelectBox("instance").option("value","0");                
                              $("#cmbSubArea").dxSelectBox("instance").option("value",is_cmbSubArea_pordefecto);
                            },
                            error() {             
                                    console.error('Error cmbSubArea:', textStatus, errorThrown);
                            }, 
                          });     
                        },
                      }).dxSelectBox("instance");                      
                      $("#cmbArea").dxSelectBox("instance").option("value","0");                
                      $("#cmbArea").dxSelectBox("instance").option("value",is_cmbArea_pordefecto);
                    },
                    error() {             
                            console.error('Error cmbArea:', textStatus, errorThrown);                           
                          }, 
                        });     
                      },
                    }).dxSelectBox("instance");                    
                    $("#cmbTipoProducto").dxSelectBox("instance").option("value","0");                
                    $("#cmbTipoProducto").dxSelectBox("instance").option("value",is_cmbTipoProducto_pordefecto);
                  },
                  error() {             
                          console.error('Error cmbTipoProducto:', textStatus, errorThrown);
                    }, 
                  });                
                },
              }).dxSelectBox("instance");
          },
          error() {             
                  console.error('Error cmbSede:', textStatus, errorThrown);
          },    
  });

  idxcmbTipoProducto =$('#cmbTipoProducto').dxSelectBox({  
  }).dxSelectBox("instance");

  idxcmbArea =$('#cmbArea').dxSelectBox({  
  }).dxSelectBox("instance");

  idxcmbSubArea =$('#cmbSubArea').dxSelectBox({  
  }).dxSelectBox("instance");

  idxcmbMaquinaArea =$('#cmbMaquinaArea').dxSelectBox({  
  }).dxSelectBox("instance");
  
  //COMBO AREARESPONSABLE CON MOTIVO
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbAreaResponsable' },
    dataType: 'json',
    success(data) {
        
        console.log(data)

        idxcmbAreaResponsable=$('#cmbAreaResponsable').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'AreaResponsable',
        valueExpr: 'IdAreaResponsable',

          onValueChanged(val) {
            console.log("item",val);

            $.ajax({ 
              url: 'datos.php',
              type: 'GET',
              data: { action: 'cmbMotivo' ,parametros: val.value},
              dataType: 'json',
              success(data) {
                  
                  console.log("motivo",data);
      
                  idxcmbMotivo=$('#cmbMotivo').dxSelectBox({ 
                  dataSource: data,
                  displayExpr: 'MotivoParada',
                  valueExpr: 'IdMotivo',
                  value: is_cmbMotivo_pordefecto,
                }).dxSelectBox("instance");
              },
              error() {             
                      console.error('Error cmbMotivo:', textStatus, errorThrown);
              }, 
            });                
          },
        }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbAreaResponsable:', textStatus, errorThrown);
    }, 
  });
   
  idxcmbMotivo =$('#cmbMotivo').dxSelectBox({  
  }).dxSelectBox("instance");

    const now = new Date();
    
    idxdpFecha=$('#dpFecha').dxDateBox({
      displayFormat: 'dd/MM/yyyy',
      type: 'date',
      value: now,
      inputAttr: { 'aria-label': 'Date' },
    }).dxDateBox("instance");
  
    idxtpHoraInicio=$('#tpHoraInicio').dxDateBox({
      type: 'time',
      // value: now,
      inputAttr: { 'aria-label': 'Time' },
      displayFormat: "HH:mm",
    }).dxDateBox("instance");

    idxtpHoraFin=$('#tpHoraFin').dxDateBox({
      type: 'time',
      //value: now,
      inputAttr: { 'aria-label': 'Time' },
      displayFormat: "HH:mm",
      onValueChanged(data) {
        var difer = DiferenciaSegundos(idxtpHoraInicio.option("value"),new Date(data.value))
        idxtxtTotalHoras.option("value", difer.split(':')[0]+' horas '+difer.split(':')[1] +' minutos')


/*
        let today = new Date();

        // Definir la hora específica como una cadena
        let hora = data.value ;
        
        // Crear una nueva fecha con la fecha actual y la hora específica
        let ld_fecha_fin = new Date(`${today.toISOString().split('T')[0]}T${hora}`);
*/
        let diferencia = calcularDiferenciaHoras(convertirHoraAFormato(idxtpHoraInicio.option("value")),convertirHoraAFormato(new Date(data.value)));
        idxtxtTotalHoras.option("value",`Diferencia: ${diferencia.horas} horas y ${diferencia.minutos} minutos`)    
      },
    }).dxDateBox("instance");
    
    $('#btnAceptar').dxButton({
      stylingMode: 'contained',
      text: 'Guardar',
      type: 'success',
      width: 120,
      onClick() {
          
        if (wf_validar() == false){
            return
        }         
        btnAceptar_click()
        DevExpress.ui.notify('Se guardó con éxito');
      },
    });

    $('#btnRegistros').dxButton({
      stylingMode: 'contained',
      text: 'Registros',
      type: 'success',
      width: 120,
      onClick() {
        window.location.href = 'registros.html';
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

    idxtxtObservacion=$('#txtObservacion').dxTextBox({
      //value: 'UI Superhero',
      valueChangeEvent: 'keyup',
      inputAttr: { 'aria-label': 'Type' },
      maxLength: 40,
      disabled: false,
      onValueChanged(e) {
        // $('.text').text(e.value);
      },
    }).dxTextBox("instance");  

    idxtxtTotalHoras=$('#txtTotalHoras').dxTextBox({
      //value: 'UI Superhero',
      valueChangeEvent: 'keyup',
      inputAttr: { 'aria-label': 'Type' },
      maxLength: 40,
      disabled: true,
      onValueChanged(e) {
        $('.text').text(e.value);
      },
    }).dxTextBox("instance");    
  });
  
  function wf_validar(){

    var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
    var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
    var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
    var dxcmbTipoProducto = $("#cmbTipoProducto").dxSelectBox("instance").option("value");
    var dxcmbArea = $("#cmbArea").dxSelectBox("instance").option("value");
    var dxcmbSubArea = $("#cmbSubArea").dxSelectBox("instance").option("value");
    var dxcmbMaquinaArea = $("#cmbMaquinaArea").dxSelectBox("instance").option("value");
    var dxcmbAreaResponsable = $("#cmbAreaResponsable").dxSelectBox("instance").option("value");
    var dxcmbMotivo = $("#cmbMotivo").dxSelectBox("instance").option("value");
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
    var dxtxtObservacion = $("#txtObservacion").dxTextBox("instance").option("value");
    var dxtxtTotalHoras = $("#txtTotalHoras").dxTextBox("instance").option("value");

    dxdpFecha = formatDate( dxdpFecha )
    dxtpHoraInicio = formatTime( dxtpHoraInicio )
    dxtpHoraFin= formatTime( dxtpHoraFin )

    if (ls_accion =="agregar"){
      if ( dxcmbSede == null ){
        alert("Debe ingresar Sede")
        return false
      }
      if ( dxcmbTipoProducto == null ){
        alert("Debe ingresar Tipo Producto")
        return false
      }

      if ( dxcmbArea == null ){
        alert("Debe ingresar Area")
        return false
      }

      if ( dxcmbSubArea == null ){
        alert("Debe ingresar SubArea")
        return false
      }

      if ( dxcmbMaquinaArea == null ){
        alert("Debe ingresar Maquina Area")
        return false
      }

      if ( dxcmbAreaResponsable == null ){
        alert("Debe ingresar Area Responsable")
        return false
      }

      if ( dxcmbMotivo == null ){
        alert("Debe ingresar Motivo")
        return false
      }

      if ( dxtxtObservacion == null ){
        alert("Debe ingresar Observación")
        return false
      }
      if ( dxtxtTotalHoras == null ){
        alert("Debe Ingresar Hora Inicio y Hora fin")
        return false
      }
    }
    else if (ls_accion =="editar"){
      if ( dxtpHoraInicio >= dxtpHoraFin ){
        alert("Hora Fin no puede ser menor o igual que Hora Inicio")
        return false
      }
    }
    return true
  }

  function btnAceptar_click()
  {
    var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
    var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
    var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
    var dxcmbTipoProducto = $("#cmbTipoProducto").dxSelectBox("instance").option("value");
    var dxcmbArea = $("#cmbArea").dxSelectBox("instance").option("value");
    var dxcmbSubArea = $("#cmbSubArea").dxSelectBox("instance").option("value");
    var dxcmbMaquinaArea = $("#cmbMaquinaArea").dxSelectBox("instance").option("value");
    var dxcmbAreaResponsable = $("#cmbAreaResponsable").dxSelectBox("instance").option("value");
    var dxcmbMotivo = $("#cmbMotivo").dxSelectBox("instance").option("value");
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
    var dxtxtObservacion = $("#txtObservacion").dxTextBox("instance").option("value");
    var dxtxtTotalHoras = $("#txtTotalHoras").dxTextBox("instance").option("value");

    dxtpHoraFin = formatTime( dxtpHoraFin )
    
    dxdpFecha = formatDate( dxdpFecha )
    dxtpHoraInicio = formatTime( dxtpHoraInicio )

    var queryString = window.location.search.substring(1);
    var parametros = queryString.split("&");
    var par = parametros[0].split("=");
    //var ls_accion =par[1]

    if(dxtpHoraFin==null){
      dxtpHoraFin="";
    }

    if (ls_accion =="agregar" )
    {
    ls_parametros=ls_accion +","+dxdpFecha+","+dxtpHoraInicio+","+dxcmbTipoProducto+","+dxcmbMaquinaArea+","+dxcmbAreaResponsable+","+dxcmbMotivo +","+dxcmbArea +","+dxcmbSubArea+ ","+dxcmbSede+","+dxtxtObservacion+ ","+dxtxtTotalHoras+","+dxtpHoraFin ;
    }
    else
    {
      var par1 = parametros[1].split("=");
      var ln_id = par1[1].split("=");

      
      // dxtpHoraFin = formatTime( dxtpHoraFin )

      ls_parametros=ls_accion + ","+ln_id+","+   dxtpHoraFin
    }
    // AGREGADO RECIENTEMENTE
    console.log("par1",ls_parametros)

   $.ajax({ 
      url: 'datos.php',
      type: 'GET',
      data: { action: 'produccion_registrocontrolparadas_agregar' ,parametros: ls_parametros},
      dataType: 'json',
      success(data) {
         
          console.log("produccion_registrocontrolparadas_agregar",data);
      
      },
      error() {             
              console.error('Error guardar:', textStatus, errorThrown);
      }, 
    });    
  }

function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function formatTime(date) {
  if (date == null || date==""){return null}
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  return hours + ':' + minutes;
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

    //cargar el registro
    var queryString = window.location.search.substring(1);
    var parametros = queryString.split("&");
    var parAccion = parametros[0].split("=");
    ls_accion =parAccion[1]

    var parId = parametros[1].split("=");
    var ls_id =parId[1]

    const now = new Date();
  if (ls_accion=="agregar"){
 
    var hora=obtenerHoraActual()
    
    $("#tpHoraInicio").dxDateBox("instance").option("value",now);  
    $("#tpHoraFin").dxDateBox("instance").option("value",null);   
    // idxtpHoraInicio.focus()
    // $("#tpHoraFin").dxDateBox("instance").option("value",ldt_HoraInicio);
    var ii=1
    ii=ii+1

  }else if(ls_accion=="editar"){
    
    $.ajax({ 
      url: 'datos.php',
      type: 'GET',
      data: { action: 'obtenerPorID' ,parametros: ls_id},
      dataType: 'json',
      success(data) {
         
          console.log("obtenerPorID",data);

          //Idregistrocontrolparadas, Fecha, HoraInicio, TipoProducto, MaquinaLinea, AreaResponsable, Motivo, HoraFin, Estado
        
          let ld_Fecha = new Date(data[0].Fecha);
          //let ls_HoraInicio = '1970-01-01T' + data[0].HoraInicio + 'Z';
          let ldt_HoraInicio =convertTimeStringToDate(data[0].HoraInicio);
          // let ls_HoraFin = '1970-01-01T' + data[0].HoraFin + 'Z';
          let ldt_HoraFin = convertTimeStringToDate(data[0].HoraFin );  
          let ls_Observacion = data[0].Observacion;  
          let ls_TotalHoras = convertTimeStringToDate(data[0].TotalHoras);     

          
          $("#dpFecha").dxDateBox("instance").option("value",ld_Fecha);
          $("#tpHoraInicio").dxDateBox("instance").option("value",ldt_HoraInicio);
          $("#cmbSede").dxSelectBox("instance").option("value",data[0].Sede);
          is_cmbTipoProducto_pordefecto = data[0].TipoProducto
          $("#cmbTipoProducto").dxSelectBox("instance").option("value",data[0].TipoProducto);
          is_cmbArea_pordefecto = data[0].Area
          $("#cmbArea").dxSelectBox("instance").option("value",data[0].Area);
          is_cmbSubArea_pordefecto = data[0].SubArea
          $("#cmbSubArea").dxSelectBox("instance").option("value",data[0].SubArea);
          is_cmbMaquinaArea_pordefecto = data[0].Maquina
          $("#cmbAreaResponsable").dxSelectBox("instance").option("value",data[0].AreaResponsable);
          is_cmbMotivo_pordefecto = data[0].Motivo

          if (ldt_HoraFin==""){
            ldt_HoraFin=null
          }
          


          
          $("#tpHoraFin").dxDateBox("instance").option("value",ldt_HoraFin);
          //$("#tpHoraFin").dxDateBox("instance").option("value","");
          $("#txtObservacion").dxTextBox("instance").option("value",ls_Observacion);
          $("#txtTotalHoras").dxTextBox("instance").option("value",ls_TotalHoras);

          idxcmbSede.option("disabled", true);
          idxdpFecha.option("disabled", true);
          idxcmbTipoProducto.option("disabled", true);
          idxcmbArea.option("disabled", true);
          idxcmbSubArea.option("disabled", true);
          idxcmbMaquinaArea.option("disabled", true);
          idxcmbAreaResponsable.option("disabled", true);
          idxcmbMotivo.option("disabled", true);
          idxtpHoraInicio.option("disabled", true);
          idxtxtObservacion.option("disabled", true);
          idxtxtTotalHoras.option("disabled", true);
          idxtpHoraFin.focus()
      },
      error() {             
              console.error('Error guardar:', textStatus, errorThrown);
      }, 
    }); 
  }
  });

  function convertTimeStringToDate(timeString) {
    if (timeString==null){return ""}
    // Asumimos que el formato de la cadena es "HH:MM" o "HH:MM:SS"
    let timeParts = timeString.split(':');
    let date = new Date();
    date.setHours(parseInt(timeParts[0], 10));
    date.setMinutes(parseInt(timeParts[1], 10));
    
    if (timeParts.length > 2) {
        date.setSeconds(parseInt(timeParts[2], 10));
    } else {
        date.setSeconds(0);
    }  
    date.setMilliseconds(0);
    return date;
}

function obtenerHoraActual() {
let now = new Date();

// Obtener las horas, minutos y segundos actuales
let hours = String(now.getHours()).padStart(2, '0');    // Horas (0-23)
let minutes = String(now.getMinutes()).padStart(2, '0'); // Minutos (0-59)

return convertTimeStringToDate( hours + ":"+minutes)
}

function dateDiff(ad_FechaFinal,date) {
  const diffInDay = Math.floor(Math.abs((ad_FechaFinal - date) / (24 * 60 * 60 * 1000)));
  //return $('#age').text(`${diffInDay} days`);
  return diffInDay
}

function DiferenciaSegundos(startDate, endDate) {
  // Convertir fechas a milisegundos
  let startTime = startDate.getTime();
  let endTime = endDate.getTime();

  // Obtener la diferencia en milisegundos
  let difference = endTime - startTime;

  // Calcular la diferencia en horas, minutos y segundos
  let hours = Math.floor(difference / (1000 * 60 * 60));
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  // let seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Formatear los valores para que siempre tengan dos dígitos
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  // seconds = String(seconds).padStart(2, '0');

  // Devolver la diferencia formateada
  return `${hours}:${minutes}`;
}

function calcularDiferenciaHoras(horaInicio, horaFin) {
  // Crear objetos Date para las horas de inicio y fin
  let fechaActual = new Date();
  
  // Separar horas y minutos de las cadenas de tiempo
  let [horasInicio, minutosInicio] = horaInicio.split(':').map(Number);
  let [horasFin, minutosFin] = horaFin.split(':').map(Number);
  
  // Establecer las horas y minutos en las fechas correspondientes
  let inicio = new Date(fechaActual.setHours(horasInicio, minutosInicio, 0, 0));
  let fin = new Date(fechaActual.setHours(horasFin, minutosFin, 0, 0));
  
  // Si la hora de fin es menor que la hora de inicio, sumamos un día a la hora de fin
  if (fin < inicio) {
      fin.setDate(fin.getDate() + 1);
  }
  
  // Calcular la diferencia en milisegundos
  let diferenciaMs = fin - inicio;
  
  // Convertir la diferencia de milisegundos a horas y minutos
  let diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
  let diferenciaMinutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return { horas: diferenciaHoras, minutos: diferenciaMinutos };
}

function convertirHoraAFormato(hora) {
  // Obtener las horas y minutos de la fecha
  let horas = hora.getHours().toString().padStart(2, '0'); // Obtener las horas y convertir a cadena con 2 dígitos
  let minutos = hora.getMinutes().toString().padStart(2, '0'); // Obtener los minutos y convertir a cadena con 2 dígitos

  // Combinar las horas y minutos en el formato deseado
  return `${horas}:${minutos}`;
}