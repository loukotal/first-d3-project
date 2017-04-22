var options = {
    width: 600,
    height: 500,
    padding: 35
};

var graph = {
    rects: null,
    xScale: null,
    yScale: null,
    xAxis: null,
    yAxis: null,
    metric: null
};

var svg = d3.select(".chart").append("svg")
            .attr("width", options.width)
            .attr("height", options.height);

        graph.yScale = d3.scaleLinear()
                .range([options.height - options.padding, options.padding])
                .nice();

var _init = function (data,m) {

    graph.metric = m;
    graph.yScale.domain([0,d3.max(data,function(d){
        return d[graph.metric];
    })]);

    graph.xScale = d3.scaleBand()
                    .domain(getYears(data))
                    .rangeRound([options.padding, options.width - options.padding])
                    .padding(0.05);

    graph.yAxis = d3.axisLeft().scale(graph.yScale).ticks(15);
    graph.xAxis = d3.axisBottom().scale(graph.xScale);

    graph.rects = svg.selectAll("rect").data(data);




}

var _enter = function(d) {
    graph.rects.enter().append("rect")
            .attr("y",function(d) {return graph.yScale(d[graph.metric]);})
            .attr("x", function(d) {return graph.xScale(d["rok"]);})
            .attr("width", graph.xScale.bandwidth())
            .attr("height", function(d){return (options.height - graph.yScale(d[graph.metric])  - options.padding);})
            .attr("fill","#472E74");





    _updateAxis(d);
}

var _update = function(data,m) {
    graph.yScale.domain([0,d3.max(data,function(d){
        return d[graph.metric];
    })]);

    svg.selectAll("rect")
                .on("mouseover",function(data){
                    d3.select(this)
                        .attr("fill","#A33744");

                    var xPos = parseFloat(d3.select(this).attr("x")) + graph.xScale.bandwidth() / 2;
                    var yPos = parseFloat(d3.select(this).attr("y")) + 14;

                    svg.append("text")
                        .attr("id", "tooltip")
                        .attr("x", xPos)
                        .attr("y", yPos)
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "11px")
                        .attr("font-weight", "bold")
                        .attr("fill", "white")
                        .text(data[graph.metric]);
                })
                .on("mouseout",function(){
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr("fill","#472E74");

                svg.selectAll("#tooltip")
                    .remove();
                svg.selectAll("#info")
                    .remove();

                });
                // .on("click",function(data){
                //
                //     svg.selectAll("#info")
                //         .remove();
                //
                //     var rok= "rok: " + data["rok"];
                //     var vytapeni = "VYTÁPĚNÍ"
                //     var spotrebaGJ = "Spotřeba: " + data["Spotreba"] + " [GJ]";
                //     var cenaGJ = "Cena za GJ: " + data["Cena"] + " [Kč/GJ]";
                //
                //     var ohrevTV = "OHŘEV TEPLÉ VODY";
                //     var spotrebaGJTV = "Spotřeba: " + data["SpotrebaGJ"] + " [GJ]";
                //     var spotrebaTV = "Spotřeba m3: " + data["SpotrebaTV"] + " [m3]";
                //     var cenaTV = "Cena za GJ: " + data["CenaTV"] + " [Kč/GJ]";
                //
                //
                //
                //     svg.append("g")
                //         .attr("id","info")
                //         .append("text")
                //         .attr("fill","black")
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 - 100)
                //         .attr("y", options.height / 2 - 220)
                //         .text(vytapeni)
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 - 100)
                //         .attr("y", options.height / 2 - 200)
                //         .text(rok)
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 - 100)
                //         .attr("y", options.height / 2 - 180)
                //         .text(spotrebaGJ)
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 - 100)
                //         .attr("y", options.height / 2 - 160)
                //         .text(cenaGJ);
                //
                //     svg.append("g")
                //         .attr("id","info")
                //         .append("text")
                //         .attr("fill","black")
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 + 100)
                //         .attr("y", options.height / 2 - 220)
                //         .text(ohrevTV)
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 + 100)
                //         .attr("y", options.height / 2 - 200)
                //         .text(rok)
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 + 100)
                //         .attr("y", options.height / 2 - 180)
                //         .text(spotrebaGJTV)
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 + 100)
                //         .attr("y", options.height / 2 - 160)
                //         .text(spotrebaTV)
                //         .append("svg:tspan")
                //         .attr("x", options.width / 2 + 100)
                //         .attr("y", options.height / 2 - 140)
                //         .text(cenaTV);
                //
                // });


    graph.rects.transition()
        .duration(1000)
        .attr("y",function(d) {return graph.yScale(d[graph.metric]);})
        .attr("height", function(d){return options.height - graph.yScale(d[graph.metric]) - options.padding;});



}
var updated = false;
var _updateAxis = function(d) {
    //svg.selectAll("g").remove();



    if (!updated) {
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform","translate(0, "+ (options.height - 34 ) + ")")
            .call(graph.xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+ (options.padding) + ", 0)")
            .call(graph.yAxis);

        updated = !updated;
    } else {
        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(graph.yAxis);
    }

}
var _exit= function() {
    graph.rects.exit().remove();
}
d3.json("data.json",function(dataset) {

    function render(dataset,metric) {

        //sets up yScale based on passed key in object!

        // NOTE: Check values of yScale on max number to properly display height of the bar!!

        _init(dataset,metric);
        _enter(dataset);
        _update(dataset);
        _exit();


    }

    render(dataset,"Spotreba");

    d3.select("#vytapeni")
        .on("click", function(){
            render(dataset,"Spotreba");
        })

    // document.getElementById("vytapeni").addEventListener("click",function(){
    //     render(dataset,"Spotreba");
    // });
    document.getElementById("cenaVyt").addEventListener("click",function(){
        render(dataset,"Cena");
    });
    document.getElementById("spotrebaTV").addEventListener("click",function(){
        render(dataset,"SpotrebaTV");
    });
    document.getElementById("cenaTV").addEventListener("click",function(){
        render(dataset,"CenaTV");
    });
    // setTimeout(function() {return render(dataset,"CenaTV");},3000);






});
function getYears(dataset) {
    var arr = [];
    dataset.forEach(function(obj){
        return arr.push(obj["rok"]);
    })
    return arr;
}
