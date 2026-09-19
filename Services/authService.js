import pkg from 'pg'
import dbconfig from '../dbconfig.js'


// Postgres Pool en vez de client, no necesita connect ni end
const {Pool} = pkg;
const pool = new Pool(dbconfig)


export async function insertUsuario(username, nombre, pwd) {
    return await pool.query("insert into usuario(username, nombre, password) values ($1,$2,$3) returning id",
      [username, nombre,pwd])
}

export async function getUsuarioByUsername(username) {
    return await pool.query("select id, password, rol from usuario where username = $1",[username]);  
}


export async function setUsuarioFan(user_id) {
    return await pool.query("update usuario set fan = true where id = $1 and fan=false",[user_id])
}