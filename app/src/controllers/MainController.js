import { Marionette } from '../vendor/vendor';
import app from '../common/Application';
import Content1View from '../views/Content1View';
import Content2View from '../views/Content2View';
import CoinsService from '../services/CoinsService';
export default Marionette.Object.extend({


    main() {
        let coinsrService = new CoinsService();
        coinsrService.getCoinsData()
            .then((data) => {
                let content1View = new Content1View({ data });
                app.rootView.showChildView('content1', content1View);
            });

    },

    converter(i) {
        let coinsrService = new CoinsService();
        coinsrService.getCoinsData()
            .then((data) => {
                let content2View = new Content2View({ coin: data[i] });
                app.rootView.showChildView('content1', content2View);
            });

    },


});