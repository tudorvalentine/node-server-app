const { json } = require("express/lib/response");
const db = require("../db");
const cryp = require("../crypt/crypto");
const path = require("path")

class DBController {
  async createUser(req, res) {
    const { username, email, password } = req.body;
    const str = password + "";
    if (str.length < 8) {
      res.json({
        error: true,
        error_msg: "Parola scurta < 8"
      });
      return;
    }
    const hashPass = cryp.encrypt(password);
    await db.query(
      `INSERT INTO users (username,email,password) values ($1,$2,$3) RETURNING *`,
      [username, email, hashPass],
      (error, result) => {
        if (error) {
          console.log({ 
            action: "register",
            errorJSON : error
          })
          if (error.code == 23505) {
            res.json({
              error: true,
              error_msg: "Utilizator cu astfel de date deja există",
            });
          }
        } else {
          console.log({
            action: "register",
            id_user : result.rows[0].id_user,
            username : result.rows[0].username,
            email : result.rows[0].email
          })
          res.json({
            error: false,
            id_user: result.rows[0].id_user,
            username: result.rows[0].username,
            email: result.rows[0].email,
          });
        }
      }
    );
  }
  async login(req, res) {
    const {id , email, password } = req.body;
    console.log({
      action: "login",
      id_client : id,
      email: email,
      pass: password
    });

    let flag = false;
    let id_u,userN,mail
    const user = await db.query(
      `SELECT * FROM USERS WHERE email = $1`,
      [email],
      (error, result) => {
        if (error) {
          console.log({ 
            action: "login",
            errorJSON : error
        })
        } else if (result.rowCount) {
          console.log({
            action: "login",
            id_user : result.rows[0].id_user,
            username : result.rows[0].username,
            email : result.rows[0].email
          }
          );
          const encryptedPass = result.rows[0].password;
          const decryptedPass = cryp.decrypt(encryptedPass);
          if (decryptedPass == password) {
            id_u = result.rows[0].id_user
            userN = result.rows[0].username
            mail = result.rows[0].email
            flag = true
          } else res.json({ error: true, error_msg: "Parola incorecta" });
        } else res.json({ error: true, error_msg: "Date incorecte" });
      }
    )

    await db.query(`select image_conspect.id_assoc, image_conspect.image_path,image_conspect.conspect_path 
    from users
    inner join image_conspect on users.id_user = image_conspect.id_user 
    where users.email = $1`,[email],(err,result)=>{
      if (err) {
        res.json({
          error : true,
          error_msg : "Error get path of source"
        })
      }else{
        if(flag){
          const userAuth = {
            error: !flag,
            id_user: id_u,
            username: userN,
            email: mail,
            association : result.rows
          }
          res.json(userAuth);
        }
      }
    })
  }

  async displayUsers(req, res) {
    const user = await db.query("SELECT * FROM users");
    res.json({
      id : 345,
      assoc : user.rows
    })
  }

  async displayUser(req, res) {
    const id = req.params.id;
    const user = await db.query(`SELECT * FROM users where id_user = $1`, [id]);
    res.json(cryp.decrypt(user.rows[0].password));
  }
  async displayPath(req, res){
    const id = req.params.id
    const pathImage = path.join(path.dirname(__dirname), 'image/db.jpg')
    const pathConsp = path.join(path.dirname(__dirname), 'conspect/db.pdf')
    console.log(pathImage)
    console.log(pathConsp)
    const assoc = await db.query(`insert into image_conspect (image_path,conspect_path,id_user) values ($1,$2,$3)`,[pathImage,pathConsp,id], (error, result) =>{
      if (error) {
        res.json({
          err:"error",
          msg : "Nu s-a primit"
        })
      }else{
        res.json(result)
      }
    })
  }
  getImage(req, res){
      const nameimage = req.params.nameimage
      console.log(nameimage)
      const pathImage = path.join(path.dirname(__dirname), 'images/',nameimage)
      console.log(pathImage)
      res.download(pathImage,nameimage)
  }
}

module.exports = new DBController();
