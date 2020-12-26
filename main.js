/*----------------
--TEST VARIABLES--
----------------*/

const testElement = '#bar-box';

const testData = [
  [
    {
      value: 70,
      label: 'Zimbabwe',
      barColor: 'red',
      labelColor: 'blue'
    },
    {
      value: 10,
      label: 'Canada',
      barColor: 'pink',
      labelColor: 'yellow'
    }
  ],
  [
    {
      value: 20,
      label: 'Mozambique',
      barColor: 'orange',
      labelColor: 'orange'
    },
    {
      value: 30,
      label: 'Paraguay',
      barColor: 'blue',
      labelColor: 'red'
    }
  ],
  [
    {
      value: 120,
      label: 'USA',
      barColor: 'pink',
      labelColor: 'blue'
    }
  ]
];

const testOptions = {
  title: 'My Chart',
  titleSize: '40px',
  titleColor: 'blue',
  valueLabelPosition: 'center',
  yAxisDivisions: 4,
  barWidthSpacing: '0.25',
  defaultBarColor: 'turquoise',
  defaultlabelColor: 'green'
};

/*----------------
--PREPARE LAYOUT--
----------------*/

const prepareLayout = function (element, options) {
  // Initial styling for the entire element
  $(element).css({
    padding: '2em',
    'box-sizing': 'border-box',
    'font-size': '16px',
    display: 'flex',
    'flex-direction': 'column'
  });

  // Add the title
  $(element).append('<div id="bar-chart-title"></div>');
  $('#bar-chart-title').append('<h2>' + options.title + '</h2>');
  $('#bar-chart-title').css({ 'padding-bottom': '1em' });
  $('#bar-chart-title h2').css({
    'font-size': options.titleSize,
    color: options.titleColor
  });

  // Add the div for the bars and y-axis
  $(element).append('<div id="bar-chart-content"></div>');
  $('#bar-chart-content').css({
    display: 'flex'
  });

  // Add the y-axis div
  $('#bar-chart-content').append('<div id="y-axis"></div>');
  $('#y-axis').css({
    width: '4em'
  });

  // Add the bars div
  $('#bar-chart-content').append('<div id="bar-chart-bars"></div>');

  // Add the x-axis div
  $(element).append('<div id="x-axis"></div>');
  $('#x-axis').css('height', '4em');

  // Style the bars container now that the other devs have been generated
  $('#bar-chart-bars').css({
    display: 'flex',
    'justify-content': 'space-around',
    'align-items': 'flex-end',
    'flex-grow': '1',
    height:
      $(element).height() -
      $('#bar-chart-title').height() -
      $('#x-axis').height()
  });
};

/*----------
--ADD BARS--
----------*/

const addBars = function (data, options) {
  // Calculate the chart content width and width of each bar (accounting for the borders)
  let contentWidth = $('#bar-chart-bars').width();
  let barWidth =
    (contentWidth / data.length - 2) * ((1 - options.barWidthSpacing) / 1);

  // Determine the height we want to set for the highest bar
  let maxBarHeight = $('#bar-chart-bars').height() - 16;

  // Determine the chart values to use, depending on the data input type
  let chartValues = [];
  for (i = 0; i < data.length; i++) {
    for (k = 0; k < data[i].length; k++) {
      chartValues.push(data[i][k].value);
    }
  }

  // Set the lower boundary of the bars to the lowest value, or 0
  let bottom = chartValues.reduce(function (a, b) {
    return Math.min(a, b);
  });
  if (bottom > 0) {
    bottom = 0;
  }

  // Dertermine the highest input value
  let highestValue = chartValues.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // Determine the range between the highest and lowest values
  let range = highestValue - bottom;

  // Loop through the data input to generate bars in the correct places
  for (let i = 0; i < data.length; i++) {
    // Append a bar div to the chart area for each item in the array
    $('#bar-chart-bars').append('<div class="bar"></div>');

    // Style the bar with correct flex properties
    $('.bar:last').css({
      display: 'flex',
      'flex-direction': 'column-reverse'
    });

    // Loop through each item's elements, which are individual bar sections to be stacked
    for (let k = 0; k < data[i].length; k++) {
      // Determine the bar height for each (accounting for the borders)
      let barHeight = ((data[i][k].value - bottom) / range) * maxBarHeight - 2;

      // Append a bar section to the bar
      $('.bar:last').append('<div class="bar-section"></div>');

      // Specify the size and styling of each bar section
      $('.bar-section:last').css({
        height: barHeight,
        width: barWidth,
        border: '1px solid black',
        'border-bottom-style': 'none',
        'background-color': data[i][k].barColor,
        display: 'flex',
        'justify-content': 'center'
      });

      // Determine the vertical position of the bar section's value label based on user input
      let valueLabelOffset;
      switch (options.valueLabelPosition) {
        case 'top':
          valueLabelOffset = '-1.2em';
          break;
        case 'center':
          valueLabelOffset = `calc(${barHeight / 2}px - 0.5em`;
          break;
        case 'bottom':
          valueLabelOffset = `calc(${barHeight}px - 1.2em`;
          break;
      }

      // Add the value label for each bar section if required
      if (options.valueLabelPosition !== 'none') {
        $('.bar-section:last').append(`<div>${data[i][k].value}</div>`);
        $('.bar-section div:last').css({
          position: 'relative',
          top: valueLabelOffset,
          height: '0'
        });
      }
    }
  }
};

