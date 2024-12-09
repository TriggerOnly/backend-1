import axios from 'axios'
import db from '../db.js'

class ProductController {
    async createProduct(req, res) {
        try {
            const {shop_id, PLU, name, count_on_shelf, count_in_basket} = req.body
        
            if(!shop_id || !PLU || !name || !count_on_shelf || !count_in_basket) {
                return res.json({
                    message: "Введите данные"
                }) 
            }
        
            const newProduct = await db.query(`INSERT INTO product (shop_id, PLU, name, count_on_shelf, count_in_basket) values ($1, $2, $3, $4, $5) RETURNING *`, [shop_id, PLU, name, count_on_shelf, count_in_basket])
        
            const id = newProduct.rows[0].id

            try {
                const sendDB2 = axios.post('http://localhost:4010/productsHistory/changeProduct', {shop_id, PLU, id})
            } catch (error) {
                console.log(error)
            }

            res.json(newProduct.rows[0])
        } catch (error) {
            console.log(error)
            res.status(404).json({
                message: "Ошибка при создании товара"
        })
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await db.query("SELECT * FROM product")

            if (!products || products.length === 0) {
                return res.json({
                    message: "Товары не найдены"
                })
            }

            try {
                const message = 'getAllProducts'
                const sendDB2 = axios.post('http://localhost:4010/productsHistory/getOneOrAll', {message})
            } catch (error) {
                console.log(error);
            }

            res.json(products.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при получении всех товаров"
            })
        }
    }

    async getOneProduct(req, res) {
        try {
            const id = req.params.id
            const product = await db.query(`SELECT * FROM product where id = $1`, [id])
            
            if(!product || product.rows.length === 0) {
                return res.json({
                    message: "Продукт не найден"
                })
            }

            const message = 'getOneProduct'

            try {
                const sendDB2 = axios.post('http://localhost:4010/productsHistory/getOneOrAll', {message, id})
            } catch (error) { 
                console.log(error)
            }
          
            res.json(product.rows)  
        } catch (error) { 
            console.log(error);
            res.status(404).json({
                message: "Ошибка при получении продукта"
            })
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.id
            const {shop_id, PLU, name, count_on_shelf, count_in_basket} = req.body
            
            if(!id, !shop_id || !PLU || !name || !count_on_shelf || !count_in_basket) {
                return res.json({
                    message: "Введите данные"
                })
            }

            const product = await db.query('UPDATE product set shop_id = $1, PLU = $2, name = $3, count_on_shelf = $4, count_in_basket = $5 WHERE id = $6 RETURNING *', [shop_id, PLU, name, count_on_shelf, count_in_basket, id])
        
            try {
                const sendDB2 = axios.post('http://localhost:4010/productsHistory/changeProduct', {shop_id, PLU})
            } catch (error) {
                console.log(error);
            }

            res.json(product.rows[0])
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при обновлении товара"
            }) 
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = req.params.id
        
            try {
                const product = await db.query(`SELECT * FROM product where id = $1`, [id])
                 
                const sendDB2 = axios.post('http://localhost:4010/productsHistory/delete', product.rows[0])
            } catch (error) {
                console.log(error);
            }

            const product = await db.query(`DELETE FROM product where id = $1`, [id])

            res.json({message: "Удалён успешно"})
        } catch (error) {
            console.log(error); 
            res.status(404).json({
                message: "Ошибка при удалении товара"
            })
        }
    }

    async getFilteredProducts(req, res) {
        try {
            const parameter = req.params.parameter;            
    
            if (!parameter) {
                return res.status(403).json({
                    message: "Укажите фильтр"
                });
            }
    
            const isOnlyNumber = (param) => {
                return /^[0-9]+$/.test(param); 
            };
    
            let filteredProducts;
    
            if (isOnlyNumber(parameter)) {
                filteredProducts = await db.query(`SELECT * FROM product WHERE PLU = $1`, [parameter]);
            } else {
                filteredProducts = await db.query(`SELECT * FROM product WHERE name = $1`, [parameter]);
            }

            try {
                const sendDB2 = axios.post('http://localhost:4010/productsHistory/filter', {parameter})
            } catch (error) {
                console.log(error);
            }
    
            return res.json(filteredProducts.rows);
        } catch (error) {
            console.error(error);
            res.status(404).json({
                message: "Не удалось получить товары по фильтрам"
            });
        }
    }    
}

export default new ProductController() 