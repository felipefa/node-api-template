const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjetoSchema = new Schema({
	// Atributos do Objeto como no exemplo abaixo
	chave: { type: String, required: true, trim: true },

	criadoEm: {
		type: Date,
		default: Date.now
	},

	atualizadoEm: {
		type: Date,
		default: Date.now
	},
	
	element: { type: String, default: 'objeto' }
}, { collection: 'OBJETOS' });

module.exports = mongoose.model('Objeto', ObjetoSchema);