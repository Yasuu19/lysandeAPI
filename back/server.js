import express from 'express'

///////////////// Initialisation ////////////////
const app  = express(); 
const port = 8080;


/////////// Middlewares //////////////////////
app.use(express.json())
