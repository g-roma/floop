define(function(){

    var show_message = function(msg){
        $('#messages').append('<p>'+msg+'</p>')
    };

    var clear_messages = function(){
        $('#messages').empty();
    };
    var show_one = function(msg){
        clear_messages();
        show_message(msg);
    };
    var display_sound = function(snd){
        if (typeof snd != 'undefined')return
        $('#messages').append('<p><img src="'+snd['spectral_m']+'"></img></p>');
        $('#messages').append('<p><strong>'+snd['original_filename']+'</strong></p>');
        $('#messages').append('<p>by ' + snd['user']['username'] + '</p> - ');
        for (var t in snd.tags){
            if(t<5)$('#messages').append('<p>'+snd['tags'][t]+'</p>');
        }


    };
    var init = function(){
        console.log("msg init");
        emitter.addListener("hist_mouseover",function(val,idx){
            show_message("beat: "+(idx*FRAME_SECS).toFixed(2) +" seconds");
            show_message(val+" sounds");
        });
        emitter.addListener("hist_mouseover",function(pos,num){clear_messages()});
        emitter.addListener("hist_click",function(pos,num){show_one("loading")});
        emitter.addListener("sounds_loaded",function(pos,num){clear_messages()});
        emitter.addListener("node_mouseover",function(snd){display_sound(snd)});
        emitter.addListener("node_mouseout",function(snd){clear_messages()});
    };

    return {
        show_message:show_message,
        clear_message:clear_messages,
        init: init
    }
});
