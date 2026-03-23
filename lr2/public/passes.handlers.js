submitBtn.addEventListener('click', addPass);
clearBtn.addEventListener('click', clearPassForm);
searchInput.addEventListener('input', loadPasses);
statusSearch.addEventListener('change', loadPasses);

if (passesTableBody) {
    passesTableBody.parentNode.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) deletePass(event.target.dataset.id);
        if (event.target.classList.contains('edit-btn')) editPass(event.target.dataset.id);
    });
}

if (nameInput) {
    nameInput.addEventListener('input', (e) => {
        updateUsersDatalist(e.target.value);
    });
}