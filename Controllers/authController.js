  
  import { insertUsuario,getUsuarioByUsername } from '../Services/authService.js';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';

  const secret = process.env.JWT_SECRET;

  export async function  crearUsuario (req, res) {
      const user = req.body;
      if(!user.username || !user.nombre || !user.password  )
        return res.status(400).json({message:"Debes completar todos los campos"})

      const hashedPwd = await bcrypt.hash(user.password,10);

      try {
        const result = await insertUsuario(user.username, user.nombre, hashedPwd)
        console.log("result.rows", result.rows)
          res.status(201).json({message:"Usuario creado!, id:" + result.rows[0].id})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}

export async function login(req, res) {

  const user = req.body;
  if(!user.username|| !user.password  )
    return res.status(400).json({message:"Debes completar todos los campos"})

  try {
    const result = await getUsuarioByUsername(user.username)
    if (result.rowCount == 0)
      return res.status(400).json({message:"Usuario inexistente o clave incorrecta"})

    const dbUser = result.rows[0];
    //console.log("db user", dbUser)
    const passOK = await bcrypt.compare(user.password, dbUser.password)
    if (!passOK) {
      return res.status(400).json({message:"Usuario inexistente o clave incorrecta"})
    }

    const payload = {
      id: dbUser.id,
      rol: dbUser.rol
    }

    const token = jwt.sign(payload, secret, {expiresIn:'1h'})
    return res.status(200).json({token})
  }
  catch (err) {
    console.log("Error:", err)
    return res.status(500).json({message: err.message})
  }
  
}