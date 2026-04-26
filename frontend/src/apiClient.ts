import { API_BASE_URL } from "./config";
import type { ApiError } from "./dtos";

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000);
    options.signal = controller.signal;
    options.cache = 'no-store';

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, options);
        if (response.status === 204) return null as unknown as T;
        
        const rawText = await response.text();
        if (response.ok) return rawText ? JSON.parse(rawText) : (null as unknown as T);

       let payload = null;
        try {
            if (rawText) payload = JSON.parse(rawText);
        } catch (parseError) {
            console.error("Помилка парсингу відповіді сервера", parseError);
        }
        throw {
            status: response.status,
            message: payload?.message ?? "Помилка сервера",
            details: payload?.error ?? rawText,
            errors: payload?.details
        } as ApiError;
    } catch (e: any) {
        if (e.name === "AbortError") throw { status: 408, message: "Таймаут запиту" } as ApiError;
        if (e.status) throw e;
        throw { status: 0, message: "Помилка мережі або CORS", details: e.message } as ApiError;
    } finally {
        clearTimeout(id);
    }
}