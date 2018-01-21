const cellSize = 90;
const todayDate = d3.timeFormat(`%Y-%m-%d`)(new Date());
let moods = [ /*0excited*/ "#ffcb86", /*1happy*/ "#faf734", /*2calm*/ "#94edff", /*3focused*/ "#c9d2e9", /*4rested*/ "#d9a6e4",
  /*5Energetic*/"#ff5ea1",/*6overwhelmed*/"#962e65", /*7sick*/ "#bcce34", /*8tired*/ "#265bbd", /*9frustrated*/ "#d10000",
  /*10sad*/"#c4c4c4", /*11scattered*/ "#657475", /*12nervous*/ "#51c516"
];

function CreateMonthlyHeatMap(year, month) {
  // initialize width and height
  const spacingX = 1.1;
  const spacingY = 1.1;
  const width = spacingX * (7 * cellSize);
  const height = 150 + (6 * cellSize);

  var newWeek;
  var dayYCords = cellSize; // initialize the first rect y cords
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
    })
    .attr('class', 'day');

  //append defs for gradient
  let grad = heatmapGroup.append('defs')
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

  //append a rectangle for that specific group
  heatmapGroup.append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr(`fill`, (d) => `url(#grad-${d3.timeFormat(`%Y-%m-%d`)(d)})`)
    .attr('x', (d) => { // places the day rectangle in some x cords
      let x;
      if (d.getDay() === 0) { // places the day text in some x cords which is in some rectangle
        x = 7 * cellSize; // then to not use the 0 from the getDay(), we default to 7
      } else {
        x = d.getDay() * cellSize;
      }
      return spacingX * (x - cellSize) + 2;
    })
    .attr('y', (d) => { // places the day rectangle in some y cords
      newWeek = d.getDay();
      let prevYCords = dayYCords;
      let answer = dayYCords;
      if (newWeek === 0) {
        dayYCords += cellSize;
        answer = prevYCords;
      }
      return spacingY * answer;
    });
    //.attr('rx', '20') these two makes round edges
    //.attr('ry', '20')
    //.attr('class', 'day');

  //day number
  heatmapGroup.append('text')
    .attr('x', (d) => { // places the day text in some x cords which is in some rectangle
      return Number($(`#${d3.timeFormat(`%Y-%m-%d`)(d)} rect`).attr('x')) + cellSize / 2; //finds the rect element, and gets it's x value
    })
    .attr('y', (d) => { // places the day text in some y cords which is in some rectangle
      return Number($(`#${d3.timeFormat(`%Y-%m-%d`)(d)} rect`).attr('y')) + cellSize / 2 + 7.33/2; //finds the rect element, and gets it's y value
    })
    .attr('class', 'dayNum')
    .style('text-anchor', 'middle')
    .text((d) => {
      return d3.timeFormat('%-d')(d); // just render the day number
    });

  // Render year
  mainGroup.append('text')
    .attr(`x`, width / 2 + 2)
    .attr('y', 15)
    .style('text-anchor', 'middle')
    .style('font-size', '20px')
    .text((d) => {
      return d3.timeFormat('%Y')(new Date(year, month));
    });
  //Render Month name
  mainGroup.append('text')
    .attr('class', 'monthName')
    .attr(`x`, width / 2 + 2)
    .attr('y', 60)
    .style('text-anchor', 'middle')
    .text((d) => {
      return d3.timeFormat('%B')(new Date(year, month));
    });

  // Render week days
  mainGroup.append('g')
    .attr('transform', `translate(0,90)`)
    .selectAll('.weekName')
    .data((d) => d3.range(7))
    .enter()
    .append('text')
    .style('text-anchor', 'middle')
    .attr('class', 'weekName')
    .attr('x', (d) => {
      return (cellSize * d) * spacingX + 45 + 2;
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

  heatmapSvg
    .attr("height", $('.monthCalendar svg g').height())
    .attr('width', $('.monthCalendar svg g').width()+ 4);

  let padding = 15;
  $('.monthCalendar').css({
    'width': `${$('.monthCalendar svg g').width() + padding*2}px`,
    'height': `${$('.monthCalendar svg g').height() + padding*2}px`,
  });
  $('.legend svg').attr('height', $('.monthCalendar svg g').height() + padding * 2);
}

function CreateLegend() {
  const size = 30;
  const spacingY = 1.12;
  // creates the legend which shows what color represents what kind of day
  var legendSvg = d3.select('.legend').selectAll('svg.legend')
    .enter()
    .append('svg')
    .data([1])
    .enter()
    .append('svg')
    .attr('width', 300 + 30)
    .attr('height', $('.monthCalendar').css('height'))
    .append('g')
    .attr('transform', 'translate(0,0)')
    .selectAll('.legend-grid')
    .data(() => d3.range(moods.length))
    .enter()
    .append('g');

  legendSvg.append('rect')
    .attr('width', size)
    .attr('height', size)
    .attr('x', (d) => 0)
    .attr('y', (d) => (d * size) * spacingY)
    .attr('class', (d) => `${d}`)
    .attr('fill', (d) => moods[d]);
  legendSvg.append('text')
    .attr('x', (d) => size + 5)
    .attr('y', (d) => Number($(`.legend .${d}`).attr('y')) + 18)
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
          return `- Rested`
          break;
        case 5:
          return `- Energetic`;
          break;
        case 6:
          return `- Overwhelmed / Stressed`
          break;
        case 7:
          return `- Sick / Headache`
          break;
        case 8:
          return `- Tired`;
          break;
        case 9:
          return `- Frustrated / Angry`;
          break;
        case 10:
          return `- Sad / Hopeless`;
          break;
        case 11:
          return `- Scattered`;
          break;
        case 12:
          return `- Nervous / Anxious`;
          break;
      }
    });
}

