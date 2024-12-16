// src/data/global.js
const crypto = require('crypto');
const baseUrl = process.env.BASE_URL_PATH;

module.exports = {
	random() {
		return crypto.randomUUID();
	},
	year() {
		const date = new Date();
		return date.getFullYear();
	},
	webRoot: '',
	baseUrl: baseUrl,
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
