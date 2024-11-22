class BaseService {
    private readonly baseURL: string;

    constructor(baseURLSuffix: string) {
        this.baseURL = (import.meta.env.VITE_DATABASE_URL || '') + baseURLSuffix;
        console.log(this.baseURL, import.meta.env.VITE_DATABASE_URL);
    }

    protected async get<T>(url: string, params?: Record<string, string>): Promise<T> {
        console.log(url, params);
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        console.log(queryString);
        const response = await fetch(`${this.baseURL}${url}${queryString}`);
        console.log(response);
        return this.handleResponse<T>(response);
    }

    protected async post<T>(url: string, body: any, params?: Record<string, string>): Promise<T> {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        const response = await fetch(`${this.baseURL}${url}${queryString}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    protected async put<T>(url: string, body: any): Promise<T> {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    protected async delete<T>(url: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${url}`, {
            method: 'DELETE',
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
