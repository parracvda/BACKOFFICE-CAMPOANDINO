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
    .then(response =>  response.json())
    .then(data => {
        const lista = document.getElementById('datos');
        console.log(data);
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = JSON.stringify(item);
            lista.appendChild(li);
            window.location.href = 'registros.html';
            
        });
    })
    .catch(error => console.error('Error js:', error));
    
  }