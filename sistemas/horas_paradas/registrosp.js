// Refresca la grilla de detalle tras cerrar turno
// Recarga la grilla de detalle consultando de nuevo al backend
function recargarDetalleGrid() {
  if (typeof mostrarPopupDetalle === 'function') {
    mostrarPopupDetalle();
  }
}
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
var motivoAnterior = null; // <-- variable global

function cerrarTurno(registro, motivoCierre, statusTurnoMaquina, hxJustificar) {
  // Si el registro NO tiene Idregistrocontrolparadas, es solo programación
  // Si sí tiene, es una parada y se actualiza
  $.ajax({
    url: 'datos.php',
    type: 'GET',
    data: {
      action: 'cerrar_turno_maquina',
      fecha: registro.Fecha,
      sede: registro.IdSedes,
      turno: registro.IdTurno,
      maquina: registro.IdMaquinaArea,
      totalHoras: registro.HProgramadas, // o el campo correcto
      motivoCierre: motivoCierre,
      statusTurnoMaquina: statusTurnoMaquina,
      hxJustificar: hxJustificar
    },
    dataType: 'json',
    success: function(response) {
      DevExpress.ui.notify("Turno cerrado correctamente", "success", 3000);
      // Actualiza la grilla si es necesario
    },
    error: function(xhr) {
      DevExpress.ui.notify("Error al cerrar turno", "error", 3000);
    }
  });
}

function enviarAlertaWhatsAppBackend(motivo) {
  // Obtén los valores seleccionados de los combos
  const sede = $("#cmbSede").dxSelectBox("instance").option("text");
  const maquina = $("#cmbMaquinaArea").dxSelectBox("instance").option("text");

  // Construye el mensaje con los datos elegidos
  const mensaje = `[SHP] - Sede: ${sede}, Máquina: ${maquina}, Motivo: ${motivo}`;
  const telefono = "51956821035";
  const apikey = "5771415";

  $.ajax({
    url: 'datos.php',
    type: 'GET',
    data: {
      action: 'enviar_whatsapp_alerta',
      telefono: telefono,
      mensaje: mensaje,
      apikey: apikey
    },
    success: function(response) {
      console.log("WhatsApp enviado desde backend:", response);
      window.location.href = "registrosp.html?par_accion=agregar";
    },
    error: function(xhr) {
      console.error("Error al enviar WhatsApp desde backend:", xhr.responseText);
      window.location.href = "registrosp.html?par_accion=agregar";
    }
  });
}

