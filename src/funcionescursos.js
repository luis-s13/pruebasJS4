const fs = require('fs')
listaCursos = []

const leer = () =>{
	try{
		listaCursos = require('../data/cursos.json')
		//listaCursos => JSON.parse(fs.readFileSync('./data/cursos.json'))
	} catch(error){
		console.log("Archivo cursos.json no fue encontrado")
	}
}

const obtenerCursos = () =>{
	leer()
	return listaCursos;
}

const guardar = () =>{
	let datos = JSON.stringify(listaCursos)
	fs.writeFile('./data/cursos.json', datos, err=>{
		if(err) trow(err)
		console.log("Archivo cursos.json fue creado satisfactoriamente")
	})
}

const crear = (cursoa) =>{
	read()

	let hallado = listaCursos.find(buscar => buscar.id === cursoa.id)

	if (!hallado){
		listaCursos.push(cursoa)
		guardar()
		console.log('Curso creado');
	} else {
		console.log('curso con id existente')
	}
}

module.exports = {
    obtenerCursos,
    crear
}