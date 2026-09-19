
import Router from 'express';

import {login, crearUsuario}  from '../Controllers/authController.js'

const router = Router()

router.post('/login',login);
router.post('/crearusuario',crearUsuario);

export default router;