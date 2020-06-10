const express=require('express')
const conectarDB= require('./config/db');
const cors=require('cors');

//Crear el servidor
const app=express();

//Conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({extended:true}));

//PUERTO DE LA APP
const port=process.env.PORT || 4000

// Importar rutas
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

//Definir la pagina principal
app.get('/',(req,res)=>{
    res.send('API DE ADMINISTRACIÓN DE PROYECTOS');
})
//Arrancar la app
app.listen(port,'0.0.0.0',()=>{
    console.log(`EL SERVIDOR ESTA FUNCIONANDO EN EL PUERTO ${port}`);
});
