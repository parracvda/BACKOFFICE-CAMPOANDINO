$(document).ready(function() {
  const $filterToday = $('#filterToday');
  const $exportToCSV = $('#exportToCSV');
  const $Nuevo = $('#Nuevo');
  const $startDate = $('#startDate');
  const $endDate = $('#endDate');
  const $tipoMaterial = $('#tipoMaterial');

  function loadRegistros(filterToday, startDate = '', endDate = '') {
      console.log("Cargando registros, filtro de hoy:", filterToday); // Para depuración
      $.ajax({
          url: 'exportar_de.php',
          type: 'GET',
          data: {
              filterToday: filterToday ? 1 : 0,
              startDate: startDate,
              endDate: endDate
          },
          success: function(data) {
              console.log("Respuesta del servidor:", data); // Para depuración
              $('#registrosContainer').html(data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
          }
      });
  }

  function exportToCSV() {
      $.ajax({
          url: 'exportar_de.php',
          type: 'GET',
          data: {
              export: 1,
              filterToday: $filterToday.is(':checked') ? 1 : 0,
              startDate: $startDate.val(),
              endDate: $endDate.val(),
              tipoMaterial: $tipoMaterial.val() // Usar solo para exportación
          },
          xhrFields: {
              responseType: 'blob'
          },
          success: function(blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'registros.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log("Error en la exportación a CSV:", textStatus, errorThrown);
          }
      });
  }

  function Nuevo() {
    $.ajax({
        url: 'formulario_de.php',
        type: 'POST',
        onClick() {
          window.location.href = 'formulario_de.php?par_accion=agregar&id=0';
        },
    });
  }

  // Inicializar la tabla de registros
  $filterToday.change(function() {
      loadRegistros($filterToday.is(':checked'), $startDate.val(), $endDate.val());
  });

  $exportToCSV.click(function() {
      exportToCSV();
  });

  $Nuevo.click(function() {
    Nuevo();
});

  // Cargar registros al iniciar
  loadRegistros($filterToday.is(':checked'), $startDate.val(), $endDate.val());
});
