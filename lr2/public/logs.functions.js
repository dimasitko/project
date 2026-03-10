const LOGS_API_URL = '/api/logs';

async function loadLogs() {
    try {
        const response = await fetch(LOGS_API_URL);
        if (response.ok) {
            const data = await response.json();
            renderLogsTable(data.items || []);
        }
    } catch (error) { console.error('Помилка:', error); }
}

function renderLogsTable(logs) {
    if (!logsTableBody) return;
    logsTableBody.innerHTML = logs.map(log => `
        <tr>
            <td>${new Date(log.timestamp).toLocaleString('uk-UA')}</td>
            <td>${log.action}</td>
        </tr>
    `).join('');
}

async function createLog(actionMessage) {
    try {
        await fetch(LOGS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: actionMessage })
        });
    } catch (error) { console.error('Помилка логування:', error); }
}