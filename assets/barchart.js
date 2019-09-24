

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
    height: '300',                      //in px - default in CSS
    width: '400',                       //in px - default in CSS
    type: 'inline',                     //inline, stacked
    font: {                             //default in CSS
      family: 'Arial, sans-serif',
      size: '14px',                     //in px
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
    font: {                             //if not supplied should default to top level
      family: 'Arial, sans-serif',
      size: '16px',
      color: '#000',
      weight: 'bold'
    }
  }
  y-axis: {
    label: 'million inhabitants',
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

class BarChart {
  constuctor(data, options, container) {

    //validate input
    const safeInput = BarChart.validateInput(data, options, container);
    if (!safeInput) { return false; }

    //init properties
    [this.data, this.options, this.container] = safeInput;

    //start rendering chart




  }
  static validateInput(data, options, container) {
    try {

      //make sure element exists
      if (Object.getPrototypeOf(container) !== '[object HTMLElement]') {
        throw 'Element is not an HTML element!';
      }

      //CHECK DATA OBJECT
      if(typeof data !== 'object') {
        throw 'Data input is not an object!';
      } else if (!data.groups || !data.series || !data.groups.length || !data.series.length) {
        throw 'Data input "groups" and "series" properties are either inexistent, of a type other than "array" or empty.';
      }

      data.series.forEach( (series, i) => {
        if(typeof series !== 'object' || !series.label || (typeof series.label !== 'string' && typeof series.label !== 'number') || !series.data || !series.data.length || series.data.length !== data.groups.length) {
          throw 'The data.series array must only contain objects.';
        } else if (!series.label || (typeof series.label !== 'string' && typeof series.label !== 'number')) {
          throw 'The label property may be missing or be in a format other than string/number in some of your data.series objects.';
        } else if (!series.data || !series.data.length || series.data.length !== data.groups.length) {
          throw 'The data property in one or more of your data.series objects is either inexistent, of a type other than "array" or of a size different than that of data.groups.';
        } else {
          series.data.forEach( (dataPoint, j) => {
            if (typeof dataPoint !== 'number' || (i === 0 && typeof data.groups[j] !== 'string' && typeof data.groups[j] !== 'number')) {
              throw 'Items in the data.groups array must be of type string or number. Data points in data series must be numbers.';
            }
          });
        }
      });

      //make copy of object to not alter original
      data = JSON.parse(JSON.stringify(data));

      //CHECK OPTIONS OBJECT
      //check title.label
      if(typeof options !== 'object') {
        throw 'Options input is not an object!';
      } else if (typeof options.title !== 'object' || !options.title.label || (typeof options.title.label !== 'string' && typeof options.title.label !== 'number')) {
        throw 'The options.title property is either missing, is not an object or does not include a string/number as its label.';
      }

      //check xAxis label
      if (typeof options.xAxis !== 'object' || !options.xAxis.label || (typeof options.xAxis.label !== 'string' && typeof options.xAxis.label !== 'number')) {
        throw 'The options.xAxis property is either missing, is not an object or does not include a string/number as its label.';
      }

      //check yAxis label, unit.base and unit.step
      if (typeof options.yAxis !== 'object' || !options.yAxis.label || (typeof options.yAxis.label !== 'string' && typeof options.yAxis.label !== 'number')) {
        throw 'The options.yAxis property is either missing, is not an object or does not include a string/number as its label. Please include the applicable unit in brackets (e.g. "Distance travelled (in km)")';
      } else if (typeof options.yAxis.unit !== 'object' || !options.yAxis.unit.base || typeof options.yAxis.unit.base !== 'number') {
        throw 'options.yAxis must have a "unit" property. That property should include a base in the number format. The base will be applied to your raw data so as to convert it in the unit of your choosing (for example if your data is in "cm" but should be displayed in "km", the applicable base is 100000 - 100,000cm in 1km).';
      } else if (!options.yAxis.unit.step || typeof options.yAxis.unit.step !== 'number') {
        throw 'options.yAxis.unit must have a "step" property. It should reference a number and will be used to determine the space between each tick mark on the y-axis.';
      }

      //make copy of object to not alter original
      options = JSON.parse(JSON.stringify(options));

      return [data, options, container];

    }
    catch(e) {
      console.error(e);
      return false;
    }

  }
  static sanitizeColor(color) {
    return /^#[\da-fA-F]{3,6}$/.test(color) ? color : false;
  }
  static sanitizeSize(size) {
    size = size.match(/\d+/);
    return size ? size + 'px' : false;
  }
  static sanitizeFontFamily(family) {
    family = family.replace(/\\/, '').replace(/(?:[^\\]|(?:[^\\]|^)(?:\\\\)*)(['"])/, '\$1');
    family = family.match(/^[a-zA-Z,'"\\]+$/);
    return family ? family : false;
  }
  static sanitizeFontWeight(weight) {
    weight = weight.match(/^[1-9]0{2}|normal|bold|bold|light|lighter$/);
    return weight ? weight : false;
  }

}
