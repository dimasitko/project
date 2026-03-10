const USERS_API_URL = '/api/users';
let usersList = [];
let editUserId = null;

async function loadUsers() {
    try {
        const url = new URL(USERS_API_URL, window.location.origin);
        const searchInput = document.getElementById('userSearchInput');
        const roleSearch = document.getElementById('userRoleSearch');

        if (searchInput && searchInput.value.trim()) {
            url.searchParams.append('search', searchInput.value.trim());
        }
        if (roleSearch && roleSearch.value !== 'Всі') {
            url.searchParams.append('role', roleSearch.value);
        }

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            usersList = data.items || data || []; 
            
            renderUsersTable(usersList);
        }
    } catch (error) { console.error('Помилка:', error); }
}

function renderUsersTable(usersToRender) {
    usersTableBody.innerHTML = usersToRender.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.role}</td>
            <td>
                <div class="btn-group">
                    <button class="edit-btn" data-id="${user.id}">Редагувати</button>
                    <button class="delete-btn" data-id="${user.id}">Видалити</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function addUser(event) {
    event.preventDefault();
    if (!validateUserForm()) return;

    const userData = { 
        name: userNameInput.value.trim(), 
        role: userRoleSelect.value
    };

    try {
        const url = editUserId ? `${USERS_API_URL}/${editUserId}` : USERS_API_URL;
        const method = editUserId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const action = editUserId ? 'Оновлено' : 'Додано нового';
            createLog(`${action} користувача ${userData.role} '${userData.name}'`);
            await loadUsers();
            clearUserForm();
        }
    } catch (error) { console.error('Помилка збереження:', error); }
}

function clearUserForm() {
    userForm.reset();
    userNameInput.classList.remove('invalid');
    userRoleSelect.classList.remove('invalid');
    userNameError.textContent = '';
    userRoleError.textContent = '';

    editUserId = null;
    if (submitUserBtn) submitUserBtn.textContent = 'Зберегти користувача';
    
    userNameInput.focus();
}

function validateUserForm() {
    let isValid = true;
    if (!userNameInput.value.trim()) {
        userNameError.textContent = "Заповніть ім'я";
        userNameInput.classList.add('invalid'); 
        isValid = false;
    } else if (userNameInput.value.trim().length > 20) {
        userNameError.textContent = "Максимум 20 символів!";
        userNameInput.classList.add('invalid'); 
        isValid = false;
    } else {
        userNameError.textContent = ''; 
        userNameInput.classList.remove('invalid');
    }

    if (!userRoleSelect.value) {
        userRoleError.textContent = "Оберіть роль";
        userRoleSelect.classList.add('invalid'); 
        isValid = false;
    } else {
        userRoleError.textContent = ''; 
        userRoleSelect.classList.remove('invalid');
    }
    return isValid;
}

async function deleteUser(id) {
    const user = usersList.find(u => String(u.id) === String(id));
    try {
        const response = await fetch(`${USERS_API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok){
            if (user) createLog(`Видалено користувача ${user.role} ${user.name}`);
            await loadUsers();
        }
    } catch (error) { console.error('Помилка видалення:', error); }
}

function editUser(id) {
    const user = usersList.find(u => String(u.id) === String(id));
    if (user) {
        userNameInput.value = user.name.trim();
        userRoleSelect.value = user.role;
        editUserId = id;
        if (submitUserBtn) submitUserBtn.textContent = 'Зберегти зміни';
        userNameInput.focus();
    }
}