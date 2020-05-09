define(["d3"],function(d3){

    var width = 1000, height = 700;
    var color = d3.scale.category20();
    window.gsounds = {};
    var graph;
    var count=0;

    var load_sounds = function(data){
        count=0;
        $('#results').empty();
        for (snd in data.sounds){
            var s = data.sounds[snd];
            freesound.getSound(s,function(sound){
                    sound.color = "black";
                    gsounds[parseInt(sound.id)]=sound;
                    if(++count>=data.sounds.length){
                        draw_graph(data);
                        emitter.emitEvent('sounds_loaded');
                    }
                },function(err){
                    console.log("error with sound")
                    if(++count>=data.sounds.length)draw_graph(data);
                    console.log(err);

                }
            );
        };
        graph = data['graph'];
    };

    var draw_graph = function(data){
        var graph =data.graph;
        var k = 30*(graph.nodes.length / (width * height));
        var force = d3.layout.force()
            .charge(-10/k)
            .gravity(100 * k)
            .linkDistance(30)
            .size([width, height]);
        var svg = d3.select("#results").append("svg")
            .attr("width", width)
            .attr("height", height);
        force.nodes(graph.nodes).links(graph.links).start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link");

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .on("click",function(snd,idx){
                emitter.emitEvent('node_click',[snd,idx]);
                d3.event.stopPropagation();
            }).on("mouseover",function(snd,idx){
                emitter.emitEvent('node_mouseover',[gsounds[snd.id]]);
            }).on("mouseout",function(snd,idx){
                emitter.emitEvent('node_mouseout',[gsounds[snd.id]]);
            });

        node.append("rect")
                .attr("x", -27)
                .attr("y", -13)
                .attr("width", 52)
                .attr("height", 26)
                .attr("id", function(d, i) { return ("sndrect_" + d.id)})
                .attr("stroke", "black");

        node.append("image")
            .attr("xlink:href", function(d){
                if(gsounds[parseInt(d.id)]){
                    return gsounds[parseInt(d.id)]["images"]['spectral_m'];
                }
                else {
                    return null;
                }
            })
            .attr("x", -25)
            .attr("y", -12.5)
            .attr("width", 50)
            .attr("id", function(d, i) { return ("sndthumb_" + d.id)})
            .attr("height", 25)

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
    }

    var init = function(){
        emitter.addListener('got_sounds',load_sounds)
    };

    return {
        draw_graph:draw_graph,
        init: init
    }
});
