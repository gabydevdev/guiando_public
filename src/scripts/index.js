// index.js
export const apiUrl = process.env.API_URL;

if (document.readyState === "loading") {
	// Loading hasn't finished yet
	document.addEventListener("DOMContentLoaded", init());
} else {
	// `DOMContentLoaded` has already fired
	init();
}

async function init() {
	console.log('DOMContentLoaded');
	console.log('apiUrl: ', apiUrl);
}
