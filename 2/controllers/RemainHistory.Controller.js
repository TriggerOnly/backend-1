import db2 from '../db2.js'

class RemainHistoryController {
    async createOrUpdateRemain(req, res) {
        try {
            const {shop_id, product_id, id} = req.body
        
            const date = Date.now();
            const dateObj = new Date(date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            if(!id) {
                const action = 'update' + ` ${product_id}`  
                const saveDB2 = await db2.query('INSERT INTO remainHistoryAction (shop_id, date, action) values ($1, $2, $3) RETURNING *', [shop_id, formattedDate, action])
            
                console.log(saveDB2.rows);

                return res.json(saveDB2)
            } 

            const action = 'create'
            const saveDB2 = await db2.query('INSERT INTO remainHistoryAction (shop_id, date, action) values ($1, $2, $3) RETURNING *', [shop_id, formattedDate, action])

            console.log(saveDB2.rows);

            res.json(saveDB2.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Не удалось зафиксировать историю создания/редактирования остатка"
            })
        }
    }

    async getAllOrOneRemain(req, res) {
        try {
            const {message, id} = req.body

            const date = Date.now();
            const dateObj = new Date(date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            if(id) {
                const action = `${message}` + ` ${id}`

                const saveDB2 = await db2.query('INSERT INTO remainHistoryAction (date, action) values ($1, $2) RETURNING *', [formattedDate, action])

                console.log(saveDB2.rows);

                res.json(saveDB2.rows)
            }
            if(!id) {
                const action = message 
                const saveDB2 = await db2.query('INSERT INTO remainHistoryAction (date, action) values ($1, $2) RETURNING *', [formattedDate, action])
            
                console.log(saveDB2.rows)

                return res.json(saveDB2)
            } 
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Не удалось зафиксировать историю поиска остатка"
            })
        }
    }

    async deleteRemain(req, res) {
        try {
            const remain = req.body
        
            const action = 'Delete' + ` ${remain.id}`

            const date = Date.now();
            const dateObj = new Date(date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            const saveDB2 = await db2.query('INSERT INTO remainHistoryAction (shop_id, date, action) values ($1, $2, $3) RETURNING *', [remain.shop_id, formattedDate, action])
            
            console.log(saveDB2.rows); 

            res.json(saveDB2.rows) 
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Не удалось зафиксировать историю удаления остатка"
            })
        }
    }

    async filterRemains(req, res) {
        try {
            const {parameter} = req.body            
        
            const action = 'Filter' + ` ${parameter}`

            const date = Date.now();
            const dateObj = new Date(date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            const saveDB2 = await db2.query('INSERT INTO remainHistoryAction (date, action) values ($1, $2) RETURNING *', [formattedDate, action])
            
            console.log(saveDB2.rows); 

            res.json(saveDB2.rows)
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Не удалось зафиксировать историю поиска по фильтрам продукта"
            })
        }
    }

    async filterHistoryRemains(req, res) {
        try {
            const parameter = req.body;
    
            if (parameter) {
                if (parameter.shop_id) {
                    const History = await db2.query(`SELECT * FROM remainHistoryAction WHERE shop_id = $1`, [parameter.shop_id]);
                    return res.json(History.rows); 
                }
                if (parameter.data) {
                    const History = await db2.query(`SELECT * FROM remainHistoryAction WHERE date = $1`, [parameter.data]);
                    return res.json(History.rows);
                }
                if (parameter.action) {
                    const History = await db2.query(`SELECT * FROM remainHistoryAction WHERE action = $1`, [parameter.action]);
                    return res.json(History.rows);
                }
            }
    
            const History = await db2.query(`SELECT * FROM remainHistoryAction`);
            res.json(History.rows); 
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Не удалось получить историю действий",
            });
        }
    }    
}

export default new RemainHistoryController()