/*------------
--ADD Y-AXIS--
------------*/

const addYAxis = function (data, options) {
  // Generate y-axis bar
  $('#y-axis').append('<div id="y-axis-bar"></div>');
  $('#y-axis-bar').css({
    height: 'calc(100% + 0.7em)',
    width: '.5px',
    'background-color': 'black',
    'margin-left': '3em',
    position: 'relative'
  });

  // Determine the height we want to set for the highest bar
  let maxBarHeight = $('#bar-chart-bars').height();

  // Determine the chart values to use, depending on the data input type
  let chartValues = [];
  for (i = 0; i < data.length; i++) {
    for (k = 0; k < data[i].length; k++) {
      chartValues.push(data[i][k].value);
    }
  }

  // Set the lower boundary of the axes to the lowest value, or 0
  let bottom = chartValues.reduce(function (a, b) {
    return Math.min(a, b);
  });
  if (bottom > 0) {
    bottom = 0;
  }

  // Dertermine the highest input value
  let highestValue = chartValues.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // Determine the range between the highest and lowest values
  let range = highestValue - bottom;

  // Add evenly spaced ticks and their values to the y-axis bar, amount qualified in options
  for (let i = 0; i < options.yAxisDivisions + 1; i++) {
    let tickValue = range * (i / options.yAxisDivisions) + bottom;
    // Determine the label significant digits, based on the number size
    let tickValueLabel =
      tickValue >= 100000 || tickValue <= -100000
        ? tickValue.toPrecision(2)
        : Number(tickValue.toPrecision(4));
    $('#y-axis-bar').append(`<span>${tickValueLabel} &#8212;</span>`);
    $('#y-axis-bar span')
      .eq(i)
      .css({
        position: 'absolute',
        'white-space': 'nowrap',
        top:
          maxBarHeight -
          ((tickValue - bottom) / range) * (maxBarHeight - 16) -
          8,
        right: '-0.5em'
      });
  }
};

/*------------
--ADD X-AXIS--
------------*/

const addXAxis = function (data, options) {
  // Generate the x-axis bar and style it
  $('#x-axis').append('<span id="x-axis-bar"></span>');
  $('#x-axis-bar').css({
    width: 'calc(100% - 2.5em)',
    height: '1px',
    'background-color': 'black',
    position: 'relative',
    float: 'right'
  });

  // Calculate the chart content width and width of each bar
  let contentWidth = $('#bar-chart-bars').width();
  let barWidth = contentWidth / data.length;

  // Generate and style the x-axis-ticks div
  $('#x-axis').append('<div id="x-axis-ticks"></div>');
  $('#x-axis-ticks').css({
    width: $('#bar-chart-bars').width(),
    float: 'right',
    display: 'flex',
    'justify-content': 'space-around',
    transform: 'translate(0,-0.5em)'
  });

  // Add ticks for each bar in the chart and style them
  for (let i = 0; i < data.length; i++) {
    $('#x-axis-ticks').append('<span></span>');
  }
  $('#x-axis-ticks span').css({
    width: '.5px',
    height: '1em',
    'background-color': 'black'
  });

  // Generate and style the x-axis-labels div
  $('#x-axis').append('<div id="x-axis-labels"></div>');
  $('#x-axis-labels').css({
    width: $('#bar-chart-bars').width(),
    float: 'right',
    display: 'flex',
    'justify-content': 'space-around',
    transform: 'translate(0,-0.2em)'
  });

  // If they exist in the data input, add labels for each bar in the chart
  for (i = 0; i < data.length; i++) {
    if (typeof data[i] === 'object') {
      $('#x-axis-labels').append(`<div class="label">${data[i][1]}</div>`);
      $('.label').eq(i).css({
        width: '0',
        'flex-grow': '1',
        'text-align': 'center',
        color: options.labelColor
      });
    }
  }

  // Rotate all x-axis labels if one of them overflows
  let labelOverflow = false;
  $('.label').each(function () {
    if ($(this)[0].scrollWidth - $(this).width() > 1) {
      $('.label').css({
        transform: 'rotate(-30deg) translate(-50%,-0.2em)',
        'text-align': 'right',
        direction: 'rtl'
      });
    }
  });
};

/*--------------------------
--MAIN FUNCTION STATEMENTS--
-------------------------*/

// Template for the final API function
const drawBarChart = function (data, options, element) {
  prepareLayout(element, options);
  addBars(data, options);
  addYAxis(data, options);
  addXAxis(data, options);
};

drawBarChart(testData, testOptions, testElement);
