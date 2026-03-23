userForm.addEventListener('submit', addUser);

if (usersTableBody) {
    usersTableBody.parentNode.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        if (event.target.classList.contains('delete-btn')) {
            deleteUser(id);
        }
        if(event.target.classList.contains('edit-btn')) {
            editUser(id)
        }
    });
}
1
if (userSearchInput) {
    userSearchInput.addEventListener('input', loadUsers);
}
if (userRoleSearch) {
    userRoleSearch.addEventListener('change', loadUsers);
}