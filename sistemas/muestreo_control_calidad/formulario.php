<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>

    <title>FORMULARIO</title>     
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="formulario.js"></script>
    <script>window.jQuery || document.write(decodeURIComponent('%3Cscript src="js/jquery.min.js"%3E%3C/script%3E'))</script>
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/22.2.5/css/dx.darkmoon.css" />
     <!-- <script src="https://cdn3.devexpress.com/jslib/22.2.5/js/dx.all.js"></script>  -->
     <!-- LIBRERIA PARA CHECKBOX A TEXTBOX -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="dx.all.js"></script>
 
    <link rel="stylesheet" type="text/css" href="styles.css" />
    
    <script>
        $(document).ready(function() {
            // Función para cargar las opciones en el combo box de Orden de Compra
            function loadOrdenCompra() {
                $.ajax({
                    url: 'get_data.php',
                    type: 'GET',
                    data: { action: 'getOrdenCompra' },
                    dataType: 'json',
                    success: function(data) {
                        $('#cmbOrdenCompra').dxSelectBox({
                            items: data,
                            displayExpr: 'OC',
                            valueExpr: 'OC',
                            onValueChanged: function(e) {
                                loadDescripcionMaterial(e.value);
                            }
                        });
                    }
                });
            }

            // Función para cargar las opciones en el combo box de Descripción de Material
            function loadDescripcionMaterial(ordenCompra) {
                $.ajax({
                    url: 'get_data.php',
                    type: 'GET',
                    data: { action: 'getDescripcionMaterial', ordenCompra: ordenCompra },
                    dataType: 'json',
                    success: function(data) {
                        $('#cmbDescripcionMaterial').dxSelectBox({
                            items: data,
                            displayExpr: 'DescripcionMaterial',
                            valueExpr: 'DescripcionMaterial',
                            onValueChanged: function(e) {
                                loadCodigoMaterial(e.value);
                            }
                        });
                    }
                });
            }

            // Función para cargar las opciones en el combo box de Código de Material
            function loadCodigoMaterial(descripcionMaterial) {
                $.ajax({
                    url: 'get_data.php',
                    type: 'GET',
                    data: { action: 'getCodigoMaterial', descripcionMaterial: descripcionMaterial },
                    dataType: 'json',
                    success: function(data) {
                        $('#cmbCodigoMaterial').dxSelectBox({
                            items: data,
                            displayExpr: 'CodigoMaterial',
                            valueExpr: 'CodigoMaterial'
                        });
                    }
                });
            }

            // Inicializar el combo box de Orden de Compra al cargar la página
            loadOrdenCompra();
        });
    </script>

  </head>
  <body class="dx-viewport"> 

    <!-- cabecera para el titulo -->
    <header id="main-header">		
      <p id="titulocabecera"> VERIFICACIÓN DE CONTROL DE LA CALIDAD - MP </p>
    </header>
    
    <!-- seccion botones -->
    <div class="button-container">         
      <div id="btnAceptar"></div>           
      <div id="btnRegistros"></div> 
      <div id="btnCerrarSesion"></div>      
    </div>

    <div class="demo-container">
      <br>
      <div id="tabPanel"></div>

      <div id="div_tab_01">
        <div id="form">
      
          <div class="dx-fieldset">
          <fieldset style="border: 1px solid rgb(34, 204, 175)">

              <div class="dx-field">
                <div class="dx-field-label">Sede:</div>
                <div class="dx-field-value">
                  <div id="cmbSede"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Fecha Registro:</div>
                <div class="dx-field-value">
                  <div id="dpFecha"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Hora:</div>
                <div class="dx-field-value">
                  <div id="tpHora"></div>
                </div>
              </div>
      
              <div class="dx-field">
                <div class="dx-field-label">Tipo Registro:</div>
                <div class="dx-field-value">
                  <div id="cmbTipoRegistro"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Procedencia:</div>
                <div class="dx-field-value">
                  <div id="cmbProcedencia"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Proveedor:</div>
                <div class="dx-field-value">
                  <div id="cmbProveedor"></div>
                </div>
              </div>  
         
            </fieldset>
          </div>

        </div>     
      </div>                

      <div id="div_tab_02">
        <div id="form_02">

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Documentación</legend>
  
              <div class="dx-field">
                <div class="dx-field-label">Guía Remsión:</div>
                <div class="dx-field-value">
                  <div id="txtGuiaRemision"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Guía Transportista:</div>
                <div class="dx-field-value">
                  <div id="txtGuiaTransportista"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">N° Placa:</div>
                <div class="dx-field-value">
                  <div id="txtPlaca"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Total Paquetes:</div>
                <div class="dx-field-value">
                  <div id="txtTotalPaquetes"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">N° Contenedor:</div>
                <div class="dx-field-value">
                  <div id="txtContenedor"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">N° Precinto:</div>
                <div class="dx-field-value">
                  <div id="txtPrecinto"></div>
                </div>
              </div>


                        <div class="dx-field">
                    <div class="dx-field-label">Orden de Compra:</div>
                    <div class="dx-field-value">
                        <div id="cmbOrdenCompra"></div>
                    </div>
                </div>

                <div class="dx-field">
                    <div class="dx-field-label">Descripción de Material:</div>
                    <div class="dx-field-value">
                        <div id="cmbDescripcionMaterial"></div>
                    </div>
                </div>

                <div class="dx-field">
                    <div class="dx-field-label">Código de Material:</div>
                    <div class="dx-field-value">
                        <div id="cmbCodigoMaterial"></div>
                    </div>
                </div>

            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Inspección</legend>

              <div class="dx-field">
                <div class="dx-field-label">Paredes:</div>
                <div class="dx-field-value">
                  <div id="cmbParedes"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Techo:</div>
                <div class="dx-field-value">
                  <div id="cmbTecho"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Puerta:</div>
                <div class="dx-field-value">
                  <div id="cmbPuerta"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Plataforma:</div>
                <div class="dx-field-value">
                  <div id="cmbPlataforma"></div>
                </div>
              </div>  
          
            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">

              <div class="dx-field">
                <div class="dx-field-label">Condición de Transporte:</div>
                <div class="dx-field-value">
                  <div id="txtCondicionTransporte"></div>
                </div>
              </div>
  
            </fieldset>
          </div>

        </div>
      </div>

      <div id="div_tab_03">
        <div id="form_03">

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">         

              <div class="dx-field">
                <div class="dx-field-label">Tipo de Material:</div>
                <div class="dx-field-value">
                  <div id="cmbTipoMaterial"></div>
                </div>
              </div>
              
              <div class="dx-field">
                <div class="dx-field-label">Documentación:</div>
                <div class="dx-field-value">
                  <div id="cmbDocumentacion"></div>
                </div>
              </div>

            </fieldset>
          </div> 

          <div class="dx-fieldset">
            <fieldset style="border: 2px solid rgb(34, 204, 175)">         
              <legend>Documentos</legend>
          
              <ul class="group">
                    <label><input type="checkbox" class="all" name="allg1">Seleccionar todo</label>
                    <br>
                    <br>
                    <li><div class="dx-field" id="div_chk1"><input type="checkbox" value="FICHA TECNICA">FICHA TECNICA</div></li>
                    <li><div class="dx-field" id="div_chk2"><input type="checkbox" value="HOJA DE SEGURIDAD">HOJA DE SEGURIDAD</div></li>
                    <li><div class="dx-field" id="div_chk3"><input type="checkbox" value="CERTIFICADO DE CALIDAD">CERTIFICADO DE CALIDAD</div></li>
                    <li><div class="dx-field" id="div_chk4"><input type="checkbox" value="CERTIFICADO DE ORIGEN">CERTIFICADO DE ORIGEN</div></li>
                    <li><div class="dx-field" id="div_chk5"><input type="checkbox" value="CERTIFICADO FITOSANITARIO">CERTIFICADO FITOSANITARIO</div></li>
                    <li><div class="dx-field" id="div_chk6"><input type="checkbox" value="CERTIFICADO FSC">CERTIFICADO FSC</div></li>
                    <li><div class="dx-field" id="div_chk7"><input type="checkbox" value="PACKING LIST">PACKING LIST</div></li>
                    <li><div class="dx-field" id="div_chk8"><input type="checkbox" value="CERTIFICADO DE ANALISIS DE METALES PESADOS">CERTIFICADO DE ANALISIS DE METALES PESADOS</div></li>
                    <li><div class="dx-field" id="div_chk9"><input type="checkbox" value="CERTIFICADO NO USO DE POLIMEROS CLORINADOS y NO USO DE BISPHENOL A">CERTIFICADO NO USO DE POLIMEROS CLORINADOS, NO USO DE BISPHENOL A</div></li>
                    <li><div class="dx-field" id="div_chk10"><input type="checkbox" value="CERTIFICADO DE INOCUIDAD DE LAS TINTAS">CERTIFICADO DE INOCUIDAD DE LAS TINTAS</div></li>
                    <li><div class="dx-field" id="div_chk11"><input type="checkbox" value="CERTIFICADO DE CALIBRACION">CERTIFICADO DE CALIBRACION</div></li>
                    <li><div class="dx-field" id="div_chk12"><input type="checkbox" value="CERTIFICADO DE CONTROL DE PLAGAS">CERTIFICADO DE CONTROL DE PLAGAS</div></li>
                    <li><div class="dx-field" id="div_chk13"><input type="checkbox" value="TRATAMIENTO TERMICO">TRATAMIENTO TERMICO</div></li>
                    <li><div class="dx-field" id="div_chk14"><input type="checkbox" value="CERTIFICADO MICROBIOLOGICO">CERTIFICADO MICROBIOLOGICO</div></li>
                    <li><div class="dx-field" id="div_chk15"><input type="checkbox" value="CERTIFICADO FISICOQUIMICO">CERTIFICADO FISICOQUIMICO</div></li>
                    <li><div class="dx-field" id="div_chk16"><input type="checkbox" value="CERTIFICADO GFSI">CERTIFICADO GFSI</div></li>                             
              </ul>

              <!-- <div class="dx-field">
                <div class="dx-field-label">Documentos:</div>
                <div class="dx-field-value">
                  <div><textarea id="results" rows="4" cols="45"> </textarea></div>
                </div>
              </div>                          -->
                      
              <div class="dx-field">
                <div class="dx-field-label"></div>
                <div class="dx-field-value">
                  <div id="txtDocumentos"></div>
                </div>
              </div>

            </fieldset>
          </div>         

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">         
  
              <div class="dx-field">
                <div class="dx-field-label">Observación:</div>
                <div class="dx-field-value">
                  <div id="txtObservacion"></div>
                </div>
              </div>

            </fieldset>
          </div> 
                   
        </div>
      </div>

      <div id="div_tab_04" type="text/html">
        <div id="form_04">
        
          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">

              <div class="dx-field">
                <div class="dx-field-label">Cantidad de Muestra:</div>
                <div class="dx-field-value">
                  <div id="txtCantidadMuestra"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Observación:</div>
                <div class="dx-field-value">
                  <div id="cmbObservacionMuestra"></div>
                </div>
              </div>

              <div class="dx-field" id="grupocaracteristica">
                <div class="dx-field-label">Característica:</div>
                <div class="dx-field-value">
                  <div id="cmbCaracteristica"></div>
                </div>
              </div>

            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Medición</legend>

              <div class="dx-field" id="grupo_ancho">
                <div class="dx-field-label">Ancho:</div>   
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtAncho"></div>
                      <div id="txtDetalleAncho"></div>
                      <div id="txtUnidadesAncho"></div>
                      <div id="txtPorcentajeAncho"></div>
                    </div>
                  </div>
                </div>    

              <div class="dx-field" id="grupo_largo">
                <div class="dx-field-label">Largo:</div>   
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtLargo"></div>
                      <div id="txtDetalleLargo"></div>
                      <div id="txtUnidadesLargo"></div>
                      <div id="txtPorcentajeLargo"></div>
                    </div>
                  </div>
                </div>    
          
              <div class="dx-field" id="grupo_espesor">
                <div class="dx-field-label">Espesor:</div>   
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtEspesor"></div>
                      <div id="txtDetalleEspesor"></div>
                      <div id="txtUnidadesEspesor"></div>
                      <div id="txtPorcentajeEspesor"></div>
                    </div>
                  </div>
                </div>   
                
                <div class="dx-field" id="grupo_peso">
                  <div class="dx-field-label">Peso:</div>   
                    <div class="dx-field-value">
                      <div class="button-container"> 
                        <div id="txtPeso"></div>
                        <div id="txtDetallePeso"></div>
                        <div id="txtUnidadesPeso"></div>
                        <div id="txtPorcentajePeso"></div>
                      </div>
                    </div>
                  </div>    

                  <div class="dx-field" id="grupo_humedad">
                    <div class="dx-field-label">Humedad %:</div>   
                      <div class="dx-field-value">
                        <div class="button-container"> 
                          <div id="txtHumedad"></div>
                          <div id="txtDetalleHumedad"></div>
                          <!-- <div id="txtUnidadesHumedad"></div> -->
                          <!-- <div id="txtPorcentajeHumedad"></div> -->
                        </div>
                      </div>
                    </div>    
                  
            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Defectos</legend>

              <div class="dx-field" id="grupo_oxidacion">           
                <div class="dx-field-label">Oxidación:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtOxidacion"></div>
                      <div id="txtPorcentajeOxidacion"></div>
                  </div>
                </div>
              </div>
                                      
              <div class="dx-field" id="grupo_norecubrimiento">  
                <div class="dx-field-label">No Recubrimiento:</div>   
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtNoRecubrimiento"></div>
                      <div id="txtPorcentajeNoRecubrimiento"></div>                  
                  </div>
                </div>
              </div>  

              <div class="dx-field" id="grupo_color">           
                <div class="dx-field-label">Color:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtColor"></div>
                      <div id="txtPorcentajeColor"></div>
                    </div>
                  </div>
                </div>              

              <div class="dx-field" id="grupo_adhesivo">           
                <div class="dx-field-label">Adhesivo:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtAdhesivo"></div>
                      <div id="txtPorcentajeAdhesivo"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_nudos">           
                <div class="dx-field-label">Nudos:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtNudos"></div>
                      <div id="txtPorcentajeNudos"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_medula">           
                <div class="dx-field-label">Médula:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtMedula"></div>
                      <div id="txtPorcentajeMedula"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_grietas">           
                <div class="dx-field-label">Grietas:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtGrietas"></div>
                      <div id="txtPorcentajeGrietas"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_arqueado">           
                <div class="dx-field-label">Arqueado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtArqueado"></div>
                      <div id="txtPorcentajeArqueado"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_dañoinsectos">           
                <div class="dx-field-label">Daño por Insectos:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtDañoInsectos"></div>
                      <div id="txtPorcentajeDañoInsectos"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_astillado">           
                <div class="dx-field-label">Astillado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtAstillado"></div>
                      <div id="txtPorcentajeAstillado"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_desnivelcorte">           
                <div class="dx-field-label">Desnivel de Corte(No Cuadratura):</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtDesnivelCorte"></div>
                      <div id="txtPorcentajeDesnivelCorte"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_superficieraspada">           
                <div class="dx-field-label">Superficie Raspada:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtSuperficieRaspada"></div>
                      <div id="txtPorcentajeSuperficieRaspada"></div>
                    </div>
                  </div>
                </div>             

              <div class="dx-field" id="grupo_huecosyvacios">           
                <div class="dx-field-label">Huecos y Vacíos:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtHuecosYVacios"></div>
                      <div id="txtPorcentajeHuecosYVacios"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_superficierugosa">           
                <div class="dx-field-label">Superficie Rugosa:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtSuperficieRugosa"></div>
                      <div id="txtPorcentajeSuperficieRugosa"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_desprendimientocapas">           
                <div class="dx-field-label">Desprendimiento de Capas:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtDesprendimientoCapas"></div>
                      <div id="txtPorcentajeDesprendimientoCapas"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_rasgados">           
                <div class="dx-field-label">Rasgados:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtRasgados"></div>
                      <div id="txtPorcentajeRasgados"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_perforacion">           
                <div class="dx-field-label">Perforación:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPerforacion"></div>
                      <div id="txtPorcentajePerforacion"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_malaimpresion">           
                <div class="dx-field-label">Mala Impresión:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtMalaImpresion"></div>
                      <div id="txtPorcentajeMalaImpresion"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_nocolor">           
                <div class="dx-field-label">No Color:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtNoColor"></div>
                      <div id="txtPorcentajeNoColor"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_nouv">           
                <div class="dx-field-label">No UV:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtNoUV"></div>
                      <div id="txtPorcentajeNoUV"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_problemassecado">           
                <div class="dx-field-label">Problemas de Secado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtProblemasSecado"></div>
                      <div id="txtPorcentajeProblemasSecado"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_marcarodillo">           
                <div class="dx-field-label">Marca de Rodillo:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtMarcaRodillo"></div>
                      <div id="txtPorcentajeMarcaRodillo"></div>
                    </div>
                  </div>
                </div>
     
            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Peligros</legend>

              <ul id="myUL">
                <li><span class="caret">PELIGROS FÍSICOS</span>
                  <ul class="nested">
                    <br>
                    <li><div class="button-container"><label>METAL/ACERO</label><div id="MetalAcero"></div><div id="MetalAcero_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>INSECTOS</label><div id="Insectos"></div><div id="Insectos_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>PIEDRAS</label><div id="Piedras"></div><div id="Piedras_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>RAMAS</label><div id="Ramas"></div><div id="Ramas_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>MELAZA</label><div id="Melaza"></div><div id="Melaza_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>OXIDO</label><div id="Oxido"></div><div id="Oxido_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>PLASTICO</label><div id="Plastico"></div><div id="Plastico_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>CARTON</label><div id="Carton"></div><div id="Carton_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>VIDRIO</label><div id="Vidrio"></div><div id="Vidrio_Porcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>EPPS</label><div id="Epps"></div><div id="Epps_Porcentaje"></div></div></li>   
                    <br>   
                  </ul>
                </li>
                <li><span class="caret">PELIGROS QUÍMICOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>PINTURAS</label><div id="Pinturas"></div><div id="Pinturas_Porcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>LUBRICANTES</label><div id="Lubricantes"></div><div id="Lubricantes_Porcentaje"></div></div></li> 
                    <br>   
                    <li><div class="button-container"><label>RESINA</label><div id="Resina"></div><div id="Resina_Porcentaje"></div></div></li> 
                    <br>            
                  </ul>
                </li>
                <li><span class="caret">PELIGROS MICROBIOLÓGICOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>HONGOS</label><div id="Hongos"></div><div id="Hongos_Porcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>MOHO</label><div id="Moho"></div><div id="Moho_Porcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>HECES DE ANIMALES</label><div id="HecesAnimales"></div><div id="HecesAnimales_Porcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>SANGRE</label><div id="Sangre"></div><div id="Sangre_Porcentaje"></div></div></li>
                    <br>          
                  </ul>
                </li>
                <li><span class="caret">CONTAMINACIÓN MAL INTENCIONADA</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container">CONTAMINACIÓN MAL INTENCIONADA<div id="ContMalIntencionada"></div></div></li>
                    <br>             
                  </ul>
                </li>
                <li><span class="caret">ALÉRGENOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>FRUTOS</label><div id="Frutos"></div><div id="Frutos_Porcentaje"></div></div></li> 
                    <br>     
                    <li><div class="button-container"><label>HUEVOS</label><div id="Huevos"></div><div id="Huevos_Porcentaje"></div></div></li>    
                    <br>  
                    <li><div class="button-container"><label>VEGETALES</label><div id="Vegetales"></div><div id="Vegetales_Porcentaje"></div></div></li> 
                    <br>   
                    <li><div class="button-container"><label>PRODUCTOS AZUCARADOS</label><div id="ProductosAzucarados"></div><div id="ProductosAzucarados_Porcentaje"></div></div></li> 
                    <br>   
                    <li><div class="button-container"><label>SALSAS</label><div id="Salsas"></div><div id="Salsas_Porcentaje"></div></div></li> 
                    <br>              
                  </ul>
                </li>
              </ul>

              <!-- TREEVIEW -->
              <script type="text/javascript">           
                var toggler = document.getElementsByClassName("caret");
                var i;               
                for (i = 0; i < toggler.length; i++) {
                  toggler[i].addEventListener("click", function() {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                    this.classList.toggle("caret-down");
                  });
                }
              </script>
                                  
            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Resumen</legend>
             
              <div class="button-container"> 
                <div id="lblTotalObservaciones">Q Observaciones</div>
                <div id="txtTotalObservaciones"></div>
                <div id="lblPorcentajeTotalObservaciones">% Observaciones</div>
                <div id="txtPorcentajeTotalObservaciones"></div>
              </div>
                    
            </fieldset>
          </div>
       
        </div>
      </div>
    
      <div id="div_tab_05" type="text/html">
        <div id="form_05">

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">

              <button id="boton">Capturar Evidencia</button>
              <select name="listaDeDispositivos" id="listaDeDispositivos"></select>
              <p id="estado"></p>
        
              <br>
              <video muted="muted" id="video"></video>
              <canvas id="canvas" style="display: none;"></canvas>
            
              <input id="fileToUpload" type="file" name="fileToUpload" /> 
              <button id="upload-button" onclick="uploadFile()">Subir Foto o Video</button>


              <script>

              var files = document.getElementById('fileToUpload').files;
              for (var x = 0; x < files.length; x++) {
                  fd.append("fileToUpload[]", document.getElementById('fileToUpload').files[x]);
              }

              </script>

          </fieldset>
        </div>

        </div>
      </div>


    </div>

    <div id="lblUsuario"></div>

  </body>
</html>