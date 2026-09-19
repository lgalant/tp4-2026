import Router from 'express';
import { verifyAdmin, verifyToken } from '../Middlewares/middleware.js';
import * as cancionController from '../Controllers/cancionController.js'

const router = Router()

router.get('/escucho/', verifyToken, cancionController.getEscucho)
router.post('/escucho/:id', verifyToken, cancionController.setEscucho)
router.get('/:id',verifyToken, cancionController.getCancion)
router.get('/',verifyToken, cancionController.getCanciones)
router.put('/:id',verifyToken,verifyAdmin, cancionController.updateCancion)
router.post('/',verifyToken,verifyAdmin, cancionController.insertCancion)
router.delete('/:id',verifyToken,verifyAdmin, cancionController.deleteCancion)


export default router;