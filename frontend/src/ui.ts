import type { PassDto, UserDto, LogDto, ApiError } from "./dtos";

export function renderStatus(viewId: string, status: "loading" | "empty" | "error" | "success", err?: ApiError) {
    const container = document.querySelector(`#${viewId} .status-container`);
    const table = document.querySelector(`#${viewId} .table`);
    if (!container || !table) return;

    if (status === "loading") {
        container.innerHTML = "<b>⏳ Завантаження...</b>";
        (table as HTMLElement).style.display = "none";
    } else if (status === "error") {
        container.innerHTML = `<div style="color:#721c24; background:#f8d7da; padding:10px; border-radius:4px;">❌ ${err?.message} <br><small>${err?.details || ""}</small></div>`;
        (table as HTMLElement).style.display = "none";
    } else if (status === "empty") {
        container.innerHTML = "<i>📭 Даних поки немає</i>";
        (table as HTMLElement).style.display = "none";
    } else {
        container.innerHTML = "";
        (table as HTMLElement).style.display = "table";
    }
}

export function renderPasses(items: PassDto[]) {
    const tbody = document.querySelector("#passesTable tbody");
    if (!tbody) return;
    tbody.innerHTML = items.map(p => `
        <tr>
            <td>${p.userName}</td>
            <td>${p.status}</td>
            <td>${p.date}</td>
            <td>${p.adminName}</td>
            <td>${p.comment || ''}</td>
            <td>
                <div class="btn-group">
                    <button class="delete-btn" data-id="${p.id}">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
}

export function renderUsers(items: UserDto[]) {
    const tbody = document.querySelector("#usersTable tbody");
    if (!tbody) return;
    tbody.innerHTML = items.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.role}</td>
            <td>${u.email}</td>
            <td>
                <div class="btn-group">
                    <button class="delete-btn" data-id="${u.id}">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
}

export function renderLogs(items: LogDto[]) {
    const tbody = document.querySelector("#logsTable tbody");
    if (!tbody) return;
    tbody.innerHTML = items.map(l => `
        <tr>
            <td>${new Date(l.timestamp).toLocaleString('uk-UA')}</td>
            <td>${l.action}</td>
        </tr>
    `).join("");
}