import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import {
    useEffect,
    useRef,
    useState,
    type HTMLAttributes,
    type ReactNode,
} from 'react';

type AnimationType =
    | 'fade-up'
    | 'fade'
    | 'slide-left'
    | 'slide-right'
    | 'scale'
    | 'slide-up-bounce'
    | 'zoom'
    | 'blur';

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    animation?: AnimationType;
    delay?: number;
    as?: 'section' | 'div';
    threshold?: number;
}

export function AnimatedSection({
    children,
    animation = 'fade-up',
    delay = 0,
    as = 'section',
    threshold = 0.1,
    className,
    style,
    ...props
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement | HTMLElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        setTimeout(() => setHasIntersected(true), delay);
                    } else {
                        setHasIntersected(true);
                    }
                    observer.disconnect();
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -50px 0px',
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, delay, prefersReducedMotion]);

    const isVisible = prefersReducedMotion || hasIntersected;

    const getAnimationClass = () => {
        switch (animation) {
            case 'fade-up':
                return 'scroll-animate-fade-up';
            case 'slide-up-bounce':
                return 'scroll-animate-slide-up-bounce';
            case 'zoom':
                return 'scroll-animate-zoom';
            case 'blur':
                return 'scroll-animate-blur';
            default:
                return `scroll-animate-${animation}`;
        }
    };

    const animationClass = getAnimationClass();
    const visibleClass = isVisible ? 'scroll-animate-visible' : '';

    const combinedStyle: React.CSSProperties = {
        ...style,
        ...(delay > 0 && !prefersReducedMotion
            ? { animationDelay: `${delay}ms` }
            : {}),
    };

    const sharedProps = {
        className: cn(animationClass, visibleClass, className),
        style: combinedStyle,
        ...props,
    };

    if (as === 'section') {
        return (
            <section ref={ref as React.RefObject<HTMLElement>} {...sharedProps}>
                {children}
            </section>
        );
    }

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} {...sharedProps}>
            {children}
        </div>
    );
}

interface AnimatedItemProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    animation?: AnimationType;
    index?: number;
    baseDelay?: number;
    delay?: number;
}

export function AnimatedItem({
    children,
    animation = 'fade-up',
    index = 0,
    baseDelay = 100,
    delay = 0,
    className,
    style,
    ...props
}: AnimatedItemProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    const totalDelay = delay + index * baseDelay;
                    if (totalDelay > 0) {
                        setTimeout(() => setHasIntersected(true), totalDelay);
                    } else {
                        setHasIntersected(true);
                    }
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -30px 0px',
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [index, baseDelay, delay, prefersReducedMotion]);

    const isVisible = prefersReducedMotion || hasIntersected;

    const getAnimationClass = () => {
        switch (animation) {
            case 'fade-up':
                return 'scroll-animate-fade-up';
            case 'slide-up-bounce':
                return 'scroll-animate-slide-up-bounce';
            case 'zoom':
                return 'scroll-animate-zoom';
            case 'blur':
                return 'scroll-animate-blur';
            default:
                return `scroll-animate-${animation}`;
        }
    };

    const animationClass = getAnimationClass();
    const visibleClass = isVisible ? 'scroll-animate-visible' : '';

    const totalDelay = delay + index * baseDelay;
    const combinedStyle: React.CSSProperties = {
        ...style,
        ...(totalDelay > 0 && !prefersReducedMotion
            ? { animationDelay: `${totalDelay}ms` }
            : {}),
    };

    return (
        <div
            ref={ref}
            className={cn(animationClass, visibleClass, className)}
            style={combinedStyle}
            {...props}
        >
            {children}
        </div>
    );
}

export default AnimatedSection;
