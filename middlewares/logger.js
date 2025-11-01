const fs = require('fs');
const path = require('path');

const logsPath = path.join(__dirname, '../logs.txt');

function logger(req, res, next) {
  const now = new Date().toLocaleString('es-AR');
  const line = `[${req.method}] ${req.url} - ${now}\n`;

  // 1. Mostrar por consola
  console.log(line.trim());

  // 2. Guardar en archivo
  fs.appendFile(logsPath, line, (err) => {
    if (err) console.error('Error al guardar log:', err);
  });

  next();
}

module.exports = logger;