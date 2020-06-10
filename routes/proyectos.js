//Rutas para crear usuarios
const express=require('express');
const router=express.Router();
const proyectoController=require('../controllers/proyectoController');
const {check}= require('express-validator');
const auth=require('../middleware/auth');
//Crea un Proyecto
router.post('/',
    auth,
    [
        check('nombre','El nombre del proyecto  es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);
//Obtener Proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

//Actuallizar proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre','El nombre del proyecto  es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//Eliminar un Proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports=router;