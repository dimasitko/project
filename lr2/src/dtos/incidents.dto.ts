export interface Pass {
    id: string;
    name: string;
    status: "Teacher" | "Student" | "Other";
    date: string;
    admin: string;
    comment: string;
}

export interface CreatePass{
    name: string;
    status: "Teacher" | "Student" | "Other";
    date: string;
    admin: string;
    comment?: string;
}

export interface UpdatePass {
    name: string;
    status: "Teacher" | "Student" | "Other";
    date: string;
    admin: string;
    comment?: string;
}

export interface PaginatedList<T> {
    items: T[];
    total: number;
}
