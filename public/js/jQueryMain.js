$(document).ready(function(e){
	$('#inputApellidos').on('focusin', function(){
    	writeUser('inputApellidos');
    });
	$('#inputUsername').on('focusin', function(){
        writeUser('inputUsername');
    });
});


function writeUser(ID) {
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
        $('#' + ID).val(username);
    }
}