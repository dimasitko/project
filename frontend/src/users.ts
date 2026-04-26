import { request } from "./apiClient";
import * as ui from "./ui";
import { clearFormErrors, applyValidationErrors } from "./validation";
import type { UserDto, ApiError } from "./dtos";

let usersList: UserDto[] = [];
let editUserId: number | null = null;

const fieldMap: Record<string, { input: string, error: string }> = {
    name: { input: 'userNameInput', error: 'userNameError' },
    email: { input: 'userEmailInput', error: 'userEmailError' },
    role: { input: 'userRoleSelect', error: 'userRoleError' }
};

export async function loadUsers() {
    ui.renderStatus("users-view", "loading");
    try {
        const res = await request<{ data: UserDto[] }>("/users");
        usersList = res.data || [];
        filterAndRenderUsers();
    } catch (e) { ui.renderStatus("users-view", "error", e as ApiError); }
}

function filterAndRenderUsers() {
    const searchVal = (document.getElementById('userSearchInput') as HTMLInputElement)?.value.toLowerCase() || '';
    const roleVal = (document.getElementById('userRoleSearch') as HTMLSelectElement)?.value || 'Всі';
    const filtered = usersList.filter(u => (u.name?.toLowerCase().includes(searchVal)) && (roleVal === 'Всі' || u.role === roleVal));
    filtered.length ? ui.renderUsers(filtered) : ui.renderStatus("users-view", "empty");
    if (filtered.length) ui.renderStatus("users-view", "success");
}

export function initUsers() {
    document.getElementById('userSearchInput')?.addEventListener('input', filterAndRenderUsers);
    document.getElementById('userRoleSearch')?.addEventListener('change', filterAndRenderUsers);

    document.getElementById('userForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitUserBtn') as HTMLButtonElement;
        btn.disabled = true;
        clearFormErrors('userForm');

        const payload = {
            name: (document.getElementById('userNameInput') as HTMLInputElement).value,
            email: (document.getElementById('userEmailInput') as HTMLInputElement).value,
            role: (document.getElementById('userRoleSelect') as HTMLSelectElement).value
        };

        try {
            const url = editUserId ? `/users/${editUserId}` : "/users";
            const method = editUserId ? "PUT" : "POST";
            await request(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            editUserId = null;
            btn.textContent = 'Зберегти користувача';
            (e.target as HTMLFormElement).reset();
            await loadUsers();
        } catch (err) {
            const error = err as ApiError;
            if (error.errors) applyValidationErrors(error.errors, fieldMap);
        } finally { btn.disabled = false; }
    });

    document.getElementById('usersTable')?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-id');
    if (!id) return;
        if (target.classList.contains('delete-btn')) {
        const isConfirmed = await ui.showModal("Ви дійсно хочете видалити цього користувача?", true);
        if (!isConfirmed) return;

        try {
            const userToDelete = usersList.find(u => String(u.id) === String(id));
            if (!userToDelete) {
                await ui.showModal("Помилка: користувача не знайдено.");
                return;
            }

            const res = await request<any>("/passes/with-users");
            const passesList = res.data || res.items || res || [];
            
            const userPasses = passesList.filter((p: any) => 
                p.adminName === userToDelete.name || 
                p.userName === userToDelete.name
            );

            if (userPasses.length > 0) {
                const forceDelete = await ui.showModal(
                    `Користувач ${userToDelete.name} має ${userPasses.length} прив'язаних пропусків!\n\nВидалити його РАЗОМ із усіма його пропусками?`, 
                    true
                );
                
                if (!forceDelete) return; 

                for (const pass of userPasses) {
                    await request(`/passes/${pass.id}`, { method: "DELETE" });
                }
            }
            await request(`/users/${id}`, { method: "DELETE" });
            await loadUsers();

            if (userPasses.length > 0) {
                await ui.showModal("Користувача та всі його пропуски успішно видалено!");
            } else {
                await ui.showModal("Користувача успішно видалено.");
            }

        } catch (err) {
            await ui.showModal("Системна помилка: " + (err as ApiError).message);
        }
    }

    if (target.classList.contains('edit-btn')) {
        const user = usersList.find(u => String(u.id) === id);
        if (user) {
            (document.getElementById('userNameInput') as HTMLInputElement).value = user.name;
            (document.getElementById('userEmailInput') as HTMLInputElement).value = user.email;
            (document.getElementById('userRoleSelect') as HTMLSelectElement).value = user.role;
            editUserId = Number(id);
            (document.getElementById('submitUserBtn') as HTMLButtonElement).textContent = 'Зберегти зміни';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
}
