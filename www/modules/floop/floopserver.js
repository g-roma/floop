define(function(){
    var  base_url= "/floop/";

    var init = function(){
            emitter.addListener('hist_click', get_sounds_for_period);
     };

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
        get_json(base_url+"index/get_histogram",
            (hist) => {
                emitter.emitEvent('got_hist', [hist])
            }
        );
    }

    var get_token = function(f){
        get_json(base_url+"index/token",
            (token) => f(token)
        );
    }


    var get_sounds_for_period = function(period){
        get_json(base_url + "index/get_sounds_for_period?p=" + period,
            (sounds) => {
                emitter.emitEvent('got_sounds',[sounds]);
                window.currentPeriod = period;
            }
        );
    }

    return {
        get_hist : get_hist,
        get_token : get_token,
        get_sounds_for_period:get_sounds_for_period,
        init: init
    }
});
