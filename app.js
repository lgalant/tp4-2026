//import pkg from 'pg'
//import dbconfig from './dbconfig.js'
//import bcrypt from 'bcrypt'
//import jwt from 'jsonwebtoken'

import express from 'express'
import cors from "cors";

import authRouter from './Routes/authRouter.js'
import cancionRouter from './Routes/cancionRouter.js'

// Postgres Pool en vez de client, no necesita connect ni end
//const {Pool} = pkg;
//const pool = new Pool(dbconfig)



const app = express()
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;


const JWT_SECRET = 'veryverysecret!'

const horaMiddleware = function (req, res, next) {
  console.log('Middleware (Antes): ' + new Date().toISOString());
  next(); 	// Ir al próximo middleware
  console.log('Middleware (Despues): ' + new Date().toISOString());
}
//app.use(horaMiddleware);
app.use("/auth", authRouter);
app.use("/cancion", cancionRouter);

const unknownEndpoint = (request, response) => {
    let jsonResponse = {
        "Error"     : "unknown endpoint",
        "IP"        : request.ip,
        "Method"    : request.method,
        "Path"      : request.path,
        "Query"     : request.query,
        "Body"      : request.body
     };
    response.status(404).send(jsonResponse);
}

app.use(unknownEndpoint);

//app.listen(PORT, () => { console.log(`Local en http://localhost:${PORT}`);});

export default app;

 
