import { Marionette } from '../vendor/vendor';
import MainController from '../controllers/MainController';
const mainController = new MainController();

let Router = Marionette.AppRouter.extend({
    controller: mainController,
    appRoutes: {
        '': 'main',
        'converter/*i': 'converter'
    },
    initialize() {
        console.info('Router initialize');
    }
});

export default Router;