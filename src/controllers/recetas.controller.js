const RecetasModelo = require('../models/recetas.model');
const validateData = require('../../middlewares/validateData');

function formatearId(id) {
  let formatted = id.toUpperCase(); // r001 → R001
  if (/^\d+$/.test(formatted)) {
    formatted = `R${formatted.padStart(3, '0')}`;
  }
  return formatted;
}

class RecetasController {
  // GET /api/recetas
  static obtenerRecetas(req, res) {
    const recetas = RecetasModelo.obtenerTodos();
    res.status(200).json(recetas);
  }

  // GET /api/recetas/:id
  //utilizar validateData
  //acomodar el post
  static obtenerPorId(req, res) {
    const id = formatearId(req.params.id);
    const receta = RecetasModelo.obtenerPorId(id);

    if (receta) {
      res.status(200).json(receta);
    } else {
      res.status(404).json({ mensaje: `Receta con ID ${id} no encontrada` });
    }
  }
  // GET /api/recetas/filtro?tipo=budín&requiere_frio=no&apto=celiaco
 // dentro de src/controllers/controller.js (reemplazar el método filtrarRecetas actual)

static filtrarRecetas(req, res) {
  const { tipo, origen, sabor, requiere_frio, nivel_dificultad, apto } = req.query;
  const recetas = RecetasModelo.obtenerTodos();

  // Normaliza cadenas: pasar a minúsculas y quitar diacríticos/tildes
  const normalize = (s) => {
    if (!s && s !== '') return '';
    return String(s)
      .normalize('NFD')                // descompone acentos
      .replace(/[\u0300-\u036f]/g, '') // quita diacríticos
      .toLowerCase()
      .trim();
  };

  const resultados = recetas.filter(receta => {
    let coincide = true;

    // Helper que compara usando includes sobre strings normalizados
    const matchString = (valorReceta, valorQuery) => {
      if (!valorQuery) return true; // si no preguntaron por ese campo, pasa
      const q = normalize(valorQuery);
      if (!valorReceta && valorReceta !== '') return false;
      const r = normalize(valorReceta);

      // Si el campo de receta tiene separadores (/,|,) intentamos separar y comparar cada parte
      const partes = r.split(/[\/,|]/).map(p => p.trim()).filter(Boolean);
      // si alguna parte incluye la query → match
      return partes.some(p => p.includes(q)) || r.includes(q);
    };

    if (tipo) {
      if (!matchString(receta.tipo, tipo)) coincide = false;
    }
    if (origen) {
      if (!matchString(receta.origen, origen)) coincide = false;
    }
    if (sabor) {
      if (!matchString(receta.sabor, sabor)) coincide = false;
    }
    if (requiere_frio) {
      // requiere_frio suele ser "si"/"no"
      if (!matchString(receta.requiere_frio, requiere_frio)) coincide = false;
    }
    if (nivel_dificultad) {
      if (!matchString(receta.nivel_dificultad, nivel_dificultad)) coincide = false;
    }

    // apto: la receta guarda un array (ej: ["celiaco", "sin lácteos"])
    if (apto) {
      const filtrosApto = String(apto).split(',').map(a => normalize(a)).filter(Boolean);
      const aptosReceta = (receta.apto || []).map(a => normalize(a));

      // Si la receta no declara aptos y el filtro pide alguno → no coincide
      if (aptosReceta.length === 0) {
        coincide = false;
      } else {
        // Match si alguna de las opciones pedidas encaja con alguna opción de la receta (incluye parcial)
        const anyMatch = filtrosApto.some(f =>
          aptosReceta.some(ar => ar === f || ar.includes(f) || f.includes(ar))
        );
        if (!anyMatch) coincide = false;
      }
    }

    return coincide;
  });

  if (!resultados || resultados.length === 0) {
    return res.status(404).json({ mensaje: 'No se encontraron recetas con esos filtros.' });
  }

  return res.status(200).json(resultados);
}
  
  // GET /api/recetas/estadisticas
  static obtenerEstadisticas(req, res) {
    const stats = RecetasModelo.obtenerEstadisticas();
    res.status(200).json(stats);
  }

  // POST /api/recetas
static crearReceta(req, res) {
  try {
    const nuevaReceta = req.body;
    const recetaCreada = RecetasModelo.crear(nuevaReceta);
    res.status(201).json(recetaCreada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}


  // PUT /api/recetas/:id
  static actualizarReceta(req, res) {
    const id = formatearId(req.params.id); // 🔹 Mantener string
    const datosActualizados = req.body;
    delete datosActualizados.id;

    if (!datosActualizados || Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar' });
    }

    const recetaActualizada = RecetasModelo.actualizar(id, datosActualizados);
    if (recetaActualizada) {
      res.status(200).json(recetaActualizada);
    } else {
      res.status(404).json({ mensaje: `Receta con ID ${id} no encontrada para actualizar` });
    }
  }

  // DELETE /api/recetas/:id
  static eliminarReceta(req, res) {
    const id = formatearId(req.params.id);
    const eliminado = RecetasModelo.eliminar(id);

    if (eliminado) {
      res.status(200).json({ mensaje: `Receta con ID ${id} eliminada exitosamente` });
    } else {
      res.status(404).json({ mensaje: `Receta con ID ${id} no encontrada para eliminar` });
    }
  }
}

module.exports = RecetasController;
