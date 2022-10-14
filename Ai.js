const websuite = require("./config.json");


function AI(req, info, currentTime){
  // req { user, token, message}
  //info { socket, userinfo}
  // response { message, ainame, date} 
  //if 
  if(req.message === "hi" || "Hi" || "Hello" || "hello"){
    info[req.token].socket.emit("msg", { message: `Hello ${info[req.token].info.fullname}`, ainame: websuite.ainame, date: currentTime })
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