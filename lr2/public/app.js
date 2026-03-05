const API_URL = '/api/passes';
let items = [];

const form = document.getElementById('form');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const passesTable = document.getElementById('passesTable').querySelector('tbody');
const searchInput = document.getElementById('searchInput');
const statusSearch = document.getElementById('statusSearch');
const nameInput = document.getElementById('nameInput');
const statusSelect = document.getElementById('statusSelect');
const dateInput = document.getElementById('dateInput');
const adminInput = document.getElementById('adminInput');
const commentInput = document.getElementById('commentInput');
const statusOptions = ['Всі', 'Вчитель', 'Студент', 'Інше'];
let editId = null;

async function loadPasses() {
    try {
        const url = new URL(API_URL, window.location.origin);
        
        const searchTerm = searchInput.value.trim();
        const selectedStatus = statusSearch.value;

        if (searchTerm) {
            url.searchParams.append('search', searchTerm);
        }
        if (selectedStatus && selectedStatus !== 'Всі') {
            url.searchParams.append('status', selectedStatus);
        }

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            items = data.items || data || []; 
            renderTable(items);
        }
    } catch (error) {
        console.error('Помилка завантаження даних:', error);
    }
}

async function addPass(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const passData = {
        name: nameInput.value.trim(),
        status: statusSelect.value,
        date: dateInput.value,
        admin: adminInput.value.trim(),
        comment: commentInput.value.trim()
    };

    try {
        if (editId !== null) {
            const response = await fetch(`${API_URL}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passData)
            }); 
            if (response.ok) {
                await loadPasses(); 
            }
        } else { 
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passData)
            });
            
            if (response.ok) {
                await loadPasses(); 
            }
        }
        
        clearForm(event);
    } catch (error) {
        console.error('Помилка збереження:', error);
    }
}

function validateForm() {
    let isValid = true;

    if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Заповніть ім\'я';
        nameInput.classList.add('invalid');
        isValid = false;
    } else if (nameInput.value.length > 20) {
        document.getElementById('nameError').textContent = 'Максимум 20 символів!';
        nameInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('nameError').textContent = '';
        nameInput.classList.remove('invalid');
    }

    if (!statusSelect.value) {
        document.getElementById('statusError').textContent = 'Оберіть причину';
        statusSelect.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('statusError').textContent = '';
        statusSelect.classList.remove('invalid');
    }

    if (!dateInput.value) {
        document.getElementById('dateError').textContent = 'Оберіть дату';
        dateInput.classList.add('invalid');
        isValid = false;
    } else if (new Date(dateInput.value) < new Date()) {
        document.getElementById('dateError').textContent = 'Дата не може бути в минулому';
        dateInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('dateError').textContent = '';
        dateInput.classList.remove('invalid');
    }

    if (!adminInput.value.trim()) {
        document.getElementById('adminError').textContent = 'Заповніть ім\'я адміністратора';
        adminInput.classList.add('invalid');
        isValid = false;
    } else if (adminInput.value.length > 20) {
        document.getElementById('adminError').textContent = 'Максимум 20 символів!';
        adminInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('adminError').textContent = '';
        adminInput.classList.remove('invalid');
    }
    if (commentInput.value.length > 35) {
        document.getElementById('commentError').textContent = 'Максимум 35 символів!';
        commentInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('commentError').textContent = '';
        commentInput.classList.remove('invalid');
    }
    return isValid;
}


function renderTable(itemsToRender) {
    const rowsHtml = itemsToRender.map((item) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.date}</td>
            <td>${item.admin}</td>
            <td>${item.comment}</td>
            <td>
                <div class="btn-group">
                    <button class="edit-btn" data-id="${item.id}">Редагувати</button>
                    <button class="delete-btn" data-id="${item.id}">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
    passesTable.innerHTML = rowsHtml;
}


function clearForm(event) {
    event.preventDefault();
    nameInput.value = '';
    statusSelect.value = '';
    dateInput.value = '';
    adminInput.value = '';
    commentInput.value = '';
    submitBtn.textContent = 'Додати';
    editId = null;
    nameInput.focus();
}

async function deletePass(id) {
   try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadPasses();
        }
    } catch (error) {
        console.error('Помилка видалення:', error);
    }
}

function editPass(id) {
    const item = items.find(item => String(item.id)=== String(id));
    if (item) {
        nameInput.value = item.name.trim();
        statusSelect.value = item.status;
        dateInput.value = item.date;
        adminInput.value = item.admin.trim();
        commentInput.value = item.comment;
        editId = id;
        nameInput.focus();
    }
}

submitBtn.addEventListener('click', addPass);
clearBtn.addEventListener('click', clearForm);
passesTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const id = event.target.dataset.id;
        deletePass(id);
    }
});
passesTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        const id = event.target.dataset.id;
        submitBtn.textContent = 'Зберегти';
        editPass(id);
    }
});
searchInput.addEventListener('input', loadPasses);
statusSearch.addEventListener('change', loadPasses);
loadPasses();
