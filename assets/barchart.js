

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
  xAxis: {
    label: 'Year',
    groupSpaceBetween: '20px',
    font: {                             //if not supplied should default to top level
      family: 'Arial, sans-serif',
      size: '16px',
      color: '#000',
      weight: 'bold'
    }
  }
  yAxis: {
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
  constructor(data, options, container) {

    //validate input
    if (!BarChart.validateInput(data, options, container)) { return false; }

    //init properties
    this.container = container;
    this.data = JSON.parse(JSON.stringify(data));
    this.options = JSON.parse(JSON.stringify(options));

    //start rendering chart
    //set chart type - might move to a parent function
    this.chartType = this.options.type === 'inline' || this.options.type === 'stacked' ? this.options.type : 'inline';

    this._calcYAxisData();
    this._renderPlotArea();





  }

  static validateInput(data, options, container) {
    return (BarChart.validateContainerInput(container) && BarChart.validateDataInput(data) && BarChart.validateOptionsInput(options)) ? true : false;
  }

  static validateContainerInput(container) {
    //make sure element exists
    if (container instanceof HTMLElement) {
      return container;
    } else {
      console.error('Element is not an HTML element!');
      return false;
    }
  }

  static validateDataInput(data) {
    try {

      //CHECK DATA OBJECT
      if (typeof data !== 'object' || Object.getPrototypeOf(data) !== Object.prototype) {
        throw 'Data input is not an object!';
      } else if (typeof data.groups !== 'object' || typeof data.series !== 'object' || Object.getPrototypeOf(data.groups) !== Array.prototype || Object.getPrototypeOf(data.series) !== Array.prototype) {
        throw 'Data input "groups" and "series" properties are either inexistent, of a type other than "array" or empty.';
      }

      data.series.forEach( (series, i) => {
        if (typeof series !== 'object' || Object.getPrototypeOf(series) !== Object.prototype) {
          throw 'The data.series array must only contain objects.';
        } else if (typeof series.label !== 'string' && typeof series.label !== 'number') {
          throw 'The label property may be missing or be in a format other than string/number in some of your data.series objects.';
        } else if (typeof series.data !== 'object' || Object.getPrototypeOf(series.data) !== Array.prototype || series.data.length !== data.groups.length) {
          throw 'The data property in one or more of your data.series objects is either inexistent, of a type other than "array" or of a size different than that of data.groups.';
        } else {
          series.data.forEach( (dataPoint, j) => {
            if (typeof dataPoint !== 'number' || (i === 0 && typeof data.groups[j] !== 'string' && typeof data.groups[j] !== 'number')) {
              throw 'Items in the data.groups array must be of type string or number. Data points in data series must be numbers.';
            }
          });
        }
      });

      return data;

    }
    catch(e) {
      console.error(e);
      return false;
    }
  }

  static validateOptionsInput(options) {
    try {
      //CHECK OPTIONS OBJECT
      //check title.label
      if (typeof options !== 'object' || Object.getPrototypeOf(options) !== Object.prototype) {
        throw 'Options input is not an object!';
      } else if (typeof options.title !== 'object' || Object.getPrototypeOf(options.title) !== Object.prototype || (typeof options.title.label !== 'string' && typeof options.title.label !== 'number')) {
        throw 'The options.title property is either missing, is not an object or does not include a string/number as its label.';
      }

      //check xAxis label
      if (typeof options.xAxis !== 'object' || Object.getPrototypeOf(options.xAxis) !== Object.prototype || (typeof options.xAxis.label !== 'string' && typeof options.xAxis.label !== 'number')) {
        throw 'The options.xAxis property is either missing, is not an object or does not include a string/number as its label.';
      }

      //check yAxis label, unit.base and unit.step
      if (typeof options.yAxis !== 'object' || Object.getPrototypeOf(options.yAxis) !== Object.prototype || (typeof options.yAxis.label !== 'string' && typeof options.yAxis.label !== 'number')) {
        throw 'The options.yAxis property is either missing, is not an object or does not include a string/number as its label. Please include the applicable unit in brackets (e.g. "Distance travelled (in km)")';
      } else if (typeof options.yAxis.unit !== 'object' || Object.getPrototypeOf(options.yAxis.unit) !== Object.prototype || typeof options.yAxis.unit.base !== 'number') {
        throw 'options.yAxis must have a "unit" property. That property should include a base in the number format. The base will be applied to your raw data so as to convert it in the unit of your choosing (for example if your data is in "cm" but should be displayed in "km", the applicable base is 100000 - 100,000cm in 1km).';
      } else if (typeof options.yAxis.unit.step !== 'number' || options.yAxis.unit.step <= 0) {
        throw 'options.yAxis.unit must have a "step" property. It should reference a strictly positive number in the same unit as your raw data and will be used to determine the space between each tick mark on the y-axis.';
      }

      return options;

    }
    catch(e) {
      console.error(e);
      return false;
    }

  }
  static sanitizeColor(color) {
    if (typeof color !== 'string') { return false; }
    return /^#[\da-fA-F]{3,6}$/.test(color) ? color : false;
  }
  static sanitizeSize(size) {
    if (typeof size !== 'string' && typeof size !== 'number') { return false; }
    size = size.toString().match(/\d+/);
    return size ? size[0] + 'px' : false;
  }
  static sanitizeFontFamily(family) {
    if (typeof family !== 'string') { return false; }
    family = family.replace(/(\\)|(['"])/g, (match, slash, quote) => slash ? '' : '\\' + quote );
    return /^[a-zA-Z,'"\\\s]+$/.test(family) ? family[0] : false;
  }
  static sanitizeFontWeight(weight) {
    if (typeof weight !== 'string' && typeof weight !== 'number') { return false; }
    return /^([1-9]0{2}|normal|bold|bold|light|lighter)$/.test(weight.toString()) ? weight : false;
  }
  convertDataPoint() {
    //options.yAxis.unit.base
    //data.series.data
  }

  _calcYAxisData() {

    const dataPoints = [];
    if (this.chartType === 'stacked') { this.groupStackedNegative = []; }

    //calculate min and max values
    for (let i = 0; i < this.data.groups.length; i++) {
      if (this.chartType === 'stacked') { const seriesMinMax = [0, 0]; }
      for (let j = 0; j < this.data.series.length; j++) {
        if (this.chartType === 'stacked') {
          if (this.data.series[j].data[i] < 0) {
            seriesMinMax[0] += this.data.series[j].data[i];
          } else {
            seriesMinMax[1] += this.data.series[j].data[i];
          }
        } else {
          dataPoints.push(this.data.series[j].data[i]);
        }
      }
      if (this.chartType === 'stacked') {
        this.groupStackedNegative.push(Math.round(seriesMinMax[0] * 10000) / 10000);
        dataPoints.push(...seriesMinMax);
      }
    }

    //all values in raw data unit
    this.minVal = Math.min(...dataPoints);
    this.maxVal = Math.max(...dataPoints);

    this.stepBase = this.options.yAxis.unit.step / this.options.yAxis.unit.base;
    this.minTickBase = Math.min(Math.floor(this.minVal / this.options.yAxis.unit.step) * this.stepBase, 0);
    this.maxTickBase = Math.max(Math.ceil(this.maxVal / this.options.yAxis.unit.step) * this.stepBase, 0);
    this.spanBase = this.maxTickBase - this.minTickBase;
    this.numTick = 1 + this.spanBase / this.stepBase;
  }

  _renderDataPoints(groups) {

    //determine vertical align of value within bar
    const valVerticalAlign = typeof this.options.valueVerticalAlignment === 'string' && /top|middle|bottom/.test(this.options.valueVerticalAlignment) ? this.options.valueVerticalAlignment : 'middle';

    //append data points to groups
    this.data.series.forEach( ({data: series, backgroundColor}) => {
      series.forEach( (dataPoint, i) => {
        const dataValBase = Math.round(dataPoint / this.options.yAxis.unit.base * 100) / 100;

        //create bar div elem
        const barDivElem = document.createElement('div');
        barDivElem.classList.add(`bc-data-series-${this.chartType}`);
        barDivElem.style.height = Math.round(Math.abs(dataValBase / this.spanBase) * 100000) / 100000 + '%';
        //set bottom
        barDivElem.style.bottom = Math.round((Math.min(this.chartType === 'inline' ? dataValBase : this.groupStackedNegative[i], 0) - this.minTickBase) / this.spanBase * 100000) / 100000 + 'px';
        //set background-color
        barDivElem.style.backgroundColor = backgroundColor;

        //create inner data elem
        const barDataElem = document.createElement('data');
        barDataElem.classList.add(`bc-data-value-${valVerticalAlign}`);
        barDataElem.setAttribute('value', dataValBase);
        barDataElem.innerHTML = dataValBase;
        barDivElem.append(barDataElem);

        //append to div to group
        groups[i].append(barDivElem);

      } );
    } );

  }

  _renderDataGroups(plotArea) {
    //return an array of data-group containers
    const groups = this.data.groups.map( (group) => {
      const elem = document.createElement('div');
      elem.classList.add(`bc-data-group-${this.chartType}`);
      plotArea.append(elem);
      return elem;
    } );

    this._renderDataPoints(groups);

  }

  _renderPlotArea() {

    //render wrapper div
    const wrapperElem = document.createElement('div');
    wrapperElem.classList.add('bc-plot-area-wrapper');

    //render grid lines
    for (let i = 0, val = this.maxTickBase; i < this.numTick; i++) {
      const gridLineElem = document.createElement('div');
      gridLineElem.classList.add(val ? 'bc-grid-line' : 'bc-grid-line-origin');
      wrapperElem.append(gridLineElem);
      val -= this.stepBase;
    }

    //render plot area
    const divElem = document.createElement('div');
    divElem.classList.add('bc-plot-area');
    this._renderDataGroups(divElem);
    wrapperElem.append(divElem);

  }

}

