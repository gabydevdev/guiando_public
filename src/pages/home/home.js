// home.js
console.log('>> Home page');

/*
import { apiUrl } from '@scripts/index.js';
import { fetchDataFromAPI } from '@scripts/apiManager.js';

const apiBookingsUrl = apiUrl + 'api/bookings';
const apiBookingSingleUrl = apiUrl + 'api/booking/single';

let bookings, filterDate;
let currentPage = 1;
let limit = 12;
let params = {
	limit: limit,
	page: currentPage,
};

document.addEventListener('DOMContentLoaded', async function () {

	// bookings = await fetchDataFromAPI(apiBookingsUrl, params);
	// console.log('bookings: ', bookings);

	// Populate the table when the page loads
	// fetchBookings(apiBookingsUrl, params, currentPage);

});

// async function fetchBookings(api, params, page, filterDate) {
// 	let bookings = await fetchDataFromAPI(api, { ...params, page });

// 	bookings.data.forEach((booking) => {
// 		const bookingId = booking.bookingId;
// 		const bookingData = await fetchSingleBookingData(apiBookingSingleUrl, bookingId);
// 		console.log('bookingData: ', bookingData);
// 	})

// }

// async function fetchSingleBookingData(api, id) {
// 	const activityBookings, productId;
// 	const booking = await fetchDataFromAPI(api, id);

// 	activityBookings = booking.activityBookings[0];
// 	productId = activityBookings.product.externalId;

// 	return productId;
// }
*/
