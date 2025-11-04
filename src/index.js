const express = require('express');
const recetasRoutes = require('./routes/recetas.routes');
const logger = require('../middlewares/logger');
const normalizarClaves = require('../middlewares/normalizarClaves');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger); // 🔹 Loguea cada request
app.use(normalizarClaves);

app.use('/api/recetas', recetasRoutes);

app.get('/', (req, res) => {
  res.send('API REST de Recetas sin gluten funcionando 🍞🍰');
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado. URL: http://localhost:${PORT}`);
});
