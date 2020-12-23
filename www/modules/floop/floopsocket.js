define(function(){

    let users = [];
    let me;
    let socket;

    let login = function(event){
      let form = document.getElementById("loginform");
      socket.emit('login', form.nickname.value, form.password.value,
      (result) => {
        console.log(result);
        if(result == "OK") {
          document.getElementById("login").style.display = "none";
          me = form.nickname.value;
        }
        else {
          alert("error: " + result);
        }
      });
      return false;
    };

    let logged_users = function(usernames){
      console.log("logged "+usernames);
      users = usernames;
      display_users();
    }

    let user_color = function(str){
      let color = parseInt(360 * (str.charCodeAt(0) - 48) / 74);
      let hsl = "hsl(" + color + ", 50%, 50%)";
      return hsl;
    }

    let display_users = function(){
      let box = document.getElementById("users");
      let str = "";
      users.forEach((user) => {
        str +="<p style='color:" + user_color(user)+"'> " + user + "</p>";
      });
      box.innerHTML = str;
    }

    let node_click = function(snd, idx){
      socket.emit('play', snd, idx, me);
    }

    let init = function(){
        socket = io.connect();
        socket.on('message', (msg) => { console.log(msg)});
        socket.on('play', (data) => {
          let snd,idx,usr;
          [snd, idx, usr] = data;
          emitter.emitEvent('node_play',[snd, idx, user_color(usr)]);
        });
        socket.on("logged_users", logged_users);
        document.getElementById("loginform").onsubmit = login;
        emitter.addListener('node_click', node_click);
    };

    return {
        login:login,
        init: init
    }
});
