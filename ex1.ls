sample = do
  children:   [
   {value: 4}, {value: 2}, {value: 6}, {value: 6}, 
   {value: 6}, {value: 8}, {value: 9}, {value: 9}, {value: 2}
  ]

<- $ document .ready
treemap = d3.layout.treemap!size [900,400]
nodes = treemap.nodes sample
svg = d3.select \svg 
svg.selectAll \rect .data nodes
  ..enter!append \rect
    .attr do
      x: -> it.x
      y: -> it.y
      width: -> it.dx
      height: -> it.dy
      fill: \none
      stroke: \black

