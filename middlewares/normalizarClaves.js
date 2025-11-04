//función que normaliza las claves para que cuando llegue un "tiempo de coccion", le agregue los guion bajo
function normalizarClaves(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    const bodyNormalizado = {};
    for (const [clave, valor] of Object.entries(req.body)) {
      const claveNormalizada = clave.replace(/\s+/g, '_');
      bodyNormalizado[claveNormalizada] = valor;
    }
    req.body = bodyNormalizado;
  }
  next();
}

module.exports = normalizarClaves;