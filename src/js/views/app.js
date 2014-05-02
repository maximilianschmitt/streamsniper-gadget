'use strict';

var $ = require('jquery');
var _ = require('underscore');

var AppView = function(viewSelector) {
	this.offlineChannels  = true;
	
	this.$el              = $(viewSelector);
	
	this.$refreshButton   = this.$el.find('#refresh-button');
	this.$message         = this.$el.find('#message');
	this.$channels        = this.$el.find('#channels');
	this.$onlineChannels  = this.$el.find('#online-channels');
	this.$offlineChannels = this.$el.find('#offline-channels');
	
	this.adjustBodyHeight();
};

AppView.prototype = {
	onClickRefresh: function(cb) {
		this.$refreshButton.on('click', cb);
	},

	indicateLoading: function() {
		this.$refreshButton.attr('src', 'images/refreshing.gif');
		this.showMessage('Loading...');
	},

	// this is a method that has to be called each time the view changes
	// it's something weird with the Windows gadget stuff
	adjustBodyHeight: function() {
		var totalheight = this.$el.height();
		$('body').css('height', totalheight + 'px');
	},

	indicateLoaded: function(err) {
		this.$refreshButton.attr('src', 'images/refresh.png');
				
		if (err) {
			if (err.name === 'MissingUsername') {
				this.showMessage('Thanks for installing Streamsniper. Please go to the options dialog and enter your Twitch.TV user name.');
			} else {
				this.showMessage('An error occurred while loading your streams.');
			}
		}

		this.adjustBodyHeight();
	},

	showMessage: function(message) {
		this.$channels.hide();
		this.$message.show();
		this.$message.html(message);
		this.adjustBodyHeight();
	},

	showChannels: function() {
		this.$message.hide();
		this.$channels.show();
		this.adjustBodyHeight();
	},

	hideOffline: function() {
		this.offlineChannels = false;
		this.$offlineChannels.hide();

		this.adjustBodyHeight();
	},

	showOffline: function() {
		this.offlineChannels = true;
		this.$offlineChannels.show();

		this.adjustBodyHeight();
	},

	updateChannels: function(channels) {
		if (channels.all.length <= 0) {
			this.showMessage('You\'re not following any channels yet. Check out the <a href="http://www.twitch.tv/directory">Twitch directory</a> to find some channels to follow.');
			return;
		}

		this.showChannels();
		this.updateOnlineChannels(channels.online);
		this.updateOfflineChannels(channels.offline);

		this.adjustBodyHeight();
	},

	updateOnlineChannels: function(channels) {
		if (channels.length <= 0 && !this.offlineChannels) {
			this.showMessage('None of your followed channels are currently streaming.');
		}

		var $onlineChannels = this.$onlineChannels;

		$onlineChannels.empty();

		_.each(channels, function(channel) {
			$onlineChannels.append('<li><a href="' + channel.url + '">' + trimOnlineChannelName(channel.name)  + '</a> (' + channel.viewers + ')' + '</li>');
		});
	},

	updateOfflineChannels: function(channels) {
		var $offlineChannels = this.$offlineChannels;

		$offlineChannels.empty();

		_.each(channels, function(channel) {
			$offlineChannels.append('<li><a href="' + channel.url + '">' + trimOfflineChannelName(channel.name)  + '</a></li>');
		});
	}
};

function trimOnlineChannelName(name, viewers) {
	var maxChars     = 18;
	var viewerLength = ('' + viewers).length;
	var nameLength   = name.length;

	if (nameLength + viewerLength > maxChars) {
		return name.substr(0, maxChars - viewerLength) + '...';
	}

	return name;
}

function trimOfflineChannelName(name) {
	var maxChars = 22;

	if (name.length > maxChars) {
		return name.substr(0, maxChars - 3) + '...';
	}

	return name;
}

module.exports = AppView;