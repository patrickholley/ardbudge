import {store} from "@store";

class BaseService {
    private readonly baseURL: string;

    constructor(baseURLSuffix: string) {
        this.baseURL = (import.meta.env.VITE_DATABASE_URL || '') + baseURLSuffix;
    }

    private getHeaders = (): HeadersInit => ({
        'Authorization': `Bearer ${store.getCurrentUser()?.token}`,
        'Content-Type': 'application/json',
    })

    protected async get<T>(url: string, params?: Record<string, string>): Promise<T> {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        const response = await fetch(`${this.baseURL}${url}${queryString}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    protected async post<T>(url: string, body: any, params?: Record<string, string>): Promise<T> {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        const response = await fetch(`${this.baseURL}${url}${queryString}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    protected async put<T>(url: string, body: any): Promise<T> {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    protected async delete<T>(url: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed: ${errorText}`);
        }
        return await response.json() as Promise<T>;
    }
}

export default BaseService;
