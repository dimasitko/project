import { request } from "./apiClient";
import * as ui from "./ui";
import type { LogDto, ApiError } from "./dtos";

let logsList: LogDto[] = [];

export async function loadLogs() {
    ui.renderStatus("logs-view", "loading");
    try {
        const res = await request<{ data: LogDto[] }>("/logs");
        logsList = res.data || [];
        filterAndRenderLogs();
    } catch (e) { ui.renderStatus("logs-view", "error", e as ApiError); }
}

function filterAndRenderLogs() {
    const searchVal = (document.getElementById('logSearchInput') as HTMLInputElement)?.value.toLowerCase() || '';
    const filtered = logsList.filter(l => l.action?.toLowerCase().includes(searchVal));
    filtered.length ? ui.renderLogs(filtered) : ui.renderStatus("logs-view", "empty");
    if (filtered.length) ui.renderStatus("logs-view", "success");
}

export function initLogs() {
    document.getElementById('logSearchInput')?.addEventListener('input', filterAndRenderLogs);
}