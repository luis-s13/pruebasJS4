const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const inscritoSchema = new Schema({
	estudiante : {
		type : String,
		required : true	,
	},
	documento : {
		type: Number,
		required:true,
	},
	correo : {
		type: String,
		required:true
	},
	telefono : {
		type: Number,
		default: 1111111						
	},
	cursoactual : {
		type: Number,
		required:true,
	},
	estudiantecurso: {
		type : String,
		required : true	,
		unique:true
	}
	
});

inscritoSchema.plugin(uniqueValidator);

//segun el siguiente link, el tercer argumento es el nombre de la coleccion 
//https://stackoverflow.com/questions/40079200/how-to-declare-collection-name-and-model-name-in-mongoose/40079267
const Inscrito = mongoose.model('Inscrito', inscritoSchema,'inscritos');

//validacion de llave compuesta segun el siguiente link
//https://stackoverflow.com/questions/14283503/unique-documents-using-multiple-values-in-mongoose-schema
inscritoSchema.index({ estudiante: 1, cursoactual: 1 }, { unique: true });

module.exports = Inscrito