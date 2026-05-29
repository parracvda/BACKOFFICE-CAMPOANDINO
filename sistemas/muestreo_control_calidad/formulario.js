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

  idxtpHora=$('#tpHora').dxDateBox({
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

  });

  function wf_validar(){

  var dxcmbSede = $("#cmbSede").dxSelectBox("instance").option("value");
  var dxdpFecha = $("#dpFecha").dxDateBox("instance").option("value");
  var dxtpHora = $("#tpHora").dxDateBox("instance").option("value");
  var dxcmbTipoRegistro = $("#cmbTipoRegistro").dxSelectBox("instance").option("value");
  var dxcmbProcedencia = $("#cmbProcedencia").dxSelectBox("instance").option("value");
  var dxcmbProveedor = $("#cmbProveedor").dxSelectBox("instance").option("value");

  dxdpFecha = formatDate( dxdpFecha )
  dxtpHora = formatTime( dxtpHora )

  if (ls_accion =="agregar"){
    if ( dxcmbSede == null ){
      alert("Debe ingresar Sede")
      return false
    }
    if ( dxcmbTipoRegistro == null ){
      alert("Debe ingresar Tipo Registro")
      return false
    } 
    if ( dxcmbProcedencia == null ){
      alert("Debe ingresar Procedencia")
      return false
    }
    if ( dxcmbProveedor == null ){
      alert("Debe ingresar Proveedor")
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
    var dxtpHora = $("#tpHora").dxDateBox("instance").option("value");
    var dxcmbTipoRegistro = $("#cmbTipoRegistro").dxSelectBox("instance").option("value");
    var dxcmbProcedencia = $("#cmbProcedencia").dxSelectBox("instance").option("value");
    var dxcmbProveedor = $("#cmbProveedor").dxSelectBox("instance").option("value");
    var dxtxtGuiaRemision = $("#txtGuiaRemision").dxTextBox("instance").option("value");
    var dxtxtGuiaTransportista = $("#txtGuiaTransportista").dxTextBox("instance").option("value");
    var dxtxtPlaca = $("#txtPlaca").dxTextBox("instance").option("value");
    var dxtxtTotalPaquetes = $("#txtTotalPaquetes").dxTextBox("instance").option("value");
    var dxtxtContenedor = $("#txtContenedor").dxTextBox("instance").option("value");
    var dxtxtPrecinto= $("#txtPrecinto").dxTextBox("instance").option("value");
    var dxcmbOrdenCompra= $("#cmbOrdenCompra").dxSelectBox("instance").option("value");
    var dxcmbDescripcionMaterial= $("#cmbDescripcionMaterial").dxSelectBox("instance").option("value");
    var dxcmbCodigoMaterial= $("#cmbCodigoMaterial").dxSelectBox("instance").option("value");
    var dxcmbParedes= $("#cmbParedes").dxSelectBox("instance").option("value");
    var dxcmbTecho= $("#cmbTecho").dxSelectBox("instance").option("value");
    var dxcmbPuerta= $("#cmbPuerta").dxSelectBox("instance").option("value");
    var dxcmbPlataforma= $("#cmbPlataforma").dxSelectBox("instance").option("value");
    var dxtxtCondicionTransporte= $("#txtCondicionTransporte").dxTextBox("instance").option("value");
    var dxcmbTipoMaterial= $("#cmbTipoMaterial").dxSelectBox("instance").option("value");
    var dxcmbDocumentacion= $("#cmbDocumentacion").dxSelectBox("instance").option("value");
    var dxtxtDocumentos= $("#txtDocumentos").dxTextBox("instance").option("value");
    var dxtxtObservacion= $("#txtObservacion").dxTextBox("instance").option("value");
    var dxtxtCantidadMuestra= $("#txtCantidadMuestra").dxNumberBox("instance").option("value");
    var dxcmbObservacionMuestra= $("#cmbObservacionMuestra").dxSelectBox("instance").option("value");
    var dxcmbCaracteristica= $("#cmbCaracteristica").dxSelectBox("instance").option("value");
    var dxtxtAncho= $("#txtAncho").dxNumberBox("instance").option("value");
    var dxtxtDetalleAncho= $("#txtDetalleAncho").dxTextBox("instance").option("value");
    var dxtxtUnidadesAncho= $("#txtUnidadesAncho").dxTextBox("instance").option("value");
    var dxtxtPorcentajeAncho= $("#txtPorcentajeAncho").dxTextBox("instance").option("value");
    var dxtxtLargo= $("#txtLargo").dxNumberBox("instance").option("value");
    var dxtxtDetalleLargo= $("#txtDetalleLargo").dxTextBox("instance").option("value");
    var dxtxtUnidadesLargo= $("#txtUnidadesLargo").dxTextBox("instance").option("value");
    var dxtxtPorcentajeLargo= $("#txtPorcentajeLargo").dxTextBox("instance").option("value");
    var dxtxtEspesor= $("#txtEspesor").dxNumberBox("instance").option("value");
    var dxtxtDetalleEspesor= $("#txtDetalleEspesor").dxTextBox("instance").option("value");
    var dxtxtUnidadesEspesor= $("#txtUnidadesEspesor").dxTextBox("instance").option("value");
    var dxtxtPorcentajeEspesor= $("#txtPorcentajeEspesor").dxTextBox("instance").option("value");
    var dxtxtPeso= $("#txtPeso").dxNumberBox("instance").option("value");
    var dxtxtDetallePeso= $("#txtDetallePeso").dxTextBox("instance").option("value");
    var dxtxtUnidadesPeso= $("#txtUnidadesPeso").dxTextBox("instance").option("value");
    var dxtxtPorcentajePeso= $("#txtPorcentajePeso").dxTextBox("instance").option("value");
    var dxtxtHumedad= $("#txtHumedad").dxNumberBox("instance").option("value");
    var dxtxtDetalleHumedad= $("#txtDetalleHumedad").dxTextBox("instance").option("value");
    var dxtxtOxidacion= $("#txtOxidacion").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeOxidacion= $("#txtPorcentajeOxidacion").dxTextBox("instance").option("value");
    var dxtxtNoRecubrimiento= $("#txtNoRecubrimiento").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeNoRecubrimiento= $("#txtPorcentajeNoRecubrimiento").dxTextBox("instance").option("value");
    var dxtxtColor= $("#txtColor").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeColor= $("#txtPorcentajeColor").dxTextBox("instance").option("value");
    var dxtxtAdhesivo= $("#txtAdhesivo").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeAdhesivo= $("#txtPorcentajeAdhesivo").dxTextBox("instance").option("value");
    var dxtxtNudos= $("#txtNudos").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeNudos= $("#txtPorcentajeNudos").dxTextBox("instance").option("value");
    var dxtxtMedula= $("#txtMedula").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeMedula= $("#txtPorcentajeMedula").dxTextBox("instance").option("value");
    var dxtxtGrietas= $("#txtGrietas").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeGrietas= $("#txtPorcentajeGrietas").dxTextBox("instance").option("value");
    var dxtxtArqueado= $("#txtArqueado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeArqueado= $("#txtPorcentajeArqueado").dxTextBox("instance").option("value");
    var dxtxtDañoInsectos= $("#txtDañoInsectos").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeDañoInsectos= $("#txtPorcentajeDañoInsectos").dxTextBox("instance").option("value");
    var dxtxtAstillado= $("#txtAstillado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeAstillado= $("#txtPorcentajeAstillado").dxTextBox("instance").option("value");
    var dxtxtDesnivelCorte= $("#txtDesnivelCorte").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeDesnivelCorte= $("#txtPorcentajeDesnivelCorte").dxTextBox("instance").option("value");
    var dxtxtSuperficieRaspada= $("#txtSuperficieRaspada").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeSuperficieRaspada= $("#txtPorcentajeSuperficieRaspada").dxTextBox("instance").option("value");
    var dxtxtHuecosYVacios= $("#txtHuecosYVacios").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeHuecosYVacios= $("#txtPorcentajeHuecosYVacios").dxTextBox("instance").option("value");
    var dxtxtSuperficieRugosa= $("#txtSuperficieRugosa").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeSuperficieRugosa= $("#txtPorcentajeSuperficieRugosa").dxTextBox("instance").option("value");
    var dxtxtDesprendimientoCapas= $("#txtDesprendimientoCapas").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeDesprendimientoCapas= $("#txtPorcentajeDesprendimientoCapas").dxTextBox("instance").option("value");
    var dxtxtRasgados= $("#txtRasgados").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeRasgados= $("#txtPorcentajeRasgados").dxTextBox("instance").option("value");
    var dxtxtPerforacion= $("#txtPerforacion").dxNumberBox("instance").option("value");
    var dxtxtPorcentajePerforacion= $("#txtPorcentajePerforacion").dxTextBox("instance").option("value");
    var dxtxtMalaImpresion= $("#txtMalaImpresion").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeMalaImpresion= $("#txtPorcentajeMalaImpresion").dxTextBox("instance").option("value");
    var dxtxtNoColor= $("#txtNoColor").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeNoColor= $("#txtPorcentajeNoColor").dxTextBox("instance").option("value");
    var dxtxtNoUV= $("#txtNoUV").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeNoUV= $("#txtPorcentajeNoUV").dxTextBox("instance").option("value");
    var dxtxtProblemasSecado= $("#txtProblemasSecado").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeProblemasSecado= $("#txtPorcentajeProblemasSecado").dxTextBox("instance").option("value");
    var dxtxtMarcaRodillo= $("#txtMarcaRodillo").dxNumberBox("instance").option("value");
    var dxtxtPorcentajeMarcaRodillo= $("#txtPorcentajeMarcaRodillo").dxTextBox("instance").option("value");
    var dxMetalAcero= $("#MetalAcero").dxNumberBox("instance").option("value");
    var dxMetalAcero_Porcentaje= $("#MetalAcero_Porcentaje").dxTextBox("instance").option("value");
    var dxInsectos= $("#Insectos").dxNumberBox("instance").option("value");
    var dxInsectos_Porcentaje= $("#Insectos_Porcentaje").dxTextBox("instance").option("value");
    var dxPiedras= $("#Piedras").dxNumberBox("instance").option("value");
    var dxPiedras_Porcentaje= $("#Piedras_Porcentaje").dxTextBox("instance").option("value");
    var dxRamas= $("#Ramas").dxNumberBox("instance").option("value");
    var dxRamas_Porcentaje= $("#Ramas_Porcentaje").dxTextBox("instance").option("value");
    var dxMelaza= $("#Melaza").dxNumberBox("instance").option("value");
    var dxMelaza_Porcentaje= $("#Melaza_Porcentaje").dxTextBox("instance").option("value");
    var dxOxido= $("#Oxido").dxNumberBox("instance").option("value");
    var dxOxido_Porcentaje= $("#Oxido_Porcentaje").dxTextBox("instance").option("value");
    var dxPlastico= $("#Plastico").dxNumberBox("instance").option("value");
    var dxPlastico_Porcentaje= $("#Plastico_Porcentaje").dxTextBox("instance").option("value");
    var dxCarton= $("#Carton").dxNumberBox("instance").option("value");
    var dxCarton_Porcentaje= $("#Carton_Porcentaje").dxTextBox("instance").option("value");
    var dxVidrio= $("#Vidrio").dxNumberBox("instance").option("value");
    var dxVidrio_Porcentaje= $("#Vidrio_Porcentaje").dxTextBox("instance").option("value");
    var dxEpps= $("#Epps").dxNumberBox("instance").option("value");
    var dxEpps_Porcentaje= $("#Epps_Porcentaje").dxTextBox("instance").option("value");
    var dxPinturas= $("#Pinturas").dxNumberBox("instance").option("value");
    var dxPinturas_Porcentaje= $("#Pinturas_Porcentaje").dxTextBox("instance").option("value");
    var dxLubricantes= $("#Lubricantes").dxNumberBox("instance").option("value");
    var dxLubricantes_Porcentaje= $("#Lubricantes_Porcentaje").dxTextBox("instance").option("value");
    var dxResina= $("#Resina").dxNumberBox("instance").option("value");
    var dxResina_Porcentaje= $("#Resina_Porcentaje").dxTextBox("instance").option("value");
    var dxHongos= $("#Hongos").dxNumberBox("instance").option("value");
    var dxHongos_Porcentaje= $("#Hongos_Porcentaje").dxTextBox("instance").option("value");
    var dxMoho= $("#Moho").dxNumberBox("instance").option("value");
    var dxMoho_Porcentaje= $("#Moho_Porcentaje").dxTextBox("instance").option("value");
    var dxHecesAnimales= $("#HecesAnimales").dxNumberBox("instance").option("value");
    var dxHecesAnimales_Porcentaje= $("#HecesAnimales_Porcentaje").dxTextBox("instance").option("value");
    var dxSangre= $("#Sangre").dxNumberBox("instance").option("value");
    var dxSangre_Porcentaje= $("#Sangre_Porcentaje").dxTextBox("instance").option("value");
    var dxContMalIntencionada= $("#ContMalIntencionada").dxTextBox("instance").option("value");
    var dxFrutos= $("#Frutos").dxNumberBox("instance").option("value");
    var dxFrutos_Porcentaje= $("#Frutos_Porcentaje").dxTextBox("instance").option("value");
    var dxHuevos= $("#Huevos").dxNumberBox("instance").option("value");
    var dxHuevos_Porcentaje= $("#Huevos_Porcentaje").dxTextBox("instance").option("value");
    var dxVegetales= $("#Vegetales").dxNumberBox("instance").option("value");
    var dxVegetales_Porcentaje= $("#Vegetales_Porcentaje").dxTextBox("instance").option("value");
    var dxProductosAzucarados= $("#ProductosAzucarados").dxNumberBox("instance").option("value");
    var dxProductosAzucarados_Porcentaje= $("#ProductosAzucarados_Porcentaje").dxTextBox("instance").option("value");
    var dxSalsas= $("#Salsas").dxNumberBox("instance").option("value");
    var dxSalsas_Porcentaje= $("#Salsas_Porcentaje").dxTextBox("instance").option("value");
    var dxtxtTotalObservaciones= $("#txtTotalObservaciones").dxTextBox("instance").option("value");
    var dxtxtPorcentajeTotalObservaciones= $("#txtPorcentajeTotalObservaciones").dxTextBox("instance").option("value");
    
    dxdpFecha = formatDate( dxdpFecha )
    dxtpHora = formatTime( dxtpHora )

    var queryString = window.location.search.substring(1);
    var parametros = queryString.split("&");
    var par = parametros[0].split("=");
    //var ls_accion =par[1]

    if (ls_accion =="agregar" )
    {
      ls_parametros=ls_accion +","+dxcmbSede+","+dxdpFecha+","+dxtpHora+","+dxcmbTipoRegistro +","+dxcmbProcedencia +","
      +dxcmbProveedor+","+dxtxtGuiaRemision+","+dxtxtGuiaTransportista+","+dxtxtPlaca+","+dxtxtTotalPaquetes+","
      +dxtxtContenedor+","+dxtxtPrecinto+","+dxcmbOrdenCompra+","+dxcmbDescripcionMaterial+","+dxcmbCodigoMaterial+","
      +dxcmbParedes+","+dxcmbTecho+","+dxcmbPuerta+","+dxcmbPlataforma+","+dxtxtCondicionTransporte+","+dxcmbTipoMaterial+","
      +dxcmbDocumentacion+","+dxtxtDocumentos+","+dxtxtObservacion+","+dxtxtCantidadMuestra+","+dxcmbObservacionMuestra+","
      +dxcmbCaracteristica+","+dxtxtAncho+","+dxtxtDetalleAncho+","+dxtxtUnidadesAncho+","+dxtxtPorcentajeAncho+","+dxtxtLargo+","
      +dxtxtDetalleLargo+","+dxtxtUnidadesLargo+","+dxtxtPorcentajeLargo+","+dxtxtEspesor+","+dxtxtDetalleEspesor+","+dxtxtUnidadesEspesor+","
      +dxtxtPorcentajeEspesor+","+dxtxtPeso+","+dxtxtDetallePeso+","+dxtxtUnidadesPeso+","+dxtxtPorcentajePeso+","+dxtxtHumedad+","
      +dxtxtDetalleHumedad+","+dxtxtOxidacion+","+dxtxtPorcentajeOxidacion+","+dxtxtNoRecubrimiento+","
      +dxtxtPorcentajeNoRecubrimiento+","+dxtxtColor+","+dxtxtPorcentajeColor+","+dxtxtAdhesivo+","+dxtxtPorcentajeAdhesivo+","+dxtxtNudos+","
      +dxtxtPorcentajeNudos+","+dxtxtMedula+","+dxtxtPorcentajeMedula+","+dxtxtGrietas+","+dxtxtPorcentajeGrietas+","+dxtxtArqueado+","
      +dxtxtPorcentajeArqueado+","+dxtxtDañoInsectos+","+dxtxtPorcentajeDañoInsectos+","+dxtxtAstillado+","+dxtxtPorcentajeAstillado+","+dxtxtDesnivelCorte+","
      +dxtxtPorcentajeDesnivelCorte+","+dxtxtSuperficieRaspada+","+dxtxtPorcentajeSuperficieRaspada+","+dxtxtHuecosYVacios+","
      +dxtxtPorcentajeHuecosYVacios+","+dxtxtSuperficieRugosa+","+dxtxtPorcentajeSuperficieRugosa+","+dxtxtDesprendimientoCapas+","+dxtxtPorcentajeDesprendimientoCapas+","
      +dxtxtRasgados+","+dxtxtPorcentajeRasgados+","+dxtxtPerforacion+","+dxtxtPorcentajePerforacion+","+dxtxtMalaImpresion+","+dxtxtPorcentajeMalaImpresion+","
      +dxtxtNoColor+","+dxtxtPorcentajeNoColor+","+dxtxtNoUV+","+dxtxtPorcentajeNoUV+","+dxtxtProblemasSecado+","+dxtxtPorcentajeProblemasSecado+","
      +dxtxtMarcaRodillo+","+dxtxtPorcentajeMarcaRodillo+","+dxMetalAcero+","+dxMetalAcero_Porcentaje+","+dxInsectos+","+dxInsectos_Porcentaje+","
      +dxPiedras+","+dxPiedras_Porcentaje+","+dxRamas+","+dxRamas_Porcentaje+","+dxMelaza+","+dxMelaza_Porcentaje+","+dxOxido+","+dxOxido_Porcentaje+","
      +dxPlastico+","+dxPlastico_Porcentaje+","+dxCarton+","+dxCarton_Porcentaje+","+dxVidrio+","+dxVidrio_Porcentaje+","+dxEpps+","+dxEpps_Porcentaje+","+dxPinturas+","
      +dxPinturas_Porcentaje+","+dxLubricantes+","+dxLubricantes_Porcentaje+","+dxResina+","+dxResina_Porcentaje+","+dxHongos+","+dxHongos_Porcentaje+","+dxMoho+","
      +dxMoho_Porcentaje+","+dxHecesAnimales+","+dxHecesAnimales_Porcentaje+","+dxSangre+","+dxSangre_Porcentaje+","+dxContMalIntencionada+","+dxFrutos+","
      +dxFrutos_Porcentaje+","+dxHuevos+","+dxHuevos_Porcentaje+","+dxVegetales+","+dxVegetales_Porcentaje+","+dxProductosAzucarados+","+dxProductosAzucarados_Porcentaje+","
      +dxSalsas+","+dxSalsas_Porcentaje+","+dxtxtTotalObservaciones+","+dxtxtPorcentajeTotalObservaciones;
    }
    else
    {
      var par1 = parametros[1].split("=");

    }
    console.log("par1",ls_parametros)

    $.ajax({ 
      url: 'datos.php',
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
   
      $("#tpHora").dxDateBox("instance").option("value",now);    
      // idxtpHora.focus()
      // $("#tpHora").dxDateBox("instance").option("value",ldt_Hora);
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
              title: "Tipo de Material",
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

  // HORA
  $(document).ready(function() {
    $("#tpHora").dxDateBox({
      value: new Date(),
      type: "time",
      displayFormat: "HH:mm"
    });
  });
 
  // COMBO TipoRegistro
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbTipoRegistro' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbTipoRegistro=$('#cmbTipoRegistro').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'TipoRegistro',
        valueExpr: 'IdTipoRegistro',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTipoRegistro:', textStatus, errorThrown);
    }, 
  }),

  //COMBO PROCEDENCIA CON PROVEEDOR
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbProcedencia' },
    dataType: 'json',
    success(data) {
        
        console.log(data)

        idxcmbProcedencia=$('#cmbProcedencia').dxSelectBox({ 
        dataSource: data,
        displayExpr: 'Procedencia',
        valueExpr: 'IdProcedencia',

          onValueChanged(val) {

            if ( val.value == 2  ){
              idxtxtContenedor.option("disabled", false);
              idxtxtPrecinto.option("disabled", false);          
            }
              else{
                idxtxtContenedor.option("disabled", true);
                idxtxtPrecinto.option("disabled", true);         
            }         

            console.log("item",val);         

            $.ajax({ 
              url: 'datos.php',
              type: 'GET',
              data: { action: 'cmbProveedor' ,parametros: val.value},
              dataType: 'json',
              success(data) {
                  
                  console.log("proveedor",data);
      
                  idxcmbProveedor=$('#cmbProveedor').dxSelectBox({ 
                  dataSource: data,
                  displayExpr: 'Proveedor',
                  valueExpr: 'IdProveedor',
                  value: is_cmbProveedor_pordefecto,
                }).dxSelectBox("instance");
              },
              error() {             
                      console.error('Error cmbProveedor:', textStatus, errorThrown);
              }, 
            }); 
            
 
          },
        }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbProcedencia:', textStatus, errorThrown);
    }, 
  }),
  
  idxcmbProveedor =$('#cmbProveedor').dxSelectBox({  
  }).dxSelectBox("instance"),

  // TEXTBOX GUIA REMISION
  $('#txtGuiaRemision').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }),

  // TEXTBOX GUIA TRANSPORTISTA
  $('#txtGuiaTransportista').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }),

  // TEXTBOX PLACA
  $('#txtPlaca').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }),

  // TEXTBOX TOTAL PAQUETES
  $('#txtTotalPaquetes').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }),

  // TEXTBOX CONTENEDOR
  idxtxtContenedor = $('#txtContenedor').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }).dxTextBox("instance");
  idxtxtContenedor.option("disabled", true);

  // TEXTBOX PRECINTO
  idxtxtPrecinto = $('#txtPrecinto').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }).dxTextBox("instance");
  idxtxtPrecinto.option("disabled", true);

  // COMBO ORDENCOMPRA
  idxcmbOrdenCompra = $('#cmbOrdenCompra').dxSelectBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }).dxSelectBox("instance");

  //  // COMBO ORDEN COMPRA
  //  $.ajax({ 
  //   url: 'datos.php',
  //   type: 'GET',
  //   data: { action: 'cmbOrdenCompra' },
  //   dataType: 'json',
  //   success(data) {
      
  //       console.log(data)

  //       idxcmbOrdenCompra=$('#cmbOrdenCompra').dxSelectBox({          
  //       dataSource: data,
  //       displayExpr: 'OC',
  //       valueExpr: 'IdEstatusCompras',
  //     }).dxSelectBox("instance");
  //   },
  //   error() {             
  //           console.error('Error cmbOrdenCompra:', textStatus, errorThrown);
  //   }, 
  // }),

  // COMBO DESCRIPCION MATERIAL
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbDescripcionMaterial' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbDescripcionMaterial=$('#cmbDescripcionMaterial').dxSelectBox({          
        dataSource: data,
        displayExpr: 'DescripcionMaterial',
        valueExpr: 'IdEstatusCompras',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbDescripcionMaterial:', textStatus, errorThrown);
    }, 
  }),

  //  // COMBO CODIGO MATERIAL
  //  $.ajax({ 
  //   url: 'datos.php',
  //   type: 'GET',
  //   data: { action: 'cmbCodigoMaterial' },
  //   dataType: 'json',
  //   success(data) {
      
  //       console.log(data)

  //       idxcmbCodigoMaterial=$('#cmbCodigoMaterial').dxSelectBox({          
  //       dataSource: data,
  //       displayExpr: 'CodigoMaterial',
  //       valueExpr: 'IdEstatusCompras',
  //     }).dxSelectBox("instance");
  //   },
  //   error() {             
  //           console.error('Error cmbCodigoMaterial:', textStatus, errorThrown);
  //   }, 
  // }),

    // COMBO CODIGO MATERIAL
    idxcmbCodigoMaterial = $('#cmbCodigoMaterial').dxSelectBox({
      //value:'Jeimmy Parra',
      inputAttr: {'aria-label': 'Name'},
      // success: function(d){
      //   $("#txtGuiaRemision").val(d);
      // }
    }).dxSelectBox("instance");

  // COMBO PAREDES
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbParedes' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbParedes=$('#cmbParedes').dxSelectBox({          
        dataSource: data,
        displayExpr: 'RevTrans_Paredes',
        valueExpr: 'IdRevTrans_Paredes',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbParedes:', textStatus, errorThrown);
    }, 
  }),

  // COMBO TECHO
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbTecho' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbTecho=$('#cmbTecho').dxSelectBox({          
        dataSource: data,
        displayExpr: 'RevTrans_Techo',
        valueExpr: 'IdRevTrans_Techo',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTecho:', textStatus, errorThrown);
    }, 
  }),

  // COMBO PUERTA
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbPuerta' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbPuertas=$('#cmbPuerta').dxSelectBox({          
        dataSource: data,
        displayExpr: 'RevTrans_Puerta',
        valueExpr: 'IdRevTrans_Puerta',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbPuerta:', textStatus, errorThrown);
    }, 
  }),

  // COMBO PLATAFORMA
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbPlataforma' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbPlataforma=$('#cmbPlataforma').dxSelectBox({          
        dataSource: data,
        displayExpr: 'RevTrans_Plataforma',
        valueExpr: 'IdRevTrans_Plataforma',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbPlataforma:', textStatus, errorThrown);
    }, 
  }),

  // TEXTBOX CONDICION DE TRANSPORTE
  $('#txtCondicionTransporte').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtGuiaRemision").val(d);
    // }
  }),

  // COMBO TIPO MATERIAL
  $.ajax({ 
    url: 'datos.php',
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

          console.log("item",$("#cmbProcedencia").dxSelectBox("instance").option("value"));
           
           var proc=$("#cmbProcedencia").dxSelectBox("instance").option("value")

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


          // MOSTRAR/OCULTAR DOCUMENTOS POR TIPO MATERIAL Y PROCEDENCIA
          if (val.value==1 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "block";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "block";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block";           
          }
          else if(val.value==2 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "block";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "block";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block";
          } 
          else if(val.value==3 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "block";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          }     
          else if(val.value==4 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          }     
          else if(val.value==5 && proc==1){
            document.getElementById("div_chk1").style.display = "none";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "none";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "none";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "none"; 
          }    
          else if(val.value==6 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          }   
          else if(val.value==7 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "block";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "block";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          } 
          else if(val.value==8 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "block"; 
            document.getElementById("div_chk9").style.display = "block";   
            document.getElementById("div_chk10").style.display = "block";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          }  
          else if(val.value==9 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "block"; 
            document.getElementById("div_chk9").style.display = "block";   
            document.getElementById("div_chk10").style.display = "block";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          }     
          else if(val.value==10 && proc==1){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "block";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          }  
          else if(val.value==1 && proc==2){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "block";   
            document.getElementById("div_chk6").style.display = "block";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "block";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          }     
          else if(val.value==2 && proc==2){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "block";   
            document.getElementById("div_chk6").style.display = "block";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "block";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block";
          }    
          else if(val.value==3 && proc==2){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "block";   
            document.getElementById("div_chk6").style.display = "block";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "block";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block";
          }   
          else if(val.value==4 && proc==2){
            document.getElementById("div_chk1").style.display = "none";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "none";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "none";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "none";
          } 
          else if(val.value==5 && proc==2){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "block";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "block";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "none";
          } 
          else if(val.value==6 && proc==2){
            document.getElementById("div_chk1").style.display = "block";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "block";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "block";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "block"; 
          } 
          else if(val.value==7 && proc==2){
            document.getElementById("div_chk1").style.display = "none";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "none";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "none";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "none";
          }    
          else if(val.value==8 && proc==2){
            document.getElementById("div_chk1").style.display = "none";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "none";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "none";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "none";
          }
          else if(val.value==9 && proc==2){
            document.getElementById("div_chk1").style.display = "none";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "none";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "none";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "none";
          } 
          else if(val.value==10 && proc==2){
            document.getElementById("div_chk1").style.display = "none";
            document.getElementById("div_chk2").style.display = "none";   
            document.getElementById("div_chk3").style.display = "none";   
            document.getElementById("div_chk4").style.display = "none";   
            document.getElementById("div_chk5").style.display = "none";   
            document.getElementById("div_chk6").style.display = "none";   
            document.getElementById("div_chk7").style.display = "none";   
            document.getElementById("div_chk8").style.display = "none"; 
            document.getElementById("div_chk9").style.display = "none";   
            document.getElementById("div_chk10").style.display = "none";   
            document.getElementById("div_chk11").style.display = "none";   
            document.getElementById("div_chk12").style.display = "none";   
            document.getElementById("div_chk13").style.display = "none";   
            document.getElementById("div_chk14").style.display = "none";   
            document.getElementById("div_chk15").style.display = "none";    
            document.getElementById("div_chk16").style.display = "none";
          }                     
        },
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbTipoMaterial:', textStatus, errorThrown);
    }, 
  })

  // COMBO DOCUMENTACION
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbDocumentacion' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbDocumentacion=$('#cmbDocumentacion').dxSelectBox({          
        dataSource: data,
        displayExpr: 'Documentacion',
        valueExpr: 'IdDocumentacion',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbDocumentacion:', textStatus, errorThrown);
    }, 
  })

   // TEXTBOX DOCUMENTOS
   idxtxtDocumentos = $('#txtDocumentos').dxTextBox({
    //value:'Jeimmy Parra',
    inputAttr: {'aria-label': 'Name'},
    // success: function(d){
    //   $("#txtDocumentos").val(d);
    // }
  }).dxTextBox("instance");
  // idxtxtDocumentos.option("disabled", true);

  // ocultar
  $("#txtDocumentos").css("display", "none");

    // TEXTBOX OBSERVACION
    idxtxtObservacion = $('#txtObservacion').dxTextBox({
      //value:'Jeimmy Parra',
      inputAttr: {'aria-label': 'Name'},
      // success: function(d){
      //   $("#txtObservacion").val(d);
      // }
    }).dxTextBox("instance");

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
        idxtxtPorcentajeEspesor=$('#txtPorcentajeEspesor').dxTextBox({
        value:roundToDecimals((idxtxtEspesor.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajePeso=$('#txtPorcentajePeso').dxTextBox({
        value:roundToDecimals((idxtxtPeso.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeOxidacion=$('#txtPorcentajeOxidacion').dxTextBox({
        value:roundToDecimals((idxtxtOxidacion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeNoRecubrimiento=$('#txtPorcentajeNoRecubrimiento').dxTextBox({
        value:roundToDecimals((idxtxtNoRecubrimiento.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeColor=$('#txtPorcentajeColor').dxTextBox({
        value:roundToDecimals((idxtxtColor.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeAdhesivo=$('#txtPorcentajeAdhesivo').dxTextBox({
        value:roundToDecimals((idxtxtAdhesivo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeNudos=$('#txtPorcentajeNudos').dxTextBox({
        value:roundToDecimals((idxtxtNudos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeMedula=$('#txtPorcentajeMedula').dxTextBox({
        value:roundToDecimals((idxtxtMedula.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeGrietas=$('#txtPorcentajeGrietas').dxTextBox({
        value:roundToDecimals((idxtxtGrietas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeArqueado=$('#txtPorcentajeArqueado').dxTextBox({
        value:roundToDecimals((idxtxtArqueado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeDañoInsectos=$('#txtPorcentajeDañoInsectos').dxTextBox({
        value:roundToDecimals((idxtxtDañoInsectos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeAstillado=$('#txtPorcentajeAstillado').dxTextBox({
        value:roundToDecimals((idxtxtAstillado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeDesnivelCorte=$('#txtPorcentajeDesnivelCorte').dxTextBox({
        value:roundToDecimals((idxtxtDesnivelCorte.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeSuperficieRaspada=$('#txtPorcentajeSuperficieRaspada').dxTextBox({
        value:roundToDecimals((idxtxtSuperficieRaspada.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeHuecosYVacios=$('#txtPorcentajeHuecosYVacios').dxTextBox({
        value:roundToDecimals((idxtxtHuecosYVacios.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeSuperficieRugosa=$('#txtPorcentajeSuperficieRugosa').dxTextBox({
        value:roundToDecimals((idxtxtSuperficieRugosa.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeDesprendimientoCapas=$('#txtPorcentajeDesprendimientoCapas').dxTextBox({
        value:roundToDecimals((idxtxtDesprendimientoCapas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeRasgados=$('#txtPorcentajeRasgados').dxTextBox({
        value:roundToDecimals((idxtxtRasgados.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajePerforacion=$('#txtPorcentajePerforacion').dxTextBox({
        value:roundToDecimals((idxtxtPerforacion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeMalaImpresion=$('#txtPorcentajeMalaImpresion').dxTextBox({
        value:roundToDecimals((idxtxtMalaImpresion.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeNoColor=$('#txtPorcentajeNoColor').dxTextBox({
        value:roundToDecimals((idxtxtNoColor.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeNoUV=$('#txtPorcentajeNoUV').dxTextBox({
        value:roundToDecimals((idxtxtNoUV.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeProblemasSecado=$('#txtPorcentajeProblemasSecado').dxTextBox({
        value:roundToDecimals((idxtxtProblemasSecado.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxtxtPorcentajeMarcaRodillo=$('#txtPorcentajeMarcaRodillo').dxTextBox({
        value:roundToDecimals((idxtxtMarcaRodillo.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxMetalAcero_Porcentaje=$('#MetalAcero_Porcentaje').dxTextBox({
        value:roundToDecimals((idxMetalAcero.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxInsectos_Porcentaje=$('#Insectos_Porcentaje').dxTextBox({
        value:roundToDecimals(( idxInsectos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPiedras_Porcentaje=$('#Piedras_Porcentaje').dxTextBox({
        value:roundToDecimals((idxPiedras.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxRamas_Porcentaje=$('#Ramas_Porcentaje').dxTextBox({
        value:roundToDecimals((idxRamas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxMelaza_Porcentaje=$('#Melaza_Porcentaje').dxTextBox({
        value:roundToDecimals((idxMelaza.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxOxido_Porcentaje=$('#Oxido_Porcentaje').dxTextBox({
        value:roundToDecimals((idxOxido.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPlastico_Porcentaje=$('#Plastico_Porcentaje').dxTextBox({
        value:roundToDecimals((idxPlastico.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxCarton_Porcentaje=$('#Carton_Porcentaje').dxTextBox({
        value:roundToDecimals((idxCarton.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxVidrio_Porcentaje=$('#Vidrio_Porcentaje').dxTextBox({
        value:roundToDecimals((idxVidrio.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxEpps_Porcentaje=$('#Epps_Porcentaje').dxTextBox({
        value:roundToDecimals((idxEpps.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxPinturas_Porcentaje=$('#Pinturas_Porcentaje').dxTextBox({
        value:roundToDecimals(( idxPinturas.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxLubricantes_Porcentaje=$('#Lubricantes_Porcentaje').dxTextBox({
        value:roundToDecimals((idxLubricantes.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxResina_Porcentaje=$('#Resina_Porcentaje').dxTextBox({
        value:roundToDecimals((idxResina.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxHongos_Porcentaje=$('#Hongos_Porcentaje').dxTextBox({
        value:roundToDecimals((idxHongos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxMoho_Porcentaje=$('#Moho_Porcentaje').dxTextBox({
        value:roundToDecimals((idxMoho.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxHecesAnimales_Porcentaje=$('#HecesAnimales_Porcentaje').dxTextBox({
        value:roundToDecimals((idxHecesAnimales.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxSangre_Porcentaje=$('#Sangre_Porcentaje').dxTextBox({
        value:roundToDecimals((idxSangre.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxFrutos_Porcentaje=$('#Frutos_Porcentaje').dxTextBox({
        value:roundToDecimals((idxFrutos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxHuevos_Porcentaje=$('#Huevos_Porcentaje').dxTextBox({
        value:roundToDecimals((idxHuevos.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxVegetales_Porcentaje=$('#Vegetales_Porcentaje').dxTextBox({
        value:roundToDecimals((idxVegetales.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxProductosAzucarados_Porcentaje=$('#ProductosAzucarados_Porcentaje').dxTextBox({
        value:roundToDecimals((idxProductosAzucarados.option("value")/ val.value  )*100,2)  + '%' ,
        })
        idxSalsas_Porcentaje=$('#Salsas_Porcentaje').dxTextBox({
        value:roundToDecimals((idxSalsas.option("value")/ val.value  )*100,2)  + '%' ,
        })

        idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
          value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
          + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
          + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
          + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
          + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
          + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
          + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
          + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
          + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")+ idxEpps.option("value")
          + idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")+ idxHongos.option("value")
          + idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxFrutos.option("value")+ idxHuevos.option("value")
          + idxVegetales.option("value")+ idxProductosAzucarados.option("value")+ idxSalsas.option("value")) ,
        })
        idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
          value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
          + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
          + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
          + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
          + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
          + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
          + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
          + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
          + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
          + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")+ idxEpps.option("value")
          + idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")+ idxHongos.option("value")
          + idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")+ idxFrutos.option("value")+ idxHuevos.option("value")
          + idxVegetales.option("value")+ idxProductosAzucarados.option("value")+ idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
        })
      }

  }).dxNumberBox("instance");

  function roundToDecimals(num, decimals) {
    let factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
  // COMBO OBSERVACION
  $.ajax({ 
    url: 'datos.php',
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
            idxtxtEspesor.option("disabled", false);
            idxtxtPeso.option("disabled", false);
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
              idxtxtEspesor.option("disabled", true);
              idxtxtPeso.option("disabled", true);
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

    // COMBO DOCUMENTACION
  $.ajax({ 
    url: 'datos.php',
    type: 'GET',
    data: { action: 'cmbCaracteristica' },
    dataType: 'json',
    success(data) {
      
        console.log(data)

        idxcmbCaracteristica=$('#cmbCaracteristica').dxSelectBox({          
        dataSource: data,
        displayExpr: 'Caracteristica',
        valueExpr: 'IdCaracteristica',
      }).dxSelectBox("instance");
    },
    error() {             
            console.error('Error cmbCaracteristica:', textStatus, errorThrown);
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
        value:Number(val.value + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((val.value + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
        value:Number(idxtxtAncho.option("value") + val.value + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + val.value + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") +val.value + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + val.value + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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

   // TEXTBOX PESO CON PORCENTAJE PESO
   idxtxtPeso= $('#txtPeso').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
   // disabled:true,
    onValueChanged(val){
      // idxtxtDetallePeso=$('#txtDetallePeso').dxTextBox({
      // })
      // idxtxtUnidadesPeso=$('#txtUnidadesPeso').dxTextBox({
      //   value: 'kg',      
      // })
      idxtxtPorcentajePeso=$('#txtPorcentajePeso').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + val.value 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + val.value 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtPeso.option("disabled", true);

   // TEXTBOX DETALLE Peso
   idxtxtDetallePeso= $('#txtDetallePeso').dxTextBox({
    //value: 15,
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })
  
    // TEXTBOX UNIDADES Peso
    idxtxtUnidadesPeso= $('#txtUnidadesPeso').dxTextBox({
    value: 'kg',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })
  
    // TEXTBOX PORCENTAJE Peso
    idxtxtPorcentajePeso= $('#txtPorcentajePeso').dxTextBox({
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + val.value + idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + val.value+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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


  // TEXTBOX OXIDACION CON PORCENTAJE OXIDACION
  idxtxtOxidacion= $('#txtOxidacion').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeOxidacion=$('#txtPorcentajeOxidacion').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ val.value+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ val.value+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtOxidacion.option("disabled", true);
  
    // TEXTBOX PORCENTAJE Oxidacion
    idxtxtPorcentajeOxidacion= $('#txtPorcentajeOxidacion').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX NO RECUBRIMIENTO CON PORCENTAJE NO RECUBRIMIENTO
    idxtxtNoRecubrimiento= $('#txtNoRecubrimiento').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxtxtPorcentajeNoRecubrimiento=$('#txtPorcentajeNoRecubrimiento').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ val.value+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ val.value+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtNoRecubrimiento.option("disabled", true);

  // TEXTBOX PORCENTAJE NO RECUBRIMIENTO
  idxtxtPorcentajeNoRecubrimiento= $('#txtPorcentajeNoRecubrimiento').dxTextBox({
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ val.value
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ val.value
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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

   // TEXTBOX Adhesivo CON PORCENTAJE Adhesivo
   idxtxtAdhesivo= $('#txtAdhesivo').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeAdhesivo=$('#txtPorcentajeAdhesivo').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + val.value+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + val.value+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtAdhesivo.option("disabled", true);

   // TEXTBOX PORCENTAJE Adhesivo
   idxtxtPorcentajeAdhesivo= $('#txtPorcentajeAdhesivo').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX Nudos CON PORCENTAJE Nudos
   idxtxtNudos= $('#txtNudos').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeNudos=$('#txtPorcentajeNudos').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ val.value+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ val.value+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtNudos.option("disabled", true);

   // TEXTBOX PORCENTAJE Nudos
   idxtxtPorcentajeNudos= $('#txtPorcentajeNudos').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX Medula CON PORCENTAJE Medula
   idxtxtMedula= $('#txtMedula').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeMedula=$('#txtPorcentajeMedula').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ val.value+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ val.value+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtMedula.option("disabled", true);

   // TEXTBOX PORCENTAJE Medula
   idxtxtPorcentajeMedula= $('#txtPorcentajeMedula').dxTextBox({
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ val.value
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ val.value
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + val.value+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + val.value+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtArqueado.option("disabled", true);

   // TEXTBOX PORCENTAJE arqueado
   idxtxtPorcentajeArqueado= $('#txtPorcentajeArqueado').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX DañoInsectos CON PORCENTAJE DañoInsectos
   idxtxtDañoInsectos= $('#txtDañoInsectos').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeDañoInsectos=$('#txtPorcentajeDañoInsectos').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ val.value+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ val.value+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtDañoInsectos.option("disabled", true);

   // TEXTBOX PORCENTAJE DañoInsectos
   idxtxtPorcentajeDañoInsectos= $('#txtPorcentajeDañoInsectos').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX Astillado CON PORCENTAJE Astillado
   idxtxtAstillado= $('#txtAstillado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeAstillado=$('#txtPorcentajeAstillado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value"))*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ val.value
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ val.value
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtAstillado.option("disabled", true);

   // TEXTBOX PORCENTAJE Astillado
   idxtxtPorcentajeAstillado= $('#txtPorcentajeAstillado').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX DesnivelCorte CON PORCENTAJE DesnivelCorte
   idxtxtDesnivelCorte= $('#txtDesnivelCorte').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeDesnivelCorte=$('#txtPorcentajeDesnivelCorte').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + val.value+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + val.value+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtDesnivelCorte.option("disabled", true);

   // TEXTBOX PORCENTAJE Oxidacion
   idxtxtPorcentajeDesnivelCorte= $('#txtPorcentajeDesnivelCorte').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX SuperficieRaspada CON PORCENTAJE SuperficieRaspada
   idxtxtSuperficieRaspada= $('#txtSuperficieRaspada').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeSuperficieRaspada=$('#txtPorcentajeSuperficieRaspada').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ val.value + idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ val.value+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtSuperficieRaspada.option("disabled", true);

   // TEXTBOX PORCENTAJE SuperficieRaspada
   idxtxtPorcentajeSuperficieRaspada= $('#txtPorcentajeSuperficieRaspada').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX HuecosYVacios CON PORCENTAJE HuecosYVacios
   idxtxtHuecosYVacios= $('#txtHuecosYVacios').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeHuecosYVacios=$('#txtPorcentajeHuecosYVacios').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ val.value
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ val.value
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtHuecosYVacios.option("disabled", true);

   // TEXTBOX PORCENTAJE HuecosYVacios
   idxtxtPorcentajeHuecosYVacios= $('#txtPorcentajeHuecosYVacios').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX SuperficieRugosa CON PORCENTAJE SuperficieRugosa
   idxtxtSuperficieRugosa= $('#txtSuperficieRugosa').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeSuperficieRugosa=$('#txtPorcentajeSuperficieRugosa').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + val.value+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + val.value+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtSuperficieRugosa.option("disabled", true);

   // TEXTBOX PORCENTAJE SuperficieRugosa
   idxtxtPorcentajeSuperficieRugosa= $('#txtPorcentajeSuperficieRugosa').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX DesprendimientoCapas CON PORCENTAJE DesprendimientoCapas
   idxtxtDesprendimientoCapas= $('#txtDesprendimientoCapas').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeDesprendimientoCapas=$('#txtPorcentajeDesprendimientoCapas').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ val.value+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ val.value+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtDesprendimientoCapas.option("disabled", true);

   // TEXTBOX PORCENTAJE DesprendimientoCapas
   idxtxtPorcentajeDesprendimientoCapas= $('#txtPorcentajeDesprendimientoCapas').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX Rasgados CON PORCENTAJE Rasgados
   idxtxtRasgados= $('#txtRasgados').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeRasgados=$('#txtPorcentajeRasgados').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ val.value
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ val.value
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtRasgados.option("disabled", true);

   // TEXTBOX PORCENTAJE Rasgados
   idxtxtPorcentajeRasgados= $('#txtPorcentajeRasgados').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX Perforacion CON PORCENTAJE Perforacion
   idxtxtPerforacion= $('#txtPerforacion').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajePerforacion=$('#txtPorcentajePerforacion').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + val.value+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + val.value+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtPerforacion.option("disabled", true);

   // TEXTBOX PORCENTAJE Perforacion
   idxtxtPorcentajePerforacion= $('#txtPorcentajePerforacion').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX MalaImpresion CON PORCENTAJE MalaImpresion
   idxtxtMalaImpresion= $('#txtMalaImpresion').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeMalaImpresion=$('#txtPorcentajeMalaImpresion').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ val.value+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ val.value+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtMalaImpresion.option("disabled", true);

   // TEXTBOX PORCENTAJE MalaImpresion
   idxtxtPorcentajeMalaImpresion= $('#txtPorcentajeMalaImpresion').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX NoColor CON PORCENTAJE NoColor
   idxtxtNoColor= $('#txtNoColor').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeNoColor=$('#txtPorcentajeNoColor').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ val.value+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ val.value+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtNoColor.option("disabled", true);

   // TEXTBOX PORCENTAJE NoColor
   idxtxtPorcentajeNoColor= $('#txtPorcentajeNoColor').dxTextBox({
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
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ val.value
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ val.value
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
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

   // TEXTBOX ProblemasSecado CON PORCENTAJE ProblemasSecado
   idxtxtProblemasSecado= $('#txtProblemasSecado').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeProblemasSecado=$('#txtPorcentajeProblemasSecado').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + val.value+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + val.value+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtProblemasSecado.option("disabled", true);

   // TEXTBOX PORCENTAJE ProblemasSecado
   idxtxtPorcentajeProblemasSecado= $('#txtPorcentajeProblemasSecado').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX MarcaRodillo CON PORCENTAJE MarcaRodillo
   idxtxtMarcaRodillo= $('#txtMarcaRodillo').dxNumberBox({
    //value: 15,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },   
    onValueChanged(val){
      idxtxtPorcentajeMarcaRodillo=$('#txtPorcentajeMarcaRodillo').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ val.value+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ val.value+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");
  idxtxtMarcaRodillo.option("disabled", true);

   // TEXTBOX PORCENTAJE MarcaRodillo
   idxtxtPorcentajeMarcaRodillo= $('#txtPorcentajeMarcaRodillo').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })


   // TEXTBOX muestreo_txt1
   idxMetalAcero= $('#MetalAcero').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxMetalAcero_Porcentaje=$('#MetalAcero_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ val.value
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ val.value
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt1_porcentaje
   idxMetalAcero_Porcentaje= $('#MetalAcero_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_TXT2
  idxInsectos= $('#Insectos').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxInsectos_Porcentaje=$('#Insectos_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + val.value+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + val.value+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt2_porcentaje
   idxInsectos_Porcentaje= $('#Insectos_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt3
  idxPiedras= $('#Piedras').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxPiedras_Porcentaje=$('#Piedras_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ val.value+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ val.value+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt3_porcentaje
   idxPiedras_Porcentaje= $('#Piedras_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt4
  idxRamas= $('#Ramas').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxRamas_Porcentaje=$('#Ramas_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ val.value+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ val.value+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt4_porcentaje
   idxRamas_Porcentaje= $('#Ramas_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX muestreo_txt5
  idxMelaza= $('#Melaza').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxMelaza_Porcentaje=$('#Melaza_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ val.value
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ val.value
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt5_porcentaje
   idxMelaza_Porcentaje= $('#Melaza_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt5
  idxOxido= $('#Oxido').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxOxido_Porcentaje=$('#Oxido_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + val.value+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + val.value+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt5_porcentaje
   idxOxido_Porcentaje= $('#Oxido_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

     // TEXTBOX muestreo_txt6
    idxPlastico= $('#Plastico').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxPlastico_Porcentaje=$('#Plastico_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ val.value+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ val.value+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt6_porcentaje
   idxPlastico_Porcentaje= $('#Plastico_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

     // TEXTBOX muestreo_txt6
  idxCarton= $('#Carton').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxCarton_Porcentaje=$('#Carton_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ val.value+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ val.value+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt6_porcentaje
   idxCarton_Porcentaje= $('#Carton_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

     // TEXTBOX muestreo_txt6
  idxVidrio= $('#Vidrio').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxVidrio_Porcentaje=$('#Vidrio_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ val.value
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ val.value
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt6_porcentaje
   idxVidrio_Porcentaje= $('#Vidrio_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt6
  idxEpps= $('#Epps').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxEpps_Porcentaje=$('#Epps_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + val.value+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + val.value+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt6_porcentaje
   idxEpps_Porcentaje= $('#Epps_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt7
  idxPinturas= $('#Pinturas').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxPinturas_Porcentaje=$('#Pinturas_Porcentaje').dxTextBox({
      value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ val.value+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ val.value+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt7_porcentaje
   idxPinturas_Porcentaje= $('#Pinturas_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt8
  idxLubricantes= $('#Lubricantes').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxLubricantes_Porcentaje=$('#Lubricantes_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ val.value+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ val.value+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt8_porcentaje
   idxLubricantes_Porcentaje= $('#Lubricantes_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt9
  idxResina= $('#Resina').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxResina_Porcentaje=$('#Resina_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ val.value
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ val.value
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt9_porcentaje
   idxResina_Porcentaje= $('#Resina_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt10
  idxHongos= $('#Hongos').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxHongos_Porcentaje=$('#Hongos_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + val.value+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + val.value+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })   
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt10_porcentaje
   idxHongos_Porcentaje= $('#Hongos_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt11
  idxMoho= $('#Moho').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxMoho_Porcentaje=$('#Moho_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ val.value+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ val.value+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })   
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt11_porcentaje
   idxMoho_Porcentaje= $('#Moho_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  // TEXTBOX muestreo_txt12
  idxHecesAnimales= $('#HecesAnimales').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxHecesAnimales_Porcentaje=$('#HecesAnimales_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ val.value+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ val.value+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt12_porcentaje
   idxHecesAnimales_Porcentaje= $('#HecesAnimales_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

  idxmuestreo_rdb1=$('#muestreo_rdb1').prop('checked', true)

  // TEXTBOX muestreo_txt13
  idxSangre= $('#Sangre').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxSangre_Porcentaje=$('#Sangre_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ val.value
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ val.value
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt13_porcentaje
   idxSangre_Porcentaje= $('#Sangre_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

       // TEXTBOX muestreo_txt14
  idxContMalIntencionada= $('#ContMalIntencionada').dxTextBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
    }
  }).dxTextBox("instance");
  // idxmuestreo_txt14.option("disabled", true);

  // TEXTBOX muestreo_txt15
  idxFrutos= $('#Frutos').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxFrutos_Porcentaje=$('#Frutos_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + val.value+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + val.value+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })  
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt15_porcentaje
   idxFrutos_Porcentaje= $('#Frutos_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

      // TEXTBOX muestreo_txt16
  idxHuevos= $('#Huevos').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxHuevos_Porcentaje=$('#Huevos_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ val.value+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ val.value+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      })   
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt16_porcentaje
   idxHuevos_Porcentaje= $('#Huevos_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX muestreo_txt17
   idxVegetales= $('#Vegetales').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxVegetales_Porcentaje=$('#Vegetales_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ val.value+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ val.value+ idxProductosAzucarados.option("value")
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt17_porcentaje
   idxVegetales_Porcentaje= $('#Vegetales_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

   // TEXTBOX muestreo_txt18
   idxProductosAzucarados= $('#ProductosAzucarados').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxProductosAzucarados_Porcentaje=$('#ProductosAzucarados_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ val.value
        + idxSalsas.option("value")) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ val.value
        + idxSalsas.option("value")) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt18_porcentaje
   idxProductosAzucarados_Porcentaje= $('#ProductosAzucarados_Porcentaje').dxTextBox({
    // value: 'mm',
    min: 0,
    max: 100,
    inputAttr: { 'aria-label': 'Min y Max' },
    })

    // TEXTBOX muestreo_txt19
   idxSalsas= $('#Salsas').dxNumberBox({
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min y Max' },
    onValueChanged(val){
      idxSalsas_Porcentaje=$('#Salsas_Porcentaje').dxTextBox({
        value:roundToDecimals((val.value/ idxtxtCantidadMuestra.option("value")  )*100,2)  + '%' ,
      })
      idxtxtTotalObservaciones=$('#txtTotalObservaciones').dxTextBox({
        value:Number(idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + val.value) ,
      })
      idxtxtPorcentajeTotalObservaciones=$('#txtPorcentajeTotalObservaciones').dxTextBox({
        value:roundToDecimals(((idxtxtAncho.option("value") + idxtxtLargo.option("value") + idxtxtEspesor.option("value") + idxtxtPeso.option("value") 
        + idxtxtHumedad.option("value")+ idxtxtOxidacion.option("value")+ idxtxtNoRecubrimiento.option("value")+ idxtxtColor.option("value")
        + idxtxtAdhesivo.option("value")+ idxtxtNudos.option("value")+ idxtxtMedula.option("value")+ idxtxtGrietas.option("value")
        + idxtxtArqueado.option("value")+ idxtxtDañoInsectos.option("value")+ idxtxtAstillado.option("value")
        + idxtxtDesnivelCorte.option("value")+ idxtxtSuperficieRaspada.option("value")+ idxtxtHuecosYVacios.option("value")
        + idxtxtSuperficieRugosa.option("value")+ idxtxtDesprendimientoCapas.option("value")+ idxtxtRasgados.option("value")
        + idxtxtPerforacion.option("value")+ idxtxtMalaImpresion.option("value")+ idxtxtNoColor.option("value")+ idxtxtNoUV.option("value")
        + idxtxtProblemasSecado.option("value")+ idxtxtMarcaRodillo.option("value")+ idxMetalAcero.option("value")
        + idxInsectos.option("value")+ idxPiedras.option("value")+ idxRamas.option("value")+ idxMelaza.option("value")
        + idxOxido.option("value")+ idxPlastico.option("value")+ idxCarton.option("value")+ idxVidrio.option("value")
        + idxEpps.option("value")+ idxPinturas.option("value")+ idxLubricantes.option("value")+ idxResina.option("value")
        + idxHongos.option("value")+ idxMoho.option("value")+ idxHecesAnimales.option("value")+ idxSangre.option("value")
        + idxFrutos.option("value")+ idxHuevos.option("value")+ idxVegetales.option("value")+ idxProductosAzucarados.option("value")
        + val.value) /idxtxtCantidadMuestra.option("value"))*100,2) + '%' ,
      }) 
    }
  }).dxNumberBox("instance");

   // TEXTBOX PORCENTAJE muestreo_txt19_porcentaje
   idxSalsas_Porcentaje= $('#Salsas_Porcentaje').dxTextBox({
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
      idxtxtDocumentos.option("value",string && "" + string)
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
