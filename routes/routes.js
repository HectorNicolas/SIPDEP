/// Autor: Jesús Asael Hernández García
/// Email: azzaeelhg@gmail.com
//  Fecha: 15/05/2016

///
/// Dependencias
///
var PDFDocument = require('pdfkit');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

///
/// Conexión a la base de datos
///
var connection = crearConexion();
connection.connect(function (error) {
    if (error) throw error;
    else console.log('Connection to database was succesful');
});

///
///
/// Consultas SQL del sistema
///
/// SELECT queries
var selectAlumno_Info = 'SELECT Clave_unica, Facultad, Carrera, Intentos_Ingreso, Semestre \
FROM alumno \
WHERE Clave_unica = ?';
var selectUsuario_Info = 'SELECT Nombre, Apellidos, Correo, Sexo, DATE_FORMAT(FechaNacimiento, \'%d/%m/%Y\') AS FechaNacimiento, TienePareja, TieneHijos, ViveCon, DependeDe, ActividadFisica, PosicionHijo, PadreMedico, EscolPaterna, EscolMaterna, EsAlumno, CveUnica \
FROM usuario \
WHERE NombreUsuario = ?';
var selectTestNoContestado = 'SELECT * \
FROM test_usuario \
WHERE Nombre_Usuario = ? AND Nombre_Test = ? AND Fecha = ? AND Contestado = "No"';
var selectTestPendientesUsuario = 'SELECT * \
FROM test_usuario \
WHERE Nombre_Test = ? AND Fecha = ? AND Nombre_Usuario = ?';
var selectSolicitar = 'SELECT * FROM solicitud_test WHERE Nombre_Test = ? AND Nombre_Usuario = ? AND Aceptada = "No";';
var selectAllQuestions_Test = 'SELECT Numero, Pregunta FROM pregunta_test WHERE Nombre_Test = ? ORDER BY Numero;';
var selectRespuestas_Test = 'SELECT Numero_Pregunta, group_concat(Numero_Respuesta SEPARATOR \'#\') AS Numero, group_concat(Respuesta SEPARATOR \'#\') AS Respuestas, group_concat(Puntuacion SEPARATOR \'#\') AS Puntuaciones \
FROM respuesta_pregunta \
WHERE Nombre_Test = ? \
GROUP BY Numero_Pregunta \
ORDER BY Numero_Respuesta;';
var selectPreguntas_Test = 'SELECT Pregunta FROM pregunta_test WHERE Nombre_Test = ?';
var selectNumPreg = 'SELECT Numero FROM pregunta_test WHERE Nombre_Test = ? AND Pregunta LIKE ?;';
var selectPregRes_Folio = 'SELECT GROUP_CONCAT(pt.Pregunta SEPARATOR \'#\') AS Preguntas, Respuestas, Puntuaciones, Puntuacion_Total, Diagnostico \
FROM resultado AS rt \
INNER JOIN test_usuario AS tu ON rt.Folio = tu.Folio \
INNER JOIN pregunta_test AS pt ON pt.Nombre_Test = tu.Nombre_Test \
WHERE rt.Folio = ?;';
var selectTestVerification = 'SELECT * FROM test_usuario WHERE Nombre_Aplicador = ? AND Nombre_Usuario = ? AND Nombre_Test = ? AND Fecha = ?;';
var selectResultados = 'SELECT r.Folio, tu.Nombre_Test, a.Nombre AS NombreAp, a.Apellidos AS ApellidosAp, u.Nombre AS NombreUs, u.Apellidos AS ApellidosUs, DATE_FORMAT(tu.Fecha, \'%d/%m/%Y\') AS FechaSol, DATE_FORMAT(tu.FechaContestado, \'%d/%m/%Y\') AS FechaCon \
FROM resultado AS r \
INNER JOIN test_usuario AS tu ON tu.Folio = r.Folio \
INNER JOIN aplicador AS a ON a.NombreUsuario = tu.Nombre_Aplicador \
INNER JOIN usuario AS u ON u.NombreUsuario = tu.Nombre_Usuario \
WHERE r.Folio = ?;';
var selectFolio = 'SELECT Folio FROM resultado ORDER BY Folio DESC;';
var selectSolicitudes = 'SELECT solicitud_test.Nombre_Usuario, usuario.Nombre, usuario.Apellidos, solicitud_test.Nombre_Test, DATE_FORMAT(solicitud_test.Fecha,\'%d/%m/%Y\') AS Fecha \
FROM solicitud_test \
INNER JOIN usuario ON usuario.NombreUsuario = solicitud_test.Nombre_Usuario \
WHERE solicitud_test.Nombre_Aplicador = ? AND solicitud_test.Aceptada = \'No\';';
var selectSolicitudesContestadas = 'SELECT usuario.Nombre, usuario.Apellidos, solicitud_test.Nombre_Test, DATE_FORMAT(solicitud_test.Fecha,\'%d/%m/%Y\') \
FROM solicitud_test \
INNER JOIN usuario ON usuario.NombreUsuario = solicitud_test.Nombre_Usuario \
WHERE solicitud_test.Nombre_Aplicador = ? AND solicitud_test.Aceptada = \'Si\';';
var existSolicitudHoy = 'SELECT Fecha FROM solicitud_test WHERE Fecha = ?;';
var existsUsuario_Alumno = 'SELECT alumno.Clave_unica, usuario.NombreUsuario \
FROM usuario \
INNER JOIN alumno \
ON usuario.CveUnica = alumno.Clave_unica \
WHERE usuario.NombreUsuario = ? AND alumno.Clave_unica = ?;';
var selectUsuario_Alumno = 'SELECT alumno.Facultad, alumno.Carrera, alumno.Clave_unica, alumno.Intentos_Ingreso, alumno.Semestre \
FROM usuario \
INNER JOIN alumno \
ON usuario.CveUnica = alumno.Clave_unica \
WHERE usuario.NombreUsuario = ?';
var selectFacultad_Carreras = 'SELECT NombreCarrera AS Carrera FROM facultad_carrera WHERE Nombre_Facultad = ? AND Eliminado = "No";';
var selectCarrera = 'SELECT * FROM facultad_carrera WHERE NombreCarrera = ? AND Eliminado = "No"';
var selectFacultades = 'SELECT * FROM facultad WHERE Eliminado = "No"';
var selectFacultad = 'SELECT * FROM facultad WHERE Nombre = ? AND Eliminado = "No"';
var selectAlumno = 'SELECT * FROM alumno WHERE Clave_unica = ?;';
var selectNumPreg_Test = 'SELECT * FROM pregunta_test WHERE Nombre_Test = ? AND Numero = ?;';
/*var selectPreguntaRespuesta = 'SELECT test_pregunta.Pregunta, respuesta_pregunta.Respuesta \
FROM test_pregunta\
INNER JOIN respuesta_pregunta ON test_pregunta.Pregunta = respuesta_pregunta.Pregunta\
WHERE test_pregunta.Nombre_Test = ?;';*/
var selectTest = 'SELECT Nombre, Descripcion FROM test WHERE Eliminado = "No"';
var selectTest_Name = 'SELECT * FROM test WHERE Nombre = ? AND Eliminado = "No"';
var selectQuestions = 'SELECT Numero, Pregunta \
FROM pregunta_test \
WHERE Nombre_Test = ? \
ORDER BY Numero DESC;';
var existTestQuery = 'SELECT * FROM test WHERE Nombre = ? AND Eliminado = "No"';
var checkUser = 'SELECT * FROM usuario WHERE NombreUsuario = ? AND Password = ?';
var checkUserName = 'SELECT NombreUsuario, Nombre, Apellidos, Correo, Sexo, FechaNacimiento, TienePareja, TieneHijos, ViveCon, DependeDe, ActividadFisica, PosicionHijo, PadreMedico, EscolPaterna, EscolMaterna, EsAlumno, CveUnica FROM usuario WHERE NombreUsuario = ?';
var checkAplicador = 'SELECT * FROM aplicador WHERE NombreUsuario = ? and Password = ? AND Eliminado = "No"';
var checkAplicadorName = 'SELECT * FROM aplicador WHERE NombreUsuario = ? AND Eliminado = "No"';
var selectAplicadores = 'SELECT NombreUsuario, Nombre, Apellidos, Telefono, Correo, Privilegios FROM aplicador WHERE Eliminado = "No"';
var selectAplicadoresNoAdmin = 'SELECT NombreUsuario FROM aplicador WHERE Privilegios != \'administrativos\' AND Eliminado = "No"';
var pendingUserTest = 'SELECT aplicador.Nombre, aplicador.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha, aplicador.NombreUsuario AS Username \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'No\' AND test_usuario.Nombre_Usuario = ?';
var countTestPendientes = 'SELECT COUNT(*) AS testPendientes \
FROM test_usuario \
WHERE Contestado = \'No\'';
var countSolicitudesPendientes = 'SELECT COUNT(*) AS numSolicitudes \
FROM solicitud_test \
WHERE Aceptada = \'No\'';
var pendingAplicadorTest = 'SELECT usuario.NombreUsuario, usuario.Nombre, usuario.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN usuario ON usuario.NombreUsuario = test_usuario.Nombre_Usuario \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'No\' AND aplicador.NombreUsuario = ?';
var answeredAplicadorTest = 'SELECT usuario.NombreUsuario, usuario.Nombre, usuario.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha, DATE_FORMAT(test_usuario.FechaContestado,\'%d/%m/%Y\') AS FechaContestado, test_usuario.Folio \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN usuario ON usuario.NombreUsuario = test_usuario.Nombre_Usuario \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'Si\' AND aplicador.NombreUsuario = ? AND test_usuario.Fecha = ?';
var answeredUserTest = 'SELECT aplicador.Nombre, aplicador.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'Si\' AND test_usuario.Nombre_Usuario = ?';
var selectCurrentPassword = 'SELECT * FROM usuario WHERE NombreUsuario = ? AND Password = ?';
var selectCurrentPassword1 = 'SELECT * FROM aplicador WHERE NombreUsuario = ? AND Password = ?';
var selectUsername = 'SELECT NombreUsuario FROM usuario WHERE Nombre = ? AND Apellidos = ?'
///
/// INSERT queries
///
var insertResultado_Test = 'INSERT INTO resultado (Respuestas, Puntuaciones, Puntuacion_Total, Diagnostico) VALUES (?, ?, ?, ?);';
var insertSolicitud = 'INSERT INTO solicitud_test VALUES (?,?,?,?,?);';
var insertCarrera = 'INSERT INTO facultad_carrera VALUES (?,?,"No");';
var insertFacultad = 'INSERT INTO facultad VALUES (?,"No");';
var insertAlumno = 'INSERT INTO alumno VALUES (?,?,?,?,?);';
var insertPregunta = 'INSERT INTO pregunta_test VALUES (?,?,?);';
var insertTest = 'INSERT INTO test (Nombre, Descripcion, Eliminado) VALUES (?,?,"No")'
var sendTest = 'INSERT INTO test_usuario (Nombre_Aplicador, Nombre_Usuario, Nombre_Test, Fecha, Contestado) VALUES (?,?,?,?,?)';
var insertUser = 'INSERT INTO usuario (NombreUsuario, Nombre, Apellidos, Correo, Sexo, FechaNacimiento, Password) VALUES(?, ?, ?, ?, ?, ?, ?)';
var insertAplicador = 'INSERT INTO aplicador (NombreUsuario, Nombre, Apellidos, Telefono, Correo, Privilegios, Password, Eliminado) VALUES (?,?,?,?,?,?,?,"No")';
var insertRespuesta = 'INSERT INTO respuesta_pregunta VALUES (?,?,?,?,?);';
///
/// UPDATE queries
///
var updateTestUsuario = 'UPDATE test_usuario SET Contestado = \'Si\', FechaContestado = ?, Folio = ? WHERE Nombre_Aplicador = ? AND Nombre_Usuario = ? AND Nombre_Test = ? AND Fecha = ? AND Contestado = \'No\';';
var updateSolicitudStatus = 'UPDATE solicitud_test SET Aceptada = ? WHERE Nombre_Usuario = ?, Nombre_Aplicador = ?, Nombre_Test = ?;';
var updateCveUsuario = 'UPDATE usuario SET CveUnica = ? WHERE NombreUsuario = ?;';
var updateAlumno = 'UPDATE alumno SET Facultad = ?, Carrera = ?, Intentos_Ingreso = ?, Semestre = ? WHERE Clave_unica = ?';
var updateUser = 'UPDATE usuario SET TienePareja=?, TieneHijos=?, ViveCon=?, DependeDe=?, ActividadFisica=?, PosicionHijo=?, PadreMedico=?, EscolPaterna=?, EscolMaterna=?, EsAlumno=? WHERE NombreUsuario = ?;';
var updateAplicador = 'UPDATE aplicador SET Nombre = ?, Apellidos = ?, Telefono = ?, Correo = ? WHERE NombreUsuario = ?';
var updateUserPassword = 'UPDATE usuario SET Password = ? WHERE NombreUsuario = ?';
var updateUserPassword1 = 'UPDATE aplicador SET Password = ? WHERE NombreUsuario = ?';
///
/// DELETE queries
///
var deleteSolicitud = 'DELETE FROM solicitud_test WHERE Nombre_Usuario = ? AND Nombre_Aplicador = ? AND Nombre_test = ? AND Fecha = ? AND Aceptada = \'No\';';
var deleteCarrera = 'UPDATE facultad_carrera \
SET Eliminado = "Si" \
WHERE Nombre_Facultad = ? AND NombreCarrera = ?';
var deleteFacultad = 'UPDATE facultad \
SET Eliminado = "Si" \
WHERE Nombre = ?';
var deleteAplicador = 'UPDATE aplicador \
SET Eliminado = "Si" \
WHERE NombreUsuario = ?';
var deleteTest = 'UPDATE test \
SET Eliminado = "Si" \
WHERE Nombre = ?';

