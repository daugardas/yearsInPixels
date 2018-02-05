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

function gradient(date, colors, dataID) { // colors the day in gradient
  $(`#${date} rect`).addClass('colored');
  d3.select(`g[id="${date}"]`).attr(`data-dbID`, dataID);
  let gradient = d3.select(`g[id="${date}"]`).select(`linearGradient`); // selects groups linearGradient elment
  gradient.selectAll('stop').remove(); //and removes the current gradients in it
  for (let i = 0; i < colors.length; i++) { // goes through gradient colors loop
    const element = colors[i];
    console.log(date, element);
    
    if (i === 0) { // if the grad color is the first
      gradient.append('stop') // then just append one element
        .attr(`offset`, `${element[1]}%`)
        .attr(`style`, `stop-color: ${element[0]}; stop-opacity: 1`);
    } else if(i === colors.length - 1){ // if the grad color is the last one
      gradient.append('stop') // then just append one element
        .attr(`offset`, `${100 - element[1]}%`) // but offset it by substracting moods percentage from 100
        .attr(`style`, `stop-color: ${element[0]}; stop-opacity: 1`);
    } else { // if the grad color is somewhere in the middle
      gradient.append('stop') // then append two elements, because they need to have their lines straight
        .attr(`offset`, `${colors[i - 1][1]}%`)
        .attr(`style`, `stop-color: ${element[0]}; stop-opacity: 1`);

      gradient.append('stop')
        .attr(`offset`, `${100 - colors[i + 1][1]}%`) // offsets to the next colors array offset, offset it by substracting moods percentage from 100 so basically it sets the ending
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
    console.log(answer);
    answer.forEach(element => {
      const date = element[0];
      let colors = [];
      element[1].forEach(mood => {
        colors.push([moods[mood[0]], mood[1]]);
      });
      colors.sort((a,b)=> a[1] - b[1]);
      gradient(date, colors);
    });
  }).fail((xhr, status, error) => {
    console.log('Error', error);
  });
  $(`#${todayDate}`).find('rect').addClass('today');
  $(`#${todayDate}`).find('text').addClass('today-text');
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
    if ($('.confirmation').hasClass('hidden')) { // if the day form is hidden,
        $('.confirmation').removeClass('hidden'); //  just show it.
    }

  } else { // if the clicked element is not yet colored
    $('.dayForm').find('input[name=date]').val(clickedDate); // insert the clicked date to the non-editable input value
    if ($('.dayForm').hasClass('hidden')) { // if the day form is hidden,
      $('.dayForm').removeClass('hidden'); //  just show it.

    }
  }
}

function displayForm() {
  $('.dayForm').find('input[name=date]').val(clickedDate); // insert the clicked date to the non-editable input value
  $('.confirmation').addClass('hidden');
  $('.dayForm').removeClass('hidden');
}

function closePostPopUp() {
  $('.confirmation').addClass('hidden');
}
function closeFormPopUp(){
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
let sliders = {};
let slidesCount = 0;

function addMood(){
  if(slidesCount === 0){
    $(`.slider`).val(100);
  }
  slidesCount++;
  $('.dayForm .form-group').append(`<div class="mood" id="mood${slidesCount}"></div>`);
  //$(`#mood${slidesCount}`).html(moodSelector);
  $('#mood0 select').clone().appendTo(`#mood${slidesCount}`);
  $(`#mood${slidesCount} select`).attr(`name`, `emotion${slidesCount}`)
  $(`#mood${slidesCount} select`).val(slidesCount);
  $(`#mood${slidesCount}`).append(`<div class="mood-slider"></div>`);
  let input = `<input class="slider" id="mood${slidesCount}-slider" name="mood${slidesCount}-slider" type="range" min="0" max="100" value="0" step="5" oninput="sliderChange('${slidesCount}')">`;
  let output = `<label id="mood${slidesCount}-output" for="mood${slidesCount}-slider">0%</label>`;
  $(`#mood${slidesCount} .mood-slider`).append(input);
  $(`#mood${slidesCount} .mood-slider`).append(output);
  sliders[slidesCount] = {
    slider: document.getElementById(`mood${slidesCount}-slider`),
    output: document.getElementById(`mood${slidesCount}-output`)
  };
  sliders[slidesCount].output.innerHTML = sliders[slidesCount].slider.value + "%";
  if(slidesCount === 2){
    $(`.add-mood`).remove();
  }
}

function sliderChange(sliderID){
  
  let slider = sliders[sliderID].slider;
  let output = sliders[sliderID].output;
  let value;
  let otherSlideVals = [];
  slider.onchange = function(){
    value = this.value;
    output.innerHTML = this.value + "%";

    let input = +value;
    let delta = 100 - input;
    let sum = 0;
    let length = slidesCount + 1;
    let siblings = [];

    for (const slide in sliders) {
      if (sliders.hasOwnProperty(slide)) {
        if(slide !== sliderID){
          // reset values for other slides relatively
          siblings.push(sliders[slide].slider);
          sum += +sliders[slide].slider.value;
        }
      }
    };
    //console.log(siblings);
    let partial = 0;
    siblings.forEach((siblingSlider, i)=>{
      let val = +siblingSlider.value;
      let fraction = 0;

      //calculate fraction 
      if(sum <= 0){
        fraction = 1 / (length - 1);
      }else{
        fraction = val / sum;
      }
      // The last element will correct rounding errors
      if (i >= length) {
        val = 100 - partial;
      } else {
        val = delta * fraction;
        partial += val;
      }
      siblingSlider.value = val;
      // havent learnt regexp yet, so i splited a bunch of arrays
      sliders[+siblings[i].id.split('-').map((el)=> el.split('mood'))[0][1]].output.innerHTML = Math.round(val) + "%";
    });
    
  };
  if(slidesCount === 0){
    $(`.slider`).val(100);
  }
}
function disableMood(selectEl){
  console.log(selectEl.name, selectEl.value);
  $(`.mood .alert`).remove();
  let sameCount = 0;
  for (const i in sliders) {
    if (sliders.hasOwnProperty(i)) {
      if(selectEl.name.split('emotion')[1] !== i){
        if($(`select[name="emotion${i}"]`).val() === selectEl.value){
          console.log(`same values`);
          sameCount++;
          if(sameCount < 2){
            $(selectEl).before(`<p class="alert alert-danger">There can't be same moods</p>`);
            $(`.btn-primary[type='submit']`).prop('disabled', true);
          }
        }
      }
      
    }
  }
  if(sameCount == 0){
    $(`.btn-primary[type='submit']`).prop('disabled', false);
  }
}
$(document).ready(() => {
  CreateMonthlyHeatMap(fullYear, fullMonth);
  CreateLegend();
  loadMonth();
  $('.monthCalendar svg g g').click(postPopUp);
  sliders[0] = {
    slider: document.getElementById(`mood0-slider`),
    output: document.getElementById(`mood0-output`)
  };
  sliders[0].output.innerHTML = sliders[0].slider.value + "%";
  //default the first mood, and set it to noneditable, it will be editable if you add more moods
  $(`#mood0-slider`).val(100);
  $(`#mood0-output`).html(`100%`);
});