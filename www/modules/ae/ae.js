//var ae = function(){
define(function(){

    var new_sound = function(){
        var buf;
        var source;
        var num_periods=0;
        var effective_duration = 0;
        var last_time_started=0;
        var states = {
            UNINITIALIZED:0,
            LOADING:1,
            DECODING:2,
            READY:3,
            // playing states : playing paused stopped
            STOPPED:0,
            PLAYING:1,
            PAUSED:0
        };
        var sate = states.UNINITIALIZED;
        var get_effective_duration = function(period){ // period in seconds
            if(num_periods<=0){
                num_periods=parseInt(buf.duration/period);
                var err_too_long = buf.duration%period;
                var err_too_short = period - err_too_long;
                if (err_too_short<err_too_long)num_periods++;
            }
            this.effective_duration = num_periods*period;
            return this.effective_duration;
        }

        var load = function(url,onloaded){
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = function(){decode(request.response,onloaded)};
            request.send();
            sate = states.LOADING;
        };

        var decode = function(response,onloaded){
            window.context.decodeAudioData(
                    response, function(buffer){
                    buf = buffer;
                    console.log(buf);
                    sate = states.READY;
                    onloaded(buf);
            });
           sate = states.DECODING;
        };
        var play = function(loop,time,offset,dur){
            //var p = get_num_periods(currentPeriod*FRAME_SECS);
            console.log("play!!!!");

            console.log(currentPeriod);
            console.log(effective_duration);
            console.log(num_periods);

            source = context.createBufferSource();
            source.buffer = buf;
            source.connect(context.destination);
            source.loop = loop?loop:false;
            console.log(source);
            //source.noteGrainOn(0,offset?offset:0,dur?dur:buf.duration);
            //source.start(time,offset?offset:0,dur?dur:this.effective_duration);
            source.start(0);

            this.last_time_started = time;
        }
        var stop = function(){
            console.log(source);
            source.stop(0);

        }

        return { load:load ,
                 play:play,
                 stop:stop,
                 get_effective_duration:get_effective_duration,
                 effective_duration:effective_duration,
                 last_time_started:last_time_started
             }
    }
    return {
        Sound: new_sound
    }
});
