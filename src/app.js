const express =require ('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser= require('body-parser'); //para procesar post
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

//express-session declaration
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

//declaracion multer
const multer  = require('multer')
//var upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/uploads')
	},
	filename: function (req, file, cb) {
		cb(null,'avatar'+req.session.nombre+path.extname (file.originalname)  )
	}
  })
   
  
  var upload = multer({ storage: storage })
  /*
  var upload = multer({ 
	 limits:{
		 fileSize:2000000
	 },
	 fileFilter(req,res, cb) {
		if(! file.originalname.match(/\.(jpg|PNG|jpeg)$/) ){
			return cb(new Error('No es un archivo valido'))
	 }
	 cb(null,true)
	}
})
*/

const dirNode_modules = path.join(__dirname, '../node_modules')

require('./config/config');//ahi esta la declaracion de mongoose

//Importar usuarioSchema
const Usuario = require('../src/models/usuario')
//Importar materiaSchema
const Materia = require('../src/models/materia')
//Importar inscritoSchema
const Inscrito = require('../src/models/inscrito')

//declaracionesBD (sin usar mongoose)

//const MongoClient= require('mongodb').MongoClient;

//connection URL
//const url='mongodb://localhost:27017';

//database Name
//const dbName ='extension';

// create a new mongoClient
//const client = new MongoClient(url, {useNewUrlParser: true   });

// Use connect method to connect to the server
//client.connect(function(err) {
//    if(err){
//       return console.log("No se pudo conectar a mongoDB");
//    }

//console.log('Conectado mongoDB');

//const db=client.db(dbName);

//const collectionAsignaturas= db.collection('asignaturas');
//const collectionUsuarios= db.collection('usuarios');

/*
//insertar dato de prueba en Asignaturas
collectionAsignaturas.insertOne({
	idcurso:1,
	nombrecurso:"Gestion TICS",
	descripcioncurso:"Curso de marcos orientado a TICS",
	costo:100,
	modalidad:"Presencial",
	intensidad:38,
	estado:"Disponible"
 },(err,result)=>{
	 if(err){
		  return console.log("error ingresando usuario")
	  }
	 return console.log(result.ops)
 }  )
*/
/*
//insertar dato de prueba en usuarios
  collectionUsuarios.insertOne({
	  nombre: "Jose",
	  password:"12345",
	  documento:10203040,
	  correo:"jose@outlook.com",
      telefono:4004000,
      rol:"Coordinador"
   },(err,result)=>{
       if(err){
            return console.log("error ingresando usuario")
        }
       return console.log(result.ops)
   }  )
*/

//client.close();
//});


app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));


require ('./helpers');

const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);

app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard',
  	resave: true,
  	saveUninitialized: true
}))
app.use((req, res, next) =>{
 
	//En caso de usar variables de sesión
	if(req.session.usuario){		
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
	}	
	next()
})

app.use(bodyParser.urlencoded({extended:false})); //para post

app.set('view engine','hbs');

app.get('/',(req,res) =>{
	res.render('index', {
		//estudiante: 'Student'
	});
});

//pruebas CHAT E4
var server = require("http").createServer(app);  
var io = require("socket.io")(server, {path: "/socket-io"});

//server.listen(8080); //

//app.use(express.static(__dirname + "/public"));

app.get("/indexChat", (httpRequest, httpResponse, next)=>{
	httpResponse.sendFile(__dirname + "/html/indexChat.html");
})

app.get("/chatMesa", (httpRequest, httpResponse, next)=>{
	httpResponse.sendFile(__dirname + "/html/chatMesa.html");
})


var cookieParser = require("socket.io-cookie");

var chatmesa = io.of("/chatMesa");

chatmesa.use(cookieParser);

chatmesa.on("connection", function(socket){
	socket.on("message", function(message){
  		io.send(message);
    });
})



