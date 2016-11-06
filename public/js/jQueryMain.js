var parametros = {modulo : '', respuesta : '', pregunta : '', nombreUs : '', aplicador : '', test : '', fecha : ''};
$(document).ready(function(e){
	$('#inputApellidos').on('focusin', function(){
    	writeUser('inputApellidos');
    });
	$('#inputUsername').on('focusin', function(){
        writeUser('inputUsername');
    });

    //$('#entrevista').hide();
    //$('#instrucciones').load('../files/textfiles.html #generales');
    $('#contentPrimero').load('../files/textfiles.html #primero');
    $('#contentDivImg').load('../files/textfiles.html #DivImg');
    $('#contentDivImg1').load('../files/textfiles.html #DivImg1');
    $('#contentDivImg2').load('../files/textfiles.html #DivImg2');
    $('#contentDivImg3').load('../files/textfiles.html #DivImg3');


    $('#entrevista').click(function () {
    	if($('#letraMod').val() == '')
    	{
    		alert("Por Favor Selecciona Un Modulo Primero");
    		$("#tabs").tabs("option", "active", 0);
    	}
    		
    })

	$( "#tabs" ).tabs();	
	$( "#tabs2").tabs();
	
	$('.gn-scroller li a').click(function () {
		var id = ($(this).attr('id'));
		parametros.modulo = id.substr(id.length-1);
		$('#letraMod').val(($(this).attr('id')));
		//alert($('#letraMod').val());
		var letra = $('#letraMod').val();
		var nombre = $(this).attr('name');
		muestraModulo(letra,nombre,0);
	});

	
	 //Oculta Boton Comenzar de Cada Modulo
	$('#start').on('click', function () { 
		$("#start").hide();
		$.ajax({
			method: "get",
			url: "obtenerPregunta",
			data: parametros,
			dataType: "text"
		}).done(function (data) {
			$("#area").html(data);
			$("#pregunta").val(data);
			$("#tabs2").tabs("option", "active", 1);
			$('#PreguntasTab').show();
		});
		return false;
	});

	$('#siguiente').click(function () {
		var datos = obtenerParametros();
		datos.respuesta = obtenerRespuesta();
		$.ajax({
			method: "get",
			url: "guardaRespuesta",
			data: datos
		}).done(function () {
			alert("se guardo la respuesta satisfactoriamente");
			/*$.ajax({
				method : "get",
				url : "siguientePregunta",
				data : parametros,
				dataType : "text"
			}).done(function (data) {
				//cosas magicas
			});*/
		});
		return false;
	});
	

});

function obtenerRespuesta() {
	return $('input[name=respuesta]:checked', '#botones').val();
}

function obtenerParametros() {
	var param = {nombreUs : '', aplicador : '', test : '', fecha : '', pregunta : '', respuesta : ''};
	param.nombreUs = $("#usuario").val();
	param.aplicador = $('#aplicador').val();
	param.test = $('#aplicador').val();
	param.fecha = $('#fecha').val();
	param.pregunta = $('#pregunta').val();
	param.respuesta = '';
	return param;
}

function obtenerSiguientePregunta(argument) {
	
}

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

function muestraModulo(letra, nombre, numTab)
{
	var add = "../files/textfiles.html #mod" + letra;
	$('#instMod').load(add);
	$('#areaNombre').html(nombre);
	$("#tabs").tabs("option", "active", 1);

}

function muestraInstruccionesGral(){
	$("#tabs-1").show();
	$('#tabs-2').hide();
}

