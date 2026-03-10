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
    logsTableBody.innerHTML = logs.map(log => {
        const date = new Date(log.time);
        const formattedDate = date.toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
    });
       return `
            <tr>
                <td>${formattedDate}</td>
                <td>${log.action}</td>
            </tr>
        `;
    }).join('');
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