//prueba autenticacion repositorio
/*
var basicAuth = require("basic-auth");

function uniqueNumber() {
    var date = Date.now();
    
    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }

    return date;
}

uniqueNumber.previous = 0;

var auth = function (req, res, next){
	var userAut = basicAuth(req);

	if(!userAut || userAut.name !== "admin" || userAut.pass !== "admin789")
	{
		res.statusCode = 401;
	    res.setHeader("WWW-Authenticate", "Basic realm='Authorization Required'");
	    res.end("Access denied");
	}
	else
	{
		var id = uniqueNumber();
		authenticated_users[id] = id;
		res.cookie("authentication_id", id);
		next();
	}
}

/*
app.get('/pagina2',(req,res) =>{
	res.render('pagina2', {
		//estudiante: 'Student'
	});
});

app.get('/pagina3',(req,res) =>{
	res.render('pagina3', {
		//estudiante: 'Student'
	});
});

app.get('/pagina4',(req,res) =>{
	res.render('pagina4', {
		//estudiante: 'Student'
	});
});

app.get('/pagina5',(req,res) =>{
	res.render('pagina5', {
		//estudiante: 'Student'
	});
});
*/
/*
app.post('/paginaCursoCreado',(req,res) =>{ //para post
	
	res.render('paginaCursoCreado', {
		idTemp: parseInt (req.body.id),//body porque es post
		cursoTemp: req.body.curso,//body porque es post
		descripcionTemp: req.body.descripcion,//body porque es post
		costoTemp: parseInt (req.body.costo),//body porque es post
		modalidadTemp: req.body.modalidad,//body porque es post
		intensidadTemp: parseInt (req.body.intensidad)|| 0,//body porque es post
	});
});

app.post('/paginaResultInscripcion',(req,res) =>{ //para post
	
	res.render('paginaResultInscripcion', {
		documentoE: parseInt (req.body.docidentidad),//body porque es post
		correoE: req.body.correo,//body porque es post
		nombreE: req.body.nombre,//body porque es post
		telefonoE: parseInt (req.body.telefono),//body porque es post
		idcursoE: req.body.idcurso,//body porque es post
	});
});

app.post('/detalleInscritosCurso',(req,res) =>{ //para post
	
	res.render('detalleInscritosCurso', {
		idcE: parseInt (req.body.idcursosel),//body porque es post
	});
});

app.post('/paginaEliminar',(req,res) =>{ //para post
	
	res.render('paginaEliminar', {
		nombreE: req.body.nombreEstudiante,
		idcE: parseInt (req.body.numCurso),//body porque es post
	});
});

app.post('/estadoCambiado',(req,res) =>{ //para post
	
	res.render('estadoCambiado', {
		idcursoE: parseInt (req.body.idcurso),//body porque es post
	});
});


app.get('/infoInteresado',(req,res) =>{
	res.render('infoInteresado', {
		//
	});
});
*/
app.get('/registroUsuario',(req,res) =>{ 
	
	res.render('registroUsuario', {
		//
	});
});

app.post('/InicioCoordinador',(req,res) =>{ 
	
	res.render('InicioCoordinador', {
		//
	});
});
/*
app.post('/InicioAspirante',(req,res) =>{ 
	
	res.render('InicioAspirante', {
		//
	});
});



app.post('/CursosCoordinador',(req,res) =>{ 
	
	res.render('CursosCoordinador', {
		//
	});
});

app.post('/InscritosCoordinador',(req,res) =>{ 
	
	res.render('InscritosCoordinador', {
		//
	});
});

app.post('/CreacionCursos',(req,res) =>{ 
	
	res.render('CreacionCursos', {
		//
	});
});
*/
//BDapp
app.post('/BDCreacionCurso',(req,res) =>{
	res.render('BDCreacionCurso', {
		//
	});
});

//TESTONLY
app.post('/BDpaginaCursoCreado',(req,res) =>{ //para post
	//console.log('post act');
	let txtok="El curso ";
	let txterr="error al insertar curso";
	console.log(txterr)
	let materia = new Materia ({
		idcurso: parseInt (req.body.id),//body porque es post
		nombrecurso: req.body.curso,//body porque es post
		descripcioncurso: req.body.descripcion,//body porque es post
		costo: parseInt (req.body.costo),//body porque es post
		modalidad: req.body.modalidad,//body porque es post
		intensidad: parseInt (req.body.intensidad)|| 0,//body porque es post
		estado: "Disponible"
	})


	materia.save((err, resultado) => {
		if (err){
			console.log (err);
			return res.render ('BDpaginaCursoCreado', {
				resultadoRegistrarCurso : err.message,
			})			
		}
		txtok=txtok+materia.nombrecurso +" fue insertado correctamente;"
		console.log(txtok);		
		res.render ('BDpaginaCursoCreado', {			
			resultadoRegistrarCurso : txtok,		
			})	
			
	})		
});

