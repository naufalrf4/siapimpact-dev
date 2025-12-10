import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import {
    programObjectives,
    programObjectivesHeading,
} from '@/lib/landing-data';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ObjectiveCard } from './objective-card';

interface ProgramObjectivesSectionProps {
    id?: string;
    className?: string;
}

export function ProgramObjectivesSection({
    id,
    className,
}: ProgramObjectivesSectionProps) {
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

    return (
        <section
            ref={sectionRef}
            id={id}
            className={cn('px-4 py-20 sm:px-6 lg:px-8', className)}
        >
            <div className="mx-auto max-w-6xl">
                <h2
                    className={cn(
                        'mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl',
                        !prefersReducedMotion && 'scroll-animate-fade-up',
                        isVisible && 'scroll-animate-visible',
                    )}
                >
                    {programObjectivesHeading}
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                    {programObjectives.map((objective, index) => (
                        <ObjectiveCard
                            key={objective.id}
                            title={objective.title}
                            index={index}
                            className={cn(
                                !prefersReducedMotion &&
                                    'scroll-animate-slide-up-bounce',
                                isVisible && 'scroll-animate-visible',
                            )}
                            style={
                                !prefersReducedMotion
                                    ? {
                                          animationDelay: `${(index + 1) * 75}ms`,
                                      }
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProgramObjectivesSection;
