// index.js
import { fetchDataFromAPI } from './apiManager';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

export const apiUrl = process.env.API_URL;

// Bokun API URL and pagination settings
let currentPage = 0;
let pageSize = 10;

// Initialize the application when the DOM is fully loaded
if (document.readyState === 'loading') {
	console.log("Loading hasn't finished yet.");
	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	console.log('DOMContentLoaded already fired.');
	initializeApp();
}

function initializeApp() {
	console.log('Initializing the application...');

	// Define Alpine.js store for the alert
	Alpine.store('alert', {
		show: false,
		message: '',
		showAlert(message) {
			console.log('showAlert triggered with message:', message); // Debug log
			this.message = message;
			this.show = true;
		},
		closeAlert() {
			console.log('closeAlert triggered'); // Debug log
			this.show = false;
		},
	});

	// document.addEventListener('alpine:initialized', () => {
	// 	console.log('Alpine components are fully initialized!');
	// });

	window.Alpine = Alpine;
	Alpine.plugin(focus);
	Alpine.start();

	// Attach event listeners
	document.querySelector('#filterForm').addEventListener('submit', handleFilterFormSubmit);
	document.querySelector('#pageSize').addEventListener('change', handlePageSizeChange);
	document.querySelector('#bookingsTable thead').addEventListener('click', handleTableHeaderClick);
	document.querySelector('#pagination').addEventListener('click', handlePaginationClick);

	// Trigger initial bookings load
	console.log('Calling loadBookings...');
	loadBookings();

	document.addEventListener('alpine:component-initialized', (event) => {
		console.log('A component was initialized:', event.detail);
	});

	document.addEventListener('alpine:mutation', () => {
		console.log('Alpine detected a DOM mutation.');
	});
}

// Handle filter form submission
function handleFilterFormSubmit(event) {
	event.preventDefault();
	currentPage = 0; // Reset to first page when filters change
	loadBookings();
}

// Handle page size change
function handlePageSizeChange(event) {
	pageSize = parseInt(event.target.value, 10);
	currentPage = 0; // Reset to first page when page size changes
	loadBookings();
}

// Handle table header click for sorting
function handleTableHeaderClick(event) {
	if (event.target.tagName === 'TH') {
		const sortField = event.target.getAttribute('data');
		loadBookings({ sortField });
	}
}

// Handle pagination button click
function handlePaginationClick(event) {
	if (event.target.tagName === 'BUTTON') {
		const action = event.target.getAttribute('data-action');
		if (action === 'next') {
			currentPage++;
		} else if (action === 'prev' && currentPage > 0) { // Fix condition to allow going to the previous page
			currentPage--;
		}
		loadBookings();
	}
}

// Load bookings from the API
async function loadBookings(options = {}) {
	const filterParams = new FormData(document.querySelector('#filterForm'));
	const params = {
		page: currentPage,
		pageSize,
		startDateRange: {
			from: filterParams.get('startDateFrom'),
			to: filterParams.get('startDateTo'),
		},
		...options,
	};

	try {
		const response = await fetchDataFromAPI(apiUrl, params);
		console.log('API response:', response); // Debug log
		populateBookingsTable(response.results || []);
		updateResultsCount(response.totalHits || 0);
	} catch (error) {
		console.error('Error loading bookings:', error);

		if (Alpine.store('alert')) {
			console.log('Triggering Alpine alert store...');
			Alpine.store('alert').showAlert(error.message);
		} else {
			console.warn('Alpine alert store is not initialized');
		}
	}
}

// Populate the bookings table with data
function populateBookingsTable(data) {
	const tableBody = document.querySelector('#bookingsTable tbody');

	if (!tableBody) {
		console.warn('Bookings table not found');
		return;
	}

	tableBody.innerHTML = ''; // Clear existing table rows

	const queryDate = new Date().toLocaleDateString();
	const queryTime = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });

	console.log('Query date:', queryDate);
	console.log('Query time:', queryTime);

	data.forEach((booking) => {
		const row = document.createElement('tr');

		const formattedDate = new Date(booking.startDate).toLocaleDateString();
		const formattedPrice = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(booking.totalPrice);

		// Correctly fill the row with booking data
		if (!(formattedDate === queryDate && booking.fields.startTimeStr === queryTime)) {
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
		}

		tableBody.appendChild(row);
	});
}

// Update the results count display
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
