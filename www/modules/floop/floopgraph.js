define(["d3"],function(d3){

    let width = 700, height = 700;
    let color = d3.scale.category20();
    let graph;
    let count = 0;
    window.gsounds = {};

    let init = function(){
        emitter.addListener('got_sounds', load_sounds);
    };

    let load_sounds = function(data){
        count = 0;
        $('#results').empty();
        for (snd in data.sounds){
            let s = data.sounds[snd];
            freesound.getSound(s, (sound) => {
              sound.color = "black";
              gsounds[parseInt(sound.id)] = sound;
              if(++count >= data.sounds.length){
                draw_graph(data);
                emitter.emitEvent('sounds_loaded');
              }
            }, (err) => {
              console.log("error with sound ", err)
              if(++count >= data.sounds.length) draw_graph(data);
                    console.log(err);
                }
            );
        };
        graph = data['graph'];
    };

    let draw_graph = function(data){
        let graph = data.graph;
        let k = 30 * (graph.nodes.length / (width * height));
        let force = d3.layout.force()
            .charge(-10/k)
            .gravity(100 * k)
            .linkDistance(20)
            .size([width, height]);
        let svg = d3.select("#results").append("svg")
            //.attr("width", width)
            //.attr("height", height)
            .attr("viewBox", "0 0 " + width + " " + height)

        d3.select("body").on("keydown", () => {
          if(d3.event.keyCode == 16) emitter.emitEvent('graph_keydown');
          if(d3.event.keyCode == 27) emitter.emitEvent('panic')
        }).on("keyup", function() {
          if(d3.event.keyCode == 16) emitter.emitEvent('graph_keyup');
        });
        force.nodes(graph.nodes).links(graph.links).start();

        let link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link");

        let node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .on("click", (snd, idx) =>{
                emitter.emitEvent('node_click', [snd,idx]);
                d3.event.stopPropagation();
            }).on("mouseover",(snd, idx) =>{
                emitter.emitEvent('node_mouseover', [gsounds[snd.id]]);
            }).on("mouseout", (snd, idx) =>{
                emitter.emitEvent('node_mouseout', [gsounds[snd.id]]);
          });

        node.append("rect")
                .attr("x", -27)
                .attr("y", -13)
                .attr("width", 52)
                .attr("height", 26)
                .attr("id", (d, i) => { return ("sndrect_" + d.id)})
                .attr("stroke", "black");

        node.append("image")
            .attr("xlink:href", (d) => {
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
            .attr("id", (d, i) => { return ("sndthumb_" + d.id)})
            .attr("height", 25)

        force.on("tick", ()  => {
            link.attr("x1", (d)  => { return d.source.x; })
            .attr("y1", (d)  => { return d.source.y; })
            .attr("x2", (d)  => { return d.target.x; })
            .attr("y2", (d) => { return d.target.y; });
            node.attr("transform", (d)  => { return "translate(" + d.x + "," + d.y + ")"; });
        });
    }

    return {
        draw_graph:draw_graph,
        init: init
    }
});
