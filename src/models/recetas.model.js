const fs = require('fs');
const path = require('path');

// Ruta absoluta al archivo JSON
const DB_PATH = path.join(__dirname, '..', '..', 'database', 'db.json');

// --- Funciones Auxiliares ---
// Función para leer las recetas desde el JSON
function leerRecetas() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data); // Devuelve directamente el array
  } catch (error) {
    console.error('Error al leer la base de datos:', error);
    return [];
  }
}
// Función para escribir recetas en el JSON
function escribirRecetas(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al escribir en la base de datos:', error);
  }
}

// --- Clase Modelo (CRUD) ---
class RecetasModelo {
  // R - Obtener todas
  static obtenerTodos() {
    return leerRecetas();
  }

  // R - Obtener una por ID
  static obtenerPorId(id) {
    const recetas = leerRecetas();
    return recetas.find(r => r.id === id);
  }

  // --- Estadísticas ---
static obtenerEstadisticas() {
  const recetas = leerRecetas(); // ya es un array

  const total = recetas.length;

  const porTipo = {};
  const porSabor = {};
  const porOrigen = {};

  recetas.forEach(r => {
    const tipo = r.tipo || 'Sin tipo';
    const sabor = r.sabor || 'Sin sabor';
    const origen = r.origen || 'Sin origen';

    porTipo[tipo] = (porTipo[tipo] || 0) + 1;
    porSabor[sabor] = (porSabor[sabor] || 0) + 1;
    porOrigen[origen] = (porOrigen[origen] || 0) + 1;
  });

  return { total, porTipo, porSabor, porOrigen };
}

// C - Crear nueva receta
static crear(nuevaReceta) {
  const recetas = leerRecetas();

  // 🔎 Verificar si ya existe una receta con el mismo nombre (sin distinguir mayúsculas)
  const nombreRepetido = recetas.find(
    (r) => r.nombre.trim().toLowerCase() === nuevaReceta.nombre.trim().toLowerCase()
  );

  if (nombreRepetido) {
    // Si existe, devolvemos null o lanzamos un error controlado
    throw new Error(`Ya existe una receta con el nombre "${nuevaReceta.nombre}".`);
  }

  // 🆔 Generar nuevo ID automáticamente
  const newIdNumber = recetas.length
    ? Math.max(...recetas.map(r => parseInt(r.id.replace('R', '')))) + 1
    : 1;

  const recetaConId = {
    id: `R${String(newIdNumber).padStart(3, '0')}`,
    ...nuevaReceta
  };

  recetas.push(recetaConId);
  escribirRecetas(recetas);
  return recetaConId;
}

  // U - Actualizar receta existente
  static actualizar(id, datosActualizados) {
    const recetas = leerRecetas();
    const index = recetas.findIndex(r => r.id === id);

    if (index === -1) return null;

    recetas[index] = { ...recetas[index], ...datosActualizados, id };
    escribirRecetas(recetas);
    return recetas[index];
  }

  // D - Eliminar receta
  static eliminar(id) {
    const recetas = leerRecetas();
    const longitudInicial = recetas.length;
    const nuevasRecetas = recetas.filter(r => r.id !== id);

    escribirRecetas(nuevasRecetas);
    return nuevasRecetas.length !== longitudInicial;
  }
}

module.exports = RecetasModelo;
