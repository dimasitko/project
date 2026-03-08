const PASSES_API_URL = '/api/passes';
let passItems = [];
let editPassId = null;

async function loadPasses() {
    try {
        const url = new URL(PASSES_API_URL, window.location.origin);
        if (searchInput.value.trim()) url.searchParams.append('search', searchInput.value.trim());
        if (statusSearch.value && statusSearch.value !== 'Всі') url.searchParams.append('status', statusSearch.value);

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            passItems = data.items || data || []; 
            renderPassesTable(passItems);
        }
    } catch (error) { console.error('Помилка завантаження:', error); }
}

function renderPassesTable(itemsToRender) {
    passesTableBody.innerHTML = itemsToRender.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.date}</td>
            <td>${item.admin}</td>
            <td>${item.comment}</td>
            <td>
                <div class="btn-group">
                    <button class="edit-btn" data-id="${item.id}">Редаг.</button>
                    <button class="delete-btn" data-id="${item.id}">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
}

async function addPass(event) {
    event.preventDefault();
    if (!validatePassForm()) return;

    const passData = {
        name: nameInput.value.trim(), 
        status: statusSelect.value,
        date: dateInput.value, 
        admin: adminInput.value.trim(), 
        comment: commentInput.value.trim()
    };

    try {
        const url = editPassId ? `${PASSES_API_URL}/${editPassId}` : PASSES_API_URL;
        const method = editPassId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passData)
        });
        
        if (response.ok) { 
            await loadPasses(); 
            clearPassForm(); 
        }
    } catch (error) { console.error('Помилка збереження:', error); }
}

function validatePassForm() {
    let isValid = true;
    
    if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Заповніть ім\'я'; nameInput.classList.add('invalid'); isValid = false;
    } else { document.getElementById('nameError').textContent = ''; nameInput.classList.remove('invalid'); }

    if (!statusSelect.value) {
        document.getElementById('statusError').textContent = 'Оберіть причину'; statusSelect.classList.add('invalid'); isValid = false;
    } else { document.getElementById('statusError').textContent = ''; statusSelect.classList.remove('invalid'); }

    if (!dateInput.value) {
        document.getElementById('dateError').textContent = 'Оберіть дату'; dateInput.classList.add('invalid'); isValid = false;
    } else { document.getElementById('dateError').textContent = ''; dateInput.classList.remove('invalid'); }

    if (!adminInput.value.trim()) {
        document.getElementById('adminError').textContent = 'Заповніть адміна'; adminInput.classList.add('invalid'); isValid = false;
    } else { document.getElementById('adminError').textContent = ''; adminInput.classList.remove('invalid'); }
    
    return isValid;
}

function clearPassForm(event) {
    if(event) event.preventDefault();
    form.reset();
    submitBtn.textContent = 'Додати';
    editPassId = null;
    document.querySelectorAll('#passes-view .invalid').forEach(el => el.classList.remove('invalid'));
    document.querySelectorAll('#passes-view .error-text').forEach(el => el.textContent = '');
}

async function deletePass(id) {
    try {
        const response = await fetch(`${PASSES_API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) await loadPasses();
    } catch (error) { console.error('Помилка видалення:', error); }
}

function editPass(id) {
    const item = passItems.find(i => String(i.id) === String(id));
    if (item) {
        nameInput.value = item.name.trim(); statusSelect.value = item.status;
        dateInput.value = item.date; adminInput.value = item.admin.trim();
        commentInput.value = item.comment; editPassId = id;
        submitBtn.textContent = 'Зберегти'; nameInput.focus();
    }
}