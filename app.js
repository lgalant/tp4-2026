
import express from 'express'
import cors from "cors";

import authRouter from './Routes/authRouter.js'
import cancionRouter from './Routes/cancionRouter.js'


const app = express()
app.use(express.json());
app.use(cors());

// Rutas
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

//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => { console.log(`Local en http://localhost:${PORT}`);});

export default app;

 
