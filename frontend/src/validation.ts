export function clearFormErrors(formId: string) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    form.querySelectorAll('.error-text').forEach(el => el.textContent = '');
}

export function applyValidationErrors(errors: Array<{field: string, message: string}>, map: Record<string, { input: string, error: string }>) {
    errors.forEach(err => {
        const fieldConfig = map[err.field];
        if (fieldConfig) {
            document.getElementById(fieldConfig.input)?.classList.add('invalid');
            const errEl = document.getElementById(fieldConfig.error);
            if (errEl) errEl.textContent = err.message;
        }
    });
}