// home.js
console.log('>> Home page');

import { fetchDataFromAPI } from '@scripts/apiManager';
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

export const apiUrl = process.env.API_URL;

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

	window.Alpine = Alpine;
	Alpine.plugin(focus);
	Alpine.start();

	// Attach event listeners
	const filterForm = document.querySelector('#filterForm');
	if (filterForm) {
		filterForm.addEventListener('submit', handleFilterFormSubmit);
	}

	const pageSizeElement = document.querySelector('#pageSize');
	if (pageSizeElement) {
		pageSizeElement.addEventListener('change', handlePageSizeChange);
	}

	const tableHeader = document.querySelector('#bookingsTable thead');
	if (tableHeader) {
		tableHeader.addEventListener('click', handleTableHeaderClick);
	}

	const pagination = document.querySelector('#pagination');
	if (pagination) {
		pagination.addEventListener('click', handlePaginationClick);
	}

	// Trigger initial bookings load
	console.log('Calling loadBookings...');
	handleFilterFormSubmit(new Event('submit'));

	document.addEventListener('alpine:component-initialized', (event) => {
		console.log('A component was initialized:', event.detail);
	});

	document.addEventListener('alpine:mutation', () => {
		console.log('Alpine detected a DOM mutation.');
	});
}

// Handle filter form submission
async function handleFilterFormSubmit(event) {
	event.preventDefault();
	currentPage = 0; // Reset to first page when filters change
	const response = await loadBookings();
	if (response) {
		updateResultsCount(response.totalHits || 0);
		populateBookingsTable(response.results || []);
	}
}

// Handle page size change
async function handlePageSizeChange(event) {
	pageSize = parseInt(event.target.value, 10);
	currentPage = 0; // Reset to first page when page size changes
	const response = await loadBookings();
	if (response) {
		updateResultsCount(response.totalHits || 0);
		populateBookingsTable(response.results || []);
	}
}

// Handle table header click for sorting
async function handleTableHeaderClick(event) {
	if (event.target.tagName === 'TH') {
		const sortField = event.target.getAttribute('data');
		const response = await loadBookings({ sortField });
		if (response) {
			updateResultsCount(response.totalHits || 0);
			populateBookingsTable(response.results || []);
		}
	}
}

// Handle pagination button click
async function handlePaginationClick(event) {
	if (event.target.tagName === 'BUTTON') {
		const action = event.target.getAttribute('data-action');
		if (action === 'next') {
			currentPage++;
		} else if (action === 'prev' && currentPage > 0) { // Fix condition to allow going to the previous page
			currentPage--;
		}
		const response = await loadBookings();
		if (response) {
			updateResultsCount(response.totalHits || 0);
			populateBookingsTable(response.results || []);
		}
	}
}

// Update the results count display
function updateResultsCount(totalCount) {
	const totalText = document.querySelector('#totalCount');

	if (totalText) {
		if (totalCount === 0) {
			totalText.textContent = 'No results found';
		} else {
			totalText.textContent = `Total results: ${totalCount}`;
		}
	}

	const resultsText = document.querySelector('#resultsCount');

	if (resultsText) {
		if (totalCount === 0) {
			resultsText.textContent = 'No results found';
		} else {
			const start = currentPage * pageSize + 1;
			const end = Math.min((currentPage + 1) * pageSize, totalCount);
			resultsText.textContent = `Showing ${start} to ${end} of ${totalCount} results`;
		}
	}
}

// Populate the bookings table with data
function populateBookingsTable(data) {
	const tableBody = document.querySelector('#bookingsTable tbody');

	if (!tableBody) {
		console.warn('Bookings table not found.');
		return;
	}

	tableBody.innerHTML = ''; // Clear existing table rows

	data.forEach((booking) => {
		const row = document.createElement('tr');

		let startDate = new Date(booking.startDate);
		startDate.setDate(startDate.getDate() - 1);
		const startDateStr = startDate.toLocaleDateString(); // string in this format: 1/22/2025

		let dateTime = new Date(booking.startDateTime);
		dateTime.setHours(dateTime.getHours() - 40);
		const formattedDateTime = new Date(dateTime).toLocaleString('en-US', {
			hour12: false,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});

		const formattedPrice = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(booking.totalPrice);

		row.innerHTML = `
			<td>${booking.status}</td>
			<td>${booking.parentBookingId}</td>
			<td>${booking.productExternalId}</td>
			<td>${booking.customer.firstName} ${booking.customer.lastName}</td>
			<td>${booking.totalParticipants}</td>
			<td>${formattedPrice}</td>
			<td>${startDateStr}</td>
			<td>${booking.fields.startTimeStr}</td>
			<td>${formattedDateTime}</td>
			<td>${booking.seller.title}</td>
		`;

		tableBody.appendChild(row);
	});
}

// Populate the bookings select list with data
function populateBookingsSelectList(data) {
	const selectList = document.querySelector('#selectlist_bookings');

	if (!selectList) {
		console.warn('Bookings select list not found.');
		return;
	}

	selectList.innerHTML = '<option value="Select One">Select One</option>'; // Clear existing options

	data.forEach((booking) => {
		const option = document.createElement('option');

		option.value = booking.id;

		let dateTime = new Date(booking.startDateTime);
		dateTime.setHours(dateTime.getHours() - 16);
		const formattedDateTime = new Date(dateTime).toLocaleString('en-US', {
			hour12: false,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});

		option.textContent = `${booking.customer.firstName} ${booking.customer.lastName} - ${formattedDateTime}`;

		selectList.appendChild(option);
	});
}

// Load bookings from the API
async function loadBookings(options = {}) {
	let filterParams = new FormData();
	const filterForm = document.querySelector('#filterForm');
	if (filterForm) {
		filterParams = new FormData(filterForm);
	}

	const params = {
		page: currentPage || 0,
		pageSize: pageSize || 10,
		startDateRange: {
			from: filterParams.get('startDateFrom') || '',
			to: filterParams.get('startDateTo') || '',
		},
		sortField: options.sortField || '',
		// Add other default parameters if needed
	};

	try {
		const response = await fetchDataFromAPI(apiUrl, params);
		console.log('API response:', response); // Debug log
		return response;
	} catch (error) {
		console.error('Error loading bookings:', error);

		if (Alpine.store('alert')) {
			console.log('Triggering Alpine alert store...');
			Alpine.store('alert').showAlert(error.message);
		} else {
			console.warn('Alpine alert store is not initialized');
		}
		return null;
	}
}
