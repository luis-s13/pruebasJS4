process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/extension';
}
else {
	urlDB = 'mongodb+srv://ldiaz:regAtlas@cluster0-it9ky.gcp.mongodb.net/extension?retryWrites=true&w=majority'
	console.log('Warning: no se ha definido URL para entorno no local');
}

process.env.URLDB = urlDB