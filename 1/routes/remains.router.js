import express from 'express'
import remainController from '../controllers/remains.controller.js'

const router = express.Router()

router.post('/', remainController.createRemain)
router.get('/', remainController.getAllRemains)
router.get('/:id', remainController.getOneRemain)
router.put('/:id', remainController.updateRemain)
router.post('/:id', remainController.changeQuantitiRemain)
router.delete('/:id', remainController.deleteRemain)
router.get('/filters/one', remainController.getFilteredRemains)

export default router