///
///
/// Modulo de Node.js para la autenticación de los usuarios y para
/// los métodos GET y POST de las páginas
///
module.exports = function (app) {

    ///
    /// Serialización del usuario para la autenticación
    ///
    passport.serializeUser(function (username, done) {
        done(null, username);
    });

    ///
    /// Deserealización del usuario autenticado
    ///
    passport.deserializeUser(function (username, done) {
        connection.query(checkUserName, [username], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                done(error, result[0].NombreUsuario);
            }
        });
    });

    ///
    /// Método de acceso local al sistema
    ///
    passport.use('local-login',
        new localStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            function (username, password, done) {
                var pass = encrypt(username, password);
                connection.query(checkUser, [username, pass], function (errorUser, resultUser) {
                    if (errorUser) throw errorUser;
                    if (resultUser.length > 0) return done(null, username);
                    else {
                        connection.query(checkAplicador, [username, pass], function (error, result) {
                            if (error) throw error;
                            if (result.length > 0) return done(null, username);
                            else app.locals.errorMessage = 'Usuario y/o contraseña incorrectos';
                            return done(error, false);
                        });
                    }
                });
            }
        ));

    /// POST
    /// Consulta los datos del usuario seleccionado
    ///
    app.post('/datos_usuario', function (req, res) {
        var usr = req.body.usrname;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            var apppriv = false;
            connection.query(checkAplicadorName, username, function (errApp, resApp) {
                if (errApp) throw errApp;
                if (resApp.length > 0) {
                    var appData = JSON.parse(JSON.stringify(resApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectUsuario_Info, usr, function (errUsr, resUsr) {
                        if (errUsr) throw errUsr;
                        if (resUsr.length > 0) {
                            var usuario_info = JSON.parse(JSON.stringify(resUsr));
                            if (usuario_info[0].CveUnica != null) {
                                connection.query(selectAlumno_Info, usuario_info[0].CveUnica, function (errAl, resAl) {
                                    if (errAl) throw errAl;
                                    if (resAl.length > 0) {
                                        var alumno_info = JSON.parse(JSON.stringify(resAl));
                                        res.render('datos_usuario', {
                                            title: 'Datos del usuario',
                                            usuario: username,
                                            priv: 'app',
                                            apppriv: apppriv,
                                            usr_info: usuario_info,
                                            alumno_info: alumno_info
                                        });
                                    } else {
                                        res.render('datos_usuario', {
                                            title: 'Datos del usuario',
                                            usuario: username,
                                            priv: 'app',
                                            usr_info: usuario_info,
                                            apppriv: apppriv
                                        });
                                    }
                                });
                            } else {
                                res.render('datos_usuario', {
                                    title: 'Datos del usuario',
                                    usuario: username,
                                    priv: 'app',
                                    apppriv: apppriv,
                                    usr_info: usuario_info,
                                });
                            }
                        } else {
                            res.render('datos_usuario', {
                                title: 'Datos del usuario',
                                usuario: username,
                                priv: 'app',
                                apppriv: apppriv,
                            });
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Consulta los test con el día, fecha y hora especificado
    ///
    app.get('/consultar_test', function (req, res) {
        var day = req.query.day;
        var month = req.query.month;
        var year = req.query.year;
        var fecha = year + '-' + month + '-' + day;
        var arrFecha = fecha.split("-");
        var username = req.cookies.name;

        var apppriv = false;
        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(pendingAplicadorTest, username, function (errorPend, resultPend) {
                        if (errorPend) throw errorPend;
                        if (resultPend.length > 0) {
                            var pendientes = JSON.parse(JSON.stringify(resultPend));

                            connection.query(answeredAplicadorTest, [username, fecha], function (errorTest, resultTest) {
                                if (errorTest) throw errorTest;
                                if (resultTest.length > 0) {
                                    var contestados = JSON.parse(JSON.stringify(resultTest));
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        pendientes: pendientes,
                                        contestados: contestados,
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                } else {
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        pendientes: pendientes,
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                }
                            });
                        } else {
                            connection.query(answeredAplicadorTest, [username, fecha], function (errorTest2, resultTest2) {
                                if (errorTest2) throw errorTest2;
                                if (resultTest2.length > 0) {
                                    var contestados = JSON.parse(JSON.stringify(resultTest2));
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        contestados: contestados,
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                } else {
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                }

                            });
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }

    });

    /// POST    
    /// Genera un reporte en PDF de los resultados obtenidos
    ///
    app.get('/imprimir', function (req, res) {
        var username = req.cookies.name;
        var folio = req.query.folio;
        var apppriv = false;
        var doc = new PDFDocument();
        var fechaHora = getHoraActual();
        var fecha = getFechaActual();

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var priv = 'app';
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == true) apppriv = true;
                    connection.query(selectResultados, [folio], function (errorFol, resultFol) {
                        if (errorFol) throw errorFol;
                        if (resultFol.length > 0) {
                            var reporte = JSON.parse(JSON.stringify(resultFol));
                            connection.query(selectPregRes_Folio, [folio], function (errorPreg, resultPreg) {
                                if (errorPreg) throw errorPreg;
                                if (resultPreg.length > 0) {
                                    var resultado = JSON.parse(JSON.stringify(resultPreg));
                                    var preguntas = resultado[0].Preguntas.split("#");
                                    var respuestas = resultado[0].Respuestas.split("#");
                                    var puntuaciones = resultado[0].Puntuaciones.split("#");
                                    var puntuacionTotal = resultado[0].Puntuacion_Total;
                                    var diagnostico = resultado[0].Diagnostico;
                                    var y = 200;

                                    doc.image('public/img/logo.png')
                                        .font('Times-Roman')
                                        .fontSize(12)
                                        .text('Nombre del test: ' + reporte[0].Nombre_Test, 160, 80)
                                        .text('Aplicador: ' + reporte[0].NombreAp + ' ' + reporte[0].ApellidosAp)
                                        .text('Contestado por: ' + reporte[0].NombreUs + ' ' + reporte[0].ApellidosUs)
                                        .text('Fecha de solicitud: ' + reporte[0].FechaSol)
                                        .text('Fecha en que fue contestado: ' + reporte[0].FechaCon)
                                        .text('Fecha y hora de impresión: ' + fechaHora);

                                    for (i = 0; i < preguntas.length; i++) {
                                        doc.text(preguntas[i], 80, y, {
                                                align: 'left'
                                            })
                                            .text(respuestas[i]);
                                        y += 60;
                                        if (y >= 650) {
                                            doc.addPage();
                                            y = 80;
                                        }
                                    }

                                    doc
                                        .moveDown()
                                        .text('Diagnostico: ' + diagnostico)
                                        .text('Puntuacón total: ' + puntuacionTotal);

                                    var raiz = __dirname.toString().replace("\\routes", '');
                                    doc.pipe(fs.createWriteStream(raiz + '/public/files/file_' + folio + '_.pdf'));
                                    doc.end();

                                    setTimeout(function () {
                                        var filePath = raiz + '/public/files/file_' + folio + '_.pdf';
                                        fs.readFile(filePath, function (err, data) {
                                            res.contentType("application/pdf");
                                            res.send(data);;
                                        });
                                    }, 1000);

                                } else {
                                    res.send('No hay preguntas para el test seleccionado');
                                }
                            });
                        } else {
                            res.send('No se ecnontró el documento con el folio ' + folio + ' intentalo nuevamente');
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Muestra los resultados para el folio especificado
    ///
    app.get('/resultados', function (req, res) {
        var username = req.cookies.name;
        var folio = req.query.folio;
        var apppriv = false;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos') apppriv = true;
                    connection.query(selectResultados, [folio], function (errorFol, resultFol) {
                        if (errorFol) throw errorFol;
                        if (resultFol.length > 0) {
                            var reporte = JSON.parse(JSON.stringify(resultFol));
                            connection.query(selectPregRes_Folio, [folio], function (errorPreg, resultPreg) {
                                if (errorPreg) throw errorPreg;
                                if (resultPreg.length > 0) {
                                    var resultado = JSON.parse(JSON.stringify(resultPreg));
                                    var preguntas = resultado[0].Preguntas.split("#");
                                    var respuestas = resultado[0].Respuestas.split("#");
                                    var puntuaciones = resultado[0].Puntuaciones.split("#");
                                    var puntuacionTotal = resultado[0].Puntuacion_Total;
                                    var diagnostico = resultado[0].Diagnostico;
                                    res.render('resultados', {
                                        title: 'Resultados para el Folio' + folio,
                                        usuario: username,
                                        apppriv: apppriv,
                                        priv: 'app',
                                        reporte: reporte,
                                        preguntas: preguntas,
                                        respuestas: respuestas,
                                        puntuacion: puntuaciones,
                                        puntuacionTotal: puntuacionTotal,
                                        diagnostico: diagnostico
                                    });
                                } else {
                                    res.send('Error al procesar solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('Error al procesar solicitud, intentalo nuevamente.');
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Actualiza los datos de un usuario que también es estudiante
    /// 
    app.post('/actestudiante', function (req, res) {
        var cve = req.body.cveunica;
        var carrera = req.body.carrera;
        var intentos = req.body.intentos;
        var semestre = req.body.semestre;
        var facultad = req.body.facultadSeleccionada;
        var username = req.cookies.name;
        var data = [cve, facultad, carrera, intentos, semestre];
        var studentDat = [facultad, carrera, intentos, semestre, cve];

        if (typeof (username) != 'undefined') {
            if (cve.length > 0 && typeof (facultad) != 'undefined' && typeof (carrera) != 'undefined' && intentos.toString().length > 0 && semestre.toString().length > 0) {
                connection.query(selectAlumno, [cve], function (errorCve, resultCve) {
                    if (errorCve) throw errorCve;
                    if (resultCve.length > 0) {
                        connection.query(existsUsuario_Alumno, [username, cve], function (errorExist, resultExist) {
                            if (errorExist) throw errorExist;
                            if (resultExist.length > 0) {
                                connection.query(updateAlumno, studentDat, function (errorStu, resultStu) {
                                    if (errorStu) throw errorStu;
                                    if (resultStu.affectedRows > 0) {
                                        app.locals.succesfulMessage = 'Perfil actualizado correctamente';
                                        res.redirect('/perfil');
                                    } else {
                                        app.locals.errorMessage = 'No se pudieron actualizar los datos de tu perfil, intentalo nuevamente';
                                        res.redirect('/perfil');
                                    }
                                });
                            } else {
                                app.locals.errorMessage = 'No coincide tu nombre de usuario con tu clave única, asegurate de escribir correctamente la clave única';
                                res.redirect('/perfil');
                            }
                        });
                    } else {
                        connection.query(insertAlumno, data, function (errorAlu, resultAlu) {
                            if (errorAlu) throw errorAlu;
                            if (resultAlu.affectedRows > 0) {
                                connection.query(updateCveUsuario, [cve, username], function (errorUsu, resultUsu) {
                                    if (errorUsu) throw errorUsu;
                                    if (resultUsu.affectedRows > 0) {
                                        app.locals.succesfulMessage = 'Datos de perfil actualizados correctamente';
                                        res.redirect('/perfil');
                                    } else {
                                        app.locals.errorMessage = 'No se pudo actualizar la información de tu perfil, vuelve a intentarlo nuevamente';
                                        res.redirect('/perfil');
                                    }
                                });
                            } else {
                                app.locals.errorMessage = 'No se pudo actualizar la información de tu perfil, vuelve a intentarlo nuevamente';
                                res.redirect('/perfil');
                            }
                        });
                    }
                });
            } else {
                app.locals.errorMessage = 'Datos incorrectos o información faltante, verificarlos y vuelve a intentarlo nuevamente';
                res.redirect('/perfil');
            }
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Busca las materias pertenecientes a una facultad
    /// para mostrarlas a los nuevos usuarios
    app.get('/search_mat', function (req, res) {
        var facultad = req.query.facultad;
        var username = req.cookies.name;
        var carreraSeleccionada = req.query.carreraSeleccionada;

        if (typeof (username) != 'undefined') {
            connection.query(checkUserName, [username], function (errorUser, resultUser) {
                if (errorUser) throw errorUser;
                if (resultUser.length > 0) {
                    var userData = JSON.parse(JSON.stringify(resultUser));
                    var estudiante = isStudent(userData);
                    connection.query(selectUsuario_Alumno, [username], function (errorAlu, resultAlu) {
                        if (errorAlu) throw errorAlu;
                        if (resultAlu.length > 0) {
                            var studentData = JSON.parse(JSON.stringify(resultAlu));
                            connection.query(selectFacultades, function (errorFac, resultFac) {
                                if (errorFac) throw errorFac;
                                if (resultFac.length > 0) {
                                    var facultades = JSON.parse(JSON.stringify(resultFac));
                                    connection.query(selectFacultad_Carreras, [facultad], function (errorCarr, resultCarr) {
                                        if (errorCarr) throw errorCarr;
                                        if (resultCarr.length > 0) {
                                            var carreras = JSON.parse(JSON.stringify(resultCarr));
                                            res.render('perfil', {
                                                title: 'Perfil de ' + username,
                                                usuario: username,
                                                priv: 'user',
                                                datos: userData,
                                                estudiante: estudiante,
                                                datosEstudiante: studentData,
                                                facultades: facultades,
                                                facSeleccionada: facultad,
                                                carreras: carreras,
                                                carSeleccionada: carreraSeleccionada
                                            });
                                        } else {
                                            res.render('perfil', {
                                                title: 'Perfil de ' + username,
                                                usuario: username,
                                                priv: 'user',
                                                datos: userData,
                                                estudiante: estudiante,
                                                datosEstudiante: studentData,
                                                facultades: facultades,
                                                facSeleccionada: facultad,
                                                carreras: 'undefined',
                                                carSeleccionada: carreraSeleccionada
                                            });
                                        }
                                    });
                                } else {
                                    res.render('perfil', {
                                        title: 'Perfil de ' + username,
                                        usuario: username,
                                        priv: 'user',
                                        datos: userData,
                                        estudiante: estudiante,
                                        datosEstudiante: studentData,
                                    });
                                }
                            });
                        } else {
                            connection.query(selectFacultades, function (errorFacs, resultFacs) {
                                if (errorFacs) throw errorFacs;
                                if (resultFacs.length > 0) {
                                    var facs = JSON.parse(JSON.stringify(resultFacs));
                                    connection.query(selectFacultad_Carreras, [facultad], function (errorCarrs, resultCarrs) {
                                        if (errorCarrs) throw errorCarrs;
                                        if (resultCarrs.length > 0) {
                                            var carrs = JSON.parse(JSON.stringify(resultCarrs));
                                            res.render('perfil', {
                                                title: 'Perfil de ' + username,
                                                usuario: username,
                                                priv: 'user',
                                                datos: userData,
                                                estudiante: estudiante,
                                                facultades: facs,
                                                facSeleccionada: facultad,
                                                carreras: carrs
                                            });
                                        } else {
                                            res.render('perfil', {
                                                title: 'Perfil de ' + username,
                                                usuario: username,
                                                priv: 'user',
                                                datos: userData,
                                                estudiante: estudiante,
                                                facultades: facs,
                                                facSeleccionada: facultad
                                            });
                                        }
                                    });
                                } else {
                                    res.render('perfil', {
                                        title: 'Perfil de ' + username,
                                        usuario: username,
                                        priv: 'user',
                                        datos: userData,
                                        estudiante: estudiante,
                                        facultades: facs,
                                        facSeleccionada: facultad
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }

    });

    /// GET
    /// Muestra las carreras de la facultad seleccionada
    /// por el usuario
    app.get('/searchcarreras', function (req, res) {
        var facultad = req.query.facultadSeleccionada;
        var apppriv = false;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var priv = 'app';
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectFacultad, [facultad], function (errorFac, resultFac) {
                        if (errorFac) throw errorFac;
                        if (resultFac.length > 0) {
                            connection.query(selectFacultad_Carreras, [facultad], function (error, result) {
                                if (error) throw error;
                                if (result.length > 0) {
                                    var carreras = JSON.parse(JSON.stringify(result));
                                    connection.query(selectFacultades, function (errorFacultades, resultFacultades) {
                                        if (errorFacultades) throw errorFacultades;
                                        if (resultFacultades.length > 0) {
                                            var facultades = JSON.parse(JSON.stringify(resultFacultades));
                                            res.render('concarrera', {
                                                title: 'Consultar carreras',
                                                usuario: username,
                                                priv: priv,
                                                apppriv: apppriv,
                                                facultades: facultades,
                                                facultadSeleccionada: facultad,
                                                carreras: carreras
                                            });
                                            app.locals.errorMessage = '';
                                            app.locals.succesfulMessage = '';
                                        } else {
                                            res.render('concarrera', {
                                                title: 'Consultar carreras',
                                                usuario: username,
                                                priv: priv,
                                                apppriv: apppriv,
                                                facultades: 'undefined',
                                                facultadSeleccionada: facultad,
                                                carreras: carreras
                                            });
                                            app.locals.errorMessage = '';
                                            app.locals.succesfulMessage = '';
                                        }
                                    });
                                } else {
                                    app.locals.errorMessage = 'No has agregado carreras a la ' + facultad + '. Agrega carreras para después poderlas consultar';
                                    res.redirect('/concarrera');
                                }
                            });
                        } else {
                            app.locals.errorMessage = 'No existe la ' + facultad + ', selecciona una facultad existente';
                            res.redirect('/concarrera');
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Muestra la interfaz para consultar las carreras 
    /// de una facultad seleccionada
    app.get('/concarrera', function (req, res) {
        var apppriv = false;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var priv = 'app';
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectFacultades, function (errorFac, resFac) {
                        if (errorFac) throw errorFac;
                        if (resFac.length > 0) {
                            var facultades = JSON.parse(JSON.stringify(resFac));
                            res.render('concarrera', {
                                title: 'Consultar carreras',
                                usuario: username,
                                facultades: facultades,
                                apppriv: apppriv,
                                priv: priv,
                                facultadSeleccionada: 'undefined'
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        } else {
                            res.redirect('/workspace');
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Muestra las carreras para la facultad seleccionada
    ///
    app.get('/selfac_carr', function (req, res) {
        var facultadSeleccionada = req.query.facultad;
        var username = req.cookies.name;

        var apppriv = false;
        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var priv = 'app';
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectFacultades, function (error, result) {
                        if (error) throw error;
                        if (result.length > 0) {
                            var facultades = JSON.parse(JSON.stringify(result));
                            connection.query(selectFacultad_Carreras, [facultadSeleccionada], function (errorCarr, resultCarr) {
                                if (errorCarr) throw errorCarr;
                                if (resultCarr.length > 0) {
                                    var carreras = JSON.parse(JSON.stringify(resultCarr));
                                    res.render('elcarrera', {
                                        title: 'Eliminar carreras',
                                        usuario: username,
                                        errorMessage: app.locals.errorMessage,
                                        succesfulMessage: app.locals.succesfulMessage,
                                        facultades: facultades,
                                        priv: priv,
                                        apppriv: apppriv,
                                        facSeleccionada: facultadSeleccionada,
                                        carreras: carreras
                                    });
                                    app.locals.errorMessage = '';
                                    app.locals.succesfulMessage = '';
                                } else {
                                    res.render('elcarrera', {
                                        title: 'Eliminar carreras',
                                        usuario: username,
                                        errorMessage: 'La ' + facultadSeleccionada + ' no tiene carreras disponibles. Debes agregar carreras antes de querer eliminarlas',
                                        succesfulMessage: '',
                                        facultades: facultades,
                                        priv: priv,
                                        apppriv: apppriv,
                                        facSeleccionada: facultadSeleccionada,
                                    });
                                }
                            });
                        } else {
                            res.render('elcarrera', {
                                title: 'Eliminar carreras',
                                usuario: username,
                                errorMessage: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage,
                                priv: priv,
                                facSeleccionada: facultadSeleccionada,
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Muestra la interfaz para eliminar una carrera
    ///
    app.get('/elcarrera', function (req, res) {
        var apppriv = false;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var priv = 'app';
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectFacultades, function (error, result) {
                        if (error) throw error;
                        if (result.length > 0) {
                            var facultades = JSON.parse(JSON.stringify(result));
                            res.render('elcarrera', {
                                title: 'Eliminar carreras',
                                usuario: username,
                                errorMessage: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage,
                                facultades: facultades,
                                priv: priv,
                                facSeleccionada: 'Ninguna',
                                apppriv: apppriv
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        } else {
                            res.render('elcarrera', {
                                title: 'Eliminar carreras',
                                usuario: username,
                                errorMessage: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage,
                                priv: priv,
                                facSeleccionada: 'Ninguna',
                                apppriv: apppriv
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// POST
    /// Elimina la carrera seleccionara por el usuario
    ///
    app.post('/elcarrera', function (req, res) {
        var facultad = req.body.facSeleccionada;
        var carrera = req.body.carreraSeleccionada;
        var data = [facultad, carrera];

        connection.query(selectCarrera, [carrera], function (errorCarr, resultCarr) {
            if (errorCarr) throw errorCarr;
            if (resultCarr.length > 0) {
                connection.query(deleteCarrera, data, function (error, result) {
                    if (error) throw error;
                    if (result.affectedRows > 0) {
                        app.locals.succesfulMessage = carrera + ' eliminada correctamente de la ' + facultad;
                        res.redirect('/elcarrera');
                    } else {
                        app.locals.errorMessage = 'No se pudo eliminar la carrera ' + carrera + ', intentalo nuevamente';
                        res.redirect('/elcarrera');
                    }
                });
            } else {
                app.locals.errorMessage = 'No existe la carrera ' + carrera + ', intentalo nuevamente';
                res.redirect('/elcarrera');
            }
        });
    });

    /// GET
    /// Muestra la página para agregar carreras a las facultades
    ///
    app.get('/agcarrera', function (req, res) {
        var apppriv = false;
        connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var priv = 'app';
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    apppriv = true;
                connection.query(selectFacultades, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var facultades = JSON.parse(JSON.stringify(result));
                        res.render('agcarrera', {
                            title: 'Agregar carreras',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: facultades,
                            priv: priv,
                            facSeleccionada: 'Ninguna',
                            apppriv: apppriv
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('agcarrera', {
                            title: 'Agregar carreras',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: 'undefined',
                            priv: priv,
                            facSeleccionada: 'Ninguna',
                            apppriv: apppriv
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    /// POST
    /// Agrega una nueva carrera a la facultad seleccionada por el usuario
    ///
    app.post('/agcarrera', function (req, res) {
        var facultad = req.body.facSeleccionada;
        var carrera = req.body.nombre;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            if (carrera.length > 0 && carrera.length < 61 && facultad != 'Ninguna') {
                connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                    if (errorApp) throw errorApp;
                    if (resultApp.length > 0) {
                        if (facultad != 'Ninguna') {
                            connection.query(selectCarrera, [carrera], function (errorCarr, resultCarr) {
                                if (errorCarr) throw errorCarr;
                                if (resultCarr.length > 0) {
                                    app.locals.errorMessage = carrera + ' ya existe en la facultad de ' + facultad;
                                    res.redirect('/agcarrera');
                                } else {
                                    connection.query(insertCarrera, [facultad, carrera], function (errorIns, resultIns) {
                                        if (errorIns) throw errorIns;
                                        if (resultIns.affectedRows > 0) {
                                            app.locals.succesfulMessage = carrera + ' agregada correctamente a la ' + facultad;
                                            connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
                                                if (errorApp) throw errorApp;
                                                if (resultApp.length > 0) {
                                                    var priv = 'app';
                                                    connection.query(selectFacultades, function (error, result) {
                                                        if (error) throw error;
                                                        if (result.length > 0) {
                                                            var facultades = JSON.parse(JSON.stringify(result));
                                                            res.render('agcarrera', {
                                                                title: 'Agregar carreras',
                                                                usuario: req.cookies.name,
                                                                errorMessage: app.locals.errorMessage,
                                                                succesfulMessage: app.locals.succesfulMessage,
                                                                facultades: facultades,
                                                                priv: priv,
                                                                facSeleccionada: facultad
                                                            });
                                                            app.locals.errorMessage = '';
                                                            app.locals.succesfulMessage = '';
                                                        } else {
                                                            res.render('agcarrera', {
                                                                title: 'Agregar carreras',
                                                                usuario: username,
                                                                errorMessage: app.locals.errorMessage,
                                                                succesfulMessage: app.locals.succesfulMessage,
                                                                priv: priv,
                                                                facSeleccionada: facultad
                                                            });
                                                            app.locals.errorMessage = '';
                                                            app.locals.succesfulMessage = '';
                                                        }
                                                    });
                                                } else {
                                                    res.redirect('/');
                                                }
                                            });
                                        } else {
                                            app.locals.errorMessage = 'No se pudo agregar la carrera ' + carrera + ' intentalo nuevamente';
                                            res.redirect('/agcarrera');
                                        }
                                    });

                                }
                            });
                        } else {
                            app.locals.errorMessage = 'Debes seleccionar una facultad antes de agregar una carrera';
                            res.redirect('/agcarrera');
                        }
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                connection.query(selectFacultades, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var facultades = JSON.parse(JSON.stringify(result));
                        res.render('agcarrera', {
                            title: 'Agregar carreras',
                            usuario: username,
                            errorMessage: 'Asegurate de seleccionar una facultad y de que la longitud del nombre de la carrera sea mayor a 0 y menor a 61 letras.',
                            succesfulMessage: '',
                            facultades: facultades,
                            priv: 'app',
                            facSeleccionada: facultad
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('agcarrera', {
                            title: 'Agregar carreras',
                            usuario: username,
                            errorMessage: 'Asegurate de seleccionar una facultad y de que la longitud del nombre de la carrera sea mayor a 0 y menor a 61 letras.',
                            succesfulMessage: '',
                            priv: 'app',
                            facSeleccionada: facultad
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// Muestra la interfaz para consultar facultades
    ///
    app.get('/confacultad', function (req, res) {
        var apppriv = false;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var priv = 'app';
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectFacultades, function (errorFac, resFac) {
                        if (errorFac) throw errorFac;
                        if (resFac.length > 0) {
                            var facultades = JSON.parse(JSON.stringify(resFac));
                            res.render('confacultad', {
                                title: 'Consultar facultades',
                                usuario: req.cookies.name,
                                facultades: facultades,
                                apppriv: apppriv,
                                priv: priv
                            })
                        } else {
                            res.redirect('/workspace');
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// GET 
    /// Muestra la página para eliminar una facultad de la base de datos
    ///
    app.get('/elfacultad', function (req, res) {
        var apppriv = false;
        connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var priv = 'app';
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    apppriv = true;
                connection.query(selectFacultades, function (errorFac, resultFac) {
                    if (errorFac) throw errorFac;
                    if (resultFac.length > 0) {
                        var facultades = JSON.parse(JSON.stringify(resultFac));
                        res.render('elfacultad', {
                            title: 'Eliminar facultad',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: facultades,
                            priv: priv,
                            apppriv: apppriv
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        app.locals.errorMessage = 'No has agregado facultades, debes agregar al menos una facultad antes de realizar eliminaciones';
                        res.redirect('/agfacultad');
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    /// POST
    /// Elimina la facultad seleccionada por el usuario
    ///
    app.post('/elfacultad', function (req, res) {
        var facultad = req.body.facultad;

        if (typeof (facultad) != 'undefined') {
            connection.query(selectFacultad, [facultad], function (errorFac, resultFac) {
                if (errorFac) throw errorFac;
                if (resultFac.length > 0) {
                    connection.query(deleteFacultad, [facultad], function (error, result) {
                        if (error) throw error;
                        if (result.affectedRows > 0) {
                            app.locals.succesfulMessage = facultad + ' eliminada correctamente';
                            res.redirect('/elfacultad');
                        } else {
                            app.locals.errorMessage = 'No se pudo eliminar la' + facultad + ' intentalo nuevamente';
                            res.redirect('/elfacultad');
                        }
                    });
                } else {
                    app.locals.errorMessage = 'No existe la ' + facultad + ' intentalo nuevamente';
                    res.redirect('/elfacultad');
                }
            });
        } else {
            app.locals.errorMessage = 'No hay facultades disponibles para eliminar';
            res.redirect('/elfacultad');
        }
    });

    /// GET
    /// Muestra las carreras para la facultad seleccionada
    ///
    app.get('/selfacultad', function (req, res) {
        var facultadSeleccionada = req.query.facultad;
        connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var priv = 'app';
                connection.query(selectFacultades, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var facultades = JSON.parse(JSON.stringify(result));
                        res.render('agcarrera', {
                            title: 'Agregar carreras',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: facultades,
                            priv: priv,
                            facSeleccionada: facultadSeleccionada
                        });
                    } else {
                        res.render('agcarrera', {
                            title: 'Agregar carreras',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: 'undefined',
                            priv: priv,
                            facSeleccionada: facultadSeleccionada
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    /// GET
    /// Muestra la página para agregar una nueva facultad a la
    /// base de datos
    app.get('/agfacultad', function (req, res) {
        var apppriv = false;
        connection.query(checkAplicadorName, [req.cookies.name], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                var appData = JSON.parse(JSON.stringify(result));
                if (appData[0].Privilegios == 'administrativos')
                    apppriv = true;
                res.render('agfacultad', {
                    title: 'Agregar facultad',
                    usuario: req.cookies.name,
                    errorMessage: app.locals.errorMessage,
                    succesfulMessage: app.locals.succesfulMessage,
                    priv: 'app',
                    apppriv: apppriv
                });
                app.locals.errorMessage = '';
                app.locals.succesfulMessage = '';
            } else {
                res.redirect('/');
            }
        });
    });

    /// POST
    /// Agrega una nueva facultad a la base de datos
    ///
    app.post('/agfacultad', function (req, res) {
        var username = req.cookies.name;
        var facultad = req.body.nombre;

        if (typeof (username) != 'undefined') {
            if (facultad.length > 0 && facultad.length < 61) {
                connection.query(checkAplicadorName, username, function (errorApp, resApp) {
                    if (errorApp) throw errorApp;
                    if (resApp.length > 0) {
                        connection.query(selectFacultad, facultad, function (errorSel, resultSel) {
                            if (errorSel) throw errorSel;
                            if (resultSel.length > 0) {
                                app.locals.errorMessage = facultad + ' ya existe';
                                res.redirect('/agfacultad');
                            } else {
                                connection.query(insertFacultad, facultad, function (errorIns, resultIns) {
                                    if (errorIns) throw errorIns;
                                    if (resultIns.affectedRows > 0) {
                                        app.locals.succesfulMessage = facultad + ' agregada correctamente';
                                        res.redirect('/agfacultad');
                                    } else {
                                        app.locals.errorMessage = 'No se pudo agregar ' + facultad + ' , intentalo nuevamente';
                                        res.redirect('/agfacultad');
                                    }
                                });
                            }
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                app.locals.errorMessage = 'Verifica que la longitud de letras del nombre de la facultad sea mayor a 0 y menor a 61.'
                res.redirect('/agfacultad');
            }
        } else {
            res.redirect('/');
        }
    });

    /// GET
    /// CONSULTAR preguntas y respuestas
    ///
    app.get('/consultarpregres', function (req, res) {
        var username = req.cookies.name;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    privilegios = true;
                connection.query(selectTest, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var test = JSON.parse(JSON.stringify(result));
                        res.render('consultarpregres', {
                            title: 'Consultar preguntas y respuestas',
                            usuario: username,
                            apppriv: privilegios,
                            priv: 'app',
                            test: test
                        });
                    } else {
                        res.render('consultarpregres', {
                            title: 'Consultar preguntas y respuestas',
                            usuario: username,
                            apppriv: privilegios,
                            errorMessage: 'No hay test disponibles para consultar',
                            priv: 'app'
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    app.get('/search_preg_res', function (req, res) {
        var username = req.cookies.name;
        var testSeleccionado = req.query.test;
        var privilegios = false;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    privilegios = true;
                connection.query(selectAllQuestions_Test, [testSeleccionado], function (errorTest, resultTest) {
                    if (errorTest) throw errorTest;
                    if (resultTest.length > 0) {
                        var preguntas = JSON.parse(JSON.stringify(resultTest));
                        connection.query(selectRespuestas_Test, [testSeleccionado], function (errorPregs, resultPregs) {
                            if (errorPregs) throw errorPregs;
                            if (resultPregs.length > 0) {
                                var respuestas = JSON.parse(JSON.stringify(resultPregs));
                                res.render('consultarpregres', {
                                    title: 'Consultar preguntas y respuestas',
                                    usuario: username,
                                    preguntas: preguntas,
                                    respuestas: respuestas,
                                    apppriv: privilegios,
                                    priv: 'app'
                                });
                            } else {
                                res.send('No hay respuestas');
                            }
                        });

                    } else {
                        res.send('No hay preguntas');
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    ///
    /// Agregar preguntas y respuestas a los test
    ///
    app.get('/agregarpregres', function (req, res) {
        var privilegios = false;
        var username = req.cookies.name;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    privilegios = true;
                //Consultamos los test de la base de datos
                connection.query(selectTest, function (errorTest, resultTest) {
                    if (errorTest) throw errorTest;
                    if (resultTest.length > 0) {
                        var test = JSON.parse(JSON.stringify(resultTest));
                        res.render('agregarpregres', {
                            title: 'Agregar preguntas y respuestas',
                            usuario: username,
                            test: test,
                            apppriv: privilegios,
                            priv: 'app',
                            addRespuestaErrorMessage: app.locals.addRespuestaErrorMessage,
                            addRespuestaSuccesfulMessage: app.locals.addRespuestaSuccesfulMessage
                        });
                    } else {
                        res.render('agregarpregres', {
                            title: 'Agregar preguntas y respuestas',
                            usuario: username,
                            apppriv: privilegios,
                            priv: 'app',
                            addRespuestaErrorMessage: app.locals.addRespuestaErrorMessage,
                            addRespuestaSuccesfulMessage: app.locals.addRespuestaSuccesfulMessage
                        });
                    }
                });
                app.locals.addPregErrorMessage = '';
                app.locals.addPregSuccesfulMessage = '';
                app.locals.addRespuestaErrorMessage = '';
                app.locals.addRespuestaSuccesfulMessage = '';
            } else {
                res.redirect('/');
            }
        });
    });

    ///
    /// GET para insertar una nueva pregunta al test seleccionado
    ///
    app.get('/agregarpregunta', function (req, res) {
        var testSeleccionado = req.query.testSeleccionado;
        var numero = req.query.numero;
        var pregunta = req.query.pregunta;
        var data = [testSeleccionado, numero, pregunta];

        try {
            if (testSeleccionado != 'undefined' && testSeleccionado != null && testSeleccionado != 'Ninguno') {
                connection.query(selectNumPreg_Test, [testSeleccionado, numero], function (errorPreg, resultPreg) {
                    if (errorPreg) throw errorPreg;
                    if (resultPreg.length > 0) {
                        app.locals.addPregErrorMessage = 'Ya existe la pregunta número ' + numero + ' para el test ' + testSeleccionado;
                        res.render('agregarpregres', {
                            title: 'Agregar preguntas y respuestas',
                            usuario: req.cookies.name,
                            test: testSeleccionado,
                            addPregErrorMessage: app.locals.addPregErrorMessage,
                            addPregSuccesfulMessage: app.locals.addPregSuccesfulMessage
                        });
                    } else {
                        connection.query(insertPregunta, data, function (errorPreg, resultPreg) {
                            if (errorPreg) throw errorPreg;
                            if (resultPreg.affectedRows > 0) {
                                app.locals.addPregSuccesfulMessage = 'Pregunta insertada correctamente el el test ' + testSeleccionado;
                                connection.query(selectTest, function (errorTest, resultTest) {
                                    if (errorTest) throw errorTest;
                                    if (resultTest.length > 0) {
                                        var test = JSON.parse(JSON.stringify(resultTest));
                                        connection.query(selectQuestions, [testSeleccionado], function (errorQuestion, resultQuestion) {
                                            if (errorQuestion) throw errorQuestion;
                                            if (resultQuestion.length > 0) {
                                                var preguntas = JSON.parse(JSON.stringify(resultQuestion));
                                                var numeroPreg = preguntas[0].Numero + 1;
                                                res.render('agregarpregres', {
                                                    title: 'Agregar preguntas y respuesta',
                                                    usuario: req.cookies.name,
                                                    test: test,
                                                    testSeleccionado: testSeleccionado,
                                                    preguntas: preguntas,
                                                    numeroPregunta: numeroPreg,
                                                    addPregErrorMessage: app.locals.addPregErrorMessage,
                                                    addPregSuccesfulMessage: app.locals.addPregSuccesfulMessage
                                                });
                                            } else {
                                                res.render('agregarpregres', {
                                                    title: 'Agregar preguntas y respuestas',
                                                    usuario: req.cookies.name,
                                                    testSeleccionado: testSeleccionado,
                                                    test: test,
                                                    addPregErrorMessage: app.locals.addPregErrorMessage,
                                                    addPregSuccesfulMessage: app.locals.addPregSuccesfulMessage
                                                });
                                            }
                                        });
                                    } else {
                                        res.render('agregarpregres', {
                                            title: 'Agregar preguntas y respuestas',
                                            usuario: req.cookies.name,
                                            addPregErrorMessage: app.locals.addPregErrorMessage,
                                            addPregSuccesfulMessage: app.locals.addPregSuccesfulMessage
                                        });
                                    }
                                });
                            } else {
                                app.locals.addPregErrorMessage = 'No se pude agregar la pregunta, vuelve a intentarlo';
                                res.render('agregarpregres', {
                                    title: 'Agregar preguntas y respuestas',
                                    testSeleccionado: testSeleccionado,
                                    usuario: req.cookies.name,
                                    addPregErrorMessage: app.locals.addPregErrorMessage,
                                    addPregSuccesfulMessage: app.locals.addPregSuccesfulMessage
                                });
                            }
                        });
                    }
                });
            } else {
                app.locals.addPregErrorMessage = 'No has seleccionadoo ningún test';
                res.render('agregarpregres', {
                    title: 'Agregar preguntas y respuestas',
                    usuario: req.cookies.name,
                    addPregErrorMessage: app.locals.addPregErrorMessage,
                    addPregSuccesfulMessage: app.locals.addPregSuccesfulMessage
                });
            }
            app.locals.addPregErrorMessage = '';
            app.locals.addPregSuccesfulMessage = '';
            app.locals.addRespuestaErrorMessage = '';
            app.locals.addRespuestaSuccesfulMessage = '';
        } catch (exception) {
            console.log(exception);
            res.redirect('/agregarpregunta');
        }
    });

    ///
    /// GET de la acción /agregarrespuesta
    /// Agrega una respuesta a una pregunta
    app.get('/agregarrespuesta', function (req, res) {
        var testSeleccionado = req.query.testSeleccionado;
        var numResp = req.query.numero;
        var pregunta = req.query.pregunta;
        var respuesta = req.query.respuesta;
        var data = [testSeleccionado, pregunta, respuesta];
        var username = req.cookies.name;
        var puntuacion = req.query.puntuacion;

        pregunta = pregunta.split(".")[0] + '%';
        connection.query(selectNumPreg, [testSeleccionado, pregunta], function (errorR, resultR) {
            if (errorR) throw errorR;
            if (resultR.length > 0) {
                var dPregunta = JSON.parse(JSON.stringify(resultR));
                var numero = dPregunta[0].Numero;
                data = [testSeleccionado, numero, numResp, respuesta, puntuacion];
                connection.query(insertRespuesta, data, function (error, result) {
                    if (error) throw error;
                    if (result.affectedRows > 0) {
                        app.locals.addRespuestaSuccesfulMessage = 'Respuesta insertada correctamente';
                        connection.query(selectTest, function (errorTest, resultTest) {
                            if (errorTest) throw errorTest;
                            if (resultTest.length > 0) {
                                var test = JSON.parse(JSON.stringify(resultTest));
                                connection.query(selectQuestions, [testSeleccionado], function (errorQuestion, resultQuestion) {
                                    if (errorQuestion) throw errorQuestion;
                                    if (resultQuestion.length > 0) {
                                        var preguntas = JSON.parse(JSON.stringify(resultQuestion));
                                        var numeroPreg = preguntas[0].NumPregunta + 1;
                                        res.render('agregarpregres', {
                                            title: 'Agregar preguntas y respuesta',
                                            usuario: username,
                                            test: test,
                                            testSeleccionado: testSeleccionado,
                                            preguntas: preguntas,
                                            numeroPregunta: numeroPreg,
                                            numeroRespuesta: numResp + 1,
                                            addRespuestaErrorMessage: app.locals.addRespuestaErrorMessage,
                                            addRespuestaErrorMessage: app.locals.addRespuestaErrorMessage
                                        });
                                        app.locals.addPregErrorMessage = '';
                                        app.locals.addPregSuccesfulMessage = '';
                                        app.locals.addRespuestaErrorMessage = '';
                                        app.locals.addRespuestaSuccesfulMessage = '';
                                    } else {
                                        res.render('agregarpregres', {
                                            title: 'Agregar preguntas y respuestas',
                                            usuario: username,
                                            testSeleccionado: testSeleccionado,
                                            test: test,
                                            numeroRespuesta: numResp + 1,
                                            addRespuestaErrorMessage: app.locals.addRespuestaErrorMessageaddRespuestaErrorMessage,
                                            addRespuestaErrorMessage: app.locals.addRespuestaErrorMessage
                                        });
                                        app.locals.addPregErrorMessage = '';
                                        app.locals.addPregSuccesfulMessage = '';
                                        app.locals.addRespuestaErrorMessage = '';
                                        app.locals.addRespuestaSuccesfulMessage = '';
                                    }
                                });
                            } else {
                                res.render('agregarpregres', {
                                    title: 'Agregar preguntas y respuestas',
                                    usuario: req.cookies.name,
                                    numeroRespuesta: numResp,
                                    addRespuestaErrorMessage: app.locals.addRespuestaErrorMessage,
                                    addRespuestaSuccesfulMessage: app.locals.addRespuestaSuccesfulMessage
                                });
                                app.locals.addPregErrorMessage = '';
                                app.locals.addPregSuccesfulMessage = '';
                                app.locals.addRespuestaErrorMessage = '';
                                app.locals.addRespuestaSuccesfulMessage = '';
                            }
                        });
                    } else {
                        app.locals.addRespuestaErrorMessage = 'No se pude insertar la respuesta, vuelve a intentarlo';
                        res.render('agregarpregres', {
                            title: 'Agregar preguntas y respuestas',
                            usuario: username,
                            addRespuestaErrorMessage: app.locals.addRespuestaErrorMessage,
                            addRespuestaSuccesfulMessage: app.locals.addRespuestaSuccesfulMessage
                        });
                        app.locals.addPregErrorMessage = '';
                        app.locals.addPregSuccesfulMessage = '';
                        app.locals.addRespuestaErrorMessage = '';
                        app.locals.addRespuestaSuccesfulMessage = '';
                    }
                });
            } else {
                res.send("Error");
                //res.redirect('/agregarrespuesta');
            }
        });
    });

    /// GET /selecciontest
    /// Selecciona el test definido por el administrador para
    /// insertar nuevas preguntas y respuestas en dicho test
    app.get('/selecciontest', function (req, res) {
        var testSeleccionado = req.query.test;
        var username = req.cookies.name;
        var privilegios = false;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                connection.query(selectTest, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var appData = JSON.parse(JSON.stringify(resultApp));
                        if (appData[0].Privilegios == 'administrativos')
                            privilegios = true;
                        var test = JSON.parse(JSON.stringify(result));
                        connection.query(selectQuestions, [testSeleccionado], function (errorQuestion, resultQuestion) {
                            if (errorQuestion) throw errorQuestion;
                            if (resultQuestion.length > 0) {
                                var preguntas = JSON.parse(JSON.stringify(resultQuestion));
                                var numeroPreg = preguntas[0].Numero + 1;
                                res.render('agregarpregres', {
                                    title: 'Agregar preguntas y respuesta',
                                    usuario: username,
                                    test: test,
                                    apppriv: privilegios,
                                    app: 'priv',
                                    testSeleccionado: testSeleccionado,
                                    preguntas: preguntas,
                                    numeroPregunta: numeroPreg
                                });
                                app.locals.addPregSuccesfulMessage = '';
                                app.locals.addPregErrorMessage = '';
                                app.locals.addRespuestaErrorMessage = '';
                                app.locals.addRespuestaSuccesfulMessage = '';
                            } else {
                                res.render('agregarpregres', {
                                    title: 'Agregar preguntas y respuestas',
                                    usuario: username,
                                    apppriv: privilegios,
                                    app: 'priv',
                                    testSeleccionado: testSeleccionado,
                                    test: test
                                });
                                app.locals.addPregSuccesfulMessage = '';
                                app.locals.addPregErrorMessage = '';
                                app.locals.addRespuestaErrorMessage = '';
                                app.locals.addRespuestaSuccesfulMessage = '';
                            }
                        });
                    } else {
                        res.render('agregarpregres', {
                            title: 'Agregar preguntas y respuestas',
                            usuario: username,
                            apppriv: privilegios,
                            app: 'priv',
                            testSeleccionado: testSeleccionado
                        });
                        app.locals.addPregSuccesfulMessage = '';
                        app.locals.addPregErrorMessage = '';
                        app.locals.addRespuestaErrorMessage = '';
                        app.locals.addRespuestaSuccesfulMessage = '';
                    }
                });
            } else {
                res.redirect('/');
            }
        });



    });

    ///
    /// GET y POST de la página /consultartest
    /// Realiza la consulta de todos los test dados de alta en la base de datos
    app.get('/consultartest', function (req, res) {
        var username = req.cookies.name;
        var privilegios = false;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    privilegios = true;
                connection.query(selectTest, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var string = JSON.stringify(result);
                        var datos = JSON.parse(string);
                        res.render('consultartest', {
                            title: 'Consultar test',
                            usuario: username,
                            apppriv: privilegios,
                            priv: 'app',
                            datos: datos
                        });
                    } else {
                        res.render('consultartest', {
                            title: 'Consultar test',
                            usuario: username,
                            apppriv: privilegios,
                            priv: 'app'
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    ///
    /// GET y POST de la página /eliminartest
    /// Elimina el test seleccionado en cascada
    app.get('/eliminartest', function (req, res) {
        var username = req.cookies.name;
        var privilegios = false;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        privilegios = true;
                    connection.query(selectTest, function (errorTest, resultTest) {
                        if (errorTest) throw errorTest;
                        if (resultTest.length > 0) {
                            var test = JSON.parse(JSON.stringify(resultTest));
                            res.render('eliminartest', {
                                title: 'Eliminar test',
                                usuario: username,
                                priv: 'app',
                                apppriv: privilegios,
                                test: test,
                                errorMessage: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        } else {
                            res.render('eliminartest', {
                                title: 'Eliminar test',
                                usuario: username,
                                priv: 'app',
                                apppriv: privilegios,
                                errorMessage: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// POST
    /// Elimina un test en cascada de la base de datos
    ///
    app.post('/eliminartest', function (req, res) {
        var test = req.body.test;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            if (typeof (test) != 'undefined') {
                connection.query(checkAplicadorName, username, function (errApp, resApp) {
                    if (errApp) throw errApp;
                    if (resApp.length > 0) {
                        connection.query(existTestQuery, test, function (errExist, resExist) {
                            if (errExist) throw errExist;
                            if (resExist.length > 0) {
                                connection.query(deleteTest, test, function (error, result) {
                                    if (error) throw error;
                                    if (result.affectedRows > 0) {
                                        app.locals.succesfulMessage = 'Test eliminado correctamente';
                                        res.redirect('eliminartest');
                                    } else {
                                        app.locals.errorMessage = 'No se pudo eliminar el test, error desconocido';
                                        res.redirect('eliminartest');
                                    }
                                });
                            } else {
                                app.locals.errorMessage = 'No existe test con el nombre ' + test;
                                res.redirect('eliminartest');
                            }
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                app.locals.errorMessage = '¡Error! No seleccionaste ningún test.';
                res.redirect('eliminartest');
            }
        } else {
            res.redirect('/');
        }
    });

    ///
    /// GET y POST de la página /agregartest
    /// Abre el formulario para agregar un nuevo test a la base de datos
    app.get('/agregartest', function (req, res) {
        var username = req.cookies.name;
        var privilegios = false;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    privilegios = true;
                connection.query(selectTest, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var test = JSON.parse(JSON.stringify(result));
                        res.render('agregartest', {
                            title: 'Agregar test',
                            usuario: username,
                            test: test,
                            priv: 'app',
                            apppriv: privilegios,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('agregartest', {
                            title: 'Agregar test',
                            priv: 'app',
                            usuario: username,
                            apppriv: privilegios,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    /// POST
    /// Agrega un nuevo test a la base de datos
    ///
    app.post('/agregartest', function (req, res) {
        var descripcion = req.body.descripcion.toString().replace('\r\n', '');
        var test = req.body.nombre;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            if (test.length > 0 && test.length < 101) {
                connection.query(checkAplicadorName, username, function (errApp, resApp) {
                    if (errApp) throw errApp;
                    if (resApp.length > 0) {
                        connection.query(selectTest_Name, test, function (errorTest, resultTest) {
                            if (errorTest) throw errorTest;
                            if (resultTest.length > 0) {
                                res.render('agregartest', {
                                    title: 'Agregar test',
                                    usuario: username,
                                    errorMessage: 'El test ' + test + ' ya existe',
                                    succesfulMessage: ''
                                });
                            } else {
                                connection.query(insertTest, [test, descripcion], function (error, result) {
                                    if (error) throw error;
                                    if (result.affectedRows > 0) {
                                        res.render('agregartest', {
                                            title: 'Agregar test',
                                            usuario: username,
                                            errorMessage: '',
                                            succesfulMessage: 'Test agregado correctamente'
                                        });
                                    } else {
                                        res.render('agregartest', {
                                            title: 'Agregar test',
                                            usuario: username,
                                            errorMessage: 'No se pudo agregar el test, vuelve a intentarlo',
                                            succesfulMessage: ''
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                res.render('agregartest', {
                    title: 'Agregar test',
                    usuario: username,
                    errorMessage: 'Verifica que la longitud de letras del nombre del test sea mayor a 0 y menor a 101.',
                    succesfulMessage: ''
                });
            }
        } else {
            res.redirect('/');
        }
    });

    /// POST
    /// Envia el cuestionario de consumo de sustancias
    ///
    app.post('/enviar_csustancias', function (req, res) {
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;
        var resp1 = req.body.resp1;
        var resp8 = req.body.resp8;
        var resp9 = req.body.resp9;

        if (typeof (resp1) != 'undefined') {
            for (i = 0; i < resp1.length; i++) {
                respuestas += resp1[i] + ' ';
            }
            respuestas = respuestas.substring(0, respuestas.length - 1) + '#';
        } else {
            respuestas += ' #';
        }

        respuestas += 'Alcohol ' + req.body.resp2a + ' año(s). ' + 'Tabaco ' + req.body.resp2b + ' año(s). ' + 'Marihuana ' + req.body.resp2c + ' año(s). ' + 'Medicamentos sin prescripción médica ' + req.body.resp2d + ' año(s). ' + 'Otras sustancia(s) ' + req.body.resp2e + ' año(s).#';

        if (typeof (req.body.resp3) != 'undefined') {
            respuestas += req.body.resp3 + '#';
        } else {
            respuestas += ' #';
        }

        if (typeof (req.body.resp4) != 'undefined') {
            respuestas += req.body.resp4 + '#';
        } else {
            respuestas += ' #';
        }

        if (typeof (req.body.resp5) != 'undefined') {
            respuestas += req.body.resp5 + '#';
        } else {
            respuestas += ' #';
        }

        if (typeof (req.body.resp6) != 'undefined') {
            respuestas += req.body.resp6 + '#';
        } else {
            respuestas += ' #';
        }

        if (typeof (req.body.resp7) != 'undefined') {
            respuestas += req.body.resp7 + '#';
        } else {
            respuestas += ' #';
        }

        if (typeof (resp8) != 'undefined') {
            for (i = 0; i < resp8.length; i++) {
                respuestas += resp8[i] + ' ';
            }
            respuestas = respuestas.substring(0, respuestas.length - 1) + '#';
        } else {
            respuestas += ' #';
        }

        if (typeof (resp9) != 'undefined') {
            for (i = 0; i < resp9.length; i++) {
                respuestas += resp9[i] + ' ';
            }
            respuestas = respuestas.substring(0, respuestas.length - 1);
        }

        /*
        puntuacion = req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
            req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
            req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
            req.body.resp10.split(".")[0];
            */


        var puntuaciones = puntuacion.split("#");
        //var total = calcularTotal(puntuaciones);
        //var diagnostico = diagnosticoAudit(total);
        var total = 'Indefinido';
        var diagnostico = 'No hay diagnóstico predefinido para este test.'

        connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
            if (errTest) throw errTest;
            if (resTest.length > 0) {
                connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                    if (errorRes) throw errorRes;
                    if (resultRes.affectedRows > 0) {
                        connection.query(selectFolio, function (errorFolio, resultFolio) {
                            if (errorFolio) throw errorFolio;
                            if (resultFolio.length > 0) {
                                var result = JSON.parse(JSON.stringify(resultFolio));
                                folio = result[0].Folio;
                                connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                    if (errorUpdate) throw errorUpdate;
                                    if (resultUpdate.affectedRows > 0) {
                                        res.redirect('/workspace');
                                    }
                                });
                            } else {
                                res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                            }
                        });
                    } else {
                        res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                    }
                });
            } else {
                res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
            }
        });
    });

    ///
    /// POST de la página /enviaraudit
    /// Envía el cuestionario AUDIT
    app.post('/enviaraudit', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp9) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp10) != 'undefined') minPreg += 1;

        if (minPreg >= 10) {
            respuestas = req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8 + '#' + req.body.resp9 + '#' + req.body.resp10;

            puntuacion = req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
                req.body.resp10.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotal(puntuaciones);
            var diagnostico = diagnosticoAudit(total);
            total = total.toString(10);

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    /// POST de la página /enviar_adaptacion
    /// Envía el cuestionario de adaptación social
    ///
    app.post('/enviar_adaptacion', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;
        var resp1 = "0.No contestada";
        var resp2 = "0.No contestada";

        if (typeof (req.body.resp0) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp1) != 'undefined' || typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp9) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp10) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp11) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp12) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp13) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp14) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp15) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp16) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp17) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp18) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp19) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp20) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp21) != 'undefined') minPreg += 1;

        if (minPreg >= 21) {
            if (typeof (req.body.resp1) != 'undefined')
                resp1 = req.body.resp1;
            if (typeof (req.body.resp2) != 'undefined')
                resp2 = req.body.resp2;

            respuestas = req.body.resp0 + '#' +
                resp1 + '#' + resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8 + '#' + req.body.resp9 + '#' + req.body.resp10 + '#' +
                req.body.resp11 + '#' + req.body.resp12 + '#' + req.body.resp13 + '#' + req.body.resp14 + '#' + req.body.resp15 + '#' +
                req.body.resp16 + '#' + req.body.resp17 + '#' + req.body.resp18 + '#' + req.body.resp19 + '#' + req.body.resp20 + '#' +
                req.body.resp21;

            puntuacion = 0 + "#" +
                resp1.split(".")[0] + '#' + resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
                req.body.resp10.split(".")[0] + '#' + req.body.resp11.split(".")[0] + '#' + req.body.resp12.split(".")[0] + '#' +
                req.body.resp13.split(".")[0] + '#' + req.body.resp14.split(".")[0] + '#' + req.body.resp15.split(".")[0] + '#' +
                req.body.resp16.split(".")[0] + '#' + req.body.resp17.split(".")[0] + '#' + req.body.resp18.split(".")[0] + '#' +
                req.body.resp19.split(".")[0] + '#' + req.body.resp20.split(".")[0] + '#' + req.body.resp21.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotal(puntuaciones);
            var diagnostico = diagnosticoAdaptacion(total);

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    /// POST de la página /enviar_orientacion
    ///
    ///
    app.post('/enviar_orientacion', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;

        if (minPreg >= 5) {
            respuestas =
                req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5;

            puntuacion =
                req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotal(puntuaciones);
            var diagnostico = "No hay diagnostico predefinido para este cuestionario";

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {

                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    /// POST de la página /enviar_estrasgo
    ///
    ///
    app.post('/enviar_ansiedad', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp9) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp10) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp11) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp12) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp13) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp14) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp15) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp16) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp17) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp18) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp19) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp20) != 'undefined') minPreg += 1;

        if (minPreg >= 20) {
            respuestas =
                req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8 + '#' + req.body.resp9 + '#' + req.body.resp10 + '#' +
                req.body.resp11 + '#' + req.body.resp12 + '#' + req.body.resp13 + '#' + req.body.resp14 + '#' + req.body.resp15 + '#' +
                req.body.resp16 + '#' + req.body.resp17 + '#' + req.body.resp18 + '#' + req.body.resp19 + '#' + req.body.resp20;

            puntuacion =
                req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
                req.body.resp10.split(".")[0] + '#' + req.body.resp11.split(".")[0] + '#' + req.body.resp12.split(".")[0] + '#' +
                req.body.resp13.split(".")[0] + '#' + req.body.resp14.split(".")[0] + '#' + req.body.resp15.split(".")[0] + '#' +
                req.body.resp16.split(".")[0] + '#' + req.body.resp17.split(".")[0] + '#' + req.body.resp18.split(".")[0] + '#' +
                req.body.resp19.split(".")[0] + '#' + req.body.resp20.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotal(puntuaciones);
            var diagnostico = "No hay un diagnostico predefinido para el test actual";

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');

                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    /// 
    /// POST de la página /enviar_eamdzc
    ///
    app.post('/enviar_eamdzc', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp9) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp10) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp11) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp12) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp13) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp14) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp15) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp16) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp17) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp18) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp19) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp20) != 'undefined') minPreg += 1;

        if (minPreg >= 20) {
            respuestas =
                req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8 + '#' + req.body.resp9 + '#' + req.body.resp10 + '#' +
                req.body.resp11 + '#' + req.body.resp12 + '#' + req.body.resp13 + '#' + req.body.resp14 + '#' + req.body.resp15 + '#' +
                req.body.resp16 + '#' + req.body.resp17 + '#' + req.body.resp18 + '#' + req.body.resp19 + '#' + req.body.resp20;

            puntuacion =
                req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
                req.body.resp10.split(".")[0] + '#' + req.body.resp11.split(".")[0] + '#' + req.body.resp12.split(".")[0] + '#' +
                req.body.resp13.split(".")[0] + '#' + req.body.resp14.split(".")[0] + '#' + req.body.resp15.split(".")[0] + '#' +
                req.body.resp16.split(".")[0] + '#' + req.body.resp17.split(".")[0] + '#' + req.body.resp18.split(".")[0] + '#' +
                req.body.resp19.split(".")[0] + '#' + req.body.resp20.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotal(puntuaciones);
            var diagnostico = diagnosticoDepresion(total);

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    ///
    /// POST para la página /enviar_dn
    ///
    app.post('/enviar_dn', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;

        if (minPreg >= 8) {
            respuestas =
                req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8;

            puntuacion =
                req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotal(puntuaciones);
            var diagnostico = diagnosticoNicotina(total);

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    /// POST de la página /enviar_estrasgo
    ///
    ///
    app.post('/enviar_escala', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp9) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp10) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp11) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp12) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp13) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp14) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp15) != 'undefined') minPreg += 1;

        if (minPreg >= 15) {
            respuestas =
                req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8 + '#' + req.body.resp9 + '#' + req.body.resp10 + '#' +
                req.body.resp11 + '#' + req.body.resp12 + '#' + req.body.resp13 + '#' + req.body.resp14 + '#' + req.body.resp15;

            puntuacion =
                req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
                req.body.resp10.split(".")[0] + '#' + req.body.resp11.split(".")[0] + '#' + req.body.resp12.split(".")[0] + '#' +
                req.body.resp13.split(".")[0] + '#' + req.body.resp14.split(".")[0] + '#' + req.body.resp15.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotal(puntuaciones);
            var diagnostico = diagnosticoEscalaSuicida(total);

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    /// POST de la página /enviar_estrasgo
    ///
    ///
    app.post('/enviar_tdah', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp9) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp10) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp11) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp12) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp13) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp14) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp15) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp16) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp17) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp18) != 'undefined') minPreg += 1;

        if (minPreg >= 18) {
            respuestas =
                req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8 + '#' + req.body.resp9 + '#' + req.body.resp10 + '#' +
                req.body.resp11 + '#' + req.body.resp12 + '#' + req.body.resp13 + '#' + req.body.resp14 + '#' + req.body.resp15 +
                req.body.resp16 + '#' + req.body.resp17 + '#' + req.body.resp18;

            puntuacion =
                req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
                req.body.resp10.split(".")[0] + '#' + req.body.resp11.split(".")[0] + '#' + req.body.resp12.split(".")[0] + '#' +
                req.body.resp13.split(".")[0] + '#' + req.body.resp14.split(".")[0] + '#' + req.body.resp15.split(".")[0] + '#' +
                req.body.resp16.split(".")[0] + '#' + req.body.resp17.split(".")[0] + '#' + req.body.resp18.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotalTDAH(puntuaciones);
            var diagnostico = diagnosticoTDAH(total);

            total = total.split("#");
            total = total[0] + ' ' + total[1];

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

    /// POST de la página /enviar_bornout
    ///
    ///
    app.post('/enviar_bornout', function (req, res) {
        var minPreg = 0;
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = "";
        var fecha = getFechaActual();
        var fechaAplicacion = req.body.fechaAplicacion;
        var puntuacion = "";
        var folio = 0;

        if (typeof (req.body.resp1) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp2) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp3) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp4) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp5) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp6) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp7) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp8) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp9) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp10) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp11) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp12) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp13) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp14) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp15) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp16) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp17) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp18) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp19) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp20) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp21) != 'undefined') minPreg += 1;
        if (typeof (req.body.resp22) != 'undefined') minPreg += 1;

        if (minPreg >= 22) {
            respuestas =
                req.body.resp1 + '#' + req.body.resp2 + '#' + req.body.resp3 + '#' + req.body.resp4 + '#' + req.body.resp5 + '#' +
                req.body.resp6 + '#' + req.body.resp7 + '#' + req.body.resp8 + '#' + req.body.resp9 + '#' + req.body.resp10 + '#' +
                req.body.resp11 + '#' + req.body.resp12 + '#' + req.body.resp13 + '#' + req.body.resp14 + '#' + req.body.resp15 +
                req.body.resp16 + '#' + req.body.resp17 + '#' + req.body.resp18 + '#' + req.body.resp19 + '#' + req.body.resp20 + '#' + req.body.resp21 + '#' + req.body.resp22;

            puntuacion =
                req.body.resp1.split(".")[0] + '#' + req.body.resp2.split(".")[0] + '#' + req.body.resp3.split(".")[0] + '#' +
                req.body.resp4.split(".")[0] + '#' + req.body.resp5.split(".")[0] + '#' + req.body.resp6.split(".")[0] + '#' +
                req.body.resp7.split(".")[0] + '#' + req.body.resp8.split(".")[0] + '#' + req.body.resp9.split(".")[0] + '#' +
                req.body.resp10.split(".")[0] + '#' + req.body.resp11.split(".")[0] + '#' + req.body.resp12.split(".")[0] + '#' +
                req.body.resp13.split(".")[0] + '#' + req.body.resp14.split(".")[0] + '#' + req.body.resp15.split(".")[0] + '#' +
                req.body.resp16.split(".")[0] + '#' + req.body.resp17.split(".")[0] + '#' + req.body.resp18.split(".")[0] + '#' +
                req.body.resp19.split(".")[0] + '#' + req.body.resp20.split(".")[0] + '#' + req.body.resp21.split(".")[0] + '#' + req.body.resp22.split(".")[0];

            var puntuaciones = puntuacion.split("#");
            var total = calcularTotalBornout(puntuaciones);
            var totalSplit = total.split("#");
            var totalSAE = totalSplit[0].split("=")[1];
            var totalSD = totalSplit[1].split("=")[1];
            var totalSR = totalSplit[2].split("=")[1];
            var diagnostico = diagnosticoBornout(totalSAE, totalSD, totalSR);

            total = totalSplit[0] + ' ' + totalSplit[1] + ' ' + totalSplit[2];

            connection.query(selectTestNoContestado, [username, test, fecha], function (errTest, resTest) {
                if (errTest) throw errTest;
                if (resTest.length > 0) {
                    connection.query(insertResultado_Test, [respuestas, puntuacion, total, diagnostico], function (errorRes, resultRes) {
                        if (errorRes) throw errorRes;
                        if (resultRes.affectedRows > 0) {
                            connection.query(selectFolio, function (errorFolio, resultFolio) {
                                if (errorFolio) throw errorFolio;
                                if (resultFolio.length > 0) {
                                    var result = JSON.parse(JSON.stringify(resultFolio));
                                    folio = result[0].Folio;
                                    connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorUpdate, resultUpdate) {
                                        if (errorUpdate) throw errorUpdate;
                                        if (resultUpdate.affectedRows > 0) {
                                            res.redirect('/workspace');
                                        }
                                    });
                                } else {
                                    res.send('Error, no se proceso correctamente la solicitud, intentalo nuevamente.');
                                }
                            });
                        } else {
                            res.send('No se pudieron guardar tus respuestas, vuelve al test anterior y envialo nuevamente.');
                        }
                    });
                } else {
                    res.send('Ya has contestado este test con anterioridad, regresa a la página principal.');
                }
            });
        } else {
            res.send('No has completado todas las preguntas del test, regresa a la página anterior y contesta el test correctamente.');
        }
    });

	///
    /// POST de la pagina /contestartest para miniPLUS
    ///
    app.post('/contestartestMINI', function (req, res) {
        var test = req.body.test;
        var nombre = req.body.nombre;
        var apellidos = req.body.apellidos;
        var aplicador = req.cookies.name;
        var fecha = req.body.fechaAplicacion.split("/");
        fecha = fecha[2] + '-' + fecha[1] + '-' + fecha[0];
        var preguntas = [];
        var respuestas = [];
        var testSeleccionado = req.query.test;

        connection.query(selectUsername,[nombre, apellidos], function(err,  user)
        {
            if(err)
                throw err;
            else
            {
                if (typeof (user) != 'undefined') 
                {
                    var datos = [test, aplicador,  user[0].NombreUsuario, fecha];
                    connection.query(selectTestPendientesUsuario, [test, fecha, user[0].NombreUsuario], function (errTest, resTest) 
                    {
                        if (errTest) 
                            throw errTest;
                        if (resTest.length > 0) 
                        {
                            connection.query(selectPreguntas_Test, [test], function (errorPreg, resultPreg) 
                            {
                                if (errorPreg) throw errorPreg;
                                if (resultPreg.length > 0) {
                                    preguntas = JSON.parse(JSON.stringify(resultPreg));
                                    if (test == 'MINI PLUS') {
                                        res.render('miniplus', {
                                            title: 'MINI PLUS',
                                            usuario: user[0].NombreUsuario,
                                            datos: datos,
                                            preguntas: preguntas,
                                        });
                                        } else {
                                        res.send('No se ha encontrado sel test que buscas...');
                                    }
                                }
                            });
                        }
                        else{
                            res.redirect('/workspace');
                        }
                    });
                } 
                else 
                    res.redirect('/');
            }
        });
    });
    ///
    /// POST de la página /contestartest
    ///
    app.post('/contestartest', function (req, res) {
        var test = req.body.test;
        var aplicador = req.body.username;
        var username = req.cookies.name;
        var fecha = req.body.fechaAplicacion.split("/");
        fecha = fecha[2] + '-' + fecha[1] + '-' + fecha[0];
        var datos = [test, aplicador, username, fecha];
        var preguntas = [];
		var respuestas = [];
		var testSeleccionado = req.query.test;

        if (typeof (username) != 'undefined') 
		{
            connection.query(selectTestPendientesUsuario, [test, fecha, username], function (errTest, resTest) 
			{
                if (errTest) 
					throw errTest;
                if (resTest.length > 0) 
				{
                    connection.query(selectPreguntas_Test, [test], function (errorPreg, resultPreg) 
					{
                        if (errorPreg) throw errorPreg;
                        if (resultPreg.length > 0) {
                            preguntas = JSON.parse(JSON.stringify(resultPreg));
							if (test == 'AUDIT') {
								res.render('audit', {
									title: 'Test AUDIT',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'Escala Autoaplicada de Adaptación Social (Social Adaptation Self-evaluation Scale, SASS)') {
								res.render('adaptacion_social', {
									title: 'Test Escala Autoaplicada de Adaptación Social',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'Escala Autoaplicada para la Medida de la Depresión de Zung y Conde') {
								res.render('eamdzc', {
									title: 'Test Escala Autoaplicada para la Medida de la Depresión de Zung y Conde',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'Test de Fagerstrom de Dependencia de Nicotina') {
								res.render('dependencia_nicotina', {
									title: 'Test de Fagerström de Dependencia de Nicotina',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic') {
								res.render('orientacion_sexual', {
									title: 'Cuestionario autoaplicable de Orientación sexual de Almonte-Herskovic',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)') {
								res.render('ansiedad', {
									title: 'Inventario de Ansiedad Estado-Rasgo (State-Trait Anxiety Inventory, STAI)',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'Escala de Riesgo Suicida de Plutchik') {
								console.log("Hola1\n");
								res.render('escala_suicida', {
									title: 'Escala de Riesgo Suicida de Plutchik',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});

							} else if (test == 'Escala de Cribado de TDAH en Adultos (ASRS-V1.1)') {
								res.render('tdah', {
									title: 'Escala de Riesgo Suicida de Plutchik',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'MASLACH BURNOUT INVENTORY (MBI)') {
								res.render('bornout', {
									title: 'MASLACH BURNOUT INVENTORY (MBI)',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'Cuestionario sobre consumo de sustancias') {
								res.render('csustancias', {
									title: 'Cuestionario sobre consumo de sustancias',
									usuario: username,
									datos: datos,
									preguntas: preguntas
								});
							} else if (test == 'MINI PLUS') {
								res.render('miniplus', {
									title: 'MINI PLUS',
									usuario: username,
									datos: datos,
									preguntas: preguntas,
								});
										//console.log("Mini plus llego!! 2");
							/*connection.query(selectRespuestas_Test, [test], function (errorPregs, resultPregs) {
								if (errorPregs) 
									throw errorPregs;
								if (resultPregs.length > 0) 
								{
									respuestas = JSON.parse(JSON.stringify(resultPregs));
									//console.log("Mini plus llego!!");
									res.render('miniplus', {
										title: 'MINI PLUS',
										usuario: username,
										datos: datos,
										preguntas: preguntas,
										respuestas: respuestas
									});
									//console.log("Mini plus llego!! 2");
								}
							});*/
							} else {
								res.send('No se ha encontrado el test que buscas...');
							}
						}
                    });
				}
				else{
					res.redirect('/workspace');
				}
			});
        } 
		else 
			res.redirect('/');
    });

    ///
    /// GET y POST de la página agregar aplicador
    ///
    app.get('/agregar', function (req, res) {
        var apppriv = false;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, username, function (error, result) {
                if (error) throw error;
                if (result.length > 0) {
                    var appData = JSON.parse(JSON.stringify(result));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true,
                        res.render('agregar', {
                            title: 'Agregar aplicador',
                            usuario: username,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            apppriv: apppriv
                        });
                    app.locals.errorMessage = '';
                    app.locals.succesfulMessage = '';
                } else {
                    res.render('agregar', {
                        title: 'Agregar aplicador',
                        usuario: username,
                        errorMessage: app.locals.errorMessage,
                        succesfulMessage: app.locals.succesfulMessage,
                        apppriv: apppriv
                    });
                    app.locals.errorMessage = '';
                    app.locals.succesfulMessage = '';
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// POST
    /// Agrega un nuevo aplicador a la base de datos
    ///
    app.post('/agregar', function (req, res) {
        var nombreUsuario = req.body.username;
        var nombre = req.body.nombre;
        var apellidos = req.body.apellidos;
        var tel = req.body.telefono;
        var correo = req.body.correo;
        var priv = req.body.privilegios;
        var password = req.body.password;
        var pass = encrypt(nombreUsuario, password);
        var data = [nombreUsuario, nombre, apellidos, tel, correo, priv, pass];
        var username = req.cookies.name;


        if (typeof (username) != 'undefined') {
            if (nombreUsuario.length > 0 && nombreUsuario.length < 46 && nombre.length > 0 && nombre.length < 46 &&
                apellidos.length > 0 && apellidos.length < 46 && tel.length > 0 && tel.length < 17 &&
                correo.length > 0 && correo.length < 46 && password.length > 0 && password.length < 65) {
                connection.query(checkAplicadorName, username, function (errApp, resApp) {
                    if (errApp) throw errApp;
                    if (resApp.length > 0) {
                        connection.query(checkAplicadorName, req.body.username, function (error, result) {
                            if (error) throw error;
                            if (result.length > 0) {
                                app.locals.errorMessage = 'Ya existe un usuario con el nombre que ingresaste, ingresa uno diferente';
                                res.redirect('agregar');
                            } else {
                                connection.query(checkUserName, req.body.username, function (errorName, resultName) {
                                    if (errorName) throw errorName;
                                    else {
                                        if (result.length > 0) {
                                            app.locals.errorMessage = 'Ya existe un usuario con el nombre que ingresaste, ingresa uno diferente';
                                            res.redirect('/agregar');
                                        } else {
                                            connection.query(insertAplicador, data, function (errorAplicador, resultAplicador) {
                                                if (errorAplicador) throw errorAplicador;
                                                if (resultAplicador.affectedRows > 0) {
                                                    app.locals.succesfulMessage = 'Aplicador registrado correctamente, ahora puede iniciar sesión';
                                                    res.redirect('agregar');
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                app.locals.errorMessage = 'Se han encontrado datos incorrectos, verifique que toda la información sea correcta y vuela a intentarlo.';
                res.redirect('agregar');
            }
        } else {
            res.redirect('/');
        }

    });

    ///
    /// GET y POST para eliminar un aplicador
    ///
    app.get('/eliminar', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (error, result) {
                if (error) throw error;
                if (result.length > 0) {
                    var appData = JSON.parse(JSON.stringify(result));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectAplicadoresNoAdmin, function (errorApp, resultApp) {
                        if (errorApp) throw errorApp;
                        if (resultApp.length > 0) {
                            var aplicadores = JSON.parse(JSON.stringify(resultApp));
                            res.render('eliminar', {
                                title: 'Eliminar aplicador',
                                usuario: req.cookies.name,
                                errorMessage: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage,
                                apppriv: apppriv,
                                aplicadores: aplicadores
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        } else {
                            res.render('eliminar', {
                                title: 'Eliminar aplicador',
                                usuario: req.cookies.name,
                                errorMessage: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage,
                                apppriv: apppriv
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        }
                    });
                } else {
                    res.reedirect('/');
                }
            });
        } else {
            res.reedirect('/');
        }
    });

    ///
    /// Elimina un aplicador de la base de datos
    ///
    app.post('/eliminar', function (req, res) {
        var aplicador = req.body.aplicador;
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    connection.query(checkAplicadorName, aplicador, function (errorName, resultName) {
                        if (errorName) throw errorName;
                        if (resultName.length > 0) {
                            connection.query(deleteAplicador, [aplicador], function (error, result) {
                                if (error) throw error;
                                else if (result.affectedRows > 0) {
                                    app.locals.succesfulMessage = 'Aplicador eliminado correctamente';
                                    res.redirect('/eliminar');
                                } else {
                                    app.locals.errorMessage = 'No se pudo elimiar el aplicador con el nombre de usuario ' + aplicador;
                                    res.redirect('/eliminar');
                                }
                            });
                        } else {
                            app.locals.errorMessage = 'No existe aplicador con el nombre de usuario ' + aplicador;
                            res.redirect('/eliminar');
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    ///
    /// GET y POST para la página /consultar
    ///
    app.get('/consultar', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [req.cookies.name], function (error, result) {
                if (error) throw error;
                if (result.length > 0) {
                    var appData = JSON.parse(JSON.stringify(result));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true,
                        connection.query(selectAplicadores, function (errorApp, resultApp) {
                            if (errorApp) throw errorApp;
                            else if (resultApp.length > 0) {
                                var datos = JSON.parse(JSON.stringify(resultApp));
                                res.render('consultar', {
                                    title: 'Consultar aplicadores',
                                    usuario: req.cookies.name,
                                    datos: datos,
                                    apppriv: apppriv
                                });
                            } else {
                                res.render('consultar', {
                                    title: 'Consultar aplicadores',
                                    usuario: username,
                                    apppriv: apppriv
                                });
                            }
                        });
                } else {
                    res.render('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    ///
    /// GET y POST de la página /individual
    ///
    app.get('/individual', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
                if (errorApp) throw errorApp;
                if (resultApp.length > 0) {
                    var priv = 'app';
                    var appData = JSON.parse(JSON.stringify(resultApp));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectTest, function (error, result) {
                        if (error) throw error;
                        if (result.length > 0) {
                            var test = JSON.parse(JSON.stringify(result));
                            res.render('individual', {
                                title: 'Nuevo test individual',
                                usuario: username,
                                test: test,
                                apppriv: apppriv,
                                priv: priv,
                                errorMessager: app.locals.errorMessage,
                                succesfulMessage: app.locals.succesfulMessage
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    ///
    /// POST de la página /individual
    /// Aplica un nuevo test al usuario ingresado por el aplicador
    app.post('/individual', function (req, res) {
        var aplicador = req.cookies.name;
        var usuario = req.body.username;
        var test = req.body.test;
        var fecha = getFechaActual();
        var data = [aplicador, usuario, test, fecha, 'No'];

        if (typeof (aplicador) != 'undefined') {
            if (usuario.length > 0 && usuario.length < 46) {
                connection.query(checkAplicadorName, [aplicador], function (errorApp, resultApp) {
                    if (errorApp) throw errorApp;
                    if (resultApp.length > 0) {
                        connection.query(checkUserName, [usuario], function (errorUser, resultUser) {
                            if (errorUser) throw errorUser;
                            if (resultUser.length > 0) {
                                connection.query(selectTestVerification, [aplicador, usuario, test, fecha], function (errorTest, resultTest) {
                                    if (errorTest) throw errorTest;
                                    if (resultTest.length <= 0) {
                                        connection.query(sendTest, data, function (error, result) {
                                            if (error) throw error;
                                            if (result.affectedRows > 0) {
                                                app.locals.succesfulMessage = 'Test enviado correctamente';
                                                res.redirect('/individual');
                                            }
                                        });
                                    } else {
                                        app.locals.errorMessage = 'Ya enviaste una solicitud a ' + usuario + ' el día de hoy.';
                                        res.redirect('/individual');
                                    }
                                });
                            } else {
                                app.locals.errorMessage = 'No existe el nombre de usuario ' + usuario;
                                res.redirect('/individual');
                            }
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                app.locals.errorMessage = 'Usuario' + usuario + ' invalido, intentalo nuevamente.';
                res.redirect('/individual');
            }
        } else {
            res.redirect('/');
        }
    });

    ///
    /// GET y POST de la página principal
    ///
    app.get('/', function (req, res) {
        res.render('index', {
            title: 'SIPDEP'
        });
    });

    ///
    /// GET y POST de la página about
    ///
    app.get('/about', function (req, res) {
        res.render('about', {
            title: 'Acerca de SIPDEP'
        });
    });

    ///
    /// GET y POST de la página servicios
    ///
    app.get('/servicios', function (req, res) {
        res.render('servicios', {
            title: 'Servicios'
        });
    });

    ///
    /// GET y POST de la página test
    ///
    app.get('/test', function (req, res) {
        res.render('test', {
            title: 'Test'
        });
    });

    ///
    /// GET y POST de la página directorio
    ///
    app.get('/directorio', function (req, res) {
        connection.query(selectAplicadores, function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var aplicadores = JSON.parse(JSON.stringify(resultApp));
                res.render('directorio', {
                    title: 'Directorio',
                    app: aplicadores
                });
            }
        });
    });

    ///
    ///
    ///GET del cambio de contraseña de aplicador con permisos generales y administrativos
    ///Se usa el mismo metodo pero se verifican los privilegios del medico
    ///
    app.get('/cambiarapp', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) {                
                throw errorApp;
            }
            if (resultApp.length > 0) {
                var priv = 'app';
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == "administrativos") apppriv = true;
                connection.query(selectTest, function (errorAlgo, resultAlgo) {
                    if (errorAlgo) throw errorAlgo;
                    if (resultAlgo.length > 0) {
                        var string = JSON.stringify(resultAlgo);
                        var selectJson = JSON.parse(string);
                        console.log(selectJson);
                        console.log(apppriv);
                        res.render('cambiarapp', {
                            title: 'Cambiar la contraseña',
                            usuario: req.cookies.name,
                            apppriv: apppriv,
                                    priv: priv,
                            test: selectJson
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('cambiarapp', {
                            title: 'Cambiar la contraseña',
                            usuario: req.cookies.name,
                            apppriv: apppriv,
                                    priv: priv
                       });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });
    
    
    /*app.get('/cambiarapp1', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) {                
                throw errorApp;
            }
            if (resultApp.length > 0) {
                connection.query(selectTest, function (errorAlgo, resultAlgo) {
                    if (errorAlgo) throw errorAlgo;
                    if (resultAlgo.length > 0) {
                        var string = JSON.stringify(resultAlgo);
                        var selectJson = JSON.parse(string);
                        var appData = JSON.parse(JSON.stringify(resultAlgo));
                        if (appData[0].Privilegios == 'administrativos')
                            apppriv = true,
                        console.log(selectJson);
                        console.log(apppriv);
                        res.render('cambiarapp1', {
                            title: 'Cambiar la contraseña',
                            usuario: req.cookies.name,
                            apppriv: apppriv,
                            test: selectJson
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('cambiarapp1', {
                            title: 'Cambiar la contraseña',
                            usuario: req.cookies.name,
                            apppriv: apppriv
                       });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });
    
    
    
    app.post('/cambiarapp1', function (req, res) {
        var username = req.cookies.name;
        var pass = req.body.oldpasswordapp;
        var passwordOld =  encrypt(username, pass);
        var passNew = req.body.newpasswordapp;
        var passwordNew =  encrypt(username, passNew);

        console.log("User: " + username);
        console.log("PasswordOld: " + passwordOld);
        console.log("NEW: "+passNew);
        try
        {   
            connection.query(checkAplicadorName, [username], function (errorApp, resultApp)
            {
                if (errorApp) 
                {                   
                    throw errorApp;
                }
                else 
                {
                    if (resultApp.length > 0) 
                    {    
                        connection.query(selectCurrentPassword1, [username, passwordOld], function (error, result) 
                        {
                            if (error) 
                            {
                                throw error;
                            }
                            else
                            if (result.length > 0) 
                            {                                
                                connection.query(updateUserPassword1, [passwordNew, username], function (errorIns, resultIns) 
                                {
                                    console.log("Hola1\n");
                                    if (errorIns) 
                                    {
                                        throw errorIns;
                                        console.log("Hola2\n\n");
                                    }
                                    else
                                    {
                                        if (resultIns.affectedRows > 0) 
                                        {
                                            console.log("Hola3\n");
                                            app.locals.succesfulMessage = 'Su Cambio de Contraseña, se Realizó Correctamente';
                                            res.redirect('/cambiarapp1');                                                    
                                            console.log("Hola5\n\n");
                                        }
                                        else
                                        {
                                            app.locals.errorMessage = 'No es posible Cambiar la Contraseña , intentalo nuevamente';
                                            res.redirect('/cambiarapp1');                                                
                                        }
                                        //app.locals.succesfulMessage = 'Su Cambio de Contraseña, se Realizó Correctamente';
                                    }
                                });
                            }
                            else
                            {
                                app.locals.errorMessage = 'La Contraseña Actual no coincide';
                                res.redirect('/cambiarapp1');
                            }
                        });
                    } 
                    else 
                    {
                        res.redirect('/cambiarapp1');
                    }
                }
            });   
                console.log("PasswordNew: " + passwordNew);
        } 
        catch (error) 
        {            
            console.log(error);
            res.render('cambiarapp1', {
                title: 'Cambiar Contraseña',
                errorMessage: 'Sucedió un error inesperado, intentalo de nuevo más tarde',
            });
        }
    });*/
    ///
    /// GET de la página cambiar contraseña del usuario
    ///

    app.get('/cambiar', function (req, res) {
        var username = req.cookies.name;

        connection.query(checkUserName, [username], function (errorUs, resultUs) {
            if (errorUs) {                
                throw errorUs;
            }
            if (resultUs.length > 0) {
                connection.query(selectTest, function (errorAlgo, resultAlgo) {
                    if (errorAlgo) throw errorAlgo;
                    if (resultAlgo.length > 0) {
                        var string = JSON.stringify(resultAlgo);
                        var selectJson = JSON.parse(string);
                        console.log(selectJson);
                        res.render('cambiar', {
                            title: 'Cambiar la contraseña',
                            usuario: req.cookies.name,
                            test: selectJson
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('cambiar', {
                            title: 'Cambiar la contraseña',
                            usuario: req.cookies.name
                       });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });    

    ///
    ///POST para el cambio de contraseña de los usuarios
    ///
    app.post('/cambiar', function (req, res) {
        var username = req.cookies.name;
        var pass = req.body.oldpassword;
        var passwordOld =  encrypt(username, pass);
        var passNew = req.body.newpassword;
        var passwordNew =  encrypt(username, passNew);

        console.log("User: " + username);
        console.log("PasswordOld: " + passwordOld);
        try
        {           
            connection.query(checkUserName, [username], function (errorUs, resultUs) 
            {
                if (errorUs) 
                {                   
                    throw errorUs;
                }
                else 
                {
                    if (resultUs.length > 0) 
                    {    
                        connection.query(selectCurrentPassword, [username, passwordOld], function (error, result) 
                        {
                            if (error) 
                            {
                                throw error;
                            }
                            else
                            if (result.length > 0) 
                            {                                
                                connection.query(updateUserPassword, [passwordNew, username], function (errorIns, resultIns) 
                                {
                                    if (errorIns) 
                                    {
                                        throw errorIns;
                                    }
                                    else
                                    {
                                        if (resultIns.affectedRows > 0) 
                                        {
                                            app.locals.succesfulMessage = 'Su Cambio de Contraseña, se Realizó Correctamente';
                                            res.redirect('/cambiar');                                                    
                                        }
                                        else
                                        {
                                            app.locals.errorMessage = 'No es posible Cambiar la Contraseña , intentalo nuevamente';
                                            res.redirect('/cambiar');                                                
                                        }
                                    }
                                });
                            }
                            else
                            {
                                app.locals.errorMessage = 'La Contraseña Actual no coincide';
                                res.redirect('/cambiar');
                            }
                        });
                    } 
                    else 
                    {
                        res.redirect('/cambiar');
                    }
                }
            });            
        } 
        catch (error) 
        {            
            console.log(error);
            res.render('cambiar', {
                title: 'Cambiar Contraseña',
                errorMessage: 'Sucedió un error inesperado, intentalo de nuevo más tarde',
            });
        }
    });
    
    ///
    ///POST para el cambio de contraseña de los medicos generales y administrativos
    ///
    app.post('/cambiarapp', function (req, res) {
        var username = req.cookies.name;
        var pass = req.body.oldpasswordapp;
        var passwordOld =  encrypt(username, pass);
        var passNew = req.body.newpasswordapp;
        var passwordNew =  encrypt(username, passNew);

        console.log("User: " + username);
        console.log("PasswordOld: " + passwordOld);
        console.log("NEW: "+passNew);
        try
        {   
            connection.query(checkAplicadorName, [username], function (errorApp, resultApp)
            {
                if (errorApp) 
                {                   
                    throw errorApp;
                }
                else 
                {
                    if (resultApp.length > 0) 
                    {    
                        connection.query(selectCurrentPassword1, [username, passwordOld], function (error, result) 
                        {
                            if (error) 
                            {
                                throw error;
                            }
                            else
                            if (result.length > 0) 
                            {                                
                                connection.query(updateUserPassword1, [passwordNew, username], function (errorIns, resultIns) 
                                {
                                    console.log("Hola1\n");
                                    if (errorIns) 
                                    {
                                        throw errorIns;
                                        console.log("Hola2\n\n");
                                    }
                                    else
                                    {
                                        if (resultIns.affectedRows > 0) 
                                        {
                                            console.log("Hola3\n");
                                            app.locals.succesfulMessage = 'Su Cambio de Contraseña, se Realizó Correctamente';
                                            res.redirect('/cambiarapp');                                                    
                                            console.log("Hola5\n\n");
                                        }
                                        else
                                        {
                                            app.locals.errorMessage = 'No es posible Cambiar la Contraseña , intentalo nuevamente';
                                            res.redirect('/cambiarapp');                                                
                                        }
                                        //app.locals.succesfulMessage = 'Su Cambio de Contraseña, se Realizó Correctamente';
                                    }
                                });
                            }
                            else
                            {
                                app.locals.errorMessage = 'La Contraseña Actual no coincide';
                                res.redirect('/cambiarapp');
                            }
                        });
                    } 
                    else 
                    {
                        res.redirect('/cambiarapp');
                    }
                }
            });   
                console.log("PasswordNew: " + passwordNew);
        } 
        catch (error) 
        {            
            console.log(error);
            res.render('cambiarapp', {
                title: 'Cambiar Contraseña',
                errorMessage: 'Sucedió un error inesperado, intentalo de nuevo más tarde',
            });
        }
    });

    ///
    /// GET y POST de la página login
    ///
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'Iniciar sesión',
            errorMessage: app.locals.errorMessage,
            succesfulMessage: app.locals.succesfulMessage
        });
        app.locals.errorMessage = '';
        app.locals.succesfulMessage = '';
    });

    //
    //  Método para dar acceso al sistema a un usuario existente en la base de datos
    //
    app.post('/login', passport.authenticate('local-login', {
        succesRedirect: '/workspace',
        failureRedirect: '/login'
    }), function (req, res) {
        res.cookie('name', req.body.username, {
            expires: false, //24 horas
        });
        res.redirect('/workspace');
    });

    ///
    /// Método GET y POST de la página de registro
    ///
    app.get('/signup', function (req, res) {
        res.render('signup', {
            title: 'Registrarse',
            errorMessage: app.locals.errorMessage,
            succesfulMessage: app.locals.succesfulMessage
        });
        app.locals.errorMessage = '';
        app.locals.succesfulMessage = '';
    });

    ///
    /// POST
    /// Método para registrar nuevos usuarios
    app.post('/signup', function (req, res) {
        var nombre = req.body.nombre;
        var apellidos = req.body.apellidos;
        var correo = req.body.correo;
        var username = req.body.username;
        var password1 = req.body.passwd;
        var fecha = req.body.fechaNac;
        var sexo = req.body.sexo;
        var password = encrypt(username, password1);
        var data = [username, nombre, apellidos, correo, sexo, fecha, password];

        if (nombre.length > 0 && nombre.length < 46 && apellidos.length > 0 && apellidos.length < 46 &&
            correo.length > 0 && correo.length < 46 && username.length > 0 && username.length < 46 &&
            password1.length > 0 && password1.length < 65 && fecha.length > 0 && fecha.length <= 10) {
            connection.query(checkUserName, [username], function (errorUs, resultUs) {
                if (errorUs) throw errorUs;
                else {
                    if (resultUs.length > 0) {
                        res.render('signup', {
                            title: 'Registrarse',
                            errorMessage: '¡Oops! Ya existe el nombre de usuario, elije otro distinto',
                            succesfulMessage: ''
                        });
                    } else {
                        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
                            if (errorApp) throw errorApp;
                            if (resultApp.length > 0) {
                                res.render('signup', {
                                    title: 'Registrarse',
                                    errorMessage: '¡Oops! Ya existe el nombre de usuario, elije otro',
                                    succesfulMessage: ''
                                });
                            } else {
                                connection.query(insertUser, data, function (errorIns, resultIns) {
                                    if (errorIns) throw errorIns;
                                    else {
                                        if (resultIns.affectedRows > 0) {
                                            res.render('signup', {
                                                title: 'Registrarse',
                                                errorMessage: '',
                                                succesfulMessage: 'Registro correcto, ahora puedes iniciar sesión'
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.render('signup', {
                title: 'Registrarse',
                errorMessage: 'Datos faltantes o información incorrecta, vuelve a ingresarla.',
                succesfulMessage: ''
            });
        }
    });

    ///
    /// Método GET y POST  del test logout
    ///
    app.get('/logout', function (req, res) {
        req.logout();
        res.clearCookie('name');
        res.redirect('/');
    });

    ///
    /// Método GET y POST  de la página workspace
    ///
    app.get('/workspace', function (req, res) {
        var username = req.cookies.name;
        var fecha = getFechaActual();
        var arrFecha = fecha.split("-");

        var apppriv = false;
        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (error, rows) {
                if (error) throw error;
                if (rows.length > 0) {
                    var appData = JSON.parse(JSON.stringify(rows));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(pendingAplicadorTest, username, function (err, resultado) {
                        if (err) throw err;
                        if (resultado.length > 0) {
                            var pendingJson = JSON.parse(JSON.stringify(resultado));
                            connection.query(answeredAplicadorTest, [username, fecha], function (errorAn1, resultAn1) {
                                if (errorAn1) throw errorAn1;
                                if (resultAn1.length > 0) {
                                    var answered = JSON.parse(JSON.stringify(resultAn1));
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        pendientes: pendingJson,
                                        contestados: answered,
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                } else {
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        pendientes: pendingJson,
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                }
                            });
                        } else {
                            connection.query(answeredAplicadorTest, [username, fecha], function (errorAns, resultAns) {
                                if (errorAns) throw errorAns;
                                if (resultAns.length > 0) {
                                    var contestados = JSON.parse(JSON.stringify(resultAns));
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        contestados: contestados,
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                } else {
                                    res.render('workspace', {
                                        title: 'Workspace',
                                        usuario: username,
                                        priv: 'app',
                                        apppriv: apppriv,
                                        fecha: arrFecha
                                    });
                                }
                            });
                        }
                    });
                } else {
                    connection.query(checkUserName, [username], function (errorUser, resultUser) {
                        if (errorUser) throw error;
                        if (resultUser.length > 0) {
                            connection.query(pendingUserTest, [req.cookies.name], function (error, result) {
                                if (error) throw error;
                                if (result.length > 0) {
                                    /// Si tiene test pendientes de contestar, ahora verificamos si tiene test que ya ha contestado
                                    ///anteriormete
                                    var string = JSON.stringify(result);
                                    var pendingJson = JSON.parse(string);
                                    connection.query(answeredUserTest, [req.cookies.name], function (errorAns, resultAns) {
                                        if (errorAns) throw errorAns;
                                        if (resultAns.length > 0) {
                                            var stringAns = JSON.stringify(resultAns);
                                            var answeredJson = JSON.parse(stringAns);
                                            res.render('workspace', {
                                                title: 'Workspace',
                                                usuario: req.cookies.name,
                                                priv: 'user',
                                                pendientes: pendingJson,
                                                contestados: answeredJson
                                            });
                                        } else {
                                            res.render('workspace', {
                                                title: 'Workspace',
                                                usuario: req.cookies.name,
                                                priv: 'user',
                                                pendientes: pendingJson
                                            });
                                        }
                                    });
                                } else {
                                    connection.query(answeredUserTest, [req.cookies.name], function (errorAns, resultAns) {
                                        if (errorAns) throw errorAns;
                                        if (resultAns.length > 0) {
                                            var stringAns = JSON.stringify(resultAns);
                                            var answeredJson = JSON.parse(stringAns);
                                            res.render('workspace', {
                                                title: 'Workspace',
                                                usuario: req.cookies.name,
                                                priv: 'user',
                                                contestados: answeredJson
                                            });
                                        } else {
                                            res.render('workspace', {
                                                title: 'Workspace',
                                                usuario: req.cookies.name,
                                                priv: 'user',
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.redirect('/');
                        }
                    });
                }
            });
        } else {
            res.redirect('/');
        }
    });

    ///
    /// GET y POST de la página /solicitudes
    /// Verifica las solicitudes para aplicar test que tiene un aplicador
    app.get('/solicitudes', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (error, result) {
                if (error) throw error;
                if (result.length > 0) {
                    var appData = JSON.parse(JSON.stringify(result));
                    if (appData[0].Privilegios == 'administrativos')
                        apppriv = true;
                    connection.query(selectSolicitudes, [username], function (errorSol, resultSol) {
                        if (errorSol) throw errorSol;
                        if (resultSol.length > 0) {
                            var solicitudes = JSON.parse(JSON.stringify(resultSol));
                            res.render('solicitudes', {
                                title: 'Solicitudes',
                                usuario: username,
                                solicitudes: solicitudes,
                                apppriv: apppriv
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        } else {
                            res.render('solicitudes', {
                                title: 'Solicitudes',
                                usuario: username,
                                apppriv: apppriv
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// POST
    /// Acepta la solicitud del usuario/alumno que desea aplicarla
    ///
    app.post('/solicitudes', function (req, res) {
        var username = req.body.username;
        var aplicador = req.cookies.name;
        var test = req.body.test;
        var fechaSolicitud = req.body.fechaSolicitud.split("/");
        var fecha = getFechaActual();
        fechaSolicitud = fechaSolicitud[2] + '-' + fechaSolicitud[1] + '-' + fechaSolicitud[0];
        var appTest = [aplicador, username, test, fecha, 'No'];
        var delSol = [username, aplicador, test, fechaSolicitud];

        connection.query(sendTest, appTest, function (errorSend, resultSend) {
            if (errorSend) throw errorSend;
            if (resultSend.affectedRows > 0) {
                connection.query(deleteSolicitud, delSol, function (errorDel, resultDel) {
                    if (errorDel) throw errorDel;
                    if (resultDel.affectedRows > 0) {
                        app.locals.succesfulMessage = 'Solicitud aceptada correctamente, se ha enviado el test al usuario y ahora lo podrá contestar';
                    }
                    res.redirect('/solicitudes');
                });
            } else {
                app.locals.errorMessage = 'No se pudo enviar la solicitud, intentalo nuevamente.';
                res.redirect('/solicitudes');
            }
        });
    });

    ///
    /// Método GET y POST de la ruta del perfil del usuario
    ///
    app.get('/perfil', function (req, res) {
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkAplicadorName, [username], function (error, rows) {
                if (error) throw error;
                if (rows.length > 0) {
                    var appData = JSON.parse(JSON.stringify(rows));
                    res.render('perfil', {
                        title: 'Perfil de ' + username,
                        usuario: username,
                        priv: 'app',
                        datos: appData,
                    });
                    app.locals.errorMessage = '';
                    app.locals.succesfulMessage = '';
                } else {
                    //Verificamos si el usuario es un usuario normal
                    connection.query(checkUserName, [username], function (errorUser, resultUser) {
                        if (errorUser) throw errorUser;
                        if (resultUser.length > 0) {
                            var userData = JSON.parse(JSON.stringify(resultUser));
                            var estudiante = isStudent(userData);
                            var succesful = checkSuccesfulStudent(userData);
                            if (estudiante == true && checkSuccesfulStudent(userData) == true) {
                                connection.query(selectUsuario_Alumno, [username], function (errorAlu, resultAlu) {
                                    if (errorAlu) throw errorAlu;
                                    if (resultAlu.length > 0) {
                                        var studentData = JSON.parse(JSON.stringify(resultAlu));
                                        connection.query(selectFacultades, function (errorFac, resultFac) {
                                            if (errorFac) throw errorFac;
                                            if (resultFac.length > 0) {
                                                var facultades = JSON.parse(JSON.stringify(resultFac));
                                                connection.query(selectFacultad_Carreras, [studentData[0].Facultad], function (errorFacS, resultFacs) {
                                                    if (errorFacS) throw errorFacS;
                                                    if (resultFacs.length > 0) {
                                                        var carreras = JSON.parse(JSON.stringify(resultFacs));
                                                        res.render('perfil', {
                                                            title: 'Perfil de ' + req.cookies.name,
                                                            usuario: username,
                                                            priv: 'user',
                                                            datos: userData,
                                                            estudiante: estudiante,
                                                            datosEstudiante: studentData,
                                                            facultades: facultades,
                                                            facSeleccionada: studentData[0].Facultad,
                                                            carreras: carreras,
                                                            carSeleccionada: studentData[0].Carrera,
                                                        });
                                                        app.locals.errorMessage = '';
                                                        app.locals.succesfulMessage = '';

                                                    } else {
                                                        res.render('perfil', {
                                                            title: 'Perfil de ' + req.cookies.name,
                                                            usuario: username,
                                                            priv: 'user',
                                                            datos: userData,
                                                            estudiante: estudiante,
                                                            datosEstudiante: studentData,
                                                            facultades: facultades,
                                                            facSeleccionada: studentData[0].Facultad,
                                                            carreras: carreras,
                                                        });
                                                        app.locals.errorMessage = '';
                                                        app.locals.succesfulMessage = '';

                                                    }
                                                });
                                            } else {
                                                res.render('perfil', {
                                                    title: 'Perfil de ' + username,
                                                    usuario: username,
                                                    errorMessage: app.locals.errorMessage,
                                                    succesfulMessage: app.locals.succesfulMessage,
                                                    priv: 'user',
                                                    datos: userData,
                                                    estudiante: estudiante,
                                                    datosEstudiante: studentData,
                                                    facSeleccionada: studentData[0].Facultad,

                                                });
                                                app.locals.errorMessage = '';
                                                app.locals.succesfulMessage = '';
                                            }
                                        });
                                    }
                                });

                            } else {
                                connection.query(selectFacultades, function (errorFac, resultFac) {
                                    if (errorFac) throw errorFac;
                                    if (resultFac.length > 0) {
                                        var facultades = JSON.parse(JSON.stringify(resultFac));
                                        res.render('perfil', {
                                            title: 'Perfil de ' + username,
                                            usuario: username,
                                            priv: 'user',
                                            datos: userData,
                                            estudiante: estudiante,
                                            facultades: facultades
                                        });
                                        app.locals.errorMessage = '';
                                        app.locals.succesfulMessage = '';
                                    } else {
                                        res.render('perfil', {
                                            title: 'Perfil de ' + username,
                                            usuario: username,
                                            priv: 'user',
                                            datos: userData,
                                            estudiante: estudiante,
                                        });
                                        app.locals.errorMessage = '';
                                        app.locals.succesfulMessage = '';
                                    }
                                });
                            }
                        } else {
                            res.redirect('/');
                        }
                    });
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// POST
    /// Actualiza el perfil del usuario
    ///
    app.post('/perfil', function (req, res) {
        var username = req.cookies.name;
        var pareja = req.body.pareja;
        var hijos = req.body.hijos;
        var viveCon = req.body.viveCon;
        var dependeDe = req.body.dependeDe;
        var actFisica = req.body.actividadFisica;
        var lugarHijo = req.body.lugarHijo;
        var padreMed = req.body.padreMedico;
        var escolPaterna = req.body.escolPaterna;
        var escolMaterna = req.body.escolMaterna;
        var esAlumno = req.body.esAlumno;
        var updateData = [pareja, hijos, viveCon, dependeDe, actFisica, lugarHijo, padreMed, escolPaterna, escolMaterna, esAlumno, username];
        var data = [req.body.nombre, req.body.apellidos, req.body.telefono, req.body.correo, req.cookies.name];

        connection.query(checkAplicadorName, [username], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                connection.query(updateAplicador, data, function (errorUpdateApp, resultUpdateApp) {
                    if (errorUpdateApp) throw errorUpdateApp;
                    if (resultUpdateApp.affectedRows > 0) {
                        app.locals.succesfulMessage = 'Datos actualizados correctamente';
                        res.redirect('/perfil');
                    } else {
                        app.locals.errorMessage = 'No se pudieron actualizar los datos, intentalo nuevamente';
                        res.redirect('/perfil');
                    }
                });
            } else {
                connection.query(checkUserName, [username], function (errorUser, resultUser) {
                    if (errorUser) throw errorUser;
                    if (resultUser.length > 0) {
                        var userData = JSON.parse(JSON.stringify(resultUser));
                        connection.query(updateUser, updateData, function (errorUpdate, resultUpdate) {
                            if (errorUpdate) throw errorUpdate;
                            if (resultUpdate.affectedRows > 0) {
                                app.locals.succesfulMessage = 'Datos del perfil actualizados correctamente';
                                res.redirect('/perfil');
                            } else {
                                app.locals.errorMessage = 'Error al actualizar la información de tu perfil, vuelve a intentarlo';
                                res.redirect('/perfil');
                            }
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            }
        });
    });

    ///
    /// GET para la solicitud de test del usuario
    ///
    app.get('/solicitar', function (req, res) {
        var username = req.cookies.name;

        if (typeof (username) != 'undefined') {
            connection.query(checkUserName, username, function (errorUs, resultUs) {
                if (errorUs) throw errorUs;
                if (resultUs.length > 0) {
                    connection.query(selectTest, function (error, result) {
                        if (error) throw error;
                        if (result.length > 0) {
                            var string = JSON.stringify(result);
                            var selectJson = JSON.parse(string);
                            res.render('solicitar', {
                                title: 'Solicitar test',
                                usuario: username,
                                test: selectJson
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        } else {
                            res.render('solicitar', {
                                title: 'Solicitar test',
                                usuario: username
                            });
                            app.locals.errorMessage = '';
                            app.locals.succesfulMessage = '';
                        }
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    /// POST
    /// Solicita un nuevo test al aplicador seleccionado
    ///
    app.post('/solicitar', function (req, res) {
        var test = req.body.test;
        var aplicador = req.body.aplicador;
        var username = req.cookies.name;
        var fecha = getFechaActual();
        var data = [username, aplicador, test, fecha, 'No'];

        if (typeof (username) != 'undefined') {
            if (typeof (test) != 'undefined' && aplicador.length > 0 && aplicador.length < 46) {
                connection.query(checkUserName, [username], function (errorUs, resultUs) {
                    if (errorUs) throw errorUs;
                    if (resultUs.length > 0) {
                        connection.query(checkAplicadorName, [aplicador], function (errorApp, resultApp) {
                            if (errorApp) throw errorApp;
                            if (resultApp.length > 0) {
                                connection.query(selectSolicitar, [test, username], function (errorSol, resultSol) {
                                    if (errorSol) throw errorSol;
                                    if (resultSol.length > 0) {
                                        app.locals.errorMessage = 'Ya realizaste una solicitud al test ' + test + ' y no ha sido respondida, intentalo nuevamente otro día';
                                        res.redirect('/solicitar');
                                    } else {
                                        connection.query(selectTestPendientesUsuario, [test, fecha, username], function (errPen, resPen) {
                                            if (errPen) throw errPen;
                                            if (resPen.length > 0) {
                                                app.locals.errorMessage = 'El test ya ha sido solicitado el día de hoy, intentalo nuevamente otro día';
                                                res.redirect('/solicitar');
                                            } else {
                                                connection.query(insertSolicitud, data, function (errorInsert, resultInsert) {
                                                    if (errorInsert) throw errorInsert;
                                                    if (resultInsert.affectedRows > 0) {
                                                        app.locals.succesfulMessage = 'Solicitud procesada correctamente, en tu página de inicio podras ver y contestar el test cuando se procese tu solicitud';
                                                        res.redirect('/solicitar');
                                                    } else {
                                                        app.locals.errorMessage = 'No se pudo procesar la solicitud, intentalo nuevamente';
                                                        res.redirect('/solicitar');
                                                    }
                                                });

                                            }
                                        });


                                    }
                                });
                            } else {
                                app.locals.errorMessage = aplicador + ' no está registrado en el sistema, verifica que escribiste el nombre correctamente';
                                res.redirect('/solicitar');
                            }
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                app.locals.errorMessage = 'Asegurate de seleccionar un test e introducir el nombre del aplicador correctamente.';
                res.redirect('/solicitar');
            }
        } else {
            res.redirect('/');
        }
    });

    ///
    /// Método para envíar el error 404
    ///
    app.get('*', function (req, res) {
        res.send("Página no encontrada");
    });
}

/// Métodos auxiliares de javascript
///
///
/// Método para encriptar la contraseña de los usuarios y de los aplicadores
/// Utiliza el algoritmo de encriptación SHA256
///
function encrypt(user, pass) {
    var hmac = crypto.createHmac('sha256', user).update(pass).digest('hex');
    return hmac;
}

/// Método para crear una conexion con MySQL
/// Dentro se deben configurar todos los parámetros necesarios
/// para realizar la conexión con la base de datos
function crearConexion() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'sipdep',
        password: '123456',
        database: 'sipdep',
        port: 3306,
        multipleStatements: true
    });
    return connection;
}

// route middleware to make sure
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

/// checkSuccesfulProfile
/// Verifica que los datos de un usuario esten completos
///
function checkSuccesfulProfile(data) {
    if (data[0].TienePareja == null && data[0].TieneHijos == null) {
        return false;
    }
    return true;
}

/// isStudent(data)
/// Verifica si un usuario es alumno a partir de sus datos
/// del perfil
function isStudent(data) {
    if (data[0].EsAlumno == 'Si') return true;
    return false;
}

function checkSuccesfulStudent(data) {
    if (data[0].CveUnica != null) return true;
    return false;
}

/// calcularTotalBornout(puntuaciones)
/// Calcula la puntuación total para el test Bornout
/// regresa un string con los tres resultados
function calcularTotalBornout(puntuaciones) {
    var totalSAE = 0;
    var totalSD = 0;
    var totalSR = 0;
    var resultado = "";

    for (i = 0; i < puntuaciones.length; i++) {
        if (i == 0 || i == 1 || i == 2 || i == 5 || i == 7 || i == 12 || i == 13 || i == 15 || i == 19)
            totalSAE += parseInt(puntuaciones[i], 10);
        if (i == 4 || i == 9 || i == 10 || i == 14 || i == 21)
            totalSD += parseInt(puntuaciones[i], 10);
        if (i == 3 || i == 6 || i == 8 || i == 11 || i == 16 || i == 17 || i == 18 || i == 20)
            totalSR += parseInt(puntuaciones[i], 10);
    }

    resultado = 'SAE=' + totalSAE.toString() + '#' + "SD=" + totalSD.toString() + '#' + "SRP=" + totalSR.toString();

    return resultado;
}

/// calcularTotal(puntuaciones)
/// Calcula la puntuación total para un test a partir de un
/// arreglo de puntuaciones
function calcularTotal(puntuaciones) {
    var total = 0;

    puntuaciones.forEach(
        function addNumber(value) {
            total += parseInt(value, 10);
        }
    );
    return total;
}

/// calcularTotalTDAH(puntuaciones)
/// Calcula la puntuación total para el test TDAH a partir de un
/// arreglo de puntuaciones
function calcularTotalTDAH(puntuaciones) {
    var partA = 0;
    var partB = 0;
    var total = "";

    for (i = 0; i < puntuaciones.length; i++) {
        if (i < 6) {
            if (((i == 0 || i == 1 || i == 2) && (puntuaciones[i] >= 2 && puntuaciones[i] <= 4)) || ((i == 3 || i == 4 || i == 5) && (puntuaciones[i] >= 3 && puntuaciones[i] <= 4))) {
                partA++;
            }
        } else {
            if (((i == 6 || i == 7 || i == 9 || i == 10 || i == 12 || i == 13 || i == 14 || i == 16) && (puntuaciones[i] >= 3 && puntuaciones[i] <= 4)) ||
                ((i == 8 || i == 11 || i == 15 || i == 17) && (puntuaciones[i] >= 3 && puntuaciones[i] <= 4))) {
                partB++;
            }
        }
    }

    total = 'A=' + partA.toString(10) + '#B=' + partB.toString(10);
    return total;
}

/// diagnosticoBornout(total)
/// Calcula la puntuación total para el test Bornout a partir de un 
/// arreglo de puntuaciones
function diagnosticoBornout(totalSAE, totalSD, totalSR) {
    var resultado = "";

    if (totalSAE >= 27) {
        resultado = "SAE tiene un nivel alto de Burnout con " + totalSAE.toString();
    } else if (totalSAE < 27 && totalSAE > 18) {
        resultado = "SAE tiene un nivel medio de Burnout con " + totalSAE.toString();
    } else {
        resultado = "SAE tiene un nivel bajo de Burnout con " + totalSAE.toString();
    }

    if (totalSD >= 10) {
        resultado += ". SD tiene un nivel alto de Burnout con " + totalSD.toString();
    } else if (totalSD < 10 && totalSD > 5) {
        resultado += ". SD tiene un nivel medio de Burnout con " + totalSD.toString();
    } else {
        resultado += ". SD tiene un nivel bajo de Burnout con " + totalSD.toString();
    }

    if (totalSR >= 40) {
        resultado += ". SRP tiene un nivel alto de Realización con " + totalSAE.toString();
    } else if (totalSR < 40 && totalSR > 33) {
        resultado += ". SRP tiene un nivel medio de Realización con " + totalSAE.toString();
    } else {
        resultado += ". SRP tiene un nivel bajo de Realización con " + totalSAE.toString();
    }

    return resultado;
}

/// diagnosticoTDAH(total)
/// Regresa el diagnostico para el test TDAH, dependiendo de la puntuación total de A y B
///
function diagnosticoTDAH(total) {
    var diagnostico = "El paciente no tiene síntomas acordes con el TDAH en adultos.";
    var resultado = total.split("#");
    var partA = resultado[0].split("=")[1];
    var partB = resultado[1].split("=")[1];

    if (partA >= 4) {
        diagnostico = "El paciente tiene síntomas acordes con el TDAH en adultos y debe ampliarse la investigación.";
    }

    return diagnostico;
}

/// diagnosticoAudit(total)
/// Regresa el diagnostico para el test audit, dependiendo de la puntuación total
///
function diagnosticoAudit(total) {
    var diagnostico = "";
    if (total >= 0 && total <= 7) {
        diagnostico = "Zona 1. Educación sobre el alcohol";
    } else if (total >= 8 && total <= 15) {
        diagnostico = "Zona 2. Consejo simple";
    } else if (total >= 16 && total <= 19) {
        diagnostico = "Zona 3. Consejo simple más terapia breve y monitorización continuada";
    } else if (total >= 20) {
        diagnostico = "Zona 4. Derivación al especialista para una evaluación diagnóstica y tratamiento";
    }

    return diagnostico;
}

/// diagnosticoAdaptacion(total)
/// Regresa el diagnostico para el test adaptación social, dependiendo de la puntuación total
///
function diagnosticoAdaptacion(total) {
    var diagnostico = "Puntuacion entre 25 y 34";

    if (total >= 35 && total <= 52) {
        diagnostico = "Normalidad";
    } else if (total < 25) {
        diagnostico = "Desadaptación social patente";
    } else if (total > 55) {
        diagnostico = "Superadaptación (patológico)";
    }

    return diagnostico;
}

/// diagnosticoDepresion(total)
/// Regresa el diagnostico para el test depresion de zung y conde, dependiendo de la puntuación total
///
function diagnosticoDepresion(total) {
    var diagnostico = "";

    if (total >= 25 && total <= 49) {
        diagnostico = "Rango normal";
    } else if (total >= 50 && total <= 59) {
        diagnostico = "Ligeramente deprimido";
    } else if (total >= 60 && total <= 69) {
        diagnostico = "Moderadamente deprimido";
    } else if (total > 70) {
        diagnostico = "Severamente deprimido";
    }

    return diagnostico;
}

/// diagnosticoEscalaSuicida(total)
/// Regresa el diagnostico para el test de escala de riesgo suicida de Plutchik, dependiendo de la puntuación total
///
function diagnosticoEscalaSuicida(total) {
    var diagnostico = "";

    if (total >= 6) {
        diagnostico = "Existe un riesgo de suicidio en el paciente";
    } else {
        diagnostico = "No existe riesgo de suicidio en el paciente";
    }

    return diagnostico;
}

/// diagnosticoNicotina(total)
/// Regresa el diagnostico para el test de dependencia de nicotina, dependiendo de la puntuación total
///
function diagnosticoNicotina(total) {
    var diagnostico = "";

    if (total == 1 || total == 2) {
        diagnostico = "El fumador es poco dependiente de la nicotina";
    } else if (total == 3 || total == 4) {
        diagnostico = "El fumador tiene una dependencia media";
    } else if (total >= 5 && total <= 7) {
        diagnostico = "El fumador tiene una dependencia moderada";
    } else if (total >= 8) {
        diagnostico = "El fumador es altamente dependiente de la nicotina";
    }

    return diagnostico;
}

/// getHoraActual()
/// Regresa la hora actual del sistema
/// 
function getHoraActual() {
    var d = new Date();
    var mes = d.getMonth() + 1;
    var dia = d.getDate();
    var year = d.getFullYear();
    var hora = d.getHours();
    var minutos = d.getMinutes();
    var segundos = d.getSeconds();

    if (mes.toString().length == 1) mes = '0' + mes.toString();
    if (dia.toString().length == 1) dia = '0' + dia.toString();
    if (hora.toString().length == 1) hora = '0' + hora.toString();
    if (minutos.toString().length == 1) minutos = '0' + minutos.toString();
    if (segundos.toString().length == 1) segundos = '0' + segundos.toString();

    var fechaHora = dia + '/' + mes + '/' + year + ', ' + hora + ':' + minutos + ':' + segundos;
    return fechaHora;
}

/// getFechaActual
/// Regresa la fecha actual del servidor
/// 
function getFechaActual() {
    var d = new Date();
    var mes = d.getMonth() + 1;
    var dia = d.getDate();
    var year = d.getFullYear();

    if (mes.toString().length == 1) mes = '0' + mes.toString();
    if (dia.toString().length == 1) dia = '0' + dia.toString();

    var fechaHora = year + '-' + mes + '-' + dia;
    return fechaHora;
}