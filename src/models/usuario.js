const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const usuarioSchema = new Schema({
	nombre : {
		type : String,
		required : true	,
		trim : true,
		unique: true
	},
	password :{
		type : String,
		required : true
	},
	documento : {
		type: Number,
		required:true,
		unique:true
	},
	correo : {
		type: String,
		required:true
	},
	telefono : {
		type: Number,
		default: 1111111						
	},
	rol : {
		type: String,
		required:true,
		enum: ['Aspirante', 'Coordinador','Interesado'],
		default:"Aspirante"
	}
	
});

usuarioSchema.plugin(uniqueValidator);
//segun el siguiente link, el tercer argumento es el nombre de la coleccion 
//https://stackoverflow.com/questions/40079200/how-to-declare-collection-name-and-model-name-in-mongoose/40079267
const Usuario = mongoose.model('Usuario', usuarioSchema,'usuarios');

module.exports = Usuario