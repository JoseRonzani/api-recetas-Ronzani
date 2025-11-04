function validateData(req, res, next) {
  const { id,
    nombre,
      tipo,
      apto,
      tiempo_de_coccion,
      ingredientes,
      descripcion } = req.body;

  // ❌ Si el usuario intenta mandar un ID, rechazamos la petición
  if (id) {
    return res.status(400).json({
      error: 'No se debe enviar un ID al crear una receta. El ID se genera automáticamente.'
    });
  }

  if (!nombre || !tipo || !apto || !tiempo_de_coccion || !ingredientes || !descripcion) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: nombre, tipo, apto, tiempo_de_coccion, ingredientes, descripcion'
    });

  }
  // Si todo está bien, pasamos al siguiente paso (crear o actualizar)
  next();
}

module.exports = validateData;