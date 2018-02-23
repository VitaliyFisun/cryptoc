import { Marionette, Radio, Chart, Backbone } from '../vendor/vendor';
import template from './templates/Content2ViewTemplate.html';
import CoinsService from '../services/CoinsService';

let Content2View = Marionette.View.extend({
    template: template,
    className: 'content2',
    cryptoSymbol: '',
    currencySymbol: 'USD',
    isRevert: true,
    rate: 1,
    ui: {
        fromInput: '.from-value',
        toInput: '.to-value',
        fromSymbol: '.from-symbol',
        toSymbol: '.to-symbol',
        tab: '.tab',
        chartLow: '#low',
        chartHigh: '#high',
        backBtn: '.back-btn'
    },
    events: {
        'input @ui.fromInput': 'input',
        'click @ui.tab': 'changeChart',
        'click @ui.backBtn': 'back'
    },
    initialize() {
        let coin = this.options.coin;
        this.rate = coin.Rating;
        this.cryptoSymbol = coin.Symbol;
        this.chartType = 'day';
        this.coinsService = new CoinsService();
        //SpinnerPlugin.activityStart("Loading data...", { dimBackground: true });
        this.templateContext = {
            coin: coin,
            cryptoSymbol: this.cryptoSymbol,
            currencySymbol: this.currencySymbol,
            chartLow: 'N/A',
            chartHigh: 'N/A',
        }
    },

    back() {
        Backbone.history.history.back();
    },


    input(e) {
        let input = $(e.currentTarget).val();
        let output = '' + this.convert(input);
        this.getUI('toInput').val(output);
    },
    convert(val) {
        let coef = this.isRevert ? this.rate : 1 / this.rate;
        return val * coef;
    },

    changeChart(e) {
        //SpinnerPlugin.activityStart("Loading data...", { dimBackground: true });
        this.chartType = $(e.currentTarget).attr('data-type');
        this.rebuildChart();
    },

    rebuildChart() {
        if (this.chartType == 'day') {
            this.coinsService.getDataForDayChart(this.cryptoSymbol, 'day', 24)
                .then((items) => {
                    if (!items.length) {
                        return false;
                        //SpinnerPlugin.activityStop();
                    }
                    let labels = [];
                    for (let i = 1; i <= items.length; i++) {
                        labels.push(i);
                    }
                    this.renderChart(items, labels, 'Last 24 hours');
                    let chartLow = Math.min(...items);
                    let chartHigh = Math.max(...items);
                    this.getUI('chartLow').html(`${chartLow} ${this.currencySymbol}`);
                    this.getUI('chartHigh').html(`${chartHigh} ${this.currencySymbol}`);
                });

        }
        if (this.chartType == 'month') {
            this.coinsService.getDataForDayChart(this.cryptoSymbol, 'month', 30)
                .then((items) => {
                    if (!items.length) {
                        return false;
                        //SpinnerPlugin.activityStop();
                    }
                    let labels = [];
                    for (let i = 1; i <= items.length; i++) {
                        labels.push(i);
                    }
                    this.renderChart(items, labels, 'Last 30 days');
                    let chartLow = Math.min(...items);
                    let chartHigh = Math.max(...items);
                    this.getUI('chartLow').html(`${chartLow} ${this.currencySymbol}`);
                    this.getUI('chartHigh').html(`${chartHigh} ${this.currencySymbol}`);
                });
        }
        //SpinnerPlugin.activityStop();
    },

    renderChart(data, labels, legend) {
        let ctx = document.getElementById('chart');
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: legend,
                    data: data,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }]
            },
            options: {
                legend: {
                    labels: {
                        fontSize: 70,
                        fontColor: '#fff'
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontSize: 30,
                            fontColor: '#fff'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 25,
                            fontColor: '#fff'
                        }
                    }]
                }
            }
        });
    },
    onRender() {
        this.isRevert = true;
        $('#app').scrollTop(0);
        $('#app').addClass('content-2');
    },

    onDomRefresh() {
        this.rebuildChart();

    }



});

export default Content2View;