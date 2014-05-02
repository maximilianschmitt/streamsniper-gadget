'use strict';

require('./polyfills');

var $             = require('jquery');
var AppController = require('./controllers/app');
var AppView       = require('./views/app');

$(document).ready(function() {
	var appController = new AppController({
		view: new AppView('#app'),
		offline: false,
		refresh: 60 * 1000 * 2, // refresh rate in milliseconds
		twitch: {
			username: ''
		}
	});

	require('./gadget/settings')(appController);
});