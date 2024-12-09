import db from '../db.js'

class ShopController {
    async createShop(req, res) {
        try {
            const {name, address} = req.body
        
            if(!name || !address) {
                return res.json({
                    message: "Введите данные"
                })
            }
        
            const newShop = await db.query(`INSERT INTO shop (name, address) values ($1, $2) RETURNING *`, [name, address])
        
            res.json(newShop.rows)
        } catch (error) {
            console.log(error)
            res.status(404).json({
                message: "Ошибка при создании магазина"
        })
        }
    }

    async getAllShops(req, res) {
        try {
            const shops = await db.query("SELECT * FROM shop")

            if (!shops || shops.length === 0) {
                return res.json({
                    message: "Магазины не найдены"
                })
            }

            res.json(shops.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при получении всех магазинов"
            })
        }
    }

    async getOneShop(req, res) {
        try {
            const id = req.params.id
            const shop = await db.query(`SELECT * FROM shop where id = $1`, [id])
            
            if(!shop || shop.rows.length === 0) {
                return res.json({
                    message: "Магазин не найден"
                })
            }
        
            res.status(404).json(shop.rows)
        } catch (error) {
            console.log(error);
            res.json({
                message: "Ошибка при получении магазина"
            })
        }
    }

    async updateShop(req, res) {
        try {
            const {id} = req.params
            
            const {name, address} = req.body
            
            if(!name || !address) {
                return res.json({
                    message: "укажите магазин"
                })
            }

            const shop = await db.query('UPDATE shop set name = $1, address = $2 WHERE id = $3 RETURNING *', [name, address, id])
        
            res.json(shop.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при обновлении магазина"
            }) 
        }
    }

    async deleteShop(req, res) {
        try {
            const id = req.params.id
            const shop = await db.query(`DELETE FROM shop where id = $1`, [id])
        
            res.json(shop.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка при удалении магазина"
            })
        }
    }
}

export default new ShopController() 