function fondo(x)
{
	var modA = document.getElementById('moduloA');
	modA.style.background="#ffffff";
	modA.style.borderBottom="1px solid #c6d0da";
	var modB = document.getElementById('moduloB');
	modB.style.background="#ffffff";
	modB.style.borderBottom="1px solid #c6d0da";
	var modC = document.getElementById('moduloC');
	modC.style.background="#ffffff";
	modC.style.borderBottom="1px solid #c6d0da";
	var modD = document.getElementById('moduloD');
	modD.style.background="#ffffff";
	modD.style.borderBottom="1px solid #c6d0da";
	var modE = document.getElementById('moduloE');
	modE.style.background="#ffffff";
	modE.style.borderBottom="1px solid #c6d0da";
	var modF = document.getElementById('moduloF');
	modF.style.background="#ffffff";
	modF.style.borderBottom="1px solid #c6d0da";
	var modG = document.getElementById('moduloG');
	modG.style.background="#ffffff";
	modG.style.borderBottom="1px solid #c6d0da";
	var modH = document.getElementById('moduloH');
	modH.style.background="#ffffff";
	modH.style.borderBottom="1px solid #c6d0da";
	var modI = document.getElementById('moduloI');
	modI.style.background="#ffffff";
	modI.style.borderBottom="1px solid #c6d0da";
	var modJ = document.getElementById('moduloJ');
	modJ.style.background="#ffffff";
	modJ.style.borderBottom="1px solid #c6d0da";
	var modK = document.getElementById('moduloK');
	modK.style.background="#ffffff";
	modK.style.borderBottom="1px solid #c6d0da";
	var modL = document.getElementById('moduloL');
	modL.style.background="#ffffff";
	modL.style.borderBottom="1px solid #c6d0da";
	var modM = document.getElementById('moduloM');
	modM.style.background="#ffffff";
	modM.style.borderBottom="1px solid #c6d0da";
	var modN = document.getElementById('moduloN');
	modN.style.background="#ffffff";
	modN.style.borderBottom="1px solid #c6d0da";
	var modO = document.getElementById('moduloO');
	modO.style.background="#ffffff";
	modO.style.borderBottom="1px solid #c6d0da";
	var modP = document.getElementById('moduloP');
	modP.style.background="#ffffff";
	modP.style.borderBottom="1px solid #c6d0da";
	var modQ = document.getElementById('moduloQ');
	modQ.style.background="#ffffff";
	modQ.style.borderBottom="1px solid #c6d0da";
	var modR = document.getElementById('moduloR');
	modR.style.background="#ffffff";
	modR.style.borderBottom="1px solid #c6d0da";
	var modS = document.getElementById('moduloS');
	modS.style.background="#ffffff";
	modS.style.borderBottom="1px solid #c6d0da";
	var modT = document.getElementById('moduloT');
	modT.style.background="#ffffff";
	modT.style.borderBottom="1px solid #c6d0da";
	var modU = document.getElementById('moduloU');
	modU.style.background="#ffffff";
	modU.style.borderBottom="1px solid #c6d0da";
	var modV = document.getElementById('moduloV');
	modV.style.background="#ffffff";
	modV.style.borderBottom="1px solid #c6d0da";
	var modW = document.getElementById('moduloW');
	modW.style.background="#ffffff";
	modW.style.borderBottom="1px solid #c6d0da";
	var modX = document.getElementById('moduloX');
	modX.style.background="#ffffff";
	modX.style.borderBottom="1px solid #c6d0da";
	var modY = document.getElementById('moduloY');
	modY.style.background="#ffffff";
	modY.style.borderBottom="1px solid #c6d0da";
	var modZ = document.getElementById('moduloZ');
	modZ.style.background="#ffffff";
	modZ.style.borderBottom="1px solid #c6d0da";
	if(x.style.background=="#74818E")//Si el Color de Fondo es Azul
    {
        x.style.background="#ffffff";
    }
	else
	{
        x.style.background="#74818E";
    }
}

function fondo2(x)
{
	var modA = document.getElementById('moduloA');
	modA.style.background="#ffffff";
	modA.style.borderBottom="1px solid #c6d0da";
	var modB = document.getElementById('moduloB');
	modB.style.background="#ffffff";
	modB.style.borderBottom="1px solid #c6d0da";
	var modC = document.getElementById('moduloC');
	modC.style.background="#ffffff";
	modC.style.borderBottom="1px solid #c6d0da";
	var modD = document.getElementById('moduloD');
	modD.style.background="#ffffff";
	modD.style.borderBottom="1px solid #c6d0da";
	var modE = document.getElementById('moduloE');
	modE.style.background="#ffffff";
	modE.style.borderBottom="1px solid #c6d0da";
	var modF = document.getElementById('moduloF');
	modF.style.background="#ffffff";
	modF.style.borderBottom="1px solid #c6d0da";
	var modG = document.getElementById('moduloG');
	modG.style.background="#ffffff";
	modG.style.borderBottom="1px solid #c6d0da";
	var modH = document.getElementById('moduloH');
	modH.style.background="#ffffff";
	modH.style.borderBottom="1px solid #c6d0da";
	var modI = document.getElementById('moduloI');
	modI.style.background="#ffffff";
	modI.style.borderBottom="1px solid #c6d0da";
	var modJ = document.getElementById('moduloJ');
	modJ.style.background="#ffffff";
	modJ.style.borderBottom="1px solid #c6d0da";
	var modK = document.getElementById('moduloK');
	modK.style.background="#ffffff";
	modK.style.borderBottom="1px solid #c6d0da";
	var modL = document.getElementById('moduloL');
	modL.style.background="#ffffff";
	modL.style.borderBottom="1px solid #c6d0da";
	var modM = document.getElementById('moduloM');
	modM.style.background="#ffffff";
	modM.style.borderBottom="1px solid #c6d0da";
	var modN = document.getElementById('moduloN');
	modN.style.background="#ffffff";
	modN.style.borderBottom="1px solid #c6d0da";
	var modO = document.getElementById('moduloO');
	modO.style.background="#ffffff";
	modO.style.borderBottom="1px solid #c6d0da";
	var modP = document.getElementById('moduloP');
	modP.style.background="#ffffff";
	modP.style.borderBottom="1px solid #c6d0da";
	var modQ = document.getElementById('moduloQ');
	modQ.style.background="#ffffff";
	modQ.style.borderBottom="1px solid #c6d0da";
	var modR = document.getElementById('moduloR');
	modR.style.background="#ffffff";
	modR.style.borderBottom="1px solid #c6d0da";
	var modS = document.getElementById('moduloS');
	modS.style.background="#ffffff";
	modS.style.borderBottom="1px solid #c6d0da";
	var modT = document.getElementById('moduloT');
	modT.style.background="#ffffff";
	modT.style.borderBottom="1px solid #c6d0da";
	var modU = document.getElementById('moduloU');
	modU.style.background="#ffffff";
	modU.style.borderBottom="1px solid #c6d0da";
	var modV = document.getElementById('moduloV');
	modV.style.background="#ffffff";
	modV.style.borderBottom="1px solid #c6d0da";
	var modW = document.getElementById('moduloW');
	modW.style.background="#ffffff";
	modW.style.borderBottom="1px solid #c6d0da";
	var modX = document.getElementById('moduloX');
	modX.style.background="#ffffff";
	modX.style.borderBottom="1px solid #c6d0da";
	var modY = document.getElementById('moduloY');
	modY.style.background="#ffffff";
	modY.style.borderBottom="1px solid #c6d0da";
	var modZ = document.getElementById('moduloZ');
	modZ.style.background="#ffffff";
	modZ.style.borderBottom="1px solid #c6d0da";
	if(x.style.background=="#ffffff")//Si el Color de Fondo es Azul
    {
        x.style.background="#74818E";
    }
	else
	{
        x.style.background="#ffffff";
    }
}

 

