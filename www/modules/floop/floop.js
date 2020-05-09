define([
    "freesound/freesound",
    "ee/EventEmitter",
    "floop/floopserver",
    "floop/floophist",
    "floop/floopgraph",
     "floop/floopplayer",
     "ae/ae",
     "ae/sched",
     "floop/floopmsg"
],

function(freesound,EventEmitter,server,hist,graph,player,ae,sched,msg){
    var fs_sounds=[];
    console.log(freesound);
    var init = function(){
            freesound.setToken('<freesoun_api_token');
            last_instance_id = 0;
            window.freesound = freesound;
            window.emitter= new EventEmitter();
            window.FRAME_SECS = 0.006;
            window.context = new AudioContext();
            window.context.createGain();
            document.querySelector('body').addEventListener('click', function() {
              window.context.resume().then(() => {
                console.log('audio context activated');
              });
            });
            server.init();
            hist.init();
            graph.init();
            player.init();
            server.get_hist();
            sched.init();
            msg.init();
    };

    return {
        sounds : fs_sounds,
        init: init
    }
});
