define(function(){

    var get_json = function(url,f){
            $.ajax({url: url,dataType: 'json',
                success:f,
                error:function(err){
                    console.log("server error");
                    console.log(err);
                }
            });
    };

    var get_hist = function(){
        console.log("get_hist");
        get_json("index/get_histogram",
            function(hist){
                console.log("hist");
                console.log(hist);

                emitter.emitEvent('got_hist',[hist])
            }
        );
    }

    var get_sounds_for_period = function(period,f){
        get_json("index/get_sounds_for_period?p=" + period,
            function(sounds){
                console.log(sounds);
                emitter.emitEvent('got_sounds',[sounds]);
                window.currentPeriod = period;
            }
        );
    }

    var init = function(){
            console.log("server init");
            emitter.addListener('hist_click', get_sounds_for_period);
     };

    return {
        get_hist : get_hist,
        get_sounds_for_period:get_sounds_for_period,
        init: init
    }
});
