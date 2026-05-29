// var is_cmbProveedor_pordefecto=null
var ls_accion

$(() => {

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
    displayFormat: 'HH:mm',
  }).dxDateBox("instance");

  idxtpHoraFin=$('#tpHoraFin').dxDateBox({
    type: 'time',
    // value: now,
    inputAttr: { 'aria-label': 'Time' },
    displayFormat: 'HH:mm',
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
      window.location.href = 'registros_de.php';
    },
  });

  $('#btnCerrarSesion').dxButton({
    stylingMode: 'contained',
    text: 'Cerrar Sesión',
    type: 'success',
    width: 120,
    onClick() {

      $.ajax({ 
        url: 'datos_de.php',
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

  function wf_validar(){

  var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
  var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
  var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
  var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");

  dxdpFecha = formatDate( dxdpFecha )
  dxtpHoraInicio = formatTime( dxtpHoraInicio )
  dxtpHoraFin = formatTime( dxtpHoraFin )

  if (ls_accion =="agregar"){
    if ( dxcmbSede == null ){
      alert("Debe ingresar Sede")
      return false
    }
    
  }
  else if (ls_accion =="editar"){
    if ( dxtpHoraInicio == null ){
      alert("Debe ingresar Hora Inicio")
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
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
    var dxtxtNombreCliente = $("#txtNombreCliente").dxTextBox("instance").option("value");
    var dxtxtPlacaTransporte = $("#txtPlacaTransporte").dxTextBox("instance").option("value");
    var dxtxtPlacaTracto = $("#txtPlacaTracto").dxTextBox("instance").option("value");
    var dxtxtConductor = $("#txtConductor").dxTextBox("instance").option("value");
    var dxtxtEmpresaTransportista = $("#txtEmpresaTransportista").dxTextBox("instance").option("value");
    var dxtxtDestino = $("#txtDestino").dxTextBox("instance").option("value");
    var dxtxtNumeroViaje = $("#txtNumeroViaje").dxTextBox("instance").option("value");
    var dxtxtPorHumedad= $("#txtPorHumedad").dxTextBox("instance").option("value");
    var dxcmbObservacionTransporte= $("#cmbObservacionTransporte").dxSelectBox("instance").option("value");
    var dxtxtParedes= $("#txtParedes").dxTextBox("instance").option("value");
    var dxtxtPlataforma= $("#txtPlataforma").dxTextBox("instance").option("value");
    var dxtxtTecho= $("#txtTecho").dxTextBox("instance").option("value");
    var dxtxtPuerta= $("#txtPuerta").dxTextBox("instance").option("value");
    var dxtxtTotalObservacionesT= $("#txtTotalObservacionesT").dxTextBox("instance").option("value");
    var dxtxtPorcentajeTotalObservacionesT= $("#txtPorcentajeTotalObservacionesT").dxTextBox("instance").option("value");
    var dxtxtLote= $("#txtLote").dxTextBox("instance").option("value");
    var dxtxtCodigoProducto= $("#txtCodigoProducto").dxTextBox("instance").option("value");
    var dxtxtDescripcionProducto= $("#txtDescripcionProducto").dxTextBox("instance").option("value");
    var dxtxtNumero= $("#txtNumero").dxTextBox("instance").option("value");
    var dxtxtHumedadCajas= $("#txtHumedadCajas").dxTextBox("instance").option("value");
    var dxtxtPalletsTerminados= $("#txtPalletsTerminados").dxTextBox("instance").option("value");
    var dxtxtPuchosTerminados= $("#txtPuchosTerminados").dxTextBox("instance").option("value");
    var dxcmbTipoMaterial= $("#cmbTipoMaterial").dxSelectBox("instance").option("value");
    var dxtxtCantidadMuestra= $("#txtCantidadMuestra").dxNumberBox("instance").option("value");
    var dxcmbObservacionMuestra= $("#cmbObservacionMuestra").dxSelectBox("instance").option("value");
    var dxtxtDespegado= $("#txtDespegado").dxNumberBox("instance").option("value");
    var dxtxtDespegadoPorcentaje= $("#txtDespegadoPorcentaje").dxTextBox("instance").option("value");
    var dxtxtDobleEtiqueta= $("#txtDobleEtiqueta").dxNumberBox("instance").option("value");
    var dxtxtDobleEtiquetaPorcentaje= $("#txtDobleEtiquetaPorcentaje").dxTextBox("instance").option("value");
    var dxtxtImpresionSenasa= $("#txtImpresionSenasa").dxNumberBox("instance").option("value");
    var dxtxtImpresionSenasaPorcentaje= $("#txtImpresionSenasaPorcentaje").dxTextBox("instance").option("value");
    var dxtxtMalaSujecion= $("#txtMalaSujecion").dxNumberBox("instance").option("value");
    var dxtxtMalaSujecionPorcentaje= $("#txtMalaSujecionPorcentaje").dxTextBox("instance").option("value");
    var dxtxtPiezaDanada= $("#txtPiezaDanada").dxNumberBox("instance").option("value");
    var dxtxtPiezaDanadaPorcentaje= $("#txtPiezaDanadaPorcentaje").dxTextBox("instance").option("value");
    var dxtxtPuntoExpuesto= $("#txtPuntoExpuesto").dxNumberBox("instance").option("value");
    var dxtxtPuntoExpuestoPorcentaje= $("#txtPuntoExpuestoPorcentaje").dxTextBox("instance").option("value");
    var dxtxtPuntoRoto= $("#txtPuntoRoto").dxNumberBox("instance").option("value");
    var dxtxtPuntoRotoPorcentaje= $("#txtPuntoRotoPorcentaje").dxTextBox("instance").option("value");
    var dxtxtPuntoSuelto= $("#txtPuntoSuelto").dxNumberBox("instance").option("value");
    var dxtxtPuntoSueltoPorcentaje= $("#txtPuntoSueltoPorcentaje").dxTextBox("instance").option("value");
    var dxtxtRasgado= $("#txtRasgado").dxNumberBox("instance").option("value");
    var dxtxtRasgadoPorcentaje= $("#txtRasgadoPorcentaje").dxTextBox("instance").option("value");
    var dxtxtRotoQuebrado= $("#txtRotoQuebrado").dxNumberBox("instance").option("value");
    var dxtxtRotoQuebradoPorcentaje= $("#txtRotoQuebradoPorcentaje").dxTextBox("instance").option("value");
    var dxtxtSinPunto= $("#txtSinPunto").dxNumberBox("instance").option("value");
    var dxtxtSinPuntoPorcentaje= $("#txtSinPuntoPorcentaje").dxTextBox("instance").option("value");
    var dxtxtVolteado= $("#txtVolteado").dxNumberBox("instance").option("value");
    var dxtxtVolteadoPorcentaje= $("#txtVolteadoPorcentaje").dxTextBox("instance").option("value");
    var dxMetalAcero= $("#MetalAcero").dxNumberBox("instance").option("value");
    var dxMetalAceroPorcentaje= $("#MetalAceroPorcentaje").dxTextBox("instance").option("value");
    var dxInsectos= $("#Insectos").dxNumberBox("instance").option("value");
    var dxInsectosPorcentaje= $("#InsectosPorcentaje").dxTextBox("instance").option("value");
    var dxPiedras= $("#Piedras").dxNumberBox("instance").option("value");
    var dxPiedrasPorcentaje= $("#PiedrasPorcentaje").dxTextBox("instance").option("value");
    var dxOxido= $("#Oxido").dxNumberBox("instance").option("value");
    var dxOxidoPorcentaje= $("#OxidoPorcentaje").dxTextBox("instance").option("value");
    var dxPlastico= $("#Plastico").dxNumberBox("instance").option("value");
    var dxPlasticoPorcentaje= $("#PlasticoPorcentaje").dxTextBox("instance").option("value");
    var dxPolvo= $("#Polvo").dxNumberBox("instance").option("value");
    var dxPolvoPorcentaje= $("#PolvoPorcentaje").dxTextBox("instance").option("value");
    var dxPinturas= $("#Pinturas").dxNumberBox("instance").option("value");
    var dxPinturasPorcentaje= $("#PinturasPorcentaje").dxTextBox("instance").option("value");
    var dxLubricantes= $("#Lubricantes").dxNumberBox("instance").option("value");
    var dxLubricantesPorcentaje= $("#LubricantesPorcentaje").dxTextBox("instance").option("value");
    var dxPetroleo= $("#Petroleo").dxNumberBox("instance").option("value");
    var dxPetroleoPorcentaje= $("#PetroleoPorcentaje").dxTextBox("instance").option("value");
    var dxGrasas= $("#Grasas").dxNumberBox("instance").option("value");
    var dxGrasasPorcentaje= $("#GrasasPorcentaje").dxTextBox("instance").option("value");
    var dxTinta= $("#Tinta").dxNumberBox("instance").option("value");
    var dxTintaPorcentaje= $("#TintaPorcentaje").dxTextBox("instance").option("value");
    var dxHongos= $("#Hongos").dxNumberBox("instance").option("value");
    var dxHongosPorcentaje= $("#HongosPorcentaje").dxTextBox("instance").option("value");
    var dxMoho= $("#Moho").dxNumberBox("instance").option("value");
    var dxMohoPorcentaje= $("#MohoPorcentaje").dxTextBox("instance").option("value");
    var dxHecesAnimales= $("#HecesAnimales").dxNumberBox("instance").option("value");
    var dxHecesAnimalesPorcentaje= $("#HecesAnimalesPorcentaje").dxTextBox("instance").option("value");
    var dxSaliva= $("#Saliva").dxNumberBox("instance").option("value");
    var dxSalivaPorcentaje= $("#SalivaPorcentaje").dxTextBox("instance").option("value");
    var dxtxtTotalObservaciones= $("#txtTotalObservaciones").dxTextBox("instance").option("value");
    var dxtxtPorcentajeTotalObservaciones= $("#txtPorcentajeTotalObservaciones").dxTextBox("instance").option("value");
    
    dxdpFecha = formatDate( dxdpFecha )
    dxtpHoraInicio = formatTime( dxtpHoraInicio )
    dxtpHoraFin = formatTime( dxtpHoraFin )

    var queryString = window.location.search.substring(1);
    var parametros = queryString.split("&");
    var par = parametros[0].split("=");
    //var ls_accion =par[1]

    if (ls_accion =="agregar" )
    {
      ls_parametros=ls_accion +","+dxcmbSede+","+dxdpFecha+","+dxtpHoraInicio+","+dxtpHoraFin+","
      +dxtxtNombreCliente+","+dxtxtPlacaTransporte+","+dxtxtPlacaTracto+","+dxtxtConductor+","
      +dxtxtEmpresaTransportista+","+dxtxtDestino+","+dxtxtNumeroViaje+","+dxtxtPorHumedad+","
      +dxcmbObservacionTransporte+","+dxtxtParedes+","+dxtxtPlataforma+","+dxtxtTecho+","
      +dxtxtPuerta+","+dxtxtTotalObservacionesT+","+dxtxtPorcentajeTotalObservacionesT+","+dxtxtLote+","
      +dxtxtCodigoProducto+","+dxtxtDescripcionProducto+","+dxtxtNumero+","+dxtxtHumedadCajas+","
      +dxtxtPalletsTerminados+","+dxtxtPuchosTerminados+","+dxcmbTipoMaterial+","+dxtxtCantidadMuestra+","
      +dxcmbObservacionMuestra+","+dxtxtDespegado+","+dxtxtDespegadoPorcentaje+","+dxtxtDobleEtiqueta+","
      +dxtxtDobleEtiquetaPorcentaje+","+dxtxtImpresionSenasa+","+dxtxtImpresionSenasaPorcentaje+","
      +dxtxtMalaSujecion+","+dxtxtMalaSujecionPorcentaje+","+dxtxtPiezaDanada+","+dxtxtPiezaDanadaPorcentaje+","
      +dxtxtPuntoExpuesto+","+dxtxtPuntoExpuestoPorcentaje+","+dxtxtPuntoRoto+","
      +dxtxtPuntoRotoPorcentaje+","+dxtxtPuntoSuelto+","+dxtxtPuntoSueltoPorcentaje+","
      +dxtxtRasgado+","+dxtxtRasgadoPorcentaje+","+dxtxtRotoQuebrado+","
      +dxtxtRotoQuebradoPorcentaje+","+dxtxtSinPunto+","+dxtxtSinPuntoPorcentaje+","+dxtxtVolteado+","
      +dxtxtVolteadoPorcentaje+","+dxMetalAcero+","+dxMetalAceroPorcentaje+","+dxInsectos+","+dxInsectosPorcentaje+","
      +dxPiedras+","+dxPiedrasPorcentaje+","+dxOxido+","+dxOxidoPorcentaje+","
      +dxPlastico+","+dxPlasticoPorcentaje+","+dxPolvo+","+dxPolvoPorcentaje+","+dxPinturas+","
      +dxPinturasPorcentaje+","+dxLubricantes+","+dxLubricantesPorcentaje+","+dxPetroleo+","+dxPetroleoPorcentaje+","
      +dxGrasas+","+dxGrasasPorcentaje+","+dxTinta+","+dxTintaPorcentaje+","+dxHongos+","+dxHongosPorcentaje+","+dxMoho+","
      +dxMohoPorcentaje+","+dxHecesAnimales+","+dxHecesAnimalesPorcentaje+","
      +dxSaliva+","+dxSalivaPorcentaje+","+dxtxtTotalObservaciones+","+dxtxtPorcentajeTotalObservaciones;
    }
    else
    {
      var par1 = parametros[1].split("=");

    }
    console.log("par1",ls_parametros)

    $.ajax({ 
      url: 'datos_de.php',
      type: 'GET',
      data: { action: 'sig_registrocontrolcalidad_agregar' ,parametros: ls_parametros},
      dataType: 'json',
      success(data) {
          
          console.log("sig_registrocontrolcalidad_agregar",data);
      
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
    if (date == null){return null}
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ':' + minutes;
  }
  $(document).ready(function() {

    $.ajax({ 
      url: 'datos_de.php',
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
      // idxtpHora.focus()
      // $("#tpHora").dxDateBox("instance").option("value",ldt_Hora);
      var ii=1
      ii=ii+1

    }else if(ls_accion=="editar"){
      
      $.ajax({ 
        url: 'datos_de.php',
        type: 'GET',
        data: { action: 'obtenerPorID' ,parametros: ls_id},
        dataType: 'json',
        success(data) {
          
            console.log("obtenerPorID",data);

            //Idregistrocontrolparadaspt, Fecha, Hora, TipoRegistro, MaquinaLinea, ProveedorResponsable, Motivo, HoraFin, Estado
          
            let ld_Fecha = new Date(data[0].Fecha);
            //let ls_Hora = '1970-01-01T' + data[0].Hora + 'Z';
            let ldt_Hora =convertTimeStringToDate(data[0].Hora);
            // let ls_HoraFin = '1970-01-01T' + data[0].HoraFin + 'Z';
            // let ldt_HoraFin = convertTimeStringToDate(data[0].HoraFin );

            $("#cmbSede").dxSelectBox("instance").option("value",data[0].Sede);  
            $("#dpFecha").dxDateBox("instance").option("value",ld_Fecha);  
            $("#tpHora").dxDateBox("instance").option("value",ldt_Hora);
            $("#cmbTipoRegistro").dxSelectBox("instance").option("value",data[0].TipoRegistro);
            $("#cmbProcedencia").dxSelectBox("instance").option("value",data[0].Procedencia);
            is_cmbProveedor_pordefecto = data[0].Proveedor
            // $("#txtGuiaRemision").dxTextBox("instance").inputAttr("value",data[0].GuiaRemision);
            // $("#txtGuiaTransportista").dxTextBox("instance").inputAttr("value",data[0].GuiaTransportista);
            // $("#txtPlaca").dxTextBox("instance").inputAttr("value",data[0].Placa);
            // $("#txtTotalPaquetes").dxTextBox("instance").inputAttr("value",data[0].TotalPaquetes);
            // $("#txtContenedor").dxTextBox("instance").inputAttr("value",data[0].Contenedor);
            // $("#txtPrecinto").dxTextBox("instance").inputAttr("value",data[0].Precinto);
            // $("#cmbParedes").dxSelectBox("instance").option("value",data[0].Paredes);
            // $("#cmbTecho").dxSelectBox("instance").option("value",data[0].Techo);
            // $("#cmbPuerta").dxSelectBox("instance").option("value",data[0].Puerta);
            // $("#cmbPlataforma").dxSelectBox("instance").option("value",data[0].Plataforma);
            // $("#cmbTipoMaterial").dxSelectBox("instance").option("value",data[0].TipoMaterial);
            // $("#cmbDocumentacion").dxSelectBox("instance").option("value",data[0].Documentacion);
            // $("#txtObservacion").dxTextBox("instance").inputAttr("value",data[0].Observacion);
            // $("#txtCantidadMuestra1").dxTextBox("instance").inputAttr("value",data[0].CantidadMuestra);
            // $("#cmbObservacion1").dxSelectBox("instance").option("value",data[0].Observacion);
            // $("#txtOxidacion1").dxTextBox("instance").inputAttr("value",data[0].Oxidacion);
            // $("#txtNoRecubrimiento1").dxTextBox("instance").inputAttr("value",data[0].NoRecubrimiento);
            // $("#txtEspesor1").dxTextBox("instance").inputAttr("value",data[0].Espesor);
            // $("#txtCantidadMuestra2").dxTextBox("instance").inputAttr("value",data[0].CantidadMuestra);
            // $("#cmbObservacion2").dxSelectBox("instance").option("value",data[0].Observacion);
            // $("#txtColor2").dxTextBox("instance").inputAttr("value",data[0].color);
            // $("#txtAdhesivo2").dxTextBox("instance").inputAttr("value",data[0].Adhesivo);

            idxcmbSede.option("disabled", true);
            idxdpFecha.option("disabled", true);
            idxcmbTipoRegistro.option("disabled", true);
            idxcmbProcedencia.option("disabled", true);
            idxcmbProveedor.option("disabled", true);
            idxtxtGuiaRemision.inputAttr("disabled", true);
            idxtxtGuiaTransportista.inputAttr("disabled", true);
            idxtxtPlaca.inputAttr("disabled", true);
            idxtxtTotalPaquetes.inputAttr("disabled", true);
            idxtxtContenedor.inputAttr("disabled", true);
          // idxtxtPrecinto.inputAttr("disabled", true);
            idxcmbParedes.option("disabled", true);
            idxcmbTecho.option("disabled", true);
            idxcmbPuerta.option("disabled", true);
            idxcmbPlataforma.option("disabled", true);
            idxcmbTipoMaterial.option("disabled", true);
            idxcmbDocumentacion.option("disabled", true);
            idxtxtObservacion.inputAttr("disabled", true);
            //idxtxtCantidadMuestra1.inputAttr("disabled", true);
            idxcmbObservacion1.option("disabled", true);
            idxtxtOxidacion1.inputAttr("disabled", true);
            idxtxtNoRecubrimiento1.inputAttr("disabled", true);
            //idxtxtEspesor1.inputAttr("disabled", true);
            //idxtxtEspesor1.option("disabled", true);
            idxtxtCantidadMuestra2.inputAttr("disabled", true);
            idxcmbObservacion2.option("disabled", true);
            idxtxtColor2.inputAttr("disabled", true);
            idxtxtAdhesivo2.inputAttr("disabled", true);
        },
        error() {             
                console.error('Error guardar:', textStatus, errorThrown);
        }, 
      }); 
    }
    });

  function convertTimeStringToDate(timeString) {
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

  function calcularDiferenciaHoras(Hora, horaFin) {
    // Crear objetos Date para las horas de inicio y fin
    let fechaActual = new Date();
    
    // Separar horas y minutos de las cadenas de tiempo
    let [horasInicio, minutosInicio] = Hora.split(':').map(Number);
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

  $(function() {
    $("#tabPanel").dxTabPanel({
        items: [
            {
                title: "General",
                template: function() {
                    return  $("<div>").append(
                      //   $("<div>").dxTextBox({value: "Control en Pestaña 1"})
                        div_tab_01.innerHTML
                        
                    );
                }
            },
            {
                title: "Transporte",
                template: function() {
                    return $("<div>").append(
                      //  $("<div>").dxTextBox({ value: "Control en Pestaña 2" })
                      div_tab_02.innerHTML
                    );
                }
            },
            {
              title: "Información Trazabilidad",
              template: function() {
                  return $("<div>").append(
                    //  $("<div>").dxTextBox({ value: "Control en Pestaña 3" })
                    div_tab_03.innerHTML
                  );
              }
            },          
            {
              title: "Muestreo",
              template:  $("#div_tab_04").html()           
            },         
            {
              title: "Evidencia",
              template:  $("#div_tab_05").html()
            },
        ],
        deferRendering: false, // Asegura que todas las pestañas se rendericen
        onSelectionChanged: function(e) {
            // Fuerza el renderizado del contenido de la pestaña seleccionada
            var selectedItem = e.component.option("selectedItem");
            // selectedItem.template();
        }
    });

  div_tab_01.style.display="none"
  div_tab_02.style.display="none"
  div_tab_03.style.display="none"
  div_tab_04.style.display="none"
  div_tab_05.style.display="none"

  // ----------esto va depues del dxtabpanel-------------

   // COMBO SEDES
   $.ajax({ 
    url: 'datos_de.php',
    type: 'GET',
    data: { action: 'cmbSede' },
    dataType: 'json',
    success(data) {
       
        console.log(data)

        idxcmbSede=$('#cmbSede').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Sedes',
        valueExpr: 'IdSedes',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbSede:', textStatus, errorThrown);
    }, 
  }),

  // FECHA
  $(document).ready(function() {
    $("#dpFecha").dxDateBox({
      value: new Date(),
      type: "date",
      displayFormat: "dd/MM/yyyy"
    });
  });

  // HORA INICIO
  $(document).ready(function() {
    $("#tpHoraInicio").dxDateBox({
      value: new Date(),
      type: "time",
      displayFormat: "HH:mm"
    });
  });

  // HORA FIN
  $(document).ready(function() {
    $("#tpHoraFin").dxDateBox({
      value: new Date(),
      type: "time",
      displayFormat: "HH:mm"
    });
  });

  // txtNombreCliente
  $('#txtNombreCliente').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtPlacaTransporte
   $('#txtPlacaTransporte').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtPlacaTracto
   $('#txtPlacaTracto').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtConductor
   $('#txtConductor').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtEmpresaTransportista
   $('#txtEmpresaTransportista').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtDestino
   $('#txtDestino').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtNumeroViaje
   $('#txtNumeroViaje').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtPorHumedad
   $('#txtPorHumedad').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // COMBO OBSERVACION TRANSPORTE
   $.ajax({ 
    url: 'datos_de.php',
    type: 'GET',
    data: { action: 'cmbObservacionTransporte' },
    dataType: 'json',
    success(data) {
       
        console.log(data)

        idxcmbObservacionTransporte=$('#cmbObservacionTransporte').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Observacion',
        valueExpr: 'IdObservacion',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbObservacionTransporte:', textStatus, errorThrown);
    }, 
  }),

  // txtParedes
  idxtxtParedes = $('#txtParedes').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

  // txtPlataforma
  idxtxtPlataforma = $('#txtPlataforma').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

  // txtTecho
  idxtxtTecho = $('#txtTecho').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

  // txtPuerta
  idxtxtPuerta = $('#txtPuerta').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

   // TEXTBOX Q OBSERVACIONES TRANSPORTE
   idxtxtTotalObservacionesT= $('#txtTotalObservacionesT').dxTextBox({
    value: "0%",
    min: 0,
    max: 100,
    // showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    // onValueChanged(val){
    //   idxtxtPorcentajeTotalObservacionesT=$('#porcentaje').dxTextBox({
    //     value:roundToDecimals((val.value/ 33)*100,2)  + '%' ,
    //   })    
    // }
  }).dxTextBox("instance");
  idxtxtTotalObservacionesT.option("disabled", true);

   // TEXTBOX % OBSERVACIONES TRANSPORTE
   idxtxtPorcentajeTotalObservacionesT= $('#txtPorcentajeTotalObservacionesT').dxTextBox({
    value: "0%",
    min: 0,
    max: 100,
    // showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    // onValueChanged(val){
     
    // }
  }).dxTextBox("instance");
  idxtxtPorcentajeTotalObservacionesT.option("disabled", true);

    // txtLote
    idxtxtLote = $('#txtLote').dxTextBox({
      inputAttr: {'aria-label': 'Name'},
    }),
  
    // txtCodigoProducto
    idxtxtCodigoProducto = $('#txtCodigoProducto').dxTextBox({
      inputAttr: {'aria-label': 'Name'},
    }),
  
    // txtDescripcionProducto
    idxtxtDescripcionProducto= $('#txtDescripcionProducto').dxTextBox({
      inputAttr: {'aria-label': 'Name'},
    }),
  
    // txtNumero
    idxtxtNumero = $('#txtNumero').dxTextBox({
      inputAttr: {'aria-label': 'Name'},
    }),

    // txtHumedadCajas
    idxtxtHumedadCajas = $('#txtHumedadCajas').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

  // txtPalletsTerminados
  idxtxtPalletsTerminados = $('#txtPalletsTerminados').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

  // txtPuchosTerminados
  idxtxtPuchosTerminados = $('#txtPuchosTerminados').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

  // COMBO TIPO MATERIAL
  $.ajax({ 
    url: 'datos_de.php',
    type: 'GET',
    data: { action: 'cmbTipoMaterial' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbTipoMaterial=$('#cmbTipoMaterial').dxSelectBox({          
        dataSource: data,
        displayExpr: 'TipoMaterial',
        valueExpr: 'IdTipoMaterial',
        onValueChanged(val) {

          //  MOSTRAR/OCULTAR MEDICION Y DEFECTOS POR TIPO MATERIAL
           if (val.value==1){
            document.getElementById("grupo_despegado").style.display = "none"; 
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "none";  
            document.getElementById("grupo_piezadanada").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "none";  
            document.getElementById("grupo_puntoroto").style.display = "none"; 
            document.getElementById("grupo_puntosuelto").style.display = "none";   
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "block";  
            document.getElementById("grupo_sinpunto").style.display = "none";  
            document.getElementById("grupo_volteado").style.display = "none";  
                     
          }
          else if(val.value==2){
            document.getElementById("grupo_despegado").style.display = "none"; 
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "block";  
            document.getElementById("grupo_malasujecion").style.display = "none";  
            document.getElementById("grupo_piezadanada").style.display = "block";  
            document.getElementById("grupo_puntoexpuesto").style.display = "none";  
            document.getElementById("grupo_puntoroto").style.display = "none"; 
            document.getElementById("grupo_puntosuelto").style.display = "none";   
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "block";  
            document.getElementById("grupo_sinpunto").style.display = "none";  
            document.getElementById("grupo_volteado").style.display = "none";  
          } 
          else if(val.value==3){
            document.getElementById("grupo_despegado").style.display = "none"; 
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "block";  
            document.getElementById("grupo_piezadanada").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "block";  
            document.getElementById("grupo_puntoroto").style.display = "block"; 
            document.getElementById("grupo_puntosuelto").style.display = "block";   
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "none";  
            document.getElementById("grupo_sinpunto").style.display = "block";  
            document.getElementById("grupo_volteado").style.display = "none"; 
          } 
          else if(val.value==4){
            document.getElementById("grupo_despegado").style.display = "none"; 
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "block";  
            document.getElementById("grupo_piezadanada").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "block";  
            document.getElementById("grupo_puntoroto").style.display = "block"; 
            document.getElementById("grupo_puntosuelto").style.display = "block";   
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "none";  
            document.getElementById("grupo_sinpunto").style.display = "block";  
            document.getElementById("grupo_volteado").style.display = "none"; 
          } 
          else if(val.value==5){
            document.getElementById("grupo_despegado").style.display = "block"; 
            document.getElementById("grupo_dobleetiqueta").style.display = "block";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "none";  
            document.getElementById("grupo_piezadanada").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "none";  
            document.getElementById("grupo_puntoroto").style.display = "none"; 
            document.getElementById("grupo_puntosuelto").style.display = "none";   
            document.getElementById("grupo_rasgado").style.display = "block";  
            document.getElementById("grupo_rotoquebrado").style.display = "none";  
            document.getElementById("grupo_sinpunto").style.display = "none";  
            document.getElementById("grupo_volteado").style.display = "block"; 
          } 
                 
         
        },
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTipoMaterial:', textStatus, errorThrown);
    }, 
  })

    // TEXTBOX CANTIDAD MUESTRA
   idxtxtCantidadMuestra = $('#txtCantidadMuestra').dxNumberBox({
      min: 0,
      max: 100,
      showSpinButtons: true, 

      format: "#0", 
      inputAttr: {
          type: "number",
          inputmode: "numeric",
          pattern: "\\d*"
      },
      onValueChanged(val){
       
        idxtxtDespegadoPorcentaje=$('#txtDespegadoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtDespegado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtDobleEtiquetaPorcentaje=$('#txtDobleEtiquetaPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtDobleEtiqueta.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtImpresionSenasaPorcentajer=$('#txtImpresionSenasaPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtImpresionSenasa.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtMalaSujecionPorcentaje=$('#txtMalaSujecionPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtMalaSujecion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtMalaSujecionPorcentaje=$('#txtMalaSujecionPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtMalaSujecion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPiezaDanadaPorcentaje=$('#txtPiezaDanadaPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtPiezaDanada.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPuntoExpuestoPorcentaje=$('#txtPuntoExpuestoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtPuntoExpuesto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPuntoRotoPorcentaje=$('#txtPuntoRotoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtPuntoRoto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPuntoSueltoPorcentaje=$('#txtPuntoSueltoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtPuntoSuelto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtRasgadoPorcentaje=$('#txtRasgadoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtRasgado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtRotoQuebradoPorcentaje=$('#txtRotoQuebradoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtRotoQuebrado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtSinPuntoPorcentaje=$('#txtSinPuntoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtSinPunto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtVolteadoPorcentaje=$('#txtVolteadoPorcentaje').dxTextBox({
        value:roundToDecimals((idxtxtVolteado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxMetalAcero_Porcentaje=$('#MetalAcero_Porcentaje').dxTextBox({
        value:roundToDecimals((idxMetalAcero.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxInsectos_Porcentaje=$('#Insectos_Porcentaje').dxTextBox({
        value:roundToDecimals((idxInsectos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPiedras_Porcentaje=$('#Piedras_Porcentaje').dxTextBox({
        value:roundToDecimals((idxPiedras.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxOxido_Porcentaje=$('#Oxido_Porcentaje').dxTextBox({
        value:roundToDecimals((idxOxido.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPlastico_Porcentaje=$('#Plastico_Porcentaje').dxTextBox({
        value:roundToDecimals((idxPlastico.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPolvo_Porcentaje=$('#Polvo_Porcentaje').dxTextBox({
        value:roundToDecimals((idxPolvo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPinturas_Porcentaje=$('#Pinturas_Porcentaje').dxTextBox({
        value:roundToDecimals((idxPinturas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxLubricantes_Porcentaje=$('#Lubricantes_Porcentaje').dxTextBox({
        value:roundToDecimals((idxLubricantes.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPetroleo_Porcentaje=$('#Petroleo_Porcentaje').dxTextBox({
        value:roundToDecimals((idxPetroleo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxGrasas_Porcentaje=$('#Grasas_Porcentaje').dxTextBox({
        value:roundToDecimals((idxGrasas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxTinta_Porcentaje=$('#Tinta_Porcentaje').dxTextBox({
        value:roundToDecimals((idxTinta.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxHongos_Porcentaje=$('#Hongos_Porcentaje').dxTextBox({
        value:roundToDecimals(( idxHongos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxMoho_Porcentaje=$('#Moho_Porcentaje').dxTextBox({
        value:roundToDecimals((idxMoho.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxHecesAnimales_Porcentaje=$('#HecesAnimales_Porcentaje').dxTextBox({
        value:roundToDecimals((idxHecesAnimales.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxSaliva_Porcentaje=$('#Saliva_Porcentaje').dxTextBox({
        value:roundToDecimals((idxSaliva.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
          + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
          + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
          + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
          + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
          + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
          + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
          + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
          + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })
      }

  }).dxNumberBox("instance");

  function roundToDecimals(num, decimals) {
    let factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
  // COMBO OBSERVACION MUESTRA
  $.ajax({ 
    url: 'datos_de.php',
    type: 'GET',
    data: { action: 'cmbObservacionMuestra' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbObservacionMuestra=$('#cmbObservacionMuestra').dxSelectBox({          
        dataSource: data,
        displayExpr: 'Observacion',
        valueExpr: 'IdObservacion',
        onValueChanged(val){
          if ( val.value == 1  ){   
            idxtxtDespegado.option("disabled", false);
            idxtxtDobleEtiqueta.option("disabled", false);
            idxtxtImpresionSenasa.option("disabled", false);
            idxtxtMalaSujecion.option("disabled", false);
            idxtxtPiezaDanada.option("disabled", false);
            idxtxtPuntoExpuesto.option("disabled", false);
            idxtxtPuntoRoto.option("disabled", false);
            idxtxtPuntoSuelto.option("disabled", false);
            idxtxtRasgado.option("disabled", false);
            idxtxtRotoQuebrado.option("disabled", false);
            idxtxtSinPunto.option("disabled", false);
            idxtxtVolteado.option("disabled", false);
            idxMetalAcero.option("disabled", false);
            idxInsectos.option("disabled", false);
            idxPiedras.option("disabled", false);
            idxOxido.option("disabled", false);
            idxPlastico.option("disabled", false);
            idxPolvo.option("disabled", false);
            idxPinturas.option("disabled", false);
            idxLubricantes.option("disabled", false);
            idxPetroleo.option("disabled", false);
            idxGrasas.option("disabled", false);
            idxTinta.option("disabled", false);
            idxHongos.option("disabled", false);
            idxMoho.option("disabled", false);
            idxHecesAnimales.option("disabled", false);
            idxSaliva.option("disabled", false);
          }
            else{
              idxtxtDespegado.option("disabled", true);
              idxtxtDobleEtiqueta.option("disabled", true);
              idxtxtImpresionSenasa.option("disabled", true);
              idxtxtMalaSujecion.option("disabled", true);
              idxtxtPiezaDanada.option("disabled", true);
              idxtxtPuntoExpuesto.option("disabled", true);
              idxtxtPuntoRoto.option("disabled", true);
              idxtxtPuntoSuelto.option("disabled", true);
              idxtxtRasgado.option("disabled", true);
              idxtxtRotoQuebrado.option("disabled", true);
              idxtxtSinPunto.option("disabled", true);
              idxtxtVolteado.option("disabled", true);
              idxMetalAcero.option("disabled", true);
              idxInsectos.option("disabled", true);
              idxPiedras.option("disabled", true);
              idxOxido.option("disabled", true);
              idxPlastico.option("disabled", true);
              idxPolvo.option("disabled", true);
              idxPinturas.option("disabled", true);
              idxLubricantes.option("disabled", true);
              idxPetroleo.option("disabled", true);
              idxGrasas.option("disabled", true);
              idxTinta.option("disabled", true);
              idxHongos.option("disabled", true);
              idxMoho.option("disabled", true);
              idxHecesAnimales.option("disabled", true);
              idxSaliva.option("disabled", true);        
          }       
        }
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbObservacionMuestra:', textStatus, errorThrown);
    }, 
  })

  // TEXTBOX DESPEGAGO CON PORCENTAJE DESPEGADO
  idxtxtDespegado= $('#txtDespegado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtDespegadoPorcentaje=$('#txtDespegadoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtDespegado.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Despegado
    idxtxtDespegadoPorcentaje= $('#txtDespegadoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX Dobleetiqueta CON PORCENTAJE DobleEtiqueta
  idxtxtDobleEtiqueta= $('#txtDobleEtiqueta').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtDobleEtiquetaPorcentaje=$('#txtDobleEtiquetaPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtDobleEtiqueta.option("disabled", true);
  
    // TEXTBOX PORCENTAJE DobleEtiqueta
    idxtxtDobleEtiquetaPorcentaje= $('#txtDobleEtiquetaPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE ImpresionSenasa
  idxtxtImpresionSenasa= $('#txtImpresionSenasa').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtImpresionSenasaPorcentaje=$('#txtImpresionSenasaPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtImpresionSenasa.option("disabled", true);
  
    // TEXTBOX PORCENTAJE ImpresionSenasa
    idxtxtImpresionSenasaPorcentaje= $('#txtImpresionSenasaPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE MalaSujecion
  idxtxtMalaSujecion= $('#txtMalaSujecion').dxNumberBox({
    //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxtxtMalaSujecionPorcentaje=$('#txtMalaSujecionPorcentaje').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtMalaSujecion.option("disabled", true);
  
    // TEXTBOX PORCENTAJE MalaSujecion
    idxtxtMalaSujecionPorcentaje= $('#txtMalaSujecionPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE PiezaDanada
  idxtxtPiezaDanada= $('#txtPiezaDanada').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPiezaDanadaPorcentaje=$('#txtPiezaDanadaPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtPiezaDanada.option("disabled", true);
  
    // TEXTBOX PORCENTAJE PiezaDanada
    idxtxtPiezaDanadaPorcentaje= $('#txtPiezaDanadaPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE PuntoExpuesto
  idxtxtPuntoExpuesto= $('#txtPuntoExpuesto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPuntoExpuestoPorcentaje=$('#txtPuntoExpuestoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtPuntoExpuesto.option("disabled", true);
  
    // TEXTBOX PORCENTAJE PuntoExpuesto
    idxtxtPuntoExpuestoPorcentaje= $('#txtPuntoExpuestoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE PuntoRoto
  idxtxtPuntoRoto= $('#txtPuntoRoto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPuntoRotoPorcentaje=$('#txtPuntoRotoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtPuntoRoto.option("disabled", true);
  
    // TEXTBOX PORCENTAJE PuntoRoto
    idxtxtPuntoRotoPorcentaje= $('#txtPuntoRotoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE PuntoSuelto
  idxtxtPuntoSuelto= $('#txtPuntoSuelto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPuntoSueltoPorcentaje=$('#txtPuntoSueltoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtPuntoSuelto.option("disabled", true);
  
    // TEXTBOX PORCENTAJE PuntoSuelto
    idxtxtPuntoSueltoPorcentaje= $('#txtPuntoSueltoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Rasgado
  idxtxtRasgado= $('#txtRasgado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtRasgadoPorcentaje=$('#txtRasgadoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtRasgado.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Rasgado
    idxtxtRasgadoPorcentaje= $('#txtRasgadoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE RotoQuebrado
  idxtxtRotoQuebrado= $('#txtRotoQuebrado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtRotoQuebradoPorcentaje=$('#txtRotoQuebradoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtRotoQuebrado.option("disabled", true);
  
    // TEXTBOX PORCENTAJE RotoQuebrado
    idxtxtRotoQuebradoPorcentaje= $('#txtRotoQuebradoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX DESPEGAGO CON PORCENTAJE SinPunto
    idxtxtSinPunto= $('#txtSinPunto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtSinPuntoPorcentaje=$('#txtSinPuntoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtSinPunto.option("disabled", true);
  
    // TEXTBOX PORCENTAJE SinPunto
    idxtxtSinPuntoPorcentaje= $('#txtSinPuntoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Volteado
  idxtxtVolteado= $('#txtVolteado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtVolteadoPorcentaje=$('#txtVolteadoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtVolteado.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Volteado
    idxtxtVolteadoPorcentaje= $('#txtVolteadoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX METAL ACERO CON PORCENTAJE MetalAcero
    idxMetalAcero= $('#MetalAcero').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxMetalAceroPorcentaje=$('#MetalAceroPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtMetalAcero.option("disabled", true);
  
    // TEXTBOX PORCENTAJE MetalAcero
    idxMetalAceroPorcentaje= $('#MetalAceroPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Insectos
  idxInsectos= $('#Insectos').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxInsectosPorcentaje=$('#InsectosPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtInsectos.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Insectos
    idxInsectosPorcentaje= $('#InsectosPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Piedras
  idxPiedras= $('#Piedras').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxPiedrasPorcentaje=$('PiedrasPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtPiedras.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Piedras
    idxPiedrasPorcentaje= $('#PiedrasPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Oxido
  idxOxido= $('#Oxido').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxOxidoPorcentaje=$('#OxidoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtOxido.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Oxido
    idxOxidoPorcentaje= $('#OxidoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Plastico
  idxPlastico= $('#Plastico').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxPlasticoPorcentaje=$('#PlasticoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtPlastico.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Plastico
    idxPlasticoPorcentaje= $('#PlasticoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Polvo
  idxPolvo= $('#Polvo').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxPolvoPorcentaje=$('#PolvoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtPolvo.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Polvo
    idxPolvoPorcentaje= $('#PolvoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Pinturas
  idxPinturas= $('#Pinturas').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxPinturasPorcentaje=$('#PinturasPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtPinturas.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Pinturas
    idxPinturasPorcentaje= $('#PinturasPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Lubricantes
  idxLubricantes= $('#Lubricantes').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxLubricantesPorcentaje=$('#LubricantesPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtLubricantes.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Lubricantes
    idxLubricantesPorcentaje= $('#LubricantesPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Petroleo
  idxPetroleo= $('#Petroleo').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxPetroleoPorcentaje=$('#PetroleoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtPetroleo.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Petroleo
    idxPetroleoPorcentaje= $('#PetroleoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX GRASAS CON PORCENTAJE Grasas
    idxGrasas= $('#Grasas').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxGrasasPorcentaje=$('#GrasasPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtGrasas.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Grasas
    idxGrasasPorcentaje= $('#GrasasPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX TINTA CON PORCENTAJE TINTA
    idxTinta= $('#Tinta').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxTintaPorcentaje=$('#TintaPorcentaje').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
          + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
          + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
          + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
          + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
          + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
          + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
          + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
          + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        }) 
      }
    }).dxNumberBox("instance");
    // idxtxtGrasas.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Grasas
      idxTintaPorcentaje= $('#TintaPorcentaje').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Hongos
    idxHongos= $('#Hongos').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxHongosPorcentaje=$('#HongosPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtHongos.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Hongos
    idxHongosPorcentaje= $('#HongosPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })
      // TEXTBOX DESPEGAGO CON PORCENTAJE Moho
    idxMoho= $('#Moho').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxMohoPorcentaje=$('#MohoPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtMoho.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Moho
    idxMohoPorcentaje= $('#MohoPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE HecesAnimales
  idxHecesAnimales= $('#HecesAnimales').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxHecesAnimalesPorcentaje=$('#HecesAnimalesPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtHecesAnimales.option("disabled", true);
  
    // TEXTBOX PORCENTAJE HecesAnimales
    idxHecesAnimalesPorcentaje= $('#HecesAnimalesPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX DESPEGAGO CON PORCENTAJE Saliva
  idxSaliva= $('#Saliva').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxSalivaPorcentaje=$('#SalivaPorcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtDespegado.option("value") + idxtxtDobleEtiqueta.option("value") + idxtxtImpresionSenasa.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtPiezaDanada.option("value")+ idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")
        + idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtVolteado.option("value")+ idxMetalAcero.option("value")+ idxInsectos.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPlastico.option("value")
        + idxPolvo.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")
        + idxPetroleo.option("value")+ idxGrasas.option("value")+ idxTinta.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSaliva.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  // idxtxtSaliva.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Saliva
    idxSalivaPorcentaje= $('#SalivaPorcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX Q OBSERVACIONES
   idxtxtTotalObservaciones= $('#txtTotalObservaciones').dxTextBox({
    value: "0%",
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    // onValueChanged(val){
     
    // }
  }).dxTextBox("instance");
  idxtxtTotalObservaciones.option("disabled", true);

   // TEXTBOX % OBSERVACIONES
   idxtxtPorcentajeTotalObservaciones= $('#txtPorcentajeTotalObservaciones').dxTextBox({
    value: "0%",
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    // onValueChanged(val){
     
    // }
  }).dxTextBox("instance");
  idxtxtPorcentajeTotalObservaciones.option("disabled", true);


  // AGREGAR TEXTO DE CHECKBOX A TEXTBOX
  function actualizarSeleccion(grupoCheckbox, idTxt) 
{  let seleccionados = $(grupoCheckbox + " input[type='checkbox']:checked")
      .map((i, el) => el.value).get().join(" - ");
  $(idTxt).text(seleccionados); 
}
// AXCTUALIZAR CANTIDAD Y PORCENTAJE DE OBSERVACIONES
function actualizarTotalObservaciones() 
{
  let totalSeleccionados = $("input[type='checkbox']:checked").length;
  $("#txtTotalObservacionesT").text(totalSeleccionados); 
  let porcentajeTotal = (totalSeleccionados * 3.03).toFixed(2); 
  $("#txtPorcentajeTotalObservacionesT").text(porcentajeTotal + "%"); 
  if (porcentajeTotal > 6) {
      $("#txtPorcentajeTotalObservacionesT").css("color", "red"); 
  } else {
      $("#txtPorcentajeTotalObservacionesT").css("color", "white"); 
  }
}
$(document).ready(
  function() 
  {
  $("#checkboxparedes input[type='checkbox']").on("change", 
    function() 
    {
      actualizarSeleccion("#checkboxparedes", "#txtParedes");
      actualizarTotalObservaciones();
  });
  $("#checkboxplataforma input[type='checkbox']").on("change", 
    function() 
    {
      actualizarSeleccion("#checkboxplataforma", "#txtPlataforma");
      actualizarTotalObservaciones();
  });
  $(".checkboxtecho input[type='checkbox']").on("change", 
    function() 
    {
      actualizarSeleccion(".checkboxtecho", "#txtTecho");
      actualizarTotalObservaciones();
  });
  $(".checkboxpuerta input[type='checkbox']").on("change", 
    function() 
    {
      actualizarSeleccion(".checkboxpuerta", "#txtPuerta");
      actualizarTotalObservaciones();
  });
});


    // EVIDENCIA - CAPTURA DE IMAGEN POR CAMARA
    function tieneSoporteUserMedia() {
      return !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
    }
    function _getUserMedia() {
      return (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);
    }
    
    // Declaramos elementos del DOM
    const $video = document.querySelector("#video"),
      $canvas = document.querySelector("#canvas"),
      $boton = document.querySelector("#boton"),
      $estado = document.querySelector("#estado"),
      $listaDeDispositivos = document.querySelector("#listaDeDispositivos");
    
    // La función que es llamada después de que ya se dieron los permisos
    // Lo que hace es llenar el select con los dispositivos obtenidos
    const llenarSelectConDispositivosDisponibles = () => {
    
      navigator
        .mediaDevices
        .enumerateDevices()
        .then(function (dispositivos) {
          const dispositivosDeVideo = [];
          dispositivos.forEach(function (dispositivo) {
            const tipo = dispositivo.kind;
            if (tipo === "videoinput") {
              dispositivosDeVideo.push(dispositivo);
            }
          });
    
          // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
          if (dispositivosDeVideo.length > 0) {
            // Llenar el select
            dispositivosDeVideo.forEach(dispositivo => {
              const option = document.createElement('option');
              option.value = dispositivo.deviceId;
              option.text = dispositivo.label;
              $listaDeDispositivos.appendChild(option);
              console.log("$listaDeDispositivos => ", $listaDeDispositivos)
            });
          }
        });
    }
  
    (function () {
      // Comenzamos viendo si tiene soporte, si no, nos detenemos
      if (!tieneSoporteUserMedia()) {
        alert("Lo siento. Tu navegador no soporta esta característica");
        $estado.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
        return;
      }
      //Aquí guardaremos el stream globalmente
      let stream;
    
      // Comenzamos pidiendo los dispositivos
      navigator
        .mediaDevices
        .enumerateDevices()
        .then(function (dispositivos) {
          // Vamos a filtrarlos y guardar aquí los de vídeo
          const dispositivosDeVideo = [];
    
          // Recorrer y filtrar
          dispositivos.forEach(function (dispositivo) {
            const tipo = dispositivo.kind;
            if (tipo === "videoinput") {
              dispositivosDeVideo.push(dispositivo);
            }
          });
    
          // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
          // y le pasamos el id de dispositivo
          if (dispositivosDeVideo.length > 0) {
            // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
            mostrarStream(dispositivosDeVideo[0].deviceId);
          }
        });
    
      const mostrarStream = idDeDispositivo => {
        _getUserMedia(
          {
            video: {
              // Justo aquí indicamos cuál dispositivo usar
              deviceId: idDeDispositivo,
            }
          },
          function (streamObtenido) {
            // Aquí ya tenemos permisos, ahora sí llenamos el select,
            // pues si no, no nos daría el nombre de los dispositivos
            llenarSelectConDispositivosDisponibles();
    
            // Escuchar cuando seleccionen otra opción y entonces llamar a esta función
            $listaDeDispositivos.onchange = () => {
              // Detener el stream
              if (stream) {
                stream.getTracks().forEach(function (track) {
                  track.stop();
                });
              }
              // Mostrar el nuevo stream con el dispositivo seleccionado
              mostrarStream($listaDeDispositivos.value);
            }
    
            // Simple asignación
            stream = streamObtenido;
    
            // Mandamos el stream de la cámara al elemento de vídeo
            $video.srcObject = stream;
            $video.play();
    
            //Escuchar el click del botón para tomar la foto
            $boton.addEventListener("click", function () {
    
              //Pausar reproducción
              $video.pause();
    
              //Obtener contexto del canvas y dibujar sobre él
              let contexto = $canvas.getContext("2d");
              $canvas.width = $video.videoWidth;
              $canvas.height = $video.videoHeight;
              contexto.drawImage($video, 0, 0, $canvas.width, $canvas.height);
    
              let foto = $canvas.toDataURL(); //Esta es la foto, en base 64
              $estado.innerHTML = "Enviando foto. Por favor, espera...";
              fetch("./guardar_foto.php", {
                method: "POST",
                body: encodeURIComponent(foto),
                headers: {
                  "Content-type": "application/x-www-form-urlencoded",
                }
              })
                .then(resultado => {
                  // A los datos los decodificamos como texto plano
                  return resultado.text()
                })
                .then(nombreDeLaFoto => {
                  // nombreDeLaFoto trae el nombre de la imagen que le dio PHP
                  console.log("La foto fue enviada correctamente");
                  $estado.innerHTML = `Foto guardada. <a target='_blank' href='./${nombreDeLaFoto}'> Ver foto</a>`;
                })
    
              //Reanudar reproducción
              $video.play();
            });
          }, function (error) {
            console.log("Permiso denegado o error: ", error);
            $estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
          });
      }
    })();

});
