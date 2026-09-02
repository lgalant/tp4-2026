import pkg from 'pg'
import dbconfig from './dbconfig.js'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from "cors";
import jwt from 'jsonwebtoken'

// Postgres Pool en vez de client, no necesita connect ni end
const {Pool} = pkg;
const pool = new Pool(dbconfig)


const app = express()
app.use(express.json());
app.use(cors());


app.get('/',(req,res)=>res.send("Welcome " + usuario1 ))
const PORT = process.env.PORT || 3000;


const JWT_SECRET = 'veryverysecret!'

app.post('/crearusuario', async (req,res) => {
  const user = req.body;
  if(!user.username || !user.nombre || !user.password  )
    return res.status(400).json({message:"Debes completar todos los campos"})

  try {
    const hashedPwd = await bcrypt.hash(user.password,10);
    const result = await pool.query("insert into usuario(username, nombre, password) values ($1,$2,$3) returning id",
      [user.username, user.nombre,hashedPwd])
    console.log("result.rows", result.rows)
       res.status(201).json({message:"Usuario creado!, id:" + result.rows[0].id})

  }
  catch (err) {
    console.log("Error:", err)
    return res.status(500).json({message:"Error creando usuario en bd" + err})
  }
})

app.post('/login', async (req,res) => {
  const user = req.body;
  if(!user.username|| !user.password  )
    return res.status(400).json({message:"Debes completar todos los campos"})

  try {
    const result = await pool.query("select id, password from usuario where username = $1",[user.username]);
    if (result.rowCount == 0)
      return res.status(400).json({message:"Usuario inexistente o clave incorrecta"})

    const dbUser = result.rows[0];
    const passOK = await bcrypt.compare(user.password, dbUser.password)
    if (!passOK) {
      return res.status(400).json({message:"Usuario inexistente o clave incorrecta"})
    }

    const payload = {
      id: dbUser.id
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn:'1h'})
    return res.status(200).json({token})
  }
  catch (err) {
    console.log("Error:", err)
    return res.status(500).json({message:"Error accediendo a bd" + err})
  }

})

app.get('/escucha', async (req,res) => {

 const authHeader = req.headers['authorization'];
 if (!authHeader) {
   return res.status(401).send({ error: 'No llegó ningún token en los headers' });
 }
 const token = authHeader.split(' ')[1];
 let id = 0;
  try {
   const payload = jwt.verify(token, JWT_SECRET);
   id = payload.id;

 } catch (err) {
   console.error(err);
   return res.status(401).send({ error: 'Unauthorized' });
 }

   try {
    const result = await pool.query(`select c.nombre, e.reproducciones 
                                    from cancion c join escucha e 
                                    on c.id = e.cancion_id where e.usuario_id =$1`,[id]);

    console.log("Token verified:", id);
    return res.status(200).json({canciones:result.rows})

 } catch (err) {
   console.error(err);
   return res.status(500).send({ error: 'Error accediendo a la bd' });
 }
})
//app.listen(PORT, () => {
//  console.log(`Local en http://localhost:${PORT}`);
//});

export default app;