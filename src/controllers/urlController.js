import { connection } from "../database.js";
import {v4 as uuid} from "uuid";


export async function generateShortUrl(req, res){

    const {user: {id: userId}} = res.locals;
    const {url} = req.body;
    try{

    
        let shortUrl = uuid();
        [shortUrl] = shortUrl.split('-', 1);
    
        await connection.query(`INSERT INTO urls (url, "shortURL", "userId") VALUES ($1, $2, $3)`,[url, shortUrl, userId])
    
        res.status(201).send({shortUrl})
    }
    catch(error){
        res.status(500).send(error)
    }
}

