const websuite = require("./config.json");
const fs = require('fs');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const { colour } = require("printly.js");

app.use(express.static('./public'));
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

const rootDir = path.join(__dirname, "views");

const makePath = function(file) {
  return path.join(rootDir, file);
}

const getAccountFile = function(user) {
  return path.join(path.join(__dirname, "accounts"), `${user}.json`);
}

const readAccound = function(file) {
  return JSON.parse(fs.readFile(file, { encoding: 'utf-8' }));
}

app.get('/', async (req, res) => {
  const error = req.query.error || "";
  res.render(makePath("index"), { title: websuite.title, logo: websuite.logo, error: error })
});

app.post('/auth/login', async (req, res) => {
  const username = req.body.username || null;
  const password = req.body.password || null;
  console.log(req);
  if (username && password) {
    let file = getAccountFile(username);
    if (fs.existsSync(file)) {
      file = readAccound(file);
      if (password === file.password) {
        res.status(200), json(file)
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

app.listen(process.env.PORT, () => {
  console.log(colour.greenBright("Fariya is online..!"));
});