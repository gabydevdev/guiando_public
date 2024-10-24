// apiManager.js

// Function to fetch bookings data from API
export async function fetchDataFromAPI(apiURL, params) {
	let url = `${apiURL}`;

	if (params) {
		const query = new URLSearchParams(params).toString();
		url = `${apiURL}?${query}`;
	}

	console.log('url: ', url);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Failed to fetch bookings data');
	}
	return await response.json();
}
