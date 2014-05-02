'use strict';

var apiUrl  = 'https://api.twitch.tv/kraken';

var $       = require('jquery');
var _       = require('underscore');
var Promise = require('bluebird');

var TwitchApi = {
	fetchFollowedChannels: function(username) {
		return Promise.cast($.getJSON(apiUrl + '/users/' + username + '/follows/channels?limit=999&callback=?'))
			.then(function(channels) {
				return formatChannels(channels.follows);
			});
	},

	fetchChannels: function(channels) {
		if (channels.length <= 0) return Promise.resolve({});

		return Promise.cast($.getJSON(apiUrl + '/streams?channel=' + channels + '&limit=999&callback=?'))
			.then(function(channels) {
				return formatChannels(channels.streams);
			});
	}
};

function formatChannels(channels) {
	var formattedChannels = [];

	_.each(channels, function(channel, i) {
		var formattedChannel = {
			id: channel.channel.name,
			name: channel.channel.display_name,
			url: channel.channel.url
		};

		if (typeof channel.viewers !== 'undefined') formattedChannel.viewers = channel.viewers;

		formattedChannels.push(formattedChannel);
	});

	return formattedChannels;
}

module.exports = TwitchApi;