import { request } from "./apiClient";
import * as ui from "./ui";
import { clearFormErrors, applyValidationErrors } from "./validation";
import type { PassDto, UserDto, ApiError } from "./dtos";
import { createLog } from "./logs";

let passesList: PassDto[] = [];
let availableAdmins: UserDto[] = [];
let selectedAdminId: number | null = null;
let editPassId: number | null = null;

const fieldMap: Record<string, { input: string, error: string }> = {
    name: { input: 'nameInput', error: 'nameError' },
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

        availableAdmins = usersList.filter(u => {
            if (!u.role) return false;
            const r = u.role.toLowerCase();
            return r.includes('адмін') || r.includes('admin') || r === 'адміністратор';
        });

        const input = document.getElementById('adminInput') as HTMLInputElement;
        const list = document.getElementById('adminOptionsList');
        const wrapper = document.getElementById('adminSelectWrapper');

        if (!input || !list) return;
        
        const renderOptions = (filterText: string) => {
            list.innerHTML = '';
            const filtered = availableAdmins.filter(a => 
                a.name.toLowerCase().includes(filterText.toLowerCase())
            );

            if (filtered.length === 0) {
                list.innerHTML = '<li class="no-results">Нікого не знайдено</li>';
                return;
            }

            filtered.forEach(admin => {
                const li = document.createElement('li');
                li.textContent = admin.name;
                li.addEventListener('click', () => {
                    input.value = admin.name; 
                    selectedAdminId = Number(admin.id); 
                    list.classList.remove('active'); 
                });
                list.appendChild(li);
            });
        };

        input.addEventListener('focus', () => {
            renderOptions(input.value);
            list.classList.add('active');
        });

        input.addEventListener('input', (e) => {
            selectedAdminId = null;
            renderOptions((e.target as HTMLInputElement).value);
            list.classList.add('active');
        });

        document.addEventListener('click', (e) => {
            if (wrapper && !wrapper.contains(e.target as Node)) {
                list.classList.remove('active');
            }
        });

    } catch (e) {
        console.error("Помилка завантаження адмінів", e);
    }
}
export function clearForm() {
    try {
        (document.getElementById('form') as HTMLFormElement).reset();
        (document.getElementById('submitBtn') as HTMLButtonElement).textContent = 'Додати';
        editPassId = null;
        clearFormErrors('form');
    }
catch (e) {
    console.error("Помилка очищення форми пропусків", e);
}
}

document.getElementById('clearBtn')?.addEventListener('click', clearForm);

export function initPasses() {
    loadAdminsForSelect(); 

    document.getElementById('searchInput')?.addEventListener('input', filterAndRenderPasses);
    document.getElementById('statusSearch')?.addEventListener('change', filterAndRenderPasses);

    document.getElementById('form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn') as HTMLButtonElement;
        btn.disabled = true;
        clearFormErrors('form');

        const adminInputValue = (document.getElementById('adminInput') as HTMLInputElement).value;
        const selectedAdmin = availableAdmins.find(a => a.name === adminInputValue);
        const finalAdminId = selectedAdmin ? Number(selectedAdmin.id) : null;

        const payload = {
            userName: (document.getElementById('nameInput') as HTMLInputElement).value,
            userEmail: (document.getElementById('emailInput') as HTMLInputElement).value,
            status: (document.getElementById('statusSelect') as HTMLSelectElement).value,
            date: (document.getElementById('dateInput') as HTMLInputElement).value,
            adminId: finalAdminId,
            comment: (document.getElementById('commentInput') as HTMLTextAreaElement).value
        };

        const localErrors: any[] = [];
        
        if (!payload.userName || payload.userName.length < 3) {
            localErrors.push({ field: "name", message: "Мінімум 3 символи" });
        }
        if (payload.userName.length > 40) {
            localErrors.push({ field: "name", message: "Максимум 40 символів" });
        }
        if (!payload.userEmail || !payload.userEmail.includes("@") || payload.userEmail.length < 8) {
            localErrors.push({ field: "userEmail", message: "Коректний email (мін. 8 символів)" });
        }
        if(!payload.status) {
            localErrors.push({ field: "status", message: "Оберіть причину" });
        }
        if (!payload.date) {
            localErrors.push({ field: "date", message: "Оберіть дату" });
        } else {
            const today = new Date().toISOString().split('T')[0];
            if (payload.date < today) {
                localErrors.push({ field: "date", message: "Дата не може бути в минулому" });
            }
        }
        if (!payload.adminId || isNaN(payload.adminId)) {
            localErrors.push({ field: "adminId", message: "Оберіть адміністратора зі списку" });
        }
        if (payload.comment.length > 35) {
            localErrors.push({ field: "comment", message: "Максимум 35 символів" });
        }
        if (localErrors.length > 0) {
            applyValidationErrors(localErrors, fieldMap);
            btn.disabled = false;
            return;
        }

        try {
            const url = editPassId ? `/passes/${editPassId}` : "/passes";
            const method = editPassId ? "PUT" : "POST";
            await request(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const actionWord = editPassId ? "оновив" : "додав";
            const adminName = adminInputValue || "Невідомий адміністратор";
            await createLog(`Адміністратор ${adminName} ${actionWord} пропуск користувача ${payload.userName}`);
            
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
                const passToDelete = passesList.find(p => String(p.id) === id);
                const userName = passToDelete ? passToDelete.userName : "Невідомий користувач";

                await request(`/passes/${id}`, { method: "DELETE" });
                await createLog(`Видалено пропуск користувача ${userName}`);
                
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
                (document.getElementById('adminInput') as HTMLInputElement).value = item.adminName || '';
                (document.getElementById('commentInput') as HTMLTextAreaElement).value = item.comment || '';
                editPassId = Number(id);
                (document.getElementById('submitBtn') as HTMLButtonElement).textContent = 'Зберегти';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}