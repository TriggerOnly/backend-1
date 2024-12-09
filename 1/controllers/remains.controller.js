import { log } from 'console'
import db from '../db.js'
import axios from 'axios'

class RemainController {
    async createRemain(req, res) {
        try {
            const {shop_id, product_id, quantity} = req.body
        
            if(!shop_id, !product_id, !quantity) {
                return res.json({
                    message: "Введите данные"
                })
            } 
        
            const newRemain = await db.query(`INSERT INTO remain (shop_id, product_id, quantity) values ($1, $2, $3) RETURNING *`, [shop_id, product_id, quantity])
 
            const id = newRemain.rows[0].id

            try {
                const sendDB2 = axios.post('http://localhost:4010/remainsHistory/changeRemain', {shop_id, product_id, id})
            } catch (error) {
                console.log(error)
            }

            res.json(newRemain.rows)
        } catch (error) { 
            console.log(error)
            res.status(404).json({
                message: "Ошибка при создании остатка"
        })
        }
    }

    async getAllRemains(req, res) {
        try {
            const remains = await db.query("SELECT * FROM remain")

            if (!remains || remains.length === 0) {
                return res.json({
                    message: "Остатки товаров не найдены"
                })
            }

            try {
                const message = 'getAllRemans'
                const sendDB2 = axios.post('http://localhost:4010/remainsHistory/getOneOrAll', {message})
            } catch (error) {
                console.log(error)
            }

            res.json(remains.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при получении всех остатков товаров"
            })
        }
    }

    async getOneRemain(req, res) {
        try {
            const id = req.params.id
            const remain = await db.query(`SELECT * FROM remain where id = $1`, [id])
            
            if(!remain || remain.rows.length === 0) {
                return res.json({
                    message: "Остаток товара не найден"
                })
            }

            const message = 'getOneRemain'

            try {
                const sendDB2 = axios.post('http://localhost:4010/remainsHistory/getOneOrAll', {message, id})
            } catch (error) {
                console.log(error)
            }
        
            res.json(remain.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при получении остатка товаров"
            })
        }
    }

    async changeQuantitiRemain(req, res) {
        try {
            const {id} = req.params
            const {count} = req.body            
            console.log(id);
            
            const RemainBD = await db.query(`SELECT * FROM remain where id = $1`, [id])

            console.log(RemainBD);
            

            const product_idBD = RemainBD.rows[0].product_id
            const shop_idDB = RemainBD.rows[0].shop_id

            const updateRemain = await db.query(`UPDATE remain set shop_id = $1, product_id = $2, quantity = $3 WHERE id = $4 RETURNING *`, [shop_idDB, product_idBD, count, id])

            let shop_id = updateRemain.rows[0].shop_id
            let product_id = updateRemain.rows[0].product_id

            try {
                const sendDB2 = axios.post('http://localhost:4010/remainsHistory/changeRemain', {shop_id, product_id})
            } catch (error) {
                console.log(error)
            }

            res.json(updateRemain.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Не удалось изменить число оставшихся товаров"
            })
        }
    }

    async updateRemain(req, res) {
        try {
            const id = req.params.id
            const {shop_id, product_id, quantity} = req.body
            
            if(!product_id, !quantity) {
                return res.json({
                    message: "укажите данные"
                })
            }

            const remain = await db.query('UPDATE remain set shop_id = $1, product_id = $2, quantity = $3 WHERE id = $4 RETURNING *', [shop_id, product_id, quantity, id])
        
            try {
                const sendDB2 = axios.post('http://localhost:4010/remainsHistory/changeRemain', {shop_id, product_id})
            } catch (error) {
                console.log(error)
            }

            res.json(remain.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при обновлении остатков товара"
            }) 
        }
    }

    async deleteRemain(req, res) {
        try {
            const id = req.params.id 
            
            try {
                const remain = await db.query(`SELECT * FROM remain where id = $1`, [id])
                 
                const sendDB2 = axios.post('http://localhost:4010/remainsHistory/delete', remain.rows[0])
            } catch (error) {
                console.log(error);
            }

            const remain = await db.query(`DELETE FROM remain where id = $1`, [id])

            res.json({message: "Удалён успешно"})
        } catch (error) {
            console.log(error); 
            res.status(404).json({ 
                message: "Ошибка при удалении остатков товара"
            })
        }
    }

    async getFilteredRemains(req, res) {
        try {
            const { shop_id, PLU, count_on_shelf, count_in_basket } = req.body;

            const parameters = [shop_id, PLU, count_on_shelf, count_in_basket];
            console.log(parameters);
            
            const providedParams = parameters.filter(param => param !== undefined);
    
            if (providedParams.length !== 1) {
                return res.status(400).json({
                    message: "Должен быть указан ровно один параметр: shop_id, PLU, count_on_shelf, count_in_basket"
                });
            }
            
            let filteredProducts;
            let parameter;
    
            if (shop_id) {
                parameter = shop_id
                filteredProducts = await db.query(`SELECT * FROM product WHERE shop_id = $1`, [shop_id]);
            } else if (PLU) {
                parameter = PLU
                filteredProducts = await db.query(`SELECT * FROM product WHERE PLU = $1`, [PLU]);
            } else if (count_on_shelf) {
                parameter = count_on_shelf
                filteredProducts = await db.query(`SELECT * FROM product WHERE count_on_shelf = $1`, [count_on_shelf]);
            } else if (count_in_basket) {
                parameter = count_in_basket
                filteredProducts = await db.query(`SELECT * FROM product WHERE count_in_basket = $1`, [count_in_basket]);
            }

            if (filteredProducts.rows.length === 0) {
                return res.status(404).json({
                    message: "Продукты не найдены"
                });
            }
    
            const ids = filteredProducts.rows.map(product => product.id);

            const filteredRemains = await Promise.all(
                ids.map(async id => {
                    const remains = await db.query(`SELECT * FROM remain WHERE product_id = $1`, [id]);
                    return remains.rows;
                })
            );

            try {
                const sendDB2 = axios.post('http://localhost:4010/remainsHistory/filter', {parameter})
            } catch (error) {
                console.log(error);
            }
    
            const flattenedRemains = filteredRemains.flat();
    
            return res.json(flattenedRemains);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Не удалось получить остатки товаров по параметру"
            });
        }
    }    
}

export default new RemainController() 