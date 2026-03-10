userForm.addEventListener('submit', addUser);

if (usersTableBody) {
    usersTableBody.parentNode.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            deleteUser(event.target.dataset.id);
        }
    });
}