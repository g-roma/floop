define(function(){
    let new_sound = function(){
        let buf;
        let source;
        let num_periods = 0;
        let effective_duration = 0;
        let last_time_started = 0;
        let states = {
            UNINITIALIZED:0,
            LOADING:1,
            DECODING:2,
            READY:3,
            // playing states : playing paused stopped
            STOPPED:0,
            PLAYING:1,
            PAUSED:0
        };
        let sate = states.UNINITIALIZED;
        let get_effective_duration = function(period){ // period in seconds
            if(num_periods <= 0){
                num_periods = parseInt(buf.duration / period);
                let err_too_long = buf.duration % period;
                let err_too_short = period - err_too_long;
                if (err_too_short<err_too_long) num_periods++;
            }
            this.effective_duration = num_periods * period;
            return this.effective_duration;
        }

        let load = function(url, onloaded){
            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = function(){ decode(request.response,onloaded) };
            request.send();
            sate = states.LOADING;
        };

        let decode = function(response, onloaded){
            window.context.decodeAudioData(
                    response, (buffer) => {
                    buf = buffer;
                    console.log(buf);
                    sate = states.READY;
                    onloaded(buf);
            });
           sate = states.DECODING;
        };

        let play = function(loop, time, offset, dur){
            source = context.createBufferSource();
            source.buffer = buf;
            source.connect(window.mainGain);
            source.loop = loop? loop : false;
            source.start(0);
            this.last_time_started = time;
        }

        let prelisten = function(loop){
            source = context.createBufferSource();
            source.buffer = buf;
            source.connect(window.prelistenGain);
            source.loop = loop?loop:false;
            source.start(0);
        }

        let stop = function(){
            console.log(source);
            if(source)source.stop(0);
        }

        return { load:load,
                 play:play,
                 stop:stop,
                 prelisten:prelisten,
                 get_effective_duration:get_effective_duration,
                 effective_duration:effective_duration,
                 last_time_started:last_time_started
             }
    }
    return {
        Sound: new_sound
    }
});
