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
			pass1: {
				required: true,
				pattern: /^[^\s]+$/
			},
			pass2: {
				required: true,
				pattern: /^[^\s]+$/,
				equalTo: "#password1"
			},
			fecha: "required"
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
			pass1:{
				required: "Por favor escribe una contraseña",
				pattern: "Las contraseñas no deben contener espacios"
			},
			pass2: {
				required: "Por favor escribe la contraseña de confirmacion",
				pattern: "Las contraseñas no deben contener espacios",
				equalTo: "Por favor escribe la misma contraseña de arriba"
			},
			fecha: "Por favor selecciona una fecha valida"
		}
	})
	$('#loginForm').validate({
		rules: {
			username: {
				required: true,
				pattern: /^[a-zA-Z]*[.|_][a-zA-Z]*$/
			},
			password1: {
				required: true,
				pattern: /^[^\s]+$/
			}
		},
		messages: {
			username: {
				required: "Por favor escribe tu nombre de usuario",
				pattern: "Tu nombre de usuario solo puede contener palabras separadas de '.'' o '_'"
			},
			password1: {
				required: "Por favor escribe una contraseña",
				pattern: "Las contraseñas no deben contener espacios"
			}
		}
	})
});