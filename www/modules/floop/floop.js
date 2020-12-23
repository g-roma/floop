define([
    "freesound/freesound",
    "ee/EventEmitter",
    "floop/floopserver",
    "floop/floophist",
    "floop/floopgraph",
     "floop/floopplayer",
     "floop/floopsound",
     "floop/floopsched",
     "floop/floopmsg",
     "floop/floopsocket"
],

function(freesound, EventEmitter, server, hist, graph, player, snd, sched, msg, socket){
    let fs_sounds = [];

    let init = function(){
            last_instance_id = 0;
            window.freesound = freesound;
            window.emitter= new EventEmitter();
            window.FRAME_SECS = 0.006;
            window.context = new AudioContext();
            window.mainGain = window.context.createGain();
            window.prelistenGain = window.context.createGain();
            window.mainGain.connect(window.context.destination);
            window.prelistenGain.connect(window.context.destination);
            document.querySelector('body').addEventListener('click', () => {
              window.context.resume().then(() => {
                console.log('audio context activated');
              });
            });
            server.get_token(init_all);
    };

    let init_all = function(token){
        freesound.setToken(token);
        server.init();
        hist.init();
        graph.init();
        player.init();
        server.get_hist();
        sched.init();
        msg.init();
        socket.init();
    }

    return {
        sounds : fs_sounds,
        init: init
    }
});
