$(document).ready(function () {
	//validacion de la form de signup
	$('#signupForm').validate({
		rules: {
			nombre: {
				required: true,
				pattern: /^[áéíóúaÁÉÍÓÚÑña-zA-Z]+\S?[áéíóúaÁÉÍÓÚÑña-zA-Z]*$/
			},
			apellidos: {
				required: true,
				pattern: /^[áéíóúaÁÉÍÓÚÑña-zA-Z]+\S?[áéíóúaÁÉÍÓÚÑña-zA-Z]*$/
			},
			username: {
				required: true,
				pattern: /^[a-zA-Z]+.|\_[a-zA-Z]*$/
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
				pattern: "No coincide"
			},
			apellidos: "Por favor escribe tu nombre",
			username: {
				required: "Por favor escribe tu nombre de usuario",
				minlenght: "Tu nombre de usuario debe contener al menos 2 caracteres"
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
				pattern: /^[a-zA-Z]*\S?[a-zA-Z]*$/
			},
			password1: {
				required: true,
				pattern: /^[^\s]+$/
			}
		},
		messages: {
			username: {
				required: "Por favor escribe tu nombre de usuario",
				pattern: "No coincide"
			},
			password1: {
				required: "Por favor escribe una contraseña",
				pattern: "Las contraseñas no deben contener espacios"
			}
		}
	})
});