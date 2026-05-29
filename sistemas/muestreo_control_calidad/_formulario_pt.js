var is_cmbTipoProducto_pordefecto=null
var is_cmbDestino_pordefecto=null
var is_cmbCliente_pordefecto=null
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
      window.location.href = 'registros.php';
    },
  });

  $('#btnCerrarSesion').dxButton({
    stylingMode: 'contained',
    text: 'Cerrar Sesión',
    type: 'success',
    width: 120,
    onClick() {

      $.ajax({ 
        url: 'datos_pt.php',
        type: 'GET',
        data: { action: 'wf_cerrarsesion' ,parametros: ""},
        dataType: 'json',
        success(data) {                    
            console.log("logout",data) 
            window.location.href = 'acceso.html?par_accion=agregar&id=0';        
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
  var dxcmbTurno = $("#cmbTurno").dxSelectBox("instance").option("value");
  var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
  var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
  var dxcmbCampaña = $("#cmbCampaña").dxSelectBox("instance").option("value");
  var dxcmbTipoProducto = $("#cmbTipoProducto").dxSelectBox("instance").option("value");
  var dxcmbDestino = $("#cmbDestino").dxSelectBox("instance").option("value");
  var dxcmbCliente = $("#cmbCliente").dxSelectBox("instance").option("value");
  var dxcmbMateriaPrima = $("#cmbMateriaPrima").dxSelectBox("instance").option("value");
  var dxcmbCodigoPallet = $("#cmbCodigoPallet").dxSelectBox("instance").option("value");
  var dxcmbLoteProduccion = $("#cmbLoteProduccion").dxSelectBox("instance").option("value");
  var dxcmbLineaEnsamblaje = $("#cmbLineaEnsamblaje").dxSelectBox("instance").option("value");
  var dxcmbCantidad = $("#cmbCantidad").dxSelectBox("instance").option("value");
  var dxcmbCodigoProducto = $("#cmbCodigoProducto").dxSelectBox("instance").option("value");
  var dxcmbDescripcionProducto = $("#cmbDescripcionProducto").dxSelectBox("instance").option("value");

  dxdpFecha = formatDate( dxdpFecha )
  dxtpHoraInicio = formatTime( dxtpHoraInicio )
  dxtpHoraFin = formatTime( dxtpHoraFin )

  if (ls_accion =="agregar"){
    if ( dxcmbSede == null ){
      alert("Debe ingresar Sede")
      return false
    }
    if ( dxcmbTurno == null ){
      alert("Debe ingresar Turno")
      return false
    }
    if ( dxcmbCampaña == null ){
      alert("Debe ingresar Campaña")
      return false
    }
    if ( dxcmbTipoProducto == null ){
      alert("Debe ingresar Tipo Producto")
      return false
    } 
    if ( dxcmbDestino == null ){
      alert("Debe ingresar Destino")
      return false
    }
    if ( dxcmbCliente == null ){
      alert("Debe ingresar Cliente")
      return false
    }
    if ( dxcmbMateriaPrima == null ){
      alert("Debe ingresar Materia Prima")
      return false
    }
    if ( dxcmbCodigoPallet == null ){
      alert("Debe ingresar Codigo Pallet")
      return false
    }
    if ( dxcmbLoteProduccion == null ){
      alert("Debe ingresar Lote Produccion")
      return false
    }
    if ( dxcmbLineaEnsamblaje == null ){
      alert("Debe ingresar Linea Ensamblaje")
      return false
    }
    if ( dxcmbCantidad == null ){
      alert("Debe ingresar Cantidad")
      return false
    }
    if ( dxcmbCodigoProducto == null ){
      alert("Debe ingresar CodigoProducto")
      return false
    }
    if ( dxcmbDescripcionProducto == null ){
      alert("Debe ingresar Descripcion Producto")
      return false
    }
  }
  else if (ls_accion =="editar"){
    if ( dxtpHora == null ){
      alert("Debe ingresar Hora")
      return false
    }
  }
  return true
  }

  function btnAceptar_click()
  {
    var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
    var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
    var dxcmbTurno = $("#cmbturno").dxSelectBox("instance").option("value");
    var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
    var dxcmbCampaña = $("#cmbCampaña").dxSelectBox("instance").option("value");
    var dxcmbTipoProducto = $("#cmbTipoProducto").dxSelectBox("instance").option("value");
    var dxcmbDestino = $("#cmbProcedencia").dxSelectBox("instance").option("value");
    var dxcmbCliente = $("#cmbProveedor").dxSelectBox("instance").option("value");
    var dxcmbMateriaPrima = $("#cmbMateriaPrima").dxSelectBox("instance").option("value");
    var dxcmbCodigoPallet = $("#cmbCodigoPallet").dxSelectBox("instance").option("value");
    var dxcmbLoteProduccion = $("#cmbLoteProduccion").dxSelectBox("instance").option("value");
    var dxcmbLineaEnsamblaje = $("#cmbLineaEnsamblaje").dxSelectBox("instance").option("value");
    var dxcmbCantidad = $("#cmbCantidad").dxSelectBox("instance").option("value");
    var dxcmbCodigoProducto = $("#cmbCodigoProducto").dxSelectBox("instance").option("value");
    var dxcmbDescripcionProducto = $("#cmbDescripcionProducto").dxSelectBox("instance").option("value");
    var dxtxtTrazabilidadObservacion= $("#txtTrazabilidadObservacion").dxTextBox("instance").option("value");
    var dxcmbPaletizadoObservacion= $("#cmbPaletizadoObservacion").dxSelectBox("instance").option("value");
    var dxtxtContaminacion= $("#txtContaminacion").dxSelectBox("instance").option("value");
    var dxtxtPaletizadoPeligros= $("#txtPaletizadoPeligros").dxTextBox("instance").option("value");
    var dxtxtPaletizadoConforme= $("#txtPaletizadoConforme").dxTextBox("instance").option("value");
    var dxtxtSelladoConforme= $("#txtSelladoConforme").dxTextBox("instance").option("value");
    var dxcmbTipoMaterial= $("#cmbTipoMaterial").dxSelectBox("instance").option("value");
    var dxtxtCantidadMuestra= $("#txtCantidadMuestra").dxNumberBox("instance").option("value");
    var dxcmbObservacionMuestra= $("#cmbObservacionMuestra").dxSelectBox("instance").option("value");
    var dxtxtAncho= $("#txtAncho").dxNumberBox("instance").option("value");
    var dxtxtDetalleAncho= $("#txtDetalleAncho").dxTextBox("instance").option("value");
    var dxtxtUnidadesAncho= $("#txtUnidadesAncho").dxTextBox("instance").option("value");
    var dxtxtPorcentajeAncho= $("#txtPorcentajeAncho").dxTextBox("instance").option("value");
    var dxtxtLargo= $("#txtLargo").dxNumberBox("instance").option("value");
    var dxtxtDetalleLargo= $("#txtDetalleLargo").dxTextBox("instance").option("value");
    var dxtxtUnidadesLargo= $("#txtUnidadesLargo").dxTextBox("instance").option("value");
    var dxtxtPorcentajeLargo= $("#txtPorcentajeLargo").dxTextBox("instance").option("value");
    var dxtxtAlto= $("#txtAlto").dxNumberBox("instance").option("value");
    var dxtxtDetalleAlto= $("#txtDetallePeso").dxTextBox("instance").option("value");
    var dxtxtUnidadesAlto= $("#txtUnidadesPeso").dxTextBox("instance").option("value");
    var dxtxtPorcentajeAlto= $("#txtPorcentajePeso").dxTextBox("instance").option("value");
    var dxtxtEspesor= $("#txtEspesor").dxNumberBox("instance").option("value");
    var dxtxtDetalleEspesor= $("#txtDetalleEspesor").dxTextBox("instance").option("value");
    var dxtxtUnidadesEspesor= $("#txtUnidadesEspesor").dxTextBox("instance").option("value");
    var dxtxtPorcentajeEspesor= $("#txtPorcentajeEspesor").dxTextBox("instance").option("value");
    var dxtxtHumedad= $("#txtHumedad").dxNumberBox("instance").option("value");
    var dxtxtDetalleHumedad= $("#txtDetalleHumedad").dxTextBox("instance").option("value");
    var dxtxtUnidadesHumedad= $("#txtUnidadesHumedad").dxTextBox("instance").option("value");
    var dxtxtPorcentajeHumedad= $("#txtPorcentajeHumedad").dxTextBox("instance").option("value");
    var dxtxtArqueado= $("#txtArqueado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeArqueado= $("#txtPorcentajeArqueado").dxTextBox("instance").option("value");
    var dxtxtColor= $("#txtColor").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeColor= $("#txtPorcentajeColor").dxTextBox("instance").option("value");
    var dxtxtCorte= $("#txtCorte").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeCorte= $("#txtPorcentajeCorte").dxTextBox("instance").option("value");
    var dxtxtDescuadrado= $("#txtDescuadrado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeDescuadrado= $("#txtPorcentajeDescuadrado").dxTextBox("instance").option("value");
    var dxtxtDespegado= $("#txtDespegado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeDespegado= $("#txtPorcentajeDespegado").dxTextBox("instance").option("value");
    var dxtxtDobleEtiqueta= $("#txtDobleEtiqueta").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeDobleEtiqueta= $("#txtPorcentajeDobleEtiqueta").dxTextBox("instance").option("value");
    var dxtxtFalloImpresion= $("#txtFalloImpresion").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeFalloImpresion= $("#txtPorcentajeFalloImpresion").dxTextBox("instance").option("value");
    var dxtxtGrietas= $("#txtGrietas").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeGrietas= $("#txtPorcentajeGrietas").dxTextBox("instance").option("value");
    var dxtxtImpresionSenasa= $("#txtImpresionSenasa").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeImpresionSenasa= $("#txtPorcentajeImpresionSenasa").dxTextBox("instance").option("value");
    var dxtxtMalaDistribucion= $("#txtMalaDistribucion").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeMalaDistribucion= $("#txtPorcentajeMalaDistribucion").dxTextBox("instance").option("value");
    var dxtxtMalaSujecion= $("#txtMalaSujecion").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeMalaSujecion= $("#txtPorcentajeMalaSujecion").dxTextBox("instance").option("value");
    var dxtxtManchasAzules= $("#txtManchasAzules").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeManchasAzules= $("#txtPorcentajeManchasAzules").dxTextBox("instance").option("value");
    var dxtxtNoUV= $("#txtNoUV").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeNoUV= $("#txtPorcentajeNoUV").dxTextBox("instance").option("value");
    var dxtxtNudo= $("#txtNudo").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeNudo= $("#txtPorcentajeNudo").dxTextBox("instance").option("value");
    var dxtxtOrificios= $("#txtOrificios").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeOrificios= $("#txtPorcentajeOrificios").dxTextBox("instance").option("value");
    var dxtxtPartidura= $("#txtPartidura").dxNumberBox("instance").option("value");
    var dxtxtPorcentajePartidura= $("#txtPorcentajePartidura").dxTextBox("instance").option("value");
    var dxtxtPuntoExpuesto= $("#txtPuntoExpuesto").dxNumberBox("instance").option("value");
    var dxtxtPorcentajePuntoExpuesto= $("#txtPorcentajePuntoExpuesto").dxTextBox("instance").option("value");
    var dxtxtPuntoRoto= $("#txtPuntoRoto").dxNumberBox("instance").option("value");
    var dxtxtPorcentajePuntoRoto= $("#txtPorcentajePuntoRoto").dxTextBox("instance").option("value");
    var dxtxtPuntoSuelto= $("#txtPuntoSuelto").dxNumberBox("instance").option("value");
    var dxtxtPorcentajePuntoSuelto= $("#txtPorcentajePuntoSuelto").dxTextBox("instance").option("value");
    var dxtxtRasgado= $("#txtRasgado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeRasgado= $("#txtPorcentajeRasgado").dxTextBox("instance").option("value");
    var dxtxtRotoQuebrado= $("#txtRotoQuebrado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeRotoQuebrado= $("#txtPorcentajeRotoQuebrado").dxTextBox("instance").option("value");
    var dxtxtSinPunto= $("#txtSinPunto").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeSinPunto= $("#txtPorcentajeSinPunto").dxTextBox("instance").option("value");
    var dxtxtTexturaGranulada= $("#txtTexturaGranulada").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeTexturaGranulada= $("#txtPorcentajeTexturaGranulada").dxTextBox("instance").option("value");
    var dxtxtVacio= $("#txtVacio").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeVacio= $("#txtPorcentajeVacio").dxTextBox("instance").option("value");
    var dxtxtVentilacion= $("#txtVentilacion").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeVentilacion= $("#txtPorcentajeVentilacion").dxTextBox("instance").option("value");
    var dxtxtVolteado= $("#txtVolteado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeVolteado= $("#txtPorcentajeVolteado").dxTextBox("instance").option("value");
    var dxmuestreo_txt1= $("#muestreo_txt1").dxNumberBox("instance").option("value");
    var dxmuestreo_txt1_porcentaje= $("#muestreo_txt1_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt2= $("#muestreo_txt2").dxNumberBox("instance").option("value");
    var dxmuestreo_txt2_porcentaje= $("#muestreo_txt2_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt3= $("#muestreo_txt3").dxNumberBox("instance").option("value");
    var dxmuestreo_txt3_porcentaje= $("#muestreo_txt3_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt4= $("#muestreo_txt4").dxNumberBox("instance").option("value");
    var dxmuestreo_txt4_porcentaje= $("#muestreo_txt4_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt5= $("#muestreo_txt5").dxNumberBox("instance").option("value");
    var dxmuestreo_txt5_porcentaje= $("#muestreo_txt5_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt6= $("#muestreo_txt6").dxNumberBox("instance").option("value");
    var dxmuestreo_txt6_porcentaje= $("#muestreo_txt6_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt7= $("#muestreo_txt7").dxNumberBox("instance").option("value");
    var dxmuestreo_txt7_porcentaje= $("#muestreo_txt7_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt8= $("#muestreo_txt8").dxNumberBox("instance").option("value");
    var dxmuestreo_txt8_porcentaje= $("#muestreo_txt8_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt9= $("#muestreo_txt9").dxNumberBox("instance").option("value");
    var dxmuestreo_txt9_porcentaje= $("#muestreo_txt9_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt10_txt5= $("#muestreo_txt10").dxNumberBox("instance").option("value");
    var dxmuestreo_txt10_porcentaje= $("#muestreo_txt10_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt11= $("#muestreo_txt11").dxNumberBox("instance").option("value");
    var dxmuestreo_txt11_porcentaje= $("#muestreo_txt11_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt12= $("#muestreo_txt12").dxNumberBox("instance").option("value");
    var dxmuestreo_txt12_porcentaje= $("#muestreo_txt12_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt16= $("#muestreo_txt16").dxTextBox("instance").option("value");
    var dxmuestreo_txt13= $("#muestreo_txt13").dxNumberBox("instance").option("value");
    var dxmuestreo_txt13_porcentaje= $("#muestreo_txt13_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt14= $("#muestreo_txt14").dxNumberBox("instance").option("value");
    var dxmuestreo_txt14_porcentaje= $("#muestreo_txt14_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt15= $("#muestreo_txt15").dxNumberBox("instance").option("value");
    var dxmuestreo_txt15_porcentaje= $("#muestreo_txt15_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt17= $("#muestreo_txt17").dxNumberBox("instance").option("value");
    var dxmuestreo_txt17_porcentaje= $("#muestreo_txt17_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt18= $("#muestreo_txt18").dxNumberBox("instance").option("value");
    var dxmuestreo_txt18_porcentaje= $("#muestreo_txt18_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt19= $("#muestreo_txt19").dxNumberBox("instance").option("value");
    var dxmuestreo_txt19_porcentaje= $("#muestreo_txt19_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt20= $("#muestreo_txt20").dxNumberBox("instance").option("value");
    var dxmuestreo_txt20_porcentaje= $("#muestreo_txt20_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt21= $("#muestreo_txt21").dxNumberBox("instance").option("value");
    var dxmuestreo_txt21_porcentaje= $("#muestreo_txt21_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt22= $("#muestreo_txt22").dxNumberBox("instance").option("value");
    var dxmuestreo_txt22_porcentaje= $("#muestreo_txt22_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt23= $("#muestreo_txt23").dxNumberBox("instance").option("value");
    var dxmuestreo_txt23_porcentaje= $("#muestreo_txt23_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt24= $("#muestreo_txt24").dxNumberBox("instance").option("value");
    var dxmuestreo_txt24_porcentaje= $("#muestreo_txt24_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt25= $("#muestreo_txt25").dxNumberBox("instance").option("value");
    var dxmuestreo_txt25_porcentaje= $("#muestreo_txt25_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt26= $("#muestreo_txt26").dxNumberBox("instance").option("value");
    var dxmuestreo_txt26_porcentaje= $("#muestreo_txt26_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt27= $("#muestreo_txt27").dxNumberBox("instance").option("value");
    var dxmuestreo_txt27_porcentaje= $("#muestreo_txt27_porcentaje").dxTextBox("instance").option("value");
    var dxmuestreo_txt28= $("#muestreo_txt28").dxTextBox("instance").option("value");
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
      ls_parametros=ls_accion +","+dxcmbSede+","+dxdpFecha+","+dxcmbTurno+","+dxtpHoraInicio+","+dxtpHoraFin+","+dxcmbCampaña+","+dxcmbTipoProducto+","+dxcmbDestino+","
      +dxcmbCliente+","+dxcmbMateriaPrima+","+dxcmbCodigoPallet+","+dxcmbLoteProduccion+","+dxcmbLineaEnsamblaje+","+dxcmbCantidad+","+dxcmbCodigoProducto+","
      +dxcmbDescripcionProducto+","+dxtxtTrazabilidadObservacion+","+dxcmbPaletizadoObservacion+","+dxtxtContaminacion+","+dxtxtPaletizadoPeligros+","+dxtxtPaletizadoConforme+","+dxtxtSelladoConforme+","
      +dxcmbTipoMaterial+","+dxtxtCantidadMuestra+","+dxcmbObservacionMuestra+","+dxtxtAncho+","+dxtxtDetalleAncho+","+dxtxtUnidadesAncho+","+dxtxtPorcentajeAncho+","
      +dxtxtLargo+","+dxtxtDetalleLargo+","+dxtxtUnidadesLargo+","+dxtxtPorcentajeLargo+","+dxtxtAlto+","+dxtxtDetalleAlto+","+dxtxtUnidadesAlto+","+dxtxtPorcentajeAlto+","+dxtxtEspesor+","
      +dxtxtDetalleEspesor+","+dxtxtUnidadesEspesor+","+dxtxtPorcentajeEspesor+","+dxtxtHumedad+","+dxtxtDetalleHumedad+","+dxtxtUnidadesHumedad+","+dxtxtPorcentajeHumedad+","+dxtxtArqueado+","
      +dxtxtPorcentajeArqueado+","+dxtxtColor+","+dxtxtPorcentajeColor+","+dxtxtColor+","+dxtxtPorcentajeColor+","+dxtxtCorte+","+dxtxtPorcentajeCorte+","+dxtxtDescuadrado+","+dxtxtPorcentajeDescuadrado+","
      +dxtxtDespegado+","+dxtxtPorcentajeDespegado+","+dxtxtDobleEtiqueta+","+dxtxtPorcentajeDobleEtiqueta+","+dxtxtFalloImpresion+","+dxtxtPorcentajeFalloImpresion+","+dxtxtGrietas+","
      +dxtxtPorcentajeGrietas+","+dxtxtImpresionSenasa+","+dxtxtPorcentajeImpresionSenasa+","+dxtxtMalaDistribucion+","+dxtxtPorcentajeMalaDistribucion+","+dxtxtMalaSujecion+","+dxtxtPorcentajeMalaSujecion+","
      +dxtxtManchasAzules+","+dxtxtPorcentajeManchasAzules+","+dxtxtNoUV+","+dxtxtPorcentajeNoUV+","+dxtxtNudo+","+dxtxtPorcentajeNudo+","+dxtxtOrificios+","+dxtxtPorcentajeOrificios+","+dxtxtPartidura+","
      +dxtxtPorcentajePartidura+","+dxtxtPuntoExpuesto+","+dxtxtPorcentajePuntoExpuesto+","+dxtxtPuntoRoto+","+dxtxtPorcentajePuntoRoto+","+dxtxtPuntoSuelto+","+dxtxtPorcentajePuntoSuelto+","
      +dxtxtRasgado+","+dxtxtPorcentajeRasgado+","+dxtxtRotoQuebrado+","+dxtxtPorcentajeRotoQuebrado+","+dxtxtSinPunto+","+dxtxtPorcentajeSinPunto+","+dxtxtTexturaGranulada+","+dxtxtPorcentajeTexturaGranulada+","
      +dxtxtVacio+","+dxtxtPorcentajeVacio+","+dxtxtVentilacion+","+dxtxtPorcentajeVentilacion+","+dxtxtVolteado+","+dxtxtPorcentajeVolteado+","+dxmuestreo_txt1+","+dxmuestreo_txt1_porcentaje+","
      +dxmuestreo_txt2+","+dxmuestreo_txt2_porcentaje+","+dxmuestreo_txt3+","+dxmuestreo_txt3_porcentaje+","+dxmuestreo_txt4+","+dxmuestreo_txt4_porcentaje+","+dxmuestreo_txt5+","
      +dxmuestreo_txt5_porcentaje+","+dxmuestreo_txt6+","+dxmuestreo_txt6_porcentaje+","+dxmuestreo_txt7+","+dxmuestreo_txt7_porcentaje+","+dxmuestreo_txt8+","+dxmuestreo_txt8_porcentaje+","
      +dxmuestreo_txt9+","+dxmuestreo_txt9_porcentaje+","+dxmuestreo_txt10_txt5+","+dxmuestreo_txt10_porcentaje+","+dxmuestreo_txt11+","+dxmuestreo_txt11_porcentaje+","+dxmuestreo_txt12+","
      +dxmuestreo_txt12_porcentaje+","+dxmuestreo_txt16+","+dxmuestreo_txt13+","+dxmuestreo_txt13_porcentaje+","+dxmuestreo_txt14+","+dxmuestreo_txt14_porcentaje+","+dxmuestreo_txt15+","
      +dxmuestreo_txt15_porcentaje+","+dxmuestreo_txt17+","+dxmuestreo_txt17_porcentaje+","+dxmuestreo_txt18+","+dxmuestreo_txt18_porcentaje+","+dxmuestreo_txt19+","+dxmuestreo_txt19_porcentaje+","
      +dxmuestreo_txt20+","+dxmuestreo_txt20_porcentaje+","+dxmuestreo_txt21+","+dxmuestreo_txt21_porcentaje+","+dxmuestreo_txt22+","+dxmuestreo_txt22_porcentaje+","+dxmuestreo_txt23+","+dxmuestreo_txt23_porcentaje+","
      +dxmuestreo_txt24+","+dxmuestreo_txt24_porcentaje+","+dxmuestreo_txt25+","+dxmuestreo_txt25_porcentaje+","+dxmuestreo_txt26+","+dxmuestreo_txt26_porcentaje+","+dxmuestreo_txt27+","+dxmuestreo_txt27_porcentaje+","
      +dxmuestreo_txt28+","+dxtxtTotalObservaciones+","+dxtxtPorcentajeTotalObservaciones;
    }
    else
    {
      var par1 = parametros[1].split("=");

    }
    console.log("par1",ls_parametros)

    $.ajax({ 
      url: 'datos_pt.php',
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
      url: 'datos_pt.php',
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
      $("#tpHoraFin").dxDateBox("instance").option("value",now);    
      // idxtpHora.focus()
      // $("#tpHora").dxDateBox("instance").option("value",ldt_Hora);
      var ii=1
      ii=ii+1

    }else if(ls_accion=="editar"){
      
      $.ajax({ 
        url: 'datos_pt.php',
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
                title: "Trazabilidad",
                template: function() {
                    return $("<div>").append(
                      //  $("<div>").dxTextBox({ value: "Control en Pestaña 2" })
                      div_tab_02.innerHTML
                    );
                }
            },
            {
              title: "Revisión Paletizado",
              template: function() {
                  return $("<div>").append(
                    //  $("<div>").dxTextBox({ value: "Control en Pestaña 3" })
                    div_tab_03.innerHTML
                  );
              }
            },          
            {
              title: "Revisión Muestreo",
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

   // COMBO SEDE
   $.ajax({ 
    url: 'datos_pt.php',
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

   // COMBO TURNO
   $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbTurno' },
    dataType: 'json',
    success(data) {
       
        console.log(data)

        idxcmbTurno=$('#cmbTurno').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Turno',
        valueExpr: 'IdTurno',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTurno:', textStatus, errorThrown);
    }, 
  }),

  // HORA INICIO
  $(document).ready(function() {
    $("#tpHoraInicio").dxDateBox({
      value: new Date(),
      type: "time",
      displayFormat: "HH:MM"
    });
  });

    // HORA FIN
    $(document).ready(function() {
      $("#tpHoraFin").dxDateBox({
        value: new Date(),
        type: "time",
        displayFormat: "HH:MM"
      });
    });

     // COMBO CAMPAÑA
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbCampaña' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbCampaña=$('#cmbCampaña').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Campaña',
        valueExpr: 'IdCampaña',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbCampaña:', textStatus, errorThrown);
    }, 
  }),
 
  // COMBO DEPENDIENTE TIPO PRODUCTO
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbTipoProducto' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbTipoProducto=$('#cmbTipoProducto').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'TipoProducto',
        valueExpr: 'IdTipoProducto',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTipoProducto:', textStatus, errorThrown);
    }, 
  }),

  // COMBO DEPENDIENTE DESTINO
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbDestino' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbDestino=$('#cmbDestino').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Destino',
        valueExpr: 'IdDestino',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbDestino:', textStatus, errorThrown);
    }, 
  }),

  // COMBO DEPENDIENTE CLIENTE
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbCliente' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbCliente=$('#cmbCliente').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Cliente',
        valueExpr: 'IdCliente',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbCliente:', textStatus, errorThrown);
    }, 
  }),

  // COMBO DEPENDIENTE MATERIA PRIMA
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbMateriaPrima' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbMateriaPrima=$('#cmbMateriaPrima').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'MateriaPrima',
        valueExpr: 'IdMateriaPrima',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbMateriaPrima:', textStatus, errorThrown);
    }, 
  }),

  // COMBO CODIGO PALLET
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbCodigoPallet' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbCodigoPallet=$('#cmbCodigoPallet').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'CodigoPallet',
        valueExpr: 'IdCodigoPallet',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbCodigoPallet:', textStatus, errorThrown);
    }, 
  }),

  // COMBO LOTE PRODUCCION
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbLoteProduccion' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbLoteProduccion=$('#cmbLoteProduccion').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'LoteProduccion',
        valueExpr: 'IdLoteProduccion',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbLoteProduccion:', textStatus, errorThrown);
    }, 
  }),

  // COMBO LINEA ENSAMBLAJE
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbLineaEnsamblaje' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbLineaEnsamblaje=$('#cmbLineaEnsamblaje').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'LineaEnsamblaje',
        valueExpr: 'IdLineaEnsamblaje',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbLineaEnsamblaje:', textStatus, errorThrown);
    }, 
  }),

  // COMBO CANTIDAD
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbCantidad' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbCantidad=$('#cmbCantidad').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Cantidad',
        valueExpr: 'IdCantidad',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbCantidad:', textStatus, errorThrown);
    }, 
  }),

  // COMBO CODIGO PRODUCTO
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbCodigoProducto' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbCodigoProducto=$('#cmbCodigoProducto').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'CodigoProducto',
        valueExpr: 'IdCodigoProducto',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbCodigoProducto:', textStatus, errorThrown);
    }, 
  }),

  // COMBO DESCRIPCION PRODUCTO
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbDescripcionProducto' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbDescripcionProducto=$('#cmbDescripcionProducto').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'DescripcionProducto',
        valueExpr: 'IdDescripcionProducto',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbDescripcionProducto:', textStatus, errorThrown);
    }, 
  }),

  // TEXTBOX TRAZABILIDAD OBSERVACION
  $('#txtTrazabilidadObservacion').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }),

   // COMBO PALETIZADO OBSERVACION
   $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbPaletizadoObservacion' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbDescripcionProducto=$('#cmbPaletizadoObservacion').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Observacion',
        valueExpr: 'IdObservacion',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbPaletizadoObservacion:', textStatus, errorThrown);
    }, 
  }),

  // TEXTBOX CONTAMINACION
  idxtxtContaminacion = $('#txtContaminacion').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtDocumentos").val(d);
    // }
  }).dxTextBox("instance");

   // TEXTBOX PALETIZADO PELIGROS
   idxtxtPaletizadoPeligros = $('#txtPaletizadoPeligros').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtDocumentos").val(d);
    // }
  }).dxTextBox("instance");
  idxtxtPaletizadoPeligros.option("disabled", true);

    // ocultar
    $("#txtPaletizadoPeligros").css("display", "none");

    // TEXTBOX PALETIZADO CONFORME
   idxtxtPaletizadoConforme = $('#txtPaletizadoConforme').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtDocumentos").val(d);
    // }
  }).dxTextBox("instance");

    // TEXTBOX SELLADO CONFORME
    idxtxtSelladoConforme = $('#txtSelladoConforme').dxTextBox({
      //value:'Jeimmy Parra',
      inputAttr: {'aria-label': 'Name'},
      // success: function(d){
      //   $("#txtDocumentos").val(d);
      // }
    }).dxTextBox("instance");


  // COMBO TIPO MATERIAL
  $.ajax({ 
    url: 'datos_pt.php',
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

          // console.log("item",$("#cmbProcedencia").dxSelectBox("instance").option("value"));
           
          //  var proc=$("#cmbProcedencia").dxSelectBox("instance").option("value")

          //  MOSTRAR/OCULTAR MEDICION Y DEFECTOS POR TIPO MATERIAL
           if (val.value==1){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_oxidacion").style.display = "none";  
            document.getElementById("grupo_norecubrimiento").style.display = "none"; 
            document.getElementById("grupo_color").style.display = "none";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "block";  
            document.getElementById("grupo_medula").style.display = "block";  
            document.getElementById("grupo_grietas").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "block";  
            document.getElementById("grupo_dañoinsectos").style.display = "block";  
            document.getElementById("grupo_astillado").style.display = "block";  
            document.getElementById("grupo_desnivelcorte").style.display = "block";  
            document.getElementById("grupo_superficieraspada").style.display = "block";  
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none";
            document.getElementById("grupocaracteristica").style.display = "none";                
          }
          else if(val.value==2){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_oxidacion").style.display = "none";  
            document.getElementById("grupo_norecubrimiento").style.display = "none"; 
            document.getElementById("grupo_color").style.display = "none";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "block";  
            document.getElementById("grupo_medula").style.display = "block";  
            document.getElementById("grupo_grietas").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "block";  
            document.getElementById("grupo_dañoinsectos").style.display = "block";  
            document.getElementById("grupo_astillado").style.display = "block";  
            document.getElementById("grupo_desnivelcorte").style.display = "block";  
            document.getElementById("grupo_superficieraspada").style.display = "block";  
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none"; 
            document.getElementById("grupocaracteristica").style.display = "none";  
          } 
          else if(val.value==3){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_oxidacion").style.display = "none";  
            document.getElementById("grupo_norecubrimiento").style.display = "none"; 
            document.getElementById("grupo_color").style.display = "none";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "block";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "block";  
            document.getElementById("grupo_dañoinsectos").style.display = "block";  
            document.getElementById("grupo_astillado").style.display = "block";  
            document.getElementById("grupo_desnivelcorte").style.display = "none";  
            document.getElementById("grupo_superficieraspada").style.display = "none";  
            document.getElementById("grupo_huecosyvacios").style.display = "block";  
            document.getElementById("grupo_superficierugosa").style.display = "block";  
            document.getElementById("grupo_desprendimientocapas").style.display = "block";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none";
            document.getElementById("grupocaracteristica").style.display = "none";   
          } 
          else if(val.value==4){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "none";  
            document.getElementById("grupo_oxidacion").style.display = "block";  
            document.getElementById("grupo_norecubrimiento").style.display = "block"; 
            document.getElementById("grupo_color").style.display = "none";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "none";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_dañoinsectos").style.display = "none";  
            document.getElementById("grupo_astillado").style.display = "none";  
            document.getElementById("grupo_desnivelcorte").style.display = "none";  
            document.getElementById("grupo_superficieraspada").style.display = "none";  
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none"; 
            document.getElementById("grupocaracteristica").style.display = "none"; 
          } 
          else if(val.value==5){
            document.getElementById("grupo_ancho").style.display = "none"; 
            document.getElementById("grupo_largo").style.display = "none";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "none";  
            document.getElementById("grupo_oxidacion").style.display = "block";  
            document.getElementById("grupo_norecubrimiento").style.display = "block"; 
            document.getElementById("grupo_color").style.display = "none";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "none";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_dañoinsectos").style.display = "none";  
            document.getElementById("grupo_astillado").style.display = "none";  
            document.getElementById("grupo_desnivelcorte").style.display = "none";  
            document.getElementById("grupo_superficieraspada").style.display = "none";  
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none"; 
            document.getElementById("grupocaracteristica").style.display = "none"; 
          } 
          else if(val.value==6){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "none";  
            document.getElementById("grupo_oxidacion").style.display = "block";  
            document.getElementById("grupo_norecubrimiento").style.display = "block"; 
            document.getElementById("grupo_color").style.display = "none";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "none";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_dañoinsectos").style.display = "none";  
            document.getElementById("grupo_astillado").style.display = "none";  
            document.getElementById("grupo_desnivelcorte").style.display = "none";  
            document.getElementById("grupo_superficieraspada").style.display = "none";   
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none"; 
            document.getElementById("grupocaracteristica").style.display = "none"; 
          } 
          else if(val.value==7){
            document.getElementById("grupo_ancho").style.display = "none"; 
            document.getElementById("grupo_largo").style.display = "none";  
            document.getElementById("grupo_espesor").style.display = "none";  
            document.getElementById("grupo_peso").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "none";  
            document.getElementById("grupo_oxidacion").style.display = "none";  
            document.getElementById("grupo_norecubrimiento").style.display = "none"; 
            document.getElementById("grupo_color").style.display = "block";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "none";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_dañoinsectos").style.display = "none";  
            document.getElementById("grupo_astillado").style.display = "none";  
            document.getElementById("grupo_desnivelcorte").style.display = "none";  
            document.getElementById("grupo_superficieraspada").style.display = "none";  
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none";
            document.getElementById("grupocaracteristica").style.display = "none";  
          } 
          else if(val.value==8){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "none";  
            document.getElementById("grupo_oxidacion").style.display = "none";  
            document.getElementById("grupo_norecubrimiento").style.display = "none"; 
            document.getElementById("grupo_color").style.display = "none";   
            document.getElementById("grupo_adhesivo").style.display = "none";  
            document.getElementById("grupo_nudos").style.display = "none";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_dañoinsectos").style.display = "none";  
            document.getElementById("grupo_astillado").style.display = "none";  
            document.getElementById("grupo_desnivelcorte").style.display = "block";  
            document.getElementById("grupo_superficieraspada").style.display = "none";   
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "block";  
            document.getElementById("grupo_perforacion").style.display = "block";  
            document.getElementById("grupo_malaimpresion").style.display = "block";  
            document.getElementById("grupo_nocolor").style.display = "block";  
            document.getElementById("grupo_nouv").style.display = "block";  
            document.getElementById("grupo_problemassecado").style.display = "block";  
            document.getElementById("grupo_marcarodillo").style.display = "block"; 
            document.getElementById("grupocaracteristica").style.display = "none"; 
          } 
          else if(val.value==9){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "none";  
            document.getElementById("grupo_humedad").style.display = "none";  
            document.getElementById("grupo_oxidacion").style.display = "none";  
            document.getElementById("grupo_norecubrimiento").style.display = "none"; 
            document.getElementById("grupo_color").style.display = "block";   
            document.getElementById("grupo_adhesivo").style.display = "block";  
            document.getElementById("grupo_nudos").style.display = "none";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_dañoinsectos").style.display = "none";  
            document.getElementById("grupo_astillado").style.display = "none";  
            document.getElementById("grupo_desnivelcorte").style.display = "none";  
            document.getElementById("grupo_superficieraspada").style.display = "none";   
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none"; 
            document.getElementById("grupocaracteristica").style.display = "none"; 
          } 
          else if(val.value==10){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "none";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_peso").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "none";  
            document.getElementById("grupo_oxidacion").style.display = "none";  
            document.getElementById("grupo_norecubrimiento").style.display = "none"; 
            document.getElementById("grupo_color").style.display = "block";   
            document.getElementById("grupo_adhesivo").style.display = "block";  
            document.getElementById("grupo_nudos").style.display = "none";  
            document.getElementById("grupo_medula").style.display = "none";  
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_dañoinsectos").style.display = "none";  
            document.getElementById("grupo_astillado").style.display = "none";  
            document.getElementById("grupo_desnivelcorte").style.display = "none";  
            document.getElementById("grupo_superficieraspada").style.display = "none";  
            document.getElementById("grupo_huecosyvacios").style.display = "none";  
            document.getElementById("grupo_superficierugosa").style.display = "none";  
            document.getElementById("grupo_desprendimientocapas").style.display = "none";  
            document.getElementById("grupo_rasgados").style.display = "none";  
            document.getElementById("grupo_perforacion").style.display = "none";  
            document.getElementById("grupo_malaimpresion").style.display = "none";  
            document.getElementById("grupo_nocolor").style.display = "none";  
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_problemassecado").style.display = "none";  
            document.getElementById("grupo_marcarodillo").style.display = "none"; 
            document.getElementById("grupocaracteristica").style.display = "block"; 
          }   
        },

      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTipoMaterial:', textStatus, errorThrown);
    }, 
  })

  // // COMBO DOCUMENTACION
  // $.ajax({ 
  //   url: 'datos_pt.php',
  //   type: 'GET',
  //   data: { action: 'cmbDocumentacion' },
  //   dataType: 'json',
  //   success(data) {
      
  //       console.log(data)

  //       idxcmbDocumentacion=$('#cmbDocumentacion').dxSelectBox({          
  //       dataSource: data,
  //       displayExpr: 'Documentacion',
  //       valueExpr: 'IdDocumentacion',
  //     }).dxSelectBox("instance");
  //   },
  //   error() {             
  //           console.error('Error cmbDocumentacion:', textStatus, errorThrown);
  //   }, 
  // })


    // TEXTBOX CANTIDAD MUESTRA
    idxtxtCantidadMuestra = $('#txtCantidadMuestra').dxNumberBox({
      min: 0,
      max: 100,
      showSpinButtons: false, 

      format: "#0", 
      inputAttr: {
          type: "number",
          inputmode: "numeric",
          pattern: "\\d*"
      }

  }).dxNumberBox("instance");

  function roundToDecimals(num, decimals) {
    let factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

    // // TEXTBOX OBSERVACION
    // idxtxtObservacion = $('#txtObservacion').dxTextBox({
    //   //value:'Jeimmy Parra',
    //   inputAttr: {'aria-label': 'Name'},
    //   // success: function(d){
    //   //   $("#txtObservacion").val(d);
    //   // }
    // }).dxTextBox("instance");

  // COMBO OBSERVACION MUESTRA
  $.ajax({ 
    url: 'datos_pt.php',
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
            idxtxtAncho.option("disabled", false);
            idxtxtLargo.option("disabled", false);
            idxtxtAlto.option("disabled", false);
            idxtxtEspesor.option("disabled", false);
            idxtxtHumedad.option("disabled", false);
            idxtxtOxidacion.option("disabled", false);
            idxtxtNoRecubrimiento.option("disabled", false);
            idxtxtColor.option("disabled", false);
            idxtxtAdhesivo.option("disabled", false);
            idxtxtNudos.option("disabled", false);
            idxtxtMedula.option("disabled", false);
            idxtxtGrietas.option("disabled", false);
            idxtxtArqueado.option("disabled", false);
            idxtxtDañoInsectos.option("disabled", false);
            idxtxtAstillado.option("disabled", false);
            idxtxtDesnivelCorte.option("disabled", false);
            idxtxtSuperficieRaspada.option("disabled", false);
            idxtxtHuecosYVacios.option("disabled", false);
            idxtxtSuperficieRugosa.option("disabled", false);
            idxtxtDesprendimientoCapas.option("disabled", false);
            idxtxtRasgados.option("disabled", false);
            idxtxtPerforacion.option("disabled", false);
            idxtxtMalaImpresion.option("disabled", false);
            idxtxtNoColor.option("disabled", false);
            idxtxtNoUV.option("disabled", false);
            idxtxtProblemasSecado.option("disabled", false);
            idxtxtMarcaRodillo.option("disabled", false);
          }
            else{
              idxtxtAncho.option("disabled", true);
              idxtxtLargo.option("disabled", true);
              idxtxtAlto.option("disabled", true);
              idxtxtEspesor.option("disabled", true);       
              idxtxtHumedad.option("disabled", true);
              idxtxtOxidacion.option("disabled", true);
              idxtxtNoRecubrimiento.option("disabled", true);  
              idxtxtColor.option("disabled", true);
              idxtxtAdhesivo.option("disabled", true);
              idxtxtNudos.option("disabled", true);
              idxtxtMedula.option("disabled", true);
              idxtxtGrietas.option("disabled", true);
              idxtxtArqueado.option("disabled", true);
              idxtxtDañoInsectos.option("disabled", true);
              idxtxtAstillado.option("disabled", true);
              idxtxtDesnivelCorte.option("disabled", true);
              idxtxtSuperficieRaspada.option("disabled", true);
              idxtxtHuecosYVacios.option("disabled", true);
              idxtxtSuperficieRugosa.option("disabled", true);
              idxtxtDesprendimientoCapas.option("disabled", true);
              idxtxtRasgados.option("disabled", true);
              idxtxtPerforacion.option("disabled", true);
              idxtxtMalaImpresion.option("disabled", true);
              idxtxtNoColor.option("disabled", true);
              idxtxtNoUV.option("disabled", true);
              idxtxtProblemasSecado.option("disabled", true);
              idxtxtMarcaRodillo.option("disabled", true);         
          }       
        }
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbObservacionMuestra:', textStatus, errorThrown);
    }, 
  })

  // TEXTBOX ANCHO CON PORCENTAJE ANCHO
  idxtxtAncho= $('#txtAncho').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleAncho=$('#txtDetalleAncho').dxTextBox({
      // })
      // idxtxtUnidadesAncho=$('#txtUnidadesAncho').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeAncho=$('#txtPorcentajeAncho').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(val.value + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((val.value + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtAncho.option("disabled", true);

  // TEXTBOX DETALLE ANCHO
  idxtxtDetalleAncho= $('#txtDetalleAncho').dxTextBox({
  //value: 15,
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX UNIDADES ANCHO
  idxtxtUnidadesAncho= $('#txtUnidadesAncho').dxTextBox({
  value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX PORCENTAJE ANCHO
  idxtxtPorcentajeAncho= $('#txtPorcentajeAncho').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX Largo CON PORCENTAJE Largo
  idxtxtLargo= $('#txtLargo').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleLargo=$('#txtDetalleLargo').dxTextBox({
      // })
      // idxtxtUnidadesLargo=$('#txtUnidadesLargo').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeLargo=$('#txtPorcentajeLargo').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + val.value + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + val.value + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtLargo.option("disabled", true);

  // TEXTBOX DETALLE Largo
  idxtxtDetalleLargo= $('#txtDetalleLargo').dxTextBox({
  //value: 15,
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX UNIDADES Largo
  idxtxtUnidadesLargo= $('#txtUnidadesLargo').dxTextBox({
  value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX PORCENTAJE Largo
  idxtxtPorcentajeLargo= $('#txtPorcentajeLargo').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX Alto CON PORCENTAJE Alto
  idxtxtAlto= $('#txtAlto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleAlto=$('#txtDetalleAlto').dxTextBox({
      // })
      // idxtxtUnidadesAlto=$('#txtUnidadesAlto').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeAlto=$('#txtPorcentajeAlto').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + val.value 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + val.value 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtAlto.option("disabled", true);

  // TEXTBOX DETALLE Alto
  idxtxtDetalleAlto= $('#txtDetalleAlto').dxTextBox({
  //value: 15,
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX UNIDADES Alto
  idxtxtUnidadesAlto= $('#txtUnidadesAlto').dxTextBox({
  value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX PORCENTAJE Alto
  idxtxtPorcentajeAlto= $('#txtPorcentajeAlto').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX Espesor CON PORCENTAJE Espesor
  idxtxtEspesor= $('#txtEspesor').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleEspesor=$('#txtDetalleEspesor').dxTextBox({
      // })
      // idxtxtUnidadesEspesor=$('#txtUnidadesEspesor').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeEspesor=$('#txtPorcentajeEspesor').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + val.value + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + val.value + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtEspesor.option("disabled", true);

  // TEXTBOX DETALLE Espesor
  idxtxtDetalleEspesor= $('#txtDetalleEspesor').dxTextBox({
  //value: 15,
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX UNIDADES Espesor
  idxtxtUnidadesEspesor= $('#txtUnidadesEspesor').dxTextBox({
  value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX PORCENTAJE Espesor
  idxtxtPorcentajeEspesor= $('#txtPorcentajeEspesor').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX Humedad CON PORCENTAJE Humedad
  idxtxtHumedad= $('#txtHumedad').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleHumedad=$('#txtDetalleHumedad').dxTextBox({
      // })
      // idxtxtUnidadesHumedad=$('#txtUnidadesHumedad').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeHumedad=$('#txtPorcentajeHumedad').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + val.value + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + val.value + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtHumedad.option("disabled", true);

  // TEXTBOX DETALLE Humedad
  idxtxtDetalleHumedad= $('#txtDetalleHumedad').dxTextBox({
  //value: 15,
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX UNIDADES Humedad
  idxtxtUnidadesHumedad= $('#txtUnidadesHumedad').dxTextBox({
  value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX PORCENTAJE Humedad
  idxtxtPorcentajeHumedad= $('#txtPorcentajeHumedad').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Arqueado CON PORCENTAJE Arqueado
   idxtxtArqueado= $('#txtArqueado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleArqueado=$('#txtDetalleArqueado').dxTextBox({
      // })
      // idxtxtUnidadesArqueado=$('#txtUnidadesArqueado').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeArqueado=$('#txtPorcentajeArqueado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + val.value
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + val.value
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtArqueado.option("disabled", true);

  // TEXTBOX PORCENTAJE Arqueado
  idxtxtPorcentajeArqueado= $('#txtPorcentajeArqueado').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

  // TEXTBOX Color CON PORCENTAJE Color
  idxtxtColor= $('#txtColor').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleColor=$('#txtDetalleColor').dxTextBox({
      // })
      // idxtxtUnidadesColor=$('#txtUnidadesColor').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeColor=$('#txtPorcentajeColor').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + val.value + idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + val.value + idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtColor.option("disabled", true);

  // TEXTBOX PORCENTAJE Color
  idxtxtPorcentajeColor= $('#txtPorcentajeColor').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Corte CON PORCENTAJE Corte
   idxtxtCorte= $('#txtCorte').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleCorte=$('#txtDetalleCorte').dxTextBox({
      // })
      // idxtxtUnidadesCorte=$('#txtUnidadesCorte').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeCorte=$('#txtPorcentajeCorte').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ val.value+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ val.value+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtCorte.option("disabled", true);

  // TEXTBOX PORCENTAJE Corte
  idxtxtPorcentajeCorte= $('#txtPorcentajeCorte').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Descuadrado CON PORCENTAJE Descuadrado
   idxtxtDescuadrado= $('#txtDescuadrado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleDescuadrado=$('#txtDetalleDescuadrado').dxTextBox({
      // })
      // idxtxtUnidadesDescuadrado=$('#txtUnidadesDescuadrado').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeDescuadrado=$('#txtPorcentajeDescuadrado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value") 
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ val.value
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ val.value
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtDescuadrado.option("disabled", true);

  // TEXTBOX PORCENTAJE Descuadrado
  idxtxtPorcentajeDescuadrado= $('#txtPorcentajeDescuadrado').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Despegado CON PORCENTAJE Despegado
   idxtxtDespegado= $('#txtDespegado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleDespegado=$('#txtDetalleDespegado').dxTextBox({
      // })
      // idxtxtUnidadesDespegado=$('#txtUnidadesDespegado').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeDespegado=$('#txtPorcentajeDespegado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + val.value+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + val.value+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtDespegado.option("disabled", true);

  // TEXTBOX PORCENTAJE Despegado
  idxtxtPorcentajeDespegado= $('#txtPorcentajeDespegado').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX DobleEtiqueta CON PORCENTAJE DobleEtiqueta
   idxtxtDobleEtiqueta= $('#txtDobleEtiqueta').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleDobleEtiqueta=$('#txtDetalleDobleEtiqueta').dxTextBox({
      // })
      // idxtxtUnidadesDobleEtiqueta=$('#txtUnidadesDobleEtiqueta').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeDobleEtiqueta=$('#txtPorcentajeDobleEtiqueta').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ val.value+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ val.value+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtDobleEtiqueta.option("disabled", true);

  // TEXTBOX PORCENTAJE DobleEtiqueta
  idxtxtPorcentajeDobleEtiqueta= $('#txtPorcentajeDobleEtiqueta').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX FalloImpresion CON PORCENTAJE FalloImpresion
   idxtxtFalloImpresion= $('#txtFalloImpresion').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleFalloImpresion=$('#txtDetalleFalloImpresion').dxTextBox({
      // })
      // idxtxtUnidadesFalloImpresion=$('#txtUnidadesFalloImpresion').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeFalloImpresion=$('#txtPorcentajeFalloImpresion').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ val.value
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ val.value
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtFalloImpresion.option("disabled", true);

  // TEXTBOX PORCENTAJE FalloImpresion
  idxtxtPorcentajeFalloImpresion= $('#txtPorcentajeFalloImpresion').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Grietas CON PORCENTAJE Grietas
   idxtxtGrietas= $('#txtGrietas').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleGrietas=$('#txtDetalleGrietas').dxTextBox({
      // })
      // idxtxtUnidadesGrietas=$('#txtUnidadesGrietas').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeGrietas=$('#txtPorcentajeGrietas').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + val.value+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + val.value+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtGrietas.option("disabled", true);

  // TEXTBOX PORCENTAJE Grietas
  idxtxtPorcentajeGrietas= $('#txtPorcentajeGrietas').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX ImpresionSenasa CON PORCENTAJE ImpresionSenasa
   idxtxtImpresionSenasa= $('#txtImpresionSenasa').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleImpresionSenasa=$('#txtDetalleImpresionSenasa').dxTextBox({
      // })
      // idxtxtUnidadesImpresionSenasa=$('#txtUnidadesImpresionSenasa').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeImpresionSenasa=$('#txtPorcentajeImpresionSenasa').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ val.value+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ val.value+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtImpresionSenasa.option("disabled", true);

  // TEXTBOX PORCENTAJE ImpresionSenasa
  idxtxtPorcentajeImpresionSenasa= $('#txtPorcentajeImpresionSenasa').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX MalaDistribucion CON PORCENTAJE MalaDistribucion
   idxtxtMalaDistribucion= $('#txtMalaDistribucion').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleMalaDistribucion=$('#txtDetalleMalaDistribucion').dxTextBox({
      // })
      // idxtxtUnidadesMalaDistribucion=$('#txtUnidadesMalaDistribucion').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeMalaDistribucion=$('#txtPorcentajeMalaDistribucion').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ val.value
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ val.value
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtMalaDistribucion.option("disabled", true);

  // TEXTBOX PORCENTAJE MalaDistribucion
  idxtxtPorcentajeMalaDistribucion= $('#txtPorcentajeMalaDistribucion').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX MalaSujecion CON PORCENTAJE MalaSujecion
   idxtxtMalaSujecion= $('#txtMalaSujecion').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleMalaSujecion=$('#txtDetalleMalaSujecion').dxTextBox({
      // })
      // idxtxtUnidadesMalaSujecion=$('#txtUnidadesMalaSujecion').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeMalaSujecion=$('#txtPorcentajeMalaSujecion').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + val.value+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + val.value+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtMalaSujecion.option("disabled", true);

  // TEXTBOX PORCENTAJE MalaSujecion
  idxtxtPorcentajeMalaSujecion= $('#txtPorcentajeMalaSujecion').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX ManchasAzules CON PORCENTAJE ManchasAzules
   idxtxtManchasAzules= $('#txtManchasAzules').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleManchasAzules=$('#txtDetalleManchasAzules').dxTextBox({
      // })
      // idxtxtUnidadesManchasAzules=$('#txtUnidadesManchasAzules').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeManchasAzules=$('#txtPorcentajeManchasAzules').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ val.value+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ val.value+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtManchasAzules.option("disabled", true);

  // TEXTBOX PORCENTAJE ManchasAzules
  idxtxtPorcentajeManchasAzules= $('#txtPorcentajeManchasAzules').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX NoUV CON PORCENTAJE NoUV
   idxtxtNoUV= $('#txtNoUV').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleNoUV=$('#txtDetalleNoUV').dxTextBox({
      // })
      // idxtxtUnidadesNoUV=$('#txtUnidadesNoUV').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeNoUV=$('#txtPorcentajeNoUV').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ val.value
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ val.value
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtNoUV.option("disabled", true);

  // TEXTBOX PORCENTAJE NoUV
  idxtxtPorcentajeNoUV= $('#txtPorcentajeNoUV').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Nudo CON PORCENTAJE Nudo
   idxtxtNudo= $('#txtNudo').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleNudo=$('#txtDetalleNudo').dxTextBox({
      // })
      // idxtxtUnidadesNudo=$('#txtUnidadesNudo').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeNudo=$('#txtPorcentajeNudo').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + val.value+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + val.value+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtNudo.option("disabled", true);

  // TEXTBOX PORCENTAJE Nudo
  idxtxtPorcentajeNudo= $('#txtPorcentajeNudo').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Orificios CON PORCENTAJE Orificios
   idxtxtOrificios= $('#txtOrificios').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleOrificios=$('#txtDetalleOrificios').dxTextBox({
      // })
      // idxtxtUnidadesOrificios=$('#txtUnidadesOrificios').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeOrificios=$('#txtPorcentajeOrificios').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ val.value+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ val.value+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtOrificios.option("disabled", true);

  // TEXTBOX PORCENTAJE Orificios
  idxtxtPorcentajeOrificios= $('#txtPorcentajeOrificios').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Partidura CON PORCENTAJE Partidura
   idxtxtPartidura= $('#txtPartidura').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetallePartidura=$('#txtDetallePartidura').dxTextBox({
      // })
      // idxtxtUnidadesPartidura=$('#txtUnidadesPartidura').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajePartidura=$('#txtPorcentajePartidura').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ val.value
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ val.value
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtPartidura.option("disabled", true);

  // TEXTBOX PORCENTAJE Partidura
  idxtxtPorcentajePartidura= $('#txtPorcentajePartidura').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX PuntoExpuesto CON PORCENTAJE PuntoExpuesto
   idxtxtPuntoExpuesto= $('#txtPuntoExpuesto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetallePuntoExpuesto=$('#txtDetallePuntoExpuesto').dxTextBox({
      // })
      // idxtxtUnidadesPuntoExpuesto=$('#txtUnidadesPuntoExpuesto').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajePuntoExpuesto=$('#txtPorcentajePuntoExpuesto').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + val.value+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + val.value+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtPuntoExpuesto.option("disabled", true);

  // TEXTBOX PORCENTAJE PuntoExpuesto
  idxtxtPorcentajePuntoExpuesto= $('#txtPorcentajePuntoExpuesto').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX PuntoRoto CON PORCENTAJE PuntoRoto
   idxtxtPuntoRoto= $('#txtPuntoRoto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetallePuntoRoto=$('#txtDetallePuntoRoto').dxTextBox({
      // })
      // idxtxtUnidadesPuntoRoto=$('#txtUnidadesPuntoRoto').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajePuntoRoto=$('#txtPorcentajePuntoRoto').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ val.value+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ val.value+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtPuntoRoto.option("disabled", true);

  // TEXTBOX PORCENTAJE PuntoRoto
  idxtxtPorcentajePuntoRoto= $('#txtPorcentajePuntoRoto').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX PuntoSuelto CON PORCENTAJE PuntoSuelto
   idxtxtPuntoSuelto= $('#txtPuntoSuelto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetallePuntoSuelto=$('#txtDetallePuntoSuelto').dxTextBox({
      // })
      // idxtxtUnidadesPuntoSuelto=$('#txtUnidadesPuntoSuelto').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajePuntoSuelto=$('#txtPorcentajePuntoSuelto').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ val.value
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ val.value
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtPuntoSuelto.option("disabled", true);

  // TEXTBOX PORCENTAJE PuntoSuelto
  idxtxtPorcentajePuntoSuelto= $('#txtPorcentajePuntoSuelto').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Rasgado CON PORCENTAJE Rasgado
   idxtxtRasgado= $('#txtRasgado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleRasgado=$('#txtDetalleRasgado').dxTextBox({
      // })
      // idxtxtUnidadesRasgado=$('#txtUnidadesRasgado').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeRasgado=$('#txtPorcentajeRasgado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + val.value+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + val.value+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtRasgado.option("disabled", true);

  // TEXTBOX PORCENTAJE Rasgado
  idxtxtPorcentajeRasgado= $('#txtPorcentajeRasgado').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX RotoQuebrado CON PORCENTAJE RotoQuebrado
   idxtxtRotoQuebrado= $('#txtRotoQuebrado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleRotoQuebrado=$('#txtDetalleRotoQuebrado').dxTextBox({
      // })
      // idxtxtUnidadesRotoQuebrado=$('#txtUnidadesRotoQuebrado').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeRotoQuebrado=$('#txtPorcentajeRotoQuebrado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ val.value+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ val.value+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtRotoQuebrado.option("disabled", true);

  // TEXTBOX PORCENTAJE RotoQuebrado
  idxtxtPorcentajeRotoQuebrado= $('#txtPorcentajeRotoQuebrado').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX SinPunto CON PORCENTAJE SinPunto
   idxtxtSinPunto= $('#txtSinPunto').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleSinPunto=$('#txtDetalleSinPunto').dxTextBox({
      // })
      // idxtxtUnidadesSinPunto=$('#txtUnidadesSinPunto').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeSinPunto=$('#txtPorcentajeSinPunto').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ val.value
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ val.value
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtSinPunto.option("disabled", true);

  // TEXTBOX PORCENTAJE SinPunto
  idxtxtPorcentajeSinPunto= $('#txtPorcentajeSinPunto').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX TexturaGranulada CON PORCENTAJE TexturaGranulada
   idxtxtTexturaGranulada= $('#txtTexturaGranulada').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleTexturaGranulada=$('#txtDetalleTexturaGranulada').dxTextBox({
      // })
      // idxtxtUnidadesTexturaGranulada=$('#txtUnidadesTexturaGranulada').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeTexturaGranulada=$('#txtPorcentajeTexturaGranulada').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + val.value+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + val.value+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtTexturaGranulada.option("disabled", true);

  // TEXTBOX PORCENTAJE TexturaGranulada
  idxtxtPorcentajeTexturaGranulada= $('#txtPorcentajeTexturaGranulada').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Vacio CON PORCENTAJE Vacio
   idxtxtVacio= $('#txtVacio').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleVacio=$('#txtDetalleVacio').dxTextBox({
      // })
      // idxtxtUnidadesVacio=$('#txtUnidadesVacio').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeVacio=$('#txtPorcentajeVacio').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ val.value+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ val.value+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtVacio.option("disabled", true);

  // TEXTBOX PORCENTAJE Vacio
  idxtxtPorcentajeVacio= $('#txtPorcentajeVacio').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Ventilacion CON PORCENTAJE Ventilacion
   idxtxtVentilacion= $('#txtVentilacion').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleVentilacion=$('#txtDetalleVentilacion').dxTextBox({
      // })
      // idxtxtUnidadesVentilacion=$('#txtUnidadesVentilacion').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeVentilacion=$('#txtPorcentajeVentilacion').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ val.value
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ val.value
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtVentilacion.option("disabled", true);

  // TEXTBOX PORCENTAJE Ventilacion
  idxtxtPorcentajeVentilacion= $('#txtPorcentajeVentilacion').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })

   // TEXTBOX Volteado CON PORCENTAJE Volteado
   idxtxtVolteado= $('#txtVolteado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetalleVolteado=$('#txtDetalleVolteado').dxTextBox({
      // })
      // idxtxtUnidadesVolteado=$('#txtUnidadesVolteado').dxTextBox({
      //   value: 'mm',      
      // })
      idxtxtPorcentajeVolteado=$('#txtPorcentajeVolteado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + val.value+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + val.value+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");
  idxtxtVolteado.option("disabled", true);

  // TEXTBOX PORCENTAJE Volteado
  idxtxtPorcentajeVolteado= $('#txtPorcentajeVolteado').dxTextBox({
  // value: 'mm',
  min: 0,
  max: 100,
  inputAttr: { 'aria-label': 'Min y Max' },
  })
  

  

   // TEXTBOX muestreo_txt1
   idxmuestreo_txt1= $('#muestreo_txt1').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt1_porcentaje=$('#muestreo_txt1_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ val.value+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ val.value+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt1_porcentaje
   idxmuestreo_txt1_porcentaje= $('#muestreo_txt1_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX muestreo_txt2
   idxmuestreo_txt2= $('#muestreo_txt2').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt2_porcentaje=$('#muestreo_txt2_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ val.value
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ val.value
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt2_porcentaje
   idxmuestreo_txt2_porcentaje= $('#muestreo_txt2_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX muestreo_txt3
   idxmuestreo_txt3= $('#muestreo_txt3').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt3_porcentaje=$('#muestreo_txt3_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + val.value+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + val.value+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt3_porcentaje
   idxmuestreo_txt3_porcentaje= $('#muestreo_txt3_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt4
   idxmuestreo_txt4= $('#muestreo_txt4').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt4_porcentaje=$('#muestreo_txt4_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ val.value+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ val.value+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt4_porcentaje
   idxmuestreo_txt4_porcentaje= $('#muestreo_txt4_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt5
   idxmuestreo_txt5= $('#muestreo_txt5').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt5_porcentaje=$('#muestreo_txt5_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ val.value
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ val.value
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt5_porcentaje
   idxmuestreo_txt5_porcentaje= $('#muestreo_txt5_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt6
   idxmuestreo_txt6= $('#muestreo_txt6').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt6_porcentaje=$('#muestreo_txt6_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + val.value+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + val.value+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt6_porcentaje
   idxmuestreo_txt6_porcentaje= $('#muestreo_txt6_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt7
   idxmuestreo_txt7= $('#muestreo_txt7').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt7_porcentaje=$('#muestreo_txt7_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ val.value+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ val.value+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt7_porcentaje
   idxmuestreo_txt7_porcentaje= $('#muestreo_txt7_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt8
   idxmuestreo_txt8= $('#muestreo_txt8').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt8_porcentaje=$('#muestreo_txt8_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ val.value
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ val.value
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt8_porcentaje
   idxmuestreo_txt8_porcentaje= $('#muestreo_txt8_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt9
   idxmuestreo_txt9= $('#muestreo_txt9').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt9_porcentaje=$('#muestreo_txt9_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + val.value+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + val.value+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt9_porcentaje
   idxmuestreo_txt9_porcentaje= $('#muestreo_txt9_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt10
   idxmuestreo_txt10= $('#muestreo_txt10').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt10_porcentaje=$('#muestreo_txt10_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ val.value+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ val.value+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt10_porcentaje
   idxmuestreo_txt10_porcentaje= $('#muestreo_txt10_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt11
   idxmuestreo_txt11= $('#muestreo_txt11').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt11_porcentaje=$('#muestreo_txt11_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ val.value
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ val.value
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt11_porcentaje
   idxmuestreo_txt11_porcentaje= $('#muestreo_txt11_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt12
   idxmuestreo_txt12= $('#muestreo_txt12').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt12_porcentaje=$('#muestreo_txt12_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + val.value+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + val.value+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt12_porcentaje
   idxmuestreo_txt12_porcentaje= $('#muestreo_txt12_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt13
   idxmuestreo_txt13= $('#muestreo_txt13').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt13_porcentaje=$('#muestreo_txt13_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ val.value+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ val.value+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt13_porcentaje
   idxmuestreo_txt13_porcentaje= $('#muestreo_txt13_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt14
   idxmuestreo_txt14= $('#muestreo_txt14').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt14_porcentaje=$('#muestreo_txt14_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ val.value
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ val.value
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt14_porcentaje
   idxmuestreo_txt14_porcentaje= $('#muestreo_txt14_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt15
   idxmuestreo_txt15= $('#muestreo_txt15').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt15_porcentaje=$('#muestreo_txt15_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + val.value+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + val.value+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt15_porcentaje
   idxmuestreo_txt15_porcentaje= $('#muestreo_txt15_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt16
   idxmuestreo_txt16= $('#muestreo_txt16').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt16_porcentaje=$('#muestreo_txt16_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ val.value+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ val.value+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt16_porcentaje
   idxmuestreo_txt16_porcentaje= $('#muestreo_txt16_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt17
   idxmuestreo_txt17= $('#muestreo_txt17').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt17_porcentaje=$('#muestreo_txt17_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ val.value
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ val.value
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt17_porcentaje
   idxmuestreo_txt17_porcentaje= $('#muestreo_txt17_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt18
   idxmuestreo_txt18= $('#muestreo_txt18').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt18_porcentaje=$('#muestreo_txt18_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + val.value+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + val.value+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt18_porcentaje
   idxmuestreo_txt18_porcentaje= $('#muestreo_txt18_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt19
   idxmuestreo_txt19= $('#muestreo_txt19').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt19_porcentaje=$('#muestreo_txt19_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ val.value+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ val.value+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt19_porcentaje
   idxmuestreo_txt19_porcentaje= $('#muestreo_txt19_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt20
   idxmuestreo_txt20= $('#muestreo_txt20').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt20_porcentaje=$('#muestreo_txt20_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ val.value
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ val.value
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt20_porcentaje
   idxmuestreo_txt20_porcentaje= $('#muestreo_txt20_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt21
   idxmuestreo_txt21= $('#muestreo_txt21').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt21_porcentaje=$('#muestreo_txt21_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + val.value+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + val.value+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt21_porcentaje
   idxmuestreo_txt21_porcentaje= $('#muestreo_txt21_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt22
   idxmuestreo_txt22= $('#muestreo_txt22').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt22_porcentaje=$('#muestreo_txt22_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ val.value+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ val.value+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt22_porcentaje
   idxmuestreo_txt22_porcentaje= $('#muestreo_txt22_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX muestreo_txt23
    idxmuestreo_txt23= $('#muestreo_txt23').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt23_porcentaje=$('#muestreo_txt23_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ val.value
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ val.value
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt23_porcentaje
   idxmuestreo_txt23_porcentaje= $('#muestreo_txt23_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt24
   idxmuestreo_txt24= $('#muestreo_txt24').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt24_porcentaje=$('#muestreo_txt24_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + val.value+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + val.value+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt24_porcentaje
   idxmuestreo_txt24_porcentaje= $('#muestreo_txt24_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt25
   idxmuestreo_txt25= $('#muestreo_txt25').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt25_porcentaje=$('#muestreo_txt25_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ val.value+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ val.value+ idxmuestreo_txt26.option("value")
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt25_porcentaje
   idxmuestreo_txt25_porcentaje= $('#muestreo_txt25_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt26
   idxmuestreo_txt26= $('#muestreo_txt26').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt26_porcentaje=$('#muestreo_txt26_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ val.value
        + idxmuestreo_txt27.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ val.value
        + idxmuestreo_txt27.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt26_porcentaje
   idxmuestreo_txt26_porcentaje= $('#muestreo_txt26_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt27
   idxmuestreo_txt27= $('#muestreo_txt27').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxmuestreo_txt27_porcentaje=$('#muestreo_txt27_porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") 
        + idxtxtEspesor.option("value") + idxtxtHumedad.option("value") + idxtxtArqueado.option("value")
        + idxtxtColor.option("value")+ idxtxtCorte.option("value")+ idxtxtDescuadrado.option("value")
        + idxtxtDespegado.option("value")+ dxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNoUV.option("value")
        + idxtxtNudo.option("value")+ idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")
        + idxtxtPuntoExpuesto.option("value")+ idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")
        + idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")+ idxtxtSinPunto.option("value")
        + idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")+ idxtxtVentilacion.option("value")
        + idxtxtVolteado.option("value")+ idxmuestreo_txt1.option("value")+ idxmuestreo_txt2.option("value")
        + idxmuestreo_txt3.option("value")+ idxmuestreo_txt4.option("value")+ idxmuestreo_txt5.option("value")
        + idxmuestreo_txt6.option("value")+ idxmuestreo_txt7.option("value")+ idxmuestreo_txt8.option("value")
        + idxmuestreo_txt9.option("value")+ idxmuestreo_txt10.option("value")+ idxmuestreo_txt11.option("value")
        + idxmuestreo_txt12.option("value")+ idxmuestreo_txt13.option("value")+ idxmuestreo_txt14.option("value")
        + idxmuestreo_txt15.option("value")+ idxmuestreo_txt16.option("value")+ idxmuestreo_txt17.option("value")
        + idxmuestreo_txt18.option("value")+ idxmuestreo_txt19.option("value")+ idxmuestreo_txt20.option("value")
        + idxmuestreo_txt21.option("value")+ idxmuestreo_txt22.option("value")+ idxmuestreo_txt23.option("value")
        + idxmuestreo_txt24.option("value")+ idxmuestreo_txt25.option("value")+ idxmuestreo_txt26.option("value")
        + val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt27_porcentaje
   idxmuestreo_txt27_porcentaje= $('#muestreo_txt27_porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX muestreo_txt28
    idxmuestreo_txt28= $('#muestreo_txt28').dxTextBox({
      //value:'Jeimmy Parra',
      inputAttr: {'aria-label': 'Name'},
      // success: function(d){
      //   $("#txtGuiaRemision").val(d);
      // }
    }),

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

    // AGREGAR CHECKBOX A TEXTBOX 
    jQuery($ => {
      // Add checkbox value to text field
      let $checks = $("ul li :checkbox").on("change", function() {
        let string = $checks.filter(":checked").map((i, el) => el.value).get().join(",");
        // $("#results").val(string && "" + string);
        idxtxtPaletizadoPeligros.option("value",string && "" + string)
      });
    
      // Select all checkboxes in the group
      $('.all').click(e => {
        // $(e.target).closest('.group').find('li input').not(e.target).prop('checked', e.target.checked).trigger('change');
        $(e.target).closest('.nested2').find('li input').not(e.target).prop('checked', e.target.checked).trigger('change');
      });
    });



});
