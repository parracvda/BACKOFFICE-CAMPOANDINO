<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>

    <title>FORMULARIO</title>     
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="formulario_pp.js"></script>
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
            function loadCodigoProducto() {
                $.ajax({
                    url: 'get_data2.php',
                    type: 'GET',
                    data: { action: 'getCodigoProducto' },
                    dataType: 'json',
                    success: function(data) {
                        $('#cmbCodigoProducto').dxSelectBox({
                            items: data,
                            displayExpr: 'Codigo',
                            valueExpr: 'Codigo',
                            onValueChanged: function(e) {
                                loadDescripcionProducto(e.value);
                            }
                        });
                    }
                });
            }

            // Función para cargar las opciones en el combo box de Descripción de Material
            function loadDescripcionProducto(codigoProducto) {
                $.ajax({
                    url: 'get_data2.php',
                    type: 'GET',
                    data: { action: 'getDescripcionProducto', codigoProducto: codigoProducto },
                    dataType: 'json',
                    success: function(data) {
                        $('#cmbDescripcionProducto').dxSelectBox({
                            items: data,
                            displayExpr: 'Descripcion',
                            valueExpr: 'Descripcion',
                            onValueChanged: function(e) {
                                // loadCodigoMaterial(e.value);
                            }
                        });
                    }
                });
            }

            // // Función para cargar las opciones en el combo box de Código de Material
            // function loadCodigoMaterial(descripcionMaterial) {
            //     $.ajax({
            //         url: 'get_data.php',
            //         type: 'GET',
            //         data: { action: 'getCodigoMaterial', descripcionMaterial: descripcionMaterial },
            //         dataType: 'json',
            //         success: function(data) {
            //             $('#cmbCodigoMaterial').dxSelectBox({
            //                 items: data,
            //                 displayExpr: 'CodigoMaterial',
            //                 valueExpr: 'CodigoMaterial'
            //             });
            //         }
            //     });
            // }

            // Inicializar el combo box de Orden de Compra al cargar la página
            // loadCodigoProducto();
        });
    </script>
    
  </head>
  <body class="dx-viewport"> 

    <!-- cabecera para el titulo -->
    <header id="main-header">		
      <p id="titulocabecera"> VERIFICACIÓN DE CONTROL DE LA CALIDAD - PP </p>
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
                <div class="dx-field-label">Turno:</div>
                <div class="dx-field-value">
                  <div id="cmbTurno"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Hora Inicio:</div>
                <div class="dx-field-value">
                  <div id="tpHoraInicio"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Hora Fin:</div>
                <div class="dx-field-value">
                  <div id="tpHoraFin"></div>
                </div>
              </div>
      
              <div class="dx-field">
                <div class="dx-field-label">Campaña:</div>
                <div class="dx-field-value">
                  <div id="cmbCampana"></div>
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
              <legend>General</legend>
  
              <div class="dx-field">
                <div class="dx-field-label">Código de Pallet:</div>
                <div class="dx-field-value">
                  <div id="txtCodigoPallet"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Fecha Producción:</div>
                <div class="dx-field-value">
                  <div id="dpFechaProduccion"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Lote de Producción:</div>
                <div class="dx-field-value">
                  <div id="txtLoteProduccion"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Código de Trazabilidad:</div>
                <div class="dx-field-value">
                  <div id="txtCodigoTrazabilidad"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Máquina:</div>
                <div class="dx-field-value">
                  <div id="cmbMaquina"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Proceso:</div>
                <div class="dx-field-value">
                  <div id="cmbProceso"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Destino:</div>
                <div class="dx-field-value">
                  <div id="txtDestino"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Cantidad:</div>
                <div class="dx-field-value">
                  <div id="txtCantidad"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Código Producto:</div>
                <div class="dx-field-value">
                  <div id="cmbCodigoProducto"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Descripción:</div>
                <div class="dx-field-value">
                  <div id="cmbDescripcionProducto"></div>
                </div>
              </div>

            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Inspección</legend>

              <div class="dx-field">
                <div class="dx-field-label">Observación Trazabilidad:</div>
                <div class="dx-field-value">
                  <div id="txtObservacionTrazabilidad"></div>
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
                <div class="dx-field-label">Observación Paletizado:</div>
                <div class="dx-field-value">
                  <div id="cmbObservacionPaletizado"></div>
                </div>
              </div>                

            </fieldset>
          </div> 

          <div class="dx-fieldset">
            <fieldset style="border: 2px solid rgb(34, 204, 175)">         
              <legend>Parihuela Interna</legend>

              <ul class="group">
                    <label><input type="checkbox" class="all" name="allg1">Seleccionar todo</label>
                    <br>
                    <br>
                    <li><div class="dx-field" id="div_chk1"><input type="checkbox" value="METAL / ACERO">METAL / ACERO</div></li>
                    <li><div class="dx-field" id="div_chk2"><input type="checkbox" value="PLASTICO">PLASTICO</div></li>
                    <li><div class="dx-field" id="div_chk3"><input type="checkbox" value="INSECTOS">INSECTOS</div></li>
                    <li><div class="dx-field" id="div_chk4"><input type="checkbox" value="PIEDRAS">PIEDRAS</div></li>
                    <li><div class="dx-field" id="div_chk5"><input type="checkbox" value="VIDRIO">VIDRIO</div></li>
                    <li><div class="dx-field" id="div_chk6"><input type="checkbox" value="PALLETS">PALLETS</div></li>
                    <li><div class="dx-field" id="div_chk7"><input type="checkbox" value="EPPS">EPPS</div></li>
                    <li><div class="dx-field" id="div_chk7"><input type="checkbox" value="PINTURAS">PINTURAS</div></li>
                    <li><div class="dx-field" id="div_chk7"><input type="checkbox" value="PETROLEO">PETROLEO</div></li>                   
                    <li><div class="dx-field" id="div_chk8"><input type="checkbox" value="COLA">COLA</div></li>
                    <li><div class="dx-field" id="div_chk9"><input type="checkbox" value="LUBRICANTES">LUBRICANTES</div></li>
                    <li><div class="dx-field" id="div_chk10"><input type="checkbox" value="INSECTICIDAS">INSECTICIDAS</div></li>
                    <li><div class="dx-field" id="div_chk11"><input type="checkbox" value="GRASAS">GRASAS</div></li>
                    <li><div class="dx-field" id="div_chk12"><input type="checkbox" value="HONGOS">HONGOS</div></li>
                    <li><div class="dx-field" id="div_chk13"><input type="checkbox" value="SALIVA">SALIVA</div></li>
                    <li><div class="dx-field" id="div_chk14"><input type="checkbox" value="MOHO">MOHO</div></li>
                    <li><div class="dx-field" id="div_chk15"><input type="checkbox" value="HECES DE ANIMALES">HECES DE ANIMALES</div></li>
                    <li><div class="dx-field" id="div_chk16"><input type="checkbox" value="SANGRE">SANGRE</div></li> 
                    <li><div class="dx-field" id="div_chk16"><input type="checkbox" value="DIENTES">DIENTES</div></li>    
                    <li><div class="dx-field" id="div_chk16"><input type="checkbox" value="FRUTOS">FRUTOS</div></li>    
                    <li><div class="dx-field" id="div_chk16"><input type="checkbox" value="HUEVOS">HUEVOS</div></li>    
                    <li><div class="dx-field" id="div_chk16"><input type="checkbox" value="VEGETALES">VEGETALES</div></li>    
                    <li><div class="dx-field" id="div_chk16"><input type="checkbox" value="PRODUCTOS AZUCARADOS">PRODUCTOS AZUCARADOS</div></li>                                
              </ul>
          
              <!-- <ul id="myUL">
                <li><span class="caret2">PELIGROS FÍSICOS</span>
                  <ul class="nested2">
                    <br>
                    <li><div class="button-container"><input type="checkbox" value="METAL / ACERO">METAL / ACERO</li>
                    <br>
                    <li><div class="button-container"><input type="checkbox" value="PLASTICO">PLASTICO</li>
                    <br>
                    <li><div class="button-container"><input type="checkbox" value="INSECTOS">INSECTOS</li>
                    <br>
                    <li><div class="button-container"><input type="checkbox" value="PIEDRAS">PIEDRAS</li>
                    <br>
                    <li><div class="button-container"><input type="checkbox" value="VIDRIO">VIDRIO</li>
                    <br>      
                  </ul>
                </li>
                <li><span class="caret2">PELIGROS QUÍMICOS</span>
                  <ul class="nested2">
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="PINTURAS">PINTURAS</li>
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="PETROLEO">PETROLEO</li>
                    <br>   
                    <li><div class="button-container"><input type="checkbox" value="COLA">COLA</li>
                    <br>      
                    <li><div class="button-container"><input type="checkbox" value="LUBRICANTES">LUBRICANTES</li>
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="INSECTICIDAS">INSECTICIDAS</li>
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="GRASAS">GRASAS</li>
                    <br>        
                  </ul>
                </li>
                <li><span class="caret2">PELIGROS MICROBIOLÓGICOS</span>
                  <ul class="nested2">
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="HONGOS">HONGOS</li>
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="SALIVA">SALIVA</li>
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="MOHO">MOHO</li>
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="HECES DE ANIMALES">HECES DE ANIMALES</li>
                    <br>     
                    <li><div class="button-container"><input type="checkbox" value="SANGRE">SANGRE</li>
                    <br> 
                    <li><div class="button-container"><input type="checkbox" value="DIENTES">DIENTES</li>
                    <br>      
                  </ul>
                </li>            
                <li><span class="caret2">ALÉRGENOS</span>
                  <ul class="nested2">
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="FRUTOS">FRUTOS</li>
                    <br>     
                    <li><div class="button-container"><input type="checkbox" value="HUEVOS">HUEVOS</li>
                    <br>  
                    <li><div class="button-container"><input type="checkbox" value="VEGETALES">VEGETALES</li>
                    <br>   
                    <li><div class="button-container"><input type="checkbox" value="PRODUCTOS AZUCARADOS">PRODUCTOS AZUCARADOS</li> 
                    <br>              
                  </ul>
                </li>
                <li><span class="caret2">CONTAMINACIÓN MAL INTENCIONADA</span>
                  <ul class="nested2">
                    <br>  
                    <li><div class="button-container">CONTAMINACION MAL INTENCIONADA<div id="Contaminacion"></div></div></li>
                    <br>             
                  </ul>
                </li>
              </ul> -->

              <!-- TREEVIEW -->
              <!-- <script type="text/javascript">           
                var toggler = document.getElementsByClassName("caret2");
                var i;               
                for (i = 0; i < toggler.length; i++) {
                  toggler[i].addEventListener("click", function() {
                    this.parentElement.querySelector(".nested2").classList.toggle("active");
                    this.classList.toggle("caret-down");
                  });
                }
              </script>          -->

              <!-- <div class="dx-field">
                <div class="dx-field-label">Documentos:</div>
                <div class="dx-field-value">
                  <div><textarea id="results" rows="4" cols="45"> </textarea></div>
                </div>
              </div>   
              
              -->

              <div class="dx-field">
                <div class="dx-field-label">CONTAMINACION MAL INTENCIONADA:</div>
                <div class="dx-field-value">
                  <div id="Contaminacion"></div>
                </div>
              </div>
                      
              <div class="dx-field">
                <div class="dx-field-label"></div>
                <div class="dx-field-value">
                  <div id="txtPeligrosPaletizado"></div>
                </div>
              </div>

            </fieldset>
          </div>         

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">         
  
            <div class="dx-field">
                <div class="dx-field-label">Paletizado Conforme:</div>
                <div class="dx-field-value">
                  <div id="txtPaletizadoConforme"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Sellado Conforme:</div>
                <div class="dx-field-value">
                  <div id="txtSelladoConforme"></div>
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
                <div class="dx-field-label">Tipo de Material:</div>
                <div class="dx-field-value">
                  <div id="cmbTipoMaterial"></div>
                </div>
              </div>

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
                
              <div class="dx-field" id="grupo_alto">
                <div class="dx-field-label">Alto:</div>   
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtAlto"></div>
                      <div id="txtDetalleAlto"></div>
                      <div id="txtUnidadesAlto"></div>
                      <div id="txtPorcentajeAlto"></div>
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

              <div class="dx-field" id="grupo_humedad">
                <div class="dx-field-label">Humedad %:</div>   
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtHumedad"></div>
                      <div id="txtDetalleHumedad"></div>
                    </div>
                  </div>
                </div>    
                  
            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Defectos</legend>

              <div class="dx-field" id="grupo_arqueado">           
                <div class="dx-field-label">Arqueado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtArqueado"></div>
                      <div id="txtPorcentajeArqueado"></div>
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

              <div class="dx-field" id="grupo_corte">           
                <div class="dx-field-label">Corte:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtCorte"></div>
                      <div id="txtPorcentajeCorte"></div>
                    </div>
                  </div>
                </div>              

              <div class="dx-field" id="grupo_cuadratura">           
                <div class="dx-field-label">Cuadratura:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtCuadratura"></div>
                      <div id="txtPorcentajeCuadratura"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_despegado">           
                <div class="dx-field-label">Despegado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtDespegado"></div>
                      <div id="txtPorcentajeDespegado"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_dobleetiqueta">           
                <div class="dx-field-label">Doble Etiqueta:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtDobleEtiqueta"></div>
                      <div id="txtPorcentajeDobleEtiqueta"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_falloimpresion">           
                <div class="dx-field-label">Fallo de Impresión:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtFalloImpresion"></div>
                      <div id="txtPorcentajeFalloImpresion"></div>
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

              <div class="dx-field" id="grupo_impresionsenasa">           
                <div class="dx-field-label">Impresión Senasa:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtImpresionSenasa"></div>
                      <div id="txtPorcentajeImpresionSenasa"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_maladistribucion">           
                <div class="dx-field-label">Mala Distribución:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtMalaDistribucion"></div>
                      <div id="txtPorcentajeMalaDistribucion"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_malasujecion">           
                <div class="dx-field-label">Mala Sujeción:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtMalaSujecion"></div>
                      <div id="txtPorcentajeMalaSujecion"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_manchasazules">           
                <div class="dx-field-label">Manchas Azules:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtManchasAzules"></div>
                      <div id="txtPorcentajeManchasAzules"></div>
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

              <div class="dx-field" id="grupo_nudo">           
                <div class="dx-field-label">Nudo:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtNudo"></div>
                      <div id="txtPorcentajeNudo"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_orificios">           
                <div class="dx-field-label">Orificios:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtOrificios"></div>
                      <div id="txtPorcentajeOrificios"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_partidura">           
                <div class="dx-field-label">Partidura:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPartidura"></div>
                      <div id="txtPorcentajePartidura"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_puntoexpuesto">           
                <div class="dx-field-label">Punto Expuesto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPuntoExpuesto"></div>
                      <div id="txtPorcentajePuntoExpuesto"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_puntoroto">           
                <div class="dx-field-label">Punto Roto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPuntoRoto"></div>
                      <div id="txtPorcentajePuntoRoto"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_puntosuelto">           
                <div class="dx-field-label">Punto Suelto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPuntoSuelto"></div>
                      <div id="txtPorcentajePuntoSuelto"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_rasgado">           
                <div class="dx-field-label">Rasgado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtRasgado"></div>
                      <div id="txtPorcentajeRasgado"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_rotoquebrado">           
                <div class="dx-field-label">Roto / Quebrado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtRotoQuebrado"></div>
                      <div id="txtPorcentajeRotoQuebrado"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_sinpunto">           
                <div class="dx-field-label">Sin Punto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtSinPunto"></div>
                      <div id="txtPorcentajeSinPunto"></div>
                    </div>
                  </div>
                </div>

                <div class="dx-field" id="grupo_texturagranulada">           
                <div class="dx-field-label">Textura Granulada:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtTexturaGranulada"></div>
                      <div id="txtPorcentajeTexturaGranulada"></div>
                    </div>
                  </div>
                </div>

                <div class="dx-field" id="grupo_vacio">           
                <div class="dx-field-label">Vacio:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtVacio"></div>
                      <div id="txtPorcentajeVacio"></div>
                    </div>
                  </div>
                </div>

                <div class="dx-field" id="grupo_ventilacion">           
                <div class="dx-field-label">Ventilación:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtVentilacion"></div>
                      <div id="txtPorcentajeVentilacion"></div>
                    </div>
                  </div>
                </div>

                <div class="dx-field" id="grupo_volteado">           
                <div class="dx-field-label">Volteado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtVolteado"></div>
                      <div id="txtPorcentajeVolteado"></div>
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
                    <li><div class="button-container"><label>CINTA DE EMBALAJE</label><div id="CintaEmbalaje"></div><div id="PorcentajeCintaEmbalaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>METAL / ACERO</label><div id="MetalAcero"></div><div id="PorcentajeMetalAcero"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>PLASTICO</label><div id="Plastico"></div><div id="PorcentajePlastico"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>INSECTOS</label><div id="Insectos"></div><div id="PorcentajeInsectos"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>ASTILLADO</label><div id="Astillado"></div><div id="PorcentajeAstillado"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>EPPS</label><div id="Epps"></div><div id="PorcentajeEpps"></div></div></li>   
                    <br>   
                    <li><div class="button-container"><label>CARTON</label><div id="Carton"></div><div id="PorcentajeCarton"></div></div></li>   
                    <br>  
                    <li><div class="button-container"><label>PIEDRAS</label><div id="Piedras"></div><div id="PorcentajePiedras"></div></div></li>   
                    <br>  
                    <li><div class="button-container"><label>OXIDO</label><div id="Oxido"></div><div id="PorcentajeOxido"></div></div></li>   
                    <br>  
                    <li><div class="button-container"><label>POLVO</label><div id="Polvo"></div><div id="PorcentajePolvo"></div></div></li>   
                    <br>  
                    <li><div class="button-container"><label>LIJA</label><div id="Lija"></div><div id="PorcentajeLija"></div></div></li>   
                    <br>  
                  </ul>
                </li>
                <li><span class="caret">PELIGROS QUÍMICOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>PINTURAS</label><div id="Pinturas"></div><div id="PorcentajePinturas"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>TINTA</label><div id="Tinta"></div><div id="PorcentajeTinta"></div></div></li> 
                    <br>   
                    <li><div class="button-container"><label>PETROLEO</label><div id="Petroleo"></div><div id="PorcentajePetroleo"></div></div></li> 
                    <br>         
                    <li><div class="button-container"><label>COLA</label><div id="Cola"></div><div id="PorcentajeCola"></div></div></li> 
                    <br>      
                    <li><div class="button-container"><label>LUBRICANTES</label><div id="Lubricantes"></div><div id="PorcentajeLubricantes"></div></div></li> 
                    <br>      
                    <li><div class="button-container"><label>GRASAS</label><div id="Grasas"></div><div id="PorcentajeGrasas"></div></div></li> 
                    <br>         
                  </ul>
                </li>
                <li><span class="caret">PELIGROS MICROBIOLÓGICOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>HONGOS</label><div id="Hongos"></div><div id="PorcentajeHongos"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>MOHO</label><div id="Moho"></div><div id="PorcentajeMoho"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>HECES DE ANIMALES</label><div id="HecesAnimales"></div><div id="PorcentajeHecesAnimales"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>SANGRE</label><div id="Sangre"></div><div id="PorcentajeSangre"></div></div></li>
                    <br>          
                    <li><div class="button-container"><label>SUCIEDAD</label><div id="Suciedad"></div><div id="PorcentajeSuciedad"></div></div></li>
                    <br> 
                  </ul>
                </li>
                <li><span class="caret">CONTAMINACIÓN MAL INTENCIONADA</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>CONTAMINACIÓN MAL INTENCIONADA</label><div id="ContMalIntencionada"></div></div></li>
                    <br>             
                  </ul>
                </li>
                <li><span class="caret">ALÉRGENOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>FRUTOS</label><div id="Frutos"></div><div id="PorcentajeFrutos"></div></div></li> 
                    <br>     
                    <li><div class="button-container"><label>HUEVOS</label><div id="Huevos"></div><div id="PorcentajeHuevos"></div></div></li>    
                    <br>  
                    <li><div class="button-container"><label>VEGETALES</label><div id="Vegetales"></div><div id="PorcentajeVegetales"></div></div></li> 
                    <br>   
                    <li><div class="button-container"><label>PRODUCTOS AZUCARADOS</label><div id="ProductosAzucarados"></div><div id="PorcentajeProductosAzucarados"></div></div></li> 
                    <br>   
                    <li><div class="button-container"><label>LACTEOS</label><div id="Lacteos"></div><div id="PorcentajeLacteos"></div></div></li> 
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