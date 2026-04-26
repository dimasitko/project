import { request } from "./apiClient";
import * as ui from "./ui";
import { clearFormErrors, applyValidationErrors } from "./validation";
// ДОДАНО: імпорт UserDto, щоб знати, як виглядає користувач
import type { PassDto, UserDto, ApiError } from "./dtos"; 

let passesList: PassDto[] = [];
let editPassId: number | null = null;

const fieldMap: Record<string, { input: string, error: string }> = {
    userName: { input: 'nameInput', error: 'nameError' },
    userEmail: { input: 'emailInput', error: 'emailError' },
    status: { input: 'statusSelect', error: 'statusError' },
    date: { input: 'dateInput', error: 'dateError' },
    adminId: { input: 'adminInput', error: 'adminError' },
    comment: { input: 'commentInput', error: 'commentError' }
};

export async function loadPasses() {
    ui.renderStatus("passes-view", "loading");
    try {
        const res = await request<{ data: PassDto[] }>("/passes/with-users");
        passesList = res.data || [];
        filterAndRenderPasses();
    } catch (e) { ui.renderStatus("passes-view", "error", e as ApiError); }
}

function filterAndRenderPasses() {
    const searchVal = (document.getElementById('searchInput') as HTMLInputElement)?.value.toLowerCase() || '';
    const statusVal = (document.getElementById('statusSearch') as HTMLSelectElement)?.value || 'Всі';

    const filtered = passesList.filter(p => {
        const matchName = p.userName?.toLowerCase().includes(searchVal) || false;
        const matchStatus = statusVal === 'Всі' || p.status === statusVal;
        return matchName && matchStatus;
    });

    filtered.length ? ui.renderPasses(filtered) : ui.renderStatus("passes-view", "empty");
    if (filtered.length) ui.renderStatus("passes-view", "success");
}

async function loadAdminsForSelect() {
    try {
        const res = await request<any>("/users");

        let usersList: UserDto[] = [];
        if (Array.isArray(res)) usersList = res;
        else if (res.data && Array.isArray(res.data)) usersList = res.data;
        else if (res.items && Array.isArray(res.items)) usersList = res.items;

        const admins = usersList.filter(u => {
            if (!u.role) return false;
            const r = u.role.toLowerCase();
            return r.includes('адмін') || r.includes('admin') || r === 'адміністратор';
        });
        const select = document.getElementById('adminInput') as HTMLSelectElement;
        if (select) {
            select.innerHTML = '<option value="">Оберіть адміністратора...</option>';
            admins.forEach(admin => {
                const option = document.createElement('option');
                option.value = String(admin.id);
                option.textContent = admin.name;
                select.appendChild(option);
            });
        }
    } catch (e) {
        console.error("Помилка завантаження адмінів", e);
    }
}

export function initPasses() {
    loadAdminsForSelect(); 

    document.getElementById('searchInput')?.addEventListener('input', filterAndRenderPasses);
    document.getElementById('statusSearch')?.addEventListener('change', filterAndRenderPasses);

    document.getElementById('form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn') as HTMLButtonElement;
        btn.disabled = true;
        clearFormErrors('form');

        const payload = {
            userName: (document.getElementById('nameInput') as HTMLInputElement).value,
            userEmail: (document.getElementById('emailInput') as HTMLInputElement).value,
            status: (document.getElementById('statusSelect') as HTMLSelectElement).value,
            date: (document.getElementById('dateInput') as HTMLInputElement).value,
            adminId: Number((document.getElementById('adminInput') as HTMLSelectElement).value),
            comment: (document.getElementById('commentInput') as HTMLTextAreaElement).value
        };

        try {
            const url = editPassId ? `/passes/${editPassId}` : "/passes";
            const method = editPassId ? "PUT" : "POST";
            await request(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            editPassId = null;
            btn.textContent = 'Додати';
            (e.target as HTMLFormElement).reset();
            await loadPasses(); 
        } catch (err) {
            const error = err as ApiError;
            if (error.errors && error.errors.length > 0) {
                applyValidationErrors(error.errors, fieldMap);
            } else {
                alert(error.message);
            }
        } finally { 
            btn.disabled = false; 
        }
    });

    document.getElementById('passesTable')?.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const id = target.getAttribute('data-id');
        if (!id) return;

        if (target.classList.contains('delete-btn')) {
            const isConfirmed = await ui.showModal("Ви дійсно хочете видалити цей пропуск?", true);
            if (!isConfirmed) return;
            try {
                await request(`/passes/${id}`, { method: "DELETE" });
                await loadPasses();
            } catch (err) {
                await ui.showModal("Помилка видалення: " + (err as ApiError).message);
            }
        }
        if (target.classList.contains('edit-btn')) {
            const item = passesList.find(p => String(p.id) === id);
            if (item) {
                (document.getElementById('nameInput') as HTMLInputElement).value = item.userName || '';
                (document.getElementById('emailInput') as HTMLInputElement).value = item.userEmail || '';
                (document.getElementById('statusSelect') as HTMLSelectElement).value = item.status;
                (document.getElementById('adminInput') as HTMLSelectElement).value = String(item.admin_id || '');
                (document.getElementById('commentInput') as HTMLTextAreaElement).value = item.comment || '';
                editPassId = Number(id);
                (document.getElementById('submitBtn') as HTMLButtonElement).textContent = 'Зберегти';
            }
        }
    });
}