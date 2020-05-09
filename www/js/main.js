require.config({
	baseUrl: 'modules/',
    paths: {
        'd3':"d3/d3.v3.min"
    },
    shim:{
        d3:{
            exports:'d3'
        }

    },
    map: {
        '*': {
            css: 'require-css/css'
        }
    },
    locale : "en_us",
});

require(["floop/floop"],function(floop){floop.init()});
