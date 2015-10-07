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
  var nodes = treemap.nodes( nested );
  d3.select("svg").selectAll("rect").data(nodes).enter().append("rect")
    .attr({
      x: function(it) { return it.x; },
      y: function(it) { return it.y; },
      width: function(it) { return it.dx; },
      height: function(it) { return it.dy; },
      fill: "none", stroke: "black"
    });
});

