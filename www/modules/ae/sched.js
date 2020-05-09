define(function(){
    var startTime = 0;
    var active = [];
    var schedTime = 0;
    var period = 0;
    var lookAhead = 0;
    var nextTickTime = 0;

    var init = function(){
        emitter.addListener('hist_click',set_period);
        emitter.addListener('sounds_loaded',start);
    }

    var set_period = function(p){
        period = p*FRAME_SECS;
        schedTime = 0.01;
        lookAhead = period;
    }
    var start = function(p){
        //console.log("#### start scheduler");
        nextTickTime = context.currentTime;
        //console.log(schedTime);
        setInterval(sched, schedTime*1000);
    }

    var add_sound = function(sound){
        //sound.get_num_periods(period);
        var dur = sound.get_effective_duration(period);
        sound.effective_duration = dur;
        active.push(sound);
    }
    var remove_sound = function(snd){
        snd.last_time_started = 0;
        active.splice(active.indexOf(snd),1);
    }

    var sched= function(){
        while (nextTickTime < context.currentTime + lookAhead ) {
            for (snd in active){
                var elapsed = context.currentTime - active[snd].last_time_started;
                var remaining = active[snd].effective_duration - elapsed;
                var timeLeft = nextTickTime-context.currentTime;
                if (elapsed>0 && (remaining<= timeLeft || Math.abs(remaining-timeLeft)<0.01))
                     active[snd].play(false, nextTickTime);
            }
            nextTickTime = nextTick();
        }
    }

    var nextTick = function() {
        nextTickTime += period;
        return nextTickTime;
    }

    return {
        add_sound: add_sound ,
        remove_sound: remove_sound,
        init:init
    }
});
