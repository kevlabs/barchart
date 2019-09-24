

function drawBarChart(data, options, element) {


};


/*

potential classes:
- bar
- group
- chart-area
- chart

*/


/*



//API INTERFACE:
The signature of the function should be as follows:

drawBarChart(data, options, element);
The data parameter will be the data the chart should work from Start with just an Array of numbers
e.g. [1, 2, 3, 4, 5]

The options parameter should be an object which has options for the chart.
e.g. width and height of the bar chart

The element parameter should be a DOM element or jQuery element that the chart will get rendered into.

//STYLING:
- Display a list of SINGLE values, horizontally as a bar chart:
  ** Numerical values should also be DISPLAYED INSIDE of the bar
  ** The POSITION of values should be customizable too: TOP, CENTRE or BOTTOM of the bar.
- BAR WIDTH should be dependent on the total amount of values passed.
- BAR HEIGHT should be dependent on the values of the data.
- BAR PROPS that should be customizable:
  ** Bar Colour
  ** Label Colour
  ** Bar spacing (space between bars)
  ** Bar Chart axes
- X-AXIS should show labels for each data value
- Y-AXIS should show ticks at certain values
- The TITLE of the bar chart:
  ** should be able to be set and shown dynamically
  ** should also be customizable:
    Font Size
    Font Colour

*/




/*
INPUT SCHEMA


*DATA
//top level props:
- group names

//each data series need to have its props such as:
  - name/label
  - colour
  -


//e.g. evolution of NA's population 1970-2010
// 5 data points
const data = {
  groups: [1971, 1981, 1991, 2001, 2011],
  series: [
    {
      label: 'Canada',
      data: [21962032, 24819915, 28037420, 31020596, 33476688],
      backgroundColor: blue
    },
    {
      label: 'Mexico',
      data: [54669000, 71916000, 87890000, 105340000, 115683000],
      backgroundColor: green
    },
    {
      label: 'USA',
      data: [206827000, 229466000, 252981000, 285082000, 311583000],
      backgroundColor: red
    }

  ]

};


*OPTIONS
- chart level options:
  ** width
  ** height
  ** in-between group space
  ** title name, font family, font colour, font size
  ** value units (e.g. inhabitants)
  ** y-axis: step (e.g. every 10,000)
  ** stacked vs inline
  ** font family, font colour, font size (maybe segregate between axis and group/data labels)


const options = {
  chart: {
    height: '300px',
    width: '400px',
    type: 'inline',                     //inline, stacked
    font: {                             //default
      family: 'Arial, sans-serif',
      size: '16px',
      color: '#000',
      weight: 'bold'
    }
  },
  title: {
    label: 'Evolution of North America\'s Population',
    verticalAlignment:'top',            //top, middle, bottom
    font: {                             //if not supplied should default to top level
      family: 'Arial, sans-serif',
      size: '16px',
      color: '#000',
      weight: 'bold'
    }
  },
  x-axis: {
    label: 'Year',
    groupSpaceBetween: '20px',
    dataAlignment: 'center',
    font: {                             //if not supplied should default to top level
      family: 'Arial, sans-serif',
      size: '16px',
      color: '#000',
      weight: 'bold'
    }
  }
  y-axis: {
    label: 'million inhabitants'
    unit: {
      base: 1000000,
      step: 25000000
    },
    font: {                             //if not supplied should default to top level
      family: 'Arial, sans-serif',
      size: '16px',
      color: '#000',
      weight: 'bold'
    }
  }

};


CHART HTML



*/
