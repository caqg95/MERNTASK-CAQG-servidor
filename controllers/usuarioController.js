const Usuario=require('../models/Usuario');
const briptjs= require('bcryptjs');
const  {validationResult}=require('express-validator');
var jwt = require('jsonwebtoken');

exports.crearUsuario= async(req,res)=>{

   //revisar si hay errores
   const errores=validationResult(req);
   if(!errores.isEmpty()){
       return res.status(400).json({errores:errores.array()});
   }

  // extraer email y password
  const{email,password}=req.body;
  

  try{
        //Revisar que el usuario registrado sea unico
        let usuario=await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({msg:'El usuario ya existe'});
        }

        //crear el nuevo usuario   
        usuario=new Usuario(req.body);
        //Hashear el password
        const salt= await briptjs.genSalt(10);
        usuario.password= await briptjs.hash(password,salt);

        //guardar usuario
        await usuario.save();

        //Crear y firmar el JWT
        const payload={
            usuario:{
                id:usuario.id
            }
        };
        //Firmar el JWT
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn:3600 //1 hora
        },(error,token)=>{
            if(error) throw error;
            //Mensaje de confirmacion
            res.json({token});            
        });
  }
  catch(error){
     console.log(error); 
     res.status(400).send('Hubo un error');
   
  }
}