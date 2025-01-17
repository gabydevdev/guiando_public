import { fetchDataFromAPI } from "../../scripts/apiManager";

// home.js
console.log('>> Home page');

const bokunURL = 'https://api.bokun.io/booking.json/product-booking-search';
let currentPage = 1;
let pageSize = 10;

document.addEventListener('DOMContentLoaded', () => {
	loadBookings();

	document.querySelector('#filterForm').addEventListener('submit', event => {
		event.preventDefault();
		currentPage = 1; // Reset to first page when filters change
		loadBookings();
	});

	document.querySelector('#pageSize').addEventListener('change', event => {
		pageSize = parseInt(event.target.value, 10);
		currentPage = 1; // Reset to first page when page size changes
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
			} else if (action === 'prev' && currentPage > 1) {
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
			updateResultsCount(response.totalHits || 0);
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

function updateResultsCount(totalCount) {
	const resultsCount = document.querySelector('#resultsCount');
	if (totalCount === 0) {
		resultsCount.textContent = 'No results found';
	} else {
		const start = currentPage * pageSize + 1;
		const end = Math.min((currentPage + 1) * pageSize, totalCount);
		resultsCount.textContent = `Showing ${start} to ${end} of ${totalCount} results`;
	}
}
