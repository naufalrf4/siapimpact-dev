import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import { selectionStages, selectionStagesHeading } from '@/lib/landing-data';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface SelectionStagesSectionProps {
    id?: string;
    className?: string;
}

export function SelectionStagesSection({
    id,
    className,
}: SelectionStagesSectionProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const element = sectionRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setHasIntersected(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    const isVisible = prefersReducedMotion || hasIntersected;

    const scrollToEssayGuidelines = () => {
        const essayGuidelinesSection =
            document.getElementById('essay-guidelines');
        if (essayGuidelinesSection) {
            const navbarHeight = 80;
            const elementPosition =
                essayGuidelinesSection.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.scrollY - navbarHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
        }
    };

    return (
        <section
            ref={sectionRef}
            id={id}
            className={cn('bg-muted/30 px-4 py-20 sm:px-6 lg:px-8', className)}
        >
            <div className="mx-auto max-w-5xl">
                <h2
                    className={cn(
                        'mb-16 text-center text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl',
                        !prefersReducedMotion && 'scroll-animate-fade-up',
                        isVisible && 'scroll-animate-visible',
                    )}
                >
                    {selectionStagesHeading}
                </h2>

                {/* Desktop Timeline - Horizontal */}
                <div className="hidden md:block">
                    <div className="relative">
                        {/* Timeline line - positioned at center of circles */}
                        <div
                            className={cn(
                                'absolute top-7 right-0 left-0 h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent',
                                !prefersReducedMotion && 'scroll-animate-fade',
                                isVisible && 'scroll-animate-visible',
                            )}
                            style={
                                !prefersReducedMotion
                                    ? { animationDelay: '200ms' }
                                    : undefined
                            }
                        />

                        {/* Stage items - grid layout for equal spacing */}
                        <div className="relative grid grid-cols-4 gap-6">
                            {selectionStages.map((stage, index) => (
                                <div
                                    key={stage.id}
                                    className={cn(
                                        'group flex flex-col items-center',
                                        !prefersReducedMotion &&
                                            'scroll-animate-scale',
                                        isVisible && 'scroll-animate-visible',
                                    )}
                                    style={
                                        !prefersReducedMotion
                                            ? {
                                                  animationDelay: `${(index + 1) * 100}ms`,
                                              }
                                            : undefined
                                    }
                                >
                                    {/* Circle with number - clickable */}
                                    <button
                                        onClick={scrollToEssayGuidelines}
                                        className={cn(
                                            'relative z-10 flex h-14 w-14 items-center justify-center rounded-full',
                                            'bg-primary text-lg font-bold text-primary-foreground',
                                            'shadow-lg ring-4 ring-background',
                                            'cursor-pointer transition-all duration-200 ease-out',
                                            'hover:scale-110 hover:shadow-xl hover:ring-primary/30',
                                            'active:scale-100 active:shadow-lg',
                                            'focus:ring-primary/50 focus:outline-none',
                                        )}
                                        aria-label={`Tahap ${stage.id}: ${stage.title} - Klik untuk melihat panduan esai`}
                                    >
                                        {stage.id}
                                    </button>

                                    {/* Title and description below */}
                                    <div className="mt-6 px-1 text-center">
                                        <h3 className="mb-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                                            {stage.title}
                                        </h3>
                                        {stage.description && (
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {stage.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Timeline - Vertical */}
                <div className="md:hidden">
                    <div className="relative">
                        {/* Vertical timeline line */}
                        <div
                            className={cn(
                                'absolute top-0 bottom-0 left-6 w-0.5 rounded-full bg-gradient-to-b from-primary via-secondary to-accent',
                                !prefersReducedMotion && 'scroll-animate-fade',
                                isVisible && 'scroll-animate-visible',
                            )}
                            style={
                                !prefersReducedMotion
                                    ? { animationDelay: '200ms' }
                                    : undefined
                            }
                        />

                        {/* Stage items */}
                        <div className="space-y-8">
                            {selectionStages.map((stage, index) => (
                                <div
                                    key={stage.id}
                                    className={cn(
                                        'group relative flex items-start gap-6',
                                        !prefersReducedMotion &&
                                            'scroll-animate-slide-left',
                                        isVisible && 'scroll-animate-visible',
                                    )}
                                    style={
                                        !prefersReducedMotion
                                            ? {
                                                  animationDelay: `${(index + 1) * 100}ms`,
                                              }
                                            : undefined
                                    }
                                >
                                    {/* Circle with number - clickable */}
                                    <button
                                        onClick={scrollToEssayGuidelines}
                                        className={cn(
                                            'relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                                            'bg-primary text-lg font-bold text-primary-foreground',
                                            'shadow-lg ring-4 ring-background',
                                            'cursor-pointer transition-all duration-200 ease-out',
                                            'hover:scale-110 hover:shadow-xl hover:ring-primary/30',
                                            'active:scale-100 active:shadow-lg',
                                            'focus:ring-primary/50 focus:outline-none',
                                        )}
                                        aria-label={`Tahap ${stage.id}: ${stage.title} - Klik untuk melihat panduan esai`}
                                    >
                                        {stage.id}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <h3 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                                            {stage.title}
                                        </h3>
                                        {stage.description && (
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {stage.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SelectionStagesSection;
