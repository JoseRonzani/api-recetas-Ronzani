function validateData(req, res, next) {
  const { nombre,
      tipo,
      apto,
      tiempo_de_coccion,
      ingredientes,
      descripcion } = req.body;

  if (!nombre || !tipo || !apto || !tiempo_de_coccion || !ingredientes || !descripcion) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: nombre, tipo, apto, tiempo_de_coccion, ingredientes, descripcion'
    });

  }
  // Si todo está bien, pasamos al siguiente paso (crear o actualizar)
  next();
}

module.exports = validateData;