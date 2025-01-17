// apiManager.js

import CryptoJS from 'crypto-js';

/**
 * Fetch bookings data from API.
 *
 * @param {string} apiURL - The URL of the API endpoint.
 * @param {Object} params - The parameters for the API request.
 * @param {boolean} [params.excludeComboBookings=false] - Whether to exclude combo bookings.
 * @param {number} [params.page=0] - The page number for pagination.
 * @param {number} [params.pageSize=10000] - The number of items per page.
 * @param {Object} [params.startDateRange] - The start date range for the bookings.
 * @param {string} [params.startDateRange.from="2024-12-19T05:21:48Z"] - The start date.
 * @returns {Promise<Object>} The JSON response from the API.
 * @throws {Error} If the API request fails.
 *
 * @example
 * const apiURL = "https://api.bokun.io/booking.json/product-booking-search";
 * const params = {
 *   excludeComboBookings: true,
 *   page: 1,
 *   pageSize: 50,
 *   startDateRange: {
 *     from: "2025-01-01T00:00:00Z"
 *   }
 * };
 *
 * fetchDataFromAPI(apiURL, params)
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
export async function fetchDataFromAPI(apiURL, params = {}) {
	const bokunAccessKey = (typeof process !== 'undefined' && process.env.X_BOKUN_ACCESS_KEY) || "06b7da340a284ed1ada016d0c1c903f9";
	const bokunSecretKey = (typeof process !== 'undefined' && process.env.X_BOKUN_SECRET_KEY) || "11174ed1bd52433a9375d504f01cd07b";
	const sessionId = (typeof process !== 'undefined' && process.env.SESSION_ID) || "86d4aa28-d57b-429c-a241-14ff34037974";

	const d = new Date();
	const bokunDate = d.toISOString().split('.')[0].split('T').join(' ');

	let relativePath = new URL(apiURL).pathname;
	const httpMethod = 'POST';
	const contentType = 'application/json';

	const strToSign = bokunDate + bokunAccessKey + httpMethod + relativePath;
	const hash = CryptoJS.HmacSHA1(strToSign, bokunSecretKey);
	const signature = hash.toString(CryptoJS.enc.Base64);

	const myHeaders = new Headers();
	myHeaders.append('X-Bokun-AccessKey', bokunAccessKey);
	myHeaders.append('X-Bokun-Date', bokunDate);
	myHeaders.append('X-Bokun-Signature', signature);
	myHeaders.append('Content-Type', contentType);

	const raw = JSON.stringify({
		excludeComboBookings: params.excludeComboBookings || false,
		page: params.page || 0,
		pageSize: params.pageSize || 10000,
		startDateRange: {
			from: params.startDateRange?.from || '2024-12-19T05:21:48Z',
		},
	});

	const requestOptions = {
		method: httpMethod,
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	const response = await fetch(apiURL, requestOptions);
	if (!response.ok) {
		throw new Error('Failed to fetch bookings data');
	}
	return await response.json();
}
