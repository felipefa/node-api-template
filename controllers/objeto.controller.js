/* 
 * Arquivo responsável pelos métodos de CRUD genéricos e específicos dos modelos.
 */

// Importa os modelos dos dados
const Objeto = require('../models/objeto.model');

// Imprime a mensagem de erro do reject promise no console do server
const errHandler = (err) => {
	console.log('\n--------------------REJECTED PROMISE--------------------\n', err);
}

// Insere os dados recebidos da requisição numa instância do objeto que deve ser salvo
function adicionarObjeto(objeto, dados) {	
	return new Promise((resolve, reject) => {
		const keys = Object.keys(dados);

		keys.forEach(key => {
			objeto[key] = dados[key];
		});

		resolve(objeto);
	});
}

// Salva um objeto genérico passado no primeiro parâmetro
function salvarObjeto(objeto, res) {	
	return new Promise((resolve, reject) => {
		objeto.save((err) => {
			if (err)  {
				reject('ERRO AO SALVAR OBJETO\n'+err, res.sendStatus(500));
			} else {
				console.log('\n--------------------OBJETO SALVO COM SUCESSO--------------------\n', objeto);
				resolve(objeto);
			}
		});
	});
}

// Template: Método para adicionar (CREATE), será executado no POST do route do objeto genérico
exports.adicionarObjeto = (req, res) => {
	adicionarObjeto(new Objeto(), req.body, res).then((objeto) => {
		salvarObjeto(objeto, res).then((objetoSalvo) => {	
			res.send(objetoSalvo);
		}, errHandler);
	}, errHandler);
};

// Retorna uma lista com todos os objetos genéricos do tipo passado no primeiro parâmetro
function buscarTodosObjetos(Objeto, res) {
	return new Promise((resolve, reject) => {
		Objeto.find((err, objetos) => {
			if (err) {					
				reject('ERRO AO BUSCAR LISTA DE OBJETOS', res.sendStatus(500));
			} else {
				if (objetos.length > 0) {
					console.log('\n--------------------OBJETOS ENCONTRADOS COM SUCESSO--------------------\n', objetos);
					resolve(objetos);
				}
				else reject('OBJETOS NÃO ENCONTRADOS', res.sendStatus(404));
			}
		});
	});	
}

// Template: Método para buscar (READ) todos, será executado no GET ('/') do route do objeto genérico
exports.buscarTodosObjetos = (req, res) => {
	buscarTodosObjetos(Objeto, res).then((objetos) => {
		res.send(objetos);
	}, errHandler);
};

// Retorna o objeto encontrado, caso exista, buscado pelo id e pelo tipo de objeto informado no primeiro parâmetro
function buscarObjetoId(Objeto, id, res) {
	return new Promise((resolve, reject) => {
		Objeto.findById(id, (err, objeto) => {
			if (err) {
				reject('ERRO AO BUSCAR OBJETO POR ID: '+id, res.sendStatus(500));
			} else {
				if (objeto) {
					console.log('\n--------------------OBJETO ENCONTRADO COM SUCESSO--------------------\n', objeto);
					resolve(objeto);
				}
				else reject('NENHUM OBJETO FOI ENCONTRADO COM O ID: '+id, res.sendStatus(404));
			}
		});
	});
}

// Template: Método para buscar (READ) um objeto encontrado pelo id passado na url da requisição
exports.buscarObjetoPorId = (req, res) => {
	buscarObjetoId(Objeto, req.params.id, res).then((objeto) => {
		res.send(objeto);
	}, errHandler);
};

// Atualiza os dados de um determinado objeto de acordo com seu id
function atualizarObjeto(Objeto, id, dados, res) {
	return new Promise((resolve, reject) => {
		Objeto.findById(id, (err, objeto) => {		
			if (err) {
				reject('ERRO AO ATUALIZAR OBJETO: '+dados, res.sendStatus(500));
			} else {
				if (objeto) {
					const keys = Object.keys(dados);

					keys.forEach(key => {
						if (key == 'docResp') return;
						objeto[key] = dados[key];
					});

					objeto['atualizadoEm'] = new Date();

					console.log('\n--------------------OBJETO ATUALIZADO COM SUCESSO--------------------\n', objeto);

					resolve(objeto);

				} else reject('OBJETO NÃO ENCONTRADO PARA ATUALIZAÇÃO', res.sendStatus(404));
			}
		});
	});
}

// Template: Método para atualizar (UPDATE) um objeto com os dados recebidos de acordo com o id
exports.atualizarObjeto = (req, res) => {
	atualizarObjeto(Objeto, req.params.id, req.body, res).then((objeto) => {
		salvarObjeto(objeto, res).then((objetoSalvo) => {
			res.send(objetoSalvo);
		}, errHandler);
	}, errHandler);
};

// Remove um objeto de um determinado tipo de acordo com seu id
function removerObjeto(Objeto, id, res) {
	return new Promise((resolve, reject) => {
		Objeto.deleteOne({_id: id}, (err) => {
			if (err) {
				reject('ERRO AO REMOVER OBJETO COM ID: '+id, res.sendStatus(500));
			} else {
				console.log('\n--------------------OBJETO REMOVIDO--------------------\nID: ', id);
				resolve('Documento removido com sucesso!');
			}
		});
	});
}

// Template: Método para remover (DELETE) um objeto de acordo com seu id
exports.removerObjeto = (req, res) => {
	removerObjeto(Objeto, req.params._id, res).then((objetoRemovido) => {
		res.send(objetoRemovido);
	}, errHandler);
};

// Remove muitos objetos de um determinado tipo de acordo com as condições de busca do mesmo
function removerMuitosObjetos(Objeto, condicoes, res) {
	return new Promise((resolve, reject) => {
		Objeto.deleteMany(condicoes, (err) => {
			if (err) {
				reject('ERRO AO REMOVER OBJETOS COM AS CONDIÇÕES\n'+condicoes, res.sendStatus(500));
			} else {				
				console.log('\n--------------------MUITOS OBJETOS COM AS SEGUINTES CONDIÇÕES FORAM REMOVIDOS--------------------\n', condicoes);
				resolve('Documentos removidos com sucesso!');
			}
		});
	});
}

// Template: Método para remover (DELETE) muitos documentos de acordo com seu tipo e as condições informadas
exports.removerResponsavel = (req, res) => {
	let valor = req.params.valor;
	let condicoes = { element: 'objeto', chave: valor };

	removerMuitosObjetos(Objeto, condicoes, res).then((objetosRemovidos) => {
		res.send(objetosRemovidos);
	}, errHandler);
};
