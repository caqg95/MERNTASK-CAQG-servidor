const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {

    //Extraer el proyecto y comprobar si existen
    const { proyecto } = req.body;

    const existeproyecto = await Proyecto.findById(proyecto);
    if (!existeproyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    //Revisar si el royecto actual pertenece al usuario autenticado
    if (existeproyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }
    //Creamos la tarea
    const tarea = new Tarea(req.body);
    tarea.save();
    res.json({ tarea });
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');

  }
}

//Obtiene todo los proyectos del usuario actual
exports.obtenerTareas = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar si existen
    const { proyecto } = req.query;

    const existeproyecto = await Proyecto.findById(proyecto);

    if (!existeproyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    //Revisar si el royecto actual pertenece al usuario autenticado
    if (existeproyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }
    //Guardar el creador via JWT
    // const creadorT = req.usuario.id;
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    //Guardar el Tareas
    res.json({ tareas });
  }
  catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error');

  }
}

//Actualizar un Proyecto
exports.actualizarTarea = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer informacion del proyecto
  const { proyecto, nombre, estado } = req.body;
  try {
    //revisar el ID
    let tarea = await Tarea.findById(req.params.id);
    //Si el proyecto existe o no
    if (!tarea) {
      return res.status(404).json({ msg: 'No existe esa tarea' });
    }
    //Extraer el proyecto
    const existeProyecto = await Proyecto.findById(proyecto);
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    //Crear un objeto con la nueva informacion
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    //Guardar la tarea
    tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevaTarea }, { new: true });
    res.json({ tarea });

  }
  catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error');

  }
}

//Eliminar un Proyecto
exports.eliminarTarea = async (req, res) => {
  //extraer informacion del proyecto
  //const { nombre } = req.body;
  //const nuevoTarea = {};
  //extraer informacion del proyecto
  const { proyecto } = req.query;
  try {
    //revisar el ID
    let tarea = await Tarea.findById(req.params.id);
    //Si el proyecto existe o no
    if (!tarea) {
      return res.status(404).json({ msg: 'No existe esa tarea' });
    }
    //Extraer el proyecto
    const existeProyecto = await Proyecto.findById(proyecto);
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    //Eliminar la tarea
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Tarea Eliminada' });


  }
  catch (error) {
    console.log(error);
    res.status(500).send('Error del servidor');

  }
}