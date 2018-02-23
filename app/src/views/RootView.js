import { Marionette } from '../vendor/vendor';
import template from './templates/rootViewTemplate.html';

let RootView = Marionette.View.extend({
    template: template,
    id: 'root-view',
    regions: {
        content1: '#content1',
        content2: '#content2',
    },
    ui: {
        button: '.btn'
    },
    events: {
        'click @ui.button': 'closeConvertView'
    },
    closeConvertView() {
        $('body').removeClass('show-content2');
    },


    initialize() {
        console.info('RootView initialize');
    }
});


export default RootView;