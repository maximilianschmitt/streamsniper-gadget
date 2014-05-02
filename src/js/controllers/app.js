'use strict';

var TwitchSniper = require('../snipers/twitch');

var AppController = function(options) {
	this.view = options.view;
	if (!options.offline) this.view.hideOffline();

	this.twitchSniper = new TwitchSniper(options.twitch);

	this.refreshRate = options.refresh;
	this.view.onClickRefresh(this.refresh.bind(this));
	this.refresh();
};

AppController.prototype = {
	set: function(options) {
		if (options.twitch) {
			this.twitchSniper.set(options.twitch);
			this.refresh();
		}

		if (options.refresh) {
			this.refreshRate = options.refresh;
			this.scheduleRefresh();
		}

		if (options.offline) {
			this.view.showOffline();
		} else {
			this.view.hideOffline();
		}
	},

	refresh: function() {
		var view = this.view;

		view.indicateLoading();

		this.twitchSniper.snipe().then(function(channels) {
			view.indicateLoaded();
			view.updateChannels(channels);
		})
		.caught(view.indicateLoaded.bind(view));
	},

	scheduleRefresh: function() {
		if (this.refreshId) window.clearInterval(this.refreshId);
		this.refreshId = window.setInterval(this.refresh.bind(this), this.refreshRate);
	}
};

module.exports = AppController;