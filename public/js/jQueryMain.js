$(document).ready(function(e){
	$('#inputApellidos').on('focusin', function(){
    	writeUser('inputApellidos');
    });
	$('#inputUsername').on('focusin', function(){
        writeUser('inputUsername');
    });
	$( "#tabs").tabs();	
	$( "#tabs2").tabs();
	$( "#tabs3").tabs();

	$('#moduloA').on('click', function () {
		muestraModulo('moduloA');
	})
	$('#moduloB').on('click', function () {
		muestraModulo('moduloB');
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
	switch(nombre)
	{
		case 'moduloA':
		    $("#tabs-1").hide();
		    $('#tabs-2').show();
		    $("#tabs2").tabs("option", "active", 1);
		    $('#' + nombre).show();
		    $("#tabs3").hide();
		    $('#tabs2').show();
		break;		
		case 'moduloB':
			$("#tabs-1").hide();
		    $('#tabs-2').show();
		    $("#tabs3").tabs("option", "active", 1);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $('#tabs3').show();
		break;
	}	
}

function muestraInstruccionesGral(){
	$("#tabs-1").show();
	$('#tabs-2').hide();
}

function changeColor(x)
{
    var modA = document.getElementById('moduloA');
	modA.style.background="#ffffff";
	var modB = document.getElementById('moduloB');
	modB.style.background="#ffffff";
	var modC = document.getElementById('moduloC');
	modC.style.background="#ffffff";

    if(x.style.background=="rgb(247, 211, 88)")//Si el Color de Fondo es Amarilo
    {
        x.style.background="#ffffff";//Cambia a Color Azul
    }else{
        x.style.background="rgb(247, 211, 88)";
    }
    return false;
}