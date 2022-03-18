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

export async function findShortUrl(req, res){

const {shortUrl} = req.params;

const {rows: [foundUrl]} = await connection.query('SELECT * FROM urls WHERE urls."shortURL" = $1',[shortUrl]);

if(!foundUrl){
    res.status(404).send('item nao encontrado');
    return
}

res.status(200).send(foundUrl)

}

export async function deleteUrl(req, res){

    const {user: {id: userId}} = res.locals;
    const {id: urlId} = req.params;
    try{

        const {rows: [{userId: urlUserId}]} = await connection.query('SELECT "userId" FROM urls WHERE urls.id = $1',[urlId]);

        if(userId === urlUserId){
            await connection.query('DELETE FROM urls WHERE urls.id = $1', [urlId]);
            return
        }
        res.status(401).send('esta url não pertence a este usuário');

    }
    catch(error){
        res.status(500).send(error)
    }

}

