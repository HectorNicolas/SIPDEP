$(document).ready(function(e){
	$('#inputApellidos').on('focusin', function(){
    	writeUser();
    });
});


function writeUser() {
    var nombre = $("#nombre").val().split(" ")
    var apellidos = $("#apellidos").val().split(" ");
    var username = nombre[0] + '.' + apellidos[0];

    username = username.toLowerCase();
    username = username.replace("á", "a");
    username = username.replace("é", "e");
    username = username.replace("í", "i");
    username = username.replace("ó", "o");
    username = username.replace("ú", "u");

    if (nombre.length != 0 && apellidos.length != 0 && username != ".") {
        $('#inputApellidos').val(username);
    }
}
