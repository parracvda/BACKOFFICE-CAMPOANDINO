<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>

    <title>FORMULARIO</title>     
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="formulario_de.js"></script>
    <script>window.jQuery || document.write(decodeURIComponent('%3Cscript src="js/jquery.min.js"%3E%3C/script%3E'))</script>
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/22.2.5/css/dx.darkmoon.css" />
     <!-- <script src="https://cdn3.devexpress.com/jslib/22.2.5/js/dx.all.js"></script>  -->
     <!-- LIBRERIA PARA CHECKBOX A TEXTBOX -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="dx.all.js"></script>
 
    <link rel="stylesheet" type="text/css" href="styles.css" />
    
    <!-- <script>
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
    </script> -->

  </head>
  <body class="dx-viewport"> 

    <!-- cabecera para el titulo -->
    <header id="main-header">		
      <p id="titulocabecera"> VERIFICACIÓN DE CONTROL DE LA CALIDAD - DES </p>
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
                <div class="dx-field-label">Nombre del Cliente:</div>
                <div class="dx-field-value">
                  <div id="txtNombreCliente"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Placa del Transporte:</div>
                <div class="dx-field-value">
                  <div id="txtPlacaTransporte"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Placa del Tracto:</div>
                <div class="dx-field-value">
                  <div id="txtPlacaTracto"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Conductor:</div>
                <div class="dx-field-value">
                  <div id="txtConductor"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Empresa Transportista:</div>
                <div class="dx-field-value">
                  <div id="txtEmpresaTransportista"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Destino:</div>
                <div class="dx-field-value">
                  <div id="txtDestino"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Número de Viaje:</div>
                <div class="dx-field-value">
                    <div id="txtNumeroViaje"></div>
                </div>
              </div>

              <div class="dx-field">
                  <div class="dx-field-label">% Humedad:</div>
                  <div class="dx-field-value">
                      <div id="txtPorHumedad"></div>
                  </div>
              </div>

            </fieldset>
          </div>

          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Inspección</legend>

              <div class="dx-field">
                <div class="dx-field-label">Observación:</div>
                <div class="dx-field-value">
                  <div id="cmbObservacionTransporte"></div>
                </div>
              </div>

            </fieldset>
            </div> 

          <div class="dx-fieldset">
            <fieldset style="border: 2px solid rgb(34, 204, 175)"> 
              
            <fieldset class="grupoparedes">           
            <legend>Paredes</legend> 

              <ul class="checkboxparedes" id="checkboxparedes"> 
                <li><input type="checkbox" id="cb1" value="AGUJEROS" /><label for="cb1">AGUJEROS</label></li> 
                <li><input type="checkbox" id="cb2" value="DETERIORO" /><label for="cb2">DETERIORO</label></li> 
                <li><input type="checkbox" id="cb3" value="GRASAS" /><label for="cb3">GRASAS</label></li> 
                <li><input type="checkbox" id="cb4" value="PETROLEO" /><label for="cb4">PETROLEO</label></li> 
                <li><input type="checkbox" id="cb5" value="HONGO" /><label for="cb5">HONGO</label></li> 
                <li><input type="checkbox" id="cb6" value="HECES DE ANIMALES" /><label for="cb6">HECES DE ANIMALES</label></li> 
                <li><input type="checkbox" id="cb7" value="RESIDUOS ORGANICOS" /><label for="cb7">RESIDUOS ORGANICOS</label></li> 
                <li><input type="checkbox" id="cb8" value="PRODUCTOS AZUCARADOS" /><label for="cb8">PRODUCTOS AZUCARADOS</label></li> 
                <li><input type="checkbox" id="cb9" value="OLORES" /><label for="cb9">OLORES</label></li> 
              </ul> 
            
              <div class="dx-field">
                <div class="dx-field-label"></div>
                <div class="dx-field-value">
                  <div id="txtParedes"></div>
                </div>
              </div>

            </fieldset> 

            <fieldset class="grupoplataforma">           
            <legend>Plataforma</legend> 

              <ul class="checkboxplataforma" id="checkboxplataforma"> 
                <li><input type="checkbox" id="cb10" value="AGUJEROS" /><label for="cb10">AGUJEROS</label></li> 
                <li><input type="checkbox" id="cb11" value="POLVO/TIERRA" /><label for="cb11">POLVO/TIERRA</label></li> 
                <li><input type="checkbox" id="cb12" value="DETERIORO" /><label for="cb12">GRASAS</label></li> 
                <li><input type="checkbox" id="cb13" value="GRASAS" /><label for="cb13">GRASAS</label></li> 
                <li><input type="checkbox" id="cb14" value="PETROLEO" /><label for="cb14">PETROLEO</label></li> 
                <li><input type="checkbox" id="cb15" value="HONGO" /><label for="cb15">HECES DE ANIMALES</label></li> 
                <li><input type="checkbox" id="cb16" value="HECES DE ANIMALES" /><label for="cb16">HECES DE ANIMALES</label></li> 
                <li><input type="checkbox" id="cb17" value="RESIDUOS ORGANICOS" /><label for="cb17">RESIDUOS ORGANICOS</label></li> 
                <li><input type="checkbox" id="cb18" value="PRODUCTOS AZUCARADOS" /><label for="cb18">PRODUCTOS AZUCARADOS</label></li> 
                <li><input type="checkbox" id="cb19" value="OLORES" /><label for="cb19">OLORES</label></li> 
              </ul> 
            
              <div class="dx-field">
                <div class="dx-field-label"></div>
                <div class="dx-field-value">
                  <div id="txtPlataforma"></div>
                </div>
              </div>

            </fieldset> 

            <fieldset class="grupotecho">           
            <legend>Techo</legend> 

              <ul class="checkboxtecho"> 
                <li><input type="checkbox" id="cb20" value="AGUJEROS" /><label for="cb20">AGUJEROS</label></li> 
                <li><input type="checkbox" id="cb21" value="SUCIEDAD" /><label for="cb21">SUCIEDAD</label></li> 
                <li><input type="checkbox" id="cb22" value="DETERIORO" /><label for="cb22">DETERIORO</label></li> 
                <li><input type="checkbox" id="cb23" value="GRASAS" /><label for="cb23">GRASAS</label></li> 
                <li><input type="checkbox" id="cb24" value="PETROLEO" /><label for="cb24">PETROLEO</label></li> 
                <li><input type="checkbox" id="cb25" value="HECES DE ANIMALES" /><label for="cb25">HECES DE ANIMALES</label></li> 
                <li><input type="checkbox" id="cb26" value="OLORES" /><label for="cb26">OLORES</label></li> 
              </ul> 
            
              <div class="dx-field">
                <div class="dx-field-label"></div>
                <div class="dx-field-value">
                  <div id="txtTecho"></div>
                </div>
              </div>

            </fieldset> 

            <fieldset class="grupopuerta">           
            <legend>Puerta</legend> 

              <ul class="checkboxpuerta"> 
                <li><input type="checkbox" id="cb27" value="AGUJEROS" /><label for="cb27">AGUJEROS</label></li> 
                <li><input type="checkbox" id="cb28" value="SUCIEDAD" /><label for="cb28">SUCIEDAD</label></li> 
                <li><input type="checkbox" id="cb29" value="DETERIORO" /><label for="cb29">DETERIORO</label></li> 
                <li><input type="checkbox" id="cb30" value="GRASAS" /><label for="cb30">GRASAS</label></li> 
                <li><input type="checkbox" id="cb31" value="PETROLEO" /><label for="cb31">PETROLEO</label></li> 
                <li><input type="checkbox" id="cb32" value="HECES DE ANIMALES" /><label for="cb32">HECES DE ANIMALES</label></li> 
                <li><input type="checkbox" id="cb33" value="OLORES" /><label for="cb33">OLORES</label></li> 
              </ul> 
            
              <div class="dx-field">
                <div class="dx-field-label"></div>
                <div class="dx-field-value">
                  <div id="txtPuerta"></div>
                </div>
              </div>

            </fieldset> 

            </fieldset>
          </div>    
          
          <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Resumen</legend>
             
              <div class="button-container"> 
                <div id="lblTotalObservaciones">Q Observaciones</div>
                <div id="txtTotalObservacionesT"></div>
                <div id="lblPorcentajeTotalObservaciones">% Observaciones</div>
                <div id="txtPorcentajeTotalObservacionesT"></div>
              </div>
                    
            </fieldset>
          </div>

        </div>
      </div>

      <div id="div_tab_03">
        <div id="form_03">         

            <div class="dx-fieldset">
            <fieldset style="border: 1px solid rgb(34, 204, 175)">
              <legend>Cajas</legend>
  
              <div class="dx-field">
                <div class="dx-field-label">Lote:</div>
                <div class="dx-field-value">
                  <div id="txtLote"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Código de Producto:</div>
                <div class="dx-field-value">
                  <div id="txtCodigoProducto"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Descripción:</div>
                <div class="dx-field-value">
                  <div id="txtDescripcionProducto"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label"># Cajas/Parihuelas/Tapas:</div>
                <div class="dx-field-value">
                  <div id="txtNumero"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">% Humedad:</div>
                <div class="dx-field-value">
                  <div id="txtHumedadCajas"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Q Pallets Terminados:</div>
                <div class="dx-field-value">
                  <div id="txtPalletsTerminados"></div>
                </div>
              </div>

              <div class="dx-field">
                <div class="dx-field-label">Q Puchos Terminados:</div>
                <div class="dx-field-value">
                    <div id="txtPuchosTerminados"></div>
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
                <div class="dx-field-label">Tipo Material:</div>
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
              <legend>Defectos</legend>

              <div class="dx-field" id="grupo_despegado">           
                <div class="dx-field-label">Despegado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtDespegado"></div>
                      <div id="txtDespegadoPorcentaje"></div>
                  </div>
                </div>
              </div>
                                      
              <div class="dx-field" id="grupo_dobleetiqueta">  
                <div class="dx-field-label">Doble Etiqueta:</div>   
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtDobleEtiqueta"></div>
                      <div id="txtDobleEtiquetaPorcentaje"></div>                  
                  </div>
                </div>
              </div>  

              <div class="dx-field" id="grupo_impresionsenasa">           
                <div class="dx-field-label">Impresión Senasa:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtImpresionSenasa"></div>
                      <div id="txtImpresionSenasaPorcentaje"></div>
                    </div>
                  </div>
                </div>              

              <div class="dx-field" id="grupo_malasujecion">           
                <div class="dx-field-label">Mala Sujeción:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtMalaSujecion"></div>
                      <div id="txtMalaSujecionPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_piezadanada">           
                <div class="dx-field-label">Pieza Dañada:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPiezaDanada"></div>
                      <div id="txtPiezaDanadaPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_puntoexpuesto">           
                <div class="dx-field-label">Punto Expuesto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPuntoExpuesto"></div>
                      <div id="txtPuntoExpuestoPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_puntoroto">           
                <div class="dx-field-label">Punto Roto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPuntoRoto"></div>
                      <div id="txtPuntoRotoPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_puntosuelto">           
                <div class="dx-field-label">Punto Suelto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtPuntoSuelto"></div>
                      <div id="txtPuntoSueltoPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_rasgado">           
                <div class="dx-field-label">Rasgado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtRasgado"></div>
                      <div id="txtRasgadoPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_rotoquebrado">           
                <div class="dx-field-label">Roto / Quebrado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtRotoQuebrado"></div>
                      <div id="txtRotoQuebradoPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_sinpunto">           
                <div class="dx-field-label">Sin Punto:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtSinPunto"></div>
                      <div id="txtSinPuntoPorcentaje"></div>
                    </div>
                  </div>
                </div>

              <div class="dx-field" id="grupo_volteado">           
                <div class="dx-field-label">Volteado:</div> 
                  <div class="dx-field-value">
                    <div class="button-container"> 
                      <div id="txtVolteado"></div>
                      <div id="txtVolteadoPorcentaje"></div>
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
                    <li><div class="button-container"><label>METAL/ACERO</label><div id="MetalAcero"></div><div id="MetalAceroPorcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>INSECTOS</label><div id="Insectos"></div><div id="InsectosPorcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>PIEDRAS</label><div id="Piedras"></div><div id="PiedrasPorcentaje"></div></div></li>
                    <br>                  
                    <li><div class="button-container"><label>OXIDO</label><div id="Oxido"></div><div id="OxidoPorcentaje"></div></div></li>
                    <br>
                    <li><div class="button-container"><label>PLASTICO</label><div id="Plastico"></div><div id="PlasticoPorcentaje"></div></div></li>
                    <br>                  
                    <li><div class="button-container"><label>POLVO</label><div id="Polvo"></div><div id="PolvoPorcentaje"></div></div></li>   
                    <br>   
                  </ul>
                </li>
                <li><span class="caret">PELIGROS QUÍMICOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>PINTURAS</label><div id="Pinturas"></div><div id="PinturasPorcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>LUBRICANTES</label><div id="Lubricantes"></div><div id="LubricantesPorcentaje"></div></div></li> 
                    <br>   
                    <li><div class="button-container"><label>PETROLEO</label><div id="Petroleo"></div><div id="PetroleoPorcentaje"></div></div></li> 
                    <br>    
                    <li><div class="button-container"><label>GRASAS</label><div id="Grasas"></div><div id="GrasasPorcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>GRASAS</label><div id="Tinta"></div><div id="TintaPorcentaje"></div></div></li> 
                    <br>            
                  </ul>
                </li>
                <li><span class="caret">PELIGROS MICROBIOLÓGICOS</span>
                  <ul class="nested">
                    <br>  
                    <li><div class="button-container"><label>HONGOS</label><div id="Hongos"></div><div id="HongosPorcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>MOHO</label><div id="Moho"></div><div id="MohoPorcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>HECES DE ANIMALES</label><div id="HecesAnimales"></div><div id="HecesAnimalesPorcentaje"></div></div></li> 
                    <br>  
                    <li><div class="button-container"><label>SALIVA</label><div id="Saliva"></div><div id="SalivaPorcentaje"></div></div></li>
                    <br>          
                  </ul>
                </li>

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