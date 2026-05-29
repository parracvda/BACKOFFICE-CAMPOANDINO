var app = new Vue({
    el: '#form1',
    data: function () {
      return {
      email : "",
      emailBlured : false,
      valid : false,
      submitted : false,
      password:"",
      passwordBlured:false
      }
    },
  
    methods:{
  
      validate : function(){
  this.emailBlured = true;
  this.passwordBlured = true;
  if( this.validEmail(this.email) && this.validPassword(this.password)){
  this.valid = true;
  }
  },
  
  validEmail : function(email) {
     
  var re = /(.+)@(.+){2,}\.(.+){2,}/;
  if(re.test(email.toLowerCase())){
    return true;
  }
  
  },
  
  validPassword : function(password) {
     if (password.length > 7) {
      return true;
     }
  },
  
  submit : function(){
  this.validate();
  if(this.valid){

    btnAcceder_Click();
  this.submitted = true;
  }
  }
    }
  });


  function btnAcceder_Click()
  {

    const parametros = new URLSearchParams({
        Usu: txtUsu.value  // Reemplaza 'campo' y 'valor' con los valores que necesites
        ,Pass: txtPass.value  // Reemplaza 'campo' y 'valor' con los valores que necesites
    });
/*
    fetch('acceso.php?' + parametros.toString()).then( response => console.log(response));

    fetch('acceso.php?' + parametros.toString())
    .then(response =>  response.json())
    .then(data => {console.log(response)});
*/
    fetch('acceso.php?' + parametros.toString())
    .then(response => {
      const ct = response.headers.get('content-type') || '';
      if (ct.indexOf('application/json') !== -1) {
        return response.json();
      }
      return response.text().then(text => { throw new Error('Non-JSON response:\n' + text); });
    })
    .then(data => {
      if (data && data.error) {
        console.error('Server error:', data);
        alert('Error: ' + (data.mensaje || 'Error en servidor'));
        return;
      }
      const lista = document.getElementById('datos');
      console.log(data);
      if (!Array.isArray(data)) {
        console.warn('Respuesta inesperada (no es array):', data);
        return;
      }
      data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = JSON.stringify(item);
        lista.appendChild(li);
        window.location.href = 'menu.html?par_accion=agregar&id=0';
      });
    })
    .catch(error => {
      console.error('Error js:', error);
      alert('Error en la petición. Mira la consola (Network/Response) para más detalles.');
    });
    
  }