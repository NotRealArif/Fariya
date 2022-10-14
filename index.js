const websuite = require("./config.json");
const http = require('http');
const fs = require('fs');
const express = require("express");
const session = require('express-session');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const { Server } = require("socket.io");
const { Message, currentTime } = require("./Ai.js");
const { colour } = require("printly.js");

app.use(express.static('./public'));
app.use(session({ secret: websuite.sessionsecret, cookie: {} }));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
let users = [];
const server = http.createServer(app);
const io = new Server(server);

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
const current = function (){
  return currentTime(new Date (), "%Y-%m-%d %H:%M:%S", true);
}

// index
app.get('/', async (req, res) => {
  const error = req.query.error || "";
  if (req.session.login && req.session.user && req.session.token) {
    let file = getAccountFile(req.session.user);
    if (fs.existsSync(file)) {
      file = readAccound(file);
      if (req.session.token === file["user_token"]) {
        // load afte success login
        res.redirect('/auth/fariya')
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

//login
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
        req.session.save();
        res.redirect('/auth/fariya')
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

//dashboard
app.get('/auth/fariya', (req, res) => {
  if (req.session.login && req.session.user && req.session.token) {
    res.render(makePath('fariya'), { title: websuite.title, logo: websuite.logo, token: req.session.token, user: req.session.user });
  } else {
    res.redirect(`/?error=${websuite.error.notlogin}`);
  }
})

app.get('/auth/chat', (req, res) => {
  res.redirect("/");
});

// logout 
app.get('/auth/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// socket user connect

io.on('connection', (socket) => {
  socket.on('login', (data)=>{
    let file = getAccountFile(data.user);
    if (fs.existsSync(file)) {
      file = readAccound(file);
      if (data.token === file["user_token"]){
        users[data.token] = {socket: socket, info: file };
        console.log('a user connected');
      }else{
      socket.emit("msg", {message: websuite.error.tokenmismatch, ainame: websuite.ainame, date: current() })
      socket.disconnect();
    }
    }else{
      socket.emit("msg", {message: websuite.error.notfound, ainame: websuite.ainame, date: current() })
      socket.disconnect();
    }
  });
  socket.on('chat', (data)=>{
    Message(data, users, current());
  });
});


server.listen(process.env.PORT, () => {
  console.log(colour.greenBright("Fariya is online..!"));
});