//BDapp
app.post('/BDcursosCoordinador', (req,res) => {

	Materia.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDcursosCoordinador',{
			listadoCursos : respuesta
		})
	})
})

//BDapp
app.get('/BDInfoInteresado', (req,res) => {
	Materia.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDInfoInteresado',{
			listadoCursos : respuesta
		})
	})
})
//test Modal
app.get('/BDInfoInteresado2', (req,res) => {
	Materia.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDInfoInteresado2',{
			listadoCursos : respuesta
		})
	})
})

//test version Old CSS con BD
app.get('/BDInfoInteresado3', (req,res) => {
	Materia.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDInfoInteresado3',{
			listadoCursos : respuesta
		})
	})
})

//BDapp
app.post('/BDestadoCambiado',(req,res) =>{ //para post
	res.render ('BDestadoCambiado',{
		idcursoB:parseInt (req.body.idcurso)
	})
});
//BDapp
app.post('/BDOfertaAspirante',(req,res) =>{ 
	Materia.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDOfertaAspirante',{
			listadoCursos : respuesta
		})
	})
});
//TESTONLY
app.post('/BDpaginaResultInscripcion',(req,res) =>{ //para post
	let txtok="Inscripción de aspirante ";
	let txterr="error al inscribir->";
	let inscrito = new Inscrito ({
	documento: parseInt (req.body.docidentidad),//body porque es post
	correo: req.body.correo,//body porque es post
	estudiante: req.body.nombre,//body porque es post
	telefono: parseInt (req.body.telefono),//body porque es post
	cursoactual: req.body.idcurso,//body porque es post
	estudiantecurso:req.body.nombre+req.body.idcurso
	})

	inscrito.save((err, resultado) => {
		if (err){
			console.log (err);
			return res.render ('BDpaginaResultInscripcion', {
				resultadoRegistrarAspirante : txterr+ err.message
			})			
		}
		txtok=txtok+inscrito.estudiante +" fue realizada de forma correcta"
		console.log(txtok);		
		res.render ('BDpaginaResultInscripcion', {			
			resultadoRegistrarAspirante : txtok				
			})
			
	})		

});

app.post('/BDInscritosCoordinador',(req,res) =>{ 
	
	Materia.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDInscritosCoordinador',{
			listadoCursos : respuesta
		})
	})
});

//BDapp
app.post('/BDdetalleInscritosCurso',(req,res) =>{ //para post

	Inscrito.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDdetalleInscritosCurso',{
			idcE: parseInt (req.body.idcursosel),//body porque es post
			cursoseleccionado:req.body.cursoseleccionado,
			listadoInscritos : respuesta
		})
	})		
	
});

//BDapp
app.post('/BDpaginaEliminar',(req,res) =>{ //para post

	Inscrito.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('BDpaginaEliminar',{
			nombreE: req.body.nombreEstudiante,
			idcE: parseInt (req.body.numCurso),//body porque es post
			listadoInscritos : respuesta
		})
		
	})		
	
});

//nueva pagina para compatibilidad BDapp
app.post('/respuestaAspirante',(req,res) =>{ 
	
		res.render ('respuestaAspirante',{

		})
});

app.post('/enviarUsuario',(req,res) =>{ //para post
		//console.log('post act');
		let txtok="El usuario ";
		let txterr="error al insertar (usuario o documento ya existe)";
		let usuario = new Usuario ({
			nombre : req.body.nombre,
			documento :  parseInt (req.body.documento),
			telefono : parseInt (req.body.telefono)||0,
			correo : 	req.body.correo,
			rol : 	req.body.rol,
			//password : req.body.password //sin usar bcrypt
			password:bcrypt.hashSync(req.body.password, 10)//10 es el # de saltos
		})


		usuario.save((err, resultado) => {
			if (err){
				console.log ("error: expected document to be unique");
				return res.render ('enviarUsuario', {
					resultadoRegistrarUsuario : txterr
				})			
			}
			txtok=txtok+usuario.nombre +" fue insertado correctamente;"
			console.log(txtok);		
			res.render ('enviarUsuario', {			
				resultadoRegistrarUsuario : txtok				
				})	
				
		})		
});
//session page
app.get('/Inscribirse', (req, res) => {	

	Usuario.findById(req.session.idUsuario, (err, usuario) =>{

		if (err){
			return console.log(err)
		}

		if (!usuario){
		return res.redirect('/')
		}
		Materia.find({},(err,respuesta)=>{
			if (err){
				return console.log(err)
			}
			console.log('usuario por inscribirse:'+usuario.nombre)
			res.render ('Inscribirse',{
				listadoCursos : respuesta,
				nombre : usuario.nombre,
				documento: usuario.documento,
				telefono:usuario.telefono,
				correo:usuario.correo
			})
		})

	});
})
//session page E4
app.get('/datosPersonales', (req, res) => {	

	Usuario.findById(req.session.idUsuario, (err, usuario) =>{

		if (err){
			return console.log(err)
		}

		if (!usuario){
		return res.redirect('/')
		}
			console.log('usuario por mostrar datos:'+usuario.nombre)
			res.render ('datosPersonales',{
				nombre : usuario.nombre,
				documento: usuario.documento,
				telefono:usuario.telefono,
				correo:usuario.correo
			})


	});
})

