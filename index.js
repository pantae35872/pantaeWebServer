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

const privateKey = `
-----BEGIN PRIVATE KEY-----
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
W2Uh6DDZOE4kDbI50Jwsw63GClUr6tk=
-----END PRIVATE KEY-----
`

const public_key = `
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqjDW/FXELahhrRHrpslh
GCiWST1ezR8Zpnnw439T/1Wtv5TxNjFVopKqt7SxTOWSfVTs4u9puM+Zy2uo/GYB
OnKMgQctylwGbqoLbyli5ck8jqmY8ZFM15Jgb8S1YwZRneekoPU+6mzes+Ne4Be+
Y9WCejIttwaOaAGO7jS23nHbSz+WdxzonLSxIfvrruUzgKCUqfQB3+jKKlxiEiLa
erXWf/5E64ZPE1T18wY9/ORw/kk0ewKRSCH8FvInV/+ttEPwfReqYRyiXjvV3eaO
J1jEUolzGgmQwTPKejGHViv25saprs9vmrzqTAw/RPzbshb30CtRbytNSLs0f2uO
tQ3WIpTz4bqCAPtRXNOBz2wVhtM5w7emnnGBnxMF4gsQN7V07+WVY3XyJAj8HZYH
WmOX1upxFlieCV0yVt8l2Yp6CepJ/TDlr96OZnkeI5+Lr5AmLwot2qpHcr+gKMiy
BlnOw38xovIMLVgkOBQro1yM3jb+4iLp6uXrEWH4a5nV8BlHc3C8oRNEcm3dCvxc
SpTxr6Qi/cin+xk5lfrDgxxJI/YUVXX4Jc9nmVJPEjRbTBvz69Uz3xyzCQr5RMf5
eKzwDLv2YdfVBbqd8xexl4souwjwLMnfmeSH8cox2UTYevgk3xEpsh58gMx1RKxQ
gO7ef+wGgYqWe6B/3XrSd40CAwEAAQ==
-----END PUBLIC KEY-----

`;

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
      key: public_key,
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
      key: privateKey,
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
          [username, encryptText(password).toString('base64'), email],
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
          const encryptedBuffer = Buffer.from(element.password, 'base64');
          const decryptedText = decryptText(encryptedBuffer)
          if (decryptedText.toString() == password) {
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