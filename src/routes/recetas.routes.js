// src/routes/recetas.routes.js
const express = require('express');
const router = express.Router();
const recetasController = require('../controllers/recetas.controller');
const validateData = require('../../middlewares/validateData');

// Definición de las Rutas (Endpoints REST)
router.get('/filtro', recetasController.filtrarRecetas);  // GET /api/recetas/filtro?
router.get('/estadisticas', recetasController.obtenerEstadisticas); // GET /api/recetas/estadisticas
router.get('/:id', recetasController.obtenerPorId);    // GET /api/recetas/01
router.get('/', recetasController.obtenerRecetas);       // GET /api/recetas
router.post('/', validateData, recetasController.crearReceta); //POST /api/recetas
router.put('/:id', recetasController.actualizarReceta);      // PUT /api/recetas/01
router.delete('/:id', recetasController.eliminarReceta);     // DELETE /api/recetas/01

module.exports = router;
