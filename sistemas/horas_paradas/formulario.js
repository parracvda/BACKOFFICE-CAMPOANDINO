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

$(() => {

  //COMBO TURNO
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbTurno' },
    dataType: 'json',
    success(data) {
        
        console.log("Turnos recibidos:",data)

        idxcmbTurno=$('#cmbTurno').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Turno',
        valueExpr: 'IdTurno',
        value: null,
        placeholder: "Seleccione un turno",

          onValueChanged(val) {
            console.log("item",val);       
          },
        }).dxSelectBox("instance");
    },
    error(xhr, textStatus, errorThrown) {             
            console.error('Error cmbTurno:', textStatus, errorThrown);
    }, 
  });

 //COMBO SEDE
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbSede' },
    dataType: 'json',
    success(data) {
        
        console.log("Sedes recibidas:",data)

        idxcmbSede=$('#cmbSede').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Sedes',
        valueExpr: 'IdSedes',
        value: null,
        placeholder: "Seleccione una sede",

          onValueChanged(val) {
            console.log("item",val);       
          },
        }).dxSelectBox("instance");
    },
    error(xhr, textStatus, errorThrown) {             
            console.error('Error cmbSede:', textStatus, errorThrown);
    }, 
  });

  //COMBO MAQUINA
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbMaquinaArea' },
    dataType: 'json',
    success(data) {
        
        console.log("Maquinas recibidas:",data)

        idxcmbMaquinaArea=$('#cmbMaquinaArea').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'MaquinaArea',
        valueExpr: 'IdMaquinaArea',
        value: null,
        placeholder: "Seleccione una máquina",

          onValueChanged(val) {
            console.log("item",val);       
          },
        }).dxSelectBox("instance");
    },
    error(xhr, textStatus, errorThrown) {             
            console.error('Error cmbMaquinaArea:', textStatus, errorThrown);
    }, 
  });

 //COMBO MOTIVO
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbMotivo' },
    dataType: 'json',
    success(data) {
        
        console.log("Motivos recibidos:",data)

        idxcmbMotivo=$('#cmbMotivo').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'MotivoParada',
        valueExpr: 'IdMotivo',
        // disabled: true,
        value: null,
        placeholder: "Seleccione un motivo",

          onValueChanged(val) {
            console.log("item",val);       
          },
        }).dxSelectBox("instance");
    },
    error(xhr, textStatus, errorThrown) {             
            console.error('Error cmbMotivo:', textStatus, errorThrown);
    }, 
  });

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
      disabled: true,
      //value: now,
      inputAttr: { 'aria-label': 'Time' },
      displayFormat: "HH:mm",
      onValueChanged(data) {
        var difer = DiferenciaSegundos(idxtpHoraInicio.option("value"),new Date(data.value))
        idxtxtTotalHoras.option("value", difer.split(':')[0]+' horas '+difer.split(':')[1] +' minutos')

        let diferencia = calcularDiferenciaHoras(convertirHoraAFormato(idxtpHoraInicio.option("value")),convertirHoraAFormato(new Date(data.value)));
        idxtxtTotalHoras.option("value",`${diferencia.horas} horas y ${diferencia.minutos} minutos`)//AQUI SE AGREGA TEXTO PARA QUE SALGA EN EL TEXTBOX DE TOTAL HORAS    
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
        window.location.href = 'registrosp.html';
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
              var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
              window.location.href = baseUrl + '/public/index.html';
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
      
      cargarProgramacionAlIniciar(formatDate(idxdpFecha.option("value")));

      idxdpFecha.option("onValueChanged", function(e) {
        cargarProgramacionAlIniciar(formatDate(e.value));
    });

        cargarProgramacionAlIniciar();

  });

  function wf_validar(){

    var dxcmbTurno = $("#cmbTurno").dxSelectBox("instance").option("value");
    var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
    var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
    var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
    // var dxcmbTipoProducto = $("#cmbTipoProducto").dxSelectBox("instance").option("value");
    // var dxcmbArea = $("#cmbArea").dxSelectBox("instance").option("value");
    // var dxcmbSubArea = $("#cmbSubArea").dxSelectBox("instance").option("value");
    var dxcmbMaquinaArea = $("#cmbMaquinaArea").dxSelectBox("instance").option("value");
    // var dxcmbAreaResponsable = $("#cmbAreaResponsable").dxSelectBox("instance").option("value");
    var dxcmbMotivo = $("#cmbMotivo").dxSelectBox("instance").option("value");
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
    // var dxtxtObservacion = $("#txtObservacion").dxTextBox("instance").option("value");
    var dxtxtTotalHoras = $("#txtTotalHoras").dxTextBox("instance").option("value");

    dxdpFecha = formatDate( dxdpFecha )
    dxtpHoraInicio = formatTime( dxtpHoraInicio )
    dxtpHoraFin= formatTime( dxtpHoraFin )

    if (ls_accion =="agregar"){

      if ( dxcmbTurno == null ){
         DevExpress.ui.notify('Debe ingresar Turno', 'warning', 3000);
        return false
      }

      if ( dxcmbSede == null ){
         DevExpress.ui.notify('Debe ingresar Sede', 'warning', 3000);
        return false
      }

      if ( dxcmbMaquinaArea == null ){
        DevExpress.ui.notify('Debe ingresar Maquina', 'warning', 3000);
        return false
      }

      if ( dxtxtTotalHoras == null ){
        DevExpress.ui.notify('Debe ingresar Hora Inicio y Hora Fin', 'warning', 3000);
        return false
      }
    }
    else if (ls_accion =="editar"){
      if ( dxtpHoraInicio >= dxtpHoraFin ){
         DevExpress.ui.notify('Hora Fin no puede ser menor o igual que Hora Inicio', 'warning', 3000);
        return false
      }
    }
    return true
  }

  //HABILITADO DE CONTROLES EN FUNCION DE PROGRAMACION

  function habilitarControles(habilitar) {
      idxdpFecha.option("disabled", !habilitar);
      idxcmbTurno.option("disabled", !habilitar);
      idxcmbSede.option("disabled", !habilitar);
      idxcmbMaquinaArea.option("disabled", !habilitar);
      idxtpHoraInicio.option("disabled", !habilitar);
      idxcmbMotivo.option("disabled", !habilitar);
      idxtpHoraFin.option("disabled", !habilitar);
      idxtxtTotalHoras.option("disabled", true); // siempre deshabilitado
      $("#btnAceptar").dxButton("instance").option("disabled", !habilitar);
  }

  // Función para validar programación
  function validarProgramacionPorFecha(fecha) {
      $.ajax({
          url: 'datos.php',
          type: 'GET',
          data: { action: 'existe_programacion', parametros: fecha },
          dataType: 'json',
          success: function(data) {
              if (data && data.existe) {
                  habilitarControles(true);
              } else {
                  habilitarControles(false);
                  DevExpress.ui.notify('Sin programación', 'warning', 6000);
              }
          },
          error: function() {
              habilitarControles(false);
              DevExpress.ui.notify('Error al validar programación', 'error', 3000);
          }
      });
  }

  function horaToMinutos(hora) {
    // hora en formato 'HH:MM' o 'HH:MM:SS'
    let partes = hora.split(':');
    return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
}


  function cargarProgramacionAlIniciar() {
    let fecha = formatDate(idxdpFecha.option("value"));
    let hora = formatTime(idxtpHoraInicio.option("value"));

    $.ajax({
        url: 'datos.php',
        type: 'GET',
        data: { action: 'obtener_programacion_por_fecha', parametros: fecha },
        dataType: 'json',
        success: function(data) {
           console.log("Respuesta del backend:", data[0]); 
            if (data && data.length > 0) {
                let prog = data[0];

                // Validar hora
                let horaParada = formatTime(idxtpHoraInicio.option("value")).substring(0,5); // 'HH:MM'
                let horaProgInicio = prog.HoraInicio.substring(0,5); // 'HH:MM'
                let horaProgFin = prog.HoraFin.substring(0,5); // 'HH:MM'

                let minParada = horaToMinutos(horaParada);
                let minInicio = horaToMinutos(horaProgInicio);
                let minFin = horaToMinutos(horaProgFin);

                if (minParada >= minInicio && minParada <= minFin) {
                  if (idxcmbTurno) idxcmbTurno.option("value", String(prog.IdTurno));
                  if (idxcmbSede) idxcmbSede.option("value", String(prog.IdSedes));
                  if (idxcmbMaquinaArea) idxcmbMaquinaArea.option("value", String(prog.IdMaquinaArea));

                   // Aquí bloqueas los controles
                  if (idxdpFecha) idxdpFecha.option("disabled", true);
                  if (idxcmbTurno) idxcmbTurno.option("disabled", true);
                  if (idxcmbSede) idxcmbSede.option("disabled", true);
                  if (idxcmbMaquinaArea) idxcmbMaquinaArea.option("disabled", true);

                    // habilitarControles(true);
                } else {
                    habilitarControles(false);
                    DevExpress.ui.notify('Hora de parada fuera del rango programado', 'warning', 3000);
                }
            } else {
                habilitarControles(false);
                DevExpress.ui.notify('Sin programación para la fecha seleccionada', 'warning', 3000);
            }
        },
        error: function() {
            habilitarControles(false);
            DevExpress.ui.notify('Error al consultar programación', 'error', 3000);
        }
    });
}

  function btnAceptar_click()
  {
    var dxcmbTurno = $("#cmbTurno").dxSelectBox("instance").option("value");
    var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
    var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
    var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
    var dxcmbMaquinaArea = $("#cmbMaquinaArea").dxSelectBox("instance").option("value");
    var dxcmbMotivo = $("#cmbMotivo").dxSelectBox("instance").option("value");
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
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

    if (ls_accion =="agregar")
    {
      // let motivo = null; // o null, según tu modelo de datos
      // ls_parametros=ls_accion + ","+dxcmbSede+","+dxdpFecha+","+dxcmbMaquinaArea+","+dxtpHoraInicio+";"+motivo+","+dxtpHoraFin+","+dxtxtTotalHoras;
      let motivo = $("#cmbMotivo").dxSelectBox("instance").option("value");
      ls_parametros=[ls_accion, dxcmbTurno, dxcmbSede, dxdpFecha, dxcmbMaquinaArea, dxtpHoraInicio, motivo, "", ""].join(",");
    }
    else if (ls_accion == "editar")
    {
      var par1 = parametros[1].split("=");
      var ln_id = par1[1].split("=");

      var horaInicioObj = convertTimeStringToDate(dxtpHoraInicio);
      var horaFinObj = convertTimeStringToDate(dxtpHoraFin);
      var totalMinutos = "";
      if (horaInicioObj && horaFinObj && !isNaN(horaInicioObj.getTime()) && !isNaN(horaFinObj.getTime())) {
        totalMinutos = Math.floor((horaFinObj - horaInicioObj) / (1000 * 60));
      }
        ls_parametros = [
          ls_accion,
          ln_id,
          dxcmbMotivo,
          dxtpHoraFin,
          totalMinutos // Aquí sí va el valor en minutos
        ].join(",");
    }


    console.log("par1",ls_parametros)
    

   $.ajax({ 
      url: 'datos.php',
      type: 'GET',
      data: { action: 'produccion_registrocontrolparadas_agregar' ,parametros: ls_parametros},
      dataType: 'json',
      success(data) {   
          console.log("produccion_registrocontrolparadas_agregar",data);
           if (ls_accion == "agregar") {
            window.location.href = "registrosp.html";
           }
           else if (ls_accion == "editar") {
            window.location.href = "registrosp.html";
           }
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
        
          let fechaStr = data[0].Fecha; // formato: '2025-06-06'
          let partes = fechaStr.split('-');
          let ld_Fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));

          // let ld_Fecha = new Date(data[0].Fecha);
          let ldt_HoraInicio =convertTimeStringToDate(data[0].HoraInicio);
          let ldt_HoraFin = convertTimeStringToDate(data[0].HoraFin );  
          let ls_TotalHoras = convertTimeStringToDate(data[0].TotalHoras);     
     
          $("#dpFecha").dxDateBox("instance").option("value",ld_Fecha);
          $("#tpHoraInicio").dxDateBox("instance").option("value",ldt_HoraInicio);
          $("#cmbTurno").dxSelectBox("instance").option("value",data[0].Turno); 
          $("#cmbSede").dxSelectBox("instance").option("value",data[0].Sede);    
          $("#cmbMaquinaArea").dxSelectBox("instance").option("value",data[0].Maquina);  
          $("#cmbMotivo").dxSelectBox("instance").option("value",data[0].Motivo);    
          is_cmbMaquinaArea_pordefecto = data[0].Maquina
          is_cmbMotivo_pordefecto = data[0].Motivo

          if (ldt_HoraFin==""){
            ldt_HoraFin=null
          }       
          
          $("#tpHoraFin").dxDateBox("instance").option("value",ldt_HoraFin);
          $("#txtTotalHoras").dxTextBox("instance").option("value",ls_TotalHoras);

          idxcmbTurno.option("disabled", true);
          idxcmbSede.option("disabled", true);
          idxdpFecha.option("disabled", true);
          idxcmbMaquinaArea.option("disabled", true);
          idxtpHoraInicio.option("disabled", true);
          idxcmbMotivo.option("disabled", false);
          idxtpHoraFin.option("disabled", false);
          idxtxtTotalHoras.option("disabled", true);
          idxcmbMotivo.focus()
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