function mostrarPopupDetalle(idRegistro) {
  // Muestra el popup
  $("#popupDetalle").dxPopup("instance").show();

  // Decide la acción y los parámetros según si hay idRegistro o no
  var accion = idRegistro ? 'detalle_registro' : 'detalle_todas_maquinas';
  var parametros = idRegistro ? idRegistro : '';

  // Llama al backend para obtener los datos del detalle
  $.ajax({
    url: 'datos.php',
    type: 'GET',
    data: { action: accion, parametros: parametros },
    dataType: 'json',
    success: function(data) {
      console.log(data);
      // Crea el datagrid de detalle
        $("#detalleGrid").dxDataGrid({
          dataSource: data,
          width: '100%',
          height: '100%',
          columnAutoWidth: true,
          scrolling: {
            mode: "standard",
            useNative: false
          },
          columns: [
            { dataField: "IdSedes", visible: false },
            { dataField: "Fecha", caption: "Fecha" },
            { dataField: "Turno" },
            { dataField: "Maquina" },
            {
              dataField: "HProgramadas",
              caption: "H. Programadas",
              calculateCellValue: function(rowData) {
                let horas = Number(rowData.HProgramadas);
                if (isNaN(horas) || horas === 0) return "0.00";
                return horas.toFixed(2);
              }
            },
            {
              dataField: "HParadas",
              caption: "H. Paradas",
              calculateCellValue: function(rowData) {
                let horas = Number(rowData.HParadas ?? 0);
                if (isNaN(horas) || horas === 0) return "0.00";
                return horas.toFixed(2);
              }
            },
            {
              dataField: "HxJustificar",
              caption: "H x Justificar",
              calculateCellValue: function(rowData) {
                let horas = Number(rowData.HxJustificar);
                if (isNaN(horas) || horas === 0) return "0.00";
                return horas.toFixed(2);
              }
            },
            {
              dataField: "EstatusTurnoMaquina",
              caption: "EstatusTurnoMaquina",
              cellTemplate: function(container, options) {
                const estado = options.data.EstatusTurnoMaquina;
                const colorClass = estado === "CERRADO" ? "estado-cerrado" : "estado-abierto";
                $("<span>")
                  .addClass(colorClass)
                  .text(estado)
                  .css("font-weight", "bold")
                  .appendTo(container);
              }
            },
            {
              dataField: "Accion",
              caption: "Acción",
              allowSorting: false,
              allowFiltering: false,
              cellTemplate: function(container, options) {
                const esCerrado = Number(options.data.HxJustificar) === 0;
                $("<div>")
                  .dxButton({
                    icon: "add",
                    type: "default",
                    stylingMode: "contained",
                    hint: "Cerrar Turno",
                    disabled: esCerrado,
                    onClick: function(e) {
                      if (!esCerrado) {
                        // Muestra el popup con opciones
                        mostrarOpcionesCierreTurno(options);
                      }
                    }
                  })
                  .appendTo(container);
              }
            },
            // {
            //   dataField: "Accion",
            //   caption: "Acción",
            //   allowSorting: false,
            //   allowFiltering: false,
            //   cellTemplate: function(container, options) {
            //     const esCerrado = Number(options.data.HxJustificar) === 0;
            //     $("<div>")
            //       .dxButton({
            //         icon: "add",
            //         type: "default",
            //         stylingMode: "contained",
            //         hint: "Acción",
            //         disabled: esCerrado, // Deshabilita si está cerrado
            //         onClick: function(e) {
            //           if (!esCerrado) {
            //             mostrarMensajeAccion({ data: options.data });
            //           }
            //         }
            //       })
            //       .appendTo(container);
            //   }
            // },
          ],
          showBorders: true,
          columnAutoWidth: true
        });
      }
    });
  }

function mostrarMensajeAccion(options) {
    const dialog = DevExpress.ui.dialog.custom({
        title: "Acción",
        message: "¿Deseas registrar una nueva parada o cerrar el turno?",
        buttons: [
            {
                text: "Registrar Parada",
                onClick: () => true,
                type: "default"
            },
            {
                text: "Cerrar Turno",
                onClick: () => "cerrarTurno",
                type: "default"
            }
        ]
    });

    dialog.show().done(function(dialogResult) {
        if (dialogResult === true) {
            // Código para registrar parada
            popupDetalle.hide();

            const habilitarControles = () => {
                if (idxtpHoraInicio) idxtpHoraInicio.option("disabled", false);
                if (idxcmbMotivo) idxcmbMotivo.option("disabled", false);
                if (idxtpHoraFin) idxtpHoraFin.option("disabled", false);
                const btnAceptar = $("#btnAceptar").dxButton("instance");
                if (btnAceptar) {
                    btnAceptar.option("disabled", false);
                } else {
                    $("#btnAceptar").prop("disabled", false);
                }
            };

            const fecha = formatDate(idxdpFecha.option("value"));
            cargarProgramacionAlIniciar(fecha);
            habilitarControles();
            if (idxcmbSede) idxcmbSede.option("disabled", true);

            idxdpFecha.option("onValueChanged", function(e) {
                cargarProgramacionAlIniciar(formatDate(e.value));
                habilitarControles();
                if (idxcmbSede) idxcmbSede.option("disabled", true);
            });

            console.log("Nuevo registro para:", options.data);
        } else if (dialogResult === "cerrarTurno") {
    // Obtener la hora actual
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();

    // Si es después de las 15:00, mostrar mensaje y cancelar acción
    if (hora < 7 || (hora === 7 && minutos > 45)) {
        DevExpress.ui.notify({
            message: "No se puede cerrar el turno antes de las 15:45 horas.",
            type: "warning",
            displayTime: 5000,
            position: {
                my: "center center",
                at: "center center",
                of: window,
            }
        });
        return; // Solo esto, no necesitas e.preventDefault()
    }
    mostrarOpcionesCierreTurno(options);
}
    });
}

