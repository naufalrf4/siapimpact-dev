import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light';

const applyTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

export function initializeTheme() {
    applyTheme();
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback(() => {
        setAppearance('light');
        applyTheme();
    }, []);

    useEffect(() => {
        applyTheme();
    }, []);

    return { appearance, updateAppearance } as const;
}
