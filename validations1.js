$(document).ready(function(e){
	/*Se verifica que el control pierda foco(seleccione otro campo de la forma) para realizar la verificacion
	de entradas correctas para cada uno de los campos que se estan modificando.*/
    $('#nombre').on('focusout',function(){
    	var sName = $('#nombre').val();
		validateName(sName);
    });
    $('#apellidos').on('focusout',function(){
    	var sSurName = $('#apellidos').val();
    	validateName(sSurName);
    });
    $('#inputApellidos').on('focusout', function(){
    	var sUsername = $('#inputApellidos').val();
    	validateUser(sUsername);
    });
    $('#inputCorreo').on('focusout',function(){
    	var SEmail = $('#inputCorreo').val();
    	validateEmail(SEmail);
    });
    $('#password1').on('focusout', function(){
    	var sPass = $('#password1').val();
    	validatePass(sPass);
    });
    $('#password2').on('focusout', function(){
    	var pass1 = $('#password1').val();
    	var pass2 = $('#password2').val();
    	validateSamePass(pass1,  pass2);
    });
    $('#username').on('focusout', function(){
    	var sUsernamelog = $('#username').val();
    	validateUser(sUsernamelog);
    });
    $('#pwdlog').on('focusout', function(){
    	var sPwd = $('#pwdlog').val();
    	validatePass(sPwd);
    });
    /*Se verifica finalmente cuando el usuario hace click en registrar si los campos son correctos.
    Si no es asi se emite una alerta para decirle que campo esta incorrecto,  ademas que no se submite
    el form.*/
    $('#btnSubmit').click(function(e){
    	var sName = $('#nombre').val();
    	var sSurName = $('#apellidos').val();
    	var sUsername = $('#inputApellidos').val();
    	var SEmail = $('#inputCorreo').val();
    	var sPass = $('#password1').val();
    	var pass2 = $('#password2').val();
    	if(validateName(sName)&&validateName(sSurName)&&validateUser(sUsername)&&validateEmail(SEmail)&&validatePass(sPass)&&validateSamePass(pass1,  pass2)){
   		} else{
   			e.preventDefault();
   			return false;
   		}
    });
    $('#submitlog').click(function(e){
    	var sUsername = $('#username').val();
    	var sPass = $('#pwd').val();
    	if(validateUser(sUsername)&&validatePass(sPass)){
   		} else{
   			e.preventDefault();
   			return false;
   		}
    });

	/*Verefiaca Cambio de Password para el Usuario*/
	$('#newpassword').on('focusout', function(){
    	var nPass = $('#newpassword').val();
    	validatePassChange(nPass);
    });

    $('#newpassword2').on('focusout', function(){
    	var pass1Change = $('#newpassword').val();
    	var pass2Change = $('#newpassword2').val();
    	validateSamePassChange(pass1Change,  pass2Change);
    });

	$('#submitChangePassword').click(function(e){    	
    	var nPass = $('#newpassword').val();        
    	var pass2Change = $('#newpassword2').val();
    	if(validatePassChange(nPass)&&validateSamePassChange(nPass,  pass2Change)){
				alert("Se cambio la contraseña correctamente");
   		} else{            
   			e.preventDefault();
   			return false;
   		}
    });	
});

function validateName(sName){
	var filter = /^[áéíóúaÁÉÍÓÚÑña-zA-Z]+\s*[áéíóúÁÉÍÓÚa-zA-Z]+$/;

	if(sName.length == 0){
		alert("Debes completar el campo Nombre y/o Apellidos.");
		return false;
	} else if(filter.test(sName) == false){
		alert("Solo puedes escribir letras minusculas y/o mayúsculas en los campos Nombre y Apellidos");
		return false;
	} else{
		return true;
	}
}

function validateUser(sUsername){
	var filter = /^[a-zA-Z]+[_.]?[a-zA-Z]+$/;

	if(sUsername.length == 0){
		alert("Debes completar el campo Nombre de Usuario.");
		return false;
	} else if(filter.test(sUsername) == false){
		alert("Solo puedes escribir letras y un punto o guion como caracter intermedio");
		return false;
	} else{
		return true;
	}
}

function validateEmail(SEmail){
	var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;

	if(SEmail.length == 0){
		alert("Debes completar el campo Email.");
		return false;
	} else if(filter.test(SEmail) == false){
		alert("Este correo no es valido");
		return false;
	} else{
		return true;
	}
}

function validatePass(sPass){
	var filter = /\s/;
	if(sPass.length < 4){
		alert("La contraseña debe contener más de 4 caracteres");
		return false;
	} else if(sPass.length > 64){
		alert("La contraseña debe contener menos de 64 caracteres");
		return false;
	} else if(filter.test(sPass) == true){
		alert("La contraseña no puede contener espacios");
		return false;
	} else{
		return true;
	}
}

function validateSamePass(pass1 , pass2){
	if(pass1 != pass2){
		alert("Las constraseñas no coinciden. Asegúrate de que hayas escrito bien tu constraseña.");
		return false;
	}
}


function validatePassChange(nPass){
	var filter = /\s/;
	if(nPass.length < 4){
		alert("La contraseña debe contener más de 4 caracteres");
		return false;
	} else if(nPass.length > 64){
		alert("La contraseña debe contener menos de 64 caracteres");
		return false;
	} else if(filter.test(nPass) == true){
		alert("La contraseña no puede contener espacios");
		return false;
	} else{
		return true;
	}
}

function validateSamePassChange(pass1Change , pass2Change){
	if(pass1Change != pass2Change){
		alert("Las constraseñas no coinciden. Asegurate de que hayas escrito bien tu constraseña.");
		return false;
	}
    else
        return true;
}