const websuite = require("./config.json");
const fs = require('fs');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static('./public'));
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const rootDir = path.join(__dirname, "views");

const makePath = function(file) {
  return path.join(rootDir, file);
}

const getAccountFile = function(user) {
  return path.join(path.join(__dirname, "accounts"), `${user}.json`);
}

app.get('/', async (req, res) => {
  res.render(makePath("index"), { title: websuite.title, logo: websuite.logo })
});

app.post('/auth/login', async (req, res) => {
  const username = req.body.username || null;
  const password = req.body.password || null;
  if (username && password) {
    let file = getAccountFile(username);
    if (fs.exists(file)) {
      file = readAccound(file);
      if (password === file.password) {

      } else {
        // error mis match password
      } else {
        //error not found
      res.redirect(`/?error=${websuite.error.notfound}`)
      } else {
        //error missing data
        res.redirect(`/?error=${websuite.error.missing}`)
      }
    });

app.listen(process.env.PORT, () => {
  console.log("Fariya is online..!");
});