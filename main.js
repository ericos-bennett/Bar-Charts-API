/*----------------
--TEST VARIABLES--
----------------*/

// Test element to build the chart inside
const testElement = '#bar-box';

// Test data without label names
const testData1 = [60, 200, 150, 400];

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
  labelColor: 'black/#000000/rgb(100,200,100)/rgba(123,123,123,0.4)',
  // barSpacing effects bar width
  barSpacing: '10px/10%',
  title: 'My Chart',
  titleSize: '30px',
  titleColor: 'red'
};

/*----------------
--PREPARE LAYOUT--
----------------*/

// Add padding and flexbox properties to the selected element
const prepareLayout = function (element) {
  $(element).css({ padding: '2em', 'box-sizing': 'border-box' });
  // Add a placeholder title div
  $(element).append('<div id="bar-chart-title"></div>');
  // Add the bar chart contents div and add flexbox
  $(element).append('<div id="bar-chart-content"></div>');
  $('#bar-chart-content').css({
    display: 'flex',
    'justify-content': 'space-evenly',
    'padding-top': '1em'
  });
};

/*-----------
--ADD TITLE--
-----------*/

// Add title details
const addTitle = function (options) {
  $('#bar-chart-title').append('<h2>' + options.title + '</h2>');
  $('#bar-chart-title h2').css({
    'font-size': options.titleSize,
    color: options.titleColor
  });
};

/*----------
--ADD BARS--
----------*/

const addBars = function (data, options) {
  // Loop through the input array for each value
  $.each(data, function (i, val) {
    // Create the DOM element to be inserted for each
    let barDiv = '<div class="bar-div"></div>';
    let barLabel = '<h2 class="bar-label">' + val + '</h2>';
    let bar =
      '<div id=bar' + i + ' class="bar">' + barDiv + barLabel + '</div>';

    // Determine the bar height for each
    let barHeight = val + 'px';

    // Append the new element as a child node of the selected element
    $('#bar-chart-content').append(bar);

    // Specify the height, width, border, and color of each bar
    $('#bar' + i + ' .bar-div').css({
      height: barHeight,
      width: '30px',
      border: '1px solid black',
      'background-color': options.barColor
    });
  });
};

/*--------------------------
--MAIN FUNCTION STATEMENTS--
-------------------------*/

// Template for the final API function
const drawBarChart = function (data, options, element) {
  prepareLayout(element);
  addTitle(options);
  addBars(data, options);
};

drawBarChart(testData1, testOptions, testElement);
