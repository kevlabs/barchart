//each bar chart will be an instance of the BarChart class
class BarChart {
  constructor(data, options, container) {

    //validate input
    if (!BarChart.validateInput(data, options, container)) { return false; }

    //init properties
    this.container = $(container);
    this.data = JSON.parse(JSON.stringify(data));
    this.options = JSON.parse(JSON.stringify(options));

    //render chart
    this._renderChartArea(this.container);

  }

  static validateInput(data, options, container) {
    return BarChart.validateContainerInput(container) && BarChart.validateDataInput(data) && BarChart.validateOptionsInput(options);
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
      } else if (typeof data.groups !== 'object' || typeof data.series !== 'object' || !Array.isArray(data.groups) || !Array.isArray(data.series)) {
        throw 'Data input "groups" and "series" properties are either inexistent, of a type other than "array" or empty.';
      }

      data.series.forEach( (series, i) => {
        if (typeof series !== 'object' || Object.getPrototypeOf(series) !== Object.prototype) {
          throw 'The data.series array must only contain objects.';
        } else if (typeof series.label !== 'string' && typeof series.label !== 'number') {
          throw 'The label property may be missing or be in a format other than string/number in some of your data.series objects.';
        } else if (typeof series.data !== 'object' || !Array.isArray(series.data) || series.data.length !== data.groups.length) {
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

    } catch(e) {
      console.error(e);
      return false;
    }
  }

  // eslint-disable-next-line complexity
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

    } catch(e) {
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
    const matches = size.toString().match(/\d+/);
    return matches ? matches[0] * multiplier + 'px' : false;
  }
  static sanitizeFontFamily(family) {
    if (typeof family !== 'string') { return false; }
    let sanitizedStr = family.replace(/(\\)|(['"])/g, (match, slash, quote) => slash ? '' : '\\' + quote );
    return /^[a-zA-Z,'"-\\\s]+$/.test(sanitizedStr) ? sanitizedStr : false;
  }
  static sanitizeFontWeight(weight) {
    if (typeof weight !== 'string' && typeof weight !== 'number') { return false; }
    return /^([1-9]0{2}|normal|bold|bolder|light|lighter)$/.test(weight.toString()) ? weight : false;
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

  static setFontStyle(elem, font) {

    //data validation
    if (elem instanceof jQuery && typeof font === 'object' && Object.getPrototypeOf(font) === Object.prototype) {
      elem.css({
        'font-family': BarChart.sanitizeFontFamily(font.family),
        'font-weight': BarChart.sanitizeFontWeight(font.weight),
        'font-size': BarChart.sanitizeSize(font.size),
        'color': BarChart.sanitizeColor(font.color)
      });
      return true;
    } else {
      return false;
    }

  }

  _calcYAxisData() {

    const dataPoints = [];
    if (this.options.chart.type === 'stacked') { this.groupStackedNegativeBase = []; }
    let seriesMinMax;

    //calculate min and max values
    //for stacked charts, add up values of the same sign
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

    //declare y-axis props in base unit
    //these are used to render the min and max tick marks and the bar heights
    this.minValBase = Math.min(...dataPoints) / this.options.yAxis.unit.base;
    this.maxValBase = Math.max(...dataPoints) / this.options.yAxis.unit.base;
    this.stepBase = this.options.yAxis.unit.step / this.options.yAxis.unit.base;
    this.minTickBase = Math.min(Math.floor(this.minValBase / this.stepBase) * this.stepBase, 0);
    this.maxTickBase = Math.max(Math.ceil(this.maxValBase / this.stepBase) * this.stepBase, 0);
    this.spanBase = this.maxTickBase - this.minTickBase;
    this.numTick = 1 + this.spanBase / this.stepBase;
    //adjust spanBase for plot area header - space before the first grid line
    this.spanBase = this.spanBase / (this.numTick - 1) * this.numTick;
  }

  _renderYAxis(chartArea) {

    this._calcYAxisData();

    const wrapperElem = $(`<div class="bc-y-axis-${this.options.chart.direction}" />`);

    //render heading
    const headingElem = $('<h6 />').html(this.options.yAxis.label);
    //heading font
    BarChart.setFontStyle(headingElem, this.options.yAxis.font);
    wrapperElem.append(headingElem);

    //render tick labels
    const labelWrapperElem = $('<ul />');
    for (let i = 0, val = this.minTickBase; i < this.numTick; i++) {
      $('<li />').html(val).appendTo(labelWrapperElem);
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
        const barDivElem = $('<div />')
          .addClass(`bc-data-series-${this.options.chart.type + (this.options.chart.type === 'stacked' && dataValBase < 0 ? '-negative' : '')} bc-data-value-${valAlign}-${this.options.chart.direction}`);

        //set height/width of bar
        barDivElem.css(this.options.chart.direction === 'vertical' ? 'height' : 'width', Math.round(Math.abs(dataValBase / this.spanBase) * 100000) / 1000 + '%');

        //set offset from x-axis
        barDivElem.css(this.options.chart.direction === 'vertical' ? 'bottom' : 'left', Math.round((Math.min(this.options.chart.type === 'inline' ? dataValBase : this.groupStackedNegativeBase[i], 0) - this.minTickBase) / this.spanBase * 100000) / 1000 + '%');

        //set color styles
        barDivElem.css({
          'color': BarChart.sanitizeColor(color),
          'background-color': BarChart.sanitizeColor(backgroundColor)
        });

        //set data attributes
        barDivElem.data({
          'value': dataValBase,
          'series': label,
          'group': groups[i].data('group')
        });

        //store value in div for styling purposes (padding is an issue for extremely small values otherwise)
        $('<div />').html(this.maxValBase >= 100 ? Math.round(dataValBase) : dataValBase)
          .appendTo(barDivElem);

        //attach event listener for info window
        barDivElem.mouseenter(this._renderInfoWindow());

        //append to div to group
        groups[i].append(barDivElem);

      } );
    } );

  }

  _renderDataGroups(plotArea) {
    //return an array of data-group containers
    const groups = this.data.groups.map( (group) => {
      const elem = $('<div />')
        .addClass(`bc-data-group-${this.options.chart.type}-${this.options.chart.direction}`)
        .data('group', group);

      //set space between groups
      elem.css(this.options.chart.direction === 'vertical' ? 'margin-left' : 'margin-top', BarChart.sanitizeSize(this.options.xAxis.groupSpaceBetween, 0.5))
        .css(this.options.chart.direction === 'vertical' ? 'margin-right' : 'margin-bottom', BarChart.sanitizeSize(this.options.xAxis.groupSpaceBetween, 0.5));

      plotArea.append(elem);
      return elem;
    } );

    this._renderDataPoints(groups);

  }

  _renderPlotArea(chartArea) {

    //render wrapper div
    const wrapperElem = $(`<div class="bc-plot-area-wrapper-${this.options.chart.direction}" />`);

    //render grid lines
    for (let i = 0, val = this.maxTickBase; i < this.numTick; i++) {
      $('<div />')
        .addClass(`${val ? 'bc-grid-line' : 'bc-grid-line-origin'}-${this.options.chart.direction}`)
        .appendTo(wrapperElem);
      val -= this.stepBase;
    }

    //render plot area
    const divElem = $('<div />')
      .addClass(`bc-plot-area-${this.options.chart.direction}`);
    this._renderDataGroups(divElem);
    wrapperElem.append(divElem);

    //append to chart area
    chartArea.append(wrapperElem);

  }

  _renderXAxis(chartArea) {
    const wrapperElem = $(`<div class="bc-x-axis-${this.options.chart.direction}" />`);

    //render heading
    const headingElem = $('<h6 />').html(this.options.xAxis.label);
    //heading font
    BarChart.setFontStyle(headingElem, this.options.xAxis.font);
    wrapperElem.append(headingElem);

    //render group labels
    const labelWrapperElem = $('<ul />');
    this.data.groups.forEach( (group) => {
      $('<li />').html(group).appendTo(labelWrapperElem);
    } );
    wrapperElem.append(labelWrapperElem);

    //append to chart area
    chartArea.append(wrapperElem);

  }

  _renderLegend(chartArea) {
    const wrapperElem = $('<ul class="bc-legend" />');

    this.data.series.forEach( ({label, backgroundColor}) => {
      //create legend list item
      const itemElem = $('<li class="bc-legend-item" />');

      //add color square
      $('<div class="bc-legend-item-square" />')
        .css('backgroundColor', BarChart.sanitizeColor(backgroundColor))
        .appendTo(itemElem);

      //add item text
      itemElem.append(label);

      //attach to legend node
      wrapperElem.append(itemElem);
    } );

    //append to chart area
    chartArea.append(wrapperElem);

  }

  _renderInfoWindow() {
    //function factory. Must be called to return event handler.

    //create info window HTMLElement if does not already exist
    if (!this.infoWindow) {
      this.infoWindow = $('<div class="bc-info-window" />');

      //add series label div
      this.infoWindow.append($('<div class="bc-info-window-series" />'));
      //add group label div
      this.infoWindow.append($('<div class="bc-info-window-group" />'));
      //add group label div
      this.infoWindow.append($('<div class="bc-info-window-value" />'));
    }

    //return arrow function so value of this is locked.
    //can call event target with e.currentTarget
    return (e) => {

      const elem = $(e.currentTarget);

      if (this.infoWindow.parent().get(0) !== elem.get(0)) {

        //fill in HTML Elements
        this.infoWindow.children('.bc-info-window-series').html(`Series: ${elem.data('series')}`);
        this.infoWindow.children('.bc-info-window-group').html(`Group: ${elem.data('group')}`);
        this.infoWindow.children('.bc-info-window-value').html(`Value: ${elem.data('value')}`);

        //add event listener to deal with remove info window when out of bar
        elem.one('mouseleave', this._renderInfoWindow());

        elem.append(this.infoWindow);

      } else {
        this.infoWindow.detach();
      }

      return false;
    };

  }

  _renderChartArea(chartContainer) {

    const chartAreaElem = $('<div class="bc-chart-area" />');

    //set user-defined style
    //title top/bottom
    if (BarChart.sanitizeTopBottom(this.options.title.verticalAlignment) === 'bottom') { chartAreaElem.css('flexDirection', 'column-reverse'); }

    //width + height
    chartAreaElem.width(BarChart.sanitizeSize(this.options.chart.width))
      .height(BarChart.sanitizeSize(this.options.chart.height));

    //font
    BarChart.setFontStyle(chartAreaElem, this.options.chart.font);

    //CHART TITLE
    const headingElem = $('<h5 class="bc-title" />')
      .html(this.options.title.label);
    //title font
    BarChart.setFontStyle(headingElem, this.options.title.font);
    chartAreaElem.append(headingElem);

    const chartGridElem = $('<div class="bc-body-grid" />');
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
}
