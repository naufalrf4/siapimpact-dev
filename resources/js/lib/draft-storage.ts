/**
 * Draft Storage Management with Encryption
 * Stores form drafts in encrypted format in localStorage
 */

const DRAFT_KEY = 'siap_impact_draft';
const ENCRYPTION_KEY = 'siap_impact_2026_secret';

// Simple encryption/decryption using base64 and character rotation
function encrypt(text: string): string {
    const rotated = text
        .split('')
        .map((char) => String.fromCharCode(char.charCodeAt(0) + 5))
        .join('');
    return btoa(rotated);
}

function decrypt(encoded: string): string {
    try {
        const rotated = atob(encoded);
        return rotated
            .split('')
            .map((char) => String.fromCharCode(char.charCodeAt(0) - 5))
            .join('');
    } catch {
        return '';
    }
}

export interface DraftData {
    full_name?: string;
    national_id?: string;
    birth_place?: string;
    birth_date?: string;
    phone?: string;
    email?: string;
    domicile?: string;
    university?: string;
    study_program?: string;
    semester?: string;
    gpa?: string;
    savedAt?: number;
}

export function saveDraft(data: DraftData): void {
    try {
        const draftWithTimestamp = {
            ...data,
            savedAt: Date.now(),
        };
        const jsonString = JSON.stringify(draftWithTimestamp);
        const encrypted = encrypt(jsonString);
        localStorage.setItem(DRAFT_KEY, encrypted);
    } catch (error) {
        console.error('Failed to save draft:', error);
    }
}

export function loadDraft(): DraftData | null {
    try {
        const encrypted = localStorage.getItem(DRAFT_KEY);
        if (!encrypted) return null;
        const decrypted = decrypt(encrypted);
        if (!decrypted) return null;
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Failed to load draft:', error);
        return null;
    }
}

export function clearDraft(): void {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
        console.error('Failed to clear draft:', error);
    }
}

export function hasDraft(): boolean {
    try {
        const encrypted = localStorage.getItem(DRAFT_KEY);
        return encrypted !== null && encrypted.length > 0;
    } catch {
        return false;
    }
}

export function getDraftTimestamp(): Date | null {
    try {
        const draft = loadDraft();
        if (draft?.savedAt) {
            return new Date(draft.savedAt);
        }
        return null;
    } catch {
        return null;
    }
}
