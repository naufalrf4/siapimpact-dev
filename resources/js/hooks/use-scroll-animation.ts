import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';

function usePrefersReducedMotion(): boolean {
    const getSnapshot = () => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    const getServerSnapshot = () => false;

    const subscribe = (callback: () => void) => {
        if (typeof window === 'undefined') return () => {};
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        mediaQuery.addEventListener('change', callback);
        return () => mediaQuery.removeEventListener('change', callback);
    };

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    delay?: number;
}

interface UseScrollAnimationReturn {
    ref: React.RefObject<HTMLElement | null>;
    isVisible: boolean;
    hasAnimated: boolean;
    prefersReducedMotion: boolean;
}

export function useScrollAnimation(
    options: UseScrollAnimationOptions = {},
): UseScrollAnimationReturn {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        triggerOnce = true,
        delay = 0,
    } = options;

    const ref = useRef<HTMLElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    const [hasIntersected, setHasIntersected] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (entry.isIntersecting) {
                if (delay > 0) {
                    setTimeout(() => {
                        setHasIntersected(true);
                        setHasAnimated(true);
                    }, delay);
                } else {
                    setHasIntersected(true);
                    setHasAnimated(true);
                }
            } else if (!triggerOnce) {
                setHasIntersected(false);
            }
        },
        [delay, triggerOnce],
    );

    useEffect(() => {
        if (prefersReducedMotion) return;

        const element = ref.current;
        if (!element) return;

        if (triggerOnce && hasAnimated) return;

        const observer = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin,
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [
        threshold,
        rootMargin,
        triggerOnce,
        hasAnimated,
        prefersReducedMotion,
        handleIntersection,
    ]);

    const isVisible = prefersReducedMotion || hasIntersected;

    return {
        ref,
        isVisible,
        hasAnimated: prefersReducedMotion || hasAnimated,
        prefersReducedMotion,
    };
}

export function useStaggeredAnimation(
    baseDelay: number = 100,
    options: Omit<UseScrollAnimationOptions, 'delay'> = {},
) {
    const containerRef = useRef<HTMLElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setHasIntersected(true);
                }
            },
            {
                threshold: options.threshold ?? 0.1,
                rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin, prefersReducedMotion]);

    const isContainerVisible = prefersReducedMotion || hasIntersected;

    const getItemDelay = (index: number): number => {
        if (prefersReducedMotion) return 0;
        return index * baseDelay;
    };

    const getItemStyle = (index: number): React.CSSProperties => {
        if (prefersReducedMotion) {
            return { opacity: 1, transform: 'none' };
        }

        return {
            animationDelay: `${getItemDelay(index)}ms`,
        };
    };

    return {
        containerRef,
        isContainerVisible,
        getItemDelay,
        getItemStyle,
        prefersReducedMotion,
    };
}

export { usePrefersReducedMotion };

export default useScrollAnimation;
