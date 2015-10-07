d3.csv("budget.csv", function(data) {
  console.log(data);
  var nested = d3.nest()
    .key(function(d) { return d["款"]; })
    .key(function(d) { return d["項"]; })
    .key(function(d) { return d["目"]; })
    .entries(data);
});
