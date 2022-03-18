import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}


export async function getUser(req, res) {
  const { user } = res.locals;
  const {id: userId} = req.params;

  try {

    if(!userId){
      res.send(user);
      return
    }

    const {rows: [userObject]} = await connection.query(
      `SELECT users.id, users.name, SUM(urls."visitCount") as "visitCount"
       FROM users
       JOIN urls ON urls."userId" = users.id
       WHERE users.id = $1
       GROUP BY users.id`
      , [userId])
    console.log(userObject);

    if(!userObject){
      res.sendStatus(404)
    }

    const {rows: [...shortenedUrls]} = await connection.query(
      `SELECT id, "shortURL", url, "visitCount"
       FROM urls
       WHERE urls."userId" = $1`
      ,[userId])


    res.status(200).send({...userObject, shortenedUrls})

  } catch (error) {

    console.log(error);
    return res.sendStatus(500);
  }
}


export async function usersRanking(req, res){

  console.log('oi')
  try{

    const {rows: [...rankingsArray]} = await connection.query(
      `SELECT users.id, users.name, COUNT(urls."userId") AS "linksCount", SUM(urls."visitCount") AS "visitCount"
       FROM users
       JOIN urls ON urls."userId" = users.id
       GROUP BY users.id
       ORDER BY "visitCount" DESC`
    )

    const {rows: [...unrankedsArray]} = await connection.query(
      `SELECT users.id, users.name, '0' AS "linksCount", '0' AS "visitCount" FROM users WHERE users.id NOT IN (SELECT urls."userId" FROM urls);
    
    `)

    // console.log(rankingsArray)
    res.send([...rankingsArray, ...unrankedsArray])
  }
  catch(error){

    res.status(500).send(error)

  }

}