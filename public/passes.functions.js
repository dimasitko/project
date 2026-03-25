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
    passesTableBody.innerHTML = itemsToRender.map(item => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
    });
    return `
        <tr>
            <td>${item.userName}</td>
            <td>${item.status}</td>
            <td>${formattedDate}</td>
            <td>${item.adminName}</td>
            <td>${item.comment}</td>
            <td>
                <div class="btn-group">
                    <button class="edit-btn" data-id="${item.id}">Редагувати</button>
                    <button class="delete-btn" data-id="${item.id}">Видалити</button>
                </div>
            </td>
        </tr>
    `;
}).join("");
}

async function addPass(event) {
    event.preventDefault();

    await loadUsers();

    const adminName = adminInput.value.trim();
    const foundAdmin = usersList.find(u => 
        u.name === adminName && u.role === 'Адміністратор'
    );
     
    if (!foundAdmin) {
        document.getElementById('adminError').textContent = 'Адміна не існує!';
        adminInput.classList.add('invalid');
        return;
    } else {
        document.getElementById('adminError').textContent = '';
        adminInput.classList.remove('invalid');
    }

    if (!validatePassForm()) return;

    const userEmail = emailInput.value.trim().toLowerCase();
    const newName = nameInput.value.trim();
    const newRole = statusSelect.value;

    let targetUser = usersList.find(u => u.email.toLowerCase() === userEmail);
    let userId;

    try {
        if (targetUser) {
            const updateRes = await fetch(`${USERS_API_URL}/${targetUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    email: targetUser.email,
                    role: newRole
                })
            });
            if (!updateRes.ok) throw new Error('Не вдалося оновити користувача');
            userId = targetUser.id;
        } else {
            const createRes = await fetch(USERS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    email: userEmail,
                    role: newRole
                })
            });
            if (!createRes.ok) throw new Error('Не вдалося створити користувача');
            const data = await createRes.json();
            userId = data.id || data.item?.id;
        }
        await loadUsers();

    const passData = {
        userName: newName,
        userEmail: userEmail,
        status: newRole,
        date: dateInput.value, 
        adminId: foundAdmin.id, 
        comment: commentInput.value.trim()
    };

        const url = editPassId ? `${PASSES_API_URL}/${editPassId}` : PASSES_API_URL;
        const method = editPassId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passData)
        });
        
        if (response.ok) { 
            const userName = document.getElementById('nameInput').value.trim();
            const adminName = document.getElementById('adminInput').value.trim();
            const action = editPassId ? 'оновив' : 'додав';
            createLog(`Адміністратор ${foundAdmin.name} ${action} пропуск користувача ${passData.userName}`);
            await loadPasses(); 
            clearPassForm(); 
        }
    } catch (error) { 
        console.error('Помилка збереження:', error);
     }
}

function validatePassForm() {
    let isValid = true;
    
    if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Заповніть ім\'я'; nameInput.classList.add('invalid'); isValid = false;
    } else { document.getElementById('nameError').textContent = ''; nameInput.classList.remove('invalid'); }

    if (!statusSelect.value) {
        document.getElementById('statusError').textContent = 'Оберіть причину'; statusSelect.classList.add('invalid'); isValid = false;
    } else { document.getElementById('statusError').textContent = ''; statusSelect.classList.remove('invalid'); }
    
    if (!emailInput.value.trim()) {
        emailError.textContent = "Заповніть Email!";
        emailInput.classList.add('invalid');
        isValid = false;
    } else {
        userEmailError.textContent = '';
        userEmailInput.classList.remove('invalid');
    }

    if (!dateInput.value) {
        document.getElementById('dateError').textContent = 'Оберіть дату'; dateInput.classList.add('invalid'); isValid = false;
    } else { document.getElementById('dateError').textContent = ''; dateInput.classList.remove('invalid'); }

    if (!adminInput.value.trim()) {
        document.getElementById('adminError').textContent = 'Заповніть поле'; adminInput.classList.add('invalid'); isValid = false;
    } else { document.getElementById('adminError').textContent = ''; adminInput.classList.remove('invalid'); }
    

    return isValid;
}

function clearPassForm(event) {
    if(event) event.preventDefault();
    form.reset();
    emailInput.readOnly = false; 
    emailInput.style.backgroundColor = "#ffffff";
    submitBtn.textContent = 'Додати';
    editPassId = null;
    document.querySelectorAll('#passes-view .invalid').forEach(el => el.classList.remove('invalid'));
    document.querySelectorAll('#passes-view .error-text').forEach(el => el.textContent = '');
}

async function deletePass(id) {
    const pass = passItems.find(p => String(p.id) === String(id));
    try {
        const response = await fetch(`${PASSES_API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok){
           if (pass) createLog(`Видалено пропуск користувача ${pass.userName}`);
             await loadPasses();
        }
    } catch (error) { console.error('Помилка видалення:', error); }
}

function editPass(id) {
    const item = passItems.find(i => String(i.id) === String(id));
    if (item) {
        nameInput.value = item.userName.trim();
        emailInput.value = item.userEmail.trim();
        emailInput.readOnly = true; 
        emailInput.style.backgroundColor = "#e9ecef";
        statusSelect.value = item.status;
        dateInput.value = item.date; 
        adminInput.value = item.adminName.trim();
        commentInput.value = item.comment; 
        editPassId = id;
        submitBtn.textContent = 'Зберегти'; 
        nameInput.focus();
    }
}