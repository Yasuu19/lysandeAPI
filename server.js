import express from 'express';
import mongoose from 'mongoose';
import charactersRouter from './routes/characters.js';


//Routes

//const indexRouter = require('./routes/characters');

///////////////// Initialisation ////////////////
const app  = express(); 
const port = 3001;

mongoose.connect('mongodb://localhost/lysande')
const db = mongoose.connection; 
db.on('error', error => console.error(error));
db.once('open', () => console.error("⚡️[DB]: Database MongoDB is connected"));

/////////// Middlewares //////////////////////
app.use(express.json())
app.use('/characters', charactersRouter);

//Permet les requêtes cross-origin
//Permet de dire au navigateur que les requêtes sont OK (pas pirate) et ne pas faire d'erreurs CORS
app.use((req, res, next) => {
    //Accède à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Ajoute des headers à notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
