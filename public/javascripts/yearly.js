let CELL_SIZE = 22;
function createHeatMap(startYear, endYear) {
    var width = 1250;
    var height = 160;
    var dx = 35;
    //var formatColor = d3.scaleQuantize().domain([0, data.maxCount]).range(d3.range(NUMBER_OF_COLORS).map((d) => `color${d}`));
  
    var heatmapSvg = d3.select('.js-heatmap').selectAll('svg.heatmap')
      .enter()
      .append('svg')
      .data(d3.range(startYear, endYear))
      .enter()
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'color')
  
    // Add a grid for each day between the date range.
    //var dates = Object.keys(data.dates);
    var rect = heatmapSvg.append('g')
    .attr('transform', `translate(${dx},0)`);
  
    // Add year label.
    rect.append('text')
        .attr('transform', `translate(-10,${CELL_SIZE * 3.5})rotate(-90)`)
        .style('text-anchor', 'middle')
        .text((d) => d);

    rect.append('g')
    .attr('transform', 'translate(0,-23)')
    .selectAll('.month')
    .data((d) => d3.range(7))
    .enter()
    .append('text')
      .attr('class', (d) => 'weekDays')
      .attr('y', (d) => CELL_SIZE * d + dx + (CELL_SIZE / 10))
      .text( (d) => {
        switch (d) {
          case 0:
            return 'Sun'
            break;
          case 1:
            return 'Mon'
            break;
          case 2:
            return 'Tue'
            break;
          case 3:
            return 'Thu'
            break;
          case 4:
            return 'Wed'
            break;
          case 5:
            return 'Fri'
            break;
          case 6:
            return 'Sat'
            break;
        }
      });

    var gElement = rect.selectAll('.day')
      // The heatmap will contain all the days in that year.
      .data((d) => {
        //console.log( d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1) ) );
        return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
      })
      .enter()
      .append('g');
    
      gElement.append('rect')
        .attr('width', CELL_SIZE)
        .attr('height', CELL_SIZE)
        .attr('x', (d) => d3.timeFormat('%U')(d) * CELL_SIZE + 20)
        .attr('y', (d) => d.getDay() * CELL_SIZE)
        // Add the colors to the grids.
        .attr('class', (d) => {
          return `day color${Math.floor(Math.random() * (6 - 0)) + 0}`;
      });
      gElement.append('text')
        .attr('x', (d) => d3.timeFormat('%U')(d) * CELL_SIZE + 14)
        .attr('y', (d) => d.getDay() * CELL_SIZE + 14)
        .attr('class', (d) => `dayName`)
        .text((d) => {
          return d3.timeFormat('%-d')(d);
      });
  
    // Render x axis to show months
    d3.select('.js-months').selectAll('svg.months')
      .enter()
      .append('svg')
      .data([1])
      .enter()
      .append('svg')
        .attr('width', 1250)
        .attr('height', 19)
      .append('g')
        .attr('transform', 'translate(0,12)')
        .selectAll('.month')
        .data(() => d3.range(12))
        .enter()
        .append('text')
          .attr('x', (d) => d * (4.5 * CELL_SIZE) + 60)
          .text((d) => d3.timeFormat('%b')(new Date(0, d + 1, 0)));
  
    // Render the grid color legend.
    var legendSvg = d3.select('.js-legend').selectAll('svg.legend')
      .enter()
      .append('svg')
      .data([1])
      .enter()
      .append('svg')
        .attr('width', 200)
        .attr('height', 6 * CELL_SIZE + dx)
      .append('g')
        .attr('transform', 'translate(0,0)')
        .selectAll('.legend-grid')
        .data(() => d3.range(6))
        .enter()
        .append('g');
        
        legendSvg.append('rect')
          .attr('width', CELL_SIZE)
          .attr('height', CELL_SIZE)
          .attr('x', (d) => 0)
          .attr('y', (d) => d * CELL_SIZE + dx)
          .attr('class', (d) => `day color${d}`);  
        legendSvg.append('text')
          .attr('x', (d) => dx)
          .attr('y', (d) => d * CELL_SIZE + dx + 18)
          .attr('class', (d) => 'smiles')
          .text((d) => {
            switch (d) {
              case 0:
                return `- fantastic day`
                break;
              case 1:
                return `- happy day`
                break;
              case 2:
                return `- average day`
                break;
              case 3:
                return `- sad day`
                break;
              case 4:
                return `- tired day`
                break;
              case 5:
                return `- angry day`
                break;
            }
          })
          
}

$(document).ready(function(){
    createHeatMap(2017,2020);
    $(`rect`).click(() => {
      $(this).addClass('clickEvent');
    });
});