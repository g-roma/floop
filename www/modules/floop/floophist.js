define(["d3"],function(d3){

    let w = 200;
    let h = 1200;
    let max_count = 251;
    let barPadding = 0.5;
    let scale = d3.scale.linear()
        .domain([1, max_count])
        .range([1, w]);

    let init = function(){
        emitter.addListener("got_hist", draw_hist)
    };

    let draw_hist = function(dataset){
        let svg = d3.select("#hist").append("svg");
        svg.attr("width", w).attr("height", h);
        svg.selectAll("rect")
            .data(dataset).enter().append("rect")
            .style("fill","white")
            .attr("x", 0)
            .attr("y", (d, i) => {
                return i * (h / dataset.length);
            })
            .attr("width", (d) => {
                let w = scale(d);if (w < 0) w = 0; return w;
            })
            .attr("height", 1)
            .on("mouseover", function(val, idx){
                d3.select(this).style("fill", "grey");
                emitter.emitEvent("hist_mouseover", [val,idx]);
            })
            .on("mouseout", function(val, idx, nodes){
                d3.select(this).style("fill", "white");
                emitter.emitEvent("hist_mouseout", [val,idx])
            }).on("click", (val,idx) => {
                emitter.emitEvent("hist_click", [idx])
            });
    }

    return {
        draw_hist:draw_hist,
        init: init
    }
});
