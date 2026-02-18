let items = JSON.parse(localStorage.getItem('passes')) || [];

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


function saveToLocalStorage() {
    localStorage.setItem('passes', JSON.stringify(items));
}  

function addPass(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const name = nameInput.value.trim();
    const status = statusSelect.value;
    const date = dateInput.value;
    const admin = adminInput.value.trim();
    const comment = commentInput.value.trim();

    if (editId !== null) {
        const index = items.findIndex(item => item.id === editId);
        if (index !== -1) {
            items[index] = { 
                id: editId, 
                name, 
                status, 
                date, 
                admin, 
                comment 
            };
        }
    } else {
        const newItem = {
            id: Date.now(),
            name, 
            status, 
            date,
            admin,
            comment
        };
            items.push(newItem)
    }
    saveToLocalStorage();
    renderTable(items);
    clearForm(event);

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



function renderTable(items) {
    const tbody = document.getElementById("passesTable").querySelector("tbody");
    const rowsHtml = items.map((item) => `
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
    tbody.innerHTML = rowsHtml;
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

function deletePass(id) {
    items = items.filter(item => item.id !== id);
    renderTable(items);
    saveToLocalStorage();
}

function editPass(id) {
    const item = items.find(item => item.id === id);
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
 function filterPasses() {
    if(searchInput.value.trim() === '' && statusSearch.value === 'Всі'){
        renderTable(items)
        return;
    }else{
    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = statusSearch.value;                 
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesStatus = selectedStatus === 'Всі' || item.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });
    renderTable(filteredItems);
}
 }


submitBtn.addEventListener('click', addPass);
clearBtn.addEventListener('click', clearForm);
passesTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const id = Number(event.target.dataset.id);
        deletePass(id);
    }
});
passesTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        const id = Number(event.target.dataset.id);
        submitBtn.textContent = 'Зберегти';
        editPass(id);
    }
});
searchInput.addEventListener('input', filterPasses);
statusSearch.addEventListener('change', filterPasses);
renderTable(items);
