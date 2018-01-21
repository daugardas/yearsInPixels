let CELL_SIZE = 22;
let moods = [ /*excited*/ "#ffcb86", /*happy*/ "#faf734", /*calm*/ "#94edff", /*focused*/ "#c9d2e9", /*rested*/ "#d9a6e4",
  /*overwhelmed*/
  "#962e65", /*sick*/ "#bcce34", /*frustrated*/ "#d10000", /*tired*/ "#265bbd",
  /*sad*/
  "#c4c4c4", /*scattered*/ "#657475", /*nervous*/ "#51c516"
];

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
    .text((d) => {
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
      return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter()
    .append('g')
    .attr('id', (d) => {
      return d3.timeFormat(`%Y-%m-%d`)(d);
    });


  //append defs for gradient
  let grad = gElement.append('defs')
    .append('linearGradient')
    .attr(`id`, (d) => `grad-${d3.timeFormat(`%Y-%m-%d`)(d)}`)
    .attr('x1', `0%`)
    .attr('x2', `100%`)
    .attr('y1', `0%`)
    .attr('y2', `100%`);

  // gradients
  grad.append(`stop`)
    .attr(`offset`, `100%`)
    .attr(`style`, `stop-color: #eee; stop-opacity: 1`);


  gElement.append('rect')
    .attr('width', CELL_SIZE)
    .attr('height', CELL_SIZE)
    .attr('x', (d) => d3.timeFormat('%U')(d) * CELL_SIZE + 20)
    .attr('y', (d) => d.getDay() * CELL_SIZE)
    .attr('class', 'day')
    // Add the colors to the grids.
    .attr(`fill`, (d)=> `url(#grad-${d3.timeFormat(`%Y-%m-%d`)(d)})`)
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
    .attr('height', 7 * CELL_SIZE + dx)
    .append('g')
    .attr('transform', 'translate(0,0)')
    .selectAll('.legend-grid')
    .data(() => d3.range(7))
    .enter()
    .append('g');

  legendSvg.append('rect')
    .attr('width', CELL_SIZE)
    .attr('height', CELL_SIZE)
    .attr('x', (d) => 0)
    .attr('y', (d) => d * CELL_SIZE + dx)
    .attr('class', (d) => `${d}`)
    .attr('fill', (d)=> moods[d]);
  legendSvg.append('text')
    .attr('x', (d) => dx)
    .attr('y', (d) => Number($(`.js-legend .${d}`).attr('y')) + 18)
    .attr('class', (d) => 'smiles')
    .text((d) => {
      switch (d) {
        case 0:
          return `- Excited`
          break;
        case 1:
          return `- Happy / Content`
          break;
        case 2:
          return `- Calm / Peaceful`
          break;
        case 3:
          return `- Focused / Productive`
          break;
        case 4:
          return `- Rested / Energetic`
          break;
        case 5:
          return `- Overwhelmed / Stressed`
          break;
        case 6:
          return `- Sick / Headache`
          break;
        case 7:
          return `- Frustrated / Angry`;
          break;
        case 8:
          return `- Tired`;
          break;
        case 9:
          return `- Sad / Hopeless`;
          break;
        case 10:
          return `- Scattered`;
          break;
        case 11:
          return `- Nervous / Anxious`;
          break;
      }
    });

}

function loadData() {
  $.ajax({
    url: `monthly/days`,
    type: `GET`,
    dataType: `json`,
  }).done((answer) => {
    answer.forEach(element => {
      const date = element[0];
      const color = element[1];
      //$(`#${date}`).find('rect').removeClass('day').addClass(`color${color} colored`);
      let colorArr = [
        [moods[color], 0],
        [moods[color], 100]
      ];
      gradient(date, colorArr);
    });
  }).fail((xhr, status, error) => {
    console.log('Error', error);
  });
}

function gradient(date, colors) { // colors the day in gradient
  let gradient = d3.select(`g[id="${date}"]`).select(`linearGradient`); // selects groups linearGradient elment
  gradient.selectAll('stop').remove(); //and removes the current gradients in it
  for (let i = 0; i < colors.length; i++) { // goes through gradient colors loop
    const element = colors[i];
    if (i === 0 || i === colors.length - 1) { // if the grad color is the first or the last one
      gradient.append('stop') // then just append one element
        .attr(`offset`, `${element[1]}%`)
        .attr(`style`, `stop-color: ${element[0]}; stop-opacity: 1`);
    } else { // if the grad color is somewhere in the middle
      gradient.append('stop') // then append two elements, because they need to have their lines straight
        .attr(`offset`, `${element[1]}%`)
        .attr(`style`, `stop-color: ${element[0]}; stop-opacity: 1`);

      gradient.append('stop')
        .attr(`offset`, `${colors[i + 1][1]}%`) // offsets to the next colors array offset, so basically it sets the ending
        .attr(`style`, `stop-color: ${element[0]}; stop-opacity: 1`);
    }
  }
}
$(document).ready(function () {
  createHeatMap(2018, 2019);
  loadData();
});