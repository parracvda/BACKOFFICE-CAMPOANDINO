var is_cmbProveedor_pordefecto=null
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
      window.location.href = 'registros_pt.php';
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
  var dxcmbTurno = $("#cmbTurno").dxSelectBox("instance").option("value");
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
    if ( dxcmbTurno == null ){
      alert("Debe ingresar Turno")
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
    var dxcmbTurno = $("#cmbTurno").dxSelectBox("instance").option("value");
    var dxtpHoraInicio = $("#tpHoraInicio").dxDateBox("instance").option("value");
    var dxtpHoraFin = $("#tpHoraFin").dxDateBox("instance").option("value");
    var dxcmbCampana = $("#cmbCampana").dxSelectBox("instance").option("value");
    var dxcmbTipoProducto = $("#cmbTipoProducto").dxSelectBox("instance").option("value");
    var dxcmbDestino = $("#cmbDestino").dxSelectBox("instance").option("value");
    var dxcmbCliente = $("#cmbCliente").dxSelectBox("instance").option("value");
    var dxcmbMateriaPrima = $("#cmbMateriaPrima").dxSelectBox("instance").option("value");
    var dxtxtCodigoPallet = $("#txtCodigoPallet").dxTextBox("instance").option("value");
    var dxtxtLoteProduccion = $("#txtLoteProduccion").dxTextBox("instance").option("value");
    var dxtxtLineaEnsamblaje = $("#txtLineaEnsamblaje").dxTextBox("instance").option("value");
    var dxtxtCantidad= $("#txtCantidad").dxTextBox("instance").option("value");
    var dxcmbCodigoProducto= $("#cmbCodigoProducto").dxTextBox("instance").option("value");
    var dxcmbDescripcionProducto= $("#cmbDescripcionProducto").dxTextBox("instance").option("value");
    var dxtxtObservacionTrazabilidad= $("#txtObservacionTrazabilidad").dxTextBox("instance").option("value");
    var dxcmbObservacionPaletizado= $("#cmbObservacionPaletizado").dxSelectBox("instance").option("value");
    var dxContaminacion= $("#Contaminacion").dxTextBox("instance").option("value");
    var dxtxtPeligrosPaletizado= $("#txtPeligrosPaletizado").dxTextBox("instance").option("value");
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
    var dxtxtDetalleAlto= $("#txtDetalleAlto").dxTextBox("instance").option("value");
    var dxtxtUnidadesAlto= $("#txtUnidadesAlto").dxTextBox("instance").option("value");
    var dxtxtPorcentajeAlto= $("#txtPorcentajeAlto").dxTextBox("instance").option("value");
    var dxtxtEspesor= $("#txtEspesor").dxNumberBox("instance").option("value");
    var dxtxtDetalleEspesor= $("#txtDetalleEspesor").dxTextBox("instance").option("value");
    var dxtxtUnidadesEspesor= $("#txtUnidadesEspesor").dxTextBox("instance").option("value");
    var dxtxtPorcentajeEspesor= $("#txtPorcentajeEspesor").dxTextBox("instance").option("value");
    var dxtxtHumedad= $("#txtHumedad").dxNumberBox("instance").option("value");
    var dxtxtDetalleHumedad= $("#txtDetalleHumedad").dxTextBox("instance").option("value");
    var dxtxtArqueado= $("#txtArqueado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeArqueado= $("#txtPorcentajeArqueado").dxTextBox("instance").option("value");
    var dxtxtColor= $("#txtColor").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeColor= $("#txtPorcentajeColor").dxTextBox("instance").option("value");
    var dxtxtCorte= $("#txtCorte").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeCorte= $("#txtPorcentajeCorte").dxTextBox("instance").option("value");
    var dxtxtCuadratura= $("#txtCuadratura").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeCuadratura= $("#txtPorcentajeCuadratura").dxTextBox("instance").option("value");
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
    var dxCintaEmbalaje= $("#CintaEmbalaje").dxNumberBox("instance").option("value");
    var dxPorcentajeCintaEmbalaje= $("#PorcentajeCintaEmbalaje").dxTextBox("instance").option("value");
    var dxMetalAcero= $("#MetalAcero").dxNumberBox("instance").option("value");
    var dxPorcentajeMetalAcero= $("#PorcentajeMetalAcero").dxTextBox("instance").option("value");
    var dxPlastico= $("#Plastico").dxNumberBox("instance").option("value");
    var dxPorcentajePlastico= $("#PorcentajePlastico").dxTextBox("instance").option("value");
    var dxInsectos= $("#Insectos").dxNumberBox("instance").option("value");
    var dxPorcentajeInsectos= $("#PorcentajeInsectos").dxTextBox("instance").option("value");
    var dxAstillado= $("#Astillado").dxNumberBox("instance").option("value");
    var dxPorcentajeAstillado= $("#PorcentajeAstillado").dxTextBox("instance").option("value");
    var dxEpps= $("#Epps").dxNumberBox("instance").option("value");
    var dxPorcentajeEpps= $("#PorcentajeEpps").dxTextBox("instance").option("value");
    var dxCarton= $("#Carton").dxNumberBox("instance").option("value");
    var dxPorcentajeCarton= $("#PorcentajeCarton").dxTextBox("instance").option("value");
    var dxPiedras= $("#Piedras").dxNumberBox("instance").option("value");
    var dxPorcentajePiedras= $("#PorcentajePiedras").dxTextBox("instance").option("value");
    var dxOxido= $("#Oxido").dxNumberBox("instance").option("value");
    var dxPorcentajeOxido= $("#PorcentajeOxido").dxTextBox("instance").option("value");
    var dxPolvo= $("#Polvo").dxNumberBox("instance").option("value");
    var dxPorcentajePolvo= $("#PorcentajePolvo").dxTextBox("instance").option("value");
    var dxLija= $("#Lija").dxNumberBox("instance").option("value");
    var dxPorcentajeLija= $("#PorcentajeLija").dxTextBox("instance").option("value");
    var dxPinturas= $("#Pinturas").dxNumberBox("instance").option("value");
    var dxPorcentajePinturas= $("#PorcentajePinturas").dxTextBox("instance").option("value");
    var dxTinta= $("#Tinta").dxNumberBox("instance").option("value");
    var dxPorcentajeTinta= $("#PorcentajeTinta").dxTextBox("instance").option("value");
    var dxPetroleo= $("#Petroleo").dxNumberBox("instance").option("value");
    var dxPorcentajePetroleo= $("#PorcentajePetroleo").dxTextBox("instance").option("value");
    var dxCola= $("#Cola").dxNumberBox("instance").option("value");
    var dxPorcentajeCola= $("#PorcentajeCola").dxTextBox("instance").option("value");
    var dxLubricantes= $("#Lubricantes").dxNumberBox("instance").option("value");
    var dxPorcentajeLubricantes= $("#PorcentajeLubricantes").dxTextBox("instance").option("value");
    var dxGrasas= $("#Grasas").dxNumberBox("instance").option("value");
    var dxPorcentajeGrasas= $("#PorcentajeGrasas").dxTextBox("instance").option("value");
    var dxHongos= $("#Hongos").dxNumberBox("instance").option("value");
    var dxPorcentajeHongos= $("#PorcentajeHongos").dxTextBox("instance").option("value");
    var dxMoho= $("#Moho").dxNumberBox("instance").option("value");
    var dxPorcentajeMoho= $("#PorcentajeMoho").dxTextBox("instance").option("value");
    var dxHecesAnimales= $("#HecesAnimales").dxNumberBox("instance").option("value");
    var dxPorcentajeHecesAnimales= $("#PorcentajeHecesAnimales").dxTextBox("instance").option("value");
    var dxSangre= $("#Sangre").dxNumberBox("instance").option("value");
    var dxPorcentajeSangre= $("#PorcentajeSangre").dxTextBox("instance").option("value");
    var dxSuciedad= $("#Suciedad").dxNumberBox("instance").option("value");
    var dxPorcentajeSuciedad= $("#PorcentajeSuciedad").dxTextBox("instance").option("value");
    var dxContMalIntencionada= $("#ContMalIntencionada").dxTextBox("instance").option("value");    
    var dxFrutos= $("#Frutos").dxNumberBox("instance").option("value");
    var dxPorcentajeFrutos= $("#PorcentajeFrutos").dxTextBox("instance").option("value");
    var dxHuevos= $("#Huevos").dxNumberBox("instance").option("value");
    var dxPorcentajeHuevos= $("#PorcentajeHuevos").dxTextBox("instance").option("value");
    var dxVegetales= $("#Vegetales").dxNumberBox("instance").option("value");
    var dxPorcentajeVegetales= $("#PorcentajeVegetales").dxTextBox("instance").option("value");
    var dxProductosAzucarados= $("#ProductosAzucarados").dxNumberBox("instance").option("value");
    var dxPorcentajeProductosAzucarados= $("#PorcentajeProductosAzucarados").dxTextBox("instance").option("value");
    var dxLacteos= $("#Lacteos").dxNumberBox("instance").option("value");
    var dxPorcentajeLacteos= $("#PorcentajeLacteos").dxTextBox("instance").option("value");   
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
      ls_parametros=ls_accion +","+dxcmbSede+","+dxdpFecha+","+dxcmbTurno+","+dxtpHoraInicio+","
      +dxtpHoraFin+","+dxcmbCampana+","+dxcmbTipoProducto+","+dxcmbDestino+","+dxcmbCliente+","
      +dxcmbMateriaPrima+","+dxtxtCodigoPallet+","+dxtxtLoteProduccion+","+dxtxtLineaEnsamblaje+","+dxtxtCantidad+","
      +dxcmbCodigoProducto+","+dxcmbDescripcionProducto+","+dxtxtObservacionTrazabilidad+","+dxcmbObservacionPaletizado+","+dxContaminacion+","
      +dxtxtPeligrosPaletizado+","+dxtxtPaletizadoConforme+","+dxtxtSelladoConforme+","+dxcmbTipoMaterial+","+dxtxtCantidadMuestra+","
      +dxcmbObservacionMuestra+","+dxtxtAncho+","+dxtxtDetalleAncho+","+dxtxtUnidadesAncho+","+dxtxtPorcentajeAncho+","
      +dxtxtLargo+","+dxtxtDetalleLargo+","+dxtxtUnidadesLargo+","+dxtxtPorcentajeLargo+","+dxtxtAlto+","
      +dxtxtDetalleAlto+","+dxtxtUnidadesAlto+","+dxtxtPorcentajeAlto+","+dxtxtEspesor+","+dxtxtDetalleEspesor+","
      +dxtxtUnidadesEspesor+","+dxtxtPorcentajeEspesor+","+dxtxtHumedad+","+dxtxtDetalleHumedad+","+dxtxtArqueado+","
      +dxtxtPorcentajeArqueado+","+dxtxtColor+","+dxtxtPorcentajeColor+","+dxtxtCorte+","+dxtxtPorcentajeCorte+","
      +dxtxtCuadratura+","+dxtxtPorcentajeCuadratura+","+dxtxtDespegado+","+dxtxtPorcentajeDespegado+","+dxtxtDobleEtiqueta+","
      +dxtxtPorcentajeDobleEtiqueta+","+dxtxtFalloImpresion+","+dxtxtPorcentajeFalloImpresion+","+dxtxtGrietas+","+dxtxtPorcentajeGrietas+","
      +dxtxtImpresionSenasa+","+dxtxtPorcentajeImpresionSenasa+","+dxtxtMalaDistribucion+","+dxtxtPorcentajeMalaDistribucion+","+dxtxtMalaSujecion+","
      +dxtxtPorcentajeMalaSujecion+","+dxtxtManchasAzules+","+dxtxtPorcentajeManchasAzules+","+dxtxtNoUV+","+dxtxtPorcentajeNoUV+","
      +dxtxtNudo+","+dxtxtPorcentajeNudo+","+dxtxtOrificios+","+dxtxtPorcentajeOrificios+","+dxtxtPartidura+","
      +dxtxtPorcentajePartidura+","+dxtxtPuntoExpuesto+","+dxtxtPorcentajePuntoExpuesto+","+dxtxtPuntoRoto+","+dxtxtPorcentajePuntoRoto+","
      +dxtxtPuntoSuelto+","+dxtxtPorcentajePuntoSuelto+","+dxtxtRasgado+","+dxtxtPorcentajeRasgado+","+dxtxtRotoQuebrado+","
      +dxtxtPorcentajeRotoQuebrado+","+dxtxtSinPunto+","+dxtxtPorcentajeSinPunto+","+dxtxtTexturaGranulada+","+dxtxtPorcentajeTexturaGranulada+","
      +dxtxtVacio+","+dxtxtPorcentajeVacio+","+dxtxtVentilacion+","+dxtxtPorcentajeVentilacion+","+dxtxtVolteado+","
      +dxtxtPorcentajeVolteado+","+dxCintaEmbalaje+","+dxPorcentajeCintaEmbalaje+","+dxMetalAcero+","+dxPorcentajeMetalAcero+","
      +dxPlastico+","+dxPorcentajePlastico+","+dxInsectos+","+dxPorcentajeInsectos+","+dxAstillado+","
      +dxPorcentajeAstillado+","+dxEpps+","+dxPorcentajeEpps+","+dxCarton+","+dxPorcentajeCarton+","
      +dxPiedras+","+dxPorcentajePiedras+","+dxOxido+","+dxPorcentajeOxido+","+dxPolvo+","
      +dxPorcentajePolvo+","+dxLija+","+dxPorcentajeLija+","+dxPinturas+","+dxPorcentajePinturas+","
      +dxTinta+","+dxPorcentajeTinta+","+dxPetroleo+","+dxPorcentajePetroleo+","+dxCola+","
      +dxPorcentajeCola+","+dxLubricantes+","+dxPorcentajeLubricantes+","+dxGrasas+","+dxPorcentajeGrasas+","
      +dxHongos+","+dxPorcentajeHongos+","+dxMoho+","+dxPorcentajeMoho+","+dxHecesAnimales+","
      +dxPorcentajeHecesAnimales+","+dxSangre+","+dxPorcentajeSangre+","+dxSuciedad+","+dxPorcentajeSuciedad+","
      +dxContMalIntencionada+","+dxFrutos+","+dxPorcentajeFrutos+","+dxHuevos+","+dxPorcentajeHuevos+","
      +dxVegetales+","+dxPorcentajeVegetales+","+dxProductosAzucarados+","+dxPorcentajeProductosAzucarados+","+dxLacteos+","
      +dxPorcentajeLacteos+","+dxtxtTotalObservaciones+","+dxtxtPorcentajeTotalObservaciones;
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
                title: "Paletizado",
                template: function() {
                    return $("<div>").append(
                      //  $("<div>").dxTextBox({ value: "Control en Pestaña 2" })
                      div_tab_02.innerHTML
                    );
                }
            },
            {
              title: "Muestreo",
              template: function() {
                  return $("<div>").append(
                    //  $("<div>").dxTextBox({ value: "Control en Pestaña 3" })
                    div_tab_03.innerHTML
                  );
              }
            },          
            {
              title: "Trazabilidad",
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
 
  // COMBO Campana
  $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbCampana' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbCampana=$('#cmbCampana').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Campana',
        valueExpr: 'IdCampana',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbCampana:', textStatus, errorThrown);
    }, 
  }),

   // COMBO TipoProducto
   $.ajax({ 
    url: 'datos_pt.php',
    type: 'GET',
    data: { action: 'cmbTipoProducto' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxTipoProducto=$('#cmbTipoProducto').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'TipoProducto',
        valueExpr: 'IdTipoProducto',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTipoProducto:', textStatus, errorThrown);
    }, 
  }),

   // COMBO Destino
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

   // COMBO Cliente
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

   // COMBO MateriaPrima
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

   // txtCodigoPallet
   $('#txtCodigoPallet').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtLoteProduccion
   $('#txtLoteProduccion').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtLineaEnsamblaje
   $('#txtLineaEnsamblaje').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtCantidad
   $('#txtCantidad').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // cmbCodigoProducto
   idxcmbCodigoProducto = $('#cmbCodigoProducto').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

    // // COMBO DESCRIPCION PRODUCTO
    // $.ajax({ 
    //   url: 'datos_pt.php',
    //   type: 'GET',
    //   data: { action: 'cmbDescripcionProducto' },
    //   dataType: 'json',
    //   success(data) {
        
    //       console.log(data)
  
    //       idxcmbDescripcionProducto=$('#cmbDescripcionProducto').dxSelectBox({          
    //       dataSource: data,
    //       displayExpr: 'Descripcion',
    //       valueExpr: 'Id',
    //     }).dxSelectBox("instance");
    //   },
    //   error() {             
    //           console.error('Error cmbDescripcionProducto:', textStatus, errorThrown);
    //   }, 
    // }),

   // txtDescripcionProducto
   idxcmbDescripcionProducto = $('#cmbDescripcionProducto').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

   // txtObservacionTrazabilidad
   $('#txtObservacionTrazabilidad').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

    // COMBO OBSERVACION PALETIZADO
    $.ajax({ 
      url: 'datos_pt.php',
      type: 'GET',
      data: { action: 'cmbObservacionPaletizado' },
      dataType: 'json',
      success(data) {
        
          console.log(data)
  
          idxcmbObservacionPaletizado=$('#cmbObservacionPaletizado').dxSelectBox({ 
          dataSource: data,
          displayExpr: 'Observacion',
          valueExpr: 'IdObservacion',
        }).dxSelectBox("instance");
      },
      error() {             
              console.error('Error cmbObservacionPaletizado:', textStatus, errorThrown);
      }, 
    }),

   // txtContaminacion
   idxContaminacion = $('#Contaminacion').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

  // txtPeligrosPaletizado
  idxtxtPeligrosPaletizado = $('#txtPeligrosPaletizado').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }).dxTextBox("instance");

   // ocultar
   $("#txtPeligrosPaletizado").css("display", "none");

   // txtPaletizadoConforme
   $('#txtPaletizadoConforme').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

   // txtSelladoConforme
   $('#txtSelladoConforme').dxTextBox({
    inputAttr: {'aria-label': 'Name'},
  }),

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
            document.getElementById("grupo_alto").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "block";  
            document.getElementById("grupo_color").style.display = "none"; 
            document.getElementById("grupo_corte").style.display = "block";   
            document.getElementById("grupo_cuadratura").style.display = "block";  
            document.getElementById("grupo_despegado").style.display = "none";  
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_falloimpresion").style.display = "none"; 
            document.getElementById("grupo_grietas").style.display = "block";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_maladistribucion").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "none";  
            document.getElementById("grupo_manchasazules").style.display = "block";             
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_nudo").style.display = "none";  
            document.getElementById("grupo_orificios").style.display = "block";  
            document.getElementById("grupo_partidura").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "none";  
            document.getElementById("grupo_puntoroto").style.display = "none";  
            document.getElementById("grupo_puntosuelto").style.display = "none";  
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "block";  
            document.getElementById("grupo_sinpunto").style.display = "none";  
            document.getElementById("grupo_texturagranulada").style.display = "none";  
            document.getElementById("grupo_Vacio").style.display = "block";
            document.getElementById("grupo_Ventilacion").style.display = "block";   
            document.getElementById("grupo_Volteado").style.display = "none";                
          }
          else if(val.value==2){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_alto").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "block";  
            document.getElementById("grupo_color").style.display = "none"; 
            document.getElementById("grupo_corte").style.display = "block";   
            document.getElementById("grupo_cuadratura").style.display = "none";  
            document.getElementById("grupo_despegado").style.display = "none";  
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_falloimpresion").style.display = "none"; 
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "block";  
            document.getElementById("grupo_maladistribucion").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "none";  
            document.getElementById("grupo_manchasazules").style.display = "none";             
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_nudo").style.display = "block";  
            document.getElementById("grupo_orificios").style.display = "none";  
            document.getElementById("grupo_partidura").style.display = "block";  
            document.getElementById("grupo_puntoexpuesto").style.display = "none";  
            document.getElementById("grupo_puntoroto").style.display = "none";  
            document.getElementById("grupo_puntosuelto").style.display = "none";  
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "block";  
            document.getElementById("grupo_sinpunto").style.display = "none";  
            document.getElementById("grupo_texturagranulada").style.display = "none";  
            document.getElementById("grupo_Vacio").style.display = "none";
            document.getElementById("grupo_Ventilacion").style.display = "none";   
            document.getElementById("grupo_Volteado").style.display = "none";   
          } 
          else if(val.value==3){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_alto").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_color").style.display = "none"; 
            document.getElementById("grupo_corte").style.display = "none";   
            document.getElementById("grupo_cuadratura").style.display = "none";  
            document.getElementById("grupo_despegado").style.display = "none";  
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_falloimpresion").style.display = "none"; 
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_maladistribucion").style.display = "block";  
            document.getElementById("grupo_malasujecion").style.display = "block";  
            document.getElementById("grupo_manchasazules").style.display = "none";             
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_nudo").style.display = "none";  
            document.getElementById("grupo_orificios").style.display = "none";  
            document.getElementById("grupo_partidura").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "block";  
            document.getElementById("grupo_puntoroto").style.display = "block";  
            document.getElementById("grupo_puntosuelto").style.display = "block";  
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "none";  
            document.getElementById("grupo_sinpunto").style.display = "block";  
            document.getElementById("grupo_texturagranulada").style.display = "none";  
            document.getElementById("grupo_Vacio").style.display = "none";
            document.getElementById("grupo_Ventilacion").style.display = "none";   
            document.getElementById("grupo_Volteado").style.display = "none";     
          } 
          else if(val.value==4){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_alto").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_color").style.display = "none"; 
            document.getElementById("grupo_corte").style.display = "none";   
            document.getElementById("grupo_cuadratura").style.display = "none";  
            document.getElementById("grupo_despegado").style.display = "none";  
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_falloimpresion").style.display = "none"; 
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_maladistribucion").style.display = "block";  
            document.getElementById("grupo_malasujecion").style.display = "block";  
            document.getElementById("grupo_manchasazules").style.display = "none";             
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_nudo").style.display = "none";  
            document.getElementById("grupo_orificios").style.display = "none";  
            document.getElementById("grupo_partidura").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "block";  
            document.getElementById("grupo_puntoroto").style.display = "block";  
            document.getElementById("grupo_puntosuelto").style.display = "block";  
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "none";  
            document.getElementById("grupo_sinpunto").style.display = "block";  
            document.getElementById("grupo_texturagranulada").style.display = "none";  
            document.getElementById("grupo_Vacio").style.display = "none";
            document.getElementById("grupo_Ventilacion").style.display = "none";   
            document.getElementById("grupo_Volteado").style.display = "none";  
          } 
          else if(val.value==5){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_alto").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_color").style.display = "block"; 
            document.getElementById("grupo_corte").style.display = "block";   
            document.getElementById("grupo_cuadratura").style.display = "block";  
            document.getElementById("grupo_despegado").style.display = "block";  
            document.getElementById("grupo_dobleetiqueta").style.display = "block";  
            document.getElementById("grupo_falloimpresion").style.display = "block"; 
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_maladistribucion").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "none";  
            document.getElementById("grupo_manchasazules").style.display = "none";             
            document.getElementById("grupo_nouv").style.display = "block";  
            document.getElementById("grupo_nudo").style.display = "none";  
            document.getElementById("grupo_orificios").style.display = "none";  
            document.getElementById("grupo_partidura").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "none";  
            document.getElementById("grupo_puntoroto").style.display = "none";  
            document.getElementById("grupo_puntosuelto").style.display = "none";  
            document.getElementById("grupo_rasgado").style.display = "block";  
            document.getElementById("grupo_rotoquebrado").style.display = "none";  
            document.getElementById("grupo_sinpunto").style.display = "none";  
            document.getElementById("grupo_texturagranulada").style.display = "block";  
            document.getElementById("grupo_Vacio").style.display = "none";
            document.getElementById("grupo_Ventilacion").style.display = "none";   
            document.getElementById("grupo_Volteado").style.display = "block";    
          } 
          else if(val.value==6){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_alto").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "block";  
            document.getElementById("grupo_color").style.display = "none"; 
            document.getElementById("grupo_corte").style.display = "block";   
            document.getElementById("grupo_cuadratura").style.display = "block";  
            document.getElementById("grupo_despegado").style.display = "none";  
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_falloimpresion").style.display = "none"; 
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "block";  
            document.getElementById("grupo_maladistribucion").style.display = "none";  
            document.getElementById("grupo_malasujecion").style.display = "none";  
            document.getElementById("grupo_manchasazules").style.display = "none";             
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_nudo").style.display = "block";  
            document.getElementById("grupo_orificios").style.display = "none";  
            document.getElementById("grupo_partidura").style.display = "block";  
            document.getElementById("grupo_puntoexpuesto").style.display = "none";  
            document.getElementById("grupo_puntoroto").style.display = "none";  
            document.getElementById("grupo_puntosuelto").style.display = "none";  
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "block";  
            document.getElementById("grupo_sinpunto").style.display = "none";  
            document.getElementById("grupo_texturagranulada").style.display = "none";  
            document.getElementById("grupo_Vacio").style.display = "none";
            document.getElementById("grupo_Ventilacion").style.display = "none";   
            document.getElementById("grupo_Volteado").style.display = "none";     
          } 
          else if(val.value==7){
            document.getElementById("grupo_ancho").style.display = "block"; 
            document.getElementById("grupo_largo").style.display = "block";  
            document.getElementById("grupo_alto").style.display = "block";  
            document.getElementById("grupo_espesor").style.display = "block";  
            document.getElementById("grupo_humedad").style.display = "block";  
            document.getElementById("grupo_arqueado").style.display = "none";  
            document.getElementById("grupo_color").style.display = "none"; 
            document.getElementById("grupo_corte").style.display = "none";   
            document.getElementById("grupo_cuadratura").style.display = "none";  
            document.getElementById("grupo_despegado").style.display = "none";  
            document.getElementById("grupo_dobleetiqueta").style.display = "none";  
            document.getElementById("grupo_falloimpresion").style.display = "none"; 
            document.getElementById("grupo_grietas").style.display = "none";  
            document.getElementById("grupo_impresionsenasa").style.display = "none";  
            document.getElementById("grupo_maladistribucion").style.display = "block";  
            document.getElementById("grupo_malasujecion").style.display = "block";  
            document.getElementById("grupo_manchasazules").style.display = "none";             
            document.getElementById("grupo_nouv").style.display = "none";  
            document.getElementById("grupo_nudo").style.display = "none";  
            document.getElementById("grupo_orificios").style.display = "none";  
            document.getElementById("grupo_partidura").style.display = "none";  
            document.getElementById("grupo_puntoexpuesto").style.display = "block";  
            document.getElementById("grupo_puntoroto").style.display = "block";  
            document.getElementById("grupo_puntosuelto").style.display = "block";  
            document.getElementById("grupo_rasgado").style.display = "none";  
            document.getElementById("grupo_rotoquebrado").style.display = "none";  
            document.getElementById("grupo_sinpunto").style.display = "block";  
            document.getElementById("grupo_texturagranulada").style.display = "none";  
            document.getElementById("grupo_Vacio").style.display = "none";
            document.getElementById("grupo_Ventilacion").style.display = "none";   
            document.getElementById("grupo_Volteado").style.display = "none";     
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
        idxtxtPorcentajeAncho=$('#txtPorcentajeAncho').dxTextBox({
        value:roundToDecimals((idxtxtAncho.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeLargo=$('#txtPorcentajeLargo').dxTextBox({
        value:roundToDecimals((idxtxtLargo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeAlto=$('#txtPorcentajeAlto').dxTextBox({
        value:roundToDecimals((idxtxtAlto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeEspesor=$('#txtPorcentajeEspesor').dxTextBox({
        value:roundToDecimals((idxtxtEspesor.option("value")/ val.value  )*100,2)  + '%' ,
        })      
        idxtxtPorcentajeArqueado=$('#txtPorcentajeArqueado').dxTextBox({
        value:roundToDecimals((idxtxtArqueado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeColor=$('#txtPorcentajeColor').dxTextBox({
        value:roundToDecimals((idxtxtColor.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeCorte=$('#txtPorcentajeCorte').dxTextBox({
        value:roundToDecimals((idxtxtCorte.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeCuadratura=$('#txtPorcentajeCuadratura').dxTextBox({
        value:roundToDecimals((idxtxtCuadratura.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeDespegado=$('#txtPorcentajeDespegado').dxTextBox({
        value:roundToDecimals((idxtxtDespegado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeDobleEtiqueta=$('#txtPorcentajeDobleEtiqueta').dxTextBox({
        value:roundToDecimals((idxtxtDobleEtiqueta.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeFalloImpresion=$('#txtPorcentajeFalloImpresion').dxTextBox({
        value:roundToDecimals((idxtxtFalloImpresion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeGrietas=$('#txtPorcentajeGrietas').dxTextBox({
        value:roundToDecimals((idxtxtGrietas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeImpresionSenasa=$('#txtPorcentajeImpresionSenasa').dxTextBox({
        value:roundToDecimals((idxtxtImpresionSenasa.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeMalaDistribucion=$('#txtPorcentajeMalaDistribucion').dxTextBox({
        value:roundToDecimals((idxtxtMalaDistribucion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeMalaSujecion=$('#txtPorcentajeMalaSujecion').dxTextBox({
        value:roundToDecimals((idxtxtMalaSujecion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeManchasAzules=$('#txtPorcentajeManchasAzules').dxTextBox({
        value:roundToDecimals((idxtxtManchasAzules.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeNoUV=$('#txtPorcentajeNoUV').dxTextBox({
        value:roundToDecimals((idxtxtNoUV.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeNudo=$('#txtPorcentajeNudo').dxTextBox({
        value:roundToDecimals((idxtxtNudo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeOrificios=$('#txtPorcentajeOrificios').dxTextBox({
        value:roundToDecimals((idxtxtOrificios.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajePartidura=$('#txtPorcentajePartidura').dxTextBox({
        value:roundToDecimals((idxtxtPartidura.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajePuntoExpuesto=$('#txtPorcentajePuntoExpuesto').dxTextBox({
        value:roundToDecimals((idxtxtPuntoExpuesto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajePuntoRoto=$('#txtPorcentajePuntoRoto').dxTextBox({
        value:roundToDecimals((idxtxtPuntoRoto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajePuntoSuelto=$('#txtPorcentajePuntoSuelto').dxTextBox({
        value:roundToDecimals((idxtxtPuntoSuelto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeRasgado=$('#txtPorcentajeRasgado').dxTextBox({
        value:roundToDecimals((idxtxtRasgado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeRotoQuebrado=$('#txtPorcentajeRotoQuebrado').dxTextBox({
        value:roundToDecimals((idxtxtRotoQuebrado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeSinPunto=$('#txtPorcentajeSinPunto').dxTextBox({
        value:roundToDecimals((idxtxtSinPunto.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeTexturaGranulada=$('#txtPorcentajeTexturaGranulada').dxTextBox({
        value:roundToDecimals((idxtxtTexturaGranulada.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeVacio=$('#txtPorcentajeVacio').dxTextBox({
        value:roundToDecimals((idxtxtVacio.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeVentilacion=$('#txtPorcentajeVentilacion').dxTextBox({
        value:roundToDecimals((idxtxtVentilacion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeVolteado=$('#txtPorcentajeVolteado').dxTextBox({
        value:roundToDecimals((idxtxtVolteado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeCintaEmbalaje=$('#PorcentajeCintaEmbalaje').dxTextBox({
        value:roundToDecimals((idxCintaEmbalaje.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeMetalAcero=$('#PorcentajeMetalAcero').dxTextBox({
        value:roundToDecimals((idxMetalAcero.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajePlastico=$('#PorcentajePlastico').dxTextBox({
        value:roundToDecimals((idxPlastico.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeInsectos=$('#PorcentajeInsectos').dxTextBox({
        value:roundToDecimals((idxInsectos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeAstillado=$('#PorcentajeAstillado').dxTextBox({
        value:roundToDecimals((idxAstillado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeEpps=$('#PorcentajeEpps').dxTextBox({
        value:roundToDecimals((idxEpps.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeCarton=$('#PorcentajeCarton').dxTextBox({
        value:roundToDecimals((idxCarton.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajePiedras=$('#PorcentajePiedras').dxTextBox({
        value:roundToDecimals((idxPiedras.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeOxido=$('#PorcentajeOxido').dxTextBox({
        value:roundToDecimals((idxOxido.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajePolvo=$('#PorcentajePolvo').dxTextBox({
        value:roundToDecimals((idxPolvo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeLija=$('#PorcentajeLija').dxTextBox({
        value:roundToDecimals((idxLija.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajePinturas=$('#PorcentajePinturas').dxTextBox({
        value:roundToDecimals((idxPinturas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeTinta=$('#PorcentajeTinta').dxTextBox({
        value:roundToDecimals((idxTinta.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajePetroleo=$('#PorcentajePetroleo').dxTextBox({
        value:roundToDecimals((idxPetroleo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeCola=$('#PorcentajeCola').dxTextBox({
        value:roundToDecimals((idxCola.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeLubricantes=$('#PorcentajeLubricantes').dxTextBox({
        value:roundToDecimals((idxLubricantes.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeGrasas=$('#PorcentajeGrasas').dxTextBox({
        value:roundToDecimals((idxGrasas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeHongos=$('#PorcentajeHongos').dxTextBox({
        value:roundToDecimals((idxHongos.option("value")/ val.value  )*100,2)  + '%' ,
        })      
        idxPorcentajeMoho=$('#PorcentajeMoho').dxTextBox({
        value:roundToDecimals((idxMoho.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeHecesAnimales=$('#PorcentajeHecesAnimales').dxTextBox({
        value:roundToDecimals((idxHecesAnimales.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeSangre=$('#PorcentajeSangre').dxTextBox({
        value:roundToDecimals((idxSangre.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeSuciedad=$('#PorcentajeSuciedad').dxTextBox({
        value:roundToDecimals((idxSuciedad.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeFrutos=$('#PorcentajeFrutos').dxTextBox({
        value:roundToDecimals((idxFrutos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeHuevos=$('#PorcentajeHuevos').dxTextBox({
        value:roundToDecimals((idxHuevos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeVegetales=$('#PorcentajeVegetales').dxTextBox({
        value:roundToDecimals((idxVegetales.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeProductosAzucarados=$('#PorcentajeProductosAzucarados').dxTextBox({
        value:roundToDecimals((idxProductosAzucarados.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPorcentajeLacteos=$('#PorcentajeLacteos').dxTextBox({
        value:roundToDecimals((idxLacteos.option("value")/ val.value  )*100,2)  + '%' ,
        })

        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }

  }).dxNumberBox("instance");

  function roundToDecimals(num, decimals) {
    let factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
  // COMBO OBSERVACIONMUESTRA
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
            idxtxtArqueado.option("disabled", false);
            idxtxtColor.option("disabled", false);
            idxtxtCorte.option("disabled", false);
            idxtxtCuadratura.option("disabled", false);
            idxtxtDespegado.option("disabled", false);
            idxtxtDobleEtiqueta.option("disabled", false);
            idxtxtFalloImpresion.option("disabled", false);
            idxtxtGrietas.option("disabled", false);
            idxtxtImpresionSenasa.option("disabled", false);
            idxtxtMalaDistribucion.option("disabled", false);
            idxtxtMalaSujecion.option("disabled", false);
            idxtxtManchasAzules.option("disabled", false);
            idxtxtNoUV.option("disabled", false);
            idxtxtNudo.option("disabled", false);
            idxtxtOrificios.option("disabled", false);
            idxtxtPartidura.option("disabled", false);
            idxtxtPuntoExpuesto.option("disabled", false);
            idxtxtPuntoRoto.option("disabled", false);
            idxtxtPuntoSuelto.option("disabled", false);
            idxtxtRasgado.option("disabled", false);
            idxtxtRotoQuebrado.option("disabled", false);
            idxtxtSinPunto.option("disabled", false);
            idxtxtTexturaGranulada.option("disabled", false);
            idxtxtVacio.option("disabled", false);
            idxtxtVentilacion.option("disabled", false);
            idxtxtVolteado.option("disabled", false);
            idxCintaEmbalaje.option("disabled", false);
            idxMetalAcero.option("disabled", false);
            idxPlastico.option("disabled", false);
            idxInsectos.option("disabled", false);
            idxAstillado.option("disabled", false);
            idxEpps.option("disabled", false);
            idxCarton.option("disabled", false);
            idxPiedras.option("disabled", false);
            idxOxido.option("disabled", false);
            idxPolvo.option("disabled", false); 
            idxLija.option("disabled", false); 
            idxPinturas.option("disabled", false); 
            idxTinta.option("disabled", false); 
            idxPetroleo.option("disabled", false); 
            idxCola.option("disabled", false); 
            idxLubricantes.option("disabled", false); 
            idxGrasas.option("disabled", false); 
            idxHongos.option("disabled", false); 
            idxMoho.option("disabled", false); 
            idxHecesAnimales.option("disabled", false); 
            idxSangre.option("disabled", false); 
            idxSuciedad.option("disabled", false);  
            idxFrutos.option("disabled", false);  
            idxHuevos.option("disabled", false);  
            idxVegetales.option("disabled", false);  
            idxProductosAzucarados.option("disabled", false);  
            idxLacteos.option("disabled", false);              
          }
            else{
            idxtxtAncho.option("disabled", true);
            idxtxtLargo.option("disabled", true);
            idxtxtAlto.option("disabled", true);
            idxtxtEspesor.option("disabled", true);          
            idxtxtHumedad.option("disabled", true);
            idxtxtArqueado.option("disabled", true);
            idxtxtColor.option("disabled", true);
            idxtxtCorte.option("disabled", true);
            idxtxtCuadratura.option("disabled", true);
            idxtxtDespegado.option("disabled", true);
            idxtxtDobleEtiqueta.option("disabled", true);
            idxtxtFalloImpresion.option("disabled", true);
            idxtxtGrietas.option("disabled", true);
            idxtxtImpresionSenasa.option("disabled", true);
            idxtxtMalaDistribucion.option("disabled", true);
            idxtxtMalaSujecion.option("disabled", true);
            idxtxtManchasAzules.option("disabled", true);
            idxtxtNoUV.option("disabled", true);
            idxtxtNudo.option("disabled", true);
            idxtxtOrificios.option("disabled", true);
            idxtxtPartidura.option("disabled", true);
            idxtxtPuntoExpuesto.option("disabled", true);
            idxtxtPuntoRoto.option("disabled", true);
            idxtxtPuntoSuelto.option("disabled", true);
            idxtxtRasgado.option("disabled", true);
            idxtxtRotoQuebrado.option("disabled", true);
            idxtxtSinPunto.option("disabled", true);
            idxtxtTexturaGranulada.option("disabled", true);
            idxtxtVacio.option("disabled", true);
            idxtxtVentilacion.option("disabled", true);
            idxtxtVolteado.option("disabled", true);
            idxCintaEmbalaje.option("disabled", true);
            idxMetalAcero.option("disabled", true);
            idxPlastico.option("disabled", true);
            idxInsectos.option("disabled", true);
            idxAstillado.option("disabled", true);
            idxEpps.option("disabled", true);
            idxCarton.option("disabled", true);
            idxPiedras.option("disabled", true);
            idxOxido.option("disabled", true);
            idxPolvo.option("disabled", true); 
            idxLija.option("disabled", true); 
            idxPinturas.option("disabled", true); 
            idxTinta.option("disabled", true); 
            idxPetroleo.option("disabled", true); 
            idxCola.option("disabled", true); 
            idxLubricantes.option("disabled", true); 
            idxGrasas.option("disabled", true); 
            idxHongos.option("disabled", true); 
            idxMoho.option("disabled", true); 
            idxHecesAnimales.option("disabled", true); 
            idxSangre.option("disabled", true); 
            idxSuciedad.option("disabled", true); 
            idxFrutos.option("disabled", true);  
            idxHuevos.option("disabled", true);  
            idxVegetales.option("disabled", true);  
            idxProductosAzucarados.option("disabled", true);  
            idxLacteos.option("disabled", true);      
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
      idxtxtPorcentajeAncho=$('#txtPorcentajeAncho').dxTextBox({
      value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
  inputAttr: {'disabled': 'disabled'},
  })

  // TEXTBOX LARGO CON PORCENTAJE LARGO
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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

    // TEXTBOX ALTO CON PORCENTAJE ALTO
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
      //   value: 'kg',      
      // })
      idxtxtPorcentajeAlto=$('#txtPorcentajeAlto').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
    value: 'kg',
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

  // TEXTBOX ESPESOR CON PORCENTAJE ESPESOR
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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

   // TEXTBOX HUMEDAD CON PORCENTAJE HUMEDAD
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
      //   value: '%',      
      // })
      // idxtxtPorcentajeHumedad=$('#txtPorcentajeHumedad').dxTextBox({
      // value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      // })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
  
    // // TEXTBOX UNIDADES Humedad
    // idxtxtUnidadesHumedad= $('#txtUnidadesHumedad').dxTextBox({
    // value: '%',
    // min: 0,
    // max: 100,
    // inputAttr: { 'aria-label': 'Min y Max' },
    // })
  
    // // TEXTBOX PORCENTAJE Humedad
    // idxtxtPorcentajeHumedad= $('#txtPorcentajeHumedad').dxTextBox({
    // // value: 'mm',
    // min: 0,
    // max: 100,
    // inputAttr: { 'aria-label': 'Min y Max' },
    // })


  // TEXTBOX Arqueado CON PORCENTAJE Arqueado
  idxtxtArqueado= $('#txtArqueado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeArqueado=$('#txtPorcentajeArqueado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
    onValueChanged(val){
      idxtxtPorcentajeColor=$('#txtPorcentajeColor').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
        + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
        + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
        + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
        + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
        + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
        + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
        + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
        + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
        + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
        + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
        + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
        + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
        + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
        + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
        + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeCorte=$('#txtPorcentajeCorte').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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

      // TEXTBOX Cuadratura CON PORCENTAJE Cuadratura
    idxtxtCuadratura= $('#txtCuadratura').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxtxtPorcentajeCuadratura=$('#txtPorcentajeCuadratura').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxtxtCuadratura.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Cuadratura
      idxtxtPorcentajeCuadratura= $('#txtPorcentajeCuadratura').dxTextBox({
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
      onValueChanged(val){
        idxtxtPorcentajeDespegado=$('#txtPorcentajeDespegado').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeDobleEtiqueta=$('#txtPorcentajeDobleEtiqueta').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeFalloImpresion=$('#txtPorcentajeFalloImpresion').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeGrietas=$('#txtPorcentajeGrietas').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeImpresionSenasa=$('#txtPorcentajeImpresionSenasa').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeMalaDistribucion=$('#txtPorcentajeMalaDistribucion').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeMalaSujecion=$('#txtPorcentajeMalaSujecion').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeManchasAzules=$('#txtPorcentajeManchasAzules').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeNoUV=$('#txtPorcentajeNoUV').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeNudo=$('#txtPorcentajeNudo').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeOrificios=$('#txtPorcentajeOrificios').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajePartidura=$('#txtPorcentajePartidura').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajePuntoExpuesto=$('#txtPorcentajePuntoExpuesto').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajePuntoRoto=$('#txtPorcentajePuntoRoto').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajePuntoSuelto=$('#txtPorcentajePuntoSuelto').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeRasgado=$('#txtPorcentajeRasgado').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeRotoQuebrado=$('#txtPorcentajeRotoQuebrado').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeSinPunto=$('#txtPorcentajeSinPunto').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeTexturaGranulada=$('#txtPorcentajeTexturaGranulada').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeVacio=$('#txtPorcentajeVacio').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeVentilacion=$('#txtPorcentajeVentilacion').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
      onValueChanged(val){
        idxtxtPorcentajeVolteado=$('#txtPorcentajeVolteado').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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

      // TEXTBOX CintaEmbalaje CON PORCENTAJE CintaEmbalaje
    idxCintaEmbalaje= $('#CintaEmbalaje').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeCintaEmbalaje=$('#PorcentajeCintaEmbalaje').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxCintaEmbalaje.option("disabled", true);
    
      // TEXTBOX PORCENTAJE CintaEmbalaje
      idxPorcentajeCintaEmbalaje= $('#PorcentajeCintaEmbalaje').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX MetalAcero CON PORCENTAJE MetalAcero
    idxMetalAcero= $('#MetalAcero').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeMetalAcero=$('#PorcentajeMetalAcero').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxMetalAcero.option("disabled", true);
    
      // TEXTBOX PORCENTAJE MetalAcero
      idxPorcentajeMetalAcero= $('#PorcentajeMetalAcero').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Plastico CON PORCENTAJE Plastico
    idxPlastico= $('#Plastico').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajePlastico=$('#PorcentajePlastico').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxPlastico.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Plastico
      idxPorcentajePlastico= $('#PorcentajePlastico').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Insectos CON PORCENTAJE Insectos
    idxInsectos= $('#Insectos').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeInsectos=$('#PorcentajeInsectos').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxInsectos.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Insectos
      idxPorcentajeInsectos= $('#PorcentajeInsectos').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Astillado CON PORCENTAJE Astillado
    idxAstillado= $('#Astillado').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeAstillado=$('#PorcentajeAstillado').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxAstillado.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Astillado
      idxPorcentajeAstillado= $('#PorcentajeAstillado').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Epps CON PORCENTAJE Epps
    idxEpps= $('#Epps').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeEpps=$('#PorcentajeEpps').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxEpps.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Epps
      idxPorcentajeEpps= $('#PorcentajeEpps').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Carton CON PORCENTAJE Carton
    idxCarton= $('#Carton').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeCarton=$('#PorcentajeCarton').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxCarton.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Carton
      idxPorcentajeCarton= $('#PorcentajeCarton').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Piedras CON PORCENTAJE Piedras
    idxPiedras= $('#Piedras').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajePiedras=$('#PorcentajePiedras').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxPiedras.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Piedras
      idxPorcentajePiedras= $('#PorcentajePiedras').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Oxido CON PORCENTAJE Oxido
    idxOxido= $('#Oxido').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeOxido=$('#PorcentajeOxido').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxOxido.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Oxido
      idxPorcentajeOxido= $('#PorcentajeOxido').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Polvo CON PORCENTAJE Polvo
    idxPolvo= $('#Polvo').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajePolvo=$('#PorcentajePolvo').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxPolvo.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Polvo
      idxPorcentajePolvo= $('#PorcentajePolvo').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Lija CON PORCENTAJE Lija
    idxLija= $('#Lija').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeLija=$('#PorcentajeLija').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxLija.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Lija
      idxPorcentajeLija= $('#PorcentajeLija').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Pinturas CON PORCENTAJE Pinturas
    idxPinturas= $('#Pinturas').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajePinturas=$('#PorcentajePinturas').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxPinturas.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Pinturas
      idxPorcentajePinturas= $('#PorcentajePinturas').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Tinta CON PORCENTAJE Tinta
    idxTinta= $('#Tinta').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeTinta=$('#PorcentajeTinta').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxTinta.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Tinta
      idxPorcentajeTinta= $('#PorcentajeTinta').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // TEXTBOX Petroleo CON PORCENTAJE Petroleo
    idxPetroleo= $('#Petroleo').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajePetroleo=$('#PorcentajePetroleo').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxPetroleo.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Petroleo
      idxPorcentajePetroleo= $('#PorcentajePetroleo').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Cola CON PORCENTAJE Cola
    idxCola= $('#Cola').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeCola=$('#PorcentajeCola').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxCola.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Cola
      idxPorcentajeCola= $('#PorcentajeCola').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Lubricantes CON PORCENTAJE Lubricantes
    idxLubricantes= $('#Lubricantes').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeLubricantes=$('#PorcentajeLubricantes').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxLubricantes.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Lubricantes
      idxPorcentajeLubricantes= $('#PorcentajeLubricantes').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Grasas CON PORCENTAJE Grasas
    idxGrasas= $('#Grasas').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeGrasas=$('#PorcentajeGrasas').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxGrasas.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Grasas
      idxPorcentajeGrasas= $('#PorcentajeGrasas').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Hongos CON PORCENTAJE Hongos
    idxHongos= $('#Hongos').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeHongos=$('#PorcentajeHongos').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxHongos.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Hongos
      idxPorcentajeHongos= $('#PorcentajeHongos').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Moho CON PORCENTAJE Moho
    idxMoho= $('#Moho').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeMoho=$('#PorcentajeMoho').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxMoho.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Moho
      idxPorcentajeMoho= $('#PorcentajeMoho').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX HecesAnimales CON PORCENTAJE HecesAnimales
    idxHecesAnimales= $('#HecesAnimales').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeHecesAnimales=$('#PorcentajeHecesAnimales').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxHecesAnimales.option("disabled", true);
    
      // TEXTBOX PORCENTAJE HecesAnimales
      idxPorcentajeHecesAnimales= $('#PorcentajeHecesAnimales').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Sangre CON PORCENTAJE Sangre
    idxSangre= $('#Sangre').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeSangre=$('#PorcentajeSangre').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxSangre.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Sangre
      idxPorcentajeSangre= $('#PorcentajeSangre').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Suciedad CON PORCENTAJE Suciedad
    idxSuciedad= $('#Suciedad').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeSuciedad=$('#PorcentajeSuciedad').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxSuciedad.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Suciedad
      idxPorcentajeSuciedad= $('#PorcentajeSuciedad').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

      // ContMalIntencionada
      idxContMalIntencionada = $('#ContMalIntencionada').dxTextBox({
      inputAttr: {'aria-label': 'Name'},
  }),

       // TEXTBOX Frutos CON PORCENTAJE Frutos
    idxFrutos= $('#Frutos').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeFrutos=$('#PorcentajeFrutos').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxFrutos.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Frutos
      idxPorcentajeFrutos= $('#PorcentajeFrutos').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Huevos CON PORCENTAJE Huevos
    idxHuevos= $('#Huevos').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeHuevos=$('#PorcentajeHuevos').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxHuevos.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Huevos
      idxPorcentajeHuevos= $('#PorcentajeHuevos').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Vegetales CON PORCENTAJE Vegetales
    idxVegetales= $('#Vegetales').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeVegetales=$('#PorcentajeVegetales').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxVegetales.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Vegetales
      idxPorcentajeVegetales= $('#PorcentajeVegetales').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX ProductosAzucarados CON PORCENTAJE ProductosAzucarados
    idxProductosAzucarados= $('#ProductosAzucarados').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeProductosAzucarados=$('#PorcentajeProductosAzucarados').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxProductosAzucarados.option("disabled", true);
    
      // TEXTBOX PORCENTAJE ProductosAzucarados
      idxPorcentajeProductosAzucarados= $('#PorcentajeProductosAzucarados').dxTextBox({
      // value: 'mm',
      min: 0,
      max: 100,
      inputAttr: { 'aria-label': 'Min y Max' },
      })

       // TEXTBOX Lacteos CON PORCENTAJE Lacteos
    idxLacteos= $('#Lacteos').dxNumberBox({
      //value: 15,
      min: 0,
      max: 100,
      showSpinButtons: true,
      inputAttr: { 'aria-label': 'Min y Max' },   
      onValueChanged(val){
        idxPorcentajeLacteos=$('#PorcentajeLacteos').dxTextBox({
          value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
        })
        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtAlto.option("value") + idxtxtEspesor.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtArqueado.option("value")+ idxtxtColor.option("value")+ idxtxtCorte.option("value")
          + idxtxtCuadratura.option("value")+ idxtxtDespegado.option("value")+ idxtxtDobleEtiqueta.option("value")+ idxtxtFalloImpresion.option("value")
          + idxtxtGrietas.option("value")+ idxtxtImpresionSenasa.option("value")+ idxtxtMalaDistribucion.option("value")
          + idxtxtMalaSujecion.option("value")+ idxtxtManchasAzules.option("value")+ idxtxtNudo.option("value")
          + idxtxtOrificios.option("value")+ idxtxtPartidura.option("value")+ idxtxtPuntoExpuesto.option("value")
          + idxtxtPuntoRoto.option("value")+ idxtxtPuntoSuelto.option("value")+ idxtxtRasgado.option("value")+ idxtxtRotoQuebrado.option("value")
          + idxtxtSinPunto.option("value")+ idxtxtTexturaGranulada.option("value")+ idxtxtVacio.option("value")
          + idxtxtVentilacion.option("value")+ idxtxtVolteado.option("value")+ idxCintaEmbalaje.option("value")
          + idxMetalAcero.option("value")+ idxPlastico.option("value")+ idxInsectos.option("value")
          + idxAstillado.option("value")+ idxEpps.option("value")+ idxCarton.option("value")
          + idxPiedras.option("value")+ idxOxido.option("value")+ idxPolvo.option("value")
          + idxLija.option("value")+ idxPinturas.option("value")+ idxTinta.option("value")
          + idxPetroleo.option("value")+ idxCola.option("value")+ idxLubricantes.option("value")
          + idxGrasas.option("value")+ idxHongos.option("value")+ idxMoho.option("value")
          + idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxSuciedad.option("value")
          + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")
          + idxProductosAzucarados.option("value")+ idxLacteos.option("value")+val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })  
      }
    }).dxNumberBox("instance");
    idxLacteos.option("disabled", true);
    
      // TEXTBOX PORCENTAJE Lacteos
      idxPorcentajeLacteos= $('#PorcentajeLacteos').dxTextBox({
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


   // AGRAGER CHECKBOX A TEXTBOX
   jQuery($ => {
    // Add checkbox value to text field
    let $checks = $("ul li :checkbox").on("change", function() {
      let string = $checks.filter(":checked").map((i, el) => el.value).get().join(" - ");
      // $("#results").val(string && "" + string);
      idxtxtPeligrosPaletizado.option("value",string && "" + string)
    });
  
    // Select all checkboxes in the group
    $('.all').click(e => {
      $(e.target).closest('.group').find('li input').not(e.target).prop('checked', e.target.checked).trigger('change');
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
