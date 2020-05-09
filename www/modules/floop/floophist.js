define(["d3"],function(d3){

    var w = 200;
    var h = 1200;
    var max_count = 251;
    var barPadding = 0.5;    
    var scale = d3.scale.linear()
            .domain([1,max_count])
            .range([1,w]);

    var draw_hist = function(dataset){
        console.log(dataset);
        var svg = d3.select("#hist").append("svg");
        svg.attr("width", w).attr("height", h);
        svg.selectAll("rect")
            .data(dataset).enter().append("rect")
            .style("fill","white")
            .attr("x", 0)
            .attr("y",function(d, i) {
                return i * (h / dataset.length);
            })
            .attr("width", function(d) {
                var w = scale(d);if (w<0)w=0;return w;
            })
            .attr("height", 1)
            .on("mouseover", function(val,idx){
                d3.select(this).style("fill", "grey");
                emitter.emitEvent("hist_mouseover",[val,idx]);
            })
            .on("mouseout", function(val,idx){
                d3.select(this).style("fill", "white");
                emitter.emitEvent("hist_mouseout",[val,idx])
            }).on("click",function(val,idx){
                emitter.emitEvent("hist_click",[idx])
            });
    }

    var init = function(){
        console.log("hist init");
        emitter.addListener("got_hist",draw_hist)
    };

    return {
        draw_hist:draw_hist,  
        init: init
    }
});