import express from 'express'
import ProductsHistoryController from '../controllers/ProductsHistory.Controller.js'

const router = express.Router()

router.post('/changeProduct', ProductsHistoryController.createOrUpdateProduct)
router.post('/getOneOrAll', ProductsHistoryController.getAllOrOneProduct)
router.post('/delete', ProductsHistoryController.deleteProduct)
router.post('/filter', ProductsHistoryController.filterProducts)
router.get('/AllHistory', ProductsHistoryController.filterHistoryProducts)

export default router