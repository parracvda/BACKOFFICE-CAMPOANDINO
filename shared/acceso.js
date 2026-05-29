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
        var btn = document.querySelector('.login-button');
        var btnText = btn ? btn.querySelector('.btn-text') : null;
        var btnIcon = btn ? btn.querySelector('.btn-icon') : null;
        if (btn) { btn.disabled = true; btn.classList.remove('success'); btn.classList.remove('shake'); btn.classList.add('loading'); if (btnIcon) btnIcon.textContent = ''; }

        const parametros = new URLSearchParams({
                Usu: app.usuario,
                Pass: app.password
        });

        const url = '../shared/acceso.php?' + parametros.toString();
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

        // Mostrar animación de éxito breve antes de redirigir
        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('success');
            if (btnIcon) btnIcon.textContent = '✓';
        }

        setTimeout(function(){
            // Redirección basada en tipo de usuario y features
            if (tipo === 'montacarguista') {
                window.location.href = '../sistemas/requerimientos/entregasrequerimientos_v2.php';
            } else {
                window.location.href = 'panel.html';
            }
        }, 650);
  } else {
      // Limpieza de features en caso de login fallido
      try { localStorage.removeItem('features'); } catch(e){}
      if (btn) {
          btn.classList.remove('loading');
          btn.disabled = false;
          btn.classList.add('shake');
          setTimeout(function(){ btn.classList.remove('shake'); }, 700);
      }
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
            if (btn) { btn.classList.remove('loading'); btn.disabled = false; btn.classList.add('shake'); setTimeout(function(){ btn.classList.remove('shake'); }, 700); }
            try {
                DevExpress.ui.notify({ message: 'Error de conexión o respuesta inválida del servidor', type: 'error', displayTime: 4000 });
            } catch(e){}
            alert('Error de conexión al servidor. Revisa la consola para más detalles.');
        });
}
