// Leer valor en progreso antes de crear la instancia Vue para evitar que Vue
// sobreescriba texto que el usuario haya escrito antes de que la app se monte.
var INPUT_KEY = 'acceso_usuario_inprogress';
var initialUsuario = '';
try { initialUsuario = sessionStorage.getItem(INPUT_KEY) || ''; } catch(e) { initialUsuario = ''; }

var app = new Vue({
    el: '#app',
    data: function () {
        return {
            usuario: initialUsuario || '',
            password: ''
        }
    },
    methods: {
        submit: function() {
          console.log("Método submit de Vue ejecutado");
            btnAcceder_Click();
        }
    }
});

// Persistencia temporal del input de usuario: guardar mientras escribe y limpiar al enviar
(function(){
    try {
        document.addEventListener('DOMContentLoaded', function(){
            var input = document.getElementById('txtUsu');
            if (!input) return;
            input.addEventListener('input', function(){
                try { sessionStorage.setItem(INPUT_KEY, input.value); } catch(e){}
            });
            var form = input.closest('form');
            if (form) {
                form.addEventListener('submit', function(){ try { sessionStorage.removeItem(INPUT_KEY); } catch(e){} });
            }
        });
    } catch(e){ console.warn('Persistencia de input no disponible:', e); }
})();

    function btnAcceder_Click() {
        const parametros = new URLSearchParams({
                Usu: app.usuario,
                Pass: app.password
        });

        const url = '../sistemas/horas_paradas/acceso.php?' + parametros.toString();
        console.log('Enviando login a', url);

        fetch(url)
        .then(response => response.json())
        .then(data => {
             console.log('Respuesta del backend:', data);
  if (data.success) {
        // Guarda los nombres de usuarios en localStorage
        localStorage.setItem('nombreUsuario', data.nombre || data.usuario || '');
        localStorage.setItem('idUsuario', data.idusuario);
        // Guardar features devueltas por el backend para control de UI
        try {
            var feats = data.features || [];
            localStorage.setItem('features', JSON.stringify(feats));
            console.log('Features guardadas en localStorage:', feats);
        } catch(e) { console.warn('No se pudieron guardar features:', e); }
        var userLower = (data.usuario || '').toString().toLowerCase();
        var tipo = (data.tipousuario || data.TipoUsuario || '').toString().toLowerCase();
        
        // Redirección según usuario (prioridad: usuario específico primero)
        if (userLower === 'jparra' || userLower === 'rquicano') {
            window.location.href = 'panel.html';
        } else if (userLower === 'llarosa' || userLower === 'jramos' || userLower === 'jdelacruz') {
            // Enviar aprobadores al panel; panel filtrará para mostrar solo la sección de Aprobación
            window.location.href = 'panel.html';
        } else if (userLower === 'phuaman') {
            window.location.href = 'panel.html';
        } else if (userLower === 'jmires' || userLower === 'opacheco') {
            // Mostrar panel con UI limitada para estos usuarios
            window.location.href = 'panel.html';
        } else if (userLower === 'jsaman') {
            // JSAMAN: redirigir al panel (solicitud del usuario)
            window.location.href = 'panel.html';
        } else if (userLower === 'ddelacruz' || userLower === 'gmorales' || userLower === 'jmuñante' || userLower === 'gcollantes' || userLower === 'avarillas' || userLower === 'yabarca') {
            // Usuarios con acceso al Tratamiento (yabarca incluye Registro)
            window.location.href = 'panel.html';
        } else if (userLower === 'yvigil') {
            // YVIGIL: redirigir al panel
            window.location.href = 'panel.html';
        } else if (userLower === 'dflores') {
            // DFLORES: redirigir al panel
            window.location.href = 'panel.html';
        // Si es montacarguista, redirigir a entregas V2
        } else if (tipo === 'montacarguista') {
            window.location.href = '../sistemas/requerimientos/entregasrequerimientos_v2.php';
        // Si es SUPERVISOR DATOS (otros usuarios), redirigir a versión V2 (normalizada)
        } else if ((tipo.indexOf('supervisor') !== -1) && (tipo.indexOf('datos') !== -1 || tipo.indexOf('dato') !== -1)) {
            // detectar variantes como 'SUPERVISOR DATOS', 'supervisordatos', 'supervisor_datos', etc.
            window.location.href = '../sistemas/requerimientos/requerimientos_v2.php';
        } else {
            window.location.href = '../sistemas/horas_paradas/registrosp.html?par_accion=agregar';
        }
  } else {
      // Limpieza de features en caso de login fallido
      try { localStorage.removeItem('features'); } catch(e){}
      DevExpress.ui.notify({
      message: data.mensaje || "Usuario o contraseña incorrectos",
      type: "error",
      displayTime: 3000,
      position: {
          my: "center center",
          at: "center center",
          of: window,
    }
});
  }
        })
        .catch(error => {
            console.error('Error js:', error);
            try {
                DevExpress.ui.notify({ message: 'Error de conexión o respuesta inválida del servidor', type: 'error', displayTime: 4000 });
            } catch(e){}
            alert('Error de conexión al servidor. Revisa la consola para más detalles.');
        });
}
