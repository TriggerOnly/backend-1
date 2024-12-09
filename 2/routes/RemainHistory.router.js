import express from 'express'
import RemainsHistoryController from '../controllers/RemainHistory.Controller.js'

const router = express.Router()

router.post('/changeRemain', RemainsHistoryController.createOrUpdateRemain)
router.post('/getOneOrAll', RemainsHistoryController.getAllOrOneRemain)
router.post('/delete', RemainsHistoryController.deleteRemain)
router.post('/filter', RemainsHistoryController.filterRemains)
router.get('/AllHistory', RemainsHistoryController.filterHistoryRemains)

export default router