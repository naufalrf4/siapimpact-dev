import { Button } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/use-scroll-animation';
import { finalCtaContent } from '@/lib/landing-data';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FinalCTASectionProps {
    className?: string;
}

export function FinalCTASection({ className }: FinalCTASectionProps) {
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
            className={cn(
                'relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8',
                'bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10',
                className,
            )}
        >
            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
                <div
                    className={cn(
                        'mb-6 flex justify-center',
                        !prefersReducedMotion && 'scroll-animate-fade-up',
                        isVisible && 'scroll-animate-visible',
                    )}
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                </div>

                <h2
                    className={cn(
                        'mb-6 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl',
                        !prefersReducedMotion && 'scroll-animate-fade-up',
                        isVisible && 'scroll-animate-visible',
                    )}
                    style={
                        !prefersReducedMotion
                            ? { animationDelay: '50ms' }
                            : undefined
                    }
                >
                    {finalCtaContent.heading}
                </h2>

                <p
                    className={cn(
                        'mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl',
                        !prefersReducedMotion && 'scroll-animate-fade-up',
                        isVisible && 'scroll-animate-visible',
                    )}
                    style={
                        !prefersReducedMotion
                            ? { animationDelay: '100ms' }
                            : undefined
                    }
                >
                    {finalCtaContent.motivationalCopy}
                </p>

                <div
                    className={cn(
                        !prefersReducedMotion && 'scroll-animate-scale',
                        isVisible && 'scroll-animate-visible',
                    )}
                    style={
                        !prefersReducedMotion
                            ? { animationDelay: '200ms' }
                            : undefined
                    }
                >
                    <Button
                        asChild
                        size="lg"
                        className="group bg-gradient-to-r from-primary to-primary/90 px-8 py-6 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:text-lg"
                    >
                        <Link href={finalCtaContent.ctaButton.href}>
                            {finalCtaContent.ctaButton.text}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default FinalCTASection;
