
const getHook = function(t){
  if(t.includes("{")){
    let _data = t.substr(t.indexOf('{') +1, t.length );
      _data = _data.substr(0, _data.indexOf('}'))
    return _data;
  }else{
    return null;
  }
}
const setHookValue = function (txt, name, value){
  return txt.replace(`{${name}}`, value);
}

function hooks(content, userdata){
  const hook = getHook(content);
  if(hook){
    return setHookValue(content, hook, userdata[hook])
  }
  return content;
}


module.exports = {
  checker: hooks
}