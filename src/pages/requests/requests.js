// requests.js
console.log('>> Requests page');

import { fetchDataFromAPI } from '@scripts/apiManager';

export const apiUrl = process.env.API_URL;

// Initialize the application when the DOM is fully loaded
if (document.readyState === 'loading') {
	console.log("Loading hasn't finished yet.");
	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	console.log('DOMContentLoaded already fired.');
	initializeApp();
}

// Initialize the application
// This function sets up the initial state of the application
// and binds event listeners to the date inputs.
function initializeApp() {
	console.log('Initializing the application...');

	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'

	const dateInputs = document.querySelectorAll('input[type="date"]');
	dateInputs.forEach((input) => {
		input.value = formattedDate;
		input.min = formattedDate;
	});

	const dateFrom = document.querySelector('#date_1');
	const dateTo = document.querySelector('#date_2');

	if (dateFrom && dateTo) {
		dateFrom.addEventListener('change', handleDateChange);
		dateTo.addEventListener('change', handleDateChange);
	}

	// Add event listener for clearing rows
	document.querySelector('#matrix_1').addEventListener('click', (event) => {
		if (event.target.classList.contains('clear-row')) {
			clearMatrixRow(event.target.dataset.rowIndex);
		}
	});
}

function handleDateChange() {
	const dateFrom = document.querySelector('#date_1').value;
	const dateTo = document.querySelector('#date_2').value;

	if (dateFrom && dateTo) {
		populateBookingsSelectList();
	}
}

// Populate the bookings select list with data
async function populateBookingsSelectList() {
	const selectList = document.querySelector('#selectlist_bookings');
	const totalResults = document.querySelector('#totalResults');

	if (!selectList) {
		console.warn('Bookings select list not found.');
		return;
	}

	const response = await loadBookings();

	selectList.innerHTML = '<option value="Select One">Select One</option>'; // Clear existing options

	if (response && response.results) {
		response.results.forEach((booking) => {
			const option = document.createElement('option');

			option.value = booking.id;

			let dateTime = new Date(booking.startDateTime);
			dateTime.setHours(dateTime.getHours() - 40);
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

		if (totalResults) {
			totalResults.textContent = `Total Bookings: ${response.results.length}`;
		}

		populateMatrixWithBookings(response.results);
	} else {
		if (totalResults) {
			totalResults.textContent = 'Total Bookings: 0';
		}
	}
}

// Load bookings from the API
async function loadBookings(options = {}) {
	let filterParams = new FormData();
	const filterForm = document.querySelector('#filterForm');
	if (filterForm) {
		filterParams = new FormData(filterForm);
	}

	const dateFrom = document.querySelector('#date_1').value;
	const dateTo = document.querySelector('#date_2').value;

	const params = {
		startDateRange: {
			from: dateFrom || filterParams.get('startDateFrom') || '',
			to: dateTo || filterParams.get('startDateTo') || '',
		},
	};

	try {
		const response = await fetchDataFromAPI(apiUrl, params);
		console.log('API response:', response); // Debug log
		return response;
	} catch (error) {
		console.error('Error loading bookings:', error);
		return null;
	}
}

async function populateMatrixWithBookings(bookings) {
	const matrix = document.querySelector('#matrix_1 tbody');
	if (!matrix) {
		console.warn('Matrix not found.');
		return;
	}

	matrix.innerHTML = ''; // Clear existing rows

	bookings.forEach((booking, index) => {
		const row = document.createElement('tr');

		const groupCell = document.createElement('th');
		groupCell.innerHTML = `<label for="matrix_1_${index}">Group ${index + 1}</label>`;
		row.appendChild(groupCell);

		const referenceCell = document.createElement('td');
		referenceCell.className = 'text-center';
		referenceCell.innerHTML = `<input type="text" id="matrix_1_${index}_0" name="matrix_1_${index}_0" value="${booking.productExternalId}" class="form-control">`;
		row.appendChild(referenceCell);

		const travelerNameCell = document.createElement('td');
		travelerNameCell.className = 'text-center';
		travelerNameCell.innerHTML = `<input type="text" id="matrix_1_${index}_1" name="matrix_1_${index}_1" value="${booking.customer.firstName} ${booking.customer.lastName}" class="form-control">`;
		row.appendChild(travelerNameCell);

		const paxCell = document.createElement('td');
		paxCell.className = 'text-center';
		paxCell.innerHTML = `<input type="text" id="matrix_1_${index}_2" name="matrix_1_${index}_2" value="${booking.totalParticipants}" class="form-control">`;
		row.appendChild(paxCell);

		const phoneCell = document.createElement('td');
		phoneCell.className = 'text-center';
		phoneCell.innerHTML = `<input type="text" id="matrix_1_${index}_3" name="matrix_1_${index}_3" value="${booking.customer.phoneNumber}" class="form-control">`;
		row.appendChild(phoneCell);

		const clearButtonCell = document.createElement('td');
		clearButtonCell.innerHTML = `<button type="button" class="btn btn-secondary clear-row" data-row-index="${index}">Clear</button>`;
		row.appendChild(clearButtonCell);

		matrix.appendChild(row);
	});
}

// Function to clear inputs in a specific row and shift values from rows below
function clearMatrixRow(rowIndex) {
	const matrix = document.querySelector('#matrix_1 tbody');
	const rows = matrix.querySelectorAll('tr');
	const clearedRowIndex = parseInt(rowIndex);

	// Clear the inputs in the specified row
	const clearedInputs = rows[clearedRowIndex].querySelectorAll('input');
	clearedInputs.forEach((input) => {
		input.value = '';
	});

	// Shift values from rows below up
	for (let i = clearedRowIndex + 1; i < rows.length; i++) {
		const currentRowInputs = rows[i].querySelectorAll('input');
		const previousRowInputs = rows[i - 1].querySelectorAll('input');

		currentRowInputs.forEach((input, index) => {
			previousRowInputs[index].value = input.value;
			input.value = ''; // Clear the current row after shifting
		});
	}

	// Remove the last row if it is empty
	const lastRowInputs = rows[rows.length - 1].querySelectorAll('input');
	const isLastRowEmpty = Array.from(lastRowInputs).every((input) => input.value === '');
	if (isLastRowEmpty) {
		matrix.removeChild(rows[rows.length - 1]);
	}
}
