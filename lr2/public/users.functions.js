const USERS_API_URL = '/api/users';
let usersList = [];

async function loadUsers() {
    try {
        const response = await fetch(USERS_API_URL);
        if (response.ok) {
            usersList = await response.json();
            renderUsersTable(usersList);
        }
    } catch (error) { console.error('Помилка:', error); }
}

function renderUsersTable(usersToRender) {
    usersTableBody.innerHTML = usersToRender.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.role}</td>
            <td><button class="delete-btn" data-id="${user.id}">Видалити</button></td>
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
        const response = await fetch(USERS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
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
    
    try {
        const response = await fetch(`${USERS_API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) await loadUsers();
    } catch (error) { console.error('Помилка видалення:', error); }
}