//session page E4
app.post('/paginaActualizarFoto',upload.single('archivo'), function (req, res) { //para post
	Usuario.findById(req.session.idUsuario, (err, usuario) =>{

		if (err){
			return console.log(err)
		}

		if (!usuario){
		return res.redirect('/')
		}
			console.log('usuario por mostrar foto:'+usuario.nombre)
			res.render ('paginaActualizarFoto',{
				nombre : usuario.nombre,
				documento: usuario.documento,
				telefono:usuario.telefono,
				correo:usuario.correo
			})


	});
});

//session pageE4
app.post('/paginaAnuncios',(req, res) =>{ //para post

	res.render ('paginaAnuncios',{

	})

});



//session page
app.get('/salir', (req, res) => {
	req.session.destroy((err) => {
  		if (err) return console.log(err) 	
	})	
	// localStorage.setItem('token', '');
	res.redirect('/')	
})

//app.post('/autenticarUsuario',(req,res) =>{ //para post
app.post('/autenticarUsuario',(req,res) =>{ //para post
	//query si no se usa bcrypt:
	//Usuario.findOne({nombre : req.body.nombre, password : req.body.password}, (err, resultados) => {
	//query al usar bcrypt				
	Usuario.findOne({nombre : req.body.nombre}, (err, resultados) => {
		if (err){
			return console.log(err)
		}
		if(!resultados){
			console.log("sin resultados")
			return res.render ('autenticarUsuario', {
			mensajeAutenticar : "Usuario no existe o password errado"			
			})
		}
		else{
			console.log("usuario encontrado")

			//comparar con bcrypt
			//console.log(resultados.password);
			let comparar=bcrypt.compareSync(req.body.password,resultados.password)
			if(comparar)
				{
				//Creación de variables de sesión
				req.session.idUsuario = resultados._id	//session
				req.session.nombre = resultados.nombre	//session

					//query si se usa bcrypt
					Usuario.findOne({nombre : req.body.nombre, rol:"Coordinador"}, (erru, resultadoc) => {
						if (erru){
							return console.log(erru)
						}

						if(resultadoc)
						  {	
							//return res.render('InicioCoordinador', {
								res.render('InicioCoordinador', {
									session:true,	//session
									nombre: resultados.nombre
							})
						  }
						else
							{
								//return res.render('InicioAspirante', {
									res.render('respuestaAspirante', {
										session:true,
										nombre: resultados.nombre	
									})	
							}  
						})					
				}
				else {
					   res.render ('autenticarUsuario', {
						mensajeAutenticar : "Password incorrecto o usuario Invalido"			
						})
					console.log("contraseña ingresada no corresponde")
				}
			/*
			//comparar sin bcrypt
			Usuario.findOne({nombre : req.body.nombre, password : req.body.password,rol:"Coordinador"}, (erru, resultadoc) => {
				if (erru){
					return console.log(erru)
				}
				console.log("pass ok");
				if(resultadoc)
				  {	
					//return res.render('InicioCoordinador', {
						res.render('InicioCoordinador', {
					})
				  }
				else
					{
						//return res.render('InicioAspirante', {
							res.render('respuestaAspirante', {
							})	
					}  
				})
				*/
			
			}
			
		})
});

//conexion mongoose
mongoose.set('useCreateIndex', true); //fix deprecated warning
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(error)
	}
	console.log("conectado Mongoose")
});

app.listen(port, () => {
	console.log('servidor en el puerto '+port)
})