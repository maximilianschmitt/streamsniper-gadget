'use strict';

var _       = require('underscore');
var Promise = require('bluebird');
var Twitch  = require('../apis/twitch');

var TwitchSniper = function(options) {
	this.options = options;
};

TwitchSniper.prototype = {
	set: function(options) {
		this.options = options;
	},
	// returns all, online and offline favorites for configured username
	snipe: function() {
		var channels = {
			all: [],
			online: [],
			offline: []
		};

		if (!this.options.username) {
			var err  = new Error('Missing username');
			err.name = 'MissingUsername';

			return Promise.reject(err);
		}

		return Twitch.fetchFollowedChannels(this.options.username)
		.then(function(followedChannels) {
			channels.all = followedChannels;

			return Twitch.fetchChannels(channelsToCommaList(followedChannels));
		})
		.then(function(onlineChannels) {
			channels.online = onlineChannels;
			channels.offline = extractOfflineChannels(channels.all, onlineChannels);

			return channels;
		});
	}
};

function extractOfflineChannels(allChannels, onlineChannels) {
	var onlineIds = _.pluck(onlineChannels, 'id');

	return _.reject(allChannels, function(channel) {
		return _.contains(onlineIds, channel.id);
	});
}

function channelsToCommaList(channels) {
	var commaList = '';

	_.each(channels, function(channel, i) {
		commaList += channel.id;
		if (i < commaList.length - 2) commaList += ',';
	});

	return commaList;
}

module.exports = TwitchSniper;