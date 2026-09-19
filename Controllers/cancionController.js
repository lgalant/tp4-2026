  
import * as cancionService from '../Services/cancionService.js';
import {setUsuarioFan} from '../Services/authService.js'
 

  export async function  getCanciones (_, res) {
      try {
        const result = await cancionService.getCanciones()
        res.status(200).json({message:result.rows})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}

  export async function  getCancion (req, res) {
      const id = req.params.id;
      if(!id  )
        return res.status(400).json({message:"Tenes que enviar id!"})

      try {
        const result = await cancionService.getCancionById(id)
        res.status(200).json({message:result.rows[0]})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}


  export async function  insertCancion (req, res) {
      const cancion = req.body;
      if(!cancion.nombre  )
        return res.status(400).json({message:"Incluir todos los campos!"})

      try {
        const result = await cancionService.insertCancion(cancion.nombre) 
        res.status(201).json({message:"Cancion creada, id:" + result.rows[0].id})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}


  export async function  updateCancion (req, res) {
      const id = req.params.id;
      const cancion = req.body;
      if(!cancion.nombre  )
        return res.status(400).json({message:"Completar todos los campos!"})

      try {
        const result = await cancionService.updateCancion(id, cancion.nombre) 
        res.status(201).json({message:"Cancion modificada"})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}

  export async function  deleteCancion (req, res) {
      const id = req.params.id;

      try {
        const result = await cancionService.deleteCancion(id) 
        res.status(201).json({message:"Cancion borrada!"})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}

  export async function  getEscucho (req, res) {
      try {
        const result = await cancionService.getEscuchoByUser(req.user_id) 
        res.status(201).json({message: result.rows})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}


  export async function  setEscucho (req, res) {
      const cancion_id = req.params.id;
      try {
        const result = await cancionService.sumarEscucho(req.user_id, cancion_id) 
       
       const cant = await cancionService.getEscuchoCountByUser(req.user_id)
       if (cant.rows[0].cantidad >= 10) {
            const fan = await setUsuarioFan(req.user_id)
            console.log("usuario es fan")
       }
        res.status(201).json({message: result.rows})

      }
      catch (err) {
        console.log("Error:", err)
        return res.status(500).json({message: err.message})
      }
}
