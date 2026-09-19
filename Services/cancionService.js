import pkg from 'pg'
import dbconfig from '../dbconfig.js'


// Postgres Pool en vez de client, no necesita connect ni end
const {Pool} = pkg;
const pool = new Pool(dbconfig)


export async function getCancionById(id) {
    return await pool.query("select * from cancion where id = $1",[id])
}

export async function getCanciones(id) {
    return await pool.query("select * from cancion",[id])
}

export async function insertCancion(nombre) {
    return await pool.query("insert into cancion(nombre) values ($1) returning id ",[nombre]);  
}

export async function updateCancion(id,nombre) {
    return await pool.query("update cancion set nombre=$1 where id=$2 ",[nombre,id]);  
}

export async function deleteCancion(id) {
    return await pool.query("delete from cancion where id=$1",[id]);  
}

export async function getEscuchoByUser(user_id) {
    return await pool.query("select c.id, c.nombre, e.reproducciones from escucha e inner join cancion c on e.cancion_id = c.id where usuario_id = $1",[user_id])
}

export async function getEscuchoCountByUser(user_id) {
    return await pool.query("select sum(reproducciones) as cantidad from escucha where usuario_id = $1",[user_id])
}

export async function sumarEscucho(user_id, cancion_id) {
    try {
        const escucho = await pool.query("select * from escucha where usuario_id = $1 and cancion_id = $2",[user_id, cancion_id])
        if (escucho && escucho.rows[0]) {
            return await pool.query("update escucha  set reproducciones = reproducciones + 1 where usuario_id = $1 and cancion_id = $2",[user_id, cancion_id])
        }
        else {
           return await pool.query("insert into escucha(usuario_id, cancion_id, reproducciones) values ($1, $2, 1)",[user_id, cancion_id])
        }
    } catch (error) {
        console.log ("sumarEscucho, error accediendo a la BD")
        throw error
    }   

    }
    

 