import { request } from "./apiClient";
import * as ui from "./ui";
import type { PassDto, UserDto, LogDto, ApiError } from "./dtos";

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target')!;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(target)?.classList.add('active');
        
        if (target === 'passes-view') loadPasses();
        if (target === 'users-view') loadUsers();
        if (target === 'logs-view') loadLogs();
    });
});

async function loadPasses() {
    ui.renderStatus("passes-view", "loading");
    try {
        const res = await request<{ data: PassDto[] }>("/passes/with-users");
        res.data.length ? ui.renderPasses(res.data) : ui.renderStatus("passes-view", "empty");
        if (res.data.length) ui.renderStatus("passes-view", "success");
    } catch (e) { 
        ui.renderStatus("passes-view", "error", e as ApiError); 
    }
}

async function loadUsers() {
    ui.renderStatus("users-view", "loading");
    try {
        const res = await request<{ items: UserDto[] }>("/users");
        res.items.length ? ui.renderUsers(res.items) : ui.renderStatus("users-view", "empty");
        if (res.items.length) ui.renderStatus("users-view", "success");
    } catch (e) { 
        ui.renderStatus("users-view", "error", e as ApiError); 
    }
}

async function loadLogs() {
    ui.renderStatus("logs-view", "loading");
    try {
        const res = await request<{ items: LogDto[] }>("/logs");
        res.items.length ? ui.renderLogs(res.items) : ui.renderStatus("logs-view", "empty");
        if (res.items.length) ui.renderStatus("logs-view", "success");
    } catch (e) { 
        ui.renderStatus("logs-view", "error", e as ApiError); 
    }
}

loadPasses();