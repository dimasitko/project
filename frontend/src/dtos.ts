export type Id = number;

export interface ApiError {
    status: number;
    message: string;
    details?: string;
    errors?: Array<{ field: string; message: string }>;
}

export interface UserDto {
    id: Id;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export interface PassDto {
    id: Id;
    status: string;
    date: string;
    comment: string;
    userName: string;
    userEmail: string;
    adminName: string;
    created_at: string;
}

export interface LogDto {
    id: Id;
    action: string;
    timestamp: string;
}