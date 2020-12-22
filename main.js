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
  200,
  150,
  400,
  600,
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
  [10, 'el1'],
  [20, 'el2'],
  [30, 'el3']
];

// Options object template
const testOptions = {
  valuesPosition: 'top/centre/bottom',
  // barColor and labelColor can be arrays for multiple colors
  barColor: 'blue',
  labelColor: 'green',
  // barSpacing effects bar width
  barSpacing: '10px/10%',
  title: 'My Chart',
  titleSize: '40px',
  titleColor: 'red',
  yAxisTicks: 5
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
    'justify-content': 'space-evenly',
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
  let barWidth = contentWidth / data.length - 2;

  // Determine the height we want to set for the highest bar
  let maxBarHeight = $('#bar-chart-bars').height();

  // **Dertermine the value of the highest data point
  let highestValue = data.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // **Loop through the input array for each value
  $.each(data, function (i, val) {
    // Create the DOM element to be inserted for each
    let barDiv = '<div class="bar-div"></div>';
    let bar = '<div id=bar' + i + ' class="bar">' + barDiv + '</div>';

    // Determine the bar height for each (accounting for the borders)
    let barHeight = (val / highestValue) * maxBarHeight - 2;

    // Append the new element as a child node of the selected element
    $('#bar-chart-bars').append(bar);

    // Specify the height, width, border, and color of each bar
    $('#bar' + i + ' .bar-div').css({
      height: barHeight,
      width: barWidth,
      border: '1px solid black',
      'background-color': options.barColor
    });
  });
};

/*------------
--ADD Y-AXIS--
------------*/

const addYAxis = function (data, options) {
  // Generate y-axis bar
  $('#y-axis').append('<div id="y-axis-bar"></div>');
  $('#y-axis-bar').css({
    height: '100%',
    width: '1px',
    'background-color': 'black',
    margin: '0 auto',
    position: 'relative'
  });

  // Determine the height we want to set for the highest bar
  let maxBarHeight = $('#bar-chart-bars').height();

  // **Dertermine the value of the highest data point
  let highestValue = data.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // Add evenly spaced ticks and their values to the y-axis bar, amount qualified in options
  for (let i = 0; i < options.yAxisTicks; i++) {
    let tickValue = highestValue * ((i + 1) / (options.yAxisTicks + 1));
    $('#y-axis-bar').append('<span>' + tickValue + ' &#8212;</span>');
    $('#y-axis-bar span')
      .eq(i)
      .css({
        position: 'absolute',
        'white-space': 'nowrap',
        bottom: `calc(${(tickValue / highestValue) * maxBarHeight}px - 0.5em)`,
        right: '-0.5em'
      });
  }
};

/*------------
--ADD X-AXIS--
------------*/

const addXAxis = function (data, options) {
  // Generate x-axis bar
  $('#x-axis').append('<div id="x-axis-bar"></div>');
  $('#x-axis-bar').css({
    width: '100%',
    height: '1px',
    'background-color': 'black',
    margin: 'auto',
    position: 'relative',
    top: '50%'
  });

  // Calculate the chart content width and width of each bar
  let contentWidth = $('#bar-chart-bars').width();
  let barWidth = contentWidth / data.length;

  // Add ticks for each bar in the chart
  for (let i = 0; i < data.length; i++) {
    $('#x-axis-bar').append('<span>|</span>');
    $('#x-axis-bar span')
      .eq(i)
      .css({
        position: 'absolute',
        top: '-0.5em',
        right: `${i * barWidth + barWidth / 2 - 2}px`
      });
  }
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

drawBarChart(testData1, testOptions, testElement);
