//Rutas para crear usuarios
const express=require('express');
const router=express.Router();
const tareaController=require('../controllers/TareaController');
const {check}= require('express-validator');
const auth=require('../middleware/auth');
//Crea un Tarea
router.post('/',
    auth,
    [
        check('nombre','El nombre de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);
//Obtener Tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//Actuallizar tarea via ID
router.put('/:id',
    auth,
    [
        check('nombre','El nombre de la tarea  es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
);

//Eliminar una Tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports=router;