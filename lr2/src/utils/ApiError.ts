export interface ValidationErrorDetail {
    field: string;
    message: string;
}
 
class ApiError extends Error {
    status: number;
    code: string;
    details: ValidationErrorDetail[] | null;
 
    constructor(
        status: number,
        code: string,
        message: string,
        details: ValidationErrorDetail[] | null = null
    ) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
 
export default ApiError;
