// src/data/global.js
const crypto = require('crypto');

module.exports = {
	random() {
		return crypto.randomUUID();
	},
	year() {
		const date = new Date();
		return date.getFullYear();
	},
	webRoot: '',
	pageTitle: 'Default Page',
	currentPageUrl: '',
	site: {
		name: 'Guiando',
	},
	pages: [
		{
			title: 'Home',
			url: '/',
		},
		{
			title: 'Requests',
			url: '/requests.html',
		},
		{
			title: 'About',
			url: '/about.html',
		},
	],
};
