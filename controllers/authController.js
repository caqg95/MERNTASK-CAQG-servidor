const Usuario = require('../models/Usuario');
const briptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer email y password
    const { email, password } = req.body;


    try {
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'Usuario o Contraseña Incorrecta' });
        }

        //Revisar el password
        const passwordCorrecto = await briptjs.compare(password, usuario.password);

        if (!passwordCorrecto) {
            return res.status(400).json({ msg: 'Usuario o Contraseña Incorrecta' });
        }

        //Si todo es correcto Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1 hora
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmacion
            res.json({ token });
        });
        //Mensaje de confirmacion
        //res.json({msg:'Usuario Autenticado'});
    }
    catch (error) {
        res.status(400).send('Hubo un error');
        console.log(req.error);
    }
}
//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario=await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' })
    }
}
