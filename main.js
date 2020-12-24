/*----------------
--TEST VARIABLES--
----------------*/

// Test element to build the chart inside
const testElement = '#bar-box';

// Test data without label names
const testData1 = [
  60,
  200,
  150,
  400,
  60,
  200,
  150,
  400,
  60,
  2000,
  1500,
  400,
  950,
  200,
  150,
  400,
  200,
  150,
  400,
  60,
  400
];

// Test data with label names
const testData2 = [
  [10, 'Canada'],
  [20, 'Mozambique'],
  [30, 'Paraguay'],
  [140, 'USA']
];

// Options object template
const testOptions = {
  valuesPosition: 'top',
  // barColor and labelColor can be arrays for multiple colors
  barColor: 'turquoise',
  labelColor: 'green',
  // barSpacing effects bar width
  barSpacing: '30',
  title: 'My Chart',
  titleSize: '40px',
  titleColor: 'pink',
  yAxisTicks: 4
};

/*----------------
--PREPARE LAYOUT--
----------------*/

const prepareLayout = function (element, options) {
  // Initial styling for the entire element
  $(element).css({
    padding: '2em',
    'box-sizing': 'border-box',
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
  $('#x-axis').css({
    // Why does this work as 3em instead of 2em??
    height: '5em'
  });

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
    (contentWidth / data.length - 2) * ((100 - options.barSpacing) / 100);

  // Determine the height we want to set for the highest bar
  let maxBarHeight = $('#bar-chart-bars').height();

  // Determine the chart values to use, depending on the data input type
  let chartValues = [];
  for (i = 0; i < data.length; i++) {
    if (typeof data[i] === 'number') {
      chartValues.push(data[i]);
    } else if (typeof data[i] === 'object') {
      chartValues.push(data[i][0]);
    }
  }

  // **Dertermine the value of the highest data point
  let highestValue = chartValues.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // **Loop through the input array for each value
  $.each(chartValues, function (i, val) {
    // Determine the bar height for each (accounting for the borders)
    let barHeight = (val / highestValue) * maxBarHeight - 2;

    // Append a bar div to the chart area
    $('#bar-chart-bars').append('<div class="bar"></div>');

    // Specify the size and styling of each bar
    $('.bar').eq(i).css({
      height: barHeight,
      width: barWidth,
      border: '1px solid black',
      'background-color': options.barColor,
      display: 'flex',
      'justify-content': 'center'
    });

    // Determine the vertical position of the bar's value label based on user input
    let valueLabelOffset;
    switch (options.valuesPosition) {
      case 'top':
        valueLabelOffset = '-1.2em';
        break;
      case 'centre':
        valueLabelOffset = `calc(${barHeight / 2}px - 0.5em`;
        break;
      case 'bottom':
        valueLabelOffset = `calc(${barHeight}px - 1.2em`;
        break;
    }

    // Add the value label for each bar if required
    if (options.valuesPosition !== 'none') {
      $('.bar').eq(i).append(`<div>${val}</div>`);
      $('.bar div').eq(i).css({
        position: 'relative',
        top: valueLabelOffset
      });
    }
  });
};

/*------------
--ADD Y-AXIS--
------------*/

const addYAxis = function (data, options) {
  // Generate y-axis bar
  $('#y-axis').append('<div id="y-axis-bar"></div>');
  $('#y-axis-bar').css({
    height: 'calc(100% + 2em)',
    width: '.5px',
    'background-color': 'black',
    margin: '0 auto',
    position: 'relative'
  });

  // Determine the height we want to set for the highest bar
  let maxBarHeight = $('#bar-chart-bars').height();

  // Determine the chart values to use, depending on the data input type
  let chartValues = [];
  for (i = 0; i < data.length; i++) {
    if (typeof data[i] === 'number') {
      chartValues.push(data[i]);
    } else if (typeof data[i] === 'object') {
      chartValues.push(data[i][0]);
    }
  }

  // **Dertermine the value of the highest data point
  let highestValue = chartValues.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // Add evenly spaced ticks and their values to the y-axis bar, amount qualified in options
  for (let i = 0; i < options.yAxisTicks; i++) {
    let tickValue = highestValue * ((i + 1) / (options.yAxisTicks + 1));
    // Determine the label significant digits, based on the number size
    let tickValueLabel =
      tickValue >= 10000 ? tickValue.toPrecision(2) : tickValue.toPrecision(4);
    $('#y-axis-bar').append(`<span>${tickValueLabel} &#8212;</span>`);
    $('#y-axis-bar span')
      .eq(i)
      .css({
        position: 'absolute',
        'white-space': 'nowrap',
        top: `calc(${
          maxBarHeight - (tickValue / highestValue) * maxBarHeight
        }px - 0.5em)`,
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
    width: 'calc(100% - 1em)',
    height: '1px',
    'background-color': 'black',
    position: 'relative',
    top: '1em',
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
    transform: 'translate(0,0.5em)'
  });

  // Add ticks for each bar in the chart
  for (let i = 0; i < data.length; i++) {
    $('#x-axis-ticks').append('<span></span>');
    $('#x-axis-ticks span').eq(i).css({
      width: '.5px',
      height: '1em',
      'background-color': 'black'
    });
  }

  // Generate and style the x-axis-labels div
  $('#x-axis').append('<div id="x-axis-labels"></div>');
  $('#x-axis-labels').css({
    width: $('#bar-chart-bars').width(),
    float: 'right',
    display: 'flex',
    'justify-content': 'space-around',
    transform: 'translate(0,0.7em)'
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
        transform: 'rotate(-30deg) translate(-50%,0)',
        'text-align': 'right'
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

drawBarChart(testData2, testOptions, testElement);
