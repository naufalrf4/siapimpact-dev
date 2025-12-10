/**
 * Real-time Form Validation
 * Provides validation rules for registration form fields
 */

export interface ValidationError {
    field: string;
    message: string;
    type: 'error' | 'warning';
}

export const validationRules = {
    full_name: (value: string): ValidationError | null => {
        if (!value) return { field: 'full_name', message: 'Nama wajib diisi', type: 'error' };
        if (value.length < 3) {
            return { field: 'full_name', message: 'Nama minimal 3 karakter', type: 'warning' };
        }
        if (value.length > 100) {
            return { field: 'full_name', message: 'Nama maksimal 100 karakter', type: 'error' };
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            return { field: 'full_name', message: 'Nama hanya boleh berisi huruf, spasi, koma, dan apostrof', type: 'warning' };
        }
        return null;
    },

    national_id: (value: string): ValidationError | null => {
        if (!value) return { field: 'national_id', message: 'NIK wajib diisi', type: 'error' };
        if (!/^\d+$/.test(value)) {
            return { field: 'national_id', message: 'NIK hanya boleh berisi angka', type: 'warning' };
        }
        if (value.length !== 16) {
            return { field: 'national_id', message: 'NIK harus 16 digit', type: 'error' };
        }
        return null;
    },

    birth_place: (value: string): ValidationError | null => {
        if (!value) return { field: 'birth_place', message: 'Tempat lahir wajib diisi', type: 'error' };
        if (value.length < 2) {
            return { field: 'birth_place', message: 'Tempat lahir minimal 2 karakter', type: 'warning' };
        }
        return null;
    },

    birth_date: (value: string): ValidationError | null => {
        if (!value) return { field: 'birth_date', message: 'Tanggal lahir wajib diisi', type: 'error' };
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 17) {
            return { field: 'birth_date', message: 'Usia minimal 17 tahun', type: 'error' };
        }
        if (age > 50) {
            return { field: 'birth_date', message: 'Usia maksimal 50 tahun', type: 'warning' };
        }
        return null;
    },

    phone: (value: string): ValidationError | null => {
        if (!value) return { field: 'phone', message: 'Nomor handphone wajib diisi', type: 'error' };
        if (!/^(\+62|0)[0-9]{9,12}$/.test(value.replace(/\s/g, ''))) {
            return { field: 'phone', message: 'Format nomor handphone tidak valid (gunakan +62 atau 0)', type: 'warning' };
        }
        return null;
    },

    email: (value: string): ValidationError | null => {
        if (!value) return { field: 'email', message: 'Email wajib diisi', type: 'error' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { field: 'email', message: 'Format email tidak valid', type: 'warning' };
        }
        return null;
    },

    domicile: (value: string): ValidationError | null => {
        if (!value) return { field: 'domicile', message: 'Domisili wajib diisi', type: 'error' };
        if (value.length < 2) {
            return { field: 'domicile', message: 'Domisili minimal 2 karakter', type: 'warning' };
        }
        return null;
    },

    university: (value: string): ValidationError | null => {
        if (!value) return { field: 'university', message: 'Universitas wajib diisi', type: 'error' };
        if (value.length < 3) {
            return { field: 'university', message: 'Nama universitas minimal 3 karakter', type: 'warning' };
        }
        return null;
    },

    study_program: (value: string): ValidationError | null => {
        if (!value) return { field: 'study_program', message: 'Program studi wajib diisi', type: 'error' };
        if (value.length < 2) {
            return { field: 'study_program', message: 'Program studi minimal 2 karakter', type: 'warning' };
        }
        return null;
    },

    semester: (value: string): ValidationError | null => {
        if (!value) return { field: 'semester', message: 'Semester wajib dipilih', type: 'error' };
        const sem = parseInt(value);
        if (sem < 1 || sem > 14) {
            return { field: 'semester', message: 'Semester harus antara 1-14', type: 'error' };
        }
        return null;
    },

    gpa: (value: string): ValidationError | null => {
        if (!value) return { field: 'gpa', message: 'IPK wajib diisi', type: 'error' };
        const gpaNum = parseFloat(value);
        if (isNaN(gpaNum)) {
            return { field: 'gpa', message: 'IPK harus berupa angka', type: 'warning' };
        }
        if (gpaNum < 0 || gpaNum > 4) {
            return { field: 'gpa', message: 'IPK harus antara 0 - 4', type: 'error' };
        }
        return null;
    },
};

export function validateField(
    fieldName: keyof typeof validationRules,
    value: string,
): ValidationError | null {
    const validator = validationRules[fieldName];
    if (validator) {
        return validator(value);
    }
    return null;
}

export function validateAllFields(
    formData: Record<string, string>,
): ValidationError[] {
    const errors: ValidationError[] = [];
    
    (Object.keys(validationRules) as Array<keyof typeof validationRules>).forEach(
        (field) => {
            const value = formData[field] || '';
            const error = validateField(field, value);
            if (error) {
                errors.push(error);
            }
        },
    );

    return errors;
}
