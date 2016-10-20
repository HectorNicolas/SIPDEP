$(document).ready(function(e){
	$('#inputApellidos').on('focusin', function(){
    	writeUser('inputApellidos');
    });
	$('#inputUsername').on('focusin', function(){
        writeUser('inputUsername');
    });
	$( "#tabs" ).tabs();	
	$( "#tabs2").tabs();
	$('#start').on('click', function () {
		muestraModulo('moduloA');
	})
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

function toggle1(showHideDiv, switchImgTag) 
{
	var ele = document.getElementById(showHideDiv);
	var imageEle = document.getElementById(switchImgTag);
	if(ele.style.display == "block") {
			ele.style.display = "none";
	imageEle.innerHTML = '<img src="img/plus.png">';
	}
	else {
			ele.style.display = "block";
			imageEle.innerHTML = '<img src="img/minus.png"">';
	}
}

function toggle2(showHideDiv1, switchImgTag1) 
{
	var ele = document.getElementById(showHideDiv1);
	var imageEle = document.getElementById(switchImgTag1);
	if(ele.style.display == "block") {
			ele.style.display = "none";
	imageEle.innerHTML = '<img src="img/plus.png">';
	}
	else {
			ele.style.display = "block";
			imageEle.innerHTML = '<img src="img/minus.png"">';
	}
}

function toggle3(showHideDiv2, switchImgTag2) 
{
	var ele = document.getElementById(showHideDiv2);
	var imageEle = document.getElementById(switchImgTag2);
	if(ele.style.display == "block") {
			ele.style.display = "none";
	imageEle.innerHTML = '<img src="img/plus.png">';
	}
	else {
			ele.style.display = "block";
			imageEle.innerHTML = '<img src="img/minus.png"">';
	}
}

function toggle4(showHideDiv3, switchImgTag3) 
{
	var ele = document.getElementById(showHideDiv3);
	var imageEle = document.getElementById(switchImgTag3);
	if(ele.style.display == "block") {
			ele.style.display = "none";
	imageEle.innerHTML = '<img src="img/plus.png">';
	}
	else {
			ele.style.display = "block";
			imageEle.innerHTML = '<img src="img/minus.png"">';
	}
}

function muestraModulo(nombre)
{
	$('#' + nombre).show();
    $("#tabs2").tabs("option", "active", 1);
    $("#start").hide();
}