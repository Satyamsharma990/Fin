const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Get the stored auth token
 */
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

/**
 * Build headers with optional auth token
 */
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = { ...extra };
    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

/**
 * Generic API request helper
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const res = await fetch(url, {
        ...options,
        headers: authHeaders(options.headers as Record<string, string>),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// ─── Auth ────────────────────────────────────────────────────

export async function apiRegister(name: string, email: string, password: string) {
    return request<{ success: boolean; data: { id: string; name: string; email: string; token: string } }>(
        "/api/auth/register",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        }
    );
}

export async function apiLogin(email: string, password: string) {
    return request<{ success: boolean; data: { id: string; name: string; email: string; token: string } }>(
        "/api/auth/login",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        }
    );
}

export async function apiGetProfile() {
    return request<{ success: boolean; data: { id: string; name: string; email: string } }>(
        "/api/auth/profile"
    );
}

// ─── Upload ──────────────────────────────────────────────────

export async function apiUploadDocument(file: File, documentType: string) {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentType", documentType);

    const token = getToken();
    const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data as {
        success: boolean;
        data: { documentId: string; fileName: string; fileSize: string; documentType: string; status: string };
    };
}

// ─── Analysis ────────────────────────────────────────────────

export async function apiGetAnalysis(documentId: string) {
    return request<{ success: boolean; data: any }>(`/api/analysis/${documentId}`);
}

export async function apiGetInsuranceInsights(documentId: string) {
    return request<{ success: boolean; data: any }>(`/api/insurance/${documentId}`);
}

export async function apiGetLoanInsights(documentId: string) {
    return request<{ success: boolean; data: any }>(`/api/loan/${documentId}`);
}

// ─── Documents ───────────────────────────────────────────────

export async function apiGetDocuments() {
    return request<{
        success: boolean;
        count: number;
        data: Array<{
            id: string;
            name: string;
            type: string;
            uploadDate: string;
            status: string;
            fileSize: string;
        }>;
    }>("/api/documents");
}

export async function apiDeleteDocument(id: string) {
    return request<{ success: boolean; message: string }>(`/api/documents/${id}`, {
        method: "DELETE",
    });
}

export async function apiGetDashboardStats() {
    return request<{
        success: boolean;
        data: {
            documentsAnalyzed: number;
            hiddenChargesDetected: number;
            riskyClauses: number;
            moneySaved: number;
        };
    }>("/api/documents/stats");
}
