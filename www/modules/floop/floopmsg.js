define(["floop/floopsound"], function(fsound){
    let previewObj;
    let previewSound;

    let init = function(){
        emitter.addListener("hist_mouseover", (val,idx) => {
            show_message("beat: "+(idx * window.FRAME_SECS).toFixed(2) +" seconds");
            show_message(val + " sounds");
        });
        emitter.addListener("hist_mouseover", (pos,num) => {clear_messages()});
        emitter.addListener("hist_click", (pos,num) => {show_one("loading")});
        emitter.addListener("sounds_loaded", (pos,num) => {clear_messages()});
        emitter.addListener("node_mouseover", (snd) => {display_sound(snd)});
        emitter.addListener("node_mouseout", (snd) => {clear_messages()});
        emitter.addListener("graph_keydown", (snd) => {prelisten_start()});
        emitter.addListener("graph_keyup", (snd) => {prelisten_stop()});
        emitter.addListener('node_play', (sound) => {display_sound(gsounds[parseInt(sound.id)])});
    };

    let show_message = function(msg){
        $('#messages').append('<p>' + msg + '</p>')
    };

    let clear_messages = function(){
        $('#messages').empty();
    };

    let show_one = function(msg){
        clear_messages();
        show_message(msg);
    };

    let prelisten_start = function(){
      window.mainGain.gain.setValueAtTime(0.1,window.context.currentTime);
      previewSound = fsound.Sound();
      previewSound.load(previewObj['previews']['preview-hq-mp3'], (data) =>{
        previewSound.prelisten();
      });
    }

    let prelisten_stop = function(){
      window.mainGain.gain.setValueAtTime(1.0,window.context.currentTime);
      previewSound.stop();
    }

    let display_sound = function(snd){
        if (typeof snd == 'undefined') return;
        if (typeof snd['images'] == 'undefined') return;
        $('#messages').empty();
        $('#messages').append('<p><img src="' + snd['images']['spectral_m'] + '"></img></p>');
        $('#messages').append('<p><strong>' + snd['name'] + '</strong></p>');
        $('#messages').append('<p>by ' + snd['username'] + '</p> - ');
        for (let t in snd.tags){
            if(t<5)$('#messages').append('<p>'+snd['tags'][t]+'</p>');
        }
        previewObj = snd;
    };

    return {
        show_message:show_message,
        clear_message:clear_messages,
        init: init
    }
});
