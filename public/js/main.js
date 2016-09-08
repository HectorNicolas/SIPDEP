/// validateNombre(input)
/// Valida que los input de tipo texto donde se introduce un nombre o un apellido
/// sean correctos
function validateNombre(input) {
    var regEx = /[áéíóúaÁÉÍÓÚÑña-zA-Z]+\s*[áéíóúÁÉÍÓÚa-zA-Z]+$/;

    if (input.value.length == 0) {
        input.setCustomValidity("Debes completar este campo");
    } else if (regEx.test(input.value) == false) {
        input.setCustomValidity("Sólo puedes escribir letras de la A-Z o a-z en mayúsculas o minúsculas. Asegurate de no dejar espacios al final del nombre");
    } else {
        input.setCustomValidity("");
    }
}

/// validateUsername(input)
/// Valida que el nombre de usuario, ya sea de usuario normal o aplicador
/// sea un nombre correcto
function validateUsername(input) {
    var regEx = /^[a-z]+[._-]?[a-z]+$/;

    if (input.value.length == 0) {
        input.setCustomValidity("Debes completar este campo");
    } else if (regEx.test(input.value) == false) {
        input.setCustomValidity("Sólo puedes escribir letras de la a-z y un punto o guion bajo como caracter intermedio");
    } else {
        input.setCustomValidity("");
    }
}

/// onfocusUsername(input)
/// Genera un nombre de usuario a partir del nombre y apellidos
/// del usuario y del aplicador
function onfocusUsername(input) {
    var nombre = document.getElementById("nombre").value.split(" ")
    var apellidos = document.getElementById("apellidos").value.split(" ");
    var username = nombre[0] + '.' + apellidos[0];

    username = username.toLowerCase();
    username = username.replace("á", "a");
    username = username.replace("é", "e");
    username = username.replace("í", "i");
    username = username.replace("ó", "o");
    username = username.replace("ú", "u");

    if (nombre.length != 0 && apellidos.length != 0 && username != ".") {
        input.value = username;
    }
}

/// validatePassword(input)
/// Valida que las contraseñas no contengan caracterés como el espacio, el guion bajo y el acento
/// y que se introduzcan entre 4 y 64 caracteres alfanuméricos
function validatePassword(input) {
    var regEx = /^[+-*_\w]{6,64}$/;

    if (input.value.length < 6) {
        input.setCustomValidity("La longitud de la contraseña debe ser mayor de 4 caractéres");
    } else if (input.value.length > 64) {
        input.setCustomValidity("La longitud de la contraseña debe ser menor de 64 caractéres");
    } else if (input.value.length == 0) {
        input.setCustomValidity("Debes completar este campo. Puedes escribir letras de la A-Z o a-z en mayúsculas o minúsculas y números");
    } else if (regEx.test(input.value) == false) {
        input.setCustomValidity("Sólo puedes escribir letras de la A-Z o a-z en mayúsculas o minúsculas y números");
    } else {
        input.setCustomValidity("");
    }


}

/// validateEmail(input)
/// Valida que un email tenga el formato correcto, por ejemplo
/// email@email.com
function validateEmail(input) {
    var regEx = /[\w.]+@([A-z0-9]+\.)+[A-z]{1,10}/;

    if (input.value.length == 0) {
        input.setCustomValidity("Debes completar este campo");
    } else if (input.value.indexOf('@') == -1) {
        input.setCustomValidity("No se encontró el símbolo @ en el correo, asegurate de ingresarlo");
    } else if (input.value.indexOf('.') == -1) {
        input.setCustomValidity("No se encontró el símbolo del punto(.) en el correo, asegurate de ingresarlo");
    } else if (regEx.test(input.value) == false) {
        input.setCustomValidity("Asegurate de incluir el símbolo @ y el punto(.) y de no incluir caracteres extraños o espacios \nPor ejemplo: ejemplo@email.com");
    } else {
        input.setCustomValidity("");
    }
}

/// validateTelefono(input)
/// valida que solo se introduzcan números en el input Telefono
///
function validateTelefono(input) {
    var regEx = /^\d{7,15}$/;

    if (input.value.length < 7) {
        input.setCustomValidity("Debes introducir 7 digitos al menos");
    } else if (regEx.test(input.value) == false) {
        input.setCustomValidity("Sólo pudes introducir números del 0 al 9");
    } else if (input.value.length > 15) {
        input.setCustomValidity("Debes introducir menos de 15 digitos");
    } else {
        input.setCustomValidity("");
    }
}

/// validatePasswordMatch(input)
/// Valida que las dos contraseñas ingresadas en el formulario
/// sean la misma
function validatePasswordMatch(input) {
    var passwd1 = document.getElementById("password1").value;
    var passwd2 = document.getElementById("password2").value;

    if (passwd1 != passwd2) {
        input.setCustomValidity("Las contraseñas no coinciden. Verifica que hayas escrito correctamente las dos contraseñas");
    } else {
        input.setCustomValidity("");
    }
}

/// validateCveUnica(input)
/// Valida la clave única de un alumno, para determinar que los
/// caracteres de entrada son digitos
function validateCveUnica(input) {
    var regEx = /\d{6,9}/;

    if (input.value.length == 0) {
        input.setCustomValidity("Debes completar este cmapo");
    } else if (regEx.test(input.value) == false) {
        input.setCustomValidity("Sólo puedes ingresar números");
    } else if (input.value.length < 5) {
        input.setCustomValidity("La longitud de la clave debe ser mayor de 5 dígitos");
    } else if (input.value.length > 9) {
        input.setCustomValidity("La longitud de la clave debe ser menor de 10 dígitos");
    } else {
        input.setCustomValidity("");
    }
}