function changeColorA(x)
{
    var modA = document.getElementById('moduloA');
	modA.style.background="#ffffff";
	modA.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloA").on("click", function() {
		$(this).css("background", "#31708f");
	});
	
	$("#moduloA").on("focus", function() {
		$(this).css("background", "gold");
	});
}

function changeColorB(x)
{
    var modB = document.getElementById('moduloB');
	modB.style.background="#ffffff";
	modB.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloB").on("click", function() {
		$(this).css("background", "#31708f");
	});
}

function changeColorC(x)
{
    var modC = document.getElementById('moduloC');
	modC.style.background="#ffffff";
	modC.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloC").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorD(x)
{
    var modD = document.getElementById('moduloD');
	modD.style.background="#ffffff";
	modD.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloD").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorH(x)
{
    var modH = document.getElementById('moduloH');
	modH.style.background="#ffffff";
	modH.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloH").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorF(x)
{
    var modF = document.getElementById('moduloF');
	modF.style.background="#ffffff";
	modF.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloF").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorG(x)
{
    var modG = document.getElementById('moduloG');
	modG.style.background="#ffffff";
	modG.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloG").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorH(x)
{
    var modH = document.getElementById('moduloH');
	modH.style.background="#ffffff";
	modH.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloH").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorI(x)
{
    var modI = document.getElementById('moduloI');
	modI.style.background="#ffffff";
	modI.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloI").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorJ(x)
{
    var modJ = document.getElementById('moduloJ');
	modJ.style.background="#ffffff";
	modJ.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloJ").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorK(x)
{
    var modK = document.getElementById('moduloK');
	modK.style.background="#ffffff";
	modK.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloK").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorL(x)
{
    var modL = document.getElementById('moduloL');
	modL.style.background="#ffffff";
	modL.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloL").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorM(x)
{
    var modM = document.getElementById('moduloM');
	modM.style.background="#ffffff";
	modM.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloM").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorN(x)
{
    var modN = document.getElementById('moduloN');
	modN.style.background="#ffffff";
	modN.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloN").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorO(x)
{
    var modO = document.getElementById('moduloO');
	modO.style.background="#ffffff";
	modO.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloO").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorP(x)
{
    var modP = document.getElementById('moduloP');
	modP.style.background="#ffffff";
	modP.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloP").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorQ(x)
{
    var modQ = document.getElementById('moduloQ');
	modQ.style.background="#ffffff";
	modQ.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloQ").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorR(x)
{
    var modR = document.getElementById('moduloR');
	modR.style.background="#ffffff";
	modR.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloR").on("click", function() {
		$(this).css("background", "#31708f");
	});

}


function changeColorS(x)
{
    var modS = document.getElementById('moduloS');
	modS.style.background="#ffffff";
	modS.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloS").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorT(x)
{
    var modT = document.getElementById('moduloT');
	modT.style.background="#ffffff";
	modT.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloT").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorU(x)
{
    var modU = document.getElementById('moduloU');
	modU.style.background="#ffffff";
	modU.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloU").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorV(x)
{
    var modO = document.getElementById('moduloV');
	modV.style.background="#ffffff";
	modV.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloV").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorW(x)
{
    var modW = document.getElementById('moduloW');
	modW.style.background="#ffffff";
	modW.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloW").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorX(x)
{
    var modX = document.getElementById('moduloX');
	modX.style.background="#ffffff";
	modX.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloX").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorY(x)
{
    var modY = document.getElementById('moduloY');
	modY.style.background="#ffffff";
	modY.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloY").on("click", function() {
		$(this).css("background", "#31708f");
	});

}

function changeColorZ(x)
{
    var modZ = document.getElementById('moduloZ');
	modZ.style.background="#ffffff";
	modZ.style.borderBottom="1px solid #c6d0da";
	
	$("#moduloZ").on("click", function() {
		$(this).css("background", "#31708f");
	});

}
/*var modB = document.getElementById('moduloB');
	modB.style.background="#ffffff";
	modB.style.borderBottom="1px solid #c6d0da";
	var modC = document.getElementById('moduloC');
	modC.style.background="#ffffff";
	modC.style.borderBottom="1px solid #c6d0da";
	var modD = document.getElementById('moduloD');
	modD.style.background="#ffffff";
	modD.style.borderBottom="1px solid #c6d0da";
	var modE = document.getElementById('moduloE');
	modE.style.background="#ffffff";
	modE.style.borderBottom="1px solid #c6d0da";
	var modF = document.getElementById('moduloF');
	modF.style.background="#ffffff";
	modF.style.borderBottom="1px solid #c6d0da";
	var modG = document.getElementById('moduloG');
	modG.style.background="#ffffff";
	modG.style.borderBottom="1px solid #c6d0da";
	var modH = document.getElementById('moduloH');
	modH.style.background="#ffffff";
	modH.style.borderBottom="1px solid #c6d0da";
	var modI = document.getElementById('moduloI');
	modI.style.background="#ffffff";
	modI.style.borderBottom="1px solid #c6d0da";
	var modJ = document.getElementById('moduloJ');
	modJ.style.background="#ffffff";
	modJ.style.borderBottom="1px solid #c6d0da";
	var modK = document.getElementById('moduloK');
	modK.style.background="#ffffff";
	modK.style.borderBottom="1px solid #c6d0da";
	var modL = document.getElementById('moduloL');
	modL.style.background="#ffffff";
	modL.style.borderBottom="1px solid #c6d0da";
	var modM = document.getElementById('moduloM');
	modM.style.background="#ffffff";
	modM.style.borderBottom="1px solid #c6d0da";
	var modN = document.getElementById('moduloN');
	modN.style.background="#ffffff";
	modN.style.borderBottom="1px solid #c6d0da";
	var modO = document.getElementById('moduloO');
	modO.style.background="#ffffff";
	modO.style.borderBottom="1px solid #c6d0da";
	var modP = document.getElementById('moduloP');
	modP.style.background="#ffffff";
	modP.style.borderBottom="1px solid #c6d0da";
	var modQ = document.getElementById('moduloQ');
	modQ.style.background="#ffffff";
	modQ.style.borderBottom="1px solid #c6d0da";
	var modR = document.getElementById('moduloR');
	modR.style.background="#ffffff";
	modR.style.borderBottom="1px solid #c6d0da";
	var modS = document.getElementById('moduloS');
	modS.style.background="#ffffff";
	modS.style.borderBottom="1px solid #c6d0da";
	var modT = document.getElementById('moduloT');
	modT.style.background="#ffffff";
	modT.style.borderBottom="1px solid #c6d0da";
	var modU = document.getElementById('moduloU');
	modU.style.background="#ffffff";
	modU.style.borderBottom="1px solid #c6d0da";
	var modV = document.getElementById('moduloV');
	modV.style.background="#ffffff";
	modV.style.borderBottom="1px solid #c6d0da";
	var modW = document.getElementById('moduloW');
	modW.style.background="#ffffff";
	modW.style.borderBottom="1px solid #c6d0da";
	var modX = document.getElementById('moduloX');
	modX.style.background="#ffffff";
	modX.style.borderBottom="1px solid #c6d0da";
	var modY = document.getElementById('moduloY');
	modY.style.background="#ffffff";
	modY.style.borderBottom="1px solid #c6d0da";
	var modZ = document.getElementById('moduloZ');
	modZ.style.background="#ffffff";
	modZ.style.borderBottom="1px solid #c6d0da";*/