
$(document).ready(function() {
  var client = io();
  client.on('connect', (e) => {
    client.emit("login", {token: token, user: user});
  });
  client.on('msg', (e) => {
    sendMessage(e.message, e.ainame, e.date);
  });
  $(document).on('click', '#send_msg', function(){
    var msg = $('#chat_msg').val();
    if(msg == ""){
				alert('Please write message first');
		}else{
      client.emit('chat', {user: user, token: token, message: msg});
			$('#chat_msg').val("");
    }
  });
});

function sendMessage(message, ai_name, time){
  $('#chat_area').append('<div><img src="' + logo + '" style="height:30px; width:30px; position:relative; top:15px; left:10px;">' +
      '<span style="font-size:13px; position:relative; top:7px; left:15px;"><i><strong>' + ai_name + '</strong>: ' + message + '</i></span><br>' + 
      '<span style="font-size:11px; position:relative; top:-2px; left:50px;">' + time + '</span><br>' + 
      '</div><div style="height:5px;"></div>');
}
