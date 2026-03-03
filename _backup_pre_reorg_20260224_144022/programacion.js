var is_cmbTipoProducto_pordefecto=null
var is_cmbArea_pordefecto=null
var is_cmbSubArea_pordefecto=null
var is_cmbMaquinaArea_pordefecto=null
var is_cmbMotivo_pordefecto=null
var is_cmbTurno_pordefecto=null
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
var idxcmbTurno
var ls_accion
var idxtxtObservacion
var idxtxtTotalHoras


$(() => {

   // Verifica si la URL tiene los parámetros necesarios
  const params = new URLSearchParams(window.location.search);
  if (!params.get('par_accion') || !params.get('id')) {
    // Redirige agregando los parámetros por defecto
    window.location.href = 'programacion.html?par_accion=agregar&id=0';
    return;
  }

  // Asigna los valores a las variables globales
  ls_accion = params.get('par_accion');
  ls_id = params.get('id');

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

      console.log("Maquinas recibidas:", data);

      const maquinasSeccionado = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 31, 34, 40];
      const maquinasEncolado = [21];
      const maquinasFondosTapas = [22, 23, 24, 25];
      const maquinasEnsamblaje = [26, 32, 33, 35, 36, 37, 38, 39];

      idxcmbMaquinaArea = $('#cmbMaquinaArea').dxTagBox({
        dataSource: data,
        displayExpr: 'MaquinaArea',
        valueExpr: 'IdMaquinaArea',
        placeholder: "Seleccione una o varias máquinas",
        showSelectionControls: true,
        maxDisplayedTags: 0,
        height: 40,
        onOpened: function(e) {
        setTimeout(function() {
          const popupContent = $(e.component.content());
          if (popupContent.find('.btn-seccionado').length === 0) {
            const header = popupContent.find('.dx-list-select-all');
            if (header.length) {
              // HTML para cada grupo
              const grupos = [
                { clase: 'btn-seccionado', texto: 'Seccionado', maquinas: maquinasSeccionado },
                { clase: 'btn-encolado', texto: 'Encolado', maquinas: maquinasEncolado },
                { clase: 'btn-fondostapas', texto: 'Fondos y Tapas', maquinas: maquinasFondosTapas },
                { clase: 'btn-ensamblaje', texto: 'Ensamblaje', maquinas: maquinasEnsamblaje }
              ];
              // Inserta cada grupo debajo del anterior
              let last = header;
              grupos.forEach(grupo => {
                const html = `
                  <div class="dx-item dx-list-item dx-list-select-all ${grupo.clase}" 
                      style="margin: 0 0 0 0; cursor:pointer; color:#bfa100; font-weight:600; display:block;">
                    <div class="dx-checkbox dx-widget">
                      <div class="dx-checkbox-container">
                        <span class="dx-checkbox-icon"></span>
                      </div>
                    </div>
                    <span class="dx-checkbox-text" style="margin-left:8px;">${grupo.texto}</span>
                  </div>
                `;
                last = $(html).insertAfter(last)
                  .on('click', function() {
                    const current = (e.component.option('value') || []).map(String);
                    const maquinasStr = grupo.maquinas.map(String);
                    const allSelected = maquinasStr.every(id => current.includes(id));
                    if (!allSelected) {
                      e.component.option('value', [...new Set([...current, ...maquinasStr])]);
                    } else {
                      let nuevo = current.filter(id => !maquinasStr.includes(id));
                      e.component.option('value', nuevo);
                    }
                  });
              });
              // Mueve todos los botones antes del separador
              const separator = header.next('.dx-list-select-all-separator');
              if (separator.length) {
                popupContent.find('.btn-seccionado, .btn-encolado, .btn-fondostapas, .btn-ensamblaje').insertBefore(separator);
              }
            }
          }
          // Sincroniza los checkboxes visuales de todos los grupos
          sincronizarCheckboxGrupos(e.component);
        }, 0);
      },
        onValueChanged: function(e) {
          console.log("onValueChanged", e.value);
          // Muestra debajo las máquinas seleccionadas
          const seleccionados = data.filter(item => e.value.includes(item.IdMaquinaArea));
          let html = '';
          if (seleccionados.length > 0) {
            html = '<div style="padding:6px 0 0 0;"><b>MÁQUINAS SELECCIONADAS:</b><ul style="margin:4px 0 0 16px;">';
            seleccionados.forEach(item => {
              html += `<li>${item.MaquinaArea}</li>`;
            });
            html += '</ul></div>';
          }
          document.getElementById('maquinasSeleccionadas').innerHTML = html;

          // Sincroniza el checkbox visual de Seccionado cada vez que cambia el valor
          sincronizarCheckboxGrupos(e.component);
        }
      }).dxTagBox("instance");

      // Función para sincronizar el checkbox visual de Seccionado
      function sincronizarCheckboxGrupos(tagBoxInstance) {
        const popupContent = $(tagBoxInstance.content ? tagBoxInstance.content() : '.dx-overlay-content:visible');
        const grupos = [
          { clase: 'btn-seccionado', maquinas: maquinasSeccionado },
          { clase: 'btn-encolado', maquinas: maquinasEncolado },
          { clase: 'btn-fondostapas', maquinas: maquinasFondosTapas },
          { clase: 'btn-ensamblaje', maquinas: maquinasEnsamblaje }
        ];
        grupos.forEach(grupo => {
          const $btn = popupContent.find('.' + grupo.clase);
          if ($btn.length) {
            const current = (tagBoxInstance.option('value') || []).map(String);
            const maquinasStr = grupo.maquinas.map(String);
            const allSelected = maquinasStr.every(id => current.includes(id));
            if (allSelected) {
              $btn.find('.dx-checkbox').addClass('dx-checkbox-checked');
            } else {
              $btn.find('.dx-checkbox').removeClass('dx-checkbox-checked');
            }
          }
        });
      }
    },
    error(xhr, textStatus, errorThrown) {             
      console.error('Error cmbMaquinaArea:', textStatus, errorThrown);
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
      // disabled: true,
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
        // DevExpress.ui.notify('Se guardó con éxito', 'success', 3000);
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
              window.location.href = 'index.html?par_accion=agregar&id=0';
          },
          error(e) {             
                  console.error('Error logout:', e);
          }, 
        });      
      },
    });

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

    var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
    var dxcmbTurno = $("#cmbTurno").dxSelectBox("instance").option("value");
    var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
    var dxtxtTotalHoras = $("#txtTotalHoras").dxTextBox("instance").option("value");
    var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
    var dxcmbMaquinaArea = $("#cmbMaquinaArea").dxTagBox("instance").option("value");

    dxdpFecha = formatDate( dxdpFecha )
    dxtpHoraInicio = formatTime( dxtpHoraInicio )
    dxtpHoraFin = formatTime(dxtpHoraFin)

    if (ls_accion =="agregar"){

      if ( dxcmbTurno == null ){
        DevExpress.ui.notify('Debe ingresar Turno', 'warning', 3000);
        return false
      }

      if ( dxtxtTotalHoras == null ){
        DevExpress.ui.notify('Debe ingresar Hora Inicio y Hora Fin', 'warning', 3000);
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

    }
    else if (ls_accion =="editar"){
      if ( dxtpHoraInicio >= dxtpHoraFin ){
         DevExpress.ui.notify('Hora Fin no puede ser menor o igual que Hora Inicio', 'warning', 3000);
        return false
      }
    }
    return true
  }

  function btnAceptar_click() {
  var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
  var dxcmbTurno = $("#cmbTurno").dxSelectBox("instance").option("value");
  var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
  var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
  var dxtxtTotalHoras = $("#txtTotalHoras").dxTextBox("instance").option("value");
  var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
  var dxcmbMaquinaArea = $("#cmbMaquinaArea").dxTagBox("instance").option("value"); // array de máquinas

  dxdpFecha = formatDate(dxdpFecha);

  // Si son string, conviértelos a Date
  var horaInicioObj = dxtpHoraInicio;
  var horaFinObj = dxtpHoraFin;
  if (!(horaInicioObj instanceof Date)) horaInicioObj = new Date("1970-01-01T" + horaInicioObj + ":00");
  if (!(horaFinObj instanceof Date)) horaFinObj = new Date("1970-01-01T" + horaFinObj + ":00");

  // Calcula los minutos correctamente
  var totalMinutos = Math.round((horaFinObj - horaInicioObj) / (1000 * 60));
  var dxtpHoraInicioStr = formatTime(dxtpHoraInicio);
  var dxtpHoraFinStr = formatTime(dxtpHoraFin);

  // Obtén el id del usuario desde localStorage
  const idUsuario = localStorage.getItem('idUsuario');
  if (!idUsuario) {
    DevExpress.ui.notify({
      message: "Debe iniciar sesión nuevamente.",
      type: "warning", // Esto lo muestra en anaranjado
      displayTime: 3000,
      position: {
        my: "center center",
        at: "center center",
        of: window,
      }
    });
    return;
  }

  console.log("ls_accion:", ls_accion);
  if (ls_accion == "agregar") {
    dxcmbMaquinaArea.forEach(function(maquinaId) {
      var parametros = [
        ls_accion,
        dxdpFecha,
        dxcmbTurno,
        dxtpHoraInicioStr,
        dxtpHoraFinStr,
        totalMinutos,
        dxcmbSede,
        maquinaId,
        // idUsuario
      ].join(",");
      $.ajax({
        url: 'datos.php',
        type: 'GET',
        data: { action: 'produccion_registroprogramacion_agregar', parametros: parametros, idUsuario: idUsuario },
        dataType: 'json',
        success: function(data) {
          if (data.success) {
            DevExpress.ui.notify({
              message: 'Se guardó con éxito',
              type: 'success',
              displayTime: 3000,
              position: {
                my: 'center center',
                at: 'center center',
                of: window
              }
            });
            setTimeout(() => {
              window.location.href = "panel.html";
            }, 1000);
          } else {
            DevExpress.ui.notify(data.mensaje || 'No se pudo guardar', 'error', 3000);
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          DevExpress.ui.notify('Error al guardar', 'error', 3000);
          console.error('Error guardar:', textStatus, errorThrown);
        }
      });
    });
  }
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
        console.log("Usuario obtenido:", data);
        if (typeof data === 'object') {
          localStorage.setItem('idUsuario', data.idUsuario);
          localStorage.setItem('nombreUsuario', data.nombreUsuario);
          lblUsuario.innerHTML = data.nombreUsuario;
        } else {
          DevExpress.ui.notify("No se pudo obtener información del usuario.", "error", 4000);
        }
      },
      error(xhr, textStatus, errorThrown) {
        console.error('Error guardar:', textStatus, errorThrown);
      }, 
    }); 

    //cargar el registro
    // var queryString = window.location.search.substring(1);
    // var parametros = queryString.split("&");
    // var parAccion = parametros[0].split("=");
    // ls_accion =parAccion[1]

    // var parId = parametros[1].split("=");
    // var ls_id =parId[1]

    const now = new Date();
    if (ls_accion=="agregar"){

   var hora=obtenerHoraActual()
    
    $("#tpHoraInicio").dxDateBox("instance").option("value",now);  
    $("#tpHoraFin").dxDateBox("instance").option("value",now);   

    var ii=1
    ii=ii+1

    }
    
    else if(ls_accion=="editar"){
    
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
          let ldt_HoraInicio =convertTimeStringToDate(data[0].HoraInicio);
          let ldt_HoraFin = convertTimeStringToDate(data[0].HoraFin );  
          let ls_TotalHoras = convertTimeStringToDate(data[0].TotalHoras); 
     
          $("#dpFecha").dxDateBox("instance").option("value",ld_Fecha);
          $("#cmbTurno").dxSelectBox("instance").option("value",data[0].Turno);  
          $("#tpHoraInicio").dxDateBox("instance").option("value",ldt_HoraInicio);
          $("#cmbSede").dxSelectBox("instance").option("value",data[0].Sede);    
          $("#cmbMaquinaArea").dxTagBox("instance").option("value",data[0].Maquina);    
          is_cmbMaquinaArea_pordefecto = data[0].Maquina
          is_cmbTurno_pordefecto = data[0].Turno   

           if (ldt_HoraFin==""){
            ldt_HoraFin=null
          }       
          
          $("#tpHoraFin").dxDateBox("instance").option("value",ldt_HoraFin);
          $("#txtTotalHoras").dxTextBox("instance").option("value",ls_TotalHoras);
      },
      error() {             
              console.error('Error guardar:', textStatus, errorThrown);
      } 
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

