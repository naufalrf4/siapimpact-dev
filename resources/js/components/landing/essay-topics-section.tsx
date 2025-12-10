import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import { essayTopics, essayTopicsHeading } from '@/lib/landing-data';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { EssayTopicCard } from './essay-topic-card';

interface EssayTopicsSectionProps {
    id?: string;
    className?: string;
    onTopicClick?: (topicId: string) => void;
}

export function EssayTopicsSection({
    id = 'essay-topics',
    className,
    onTopicClick,
}: EssayTopicsSectionProps) {
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

    const handleTopicClick = (topicId: string) => {
        if (onTopicClick) {
            onTopicClick(topicId);
        } else {
            const guidelinesSection =
                document.getElementById('essay-guidelines');
            if (guidelinesSection) {
                guidelinesSection.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                });
            }
        }
    };

    return (
        <section
            ref={sectionRef}
            id={id}
            className={cn('bg-muted/30 px-4 py-20 sm:px-6 lg:px-8', className)}
        >
            <div className="mx-auto max-w-6xl">
                <h2
                    className={cn(
                        'mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl',
                        !prefersReducedMotion && 'scroll-animate-fade-up',
                        isVisible && 'scroll-animate-visible',
                    )}
                >
                    {essayTopicsHeading}
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {essayTopics.map((topic, index) => (
                        <EssayTopicCard
                            key={topic.id}
                            topic={topic}
                            index={index}
                            onClick={() => handleTopicClick(topic.id)}
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

export default EssayTopicsSection;
