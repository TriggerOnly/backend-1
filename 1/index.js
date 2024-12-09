import express from 'express'
import shopRouter from './routes/shop.routes.js'
import productRouter from './routes/product.router.js'
import remainRouter from './routes/remains.router.js' 

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use('/shop', shopRouter)
app.use('/product', productRouter)
app.use('/remain', remainRouter)

app.listen(PORT, () => console.log('Server started'))