define(function(){

    let startTime = 0;
    let active = [];
    let schedTime = 0;
    let period = 0;
    let lookAhead = 0;
    let nextTickTime = 0;

    let init = function(){
        emitter.addListener('hist_click',set_period);
        emitter.addListener('sounds_loaded',start);
    }

    let set_period = function(p){
        period = p * window.FRAME_SECS;
        schedTime = 0.01;
        lookAhead = period;
    }

    let start = function(p){
        nextTickTime = context.currentTime;
        setInterval(sched, schedTime * 1000);
    }

    let add_sound = function(sound){
        let dur = sound.get_effective_duration(period);
        sound.effective_duration = dur;
        active.push(sound);
    }

    let remove_sound = function(snd){
        snd.last_time_started = 0;
        active.splice(active.indexOf(snd),1);
    }

    let sched = function(){
        while (nextTickTime < context.currentTime + lookAhead ) {
            for (snd in active){
                let elapsed = context.currentTime - active[snd].last_time_started;
                let remaining = active[snd].effective_duration - elapsed;
                let timeLeft = nextTickTime-context.currentTime;
                if (elapsed > 0 && (remaining<= timeLeft || Math.abs(remaining-timeLeft) < 0.01))
                     active[snd].play(false, nextTickTime);
            }
            nextTickTime = nextTick();
        }
    }

    let nextTick = function() {
        nextTickTime += period;
        return nextTickTime;
    }

    return {
        add_sound: add_sound ,
        remove_sound: remove_sound,
        init:init
    }
});