function mostrarOpcionesCierreTurno(options) {
     // Obtén los valores de la máquina y las horas por justificar
    const maquina = options.data.Maquina;
    // const minutosXJustificar = options.data.HxJustificar;

    // Convierte minutos a horas con dos decimales
    const horasXJustificar = Number(options.data.HxJustificar).toFixed(2);
    const content = `
    <div>
        <strong>Máquina:</strong> ${maquina}<br>
        <strong>Horas x Justificar:</strong> ${horasXJustificar}
    </div>
    <br>
    <div id="radioOpcionesCierreTurno"></div>
`;

    const dialog = DevExpress.ui.dialog.custom({
        title: "Cierre de turno por máquina",
        width: 300,
        message: content,
        buttons: [
            {
                text: "Aceptar",
                onClick: () => {
                    const radioGroup = $("#radioOpcionesCierreTurno").dxRadioGroup("instance");
                    return radioGroup.option("value");
                },
                type: "default"
            },
            {
                text: "Cancelar",
                onClick: () => null,
                type: "normal"
            }
        ]
    });

    dialog.show().done(function(resultado) {
    if (resultado) {
      const currentOptions = options;
      // console.log('Llamando a guardarMotivoCierre con:', {
      //   motivo: resultado,
      //   fecha: currentOptions.data.Fecha,
      //   IdSedes: currentOptions.data.IdSedes,
      //   IdTurno: currentOptions.data.IdTurno,
      //   IdMaquinaArea: currentOptions.data.IdMaquinaArea,
      //   options: currentOptions
      // });
      guardarMotivoCierre(
        resultado,
        currentOptions.data.Fecha,
        currentOptions.data.IdSedes,
        currentOptions.data.IdTurno,
        currentOptions.data.IdMaquinaArea,
        currentOptions
      );
    }
    });

    setTimeout(() => {
        $("#radioOpcionesCierreTurno").dxRadioGroup({
            items: ["EN PRODUCCION", "PARADA PROGRAMADA"],
            value: "EN PRODUCCION",
            layout: "vertical",
            itemTemplate: function(itemData, itemIndex, itemElement) {
            itemElement.css("margin-bottom", "10px");
            return itemData;
        }
        });
    }, 100);
}

function guardarMotivoCierre(motivo, fecha, IdSedes, IdTurno, IdMaquinaArea, options) {

  // Unificar obtención del registro
  var registro = (options && options.data) ? options.data : {
    Fecha: fecha,
    IdSedes: IdSedes,
    IdTurno: IdTurno,
    IdMaquinaArea: IdMaquinaArea,
    HProgramadas: 0,
    HxJustificar: 0
  };

  // Usar siempre el campo IdSedes si está presente
  var sede = registro.IdSedes || registro.IdSede || registro.Sede || registro.sede || IdSedes || '';
  // Siempre priorizar los IDs para turno y máquina
  var turno = registro.IdTurno || IdTurno || '';
  var maquina = registro.IdMaquinaArea || IdMaquinaArea || '';

  console.log('Registro completo:', JSON.stringify(registro));
  console.log('Valores usados:', { sede, turno, maquina, fecha: registro.Fecha });

  // Si no tienes HProgramadas, puedes poner un valor por defecto o pedirlo al backend
  let totalHoras = registro.HProgramadas || 0;
  let hxJustificar = registro.HxJustificar || 0;


  // Validar que los parámetros clave no estén vacíos
  if (!registro.Fecha || !sede || !turno || !maquina) {
    DevExpress.ui.dialog.alert("No se puede cerrar el turno: faltan datos clave (fecha, sede, turno o máquina). Por favor, seleccione correctamente.");
    return;
  }

  $.ajax({
    url: 'datos.php',
    type: 'GET',
    data: {
      action: 'cerrar_turno_maquina',
      fecha: registro.Fecha,
      sede: sede,
      turno: turno,
      maquina: maquina,
      totalHoras: totalHoras,
      motivoCierre: motivo,
      statusTurnoMaquina: "CERRADO",
      hxJustificar: hxJustificar
    },
    dataType: 'json',
    success: function(response) {
      console.log('Respuesta AJAX guardar motivo:', response);
      DevExpress.ui.dialog.alert("Motivo de cierre guardado correctamente.").done(function() {
        // Solo recargar la grilla de detalle si existe
        if (typeof recargarDetalleGrid === 'function') {
          recargarDetalleGrid();
        } else if (typeof dataGrid !== 'undefined' && dataGrid) {
          dataGrid.refresh && dataGrid.refresh();
        }
        // La ventana/modal permanece abierta
      });
    },
    error: function(xhr, textStatus, errorThrown) {
      console.error('Error AJAX guardar motivo:', textStatus, errorThrown, xhr.responseText);
      DevExpress.ui.dialog.alert("Error al guardar el motivo de cierre. " + xhr.responseText);
    }
  });
}

