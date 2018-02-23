import { Marionette } from '../vendor/vendor';
import RootView from '../views/RootView';
let Application = Marionette.Application.extend({
    region: '#app',
    onStart() {
        this.rootView = new RootView();
        this.showView(this.rootView);
        setTimeout(() => {
            $('body').removeClass('show-splash');
        }, 3000);
    }
});

let app = new Application();
export default app;