function gradient(date, colors) { // colors the day in gradient
  $(`#${date} rect`).addClass('colored');
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

function loadMonth() { // colors the month according to the data got from the server
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
  $(`#${todayDate}`).find('rect').addClass('today');
  $(`#${todayDate}`).find('text').addClass('today-text');
  //gradient("2018-01-21", [["#e100ff", 10],["#15f7ff", 10],["#0099ff", 50],["#002fff", 80]]); // this was a test
}

let form;
let clickedDate;

function postPopUp() {
  clickedDate = $(this).attr('id'); //find the date of the clicked day
  const clickedDateObj = new Date(clickedDate); //assign date objects, so that the if statement is more readable
  const todayDateObj = new Date(todayDate);

  if (clickedDateObj.getTime() > todayDateObj.getTime()) { // if clicked dates miliseconds are larger than current days, then you just cant do anything
    console.log("You cannot edit this day, cause it's yet to come");

  } else if ($(this).find('rect').hasClass('colored')) { // if this date element is a colored(already has some emotion in it) one,
    // then show confirmation window if they want to edit it

    const warning = `<form>` +
      `<div class="form-group">` +
      `<label>Are you sure you want to edit this day?</label>` +
      `</div> ` +
      `<div class="btn-group center-block" style="width: 210px;">` +
      `<button class="btn btn-success" type="button" onclick="displayForm()">I'm sure!</button>` +
      `<button class="btn btn-danger" type="button" onclick="closePostPopUp()">I'm not sure!</button>` +
      `</div>` +
      `</form>`;

    $('.dayForm').html(warning);
    if ($('.dayForm').hasClass('hidden')) { // if the day form is hidden,
      $('.dayForm').removeClass('hidden'); //  just show it.

    }
  } else { // if the clicked element is not yet colored
    $('.dayForm').html(form); //display the form for the emotion to be sent to db
    $('.dayForm').find('input[name=date]').val(clickedDate); // insert the clicked date to the non-editable input value
    if ($('.dayForm').hasClass('hidden')) { // if the day form is hidden,
      $('.dayForm').removeClass('hidden'); //  just show it.

    }
  }
}

function displayForm() {
  $('.dayForm').html(form);
  $('.dayForm').find('input[name=date]').val(clickedDate); // insert the clicked date to the non-editable input value
}

function closePostPopUp() {
  $('.dayForm').addClass('hidden');
}

let fullYear = new Date().getFullYear();
let fullMonth = new Date().getMonth();

function minusMonth() {
  if (fullMonth === 0) {
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

function plusMonth() {
  if (fullMonth === 11) {
    fullYear++;
    fullMonth = 0;
  } else {
    fullMonth++;
  }

  console.log(fullYear, fullMonth)
  $('.monthCalendar svg').remove();
  CreateMonthlyHeatMap(fullYear, fullMonth);
  loadMonth();
  $('.monthCalendar svg g g').click(postPopUp);
}
function addMood(){
  
}

$(document).ready(() => {
  CreateMonthlyHeatMap(fullYear, fullMonth);
  CreateLegend();
  loadMonth();
  form = $('.dayForm').html();
  $('.monthCalendar svg g g').click(postPopUp);
});