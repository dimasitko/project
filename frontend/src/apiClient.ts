import { API_BASE_URL } from "./config";
import type { ApiError } from "./dtos";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 6 * 60 * 1000;

export function clearCache() {
    cache.clear();
}

export async function request<T>(path: string, options: RequestInit = {}, retries = 2): Promise<T> {
    const method = options.method || "GET";
    const cacheKey = `${method}:${path}`;
    if (method === "GET" && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`Віддаємо з кешу: ${path}`);
            return cached.data as T;
        }
    }
    if (["POST", "PUT", "DELETE"].includes(method)) {
        clearCache();
    }

    let lastError: any;
    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000);
        options.signal = controller.signal;
        options.cache = 'no-store';

        try {
            const response = await fetch(`${API_BASE_URL}${path}`, options);
            clearTimeout(id);

            if (response.status === 204) return null as unknown as T;

            if (!response.ok && [429, 502, 503, 504].includes(response.status) && attempt < retries) {
                console.log(`Спроба ${attempt + 1} для ${path} через статус ${response.status}`);
                await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
                continue;
            }

            const rawText = await response.text();
            
            if (response.ok) {
                const parsedData = rawText ? JSON.parse(rawText) : (null as unknown as T);
                if (method === "GET") {
                    cache.set(cacheKey, { data: parsedData, timestamp: Date.now() });
                }
                return parsedData;
            }

            let payload = null;
            try { if (rawText) payload = JSON.parse(rawText); } catch (e) {}
            
            throw {
                status: response.status,
                message: payload?.message ?? "Помилка сервера",
                details: payload?.error ?? rawText,
                errors: payload?.details
            } as ApiError;

        } catch (e: any) {
            clearTimeout(id);
            if ((e.name === "AbortError" || e.status === 0 || !e.status) && attempt < retries) {
                 console.log(`Мережева помилка. Спроба ${attempt + 1}`);
                 await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
                 continue;
            }
            if (e.name === "AbortError") throw { status: 408, message: "Таймаут запиту" } as ApiError;
            if (e.status) throw e;
            throw { status: 0, message: "Помилка мережі або CORS", details: e.message } as ApiError;
        }
    }
    throw lastError;
}