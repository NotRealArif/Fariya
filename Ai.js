const websuite = require("./config.json");
const { checker } = require("./hookChecker.js");
const fs = require('fs');
const path = require('path'); 
const { base64encode, base64decode } = require('nodejs-base64');

async function AI(req, info, currentTime){
  // req { user, token, message}
  //info { socket, userisnfo}
  // response { message, ainame, date} 
  // encode file name https://www.base64encode.org
  const _file = req.message;
  const file = path.join(path.join(__dirname, "brain"), `${base64encode(_file.toLowerCase()).replace('/', '')}.json`);
  if (fs.existsSync(file)){
    const content = checker(JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }))["response"], info[req.token].info);
    info[req.token].socket.emit("msg", { message: content, ainame: websuite.ainame, date: currentTime })
  } else {
    info[req.token].socket.emit("msg", { message: websuite.error.ainotfound, ainame: websuite.ainame, date: currentTime })
  }
}

function dateFormat (date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}

module.exports = {
  Message: AI,
  currentTime: dateFormat
}