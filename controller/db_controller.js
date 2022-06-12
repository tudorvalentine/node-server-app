const { json } = require("express/lib/response");
const db = require("../db");
const cryp = require("../crypt/crypto");

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
    const { email, password } = req.body;
    console.log({
      action: "login",
      email: email,
      pass: password
    });
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
            const userAuth = {
              error: false,
              id_user: result.rows[0].id_user,
              username: result.rows[0].username,
              email: result.rows[0].email,
            };
            res.json(userAuth);
          } else res.json({ error: true, error_msg: "Parola incorecta" });
        } else res.json({ error: true, error_msg: "Date incorecte" });
      }
    );
  }

  async displayUsers(req, res) {
    const user = await db.query("SELECT * FROM users");
    res.json(user.rows);
  }

  async displayUser(req, res) {
    const id = req.params.id;
    const user = await db.query(`SELECT * FROM users where id_user = $1`, [id]);
    res.json(cryp.decrypt(user.rows[0].password));
  }

  main(req , res){
    res.send('<h2>It is my server for Android Application (Augmented Image)</h2>');
  }
}

module.exports = new DBController();
