const express = require("express");
const app = express();
const fs = require("fs");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
  user: "sql12601138",
  host: "sql12.freesqldatabase.com",
  password: "AiHL48qziC",
  database: "sql12601138",
  port: 3306,
});

function genCookie(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function isTextValid(str) {
  return /^[a-zA-Z0-9_-]+$/.test(str);
}

function encryptText(plainText) {
  return crypto.publicEncrypt(
    {
      key: fs.readFileSync("public_key.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer
    Buffer.from(plainText)
  );
}

function decryptText(encryptedText) {
  return crypto.privateDecrypt(
    {
      key: fs.readFileSync("private_key.pem", "utf8"),
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedText
  );
}

app.get("/getpublickey", (req, res) => {
  const publicKey = fs.readFileSync("./Encryption/public_key.pem", 'utf8');
  res.type('text/plain').send(publicKey);
});

app.post("/addAccount", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const retypePassword = req.body.retypePassword;

  let usernameTaken = false; // flag to indicate if username is taken

  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      result.forEach((element) => {
        if (element.username == username) {
          usernameTaken = true; // set flag to true if username is taken
        }
      });

      let valid = isTextValid(username);

      if (usernameTaken) {
        // send error response if username is taken
        res.send(JSON.stringify([{ error: "Username already used" }]));
      } else if (username.length < 3) {
        res.send(
          JSON.stringify([{ error: "Username cannot be smaller than 3" }])
        );
      } else if (email.length < 3) {
        res.send(JSON.stringify([{ error: "email is smaller than 3" }]));
      } else if (retypePassword != password) {
        res.send(
          JSON.stringify([{ error: "RetypePassword not same as Password" }])
        );
      } else if (password.length < 3) {
        res.send(
          JSON.stringify([{ error: "Password cannot be smaller than 3" }])
        );
      } else if (valid == false) {
        res.send(
          JSON.stringify([
            {
              error:
                "Username not contain space and Only contain a-z A-Z 0-9 -_",
            },
          ])
        );
      } else {
        db.query(
          "INSERT INTO users (username, password, email) VALUES(?,?,?)",
          [username, encryptText(password), email],
          (error, _result) => {
            if (error) {
              console.log(error);
            } else {
              res.send(JSON.stringify([{ log: "Success" }]));
            }
          }
        );
      }
    }
  });
});

app.post("/Login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let cookie = "";
  let cookieUserId;
  let correct = false;

  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      result.forEach((element) => {
        if (element.username == username) {
          if (element.password == decryptText(password)) {
            correct = true;
            cookieUserId = element.id;
            cookie = genCookie(20);
          }
        }
      });

      if (correct == true) {
        db.query(
          "INSERT INTO cookies (cookie, userId) VALUES(?,?)",
          [cookie, cookieUserId],
          (error, _result) => {
            if (error) {
              console.log(error);
            } else {
              res.send(
                JSON.stringify([
                  { log: "Login Success", pro: "Login", cookie: cookie },
                ])
              );
            }
          }
        );
      } else {
        res.send(JSON.stringify([{ error: "Somthing Went wrong" }]));
      }
    }
  });
});

app.post("/LoginOrNot", (req, res) => {
  const cookie = req.body.cookie;
  db.query("SELECT * FROM cookies", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let foundCookie = false;

      result.forEach((element) => {
        if (element.cookie == cookie) {
          foundCookie = true;
        }
      });

      if (foundCookie) {
        res.send(JSON.stringify([{ pro: "Login" }]));
      } else if (cookie != null) {
        res.send(JSON.stringify([{ pro: "invalidcookie" }]));
      } else {
        res.send(JSON.stringify([{ pro: "Not" }]));
      }
    }
  });
});

app.post("/getUserData", (req, res) => {
  const cookie = req.body.cookie;
  db.query("SELECT * FROM cookies", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let foundCookie = false;

      result.forEach((element) => {
        if (element.cookie == cookie) {
          foundCookie = true;
          db.query(
            "SELECT * FROM users WHERE id = ?",
            element.userId,
            (err, result) => {
              if (err) {
                res.send(JSON.stringify([{ error: err }]));
              } else {
                res.send(
                  JSON.stringify([
                    {
                      pro: "Ok",
                      username: result[0].username,
                      email: result[0].email,
                    },
                  ])
                );
              }
            }
          );
        }
      });

      if (cookie != null && foundCookie == false) {
        res.send(JSON.stringify([{ pro: "invalidcookie" }]));
      } else if (foundCookie == false) {
        res.send(JSON.stringify([{ pro: "Not" }]));
      }
    }
  });
});

app.post("/Logout", (req, res) => {
  const cookie = req.body.cookie;
  db.query("SELECT * FROM cookies", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      result.forEach((element) => {
        if (element.cookie == cookie) {
          db.query(
            "DELETE FROM cookies WHERE id = ?",
            element.id,
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        }
      });
    }
  });
});

app.post("/addItems", (req, res) => {
  const cookie = req.body.cookie;
  db.query("SELECT * FROM cookies", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let foundCookie = false;

      result.forEach((element) => {
        if (element.cookie == cookie) {
          foundCookie = true;
          db.query(
            "UPDATE users SET Items = ? WHERE id = ?;",
            [ req.body.json, element.userId ],
            (err, result) => {
              if (err) {
                console.log(JSON.stringify(JSON.parse(req.body.json)))
                res.send(JSON.stringify([{ error: err }]));
              } else {
                res.send(result)
              }
            }
          );
        }
      });

      if (cookie != null && foundCookie == false) {
        res.send(JSON.stringify([{ pro: "invalidcookie" }]));
      } else if (foundCookie == false) {
        res.send(JSON.stringify([{ pro: "Not" }]));
      }
    }
  });
});

app.listen(5000, () => {
  console.log("HTTPS server listening on port 5000");
});

module.exports = app