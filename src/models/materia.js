const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
//https://mongoosejs.com/docs/schematypes.html#string-validators

const Schema = mongoose.Schema;
const materiaSchema = new Schema({
	idcurso : {
		type : Number,
		required : true	,
		unique:true
	},
	nombrecurso :{
		type : String,
		required : true
	},
	descripcioncurso : {
		type: String,
		required:true,
	},
	costo : {
		type: Number,
		required:true
	},
	modalidad : {
		type: String,
		enum: ['Virtual','Presencial'],
		default:"Virtual"
	},
	intensidad : {
		type: Number,
		default: 40						
	},
	estado : {
		type: String,
		enum: ['Disponible','Cerrado'],
		required:true,
		default:"Disponible"
	}
	
});

materiaSchema.plugin(uniqueValidator);

const Materia = mongoose.model('materia', materiaSchema,'materias');

module.exports = Materia