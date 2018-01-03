const cellSize = 70;

function CreateMonthlyHeatMap(year, month){
    // initialize width and height
    const width = 500;
    const height = 500;
    var newWeek;
    var dayYCords = cellSize + 15;
    var dayNumYCords = cellSize + cellSize / 2 + 18;
    let heatmapSvg = d3.select('.monthCalendar')
        .selectAll('svg.heatmap')
        .enter()
        .append('svg')
          .data([month])
          .enter()
          .append('svg')
            .attr('width', width)
            .attr('height', height);

    let mainGroup = heatmapSvg.append('g')
      .attr('transfrom', 'translate(0,0)')
    

    //Generate the months calendar
    let heatmapGroup = mainGroup.selectAll('.day')
      .data((d) => {
        return d3.timeDays(new Date(year, d, 1), new Date(year, d + 1, 1));
      })
      .enter()
      .append('g')
        .attr('id', (d) => {
          return d3.timeFormat(`%Y-%m-%d`)(d);
        });
    heatmapGroup.append('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', (d) => {
        let x;
        if(d.getDay() === 0){
          x = 7 * cellSize - cellSize + 5;
          return x;
        }
        else{
          x = d.getDay() * cellSize  - cellSize + 5;
          return x;
        }
      })
      .attr('y', (d) => {
        newWeek = d.getDay();
        let prevYCords = dayYCords;
        if(newWeek === 0){
          dayYCords += cellSize;
          return prevYCords;
        }
        return dayYCords;
      })
      .attr('rx', '20')
      .attr('ry', '20')
      .attr('class', 'day');

    //day number
    
    heatmapGroup.append('text')
      .attr('x', (d) => {
        let x;
        if(d.getDay() === 0){
          x = 7 * cellSize - cellSize + 5 + cellSize / 2;
          return x;
        }
        else{
          x = d.getDay() * cellSize  - cellSize + 5 + cellSize / 2;
          return x;
        }
      })
      .attr('y', (d) => {
        newWeek = d.getDay();
        let prevYCords = dayNumYCords;
        if(newWeek === 0){
          dayNumYCords += cellSize;
          return prevYCords;
        }
        return dayNumYCords;
      })
      .attr('class', 'dayNum')
      .style('text-anchor', 'middle')
      .text((d) => {
        return d3.timeFormat('%-d')(d);
      })
    //Render Month name
    mainGroup.append('text')
      .attr('class', 'monthName')
      .attr(`x`, width/2)
      .attr('y', 50)
      .style('text-anchor', 'middle')
      .text((d) => {
        return d3.timeFormat('%B')(new Date(year, month));
    });
    // Render week days
    mainGroup.append('g')
      .attr('transform', `translate(${cellSize/2 + 3.5},80)`)
      .selectAll('.weekName')
      .data((d)=> d3.range(7))
      .enter()
      .append('text')
        .style('text-anchor', 'middle')
        .attr('class', 'weekName')
        .attr('x', (d)=>{
          return cellSize * d;
        })
        .text((d) => {
          switch (d) {
            case 0:
              return 'Mon'
              break;
            case 1:
              return 'Tue'
              break;
            case 2:
              return 'Thu'
              break;
            case 3:
              return 'Wed'
              break;
            case 4:
              return 'Fri'
              break;
            case 5:
              return 'Sat'
              break;
            case 6:
              return 'Sun'
              break;
          }
        });
}
function CreateLegend(){
  const size = 20;
  var legendSvg = d3.select('.legend').selectAll('svg.legend')
      .enter()
      .append('svg')
      .data([1])
      .enter()
      .append('svg')
        .attr('width', 140)
        .attr('height', 6 * size)
      .append('g')
        .attr('transform', 'translate(0,0)')
        .selectAll('.legend-grid')
        .data(() => d3.range(6))
        .enter()
        .append('g');
        
        legendSvg.append('rect')
          .attr('width', size)
          .attr('height', size)
          .attr('x', (d) => 0)
          .attr('y', (d) => d * size)
          .attr('class', (d) => `day color${d}`);  
        legendSvg.append('text')
          .attr('x', (d) => size + 5)
          .attr('y', (d) => d * size + size / 2 + 6)
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
$(document).ready(()=>{
    CreateMonthlyHeatMap( new Date().getFullYear(), new Date().getMonth() );
    CreateLegend();
    let user = 'daugiss';
    $.ajax({
      url: `monthly/${user}/${new Date().getFullYear()}/${new Date().getMonth()}`,
      type: `GET`,
      dataType: `json`,
    }).done((answer)=>{
      for (const date in answer.days) {
        if (answer.days.hasOwnProperty(date )) {
          const element = answer.days[date];
          $(`#${date}`).find('rect').removeClass('day').addClass(`color${element} colored`);
        }
      }
    }).fail((xhr, status, error)=>{
      console.log('Error', error);
    }).always((xhr, status)=>{
      console.log('Month request completed');
    });
});