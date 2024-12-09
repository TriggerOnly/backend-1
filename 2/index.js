import express from 'express'
import ProductHistoryRouter from './routes/ProductHistory.router.js'
import RemainHistoryRouter from './routes/RemainHistory.router.js'

const PORT = process.env.PORT || 4010

const app = express()

app.use(express.json())

app.use('/productsHistory', ProductHistoryRouter)
app.use('/remainsHistory', RemainHistoryRouter)

app.listen(PORT, () => console.log('Server started'))