function actualizarCamposModal(data) {
    document.getElementById("campoHxJustificar").innerText = 0;
    document.getElementById("campoHParadas").innerText = data.HParadas;
    // ...actualiza otros campos si es necesario
}


$(() => {

  popupDetalle = $("#popupDetalle").dxPopup({
    title: "Balance de horas por turno y máquina",
    width: "95vw",
    maxWidth: "95vw",
    contentTemplate: function(contentElement) {
    // Contenedor con padding inferior para separar la grilla del borde
    contentElement.append(`
      <div style="height:100%; display:flex; flex-direction:column; padding-bottom:20px;">
        <div id="detalleGrid" style="flex:1 1 auto;"></div>
      </div>
    `);
  },
    width: 700,
    height: 400,
    showCloseButton: true,
    dragEnabled: true,
    hideOnOutsideClick: true
  }).dxPopup("instance");

  // Crea el popup si no existe
  if (!$("#popupDetalle").data("dxPopup")) {
    $("#popupDetalle").dxPopup({
      title: "Balance de horas por turno y máquina",
      width: "95vw",
      maxWidth: "95vw",
      contentTemplate: function(contentElement) {
    // Contenedor con padding inferior para separar la grilla del borde
    contentElement.append(`
      <div style="height:100%; display:flex; flex-direction:column; padding-bottom:20px;">
        <div id="detalleGrid" style="flex:1 1 auto;"></div>
      </div>
    `);
  },
      width: 700,
      height: 400,
      showCloseButton: true,
      dragEnabled: true,
      hideOnOutsideClick: true
    });
  }

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
        disabled: true,
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
        disabled: true,
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
        disabled: true,
        placeholder: "Seleccione una máquina",

          onValueChanged(val) {
            console.log("item",val);       
          },
          elementAttr: { class: "combo-amarillo" }
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
        disabled: true,
        value: null,
        placeholder: "Seleccione un motivo",

          onValueChanged(val) {
            console.log("item",val);       
          },
          elementAttr: { class: "combo-amarillo" }
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
      disabled: true,
      inputAttr: { 'aria-label': 'Date' },
    }).dxDateBox("instance");
  
    idxtpHoraInicio=$('#tpHoraInicio').dxDateBox({
      type: 'time',
      disabled: true,
      value: new Date(),
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

    $('#btnNuevo').dxButton({     
      stylingMode: 'contained',
      text: 'REGISTRAR',
      type: 'success',
      width: 120,
      onClick() {
        cargarProgramacionAlIniciar();
        if (idxtpHoraInicio) idxtpHoraInicio.option("disabled", false);
        if (idxcmbMotivo) idxcmbMotivo.option("disabled", false);
        if (idxtpHoraFin) idxtpHoraFin.option("disabled", false);
        if ($("#btnAceptar").dxButton) {
            $("#btnAceptar").dxButton("instance").option("disabled", false);
        } else {
            $("#btnAceptar").prop("disabled", false);
        }
      },
    });
    
    $('#btnAceptar').dxButton({
        stylingMode: 'contained',
        text: 'GUARDAR',
        type: 'success',
        width: 120,
        onClick() {
            if (wf_validar() == false) {
                return;
            }

            // Solo validar en agregar
            if (ls_accion == "agregar") {
                var fecha = formatDate($("#dpFecha").dxDateBox("instance").option("value"));
                var idMaquinaArea = $("#cmbMaquinaArea").dxSelectBox("instance").option("value");
                var horaInicio = formatTime($("#tpHoraInicio").dxDateBox("instance").option("value"));

                console.log("Validando hora superpuesta...", fecha, idMaquinaArea, horaInicio);
                
                validarHoraInicioNoSuperpuesta(fecha, idMaquinaArea, horaInicio, function(superpuesta) {
                    if (superpuesta) {
                        DevExpress.ui.notify({
                            message: 'La hora de inicio se encuentra dentro del rango de una parada ya registrada.',
                            type: 'warning',
                            displayTime: 4000,
                            position: {
                                my: 'center',
                                at: 'center',
                                of: window
                            }
                        });
                        return;
                    }
                    btnAceptar_click();
                  //   DevExpress.ui.notify({
                  //     message: 'Se guardó con éxito.',
                  //     type: 'success',
                  //     displayTime: 2000,
                  //     position: {
                  //         my: 'center',
                  //         at: 'center',
                  //         of: window
                  //     }
                  // });
                });
            } else {
                btnAceptar_click();
              //   DevExpress.ui.notify({
              //     message: 'Se guardó con éxito.',
              //     type: 'success',
              //     displayTime: 2000,
              //     position: {
              //         my: 'center',
              //         at: 'center',
              //         of: window
              //     }
              // });
            }
        },
    });

    $('#btnRegistros').dxButton({
      stylingMode: 'contained',
      text: 'CONSULTAR',
      type: 'success',
      width: 120,
      onClick() {
        mostrarPopupDetalle();
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
              localStorage.removeItem('idUsuario');
              localStorage.removeItem('nombreUsuario');
              // Detectar si estamos en /BACKOFFICE/ (local) o en raíz (hosting)
              var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
              window.location.href = baseUrl + '/public/index.html';
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

    function validarHoraInicioNoSuperpuesta(fecha, idMaquinaArea, horaInicio, callback) {
        $.ajax({
            url: 'datos.php',
            type: 'GET',
            data: {
                action: 'validar_hora_inicio_superpuesta',
                fecha: fecha,
                idMaquinaArea: idMaquinaArea,
                horaInicio: horaInicio
            },
            dataType: 'json',
            success: function(data) {
                // data.superpuesta = true/false
                callback(data.superpuesta);
            },
            error: function() {
                DevExpress.ui.notify('Error al validar hora de inicio', 'error', 3000);
                callback(true); // Por seguridad, no dejar guardar si hay error
            }
        });
    }

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
         DevExpress.ui.notify({
            message: 'Debe elegir un Turno.',
            type: 'warning',
            displayTime: 3000,
            position: {
                my: 'center',
                at: 'center',
                of: window
            }
        });
        return false
      }

      if ( dxcmbSede == null ){
         DevExpress.ui.notify({
            message: 'Debe elegir una Sede.',
            type: 'warning',
            displayTime: 3000,
            position: {
                my: 'center',
                at: 'center',
                of: window
            }
        });
        return false
      }

      if ( dxcmbMaquinaArea == null ){
        DevExpress.ui.notify({
            message: 'Debe elegir una maquina.',
            type: 'warning',
            displayTime: 3000,
            position: {
                my: 'center',
                at: 'center',
                of: window
            }
        });
        return false
      }

      if ( dxtxtTotalHoras == null ){
        DevExpress.ui.notify({
            message: 'Debe ingresar Hora Inicio y Hora Fin.',
            type: 'warning',
            displayTime: 3000,
            position: {
                my: 'center',
                at: 'center',
                of: window
            }
        });
        return false
      }
    }
    else if (ls_accion =="editar"){
      if ( dxtpHoraInicio >= dxtpHoraFin ){
         DevExpress.ui.notify({
            message: 'Hora Fin no puede ser menor o igual que Hora Inicio.',
            type: 'warning',
            displayTime: 3000,
            position: {
                my: 'center',
                at: 'center',
                of: window
            }
        });
        return false
      }
    }
    return true
  }

  //HABILITADO DE CONTROLES EN FUNCION DE PROGRAMACION

  function habilitarControles(habilitar) {
    console.log("habilitarControles llamada con:", habilitar);
      idxdpFecha.option("disabled", !habilitar);
      idxcmbTurno.option("disabled", !habilitar);
      // idxcmbSede.option("disabled", !habilitar);
      idxcmbMaquinaArea.option("disabled", !habilitar);
      idxtpHoraInicio.option("disabled", !habilitar);
      idxcmbMotivo.option("disabled", !habilitar);
      idxtpHoraFin.option("disabled", !habilitar);
      idxcmbSede.option("disabled", true); // siempre deshabilitado
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
                  if (idxcmbSede) idxcmbSede.option("disabled", true);
              } else {
                  habilitarControles(false);
                  if (idxcmbSede) idxcmbSede.option("disabled", true);
                  DevExpress.ui.notify('Sin programación', 'warning', 6000);
              }
          },
          error: function() {
              habilitarControles(false);
              if (idxcmbSede) idxcmbSede.option("disabled", true);
              DevExpress.ui.notify('Error al validar programación', 'error', 3000);
          }
      });
  }

  function horaToMinutos(hora) {
    // hora en formato 'HH:MM' o 'HH:MM:SS'
    let partes = hora.split(':');
    return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
}

  function cargarProgramacionAlIniciar(fecha) {
    fecha = fecha || formatDate(idxdpFecha.option("value"));

    $.ajax({
        url: 'datos.php',
        type: 'GET',
        data: { action: 'obtener_programacion_por_fecha', parametros: fecha },
        dataType: 'json',
        success: function(data) {
            if (data && data.length > 0) {
                // Llena el combo de máquinas solo con las programadas para esa fecha
                let maquinasProgramadas = data.map(p => ({
                    IdMaquinaArea: p.IdMaquinaArea,
                    MaquinaArea: p.MaquinaArea
                }));

                // Habilita los combos
                habilitarControles(true);
                if (idxcmbSede) idxcmbSede.option("disabled", true);

                // BLOQUEA el combo sede después de habilitar controles
                if (idxcmbSede) idxcmbSede.option("disabled", true);

                // Elimina duplicados por IdMaquinaArea
                maquinasProgramadas = maquinasProgramadas.filter(
                  (v,i,a)=>a.findIndex(t=>(t.IdMaquinaArea === v.IdMaquinaArea))===i
                );

                if (idxcmbMaquinaArea) {
                    idxcmbMaquinaArea.option({
                        dataSource: maquinasProgramadas,
                        value: null, // No selecciona ninguna por defecto
                        disabled: false
                    });
                }

                // Cuando el usuario seleccione una máquina, carga los demás datos
                idxcmbMaquinaArea.option("onValueChanged", function(e) {
                    let prog = data.find(p => String(p.IdMaquinaArea) === String(e.value));
                    if (prog) {
                        if (idxcmbTurno) idxcmbTurno.option("value", String(prog.IdTurno));
                        if (idxcmbSede) idxcmbSede.option("value", String(prog.IdSedes));
                        // Puedes cargar otros datos aquí si es necesario
                    }
                });

                // Limpia los combos de turno y sede hasta que elijan máquina
                if (idxcmbTurno) idxcmbTurno.option("value", null);
                if (idxcmbSede) idxcmbSede.option("value", null);

                // Habilita los combos
                habilitarControles(true);

            } else {
                habilitarControles(false);
                if (idxcmbSede) idxcmbSede.option("disabled", true);
                DevExpress.ui.notify('Sin programación para la fecha seleccionada', 'warning', 3000);
            }
        },
        error: function() {
            habilitarControles(false);
            if (idxcmbSede) idxcmbSede.option("disabled", true);
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
    var motivoTexto = $("#cmbMotivo").dxSelectBox("instance").option("text");
    var motivoValor = $("#cmbMotivo").dxSelectBox("instance").option("value");

    dxtpHoraFin = formatTime( dxtpHoraFin )
    dxdpFecha = formatDate( dxdpFecha )
    dxtpHoraInicio = formatTime( dxtpHoraInicio )
    
    let ls_accion = getUrlParameter("par_accion") || "agregar"; // "agregar" o "editar" (por defecto 'agregar')
    let ls_parametros = "";

    if(dxtpHoraFin==null){
      dxtpHoraFin="";
    }

    // Validación de usuario
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      DevExpress.ui.notify({
        message: "Debe iniciar sesión nuevamente.",
        type: "warning",
        displayTime: 3000,
        position: {
          my: "center center",
          at: "center center",
          of: window,
        }
      });
      return;
    }

    if (ls_accion == "agregar") {
      let motivo = dxcmbMotivo;
      let ln_id = getUrlParameter("id");
      ls_parametros = [ls_accion, dxcmbTurno, dxcmbSede, dxdpFecha, dxcmbMaquinaArea, dxtpHoraInicio, motivo, dxtpHoraFin, dxtxtTotalHoras].join(",");
      if (motivoValor) {
        // enviarAlertaWhatsAppBackend(motivoTexto);
      }
    }
    else if (ls_accion == "editar") {
      let ln_id = getUrlParameter("id");
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
        totalMinutos
      ].join(",");

      // Solo enviar WhatsApp si antes NO tenía motivo y ahora sí tiene
      // Si motivoAnterior es null, undefined, "" o "0", y motivoValor tiene valor
      if (
        (!motivoAnterior || motivoAnterior === "" || motivoAnterior === null || motivoAnterior === "0") &&
        motivoValor && motivoValor !== "" && motivoValor !== null && motivoValor !== "0"
      ) {
        enviarAlertaWhatsAppBackend(motivoTexto);
      }
    }

    console.log("par1",ls_parametros)  

   $.ajax({ 
      url: 'datos.php',
      type: 'GET',
      data: { action: 'produccion_registrocontrolparadas_agregar' ,parametros: ls_parametros, idUsuario: idUsuario},
      dataType: 'json',
      success(data) {  
        if (data.success) {
              DevExpress.ui.notify({
                message: 'Se guardó con éxito.',
                type: 'success',
                displayTime: 2000,
                position: {
                  my: 'center',
                  at: 'center',
                  of: window
                }
              });
              // Redirige solo si quieres después de mostrar el mensaje
              setTimeout(function () {
                if (ls_accion === "agregar") {
                  if (motivoValor && motivoValor !== "0") {
                    enviarAlertaWhatsAppBackend(motivoTexto);
                  }
                } else if (ls_accion === "editar") {
                  if (
                    (!motivoAnterior || motivoAnterior === "" || motivoAnterior === null || motivoAnterior === "0") &&
                    motivoValor && motivoValor !== "" && motivoValor !== null && motivoValor !== "0"
                  ) {
                    enviarAlertaWhatsAppBackend(motivoTexto);
                  }
                }
                window.location.href = "registrosp.html?par_accion=agregar";
              }, 2000);
            } else {
              DevExpress.ui.notify({
                message: data.mensaje || 'No se pudo guardar.',
                type: 'error',
                displayTime: 3000,
                position: {
                  my: 'center',
                  at: 'center',
                  of: window
                }
              });
            } 

          var motivoTexto = $("#cmbMotivo").dxSelectBox("instance").option("text");
          console.log("Motivo seleccionado para whatsapp:", motivoTexto);
      },
      error() {             
              console.error('Error guardar:', textStatus, errorThrown);
      }, 
    });    
  }

  // Función para obtener parámetros de la URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
    // var queryString = window.location.search.substring(1);
    // var parametros = queryString.split("&");
    // var parAccion = parametros[0].split("=");
    // ls_accion =parAccion[1]

    // var parId = parametros[1].split("=");
    // var ls_id =parId[1]

    var queryString = window.location.search.substring(1);
    var parametros = queryString.split("&");

    var parAccion = parametros[0]?.split("=");
    ls_accion = parAccion?.[1] || "agregar"; // valor por defecto

    var ls_id = null;
    if (parametros.length > 1 && parametros[1].includes("=")) {
      var parId = parametros[1].split("=");
      ls_id = parId?.[1] || null;
    } else {
      // console.warn("ID de parámetro ausente o malformado en la URL.");
    }

    const now = new Date();
  if (ls_accion=="agregar"){
 
    var hora=obtenerHoraActual()
    
    $("#tpHoraInicio").dxDateBox("instance").option("value",now);  
    $("#tpHoraFin").dxDateBox("instance").option("value",null);   

    var ii=1
    ii=ii+1

  }else if(ls_accion=="editar"){
    // let motivoAnterior = null;
    $.ajax({ 
      url: 'datos.php',
      type: 'GET',
      data: { action: 'obtenerPorID' ,parametros: ls_id},
      dataType: 'json',
      success(data) {         
          console.log("obtenerPorID",data);
        
          motivoAnterior = data[0].Motivo; // Guarda el motivo original

          // let fechaStr = data[0].Fecha; // formato: '2025-06-06'
          // let partes = fechaStr.split('-');
          // let ld_Fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));

          let ld_Fecha = new Date(); // valor por defecto
          if (data && data[0] && typeof data[0].Fecha === 'string' && data[0].Fecha.includes('-')) {
            let partes = data[0].Fecha.split('-');
            ld_Fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
          } else {
            console.warn("⚠ Fecha inválida o ausente en los datos:", data);
            DevExpress.ui.notify({
              message: 'Fecha inválida en el registro. Se usará la fecha actual.',
              type: 'warning',
              displayTime: 5000,
              position: {
                my: 'center',
                at: 'center',
                of: window
              }
            });
          }

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
            columns: [
              'Fecha',
              'Usuario',
              'Maquina',
              'HoraInicio',
              'HoraFin',
              {
                dataField: 'Estado',
                caption: 'Estado del Registro',
                cellTemplate: function(container, options) {
                  const valor = (options.value || options.text || "").toString().toUpperCase();
                  let colorClass = "";
                  if (valor === "PENDIENTE") {
                    colorClass = "estado-pendiente";
                  } else if (valor === "CERRADO") {
                    colorClass = "estado-cerrado";
                  }
                  $("<span>")
                    .addClass(colorClass)
                    .text(valor)
                    .css("font-weight", "bold")
                    .appendTo(container);
                }
              },
              {
                type: 'buttons',
                caption: 'Detalle',
                buttons: [
                  {
                    hint: 'Ver Detalle',
                    icon: 'search',
                    onClick: function(e) {
                      mostrarPopupDetalle();                     
                    }
                  }
                ]
              }
            ],
            showBorders: true,
            columnAutoWidth: true,
            allowColumnResizing: true,
            onRowDblClick: function(e) {
              // Validar si el registro está cerrado (Estado == 2)
              console.log("Datos de la fila:", e.data)
              if (e.data.Estado === "CERRADO") {
                DevExpress.ui.notify({
                  message: data.mensaje || "El registro ya está cerrado y no puede ser editado.",
                  type: "error",
                  displayTime: 5000,
                  position: {
                    my: "center center",
                    at: "center center",
                    of: window,
                  }
                });
                return;
              }
              window.location.href = 'registrosp.html?par_accion=editar&id='+e.data.Idregistrocontrolparadas;          
            }
          }).dxDataGrid("instance");
    },
  error: function(jqXHR, textStatus, errorThrown) {
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
      console.log('Usuario obtenido:', data);
      if (typeof data === 'object') {
        localStorage.setItem('idUsuario', data.idUsuario);
        localStorage.setItem('nombreUsuario', data.nombreUsuario);
        lblUsuario.innerHTML = data.nombreUsuario;
      } else {
        DevExpress.ui.notify("No se pudo obtener información del usuario.", "error", 4000);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
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
              localStorage.removeItem('idUsuario');
              localStorage.removeItem('nombreUsuario');
              // Detectar si estamos en /BACKOFFICE/ (local) o en raíz (hosting)
              var baseUrl = window.location.pathname.includes('/BACKOFFICE/') ? '/BACKOFFICE' : '';
              window.location.href = baseUrl + '/public/index.html'; 
        },
        error(e) {             
                console.error('Error logout:', e);
        }, 
      }); 
    },
  });

  popupDetalle = $("#popupDetalle").dxPopup({
    title: "Balance de horas por turno y máquina",
    width: "95vw",
    maxWidth: "95vw",
    contentTemplate: function(contentElement) {
    // Contenedor con padding inferior para separar la grilla del borde
    contentElement.append(`
      <div style="height:100%; display:flex; flex-direction:column; padding-bottom:20px;">
        <div id="detalleGrid" style="flex:1 1 auto;"></div>
      </div>
    `);
  },
    width: 700,
    height: 400,
    showCloseButton: true,
    dragEnabled: true,
    hideOnOutsideClick: true
  }).dxPopup("instance");

  // Crea el popup si no existe
  if (!$("#popupDetalle").data("dxPopup")) {
    $("#popupDetalle").dxPopup({
      title: "Balance de horas por turno y máquina",
      width: "95vw",
      maxWidth: "95vw",
      contentTemplate: function(contentElement) {
    // Contenedor con padding inferior para separar la grilla del borde
    contentElement.append(`
      <div style="height:100%; display:flex; flex-direction:column; padding-bottom:20px;">
        <div id="detalleGrid" style="flex:1 1 auto;"></div>
      </div>
    `);
  },
      width: 700,
      height: 400,
      showCloseButton: true,
      dragEnabled: true,
      hideOnOutsideClick: true
    });
  }  
});
