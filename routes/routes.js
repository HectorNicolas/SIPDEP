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
var selectSolicitar = 'SELECT * FROM solicitud_test WHERE Nombre_Test = ? AND Nombre_Usuario = ? AND Aceptada = \'No\';';
var selectAllQuestions_Test = 'SELECT Numero, Pregunta FROM pregunta_test WHERE Nombre_Test = ? ORDER BY Numero;';
var selectRespuestas_Test = 'SELECT Numero_Pregunta, group_concat(Respuesta SEPARATOR \'#\') AS Respuestas, group_concat(Puntuacion SEPARATOR \'#\') AS Puntuaciones \
FROM respuesta_pregunta \
WHERE Nombre_Test = ? \
GROUP BY Numero_Pregunta \
ORDER BY Numero_Respuesta;';
var selectPreguntas_Test = 'SELECT Pregunta FROM pregunta_test WHERE Nombre_Test = ?';
var selectNumPreg = 'SELECT Numero FROM pregunta_test WHERE Nombre_Test = ? AND Pregunta LIKE ?;';
var selectPregRes_Folio = 'SELECT Pregunta, Respuesta, Puntuacion FROM pregunta_respuesta WHERE Folio = ?;';
var selectTestVerification = 'SELECT * FROM test_usuario WHERE Nombre_Aplicador = ? AND Nombre_Usuario = ? AND Nombre_Test = ? AND Fecha = ?;';
var selectResultados = 'SELECT r.Folio, tu.Nombre_Test, a.Nombre AS NombreAp, a.Apellidos AS ApellidosAp, u.Nombre AS NombreUs, u.Apellidos AS ApellidosUs, DATE_FORMAT(tu.Fecha, \'%d/%m/%Y\') AS FechaSol, DATE_FORMAT(r.Fecha, \'%d/%m/%Y\') AS FechaCon, audit.PuntuacionTotal, audit.Diagnostico \
FROM resultado_test AS r \
INNER JOIN aplicador AS a ON a.NombreUsuario = r.Nombre_Aplicador \
INNER JOIN usuario AS u ON u.NombreUsuario = r.Nombre_Usuario \
INNER JOIN test_usuario AS tu ON tu.Folio = r.Folio \
INNER JOIN audit ON audit.Folio = r.Folio \
WHERE r.Folio = ?;';
var selectFolio = 'SELECT Folio FROM resultado_test ORDER BY Folio DESC;';
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
var selectFacultad_Carreras = 'SELECT NombreCarrera AS Carrera FROM facultad_carrera WHERE Nombre_Facultad = ?;';
var selectCarrera = 'SELECT * FROM facultad_carrera WHERE NombreCarrera = ?;';
var selectFacultades = 'SELECT * FROM facultad;';
var selectFacultad = 'SELECT * FROM facultad WHERE Nombre = ?;';
var selectAlumno = 'SELECT * FROM alumno WHERE Clave_unica = ?;';
var selectNumPreg_Test = 'SELECT * FROM pregunta_test WHERE Nombre_Test = ? AND Numero = ?;';
/*var selectPreguntaRespuesta = 'SELECT test_pregunta.Pregunta, respuesta_pregunta.Respuesta \
FROM test_pregunta\
INNER JOIN respuesta_pregunta ON test_pregunta.Pregunta = respuesta_pregunta.Pregunta\
WHERE test_pregunta.Nombre_Test = ?;';*/
var selectTest = 'SELECT Nombre, Descripcion FROM test';
var selectTest_Name = 'SELECT * FROM test WHERE Nombre = ?';
var selectQuestions = 'SELECT Numero, Pregunta \
FROM pregunta_test \
WHERE Nombre_Test = ? \
ORDER BY Numero DESC;';
var existTestQuery = 'SELECT * FROM test WHERE Nombre = ?';
var checkUser = 'SELECT * FROM usuario WHERE NombreUsuario = ? AND Password = ?';
var checkUserName = 'SELECT NombreUsuario, Nombre, Apellidos, Correo, Sexo, FechaNacimiento, TienePareja, TieneHijos, ViveCon, DependeDe, ActividadFisica, PosicionHijo, PadreMedico, EscolPaterna, EscolMaterna, EsAlumno, CveUnica FROM usuario WHERE NombreUsuario = ?';
var checkAplicador = 'SELECT * FROM aplicador WHERE NombreUsuario = ? and Password = ?';
var checkAplicadorName = 'SELECT * FROM aplicador WHERE NombreUsuario = ?';
var selectAplicadores = 'SELECT NombreUsuario, Nombre, Apellidos, Telefono, Correo, Privilegios FROM aplicador';
var selectAplicadoresNoAdmin = 'SELECT NombreUsuario FROM aplicador WHERE Privilegios != \'administrativos\';';
var pendingUserTest = 'SELECT aplicador.Nombre, aplicador.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha, aplicador.NombreUsuario AS Username \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'No\' AND test_usuario.Nombre_Usuario = ?';
var pendingAplicadorTest = 'SELECT usuario.Nombre, usuario.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN usuario ON usuario.NombreUsuario = test_usuario.Nombre_Usuario \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'No\' AND aplicador.NombreUsuario = ?';
var answeredAplicadorTest = 'SELECT usuario.Nombre, usuario.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha, DATE_FORMAT(test_usuario.FechaContestado,\'%d/%m/%Y\') AS FechaContestado, test_usuario.Folio \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN usuario ON usuario.NombreUsuario = test_usuario.Nombre_Usuario \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'Si\' AND aplicador.NombreUsuario = ?';
var answeredUserTest = 'SELECT aplicador.Nombre, aplicador.Apellidos, test.Nombre AS Test, DATE_FORMAT(test_usuario.Fecha,\'%d/%m/%Y\') AS Fecha \
FROM test_usuario \
INNER JOIN test ON test_usuario.Nombre_Test = test.Nombre \
INNER JOIN aplicador ON aplicador.NombreUsuario = test_usuario.Nombre_Aplicador \
WHERE test_usuario.Contestado = \'Si\' AND test_usuario.Nombre_Usuario = ?';
///
/// INSERT queries
///
var insertResultado_Test = 'INSERT INTO resultado_test (Nombre_Aplicador, Nombre_Usuario, Fecha) VALUES(?,?,?);';
var insertAudit = 'INSERT INTO audit VALUES(?,?,?);';
var insertPregRes_Audit = 'INSERT INTO pregunta_respuesta VALUES(?,?,?,?);';
var insertSolicitud = 'INSERT INTO solicitud_test VALUES (?,?,?,?,?);';
var insertCarrera = 'INSERT INTO facultad_carrera VALUES (?,?);';
var insertFacultad = 'INSERT INTO facultad VALUES (?);';
var insertAlumno = 'INSERT INTO alumno VALUES (?,?,?,?,?);';
var insertPregunta = 'INSERT INTO pregunta_test VALUES (?,?,?);';
var insertTest = 'INSERT INTO test (Nombre, Descripcion) VALUES (?,?)'
var sendTest = 'INSERT INTO test_usuario (Nombre_Aplicador, Nombre_Usuario, Nombre_Test, Fecha, Contestado) VALUES (?,?,?,?,?)';
var insertUser = 'INSERT INTO usuario (NombreUsuario, Nombre, Apellidos, Correo, Sexo, FechaNacimiento, Password) VALUES(?, ?, ?, ?, ?, ?, ?)';
var insertAplicador = 'INSERT INTO aplicador (NombreUsuario, Nombre, Apellidos, Telefono, Correo, Privilegios, Password) VALUES (?,?,?,?,?,?,?)';
var insertRespuesta = 'INSERT INTO respuesta_pregunta VALUES (?,?,?,?,?);';
///
/// UPDATE queries
///
var updateTestUsuario = 'UPDATE test_usuario SET Contestado = \'Si\', FechaContestado = ?, Folio = ? WHERE Nombre_Aplicador = ? AND Nombre_Usuario = ? AND Nombre_Test = ? AND Fecha = ?;';
var updateSolicitudStatus = 'UPDATE solicitud_test SET Aceptada = ? WHERE Nombre_Usuario = ?, Nombre_Aplicador = ?, Nombre_Test = ?;';
var updateCveUsuario = 'UPDATE usuario SET CveUnica = ? WHERE NombreUsuario = ?;';
var updateAlumno = 'UPDATE alumno SET Facultad = ?, Carrera = ?, Intentos_Ingreso = ?, Semestre = ? WHERE Clave_unica = ?';
var updateUser = 'UPDATE usuario SET TienePareja=?, TieneHijos=?, ViveCon=?, DependeDe=?, ActividadFisica=?, PosicionHijo=?, PadreMedico=?, EscolPaterna=?, EscolMaterna=?, EsAlumno=? WHERE NombreUsuario = ?;';
var updateAplicador = 'UPDATE aplicador SET Nombre = ?, Apellidos = ?, Telefono = ?, Correo = ? WHERE NombreUsuario = ?';
///
/// DELETE queries
///
var deleteSolicitud = 'DELETE FROM solicitud_test WHERE Nombre_Usuario = ? AND Nombre_Aplicador = ? AND Nombre_test = ? AND Fecha = ? AND Aceptada = \'No\';';
var deleteCarrera = 'DELETE FROM facultad_carrera WHERE Nombre_Facultad = ? AND NombreCarrera = ?;';
var deleteFacultad = 'DELETE FROM facultad WHERE Nombre = ?;';
var deleteAplicador = 'DELETE FROM aplicador WHERE NombreUsuario = ?;';
var deleteTest = 'DELETE FROM test WHERE Nombre = ?;';

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
    /// Genera un reporte en PDF de los resultados obtenidos
    ///
    app.get('/imprimir', function (req, res) {
        var username = req.cookies.name;
        var folio = req.query.folio;
        var apppriv = false;
        var doc = new PDFDocument();
        var fechaHora = getHoraActual();


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
                                var preguntas = JSON.parse(JSON.stringify(resultPreg));
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
                                    doc.text(preguntas[i].Pregunta, 80, y, {
                                            align: 'left'
                                        })
                                        .text(preguntas[i].Respuesta);
                                    y += 60;
                                }

                                doc
                                    .moveDown()
                                    .text('Diagnostico: ' + reporte[0].Diagnostico + '      ' + 'Puntuacón total: ' + reporte[0].PuntuacionTotal);

                                var raiz = __dirname.toString().replace("\\routes", '');
                                doc.pipe(fs.createWriteStream(raiz + '/public/files/file.pdf'));
                                doc.end();


                                console.log(raiz);

                                setTimeout(function () {
                                    var filePath = raiz + '/public/files/file.pdf';
                                    console.log(filePath);
                                    fs.readFile(filePath, function (err, data) {
                                        res.contentType("application/pdf");
                                        res.send(data);;
                                    });
                                }, 1000);

                            } else {

                            }
                        });
                    } else {

                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    /// GET
    /// Muestra los resultados para el folio especificado
    ///
    app.get('/resultados', function (req, res) {
        var username = req.cookies.name;
        var folio = req.query.folio;
        var apppriv = false;

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
                                var preguntas = JSON.parse(JSON.stringify(resultPreg));
                                res.render('resultados', {
                                    title: 'Resultados para el Folio' + folio,
                                    usuario: username,
                                    apppriv: apppriv,
                                    priv: priv,
                                    reporte: reporte,
                                    preguntas: preguntas
                                });
                            } else {
                                res.render('resultados', {
                                    title: 'Resultados para el Folio' + folio,
                                    usuario: username,
                                    apppriv: apppriv,
                                    priv: priv,
                                    reporte: reporte
                                });
                            }
                        });
                    } else {
                        res.render('resultados', {
                            title: 'Resultados para el Folio' + folio,
                            usuario: username,
                            apppriv: apppriv,
                            priv: priv
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    /// GET
    /// Actualiza los datos de un usuario que también es estudiante
    /// 
    app.post('/actestudiante', function (req, res) {
        console.log(req.body);
        var cve = req.body.cveunica;
        var carrera = req.body.carrera;
        var intentos = req.body.intentos;
        var semestre = req.body.semestre;
        var facultad = req.body.facultadSeleccionada;
        var username = req.cookies.name;
        var data = [cve, facultad, carrera, intentos, semestre];
        var studentDat = [facultad, carrera, intentos, semestre, cve];

        try {
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
        } catch (exception) {
            console.log(exception);
            res.redirect('/perfil');
        }


    });

    /// GET
    /// Busca las materias pertenecientes a una facultad
    /// para mostrarlas a los nuevos usuarios
    app.get('/search_mat', function (req, res) {
        var facultad = req.query.facultad;
        var username = req.cookies.name;
        var carreraSeleccionada = req.query.carreraSeleccionada;

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
                                        console.log(carrs);
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

    });

    /// GET
    /// Muestra las carreras de la facultad seleccionada
    /// por el usuario
    app.get('/searchcarreras', function (req, res) {
        var facultad = req.query.facultadSeleccionada;
        var apppriv = false;

        connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
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
                                            usuario: req.cookies.name,
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
                                            usuario: req.cookies.name,
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
    });

    /// GET
    /// Muestra la interfaz para consultar las carreras 
    /// de una facultad seleccionada
    app.get('/concarrera', function (req, res) {
        var apppriv = false;
        connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
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
                            usuario: req.cookies.name,
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
    });

    /// GET
    /// Muestra las carreras para la facultad seleccionada
    ///
    app.get('/selfac_carr', function (req, res) {
        var facultadSeleccionada = req.query.facultad;

        connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var priv = 'app';
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
                                    usuario: req.cookies.name,
                                    errorMessage: app.locals.errorMessage,
                                    succesfulMessage: app.locals.succesfulMessage,
                                    facultades: facultades,
                                    priv: priv,
                                    facSeleccionada: facultadSeleccionada,
                                    carreras: carreras
                                });
                                app.locals.errorMessage = '';
                                app.locals.succesfulMessage = '';
                            } else {
                                app.locals.errorMessage = 'La ' + facultadSeleccionada + ' no tiene carreras disponibles. Debes agregar carreras antes de querer eliminarlas';
                                res.render('elcarrera', {
                                    title: 'Eliminar carreras',
                                    usuario: req.cookies.name,
                                    errorMessage: app.locals.errorMessage,
                                    succesfulMessage: app.locals.succesfulMessage,
                                    facultades: facultades,
                                    priv: priv,
                                    facSeleccionada: facultadSeleccionada,
                                    carreras: 'undefined'
                                });
                                app.locals.errorMessage = '';
                                app.locals.succesfulMessage = '';
                            }
                        });
                    } else {
                        res.render('elcarrera', {
                            title: 'Eliminar carreras',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: 'undefined',
                            priv: priv,
                            facSeleccionada: facultadSeleccionada,
                            carreras: 'undefined'
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

    /// GET
    /// Muestra la interfaz para eliminar una carrera
    ///
    app.get('/elcarrera', function (req, res) {
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
                        res.render('elcarrera', {
                            title: 'Eliminar carreras',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: facultades,
                            priv: priv,
                            facSeleccionada: 'Ninguna',
                            carreras: 'undefined',
                            apppriv: apppriv
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('elcarrera', {
                            title: 'Eliminar carreras',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            facultades: 'undefined',
                            priv: priv,
                            facSeleccionada: 'Ninguna',
                            carreras: 'undefined',
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
    /// Elimina la carrera seleccionara por el usuario
    ///
    app.post('/elcarrera', function (req, res) {
        var facultad = req.body.facSeleccionada;
        var carrera = req.body.carreraSeleccionada;
        var data = [facultad, carrera];
        console.log(data);
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
                                                usuario: req.cookies.name,
                                                errorMessage: app.locals.errorMessage,
                                                succesfulMessage: app.locals.succesfulMessage,
                                                facultades: 'undefined',
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
        app.locals.errorMessage = '';
        app.locals.succesfulMessage = '';
    });


    /// GET
    /// Muestra la interfaz para consultar facultades
    ///
    app.get('/confacultad', function (req, res) {
        var apppriv = false;
        connection.query(checkAplicadorName, [req.cookies.name], function (errorApp, resultApp) {
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
        app.locals.errorMessage = '';
        app.locals.succesfulMessage = '';
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
        connection.query(selectFacultad, [req.body.nombre], function (errorSel, resultSel) {
            if (errorSel) throw errorSel;
            if (resultSel.length > 0) {
                app.locals.errorMessage = req.body.nombre + ' ya existe';
                res.redirect('/agfacultad');
            } else {
                connection.query(insertFacultad, [req.body.nombre], function (errorIns, resultIns) {
                    if (errorIns) throw errorIns;
                    if (resultIns.affectedRows > 0) {
                        app.locals.succesfulMessage = req.body.nombre + ' agregada correctamente';
                        res.redirect('/agfacultad');
                    } else {
                        app.locals.errorMessage = 'No se pudo agregar ' + req.body.nombre + ' , intentalo nuevamente';
                        res.redirect('/agfacultad');
                    }
                });
            }
        });
    });

    /// GET
    /// CONSULTAR preguntas y respuestas
    ///
    app.get('/consultarpregres', function (req, res) {
        var privilegios = false;
        var username = req.cookies.name;
        var testSeleccionado = req.query.test;

        res.redirect('/workspace');
        /*connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    privilegios = true;
                connection.query(selectTest, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var test = JSON.parse(JSON.stringify(result));
                        connection.query(selectAllQuestions_Test, [testSeleccionado], function (errorTest, resultTest) {
                            if (errorTest) throw errorTest;
                            if (resultTest.length > 0) {
                                var preguntas = JSON.parse(JSON.stringify(resultTest));
                                connection.query(selectRespuestas_Test, [testSeleccionado], function (errorPregs, resultPregs) {
                                    if (errorPregs) throw errorPregs;
                                    if (resultPregs.length > 0) {
                                        var respuestas = JSON.parse(JSON.stringify(resultPregs));
                                        console.log(respuestas);
                                        var respuesta_puntuacion = [[], []];
                                        for (i = 0; i < respuestas.length; i++) {
                                            var sRespuestas = respuestas[i][0].split("#");
                                            var sPuntuaciones = respuestas[i][1].split("#");

                                            respuesta_puntuacion[0].push(sRespuestas);
                                            respuesta_puntuacion[1].push(sPuntuaciones);
                                            console.log(respuesta_puntuacion);
                                        }
                                        res.render('consultarpregres', {
                                            title: 'Consultar preguntas y respuestas',
                                            usuario: username,
                                            test: test,
                                            apppriv: privilegios,
                                            priv: 'app'
                                        });
                                    } else {

                                    }
                                });

                            } else {

                            }
                        });

                    } else {
                        res.render('consultarpregres', {
                            title: 'Consultar preguntas y respuestas',
                            usuario: username,
                            apppriv: privilegios,
                            errorMessage: 'No existe el test seleccionado',
                            priv: 'app'
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });*/
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

        console.log(testSeleccionado);
        pregunta = pregunta.split(".")[0] + '%';
        console.log(pregunta);
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
    /// GET y POST de la página /eliminartest
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

        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
            if (errorApp) throw errorApp;
            if (resultApp.length > 0) {
                var appData = JSON.parse(JSON.stringify(resultApp));
                if (appData[0].Privilegios == 'administrativos')
                    privilegios = true;
                res.render('eliminartest', {
                    title: 'Eliminar test',
                    usuario: req.cookies.name,
                    priv: 'app',
                    apppriv: privilegios,
                    errorMessage: app.locals.errorMessage,
                    succesfulMessage: app.locals.succesfulMessage
                });
                app.locals.errorMessage = '';
                app.locals.succesfulMessage = '';

            } else {
                res.redirect('/');
            }
        });
    });

    /// POST
    /// Elimina un test en cascada de la base de datos
    ///
    app.post('/eliminartest', function (req, res) {
        connection.query(existTestQuery, [req.body.test], function (errExist, resExist) {
            if (errExist) throw errExist;
            if (resExist.length > 0) {
                connection.query(deleteTest, [req.body.test], function (error, result) {
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
                app.locals.errorMessage = 'No existe test con el nombre ' + req.body.test;
                res.redirect('eliminartest');
            }
        });
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
                        console.log('Hola');

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
        //Eliminar los saltos de linea de la descripción del test
        var descripcion = req.body.descripcion.toString().replace('\r\n', '');
        connection.query(selectTest_Name, req.body.nombre, function (errorTest, resultTest) {
            if (errorTest) throw errorTest;
            if (resultTest.length > 0) {
                app.locals.errorMessage = 'El test ' + req.body.nombre + ' ya existe';
                res.render('agregartest', {
                    title: 'Agregar test',
                    usuario: req.cookies.name,
                    errorMessage: app.locals.errorMessage,
                    succesfulMessage: app.locals.succesfulMessage
                });
            } else {
                connection.query(insertTest, [req.body.nombre, descripcion], function (error, result) {
                    if (error) throw error;
                    if (result.affectedRows > 0) {
                        app.locals.succesfulMessage = 'Test agregado correctamente';
                        res.render('agregartest', {
                            title: 'Agregar test',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage
                        });
                    } else {
                        app.locals.errorMessage = 'No se pudo agregar el test, vuelve a intentarlo';
                        res.render('agregartest', {
                            title: 'Agregar test',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage
                        });
                    }
                });
            }
        });
        app.locals.errorMessage = '';
        app.locals.succesfulMessage = '';
    });

    ///
    /// GET y POST de la página /contestaraudit
    ///
    app.post('/enviaraudit', function (req, res) {
        var test = req.body.test;
        var username = req.body.username;
        var aplicador = req.body.aplicador;
        var respuestas = [];
        var fecha = new Date().toISOString().split('T')[0];
        var folio = 0;
        var fechaAplicacion = req.body.fechaAplicacion;

        respuestas.push(req.body.resp1);
        respuestas.push(req.body.resp2);
        respuestas.push(req.body.resp3);
        respuestas.push(req.body.resp4);
        respuestas.push(req.body.resp5);
        respuestas.push(req.body.resp6);
        respuestas.push(req.body.resp7);
        respuestas.push(req.body.resp8);
        respuestas.push(req.body.resp9);
        respuestas.push(req.body.resp10);
        var preguntas = [];
        preguntas.push(req.body.preg1);
        preguntas.push(req.body.preg2);
        preguntas.push(req.body.preg3);
        preguntas.push(req.body.preg4);
        preguntas.push(req.body.preg5);
        preguntas.push(req.body.preg6);
        preguntas.push(req.body.preg7);
        preguntas.push(req.body.preg8);
        preguntas.push(req.body.preg9);
        preguntas.push(req.body.preg10);
        var puntuacion = [];
        puntuacion.push(respuestas[0].split(".")[0]);
        puntuacion.push(respuestas[1].split(".")[0]);
        puntuacion.push(respuestas[2].split(".")[0]);
        puntuacion.push(respuestas[3].split(".")[0]);
        puntuacion.push(respuestas[4].split(".")[0]);
        puntuacion.push(respuestas[5].split(".")[0]);
        puntuacion.push(respuestas[6].split(".")[0]);
        puntuacion.push(respuestas[7].split(".")[0]);
        puntuacion.push(respuestas[8].split(".")[0]);
        puntuacion.push(respuestas[9].split(".")[0]);
        var total = calcularTotal(puntuacion);
        var diagnostico = diagnosticoAudit(total);

        connection.query(insertResultado_Test, [aplicador, username, fecha], function (errorRes, resultRes) {
            if (errorRes) throw errorRes;
            if (resultRes.affectedRows > 0) {
                connection.query(selectFolio, function (errorFolio, resultFolio) {
                    if (errorFolio) throw errorFolio;
                    if (resultFolio.length > 0) {
                        folio = resultFolio[0].Folio;
                        var aPreg = [
                                            [folio, preguntas[0], respuestas[0], puntuacion[0]], [folio, preguntas[1], respuestas[1], puntuacion[1]], [folio, preguntas[2], respuestas[2], puntuacion[2]], [folio, preguntas[3], respuestas[3], puntuacion[3]], [folio, preguntas[4], respuestas[4], puntuacion[4]], [folio, preguntas[5], respuestas[5], puntuacion[5]], [folio, preguntas[6], respuestas[6], puntuacion[6]], [folio, preguntas[7], respuestas[7], puntuacion[7]], [folio, preguntas[8], respuestas[8], puntuacion[8]], [folio, preguntas[9], respuestas[9], puntuacion[9]],
                                            ];
                        connection.query(insertAudit, [folio, total, diagnostico], function (errorAudit, resultAudit) {
                            if (errorAudit) throw errorAudit;
                            if (resultAudit.affectedRows > 0) {
                                connection.query(insertPregRes_Audit, aPreg[0], function (errorp1, resultp1) {
                                    if (errorp1) throw errorp1;
                                    connection.query(insertPregRes_Audit, aPreg[1], function (errorp2, resultp2) {
                                        if (errorp2) throw errorp2;
                                        connection.query(insertPregRes_Audit, aPreg[2], function (errorp3, resultp3) {
                                            if (errorp3) throw errorp3;
                                            connection.query(insertPregRes_Audit, aPreg[3], function (errorp4, resultp4) {
                                                if (errorp4) throw errorp4;
                                                connection.query(insertPregRes_Audit, aPreg[4], function (errorp5, resultp5) {
                                                    if (errorp5) throw errorp5;
                                                    connection.query(insertPregRes_Audit, aPreg[5], function (errorp6, resultp6) {
                                                        if (errorp6) throw errorp6;
                                                        connection.query(insertPregRes_Audit, aPreg[6], function (errorp7, resultp7) {
                                                            if (errorp7) throw errorp7;
                                                            connection.query(insertPregRes_Audit, aPreg[7], function (errorp8, resultp8) {
                                                                if (errorp8) throw errorp8;
                                                                connection.query(insertPregRes_Audit, aPreg[8], function (errorp9, resultp9) {
                                                                    if (errorp9) throw errorp9;
                                                                    connection.query(insertPregRes_Audit, aPreg[9], function (errorp10, resultp10) {
                                                                        if (errorp10) throw errorp10;
                                                                        connection.query(updateTestUsuario, [fecha, folio, aplicador, username, test, fechaAplicacion], function (errorup, resultup) {
                                                                            if (errorup) throw errorup;
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
        res.redirect('/workspace');
    });

    ///
    /// GET y POST de la página /contestartest
    ///
    app.post('/contestartest', function (req, res) {
        var test = req.body.test;
        var aplicador = req.body.username;
        var username = req.cookies.name;
        var fecha = req.body.fechaAplicacion.split("/");
        fecha = fecha[2] + '-' + fecha[1] + '-' + fecha[0];
        var datos = [test, aplicador, username, fecha];

        if (test == 'AUDIT') {
            res.render('audit', {
                title: 'Test AUDIT',
                usuario: username,
                datos: datos
            });
        } else {
            res.redirect('/workspace');
        }
    });

    ///
    /// GET y POST de la página agregar aplicador
    ///
    app.get('/agregar', function (req, res) {
        var apppriv = false;

        connection.query(checkAplicadorName, [req.cookies.name], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                var appData = JSON.parse(JSON.stringify(result));
                if (appData[0].Privilegios == 'administrativos')
                    apppriv = true,
                    res.render('agregar', {
                        title: 'Agregar aplicador',
                        usuario: req.cookies.name,
                        errorMessage: app.locals.errorMessage,
                        succesfulMessage: app.locals.succesfulMessage,
                        apppriv: apppriv
                    });
            } else {
                res.render('agregar', {
                    title: 'Agregar aplicador',
                    usuario: req.cookies.name,
                    errorMessage: app.locals.errorMessage,
                    succesfulMessage: app.locals.succesfulMessage,
                    apppriv: apppriv
                });
            }
        });
        app.locals.errorMessage = '';
        app.locals.succesfulMessage = '';
    });

    /// POST
    /// Agrega un nuevo aplicador a la base de datos
    ///
    app.post('/agregar', function (req, res) {
        var pass = encrypt(req.body.username, req.body.password);
        var data = [req.body.username, req.body.nombre, req.body.apellidos, req.body.telefono, req.body.correo, req.body.privilegios, pass];

        connection.query(checkAplicadorName, [req.body.username], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                app.locals.errorMessage = 'Ya existe un usuario con el nombre que ingresaste, ingresa uno diferente';
                res.redirect('agregar');
            } else {
                connection.query(checkUserName, [req.body.username], function (errorName, resultName) {
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
    });

    ///
    /// GET y POST para eliminar un aplicador
    ///
    app.get('/eliminar', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

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
                    } else {
                        res.render('eliminar', {
                            title: 'Eliminar aplicador',
                            usuario: req.cookies.name,
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage,
                            apppriv: apppriv
                        });
                    }
                });
            } else {
                res.reedirect('/');
            }
        });
        app.locals.errorMessage = '';
        app.locals.succesfulMessage = '';
    });

    ///
    /// Elimina un aplicador de la base de datos
    ///
    app.post('/eliminar', function (req, res) {
        var aplicador = req.body.aplicador;
        var username = req.cookies.name;

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
    });

    ///
    /// GET y POST para la página /consultar
    ///
    app.get('/consultar', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;
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
    });

    ///
    /// GET y POST de la página /individual
    ///
    app.get('/individual', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

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
    });

    app.post('/individual', function (req, res) {
        var aplicador = req.cookies.name;
        var usuario = req.body.username;
        var test = req.body.test;
        var fecha = new Date().toISOString().split('T')[0];
        var data = [aplicador, usuario, test, fecha, 'No'];

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
                        app.locals.errorMessage = 'No existe el nombre de usuario ingresado';
                        res.redirect('/individual');
                    }
                });
            } else {
                res.redirect('/');
            }
        });
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
                console.log(aplicadores);
                res.render('directorio', {
                    title: 'Directorio',
                    app: aplicadores
                });
            }
        });
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
        app.locals.user = req.body.username;
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

    /*Método para registrar un usuario*/
    app.post('/signup', function (req, res) {
        console.log(req.body);
        var nombre = req.body.nombre;
        var apellidos = req.body.apellidos;
        var correo = req.body.correo;
        var username = req.body.username;
        var password = req.body.passwd;
        var fecha = req.body.fechaNac;
        var sexo = req.body.sexo;
        var password = encrypt(username, password);
        var data = [username, nombre, apellidos, correo, sexo, fecha, password];

        try {
            connection.query(checkUserName, [username], function (errorUs, resultUs) {
                if (errorUs) throw errorUs;
                else {
                    if (resultUs.length > 0) {
                        app.locals.errorMessage = '¡Oops! Ya existe el nombre de usuario, elije otro distinto';
                        res.render('signup', {
                            title: 'Registrarse',
                            errorMessage: app.locals.errorMessage,
                            succesfulMessage: app.locals.succesfulMessage
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        connection.query(checkAplicadorName, [username], function (errorApp, resultApp) {
                            if (errorApp) throw errorApp;
                            if (resultApp.length > 0) {
                                app.locals.errorMessage = '¡Oops! Ya existe el nombre de usuario, elije otro';
                                res.render('signup', {
                                    title: 'Registrarse',
                                    errorMessage: app.locals.errorMessage,
                                    succesfulMessage: app.locals.succesfulMessage
                                });
                                app.locals.errorMessage = '';
                                app.locals.succesfulMessage = '';
                            } else {
                                connection.query(insertUser, data, function (errorIns, resultIns) {
                                    if (errorIns) throw errorIns;
                                    else {
                                        if (resultIns.affectedRows > 0) {
                                            app.locals.succesfulMessage = 'Registro correcto, ahora puedes iniciar sesión';
                                            res.render('signup', {
                                                title: 'Registrarse',
                                                errorMessage: app.locals.errorMessage,
                                                succesfulMessage: app.locals.succesfulMessage
                                            });
                                            app.locals.errorMessage = '';
                                            app.locals.succesfulMessage = '';
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.log(error);
            res.render('signup', {
                title: 'Registrarse',
                errorMessage: 'Sucedió un error inesperado, intentalo de nuevo más tarde',
            });
        }

    });

    ///
    /// Método GET y POST  del test audit
    ///
    app.get('/audit', function (req, res) {
        res.render('audit', {
            title: 'Test AUDIT'
        });
    });

    ///
    /// Método GET y POST  del test plutchik
    ///
    app.get('/plutchik', function (req, res) {
        res.render('plutchik', {
            title: 'Test Plutchik'
        });
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
        /// Verifica si el usuario es un aplicador o un usuario normal para definir
        /// que interfaz mostrar
        var apppriv = false;
        connection.query(checkAplicadorName, [username], function (error, rows) {
            if (error) throw error;
            if (rows.length > 0) {
                /// Verificamos si el aplicador tiene test pendientes
                var appData = JSON.parse(JSON.stringify(rows));
                if (appData[0].Privilegios == 'administrativos')
                    apppriv = true;
                connection.query(pendingAplicadorTest, username, function (err, resultado) {
                    if (err) throw err;
                    if (resultado.length > 0) {
                        //Si tiene test pendientes los guardamos en la variable pendingJson
                        var pendingJson = JSON.parse(JSON.stringify(resultado));
                        /// Verificamos si el aplicador tiene test contestados
                        connection.query(answeredAplicadorTest, [req.cookies.name], function (errorAn1, resultAn1) {
                            if (errorAn1) throw errorAn1;
                            if (resultAn1.length > 0) {
                                var answered = JSON.parse(JSON.stringify(resultAn1));
                                res.render('workspace', {
                                    title: 'Workspace',
                                    usuario: req.cookies.name,
                                    priv: 'app',
                                    pendientes: pendingJson,
                                    contestados: answered,
                                    apppriv: apppriv
                                });
                            } else {
                                res.render('workspace', {
                                    title: 'Workspace',
                                    usuario: req.cookies.name,
                                    priv: 'app',
                                    pendientes: pendingJson,
                                    apppriv: apppriv
                                });
                            }
                        });
                    } else {
                        /// Verificamos si el aplicador tiene test que ya han sido contestados
                        connection.query(answeredAplicadorTest, [req.cookies.name], function (errorAns, resultAns) {
                            if (errorAns) throw errorAns;
                            if (resultAns.length > 0) {
                                var contestados = JSON.parse(JSON.stringify(resultAns));
                                res.render('workspace', {
                                    title: 'Workspace',
                                    usuario: req.cookies.name,
                                    priv: 'app',
                                    contestados: contestados,
                                    apppriv: apppriv
                                });
                            } else { /// Si no tiene test que ya han sido contestados, no mandamos datos
                                res.render('workspace', {
                                    title: 'Workspace',
                                    usuario: req.cookies.name,
                                    priv: 'app',
                                    apppriv: apppriv
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
                                        console.log('Si hay test contestados');
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
    });

    ///
    /// GET y POST de la página /solicitudes
    /// Verifica las solicitudes para aplicar test que tiene un aplicador
    app.get('/solicitudes', function (req, res) {
        var username = req.cookies.name;
        var apppriv = false;

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
                        console.log(solicitudes);
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


    });

    /// POST
    /// Acepta la solicitud del usuario/alumno que desea aplicarla
    ///
    app.post('/solicitudes', function (req, res) {
        var username = req.body.username;
        var aplicador = req.cookies.name;
        var test = req.body.test;
        var fechaSolicitud = req.body.fechaSolicitud.split("/");
        var fecha = new Date().toISOString().split('T')[0];
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
        ///Verificamos si el usuario es un aplicador
        var username = req.cookies.name;

        try {
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
                                        console.log(studentData);
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
        } catch (exception) {
            console.log(exception);
            res.render('perfil', {
                title: 'Perfil de ' + username,
                usuario: username,
                datos: appData
            });
            app.locals.errorMessage = '';
            app.locals.succesfulMessage = '';
        }
    });

    ///
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
        console.log(updateData);

        try {
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
        } catch (exception) {
            console.log(exception);
            res.redirect('perfil');
        }
    });

    ///
    ///Método GET y POST para la solicitud de test del usuario
    ///
    app.get('/solicitar', function (req, res) {
        var username = req.cookies.name;

        connection.query(checkUserName, username, function (errorUs, resultUs) {
            if (errorUs) throw errorUs;
            if (resultUs.length > 0) {
                connection.query(selectTest, function (error, result) {
                    if (error) throw error;
                    if (result.length > 0) {
                        var string = JSON.stringify(result);
                        var selectJson = JSON.parse(string);
                        console.log(selectJson);
                        res.render('solicitar', {
                            title: 'Solicitar test',
                            usuario: req.cookies.name,
                            test: selectJson
                        });
                        app.locals.errorMessage = '';
                        app.locals.succesfulMessage = '';
                    } else {
                        res.render('solicitar', {
                            title: 'Solicitar test',
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

    app.post('/solicitar', function (req, res) {
        var test = req.body.test;
        var aplicador = req.body.aplicador;
        var username = req.cookies.name;
        var fecha = new Date().toISOString().split('T')[0];
        var data = [username, aplicador, test, fecha, 'No'];

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
                    } else {
                        app.locals.errorMessage = aplicador + ' no está registrado en el sistema, verifica que escribiste el nombre correctamente';
                        res.redirect('/solicitar');
                    }
                });
            } else {
                res.redirect('/');
            }
        });
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
        user: '',
        password: '',
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