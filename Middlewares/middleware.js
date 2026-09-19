import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

  export const verifyToken = async (req, res, next) => {
 const authHeader = req.headers['authorization'];
 if (!authHeader) {
   return res.status(401).send({ error: 'No llegó ningún token en los headers' });
 }
 const token = authHeader.split(' ')[1];
 try {
   const payload = jwt.verify(token, secret);
   req.user_id = payload.id; // Modifica el req agregando el user id que viene en el token
   req.rol = payload.rol;
   next(); // Pasa al próximo middleware
 } catch (err) {
    console.error(err);
    res.status(401).send({ error: 'Unauthorized' });
 }
}


 export const verifyAdmin = async (req, res, next) => {
    if (req.rol != 'A') 
         res.status(403).send({ error: 'Forbidden action' }); // Ver 401 o 403
    else
        next();
    
}