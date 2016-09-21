$(document).ready(function () {
	//validacion de la form de signup
	$('#signupForm').validate({
		rules: {
			nombre: {
				required: true,
				pattern: /^[áéíóúaÁÉÍÓÚÑña-zA-Z]+\s?[áéíóúaÁÉÍÓÚÑña-zA-Z]*$/
			},
			apellidos: {
				required: true,
				pattern: /^[áéíóúaÁÉÍÓÚÑña-zA-Z]+\s?[áéíóúaÁÉÍÓÚÑña-zA-Z]*$/
			},
			username: {
				required: true,
				pattern: /^[a-zA-Z]+[.|_][a-zA-Z]*$/
			},
			correo: {
				required: true,
				email: true
			},
			passwd: {
				required: true,
				pattern: /^[^\s]+$/
			},
			passwd2: {
				required: true,
				pattern: /^[^\s]+$/,
				equalTo: "#password1"
			},
			fechaNac: "required",
			sexo: "required"
		},
		messages: {
			nombre: {
				required: "Por favor escribe tu nombre",
				pattern: "Solo puedes escrribir letras separadas de un espacio"
			},
			apellidos: {
				required: "Por favor escribe tus apellidos",
				pattern: "Solo puedes escribir letras separadas de un espacio"
			},
			username: {
				required: "Por favor escribe tu nombre de usuario",
				pattern: "Tu nombre de usuario solo puede contener palabras separadas de '.'' o '_'"
			},
			correo: "Por favor escribe un correo valido",
			passwd:{
				required: "Por favor escribe una contraseña",
				pattern: "Las contraseñas no deben contener espacios"
			},
			passwd2: {
				required: "Por favor escribe la contraseña de confirmacion",
				pattern: "Las contraseñas no deben contener espacios",
				equalTo: "Por favor escribe la misma contraseña de arriba"
			},
			fechaNAC: "Por favor selecciona una fecha valida",
			sexo: "Por favor selecciona un Sexo"
		}
	})
	$('#loginForm').validate({
		rules: {
			username: {
				required: true,
				pattern: /^[a-zA-Z]*[.|_][a-zA-Z]*$/
			},
			password: {
				required: true,
				pattern: /^[^\s]+$/
			}
		},
		messages: {
			username: {
				required: "Por favor escribe tu nombre de usuario",
				pattern: "Tu nombre de usuario solo puede contener palabras separadas de '.'' o '_'"
			},
			password: {
				required: "Por favor escribe una contraseña",
				pattern: "Las contraseñas no deben contener espacios"
			}
		}
	})
	$('#passChangeForm').validate({
		rules: {
			oldpassword: {
				required: true,
				pattern: /^[^\s]+$/
			},
			newpassword: {
				required: true,
				pattern: /^[^\s]+$/
			},
			newpassword2: {
				required: true,
				pattern: /^[^\s]+$/,
				equalTo: "#newpassword"
			}
		},
		messages: {
			oldpassword: {
				required: "Debes completar este campo",
				pattern: "Las contraseñas no deben incluir espacios"
			},
			newpassword: {
				required: "Debes completar este campo",
				pattern: "Las contraseñas no deben incluir espacios"
			},
			newpassword2: {
				required: "Debes completar este campo",
				pattern: "Las contraseñas no deben incluir espacios",
				equalTo: "Las contraseñas no coinciden"
			}
		}
	})
});