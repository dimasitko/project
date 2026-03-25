const logsTableBody = document.querySelector('#logsTable tbody');
const logSearchInput = document.getElementById('logSearchInput');

if (logSearchInput) {
    logSearchInput.addEventListener('input', (event) => {
        const searchText = event.target.value;

        loadLogs(searchText); 
    });
}