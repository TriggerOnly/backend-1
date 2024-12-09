import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
    user: 'postgres',
    password: 'TheTrigger1911',
    host: 'localhost',
    port: 4040,
    database: "db" 
})

export default pool
