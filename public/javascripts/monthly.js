const cellSize = 70;
const todayDate = d3.timeFormat(`%Y-%m-%d`)(new Date());
function CreateMonthlyHeatMap(year, month){
    // initialize width and height
    const width = 500;
    const height = 500;

    var newWeek;
    var dayYCords = cellSize + 15; // initialize the first rect y cords
    var dayNumYCords = cellSize + cellSize / 2 + 18; // initialize the first day text y cords

    // select the .monthCalendar div to this element,
    let heatmapSvg = d3.select('.monthCalendar')
        .selectAll('svg.heatmap')
        .enter()
        .append('svg') // and append svg element
          .data([month])
          .enter()
          .append('svg')
            .attr('width', width)
            .attr('height', height);

    // append the main group svg element
    let mainGroup = heatmapSvg.append('g')
      .attr('transfrom', 'translate(0,0)');
    
    //Generate the months calendar
    let heatmapGroup = mainGroup.selectAll('.day')
      .data((d) => {
        return d3.timeDays(new Date(year, d, 1), new Date(year, d + 1, 1)); // get the months day range
      })
      .enter()
      .append('g') // and for every day append a new group svg element with id which represents that day
        .attr('id', (d) => {
          return d3.timeFormat(`%Y-%m-%d`)(d);
        });
    
    //append a rectangle for that specific group
    heatmapGroup.append('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', (d) => { // places the day rectangle in some x cords
        if(d.getDay() === 0){ // places the day text in some x cords which is in some rectangle
          x = 7 * cellSize - cellSize + 5; // then to not use the 0 from the getDay(), we default to 7
          return x;
        }
        else{
          x = d.getDay() * cellSize  - cellSize + 5;
          return x;
        }
      })
      .attr('y', (d) => { // places the day rectangle in some y cords
        newWeek = d.getDay();
        let prevYCords = dayYCords;
        if(newWeek === 0){
          dayYCords += cellSize;
          return prevYCords;
        }
        return dayYCords;
      })
      //.attr('rx', '20') these two makes round edges
      //.attr('ry', '20')
      .attr('class', 'day');

    //day number
    heatmapGroup.append('text')
      .attr('x', (d) => { // places the day text in some x cords which is in some rectangle
        let x;
        if(d.getDay() === 0){ // if day is sunday(which is 0)
          x = 7 * cellSize - cellSize + 5 + cellSize / 2; // then to not use the 0 from the getDay(), we default to 7
          return x;
        }
        else{
          x = d.getDay() * cellSize  - cellSize + 5 + cellSize / 2;
          return x;
        }
      })
      .attr('y', (d) => { // places the day text in some y cords which is in some rectangle
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
        return d3.timeFormat('%-d')(d); // just render the day number
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
  const size = 30;

  // creates the legend which shows what color represents what kind of day

  var legendSvg = d3.select('.legend').selectAll('svg.legend')
      .enter()
      .append('svg')
      .data([1])
      .enter()
      .append('svg')
        .attr('width', 140)
        .attr('height', 7 * size)
      .append('g')
        .attr('transform', 'translate(0,0)')
        .selectAll('.legend-grid')
        .data(() => d3.range(7))
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
          .attr('y', (d) => d * size + size / 2 + 5)
          .attr('class', (d) => 'smiles')
          .text((d) => {
            switch (d) {
              case 0:
                return `- fantastic`
                break;
              case 1:
                return `- happy`
                break;
              case 2:
                return `- average`
                break;
              case 3:
                return `- sad`
                break;
              case 4:
                return `- tired`
                break;
              case 5:
                return `- angry`
                break;
              case 6:
                return `- shitty`;
                break;
            }
          })
}

function loadMonth(){ // colors the month according to the data got from the server
  $.ajax({
    url: `monthly/days`,
    type: `GET`,
    dataType: `json`,
  }).done((answer)=>{
    answer.forEach(element => {
      const date = element[0];
      const color = element[1];
      $(`#${date}`).find('rect').removeClass('day').addClass(`color${color} colored`);
    });
  }).fail((xhr, status, error)=>{
    console.log('Error', error);
  });
  $(`#${todayDate}`).find('text').addClass('today');
}

let form;
let clickedDate;

function postPopUp(){
  clickedDate = $(this).attr('id'); //find the date of the clicked day
  console.log(clickedDate);
  const clickedDateObj = new Date(clickedDate); //assign date objects, so that the if statement is more readable
  const todayDateObj = new Date(todayDate);
  
  if( clickedDateObj.getTime() > todayDateObj.getTime() ) { // if clicked dates miliseconds are larger than current days, then you just cant do anything
    console.log("You cannot edit this day, cause it's yet to come");
    
  } else if( $(this).find('rect').hasClass('colored') ) { // if this date element is a colored(already has some emotion in it) one,
    // then show confirmation window if they want to edit it
    
    const warning = `<form>` +
                    `<div class="form-group">` +
                      `<label>Are you sure you want to edit this day?</label>`+
                    `</div> ` +
                    `<div class="btn-group center-block" style="width: 210px;">`+
                      `<button class="btn btn-success" type="button" onclick="displayForm()">I'm sure!</button>`+
                      `<button class="btn btn-danger" type="button" onclick="closePostPopUp()">I'm not sure!</button>`+
                    `</div>`+
                  `</form>`;

    $('.dayForm').html(warning);
    if($('.dayForm').hasClass('hidden')){ // if the day form is hidden,
      $('.dayForm').removeClass('hidden'); //  just show it.
  
    }
  } else { // if the clicked element is not yet colored
    $('.dayForm').html(form); //display the form for the emotion to be sent to db
    $('.dayForm').find('input[name=date]').val(clickedDate); // insert the clicked date to the non-editable input value
    if($('.dayForm').hasClass('hidden')){ // if the day form is hidden,
      $('.dayForm').removeClass('hidden'); //  just show it.
  
    }
  }
}

function displayForm(){
  $('.dayForm').html(form);
  $('.dayForm').find('input[name=date]').val(clickedDate); // insert the clicked date to the non-editable input value
}

function closePostPopUp(){
  $('.dayForm').addClass('hidden');
}

let fullYear = new Date().getFullYear();
let fullMonth = new Date().getMonth();
function minusMonth(){
  if(fullMonth === 0){
    fullYear--;
    fullMonth = 11;
  } else {
    fullMonth--;
  }
  console.log(fullYear, fullMonth)
  $('.monthCalendar svg').remove();
  CreateMonthlyHeatMap(fullYear, fullMonth);
  loadMonth();
  $('.monthCalendar svg g g').click(postPopUp);
}

function plusMonth(){
  if(fullMonth === 11){
    fullYear++;
    fullMonth = 0;
  } else{
    fullMonth++;
  }

  console.log(fullYear, fullMonth)
  $('.monthCalendar svg').remove();
  CreateMonthlyHeatMap(fullYear, fullMonth);
  loadMonth();
  $('.monthCalendar svg g g').click(postPopUp);
}
$(document).ready(()=>{
    CreateMonthlyHeatMap(fullYear, fullMonth);
    CreateLegend();
    loadMonth();
    form = $('.dayForm').html();
    $('.monthCalendar svg g g').click(postPopUp);
});