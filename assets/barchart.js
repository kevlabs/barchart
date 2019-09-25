//each bar chart will be an instance of the BarChart class
class BarChart {
  constructor(data, options, container) {

    //validate input
    if (!BarChart.validateInput(data, options, container)) { return false; }

    //init properties
    this.container = container;
    this.data = JSON.parse(JSON.stringify(data));
    this.options = JSON.parse(JSON.stringify(options));

    //render chart
    this._renderChartArea(container);

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
      //check chart.type
      if (typeof options !== 'object' || Object.getPrototypeOf(options) !== Object.prototype) {
        throw 'Options input is not an object!';
      } else if (typeof options.chart !== 'object' || Object.getPrototypeOf(options.chart) !== Object.prototype || !(['stacked', 'inline'].includes(options.chart.type)) || !(['vertical', 'horizontal'].includes(options.chart.direction))) {
        throw 'The options.chart property is either missing, is not an object or does not include valid "type" or "direction" properties. Legal options.chart.type values are "stacked" and "inline" while legal options.chart.direction values are "horizontal" and "vertical".';
      }

      //check title.label
      if (typeof options.title !== 'object' || Object.getPrototypeOf(options.title) !== Object.prototype || (typeof options.title.label !== 'string' && typeof options.title.label !== 'number')) {
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
    return /^(#[\da-fA-F]{3,6}|rgb\((\s*(2([0-4]\d|5[0-5])|[0-1]?\d{1,2})\s*,){2}\s*(2([0-4]\d|5[0-5])|[0-1]?\d{1,2})\s*\))$/.test(color) ? color : false;
  }
  static sanitizeSize(size, multiplier = 1) {
    if (typeof size !== 'string' && typeof size !== 'number') { return false; }
    size = size.toString().match(/\d+/);
    return size ? size[0] * multiplier + 'px' : false;
  }
  static sanitizeFontFamily(family) {
    if (typeof family !== 'string') { return false; }
    family = family.replace(/(\\)|(['"])/g, (match, slash, quote) => slash ? '' : '\\' + quote );
    return /^[a-zA-Z,'"-\\\s]+$/.test(family) ? family : false;
  }
  static sanitizeFontWeight(weight) {
    if (typeof weight !== 'string' && typeof weight !== 'number') { return false; }
    return /^([1-9]0{2}|normal|bold|bold|light|lighter)$/.test(weight.toString()) ? weight : false;
  }
  static sanitizeVAlignment(align) {
    if (typeof align !== 'string') { return false; }
    return /^(top|middle|bottom)$/.test(align.toString()) ? align : false;
  }
  static sanitizeHAlignment(align) {
    if (typeof align !== 'string') { return false; }
    return /^(left|center|right)$/.test(align.toString()) ? align : false;
  }
  static sanitizeTopBottom(string) {
    if (typeof string !== 'string') { return false; }
    return /^(top|bottom)$/.test(string.toString()) ? string : false;
  }

  _calcYAxisData() {

    const dataPoints = [];
    if (this.options.chart.type === 'stacked') { this.groupStackedNegativeBase = []; }
    let seriesMinMax;

    //calculate min and max values
    for (let i = 0; i < this.data.groups.length; i++) {
      if (this.options.chart.type === 'stacked') { seriesMinMax = [0, 0]; }
      for (let j = 0; j < this.data.series.length; j++) {
        if (this.options.chart.type === 'stacked') {
          if (this.data.series[j].data[i] < 0) {
            seriesMinMax[0] += this.data.series[j].data[i];
          } else {
            seriesMinMax[1] += this.data.series[j].data[i];
          }
        } else {
          dataPoints.push(this.data.series[j].data[i]);
        }
      }
      if (this.options.chart.type === 'stacked') {
        this.groupStackedNegativeBase.push(Math.round(seriesMinMax[0] / this.options.yAxis.unit.base * 100000) / 100000);
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
    this.spanBase = this.spanBase / this.numTick * (this.numTick + 1);
  }

  _renderYAxis(chartArea) {

    this._calcYAxisData();

    const wrapperElem = document.createElement('div');
    wrapperElem.classList.add(`bc-y-axis-${this.options.chart.direction}`);

    //render heading
    const headingElem = document.createElement('h6');
    headingElem.innerHTML = this.options.yAxis.label;

    //heading font
    if (typeof this.options.yAxis.font === 'object' && Object.getPrototypeOf(this.options.yAxis.font) === Object.prototype) {
      headingElem.style.fontFamily = BarChart.sanitizeFontFamily(this.options.yAxis.font.family);
      headingElem.style.fontWeight = BarChart.sanitizeFontWeight(this.options.yAxis.font.weight);
      headingElem.style.fontSize = BarChart.sanitizeSize(this.options.yAxis.font.size);
      headingElem.style.color = BarChart.sanitizeColor(this.options.yAxis.font.color);
    }

    wrapperElem.append(headingElem);

    //render tick labels
    const labelWrapperElem = document.createElement('ul');
    for (let i = 0, val = this.minTickBase; i < this.numTick; i++) {
      const labelElem = document.createElement('li');
      labelElem.innerHTML = val;
      labelWrapperElem.append(labelElem);
      val += this.stepBase;
    }
    wrapperElem.append(labelWrapperElem);

    //append to chart area
    chartArea.append(wrapperElem);

  }

  _renderDataPoints(groups) {

    //determine vertical align of value within bar
    const valAlign = this.options.chart.direction === 'vertical' ? (BarChart.sanitizeVAlignment(this.options.chart.valueVerticalAlignment) || 'middle') : (BarChart.sanitizeHAlignment(this.options.chart.valueHorizontalAlignment) || 'center');

    //append data points to groups
    this.data.series.forEach( ({label, data: series, color, backgroundColor}) => {
      series.forEach( (dataPoint, i) => {
        const dataValBase = Math.round(dataPoint / this.options.yAxis.unit.base * 100) / 100;

        //create bar div elem
        const barDivElem = document.createElement('div');
        barDivElem.classList.add(`bc-data-series-${this.options.chart.type + (this.options.chart.type === 'stacked' && dataValBase < 0 ? '-negative' : '')}`, `bc-data-value-${valAlign}-${this.options.chart.direction}`);

        //set height/width of bar
        barDivElem.style[this.options.chart.direction === 'vertical' ? 'height' : 'width'] = Math.round(Math.abs(dataValBase / this.spanBase) * 100000) / 1000 + '%';

        //set offset from x-axis
        barDivElem.style[this.options.chart.direction === 'vertical' ? 'bottom' : 'left'] = Math.round((Math.min(this.options.chart.type === 'inline' ? dataValBase : this.groupStackedNegativeBase[i], 0) - this.minTickBase) / this.spanBase * 100000) / 1000 + '%';

        //set color styles
        barDivElem.style.color = BarChart.sanitizeColor(color);
        barDivElem.style.backgroundColor = BarChart.sanitizeColor(backgroundColor);

        //set data attributes and innerText
        barDivElem.setAttribute('data-value', dataValBase);
        barDivElem.setAttribute('data-series', label);
        barDivElem.setAttribute('data-group', groups[i].getAttribute('data-group'));
        barDivElem.innerHTML = Math.round(dataValBase);

        //attach event listener for info window
        barDivElem.addEventListener('mouseenter', this._renderInfoWindow());

        //append to div to group
        groups[i].append(barDivElem);

      } );
    } );

  }

  _renderDataGroups(plotArea) {
    //return an array of data-group containers
    const groups = this.data.groups.map( (group) => {
      const elem = document.createElement('div');
      elem.classList.add(`bc-data-group-${this.options.chart.type}-${this.options.chart.direction}`);
      elem.setAttribute('data-group', group);

      //set space between groups
      elem.style[this.options.chart.direction === 'vertical' ? 'marginLeft' : 'marginTop'] = BarChart.sanitizeSize(this.options.xAxis.groupSpaceBetween, 0.5);
      elem.style[this.options.chart.direction === 'vertical' ? 'marginRight' : 'marginBottom'] = BarChart.sanitizeSize(this.options.xAxis.groupSpaceBetween, 0.5);

      plotArea.append(elem);
      return elem;
    } );

    this._renderDataPoints(groups);

  }

  _renderPlotArea(chartArea) {

    //render wrapper div
    const wrapperElem = document.createElement('div');
    wrapperElem.classList.add(`bc-plot-area-wrapper-${this.options.chart.direction}`);

    //render grid lines
    for (let i = 0, val = this.maxTickBase; i < this.numTick; i++) {
      const gridLineElem = document.createElement('div');
      gridLineElem.classList.add(`${val ? 'bc-grid-line' : 'bc-grid-line-origin'}-${this.options.chart.direction}`);
      wrapperElem.append(gridLineElem);
      val -= this.stepBase;
    }

    //render plot area
    const divElem = document.createElement('div');
    divElem.classList.add(`bc-plot-area-${this.options.chart.direction}`);
    this._renderDataGroups(divElem);
    wrapperElem.append(divElem);

    //append to chart area
    chartArea.append(wrapperElem);

  }

  _renderXAxis(chartArea) {
    const wrapperElem = document.createElement('div');
    wrapperElem.classList.add(`bc-x-axis-${this.options.chart.direction}`);

    //render heading
    const headingElem = document.createElement('h6');
    headingElem.innerHTML = this.options.xAxis.label;

    //heading font
    if (typeof this.options.xAxis.font === 'object' && Object.getPrototypeOf(this.options.xAxis.font) === Object.prototype) {
      headingElem.style.fontFamily = BarChart.sanitizeFontFamily(this.options.xAxis.font.family);
      headingElem.style.fontWeight = BarChart.sanitizeFontWeight(this.options.xAxis.font.weight);
      headingElem.style.fontSize = BarChart.sanitizeSize(this.options.xAxis.font.size);
      headingElem.style.color = BarChart.sanitizeColor(this.options.xAxis.font.color);
    }

    wrapperElem.append(headingElem);

    //render tick labels
    const labelWrapperElem = document.createElement('ul');
    this.data.groups.forEach( (group) => {
      const labelElem = document.createElement('li');
      labelElem.innerHTML = group;
      labelWrapperElem.append(labelElem);
    } );
    wrapperElem.append(labelWrapperElem);

    //append to chart area
    chartArea.append(wrapperElem);

  }

  _renderLegend(chartArea) {
    const wrapperElem = document.createElement('ul');
    wrapperElem.classList.add('bc-legend');

    this.data.series.forEach( ({label, backgroundColor}) => {
      //create legend list item
      const itemElem = document.createElement('li');
      itemElem.classList.add('bc-legend-item');

      //add color square
      const itemSquareElem = document.createElement('div');
      itemSquareElem.classList.add('bc-legend-item-square');
      itemSquareElem.style.backgroundColor = BarChart.sanitizeColor(backgroundColor);
      itemElem.append(itemSquareElem);

      //add item text
      itemElem.append(label);

      //attach to legend node
      wrapperElem.append(itemElem);
    } );

    //append to chart area
    chartArea.append(wrapperElem);

  }

  _renderInfoWindow() {
    //function factory. To be called when supplied to event handler

    //create info window HTMLElement if does not already exist
    if (!this.infoWindow) {
      this.infoWindow = document.createElement('div');
      this.infoWindow.classList.add('bc-info-window');

      //add series label div
      const seriesElem = document.createElement('div');
      seriesElem.classList.add('bc-info-window-series');
      this.infoWindow.append(seriesElem);
      //add group label div
      const groupElem = document.createElement('div');
      groupElem.classList.add('bc-info-window-group');
      this.infoWindow.append(groupElem);
      //add group label div
      const valueElem = document.createElement('div');
      valueElem.classList.add('bc-info-window-value');
      this.infoWindow.append(valueElem);
    }

    //return arrow function so value of this is locked.
    //can call event target with e.currentTarget
    return (e) => {

      const elem = e.currentTarget;

      if (this.infoWindow.parentNode !== e.currentTarget) {

        //fill in HTML Elements
        this.infoWindow.querySelector('.bc-info-window-series').innerHTML = `Series: ${elem.getAttribute('data-series')}`;
        this.infoWindow.querySelector('.bc-info-window-group').innerHTML = `Group: ${elem.getAttribute('data-group')}`;
        this.infoWindow.querySelector('.bc-info-window-value').innerHTML = `Value: ${elem.getAttribute('data-value')}`;

        //add event listener to deal with remove info window when out of bar
        elem.addEventListener('mouseleave', this._renderInfoWindow(), {once: true});

        elem.append(this.infoWindow);

      } else {
        elem.removeChild(this.infoWindow);
      }

      return false;
    }

  }

  _renderChartArea(chartContainer) {

    const chartAreaElem = document.createElement('div');
    chartAreaElem.classList.add('bc-chart-area');

    //set user-defined style
    //title top/bottom
    if (BarChart.sanitizeTopBottom(this.options.title.verticalAlignment) === 'bottom') { chartAreaElem.style.flexDirection = 'column-reverse'; }

    //width + height
    chartAreaElem.style.width = BarChart.sanitizeSize(this.options.chart.width);
    chartAreaElem.style.height = BarChart.sanitizeSize(this.options.chart.height);

    //font
    if (typeof this.options.chart.font === 'object' && Object.getPrototypeOf(this.options.chart.font) === Object.prototype) {
      chartAreaElem.style.fontFamily = BarChart.sanitizeFontFamily(this.options.chart.font.family);
      chartAreaElem.style.fontWeight = BarChart.sanitizeFontWeight(this.options.chart.font.weight);
      chartAreaElem.style.fontSize = BarChart.sanitizeSize(this.options.chart.font.size);
      chartAreaElem.style.color = BarChart.sanitizeColor(this.options.chart.font.color);
    }

    //CHART TITLE
    const headingElem = document.createElement('h5');
    headingElem.classList.add('bc-title');
    headingElem.innerHTML = this.options.title.label;

    //title font
    if (typeof this.options.title.font === 'object' && Object.getPrototypeOf(this.options.title.font) === Object.prototype) {
      headingElem.style.fontFamily = BarChart.sanitizeFontFamily(this.options.title.font.family);
      headingElem.style.fontWeight = BarChart.sanitizeFontWeight(this.options.title.font.weight);
      headingElem.style.fontSize = BarChart.sanitizeSize(this.options.title.font.size);
      headingElem.style.color = BarChart.sanitizeColor(this.options.title.font.color);
    }

    chartAreaElem.append(headingElem);

    const chartGridElem = document.createElement('div');
    chartGridElem.classList.add('bc-body-grid');
    chartAreaElem.append(chartGridElem);

    this._renderYAxis(chartGridElem);
    this._renderPlotArea(chartGridElem);
    this._renderXAxis(chartGridElem);
    this._renderLegend(chartGridElem);

    //append to container
    chartContainer.append(chartAreaElem);

  }

}

//BarChart API
function drawBarChart(data, options, element) {
  return new BarChart(data, options, element);
};
