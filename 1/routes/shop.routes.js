import express from 'express'
import shopController from '../controllers/shop.controller.js'

const router = express.Router()

router.post('/', shopController.createShop)
router.get('/', shopController.getAllShops)
router.get('/:id', shopController.getOneShop)
router.put('/:id', shopController.updateShop)
router.delete('/:id', shopController.deleteShop)

export default router