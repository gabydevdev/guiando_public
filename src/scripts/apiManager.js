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
 * @param {string} [params.startDateRange.from] - The start date.
 * @param {string} [params.startDateRange.to] - The end date.
 * @param {Object} [params.sortFields] - The fields to sort by.
 * @param {string} [params.sortFields.name="startDate"] - The field name to sort by.
 * @param {string} [params.sortFields.order="ASC"] - The order of sorting (ASC or DESC).
 * @returns {Promise<Object>} The JSON response from the API.
 * @throws {Error} If the API request fails.
 *
 * @see {@link https://api-docs.bokun.dev/rest-v1} for more information on the Bokun API.
 *
 * @example
 * const apiURL = "https://api.bokun.io/booking.json/product-booking-search";
 * const params = {
 *   excludeComboBookings: true,
 *   page: 1,
 *   pageSize: 50,
 *   sortFields: {
 *     name: "startDate",
 *     order: "ASC"
 *   },
 *   startDateRange: {
 *     from: "2025-01-01T00:00:00Z",
 *     to: "2025-01-31T23:59:59Z"
 *   }
 * };
 *
 * fetchDataFromAPI(apiURL, params)
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
export async function fetchDataFromAPI(apiURL, params = {}) {
	// Extract API keys from environment variables
	const bokunAccessKey = process.env.X_BOKUN_ACCESS_KEY;
	const bokunSecretKey = process.env.X_BOKUN_SECRET_KEY;

	// Check if API keys are available
	if (!bokunAccessKey || !bokunSecretKey) {
		throw new Error('Missing Bokun API keys.');
	}

	// Get the current date and time in the required format
	const bokunDate = new Date().toISOString().split('.')[0].replace('T', ' ');

	// Extract the relative path from the API URL
	const relativePath = new URL(apiURL).pathname;
	const httpMethod = 'POST';
	const contentType = 'application/json';

	// Create the string to sign for the HMAC signature
	const strToSign = `${bokunDate}${bokunAccessKey}${httpMethod}${relativePath}`;
	const signature = CryptoJS.HmacSHA1(strToSign, bokunSecretKey).toString(CryptoJS.enc.Base64);

	// Set up the headers for the API request
	const myHeaders = new Headers({
		'X-Bokun-AccessKey': bokunAccessKey,
		'X-Bokun-Date': bokunDate,
		'X-Bokun-Signature': signature,
		'Content-Type': contentType,
	});

	let startDateRangeFrom = params.startDateRange?.from || new Date().toISOString();
	startDateRangeFrom = new Date(startDateRangeFrom);
	startDateRangeFrom.setDate(startDateRangeFrom.getDate() - 1);

	let startDateRangeToNextDay = '';
	const startDateRangeTo = params.startDateRange?.to || '';

	if (startDateRangeTo) {
		startDateRangeToNextDay = new Date(startDateRangeTo);
		startDateRangeToNextDay.setDate(startDateRangeToNextDay.getDate() - 2);
	}

	// Prepare the request body with the provided parameters and defaults
	const raw = JSON.stringify({
		excludeComboBookings: false,
		page: params.page || 0,
		pageSize: 10000,
		// pageSize: params.pageSize || 10000,
		sortFields: [
			{
				name: params.sortFields?.name || 'startDateTime',
				order: params.sortFields?.order || 'ASC',
			},
		],
		startDateRange: {
			from: startDateRangeFrom,
			...(startDateRangeToNextDay && { to: startDateRangeToNextDay }),
		},
		bookingStatuses: ['CONFIRMED'],
	});

	// Set up the request options
	const requestOptions = {
		method: httpMethod,
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	try {
		// Make the API request
		const response = await fetch(apiURL, requestOptions);

		// Check if the response is not OK
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to fetch bookings data');
		}

		// Get the JSON response
		const data = await response.json();

		const fromDate = new Date(startDateRangeFrom);
		const fromDateString = fromDate.toLocaleDateString(); // string in this format: 1/22/2025

		let toDate, toDateString;
		if (startDateRangeTo) {
			toDate = new Date(startDateRangeTo);
			toDateString = toDate.toLocaleDateString(); // string in this format: 1/31/2025
		}

		const filteredResults = data.results.filter((entry) => {
			const entryDate = new Date(entry.startDate);
			const entryDateString = entryDate.toLocaleDateString(); // string in this format: 1/22/2025
			const entryTimeString = entry.fields.startTimeStr;      // string in this format: 13:00

			const timeA = new Date(`${entryDateString} ${entryTimeString}:00`);

			if (entryDateString == fromDateString) {
				if (timeA <= fromDate) {
					return false;
				} else {
					return true;
				}
			}

			if (startDateRangeTo) {
				if (timeA <= toDate) {
					return true;
				} else {
					return false;
				}
			}

			return true;
		});

		// Return the filtered results
		return { ...data, results: filteredResults };
		// return data;
	} catch (error) {
		// Log and rethrow the error
		console.error('Error fetching data from API:', error);
		throw error;
	}
}
