$(document).ready(function(e){
	$('#inputApellidos').on('focusin', function(){
    	writeUser('inputApellidos');
    });
	$('#inputUsername').on('focusin', function(){
        writeUser('inputUsername');
    });
	$( "#tabs").tabs();	
	$( "#tabs2").tabs();//Modulo A
	$( "#tabs3").tabs();//Modulo B
	$( "#tabs4").tabs();//Modulo C
	$( "#tabs5").tabs();//Modulo D
	$( "#tabs6").tabs();//Modulo E
	$( "#tabs7").tabs();//Modulo F
	$( "#tabs8").tabs();//Modulo G
	$( "#tabs9").tabs();//Modulo H
	$( "#tabs10").tabs();//Modulo I
	$( "#tabs11").tabs();//Modulo J
	$( "#tabs12").tabs();//Modulo K
	$( "#tabs13").tabs();//Modulo L
	$( "#tabs14").tabs();//Modulo M
	$( "#tabs15").tabs();//Modulo N
	$( "#tabs16").tabs();//Modulo O
	$( "#tabs17").tabs();//Modulo P
	$( "#tabs18").tabs();//Modulo Q
	$( "#tabs19").tabs();//Modulo R
	$( "#tabs20").tabs();//Modulo S
	$( "#tabs21").tabs();//Modulo T
	$( "#tabs22").tabs();//Modulo U
	$( "#tabs23").tabs();//Modulo V
	$( "#tabs24").tabs();//Modulo W
	$( "#tabs25").tabs();//Modulo X
	$( "#tabs26").tabs();//Modulo Y
	$( "#tabs27").tabs();//Modulo Z

	// Muestra el Modulo Seleccionado
	$('#moduloA').on('click', function () {
		muestraModulo('moduloA', 0);
	})
	$('#moduloB').on('click', function () {
		muestraModulo('moduloB', 0);
	})
	$('#moduloC').on('click', function () {
		muestraModulo('moduloC', 0);
	})
	$('#moduloD').on('click', function () { 
		muestraModulo('moduloD', 0);
	})
	$('#moduloE').on('click', function () {
		muestraModulo('moduloE', 0);
	})
	$('#moduloF').on('click', function () {
		muestraModulo('moduloF', 0);
	})
	$('#moduloG').on('click', function () {
		muestraModulo('moduloG', 0);
	})
	$('#moduloH').on('click', function () { 
		muestraModulo('moduloH', 0);
	})	
	$('#moduloI').on('click', function () {
		muestraModulo('modulOI', 0);
	})
	$('#moduloJ').on('click', function () {
		muestraModulo('moduloJ', 0);
	})
	$('#moduloK').on('click', function () {
		muestraModulo('moduloK', 0);
	})
	$('#moduloL').on('click', function () { 
		muestraModulo('moduloL', 0);
	})	
	$('#moduloM').on('click', function () {
		muestraModulo('moduloM', 0);
	})
	$('#moduloN').on('click', function () {
		muestraModulo('moduloN', 0);
	})
	$('#moduloO').on('click', function () {
		muestraModulo('moduloO', 0);
	})
	$('#moduloP').on('click', function () { 
		muestraModulo('moduloP', 0);
	})	
	$('#moduloQ').on('click', function () {
		muestraModulo('moduloQ', 0);
	})
	$('#moduloR').on('click', function () {
		muestraModulo('moduloR', 0);
	})
	$('#moduloS').on('click', function () {
		muestraModulo('moduloS', 0);
	})
	$('#moduloT').on('click', function () { 
		muestraModulo('moduloT', 0);
	})		
	$('#moduloU').on('click', function () {
		muestraModulo('moduloU', 0);
	})
	$('#moduloV').on('click', function () {
		muestraModulo('moduloV', 0);
	})
	$('#moduloW').on('click', function () {
		muestraModulo('moduloW', 0);
	})
	$('#moduloX').on('click', function () { 
		muestraModulo('moduloX', 0);
	})	
	$('#moduloY').on('click', function () {
		muestraModulo('moduloY', 0);
	})
	$('#moduloZ').on('click', function () {
		muestraModulo('moduloZ', 0);
	})
	
	// Oculta Boton Comenzar de Cada Modulo
	$('#start').on('click', function () { 
		$("#start").hide();
	})
	$('#start1').on('click', function () { 
		$("#start1").hide();
	})
	$('#start2').on('click', function () { 
		$("#start2").hide();
	})
	$('#start3').on('click', function () { 
		$("#start3").hide();
	})
	$('#start4').on('click', function () { 
		$("#start4").hide();
	})
	$('#start5').on('click', function () { 
		$("#start5").hide();
	})
	$('#start6').on('click', function () { 
		$("#start6").hide();
	})
	$('#start7').on('click', function () { 
		$("#start7").hide();
	})
	$('#start8').on('click', function () { 
		$("#start8").hide();
	})
	$('#start9').on('click', function () { 
		$("#start9").hide();
	})
	$('#start10').on('click', function () { 
		$("#start10").hide();
	})
	$('#start11').on('click', function () { 
		$("#start11").hide();
	})
	$('#start12').on('click', function () { 
		$("#start12").hide();
	})
	$('#start13').on('click', function () { 
		$("#start13").hide();
	})
	$('#start14').on('click', function () { 
		$("#start14").hide();
	})
	$('#start15').on('click', function () { 
		$("#start15").hide();
	})
	$('#start16').on('click', function () { 
		$("#start16").hide();
	})
	$('#start17').on('click', function () { 
		$("#start17").hide();
	})
	$('#start18').on('click', function () { 
		$("#start18").hide();
	})
	$('#start19').on('click', function () { 
		$("#start19").hide();
	})	
	$('#start20').on('click', function () { 
		$("#start20").hide();
	})
	$('#start21').on('click', function () { 
		$("#start21").hide();
	})
	$('#start22').on('click', function () { 
		$("#start22").hide();
	})
	$('#start23').on('click', function () { 
		$("#start23").hide();
	})
	$('#start24').on('click', function () { 
		$("#start24").hide();
	})
	$('#start25').on('click', function () { 
		$("#start25").hide();
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

function muestraModulo(nombre, numPestana)
{
	$("#tabs-1").hide();
    $('#tabs-2').show();
	switch(nombre)
	{
		case 'moduloA':		    
		    $("#tabs2").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs3").hide();
		    $("#tabs4").hide();
		    $("#tabs5").hide();
		    $("#tabs6").hide();
		    $("#tabs7").hide();
		    $("#tabs8").hide();
		    $("#tabs9").hide();
		    $('#tabs2').show();
		break;		
		case 'moduloB':			
		    $("#tabs3").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $("#tabs4").hide();
		    $("#tabs5").hide();
		    $("#tabs6").hide();
		    $("#tabs7").hide();
		    $("#tabs8").hide();
		    $("#tabs9").hide();
		    $('#tabs3').show();
		break;
		case 'moduloC':			
		    $("#tabs4").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $("#tabs3").hide();
		    $("#tabs5").hide();
		    $("#tabs6").hide();
		    $("#tabs7").hide();
		    $("#tabs8").hide();
		    $("#tabs9").hide();
		    $('#tabs4').show();
		break;
		case 'moduloD':			
		    $("#tabs5").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $("#tabs3").hide();
		    $('#tabs4').hide();
		    $("#tabs6").hide();
		    $("#tabs7").hide();
		    $("#tabs8").hide();
		    $("#tabs9").hide();
		    $("#tabs5").show();
		break;
		case 'moduloE':			
		    $("#tabs6").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $("#tabs3").hide();
		    $('#tabs4').hide();
		    $("#tabs5").hide();
		    $("#tabs7").hide();
		    $("#tabs8").hide();
		    $("#tabs9").hide();
			$("#tabs6").show();
		break;
		case 'moduloF':			
		    $("#tabs7").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $("#tabs3").hide();
		    $('#tabs4').hide();
		    $("#tabs5").hide();
		    $("#tabs6").hide();
		    $("#tabs8").hide();
		    $("#tabs9").hide();
			$("#tabs7").show();
		break;
		case 'moduloG':			
		    $("#tabs8").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $("#tabs3").hide();
		    $('#tabs4').hide();
		    $("#tabs5").hide();
		    $("#tabs6").hide();
		    $("#tabs7").hide();
		    $("#tabs9").hide();
			$("#tabs8").show();
		break;
		case 'moduloH':			
		    $("#tabs9").tabs("option", "active", numPestana);
		    $('#' + nombre).show();
		    $("#tabs2").hide();
		    $("#tabs3").hide();
		    $('#tabs4').hide();
		    $("#tabs5").hide();
		    $("#tabs6").hide();
		    $("#tabs7").hide();
		    $("#tabs8").hide();
			$("#tabs9").show();
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
	var modD = document.getElementById('moduloD');
	modD.style.background="#ffffff";
	var modE = document.getElementById('moduloE');
	modE.style.background="#ffffff";
	var modF = document.getElementById('moduloF');
	modF.style.background="#ffffff";
	var modG = document.getElementById('moduloG');
	modG.style.background="#ffffff";
	var modH = document.getElementById('moduloH');
	modH.style.background="#ffffff";
	var modI = document.getElementById('moduloI');
	modI.style.background="#ffffff";
	var modJ = document.getElementById('moduloJ');
	modJ.style.background="#ffffff";
	var modK = document.getElementById('moduloK');
	modK.style.background="#ffffff";
	var modL = document.getElementById('moduloL');
	modL.style.background="#ffffff";
	var modM = document.getElementById('moduloM');
	modM.style.background="#ffffff";
	var modN = document.getElementById('moduloN');
	modN.style.background="#ffffff";
	var modO = document.getElementById('moduloO');
	modO.style.background="#ffffff";
	var modP = document.getElementById('moduloP');
	modP.style.background="#ffffff";
	var modQ = document.getElementById('moduloQ');
	modQ.style.background="#ffffff";
	var modR = document.getElementById('moduloR');
	modR.style.background="#ffffff";
	var modS = document.getElementById('moduloS');
	modS.style.background="#ffffff";
	var modT = document.getElementById('moduloT');
	modT.style.background="#ffffff";
	var modU = document.getElementById('moduloU');
	modU.style.background="#ffffff";
	var modV = document.getElementById('moduloV');
	modV.style.background="#ffffff";
	var modW = document.getElementById('moduloW');
	modW.style.background="#ffffff";
	var modX = document.getElementById('moduloX');
	modX.style.background="#ffffff";;
	var modY = document.getElementById('moduloY');
	modY.style.background="#ffffff";
	var modZ = document.getElementById('moduloZ');
	modZ.style.background="#ffffff";
    if(x.style.background=="#74818E")//Si el Color de Fondo es Azul
    {
        x.style.background="#ffffff";
    }else{
        x.style.background="#74818E";
    }
    return false;
}