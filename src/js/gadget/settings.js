'use strict';

module.exports = function(appController) {
	if (typeof System !== 'undefined' && System.Gadget) {
		System.Gadget.settingsUI = 'settings.html';

		if (System.Gadget.Settings.read('configured')) {
			appController.set({
				twitch: { username: System.Gadget.Settings.read('twitchUser') },
				offline: !System.Gadget.Settings.read('hideOfflineChannels')
			});
		}

		System.Gadget.onSettingsClosed = function() {
			appController.set({
				twitch: { username: System.Gadget.Settings.read('twitchUser') },
				offline: !System.Gadget.Settings.read('hideOfflineChannels')
			});
		};
	}
};