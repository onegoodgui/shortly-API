import { connection } from "../database.js";

export async function verifyUrlExistence(req, res, next){

    const {url} = req.body;

    
    const {rows: urlObject} = await connection.query(`SELECT * FROM urls WHERE urls.url = $1`,[url])
    if(urlObject.length === 0){
        next()
    }
    else{
        res.sendStatus(401);
    }



}