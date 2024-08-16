const rowsPerPage = 8;
let currentPage = 1;

// ---------------------------------  loading users
async function loadUsers() {
	const response = await fetch('users.json');
	const users = await response.json();
	renderTable(users);
	setupPagination(users);
	updatePaginationInfo(currentPage, rowsPerPage, users.length);
}

// ---------------------------------  generated table
function renderTable(users) {
	const tableContainer = document.getElementById('customer-table');
	tableContainer.innerHTML = ''; // Очистити вміст

	// Визначаємо індекси користувачів, яких треба показати
	const start = (currentPage - 1) * rowsPerPage;
	const end = start + rowsPerPage;
	const paginatedUsers = users.slice(start, end);

	// Генерація таблиці
	let tableHtml = '<table class="table">';
	tableHtml += `
        <thead>
            <tr class="table__title">
                <th class="table__title-head">Customer Name</th>
                <th class="table__title-head">Company</th>
                <th class="table__title-head">Phone Number</th>
                <th class="table__title-head mobile_row">Email</th>
                <th class="table__title-head mobile_row">Country</th>
                <th class="table__title-head st">Status</th>
            </tr>
        </thead>
        <tbody>
    `;

	paginatedUsers.forEach(user => {
		tableHtml += `
            <tr class="table__raw">
                <td class="table__raw-text">${user.name}</td>
                <td class="table__raw-text">${user.company}</td>
                <td class="table__raw-text">${user.phone}</td>
                <td class="table__raw-text mobile_row">${user.email}</td>
                <td class="table__raw-text mobile_row">${user.country}</td>
                <td>
								<span class="${user.status.toLowerCase()}_btn status">${
									user.status
								}</span> </td>
            </tr>
        `;
	});

	tableHtml += '</tbody></table>';
	tableContainer.innerHTML = tableHtml;
}

// ---------------------------------  generated pagination
function setupPagination(users) {
	const paginationContainer = document.getElementById('pagination');
	paginationContainer.innerHTML = '';

	const pageCount = Math.ceil(users.length / rowsPerPage);

	// --- previous Btn
	const prevButton = document.createElement('button');
	prevButton.className = 'pagination__button pagination__button--prev';
	prevButton.innerHTML = '&lt';
	prevButton.disabled = currentPage === 1;
	prevButton.addEventListener('click', () => {
		if (currentPage > 1) {
			currentPage--;
			renderTable(users);
			setupPagination(users);
			updatePaginationInfo(currentPage, rowsPerPage, users.length);
		}
	});
	paginationContainer.appendChild(prevButton);

	// --- main Btns
	for (let i = 1; i <= 4; i++) {
		const pageButton = document.createElement('button');
		pageButton.innerText = i;
		pageButton.className = 'pagination__button mobile';
		if (i === currentPage) {
			pageButton.classList.add('active');
		}
		pageButton.addEventListener('click', () => {
			currentPage = i;
			renderTable(users);
			setupPagination(users);
			updatePaginationInfo(currentPage, rowsPerPage, users.length);
		});
		paginationContainer.appendChild(pageButton);
	}

	// --- ... Btn
	if (pageCount > 4) {
		const ellipsis = document.createElement('span');
		ellipsis.className = 'pagination__ellipsis mobile';
		ellipsis.innerHTML = '...';
		paginationContainer.appendChild(ellipsis);

		// --- last page Btn
		const lastPageBtn = document.createElement('button');
		lastPageBtn.innerText = pageCount;
		lastPageBtn.className = 'pagination__button mobile';
		if (pageCount === currentPage) {
			lastPageBtn.classList.add('active');
		}
		lastPageBtn.addEventListener('click', () => {
			currentPage = pageCount;
			renderTable(users);
			setupPagination(users);
			updatePaginationInfo(currentPage, rowsPerPage, users.length);
		});
		paginationContainer.appendChild(lastPageBtn);
	}

	// --- next Btn
	const nextButton = document.createElement('button');
	nextButton.className = 'pagination__button pagination__button--next';
	nextButton.innerHTML = '&gt;';
	nextButton.disabled = currentPage === pageCount;
	nextButton.addEventListener('click', () => {
		if (currentPage < pageCount) {
			currentPage++;
			renderTable(users);
			setupPagination(users);
			updatePaginationInfo(currentPage, rowsPerPage, users.length);
		}
	});
	paginationContainer.appendChild(nextButton);
}

// ---------------------------------  generated pagination-info
function updatePaginationInfo(currentPage, rowsPerPage, totalEntries) {
	const paginationInfo = document.querySelector('.pagination__info');

	const startEntry = (currentPage - 1) * rowsPerPage + 1;
	let endEntry = currentPage * rowsPerPage;

	if (endEntry > totalEntries) {
		endEntry = totalEntries;
	}

	paginationInfo.textContent = `Showing data ${startEntry} to ${endEntry} of  ${totalEntries} entries`;
}

loadUsers();
