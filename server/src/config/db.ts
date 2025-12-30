import dotenv from 'dotenv';
import {Client} from 'pg'

dotenv.config();


// Debug: Log what we're reading from .env
// console.log('DB Config:', {
//     password1 : process.env.DATABASE_PASSWORD,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD ? '***' + process.env.DATABASE_PASSWORD.slice(-4) : 'undefined',
//     database: process.env.DATABASE_NAME,
//     host: process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT
// });

const client = new Client({
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD, 
    database : process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),

});

const dbConnection = async() : Promise<Client> => {
    try{
        await client.connect();
        const result = await client.query(`SELECT NOW()`);
        console.log(`Connected to DB`)
        return client;
    }catch(error){  
        console.log(`Error Conneciong to DB`);
        throw error

    }
}
export {dbConnection,client} 





