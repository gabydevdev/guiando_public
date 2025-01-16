import { fetchDataFromAPI } from "../../scripts/apiManager";

// home.js
console.log('>> Home page');

const bokunURL = 'https://api.bokun.io/booking.json/product-booking-search';
let currentPage = 0;
const pageSize = 10;

document.addEventListener('DOMContentLoaded', () => {
	loadBookings();

	document.querySelector('#filterForm').addEventListener('submit', event => {
		event.preventDefault();
		loadBookings();
	});

	document.querySelector('#bookingsTable thead').addEventListener('click', event => {
		if (event.target.tagName === 'TH') {
			const sortField = event.target.getAttribute('data');
			loadBookings({ sortField });
		}
	});

	document.querySelector('#pagination').addEventListener('click', event => {
		if (event.target.tagName === 'BUTTON') {
			const action = event.target.getAttribute('data-action');
			if (action === 'next') {
				currentPage++;
			} else if (action === 'prev' && currentPage > 0) {
				currentPage--;
			}
			loadBookings();
		}
	});
});

function loadBookings(options = {}) {
	const filterParams = new FormData(document.querySelector('#filterForm'));
	const params = {
		page: currentPage,
		pageSize,
		startDateRange: {
			from: filterParams.get('startDateFrom'),
			to: filterParams.get('startDateTo')
		},
		...options
	};

	fetchDataFromAPI(bokunURL, params)
		.then(response => {
			console.log(response);
			populateBookingsTable(response.results || []); // Adjust this line based on the actual structure of your API response
		})
		.catch(error => console.error(error));
}

function populateBookingsTable(data) {
	const tableBody = document.querySelector('#bookingsTable tbody');
	tableBody.innerHTML = ''; // Clear existing table rows

	data.forEach(booking => {
		const row = document.createElement('tr');

		const formattedDate = new Date(booking.startDate).toLocaleDateString();
		const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.totalPrice);

		row.innerHTML = `
			<td>${booking.status}</td>
			<td>${booking.parentBookingId}</td>
			<td>${booking.productExternalId}</td>
			<td>${booking.customer.firstName} ${booking.customer.lastName}</td>
			<td>${booking.totalParticipants}</td>
			<td>${formattedPrice}</td>
			<td>${formattedDate}</td>
			<td>${booking.fields.startTimeStr}</td>
			<td>${booking.seller.title}</td>
		`;

		tableBody.appendChild(row);
	});
}
