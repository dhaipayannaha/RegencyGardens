const API_BASE_URL = process.env.BACKEND_API_URL || 'https://regency-gardens-1.onrender.com/api/v1';

type FetchOptions = RequestInit & {
    params?: Record<string, string | number | undefined>;
};

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    let url = `${API_BASE_URL}${endpoint}`;

    if (params) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) query.append(key, String(value));
        });
        const queryString = query.toString();
        if (queryString) url += `?${queryString}`;
    }

    const response = await fetch(url, {
        ...fetchOptions,
        credentials: 'include', // sends httpOnly cookies (accessToken/refreshToken)
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export const api = {
    get: <T>(endpoint: string, params?: FetchOptions['params']) =>
        apiFetch<T>(endpoint, { method: 'GET', params }),

    post: <T>(endpoint: string, body?: unknown) =>
        apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

    patch: <T>(endpoint: string, body?: unknown) =>
        apiFetch<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

    delete: <T>(endpoint: string) =>
        apiFetch<T>(endpoint, { method: 'DELETE' }),
};