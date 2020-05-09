define(["ae/ae","ae/sched"],function(ae,sched){

    var active = [];
    var sounds = {};
    var loadSound = function(sound){
        var snd = ae.Sound();
        var rect = d3.select("#sndrect_"+parseInt(sound.id));
        snd.load(sound['previews']['preview-hq-mp3'],function(data){
            sounds[parseInt(sound.id)]=snd;
            var rect = d3.select("#sndrect_"+snd_id);
            rect.attr("stroke", "white");
            active.push(snd_id);
            sched.add_sound(sounds[snd_id]);
        });
    }
    var playSound = function(val,i){
        snd_id = parseInt(val.id);
        var idx = active.indexOf(snd_id);
        console.log("play sound "+snd_id);
        if(idx>=0){
            stopSound(snd_id,idx);
        }
        else{
            var rect = d3.select("#sndrect_"+snd_id);
            rect.attr("stroke", "white");
            active.push(snd_id);
            sched.add_sound(sounds[snd_id]);
        }
    }

    var loadAndPlay = function(sound,idx){
        var snd = ae.Sound();
        var snd_id = sound.id;
        var rect = d3.select("#sndrect_"+parseInt(sound.id));
        var is_playing = active.indexOf(snd_id);
        if(is_playing>=0){
            stopSound(sound.id,idx);
	   }
	   else{
            snd.load( gsounds[parseInt(sound.id)]['previews']['preview-hq-mp3'],function(data){
 		         sounds[parseInt(sound.id)]=snd;
            	var rect = d3.select("#sndrect_"+snd_id);
            	rect.attr("stroke", "white");
            	active.push(snd_id);
            	sched.add_sound(sounds[snd_id]);
	       })
        }
    }
    var stopSound = function(snd_id,idx){
        var rect = d3.select("#sndrect_"+snd_id);
        rect.attr("stroke",gsounds[snd_id].color);
        active.splice(idx,1);
        sounds[snd_id].stop();
        sched.remove_sound(sounds[snd_id]);
    }

    var init = function(){
            emitter.addListener('node_click',loadAndPlay);
            emitter.addListener('load_sound',loadSound);
     };

    return {
        init: init,
        playSound:playSound
    }
});
