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
  $(`${element} #bar-chart-title`).append('<h2>' + options.title + '</h2>');
  $(`${element} #bar-chart-title`).css({ 'padding-bottom': '1em' });
  $(`${element} #bar-chart-title h2`).css({
    'font-size': options.titleSize,
    color: options.titleColor
  });

  // Add the units message below the title
  $(`${element} #bar-chart-title`).append(
    '<h3>' + options.unitsMessage + '</h3'
  );

  // Add the parent div for the bars and y-axis
  $(element).append('<div id="bar-chart-content"></div>');
  $(`${element} #bar-chart-content`).css({
    display: 'flex'
  });

  // Add the y-axis div
  $(`${element} #bar-chart-content`).append('<div id="y-axis"></div>');
  $(`${element} #y-axis`).css({
    width: '4em'
  });

  // Add the bars div
  $(`${element} #bar-chart-content`).append('<div id="bar-chart-bars"></div>');

  // Add the x-axis div
  $(element).append('<div id="x-axis"></div>');
  $(`${element} #x-axis`).css('height', '4em');

  // Style the bars container now that the other divs have been generated
  $(`${element} #bar-chart-bars`).css({
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

const addBars = function (data, options, element) {
  // Calculate the width of each bar (accounting for their borders)
  let barWidth =
    ($(`${element} #bar-chart-bars`).width() / data.length - 2) *
    ((1 - options.barWidthSpacing) / 1);

  // Determine the height we want to set for the highest bar
  let maxBarHeight = $(`${element} #bar-chart-bars`).height() - 16;

  // Create an array of values from our input objects
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

  bottom = bottom > 0 ? 0 : bottom;

  // Determine the value of the highest bar (accounting for stacked bars)
  let barHeights = [];
  for (i = 0; i < data.length; i++) {
    let barHeight = 0;
    for (k = 0; k < data[i].length; k++) {
      barHeight += data[i][k].value;
    }
    barHeights.push(barHeight);
  }
  let highestValue = barHeights.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // Determine the range between the highest and lowest values
  let range = highestValue - bottom;

  // Loop through the data input to generate bars in the correct places
  for (let i = 0; i < data.length; i++) {
    // Append a bar div to the chart area for each item in the array
    $(`${element} #bar-chart-bars`).append('<div class="bar"></div>');

    // Style the bar with correct flex properties
    $(`${element} .bar:last`).css({
      display: 'flex',
      'flex-direction': 'column-reverse'
    });

    // Loop through each item's elements, which are individual bar sections to be stacked
    for (let k = 0; k < data[i].length; k++) {
      // Determine the bar height for each (accounting for the borders)
      let barHeight = ((data[i][k].value - bottom) / range) * maxBarHeight - 2;

      // Append the bar section to the bar
      $(`${element} .bar:last`).append('<div class="bar-section"></div>');

      // Determine the bar color, using the label color or a default if none specified
      let barColor;
      if (data[i][k].barColor === '') {
        if (data[i][k].labelColor !== '') {
          barColor = data[i][k].labelColor;
        } else {
          barColor = options.defaultBarColor;
        }
      } else {
        barColor = data[i][k].barColor;
      }

      // Specify the size and styling of each bar section
      $(`${element} .bar-section:last`).css({
        height: barHeight,
        width: barWidth,
        display: 'flex',
        'justify-content': 'center',
        border: '1px solid black',
        'border-bottom-style': 'none',
        'background-color': barColor
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
        $(`${element} .bar-section:last`).append(
          `<div>${data[i][k].value}</div>`
        );
        $(`${element} .bar-section div:last`).css({
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

const addYAxis = function (data, options, element) {
  // Generate the y-axis bar and style it
  $(`${element} #y-axis`).append('<div id="y-axis-bar"></div>');
  $(`${element} #y-axis-bar`).css({
    height: 'calc(100% + 0.7em)',
    width: '.5px',
    'background-color': 'black',
    'margin-left': '3em',
    position: 'relative'
  });

  // Determine the height to set for the highest bar
  let maxBarHeight = $(`${element} #bar-chart-bars`).height();

  // Create an array of values from our input objects
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

  // Determine the value of the highest bar (accounting for stacked bars)
  let barHeights = [];
  for (i = 0; i < data.length; i++) {
    let barHeight = 0;
    for (k = 0; k < data[i].length; k++) {
      barHeight += data[i][k].value;
    }
    barHeights.push(barHeight);
  }
  let highestValue = barHeights.reduce(function (a, b) {
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
    $(`${element} #y-axis-bar`).append(
      `<span>${tickValueLabel} &#8212;</span>`
    );
    $(`${element} #y-axis-bar span`)
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

const addXAxis = function (data, options, element) {
  // Generate the x-axis bar and style it
  $(`${element} #x-axis`).append('<span id="x-axis-bar"></span>');
  $(`${element} #x-axis-bar`).css({
    width: 'calc(100% - 2.5em)',
    height: '1px',
    'background-color': 'black',
    position: 'relative',
    float: 'right'
  });

  // Generate and style the container for the x-axis-ticks
  $(`${element} #x-axis`).append('<div id="x-axis-ticks"></div>');
  $(`${element} #x-axis-ticks`).css({
    width: $(`${element} #bar-chart-bars`).width(),
    float: 'right',
    display: 'flex',
    'justify-content': 'space-around',
    transform: 'translate(0,-0.5em)'
  });

  // Add ticks for each bar in the chart and style them
  for (let i = 0; i < data.length; i++) {
    $(`${element} #x-axis-ticks`).append('<span></span>');
  }
  $(`${element} #x-axis-ticks span`).css({
    width: '.5px',
    height: '1em',
    'background-color': 'black'
  });

  // Generate and style the container for the x-axis-labels
  $(`${element} #x-axis`).append('<div id="x-axis-labels"></div>');
  $(`${element} #x-axis-labels`).css({
    width: $(`${element} #bar-chart-bars`).width(),
    float: 'right',
    display: 'flex',
    'justify-content': 'space-around',
    transform: 'translate(0,-0.2em)'
  });

  // Add labels for each bar section in the chart
  for (i = 0; i < data.length; i++) {
    $(`${element} #x-axis-labels`).append(`<div class="bar-labels"></div>`);
    $(`${element} .bar-labels:last`).css({
      display: 'flex',
      width: '0',
      'flex-grow': '1',
      'flex-direction': 'column-reverse',
      'justify-content': 'flex-end'
    });
    for (k = 0; k < data[i].length; k++) {
      $(`${element} .bar-labels:last`).append(
        `<div class="label">${data[i][k].label}</div>`
      );

      // Add the label color, use the bar color or a default if none specified
      let labelColor;
      if (data[i][k].labelColor === '') {
        if (data[i][k].barColor !== '') {
          labelColor = data[i][k].barColor;
        } else {
          labelColor = options.defaultLabelColor;
        }
      } else {
        labelColor = data[i][k].labelColor;
      }
      $(`${element} .label:last`).css({
        color: labelColor,
        margin: '0 auto',
        'white-space': 'nowrap'
      });
    }
  }

  // Rotate all x-axis labels if one of them overflows
  let labelOverflow = false;
  $(`${element} .bar-labels`).each(function () {
    if ($(this)[0].scrollWidth - $(this).width() > 1) {
      $(`${element} .label`).css({
        transform: 'rotate(-30deg) translate(-40%,-0.2em)',
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
  addBars(data, options, element);
  addYAxis(data, options, element);
  addXAxis(data, options, element);
};

/*--------------------------
--BAR BOX 1 TEST VARIABLES--
--------------------------*/

const testElement1 = '#barbox1';

const testData1 = [
  [
    {
      value: 40,
      label: 'Jean',
      barColor: '',
      labelColor: '#004e00'
    },
    {
      value: 20,
      label: 'Mark',
      barColor: '#008900',
      labelColor: ''
    }
  ],
  [
    {
      value: 110,
      label: 'Lauren',
      barColor: '#4e0000',
      labelColor: ''
    },
    {
      value: 80,
      label: 'Eric',
      barColor: '#b10000',
      labelColor: ''
    }
  ],
  [
    {
      value: 160,
      label: 'Will',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 25,
      label: 'Julien',
      barColor: '#3d405b',
      labelColor: ''
    },
    {
      value: 17,
      label: 'Roman',
      barColor: '#3b3bc4',
      labelColor: ''
    },
    {
      value: 82,
      label: 'Elizabeth',
      barColor: '#6262ff',
      labelColor: ''
    }
  ]
];

const testOptions1 = {
  title: 'Racing Distances',
  titleSize: '40px',
  titleColor: '#4e0000',
  unitsMessage: 'KMs covered by each race participant by group',
  valueLabelPosition: 'top',
  yAxisDivisions: 4,
  barWidthSpacing: '0.25',
  defaultBarColor: '#a67f00',
  defaultLabelColor: '#black'
};

/*--------------------------
--BAR BOX 2 TEST VARIABLES--
--------------------------*/

const testElement2 = '#barbox2';

const testData2 = [
  [
    {
      value: 2.6,
      label: 'Aluminum',
      barColor: '#b6b6b6',
      labelColor: 'black'
    }
  ],
  [
    {
      value: 7.87,
      label: 'Iron',
      barColor: '#453a3c',
      labelColor: ''
    }
  ],
  [
    {
      value: 8.96,
      label: 'Copper',
      barColor: '',
      labelColor: '#b87333'
    }
  ],
  [
    {
      value: 19.1,
      label: 'Uranium',
      barColor: 'purple',
      labelColor: ''
    }
  ],
  [
    {
      value: 19.3,
      label: 'Gold',
      barColor: 'gold',
      labelColor: 'black'
    }
  ]
];

const testOptions2 = {
  title: 'Densities of Metals',
  titleSize: '30px',
  titleColor: '',
  unitsMessage: 'Measured in grams per cubic centimeter',
  valueLabelPosition: 'center',
  yAxisDivisions: 4,
  barWidthSpacing: '0.1',
  defaultBarColor: '#',
  defaultLabelColor: '#'
};

/*--------------------------
--BAR BOX 3 TEST VARIABLES--
--------------------------*/

const testElement3 = '#barbox3';

const testData3 = [
  [
    {
      value: 12.3,
      label: 'Morocco',
      barColor: 'darkred',
      labelColor: 'black'
    }
  ],
  [
    {
      value: 15.2,
      label: 'United Arab Emirates',
      barColor: 'darkgreen',
      labelColor: 'black'
    }
  ],
  [
    {
      value: 62.9,
      label: 'China',
      barColor: 'red',
      labelColor: 'black'
    }
  ],
  [
    {
      value: 79.7,
      label: 'United States',
      barColor: 'lightblue',
      labelColor: 'black'
    }
  ],
  [
    {
      value: 89.4,
      label: 'France',
      barColor: 'darkblue',
      labelColor: 'black'
    }
  ]
];

const testOptions3 = {
  title: 'Popular Tourist Destinations',
  titleSize: '30px',
  titleColor: '',
  unitsMessage:
    'Millions of international tourists in 2018. Stats for the top country in each geographic area.',
  valueLabelPosition: 'top',
  yAxisDivisions: 4,
  barWidthSpacing: '0.1',
  defaultBarColor: '#',
  defaultLabelColor: '#'
};

/*--------------------------
--BAR BOX 4 TEST VARIABLES--
--------------------------*/

const testElement4 = '#barbox4';

const testData4 = [
  [
    {
      value: 3,
      label: 'Jan',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 5,
      label: 'Feb',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 6,
      label: 'Mar',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 9,
      label: 'Apr',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 12,
      label: 'May',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 15,
      label: 'Jun',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 17,
      label: 'Jul',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 17,
      label: 'Aug',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 14,
      label: 'Sep',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 10,
      label: 'Oct',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 6,
      label: 'Nov',
      barColor: '',
      labelColor: ''
    }
  ],
  [
    {
      value: 4,
      label: 'Dec',
      barColor: '',
      labelColor: ''
    }
  ]
];

const testOptions4 = {
  title: 'Vancouver Climate',
  titleSize: '50px',
  titleColor: '#000062',
  unitsMessage: 'Average daily temperature in degrees celcius, per month',
  valueLabelPosition: 'center',
  yAxisDivisions: 17,
  barWidthSpacing: '0',
  defaultBarColor: 'lightblue',
  defaultLabelColor: ''
};

/*---------------------------
--GENERATE THE 4 BAR CHARTS--
---------------------------*/

$(document).ready(drawBarChart(testData1, testOptions1, testElement1));
$(document).ready(drawBarChart(testData2, testOptions2, testElement2));
$(document).ready(drawBarChart(testData3, testOptions3, testElement3));
$(document).ready(drawBarChart(testData4, testOptions4, testElement4));
