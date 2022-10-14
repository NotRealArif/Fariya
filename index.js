const websuite = require("./config.json");
const fs = require('fs');
const express = require("express");
const session = require('express-session');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const { colour } = require("printly.js");

app.use(express.static('./public'));
app.use(session({ secret: websuite.sessionsecret }));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const rootDir = path.join(__dirname, "views");

const makePath = function(file) {
  return path.join(rootDir, file);
}

const getAccountFile = function(user) {
  return path.join(path.join(__dirname, "accounts"), `${user}.json`);
}

const readAccound = function(file) {
  return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
}

app.get('/', async (req, res) => {
  const error = req.query.error || "";
  console.log(req.session.login)
  if (req.session.login && req.session.user && req.session.token) {
    let file = getAccountFile(req.session.user);
    if (fs.existsSync(file)) {
      file = readAccound(file);
      if (req.session.token === file["user_token"]) {
        // load afte success login
        req.session.login = true;
        req.session.user = username;
        req.session.token = file["user_token"];
        res.status(200).json(file)
      } else {
        req.session.destroy();
        res.redirect(`/?error=${websuite.error.tokenmismatch}`)
      }
    } else {
      res.redirect(`/?error=${websuite.error.notfound}`)
    }
  } else {
    req.session.destroy();
    res.render(makePath("index"), { title: websuite.title, logo: websuite.logo, error: error })
  }
});

app.get('/auth/login', (req, res) => {
  res.redirect('/');
});

app.post('/auth/login', async (req, res) => {
  const username = req.body.username || null;
  const password = req.body.password || null;
  if (username && password) {
    let file = getAccountFile(username);
    if (fs.existsSync(file)) {
      file = readAccound(file);
      if (password === file.password) {
        // load afte success login
        req.session.login = true;
        req.session.user = username;
        req.session.token = file["user_token"];
        res.status(200).json(file)
      } else {
        // error mis match password
        res.redirect(`/?error=${websuite.error.passnotmatch}`)
      }
    } else {
      //error not found
      res.redirect(`/?error=${websuite.error.notfound}`)
    }
  } else {
    //error missing data
    res.redirect(`/?error=${websuite.error.missing}`)
  }
});

app.get('/auth/logout', async (req, res) => {
  if (req.session.login && req.session.user && req.session.token) {
    req.session.destroy();
    res.redirect('/');
  } else {
    res.redirect(`/?error=${websuite.error.notlogin}`)
  }
});

app.listen(process.env.PORT, () => {
  console.log(colour.greenBright("Fariya is online..!"));
});