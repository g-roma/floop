define(["floop/floopsound","floop/floopsched"], function(fsound, sched){

    let active = [];
    let sounds = {};

    let init = function(){
            emitter.addListener('node_play', load_and_play);
            emitter.addListener('load_sound', load_sound);
            emitter.addListener('panic', panic);
     };

    let load_sound = function(sound){
        let snd = fsound.Sound();
        let rect = d3.select("#sndrect_" + parseInt(sound.id));
        snd.load(sound['previews']['preview-hq-mp3'], (data) => {
            sounds[parseInt(sound.id)] = snd;
            let rect = d3.select("#sndrect_" + snd_id);
            rect.attr("stroke", "white");
            active.push(snd_id);
            sched.add_sound(sounds[snd_id]);
        });
    }

    let play_sound = function(val,i){
        snd_id = parseInt(val.id);
        let idx = active.indexOf(snd_id);
        if(idx >= 0){
            stop_sound(snd_id,idx);
        }
        else{
            let rect = d3.select("#sndrect_"+snd_id);
            rect.attr("stroke", "white");
            active.push(snd_id);
            sched.add_sound(sounds[snd_id]);
        }
    }

    let load_and_play = function(sound, idx, color = "white"){
        let snd = fsound.Sound();
        let snd_id = sound.id;
        let rect = d3.select("#sndrect_" + parseInt(sound.id));
        let is_playing = active.indexOf(snd_id);
        if (is_playing >= 0) stop_sound(sound.id, idx);
	      else {
            snd.load( gsounds[parseInt(sound.id)]['previews']['preview-hq-mp3'],
            (data) =>{
 		           sounds[parseInt(sound.id)] = snd;
               let rect = d3.select("#sndrect_"+snd_id);
               rect.attr("stroke", color);
               active.push(snd_id);
               sched.add_sound(sounds[snd_id]);
	            })
        }
    }

    let stop_sound = function(snd_id, idx) {
        let rect = d3.select("#sndrect_" + snd_id);
        rect.attr("stroke", gsounds[snd_id].color);
        let pos = active.indexOf(snd_id);
        if (pos >= 0) active.splice(pos, 1);
        sounds[snd_id].stop();
        sched.remove_sound(sounds[snd_id]);
    }

    let panic = function(){
      active.forEach(stop_sound);
    }

    return {
        init: init,
        play_sound:play_sound
    }
});
