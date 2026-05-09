import type { PassDto, UserDto, LogDto, ApiError } from "./dtos";

export function renderStatus(viewId: string, status: "loading" | "empty" | "error" | "success", err?: ApiError) {
    const container = document.querySelector(`#${viewId} .status-container`);
    const table = document.querySelector(`#${viewId} .table`);
    if (!container || !table) return;

    if (status === "loading") {
        container.innerHTML = "<b> Завантаження...</b>";
        (table as HTMLElement).style.display = "none";
    } else if (status === "error") {
        container.innerHTML = `<div style="color:#721c24; background:#f8d7da; padding:10px; border-radius:4px;"> ${err?.message} <br><small>${err?.details || ""}</small></div>`;
        (table as HTMLElement).style.display = "none";
    } else if (status === "empty") {
        container.innerHTML = "<i> Даних поки немає</i>";
        (table as HTMLElement).style.display = "none";
    } else {
        container.innerHTML = "";
        (table as HTMLElement).style.display = "table";
    }
}

export function renderPasses(items: PassDto[]) {
    const tbody = document.querySelector("#passesTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    items.forEach(p => {
        const tr = document.createElement("tr");
        const cells = [
            p.userName,
            p.status,
            new Date(p.date).toLocaleDateString('uk-UA'),
            p.adminName,
            p.comment
        ];
        cells.forEach(text => {
            const td = document.createElement("td");
            td.textContent = String(text);
            tr.appendChild(td);
        });

        const actionTd = document.createElement("td");
        actionTd.innerHTML = `
            <div class="btn-group">
                <button class="edit-btn" data-id="${p.id}" type="button">Редагувати</button>
                <button class="delete-btn" data-id="${p.id}" type="button">Видалити</button>
            </div>
        `;
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}

export function renderUsers(items: UserDto[]) {
    const tbody = document.querySelector("#usersTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    items.forEach(u => {
        const tr = document.createElement("tr");
        const cells = [
            u.name,
            u.email,
            u.role,
        ];
        cells.forEach(text => {
            const td = document.createElement("td");
            td.textContent = String(text);
            tr.appendChild(td);
        });

        const actionTd = document.createElement("td");
        actionTd.innerHTML = `
            <div class="btn-group">
                <button class="edit-btn" data-id="${u.id}" type="button">Редагувати</button>
                <button class="delete-btn" data-id="${u.id}" type="button">Видалити</button>
            </div>
        `;
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}

export function renderLogs(items: LogDto[]) {
    const tbody = document.querySelector("#logsTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    items.forEach(l => {
        const tr = document.createElement("tr");
        const cells = [
            new Date(l.timestamp).toLocaleDateString('uk-UA'),
            l.action,
        ];
        cells.forEach(text => {
            const td = document.createElement("td");
            td.textContent = String(text);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

export function showModal(message: string, isConfirm: boolean = false): Promise<boolean> {
    return new Promise((resolve) => {
        const modal = document.getElementById('customModal');
        const textEl = document.getElementById('modalText');
        const btnOk = document.getElementById('modalOk');
        const btnCancel = document.getElementById('modalCancel');

        if (!modal || !textEl || !btnOk || !btnCancel) return resolve(false);

        textEl.innerText = message;

        if (isConfirm) btnCancel.classList.remove('hidden');
        else btnCancel.classList.add('hidden');

        modal.classList.add('active'); 

        const cleanup = () => {
            modal.classList.remove('active');
            btnOk.replaceWith(btnOk.cloneNode(true));
            btnCancel.replaceWith(btnCancel.cloneNode(true));
        };
        document.getElementById('modalOk')?.addEventListener('click', () => { cleanup(); resolve(true); });
        document.getElementById('modalCancel')?.addEventListener('click', () => { cleanup(); resolve(false); });
    });
}