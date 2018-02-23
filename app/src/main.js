import "babel-polyfill";
import { Backbone } from './vendor/vendor';
import app from './common/Application';
import Router from './common/Router';


document.addEventListener('deviceready', function() {
    app.start();
    new Router();
    Backbone.history.start();

    document.addEventListener('backbutton', function(e) {
        e.preventDefault();
        if (~window.location.hash.lastIndexOf('converter')) {
            Backbone.history.history.back();
            return false;
        }
        navigator.app.exitApp();
    });
});

app.start();
new Router();
Backbone.history.start();
