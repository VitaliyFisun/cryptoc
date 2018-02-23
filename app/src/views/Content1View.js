import { Marionette, Radio } from '../vendor/vendor';
import template from './templates/Content1ViewTemplate.html';
const vent = Radio.channel('vent');
let Content1View = Marionette.View.extend({
    template: template,
    className: 'content1',
    initialize() {
        this.templateContext = {
            data: this.options.data
        }
    },
    ui: {
        coin: '.coin'
    },
    events: {
        'click @ui.coin': 'goToConverter'
    },
    goToConverter(e) {
        let target = $(e.currentTarget);
        window.location.hash = `converter/${target.attr('data-item-id')}`;
        // 
        // vent.trigger('converter.show', target.attr('data-item-id'));
        // $('body').addClass('show-content2');
    },
    onRender(){
        $('#app').removeClass('content-2');
    }
});

export default Content1View;