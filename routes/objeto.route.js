const express = require('express');
const router = express.Router();
const objetoController = require('../controllers/objeto.controller');

// Adiciona um novo objeto ao BD
router.post('/', objetoController.adicionarObjeto);

// Busca todos os objetos
router.get('/', objetoController.buscarTodosObjetos);

// Busca um objeto por ID
router.get('/:id', objetoController.buscarObjetoPorId);

// Atualiza os dados de um objeto
router.put('/:id', objetoController.atualizarObjeto);

// Remove um objeto do BD
router.delete('/:id', objetoController.removerObjeto);

module.exports = router;