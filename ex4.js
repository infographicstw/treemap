d3.csv("budget.csv", function(data)  {
  var nested = { values: d3.nest()         // 包覆 d3.nest 產生的結果
    .key(function(d) { return d["款"]; })  // 分別使用「款」「項」「目」來製作階層
    .key(function(d) { return d["項"]; })
    .key(function(d) { return d["目"]; })
    .entries(data) // 使用的資料來自 d3.csv 的回傳值
  };
  var treemap = d3.layout.treemap().size([900,400]);
  treemap.children(function(d) { return d.values; }); // 改用 values，而非 children
  treemap.value(function(d) { return d["總額"]; });
  var nodes = treemap.nodes( nested ).filter(function(it) { return it.depth > 0; });
  console.log(nodes);
  var depth = 1;

  function click(it) {
    if(depth >= 4) { 
      depth = 1;
      update(0,0,900,400);
      $("#bread").text("總預算");
      return;
    }
    bread = ""
    while(it.depth > depth) {
      it = it.parent;
    }
    obj = it
    while(obj.depth > 0) {
      bread = (obj["名"] || obj.key) + (bread?" > ":"") + bread;
      obj = obj.parent;
    }
    $("#bread").text(bread);
    depth = depth + 1;
    if(it.values) {
      update(it.x - it.dx * 0.1, it.y - it.dy * 0.1, it.dx * 1.2, it.dy * 1.2);
    }
  }

  d3.select("svg").selectAll("rect").data(nodes).enter().append("rect").on("click", click); 

  d3.select("svg").selectAll("text").data(nodes).enter().append("text").on("click", click);
  color = d3.scale.category20();
  var hue = d3.scale.ordinal().range([0,10,20,40,90,150,210]);

  //var hue = d3.scale.ordinal().range([0,30,60,90,120,150,180,210,240,270,300,330]);
  var hue = d3.scale.ordinal().range(["#f14653","#ef7c2e","#edae2c","#f9d34e","#f6eb74"])
  var hue2 = d3.scale.ordinal().range([ 355, 24, 40, 46, 54 ])
  var sat = d3.scale.ordinal().range([10,20,30,40,50,60,70,80,90,100]);
  var lit = d3.scale.ordinal().range([30,40,50,60,70,80]);
  function update(x,y,w,h,init) {
    var xmap = d3.scale.linear().domain([x,x+w]).range([0,900]);
    var ymap = d3.scale.linear().domain([y,y+h]).range([0,400]);
    var rect = d3.select("svg").selectAll("rect");
    var text = d3.select("svg").selectAll("text");
    if(!init) {
      rect = rect.transition().duration(400);
      text = text.transition().duration(400);
    }
    text.style({cursor: "pointer"}).attr({
      x: function(it) { return xmap(it.x + it.dx / 2); },
      y: function(it) { return ymap(it.y + it.dy / 2); },
      opacity: function(it) {
        if(it.depth != depth) return 0;
        if(xmap(it.x + it.dx) - xmap(it.x) < 100) return 0;
        if(ymap(it.y + it.dy) - ymap(it.y) < 20) return 0;
        return 1;
      },
      "text-anchor": "middle",
      "dominant-baseline": "central"
    }).text(function(it) { return (it["名"] || it.key); });
    rect.style({cursor: "pointer"}).attr({
      x: function(it) { return xmap(it.x); },
      y: function(it) { return ymap(it.y); },
      width: function(it) { return xmap(it.x + it.dx) - xmap(it.x); },
      height: function(it) { return ymap(it.y + it.dy) - ymap(it.y); },
      stroke: function(it) {
        if(it.depth <= depth) { return "rgba(0,0,0,1)"; }
        else if(it.depth == depth + 1) { return "rgba(0,0,0,0.2)"; }
        else { return "rgba(0,0,0,0)"; }
      },
      fill: function(it) {
        if(depth == 1) return hue(it["款"]);
        if(depth == 2) return "hsl("+(hue2(it["款"]))+","+(sat(it["項"]))+"%,60%)";
        if(depth >= 3) return "hsl("+(hue2(it["款"]))+","+(sat(it["項"]))+"%,"+(lit(it["目"]))+"%)";
      }
    });
  }
  update(0,0,900,400,true);
});

